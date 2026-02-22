# NestEgg — Project Context

## Key Documents

- **PRD:** [aiDocs/prd.md](prd.md) — full product requirements, scope decisions, and 5-day build plan
- **Decisions:** [aiDocs/decisions.md](decisions.md) — locked decisions and rationale; do not re-litigate
- **Copy Guidelines:** [aiDocs/copy-guidelines.md](copy-guidelines.md) — canonical account explainers, tone rules, hard copy rules
- **Env Vars:** [aiDocs/env-vars.md](env-vars.md) — all environment variables by phase (no values)
- **Changelog:** [aiDocs/changelog.md](changelog.md) — append-only log of what was built and why it matters
- **Market Research:** [ai/guides/nestegg-market-research.md](../ai/guides/nestegg-market-research.md) *(gitignored — local only)*
- **Library Refs:** [ai/guides/supabase-auth-db.md](../ai/guides/supabase-auth-db.md), [shadcn-ui-components.md](../ai/guides/shadcn-ui-components.md), [recharts-projection.md](../ai/guides/recharts-projection.md) *(gitignored — local only)*

## Product in One Sentence

A guided web app that walks new parents through opening a 529 plan, UTMA custodial account, and authorized user credit card for their newborn — in under 10 minutes — anchored by a personalized compounding projection.

## Tech Stack

- **Framework:** Next.js (React) with App Router
- **Styling:** Tailwind CSS + shadcn/ui components
- **Projections:** Vanilla JS — no charting library dependency unless needed
- **Deployment:** Vercel
- **Backend/DB:** Supabase (Phase 2+; not in MVP)
- **Auth:** None in MVP

## Architecture Decisions

- Web app only — no mobile app in MVP
- No backend in MVP — all state is client-side (localStorage)
- Supabase added in Phase 2 for email capture and return-to-progress
- No affiliate or revenue integration until legal review of RIA implications

## Current Focus

- Set up project folder structure and tracked docs
- Build projection card (interactive, above the fold, no login required)
- Build 3-step guided account setup flow (529 → UTMA → Authorized User)
- Build Done screen with shareable link generation
- Deploy to Vercel

## Out of Scope (MVP)

- User authentication
- Server-side persistence
- Portfolio or security recommendations
- Affiliate revenue
- Mobile app
- Admin dashboard
