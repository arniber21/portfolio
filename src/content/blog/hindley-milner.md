---
title: 'Type Inference Without Annotations: How Algorithm W Works'
description: 'A walkthrough of Hindley-Milner type inference — substitutions, unification, generalization, and the principal types theorem — with concrete examples.'
pubDate: 'Feb 21 2026'
---

One of the most underappreciated achievements in programming language theory is **complete type inference**: the ability to assign a type to every expression in a program without any annotations from the programmer. You write `let id = λx. x` and the system figures out, on its own, that `id` has type $\forall\alpha.\; \alpha \to \alpha$. Then it correctly checks `id 42 : Int` and `id "hello" : String` in the same program, using different instantiations of that one scheme.

This is what **Hindley-Milner (HM)** type inference gives you. The algorithm was independently discovered by Hindley (1969) for combinatory logic and by Milner (1978) for ML, then formalized by Damas and Milner (1982) with a proof that the algorithm finds the most general possible type — the **principal type** — for every typeable expression.

Here's how it works.

## The Core Judgment

The type inference judgment has the form:

$$W(\Gamma, e) = (S, \tau, C)$$

- $\Gamma$ is the **typing context**: a map from variable names to type schemes.
- $e$ is the **expression** being typed.
- $S$ is a **substitution**: a finite map $[\alpha_1 \mapsto \tau_1, \ldots, \alpha_n \mapsto \tau_n]$ from type variables to types.
- $\tau$ is the **inferred type** (under substitution $S$).
- $C$ is a set of **trait constraints** accumulated during inference (for constrained polymorphism).

A substitution is applied to a type by replacing each free type variable with its assigned type. Composition $S_2 \circ S_1$ applies $S_1$ first: $(S_2 \circ S_1)(\tau) = S_2(S_1(\tau))$.

## Algorithm W, Case by Case

**Variables**: Look up $x$ in $\Gamma$ to find its type scheme $\sigma$. *Instantiate* $\sigma$ by replacing each universally quantified variable with a fresh type variable — this is what lets you use `id` at both `Int` and `String` in the same scope.

$$\frac{x : \sigma \in \Gamma \qquad \tau = \text{inst}(\sigma)}{\Gamma \vdash x : \tau}$$

**Lambda**: Assign the parameter a fresh type variable $\alpha$, extend the context, and infer the body type $\tau_2$.

$$W(\Gamma, \lambda x.\; e') \quad \Rightarrow \quad (S,\; S(\alpha) \to \tau_2)$$

Note: lambda parameters are **not generalized** — only let-bindings are. This is what makes the algorithm decidable.

**Application**: Infer the function type, then the argument type, then unify the function's domain with the argument's type.

$$\frac{W(\Gamma, e_1) = (S_1, \tau_1) \qquad W(S_1(\Gamma), e_2) = (S_2, \tau_2) \qquad \alpha = \text{fresh}() \qquad S_3 = \text{unify}(S_2(\tau_1),\; \tau_2 \to \alpha)}{W(\Gamma, e_1\; e_2) = (S_3 \circ S_2 \circ S_1,\; S_3(\alpha))}$$

**Let**: This is the crucial case. After inferring the type $\tau_1$ of the bound expression, **generalize** it — universally quantify the type variables that are free in $\tau_1$ but not in the surrounding context $\Gamma$:

$$\text{gen}(\Gamma, \tau, C) = \forall\bar{\alpha}.\; C \Rightarrow \tau \qquad\text{where}\quad \bar{\alpha} = \text{FTV}(\tau) \setminus \text{FTV}(\Gamma)$$

The resulting scheme $\sigma$ is added to $\Gamma$ for typing the body of the let.

## Unification: The Heart of the Algorithm

Unification is the procedure that makes two types equal by finding the most general substitution (the **most general unifier**, or MGU) that, when applied to both types, makes them identical.

Robinson's unification algorithm:

- $\text{unify}(\tau, \tau) = \emptyset$ (identical types need no substitution)
- $\text{unify}(\alpha, \tau) = [\alpha \mapsto \tau]$ if $\alpha \notin \text{FTV}(\tau)$ (**occurs check**)
- $\text{unify}(\tau_1 \to \tau_2,\; \tau_1' \to \tau_2') = S_2 \circ S_1$ where $S_1 = \text{unify}(\tau_1, \tau_1')$ and $S_2 = \text{unify}(S_1(\tau_2), S_1(\tau_2'))$
- Otherwise: fail

The **occurs check** — requiring $\alpha \notin \text{FTV}(\tau)$ before binding $\alpha \mapsto \tau$ — prevents constructing infinite types. Without it, `unify(α, α → β)` would bind $\alpha = \alpha \to \beta = (\alpha \to \beta) \to \beta = \ldots$, producing an infinite type that cannot be represented finitely.

## The Let-Polymorphism Distinction

Here's the key distinction that makes HM tractable. Consider:

```fern
// Works:
let id = λx. x in (id 42, id "hello")

// Fails:
(λid. (id 42, id "hello")) (λx. x)
```

In the `let` form, after inferring $\text{id} : \alpha \to \alpha$, generalization produces the scheme $\forall\alpha.\; \alpha \to \alpha$. Each use of `id` instantiates $\alpha$ to a fresh variable — $\beta_1$ for `id 42`, $\beta_2$ for `id "hello"` — so both type-check independently.

In the lambda form, `id` is a lambda-bound parameter, so it gets type $\gamma$ (a fresh monotype, not a scheme). When typing `id 42`, we unify $\gamma = \text{Int} \to \delta_1$, fixing $\gamma$ as a function from `Int`. Then `id "hello"` tries to unify $\gamma = \text{String} \to \delta_2$, but $\gamma$ is already $\text{Int} \to \delta_1$, so unification fails.

Lambda parameters are intentionally monomorphic. Allowing polymorphic lambda parameters (as in System F) makes type inference undecidable — type-checking System F is equivalent to second-order unification, which does not terminate in general.

## The Principal Types Theorem

The payoff of this careful construction is the **Principal Types Theorem** (Damas & Milner 1982):

> If $W(\Gamma, e)$ succeeds with result $(S, \tau, C)$, then $\tau$ is the **principal type** of $e$ under $\Gamma$: every other valid type for $e$ is a substitution instance of $\tau$.

This means the algorithm doesn't just find *a* type — it finds the *most general* one. And crucially, it always terminates: the algorithm's correctness follows by structural induction on $e$ (expression structure strictly decreases at each recursive call), and unification terminates because the occurs check prevents cycles.

**Soundness**: $W(\Gamma, e) = (S, \tau)$ implies $S(\Gamma) \vdash e : \tau$ (the inferred type is actually valid).

**Completeness**: If $\Gamma \vdash e : \tau'$ (any valid typing), then $W(\Gamma, e)$ succeeds and returns a type $\tau$ such that $\tau' = S'(\tau)$ for some substitution $S'$ (the inferred type is at least as general).

## A Traced Example

```fern
let id = λx. x in
let a = id 42 in
let b = id "hello" in
(a, b)
```

**Step 1**: $W(\emptyset, \lambda x.\; x)$. Fresh $\alpha$, infer body: $W(\{x:\alpha\}, x) = (\emptyset, \alpha)$. Result: $(\emptyset,\; \alpha \to \alpha)$.

**Step 2**: Generalize. $\text{FTV}(\alpha \to \alpha) \setminus \text{FTV}(\emptyset) = \{\alpha\}$. Scheme: $\forall\alpha.\; \alpha \to \alpha$.

**Step 3**: $W(\{\text{id}:\forall\alpha.\;\alpha\to\alpha\},\; \text{id}\; 42)$. Instantiate `id` to $\beta_1 \to \beta_1$. Type of `42` is `Int`. Unify $\beta_1 \to \beta_1$ with $\text{Int} \to \beta_2$: gives $\beta_1 = \text{Int}$. Result: $\text{Int}$.

**Step 4**: $W(\{\ldots, a:\text{Int}\},\; \text{id}\; \text{"hello"})$. Instantiate `id` to a **fresh** $\beta_3 \to \beta_3$ (independent of $\beta_1$!). Unify with $\text{String} \to \beta_4$: gives $\beta_3 = \text{String}$. Result: $\text{String}$.

**Step 5**: Final type: $(\text{Int},\; \text{String})$.

The critical step is that `id` is instantiated twice with *different* fresh variables. This is the mechanical consequence of let-polymorphism: each use of a let-bound name gets its own instantiation.

## Why It Matters

HM is the foundation of ML, Haskell, OCaml, Elm, and many more languages. Its properties — complete inference, principal types, decidability — are not free: they follow from specific restrictions (no polymorphic lambda parameters, no impredicativity). Understanding the restrictions makes you understand the tradeoffs in languages that relax them: Haskell's `RankNTypes` extension breaks inference for those annotations, System F is expressive but requires full annotations, and so on.

The algorithm also composes with extensions: refinement types add a second logic layer (SMT validity queries alongside unification), row polymorphism extends unification with row variables, and trait constraints add a third-stage resolution check. All three extensions preserve the core structure of Algorithm W while adding expressive power in orthogonal dimensions.
