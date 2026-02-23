# NestEgg — Changelog

Append-only. One entry per AI session or meaningful work block.
Format: date, what was built (technical), business impact (1–2 sentences).

---

## 2026-02-23 — Phase 1 MVP Build

**What was built:**
Full Next.js 15 web application scaffolded and built from scratch: `src/lib/projection.ts` (compound growth engine, no dependencies), `src/lib/storage.ts` (localStorage helpers for child data, progress, and projection), `src/data/issuerInstructions.ts` (step-by-step authorized user instructions for Chase, Amex, Citi, Capital One, Discover, Other), and all UI pages and components — `ProjectionCard.tsx` (slider, birth year select, live projection, Recharts chart), `StepLayout.tsx` (shared step wrapper with progress indicator and disclosure footer), `MarkAsDone.tsx` (localStorage-backed checkbox), `IssuerInstructions.tsx` (issuer dropdown + inline steps), and all five app routes (`/setup`, `/setup/529`, `/setup/utma`, `/setup/credit`, `/setup/done`). Landing page supports `?monthly`, `?year`, `?name`, `?gift` query params for share and gift links. `npm run build` passes with zero TypeScript errors, 9 static pages generated.

**Business impact:**
The full user journey is now functional end-to-end — a parent can land on the site, see a personalized projection, complete all three account setup steps (529, UTMA, authorized user), and generate a shareable or gift link. The core hypothesis (projection card drives action, guided trifecta converts) is now testable. Remaining work before Phase 2 gate: Vercel deployment, manual mobile QA, and share link pre-fill verification in incognito.

**Remaining for Day 5 (manual / deployment):**
- Connect GitHub repo to Vercel and set `NEXT_PUBLIC_BASE_URL`
- Manual QA: full flow on Chrome desktop and Safari mobile
- Manual QA: share link pre-fill in incognito tab
- Mobile layout verification at 375px, 390px, 768px

---

## 2026-02-21 — Project Foundation + Planning

**What was built:**
Established the full project planning layer: PRD, market research guide, six phase plans with paired roadmap tracking docs, CLAUDE.md behavioral guidelines, `.gitignore`, `aiDocs/context.md` as the session anchor, `aiDocs/decisions.md` locking 11 key product/tech/legal decisions, `aiDocs/copy-guidelines.md` with canonical account explainers and hard copy rules, `aiDocs/env-vars.md` covering all environment variables across all six phases, `src/data/statePlans.ts` with all 50 states + DC mapped to recommended 529 plans and deduction details, and library reference guides for Supabase, shadcn/ui, and Recharts.

**Business impact:**
Every major product, legal, and technical decision for the 12-month roadmap is now documented and locked — eliminating re-litigation in future AI sessions and ensuring the education-only regulatory framing is consistently enforced from day one. The `statePlans.ts` data file means the most research-intensive part of the MVP (state-by-state 529 recommendations) is complete before a single line of app code is written.

---
