---
title: 'HRL Laboratories: Software Engineering Intern (Quantum Technology)'
description: 'Containerized and secured internal research tooling with CI/CD and unified auth for high-availability engineering workflows.'
pubDate: 'Feb 22 2026'
---

At HRL Laboratories, I focused on hardening and scaling internal developer tooling used continuously by research teams. The core work was infrastructure and platform reliability rather than feature-heavy UI work: making systems predictable, secure, and easy to operate under strict environment constraints.

I containerized deployments with Docker so services could be packaged and promoted consistently across environments, then implemented CI/CD for a high-traffic internal developer tool to reduce manual release overhead and deployment drift. This significantly improved release repeatability and shortened the feedback cycle for infrastructure updates.

I also helped re-architect authentication around role-based and resource-based attribute controls, moving authorization logic closer to policy intent and reducing ad-hoc access checks. To support multiple internal apps under one secure access plane, I used NGINX as a gateway layer and integrated those applications under a unified authentication system, which simplified operations while improving access consistency and security posture.
