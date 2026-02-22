---
title: 'Cornell CMSX: Lead Software Engineer'
description: 'Leading modernization of CMSX from legacy JSP and XML patterns to a REST-first architecture with typed, testable interfaces.'
pubDate: 'Feb 22 2026'
---

CMSX is Cornell's course management platform, used by thousands of students and instructional staff every semester. I work on a long-running modernization effort to move the system from legacy JSP and servlet-era patterns toward a REST-first architecture with clearer API contracts, better frontend ergonomics, and stronger operational reliability.

The legacy implementation mixed server-side rendering concerns with application logic, relied heavily on session-bound XML data, and made feature development expensive. A major part of my work has been designing and shipping JSON-based endpoints with clear HTTP semantics, then pairing those APIs with a modern React frontend that can handle dense staff workflows while still staying responsive and maintainable.

On the backend, I use functional-style Java patterns such as `Maybe<T>` and `Result<T>` to make nullability and failure paths explicit in types rather than implicit in exceptions and defensive checks. This has made validation and control flow more composable, especially for large endpoints with many optional fields and nested operations. I also use builder-based entity updates with JPA to preserve transactional integrity and keep multi-field updates atomic.

On the frontend, I focus on information-dense but usable interfaces using React and MUI/MUI Data Grid patterns, with typed data models and runtime validation to catch contract mismatches early. The practical result has been faster iteration on staff-facing tools, lower risk when evolving data models, and a clearer path for incrementally migrating remaining legacy surfaces without a disruptive full rewrite.
