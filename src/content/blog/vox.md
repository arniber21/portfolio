---
title: 'VOX: A Production-Ready Academic Journal Platform'
description: 'How we built VOX with Payload CMS, Next.js 15, typed APIs, and cloud-native deployment across AWS.'
pubDate: 'Feb 22 2026'
---

VOX is an academic journal platform built by extending Payload CMS with a Next.js 15 App Router frontend and a TypeScript-first backend workflow. The goal was to deliver a system that feels simple for editors while still supporting production requirements: rich content modeling, reliable publishing flows, search/SEO, and scalable cloud deployment.

The core stack combines Payload CMS, React 19, and PostgreSQL via `@payloadcms/db-postgres`, with local development orchestrated through `pnpm`, Docker, and `docker-compose` for reproducibility. On the UI side, we used Tailwind CSS with `shadcn/ui` and Radix primitives, plus React Hook Form, Lucide icons, Geist typography, and Lexical-powered rich text blocks to support flexible layouts, draft workflows, live preview, redirects, and scheduled publishing.

On the backend, VOX exposes GraphQL endpoints, uses Nodemailer for transactional email, and stores media in S3 through `@payloadcms/storage-s3`. Revalidation hooks keep statically generated pages synchronized with CMS updates so content freshness does not depend on manual rebuilds. For engineering quality, we enforced Vitest integration tests, Playwright end-to-end suites, ESLint 9, and Prettier 3, with CI-ready workflows and utility tooling such as sitemap generation, PostCSS pipelines, and tsx-based seeding scripts.

Deployment runs on Amazon Amplify with supporting AWS infrastructure including Amazon RDS, Amazon S3, Amazon Route 53, Amazon CloudWatch, Certificate Manager, and Secrets Manager. To harden delivery under real traffic, we also enabled Cloudflare CDN caching, Next.js image optimization, and AWS WAF Shield protections. The result is a managed publishing platform with clear editorial workflows and resilient production operations.
