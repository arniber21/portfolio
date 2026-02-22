---
title: 'Designing Fern: A Language Built on Types'
description: 'How Hindley-Milner inference, refinement types, row polymorphism, and trait constraints fit together in a language targeting LLVM IR.'
pubDate: 'Feb 21 2026'
---

Fern started as a question: what does a language look like if you design it type-system-first, letting the expressive power of the types determine what the surface language can say?

The answer turned out to involve four interlocking pieces — Hindley-Milner inference, refinement types, row polymorphism, and trait constraints — each of which is independently well-understood, but which interact in ways that are only obvious in hindsight.

## Starting Point: Hindley-Milner

The core of Fern's type system is classical Hindley-Milner. Every expression is assigned a type without annotations; the algorithm infers the most general possible type automatically.

The central judgment is $W(\Gamma, e) = (S, \tau, C)$: given a typing context $\Gamma$ mapping variables to type schemes, and an expression $e$, Algorithm W returns a substitution $S$ (assignments of type variables to types), an inferred type $\tau$, and a set of trait constraints $C$.

The key operation is **unification**: given two types, find the most general substitution that makes them equal. For function application $e_1 \; e_2$, Algorithm W infers a type $\tau_1$ for the function and $\tau_2$ for the argument, creates a fresh type variable $\alpha$ for the result, then solves $\text{unify}(S_2(\tau_1),\; \tau_2 \to \alpha)$. Unification fails with a type error if the two sides are structurally incompatible.

The only place polymorphism is introduced is **let-bindings**. After inferring the type $\tau$ of a `let`-bound expression, generalization promotes it to a type scheme by universally quantifying the free type variables that don't appear in the surrounding context:

$$\text{gen}(\Gamma, \tau, C) = \forall\bar{\alpha}.\; C \Rightarrow \tau \quad\text{where}\quad \bar{\alpha} = \text{FTV}(\tau) \setminus \text{FTV}(\Gamma)$$

This distinction — let-polymorphism but not lambda-polymorphism — is what makes HM decidable. The identity function `let id = λx. x` gets the scheme $\forall\alpha.\; \alpha \to \alpha$, so `id 42` and `id "hello"` both typecheck in the same scope. But `(λid. (id \; 1, id \; "hi")) (λx. x)` fails: the lambda-bound `id` gets a monomorphic type variable, and unifying `α = \text{Int}$ then `α = \text{String}` is a contradiction.

## Going Further: Refinement Types

HM tells you the *shape* of a value — its base type. Refinement types tell you the *properties* a value satisfies. The syntax is:

$$\{\nu : \tau \mid \phi\}$$

where $\nu$ is a binder for the value and $\phi$ is a logical predicate. The type $\{\nu : \text{Int} \mid \nu > 0\}$ is the type of positive integers. The function `divide(x: Int, y: {ν: Int | ν ≠ 0}): Int` is statically safe — division by zero is ruled out by the precondition.

The typing judgment extends to $\Gamma;\Phi \vdash e : \{\nu : \tau \mid \phi\}$, where $\Phi$ is a *refinement context* — the set of predicates currently known to hold. Conditionals are the key case: in the then-branch of `if e₁ then e₂ else e₃`, the refinement context is extended with $\phi_c$ (the condition is true); in the else-branch, with $\neg\phi_c$. This *path sensitivity* is what allows:

```fern
fun abs(x: Int): {ν: Int | ν >= 0} =
  if x >= 0 then x else -x
```

In the then-branch, $\Phi$ contains `x ≥ 0`, so `x` already has the required refinement. In the else-branch, $\Phi$ contains `x < 0`, so `-x` is positive. Both arms satisfy $\{\nu : \text{Int} \mid \nu \geq 0\}$.

Checking refinement implications — does $\phi_1$ entail $\phi_2$ under context $\Phi$? — is handled by an SMT solver. Fern restricts refinements to **Linear Integer Arithmetic (LIA)** and uninterpreted functions (for ADT accessors), which keeps the validity queries decidable:

$$\text{Valid}(\Phi \Rightarrow \phi) \iff \text{SMT-UNSAT}(\Phi \land \neg\phi)$$

## Records Without Subtype Hell: Row Polymorphism

Classical structural record subtyping — where `{x: Int, y: Int}` is a subtype of `{x: Int}` — forces every record operation to deal with a subtype hierarchy. Row polymorphism is cleaner: a function that reads field `x` has the *open record type* $\{x : \text{Int} \mid \rho\}$, where $\rho$ is a **row variable** ranging over all possible additional fields.

```fern
func get_x<R>(rec: { x: Int | R }): Int = rec.x
```

The type of `get_x` is $\forall\rho.\; \{x : \text{Int} \mid \rho\} \to \text{Int}$. Applying it to `{x: 10, y: "hello", active: true}` unifies $\rho$ with `y: String, active: Bool`, which succeeds. No subtype relation is needed.

Row unification extends Robinson's algorithm with one extra case: if a label $l$ appears in one row but not the other, it's "moved" into the other's row variable:

$$\text{unify}(\{l : \tau \mid \rho_1\},\; \rho_2) = [\rho_2 \mapsto l : S(\tau), S(\rho_2)] \quad\text{when}\; l \notin \text{labels}(\rho_2)$$

The occurs check prevents infinite row types ($\rho \not\in \text{FTV}(\{l : \tau \mid \rho\})$).

## Ad-Hoc Polymorphism: Trait Constraints

HM's parametric polymorphism is unconditional — `∀α. α → α` works for *any* `α`. Sometimes you need *conditional* polymorphism: "sort works for any `α` that implements `Ord`." This is what trait constraints provide.

Type schemes in Fern take the form $\forall\bar{\alpha}.\; C_1, \ldots, C_n \Rightarrow \tau$, where each $C_i$ is a trait constraint. The `sort` function has scheme $\forall\alpha.\; \text{Ord}\langle\alpha\rangle \Rightarrow \text{List}\langle\alpha\rangle \to \text{List}\langle\alpha\rangle$.

Constraint resolution answers: given the available `impl` declarations and a constraint $C\langle\tau\rangle$, does an instance exist? The rules are:

- **Axiom**: `impl Show for Int` directly satisfies `Show⟨Int⟩`
- **Conditional**: `impl<T> Show for Option<T> where T: Show` satisfies `Show⟨Option⟨Int⟩⟩` if `Show⟨Int⟩` is already satisfied

**Coherence** ensures there's at most one valid instance per type — no ambiguity in resolution, and no orphan instances (impls must live in the module defining the trait or the type).

## The Backend: LLVM IR via Monomorphization

Fern compiles to LLVM IR, which requires all polymorphism to be eliminated before codegen. Rather than boxing (which adds indirection and breaks value types), Fern uses **monomorphization**: each use of a polymorphic function at a concrete type generates a specialized copy.

The lowering pipeline runs: elaborated AST → explicit monomorphic IR (all type variables resolved) → SSA construction (inserting φ-nodes at control flow joins) → LLVM IR emission. Memory is managed by **automatic reference counting (ARC)**, lowered to retain/release intrinsics that LLVM's optimizer handles well.

The most interesting engineering challenge was keeping the type checker and lowering pipeline in sync. Every intermediate representation needs to carry enough type information for the next stage to make correct decisions — a constraint that shapes the entire architecture from parser to codegen.
