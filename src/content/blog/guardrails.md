---
title: 'Guardrails: Verified Handler Synthesis with CEGIS and Z3'
description: 'Building an AI-assisted synthesis and formal verification system for distributed-systems handlers, winning 1st at the AI Agent Hackathon in Cambridge, MA.'
pubDate: 'Feb 21 2026'
---

Distributed systems are notoriously hard to get right. The interesting failures — split-brain, lost writes, stale reads, partial failures under network partition — are invisible to most test suites because they only manifest under specific interleavings of concurrent events. Formal verification can catch these, but writing formal specifications and checking them manually is expensive.

**Guardrails: Atomic** combines an LLM for code synthesis with an SMT solver for correctness — using each tool where it's strong. The LLM generates plausible-looking handler implementations quickly; the SMT solver finds concrete counterexamples when those implementations are wrong; the LLM repairs the code given the counterexample. This loop is **CEGIS** — Counterexample-Guided Inductive Synthesis — and it terminates when the solver can find no more violations.

We won 1st place at the AI Agent Hackathon in Cambridge, MA.

## What We're Verifying

The target domain is **event handlers for distributed systems**: functions that respond to events (message received, timer fired, node joined) by updating state and producing outputs. Formally, a handler is a state-transition function:

$$f : S \times E \to S$$

where $S$ is the system state space and $E$ is the event alphabet. The correctness properties we care about are expressible as first-order formulas over $f$:

**Idempotency** — processing the same event twice is identical to processing it once:

$$\forall s \in S,\; e \in E.\quad f(f(s, e), e) = f(s, e)$$

This is critical for at-least-once delivery semantics: if a message is delivered twice, the system shouldn't double-count.

**Commutativity** — for a designated subset of event pairs, order doesn't matter:

$$\forall s \in S,\; e_1, e_2 \in E_{\text{comm}}.\quad f(f(s, e_1), e_2) = f(f(s, e_2), e_1)$$

**Invariant preservation** — a predicate $\phi(s)$ holds in every reachable state:

$$\phi(s_0) \land \left(\forall s, e.\; \phi(s) \Rightarrow \phi(f(s, e))\right)$$

Users express these properties in a small YAML DSL that compiles to Z3 constraints:

```yaml
handler: updateBalance
idempotent: true
commutative_with: [readBalance]
invariant: balance >= 0
```

## The CEGIS Loop

CEGIS is a refinement loop between two oracles: a *synthesizer* that proposes candidates, and a *verifier* that finds counterexamples:

$$\texttt{CEGIS} = \text{fix}\bigl(\texttt{Verify} \circ \texttt{Synthesize}\bigr)$$

In operational terms:

1. **Synthesize**: the LLM produces a TypeScript handler $h$ from the spec $\phi$ and a set of counterexamples $\mathcal{C}$ (initially empty).
2. **Verify**: Z3 checks $\text{Valid}(\phi[f \mapsto h])$. Equivalently, it checks $\text{UNSAT}(\neg\phi[f \mapsto h])$. If unsatisfiable, $h$ is correct — we're done.
3. **Counterexample**: if Z3 finds a satisfying assignment to $\neg\phi[f \mapsto h]$, it returns a concrete witness $c$ — specific input values and event orderings that break the property.
4. **Repair**: the LLM sees the spec, the current $h$, and $c$ (rendered as natural language). It produces $h'$.
5. Add $c$ to $\mathcal{C}$ and repeat from step 1.

The loop terminates by monotone progress: each iteration adds at least one new constraint to $\mathcal{C}$, and the space of distinct counterexamples is finite for bounded state spaces.

## Encoding the Fault Model in Z3

The hardest engineering problem was encoding the **fault model** as Z3 constraints. A fault model specifies an adversarial network environment: messages may arrive out of order, be duplicated, or be dropped. This is nondeterministic — the verifier must check the property holds under *all* possible fault scenarios.

Naively, this requires quantifying over all fault sequences:

$$\forall \text{faults}.\; \phi(f, \text{faults})$$

Universal quantification in Z3 uses E-matching, which can be slow and incomplete. Instead, we use **bounded unrolling**: enumerate all fault sequences up to depth $k$ and check the property for each. This is a quantifier-free formula that Z3's linear arithmetic solver handles efficiently. For idempotency and simple invariants, $k = 2$ is sufficient.

The tradeoff is completeness: bounded unrolling misses bugs that only manifest at depth $> k$. In practice, the interesting distributed-systems bugs manifest at very small depths — they're about event ordering, not deep chains of interactions.

## The LLM as Repair Oracle

**Prompt design** turned out to matter as much as the formal machinery. A naive prompt that dumps the counterexample as raw Z3 output — a satisfying assignment to a formula — confuses the model. Models are not trained to read Z3's model output directly.

The fix: translate the counterexample into a concrete scenario in natural language before giving it to the LLM:

> *"Your implementation fails idempotency. Here's a counterexample: starting with state `{balance: 50}`, processing the event `deposit(100)` twice gives a final balance of `250` instead of the expected `150`. Fix the implementation so that processing the same deposit event twice is the same as processing it once."*

This translation step — from Z3 witness to English scenario — was the most impactful change in the whole pipeline. Counterexamples as natural language *activate the right prior*: the model already knows that idempotency for deposits means using upsert semantics rather than accumulation. It just needed the concrete failure to trigger that knowledge.

## Reflection

The most surprising result was convergence speed. We expected the repair phase to require many rounds — the model would need to "learn" distributed systems patterns from the counterexamples. Instead, most handlers reached a verified implementation in two or three rounds. The model already contained the correct patterns (idempotency via upsert, commutativity via conflict-free data structures); the counterexample mostly served to select the right one, not teach from scratch.

The deeper lesson: CEGIS is a *disambiguation* algorithm. The LLM's prior over correct implementations is broad but not focused — it contains the right answer somewhere. Z3's counterexamples serve as focused queries that disambiguate which implementation the spec is actually asking for.

Guardrails points toward a future where formal verification is accessible without deep expertise in proof engineering: write a lightweight spec, let the CEGIS loop find and fix the bugs, and review a correct implementation rather than a proof.
