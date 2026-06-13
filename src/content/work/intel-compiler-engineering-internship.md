---
title: 'Intel: Compiler Engineering Intern'
description: 'Performance engineering and compiler optimization on the Intel oneAPI C++/C/Fortran compiler, GCC, and LLVM.'
pubDate: 'Jun 12 2026'
---

I'm working as a Compiler Engineering Intern at Intel in San Jose, CA, on the oneAPI compiler team. The work centers on performance tracking and analysis across the Intel C++/C/Fortran compiler (ICX), GCC, and LLVM, with a focus on unlocking vectorization — understanding where and why auto-vectorization fails, and how to recover performance through compiler hints, loop restructuring, and targeted optimization flags.

The role spans performance engineering, compiler optimization debugging, and low-level Intel assembly analysis. A lot of the day-to-day involves reading vectorized x86 output, correlating it against source and IR, and tracing the gap between what the compiler could theoretically emit and what it actually does.

I just started and am still orienting myself in the codebase, but I'm genuinely excited to learn how an industrial-grade compiler is written and maintained from the hardware up. Most of my compiler experience has been academic — building compilers for coursework targeting x86-64 — so getting to work inside a production toolchain at this scale, where the distance between a missed vectorization and a measurable performance regression is very short, is exactly the kind of environment I wanted to be in.
