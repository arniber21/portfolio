export type Project = {
  id: string;
  name: string;
  description: string;
  link: string;
  video: string;
  tags?: string[];
  awards?: string[];
  blogSlug?: string;
};

export type WorkExperience = {
  id: string;
  company: string;
  title: string;
  start: string;
  end: string;
  link: string;
  location?: string;
  description?: string;
};

export type Education = {
  id: string;
  institution: string;
  degree: string;
  start: string;
  end: string;
  location?: string;
  gpa?: string;
  description?: string;
  activities?: string[];
};

export type BlogPost = {
  uid: string;
  title: string;
  description: string;
  link: string;
};

export type SocialLink = {
  label: string;
  link: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'project-1',
    name: 'Owl',
    description:
      "Runtime verification for Gleam using sHML-based monitors compiled from a temporal property DSL, with low-overhead BEAM bytecode tracing for distributed actor systems. Capstone for CS 6156.",
    link: 'https://github.com/arniber21/owl',
    video: '',
    tags: ['Runtime Verification', 'Gleam', 'BEAM'],
    blogSlug: 'owl',
  },
  {
    id: 'project-2',
    name: 'Fern',
    description:
      'A language targeting LLVM IR with Hindley-Milner + Algorithm W type inference, refinement types, trait constraints, row polymorphism, and exhaustive pattern matching.',
    link: 'https://github.com/arniber21/fern',
    video: '',
    tags: ['Kotlin', 'Programming Languages', 'Compilers', 'LLVM'],
    blogSlug: 'fern',
  },
  {
    id: 'project-3',
    name: 'Bo Nix',
    description:
      "Full optimizing compiler for Eta/Rho → x86-64 in Java: lexer through register allocation, ABI-compliant codegen, and language extensions including records and null handling. Capstone for CS 4120.",
    link: 'https://github.com/arniber21/bonix',
    video: '',
    tags: ['Java', 'Compilers', 'x86'],
    blogSlug: 'bonix',
  },
  {
    id: 'project-4',
    name: 'Guardrails: Atomic',
    description:
      'Formally verified distributed-systems handler synthesis via CEGIS + Z3, with LLM-driven code generation and repair guided by SMT counterexamples. Won 1st at AI Agent Hackathon, Cambridge MA.',
    link: 'https://github.com/arniber21/guardrails',
    video: '',
    tags: ['Formal Verification', 'Distributed Systems', 'Agentic Systems', 'TypeScript'],
    awards: ['AI Agent Hackathon — 1st Place'],
    blogSlug: 'guardrails',
  },
];

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    id: 'work-1',
    company: 'HRL Laboratories',
    title: 'Software Engineering Intern — Quantum Technology',
    start: 'May 2025',
    end: 'Aug 2025',
    link: 'https://hrl.com',
    location: 'Santa Monica, CA',
    description:
      'Built and operated quantum-computing research infrastructure for 50+ researchers in secure air-gapped environments, supporting spin-qubit compiler-adjacent workflows and improving end-to-end throughput by 50% across 10,000+ daily operations.',
  },
  {
    id: 'work-2',
    company: 'Cornell University',
    title: 'Lead Teaching Assistant, CS 2112',
    start: 'Aug 2025',
    end: 'Present',
    link: 'https://www.cs.cornell.edu',
    location: 'Ithaca, NY',
    description:
      'Led advanced discussions on JVM internals—bytecode execution, JIT/tiered compilation, and hotspot behavior—and taught formal grammars and AST-based language implementation; mentored students building a programming language runtime.',
  },
  {
    id: 'work-3',
    company: 'Cornell Course Management System X',
    title: 'Lead Software Engineer',
    start: 'Jan 2025',
    end: 'Present',
    link: 'https://www.cs.cornell.edu/projects/cms/cmsx/#team-current',
    location: 'Ithaca, NY',
    description:
      "Lead for CMSX, Cornell's in-house course management system. Modernizing tightly coupled XML and legacy JSP to modern Java REST APIs and type-safe React frontends.",
  },
];

export const EDUCATION: Education[] = [
  {
    id: 'edu-1',
    institution: 'Cornell University',
    degree: 'B.A. Computer Science and Mathematics',
    start: 'Aug 2024',
    end: 'May 2028',
    location: 'Ithaca, NY',
    gpa: ' 3.81/4.0',
    description:
      'Emphasis on programming languages, compilers, runtime verification, formal verification, and applied logic. Also majored in mathematics, focused on different logical systems and algebras. Picked up a major in Asian Studies, with an emphasis on the Korean language and the history of Korea. ',
    activities: [
      'CS 4110: Programming Languages',
      'CS 4120: Compilers',
      'CS 4160: Formal Verification',
      'CS 6156: Runtime Verification',
      'CS 4860: Applied Logic',
      'Head TA: CS 2112 (Honors Object-Oriented Data Structures)',
      'TA: CS 2110 (Object-Oriented Data Structures)',
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    uid: 'hindley-milner',
    title: 'Type Inference Without Annotations: How Algorithm W Works',
    description:
      'A walkthrough of Hindley-Milner type inference — substitutions, unification, generalization, and the principal types theorem — with concrete examples.',
    link: '/blog/hindley-milner',
  },
  {
    uid: 'fern',
    title: 'Designing Fern: A Language Built on Types',
    description:
      'How Hindley-Milner inference, refinement types, row polymorphism, and trait constraints fit together in a language targeting LLVM IR.',
    link: '/blog/fern',
  },
  {
    uid: 'owl',
    title: 'Owl: Runtime Verification for Distributed Gleam Programs',
    description:
      'Building a runtime monitor for Gleam actor systems using sHML specifications embedded as a Gleam ADT, with instrumentation via BEAM bytecode tracing.',
    link: '/blog/owl',
  },
  {
    uid: 'bonix',
    title: 'Bo Nix: Building a Compiler for Eta and Rho',
    description:
      'Notes on implementing a complete optimizing compiler targeting x86-64, from sealed-interface lexer tokens to graph-coloring register allocation.',
    link: '/blog/bonix',
  },
  {
    uid: 'guardrails',
    title: 'Guardrails: Verified Handler Synthesis with CEGIS and Z3',
    description:
      'Building an AI-assisted synthesis and formal verification system for distributed-systems handlers, winning 1st at the AI Agent Hackathon in Cambridge, MA.',
    link: '/blog/guardrails',
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', link: 'https://github.com/arniber21' },
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/arnab-ghosh819/' },
];

export const EMAIL = 'arnabcare21@gmail.com';
