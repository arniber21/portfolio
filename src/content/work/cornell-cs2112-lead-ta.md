---
title: 'Cornell CS 2112: Lead Teaching Assistant'
description: 'Led assignment design, grading systems, and JVM-focused course infrastructure for Cornell CS 2112.'
pubDate: 'Feb 22 2026'
---

As Lead TA for Cornell CS 2112, I work across both pedagogy and engineering infrastructure: designing and refining assignments, managing grading quality, and building tooling that keeps large, technically demanding assignments operable at scale.

A major part of the role is autograder and testing infrastructure for complex Java projects. One representative assignment involved a life simulation with a parser, an internal language, an AST mutator, and multithreaded simulation behavior. Supporting this kind of workload required careful Python-based orchestration plus internal tooling for deterministic grading, artifact handling, and failure triage.

Because these pipelines execute inside containers, I also worked through non-trivial Gradle and Docker integration details so builds are reproducible and isolated in the autograder environment. The focus was reliable execution under heavy test loads, predictable dependency behavior, and maintainable grading logic for staff.

On the teaching side, I develop and deliver materials on JVM internals so students can connect language-level code to runtime behavior, including bytecode execution and optimization concepts. The combination of rigorous assignment design, robust grading infrastructure, and systems-focused instruction helps students build stronger implementation intuition while keeping course operations reliable.
