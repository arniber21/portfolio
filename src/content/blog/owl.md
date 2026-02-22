---
title: 'Owl: Runtime Verification for Distributed Gleam Programs'
description: 'Building a runtime monitor for Gleam actor systems using sHML specifications embedded as a Gleam ADT, with instrumentation via BEAM bytecode tracing.'
pubDate: 'Feb 21 2026'
---

Runtime verification (RV) occupies a specific niche in the landscape of program correctness. Unlike static type systems, it doesn't prove properties before execution. Unlike testing, it doesn't sample behavior through finite inputs. An RV monitor observes a running system's execution trace and checks it against a formal specification in real time, raising an alarm the moment a violation occurs.

**Owl** is an RV framework for [Gleam](https://gleam.run/) programs running on the BEAM. It monitors live actor-based systems against properties expressed in a fragment of Hennessy-Milner logic. This is the story of how its three core design decisions fit together.

## Choosing the Logic: sHML

The choice of specification language determines what properties you can express and how tractable monitor synthesis is. Owl uses **soft Hennessy-Milner Logic (sHML)** — a modal logic with greatest fixpoints, restricted to the *safety* fragment.

sHML formulas describe constraints on execution traces. The box modality $\Box a. \phi$ means: *for every step with action $a$, the continuation must satisfy $\phi$*. The greatest fixpoint $\nu X. \phi(X)$ introduces a recursive property that holds infinitely often. Conjunction $\phi \wedge \psi$ requires both properties simultaneously.

The safety restriction is key: **sHML monitors are deterministic**. Because there are no existential modalities and no alternating fixpoints, the monitor state machine can be derived directly from the formula without any NFA-to-DFA subset construction. Each sHML constructor maps to an immediate, unambiguous monitoring action.

## Embedding sHML as a Gleam ADT

Rather than designing a custom surface syntax and parser, Owl's specifications are written directly in Gleam as values of a recursive algebraic data type:

```gleam
pub type SHML {
  Tt                                        // tt — always satisfied
  Ff                                        // ff — immediate violation
  Box(match: fn(TraceEvent) -> Bool,        // [a]φ
      phi: SHML)
  And(left: SHML, right: SHML)             // φ ∧ ψ
  Nu(name: String, phi: fn(SHML) -> SHML)  // νX.φ — greatest fixpoint
}
```

The `Nu` constructor uses Gleam's native higher-order functions for the fixpoint binding: the recursive variable $X$ is the function's argument, not a named variable requiring substitution machinery. This is a direct encoding of the *knot-tying* technique — the specification is self-referential without explicit variable capture.

Because the specification is a typed Gleam value, Gleam's type checker enforces structural well-formedness for free. A malformed specification is a compile-time error, not a runtime crash.

A "never add uranium, never serve before guests arrive" example:

```gleam
let no_uranium = Nu("X", fn(x) {
  And(
    Box(fn(e) { e == AddIngredient("uranium") }, Ff),
    Box(fn(_) { True }, x)
  )
})
```

This reads: in every state, if the next event is adding uranium, immediately fail; otherwise loop. The `Nu` self-reference `x` is passed as the continuation of the `Box(fn(_) {True}, x)` arm.

## Monitor Synthesis as ADT Traversal

Because sHML's safety fragment is deterministic, synthesizing a monitor from a spec is a direct recursive traversal — no intermediate automaton representation is needed:

| sHML node | Monitor behavior |
|-----------|-----------------|
| `Tt` | Accept silently; stop |
| `Ff` | Emit `Violation` immediately |
| `Box(match, phi)` | If event matches predicate, advance to `phi`; otherwise stay |
| `And(l, r)` | Spawn two sub-monitors; violation if either fires |
| `Nu(_, phi)` | Tail-recursive loop: `phi(self)` |

Each monitor is an OTP actor. Its state is the current `SHML` node. On receiving a `TraceEvent`, it evaluates the match predicate; if it matches, the actor's state transitions to the next node. Reaching `Ff` calls the user-provided violation handler and emits a `Verdict`. Reaching `Tt` silently stops.

The spec *is* the state machine. There's no separate IR.

## Instrumentation: BEAM Bytecode Tracing

The instrumentation layer is what makes Owl non-invasive. Rather than requiring source annotations or compile-time weaving, Owl hooks into the **BEAM VM's built-in tracing infrastructure**.

The BEAM exposes `erlang:trace/3` and `erlang:trace_pattern/3`, which let a designated process receive trace messages for specific events on target processes: function calls and returns, message sends and receives, process spawns and exits. These are the same primitives used by the standard Erlang observer and debugger tools.

Owl's **Trace Bridge** wraps these calls behind a typed Gleam API (via `@external` FFI), then normalizes raw trace tuples into typed `TraceEvent` records:

```
TraceEvent {
  kind:       FunctionCall | Send | Receive | Spawn | Exit
  source_pid: Pid
  target_pid: Option(Pid)
  payload:    TracePayload
  timestamp:  Int  -- monotonic BEAM clock
}
```

Normalization happens in an **OTP actor** designated as the BEAM trace recipient. Unrecognized trace formats are logged and dropped rather than crashing the monitor. A dedicated receiver process provides backpressure isolation: the monitored application's processes are never blocked by monitor processing.

## System Architecture

The full data flow:

```
BEAM VM (target processes)
  │  raw trace tuples
  ▼
Trace Receiver (OTP actor)      ← erlang:trace/3 points here
  │  normalizes to TraceEvent
  ▼
Router (ETS-backed subscription table)
  │  fans out to subscribed monitors
  ▼
Monitor Runners (one per SHML spec)
  │  advance SHML state on matching events
  ▼
Verdict Handlers (user callbacks)
```

The **Router** maintains a subscription table in ETS (Erlang's in-process hash table, accessible via FFI) for O(1) dispatch under high-frequency tracing. For parametric properties — "process $P$ never sends a message after exiting" — the router extracts the index key (typically a PID) and routes to the correct per-entity monitor instance, creating new instances on first encounter.

The **Monitor Runtime** is a supervision tree owning all components. Starting monitoring requires a single call:

```gleam
start(specs: List(#(SHML, Handler)), target: TraceTarget)
```

Stopping disables BEAM tracing, shuts down all runners, and returns the accumulated verdicts.

## What RV Teaches You About Concurrency

The hardest problem in Owl was not building the monitor compiler or the BEAM tracing harness — it was designing properties that are *meaningful* in the presence of concurrency.

The BEAM's scheduler can deliver events from concurrent actors in many possible interleavings. A naive property that expects a fixed ordering — "A must happen before B" — will raise false alarms whenever a valid interleaving reorders A and B. The solution is to write properties that are *closed under permutation* for commutative events: instead of "A then B," say "eventually A, and if B occurs, A has already occurred," which is stable under reordering.

This is a general lesson: specifying concurrent systems requires thinking about sets of reachable traces, not single traces. The temporal logic forces that discipline by design.
