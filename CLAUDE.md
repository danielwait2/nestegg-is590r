# NestEgg — Claude Code Instructions

## What This Project Is

A guided web app that walks new parents through opening a 529 plan, UTMA custodial account, and authorized user credit card for their newborn — in under 10 minutes — anchored by a personalized compounding projection.

**Tagline:** Set Your Kids Up for Life.

---

## Read These First

Before writing any code or making any recommendations, read these documents in order:

1. `aiDocs/context.md` — project overview, tech stack, architecture decisions
2. `aiDocs/decisions.md` — locked decisions; do not re-litigate these
3. `aiDocs/changelog.md` — what has been built so far and why
4. The relevant phase roadmap in `ai/roadmaps/` for whatever phase is currently active

For copy and tone questions: `aiDocs/copy-guidelines.md`
For environment variables: `aiDocs/env-vars.md`

---

## Current Phase Status

- **Phase 1 (MVP):** Complete — code built, not yet deployed to Vercel
- **Phase 2 (SQLite persistence + auth):** Mostly complete — 3 known gaps (see `ai/roadmaps/roadmap-phase2-v1-core.md`)
- **Phase 3 (Supabase migration + email + SEO):** Not started — next phase
- **Phases 4–6:** Planned and documented, not started

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts (lazy-loaded) |
| Projections | Vanilla JS (`src/lib/projection.ts`) — no library |
| Local DB | better-sqlite3 (`nestegg.db`) — Phase 2 only, replaced by Supabase in Phase 3 |
| Production DB | Supabase (Phase 3+) |
| Auth | Custom magic-link via session tokens (console.log in Phase 2, Resend email in Phase 3+) |
| Deployment | Vercel |

---

## Locked Decisions (Summary)

Full rationale in `aiDocs/decisions.md`. Do not re-open these without a specific reason.

- Web app only — no native mobile app until Phase 5
- Three accounts only: 529 + UTMA + authorized user card. No fourth account type.
- Auth is always optional — never required to complete the setup flow
- Utah my529 is the default 529 fallback for states with no meaningful tax deduction
- No affiliate revenue until Phase 5 — legal review is a hard prerequisite
- No specific securities or portfolio recommendations until Phase 6 — RIA/solicitor question must be resolved first
- Supabase for production backend; better-sqlite3 for Phase 2 local only
- Resend for email; Vercel for deployment

---

## Legal Hard Lines

NestEgg is a **financial education tool**, not a registered investment adviser. These rules are non-negotiable:

- Never say "financial advice," "guaranteed returns," "best plan," or "you should invest"
- Every projection must include: *"Hypothetical illustration assuming 7% avg. annual return. Not a guarantee. Investment values fluctuate."*
- Every setup step must include: *"NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice."*
- Do not add affiliate links or compensation-based recommendations without explicit instruction — this requires legal review first
- Do not recommend specific investment portfolios or securities within a plan

See `aiDocs/copy-guidelines.md` for full copy rules and canonical account explainers.

---

## Workflow Rules

### Before starting any task
- Check the active phase's roadmap tracking doc (`ai/roadmaps/roadmap-phase*.md`) to understand what's already done and what's next
- Read the relevant phase plan (`ai/roadmaps/phase*.md`) for implementation detail

### While building
- Follow the PRD → plan → roadmap → implementation pipeline — don't freelance features
- Keep solutions minimal — only build what the current phase requires
- Don't add error handling, logging, or abstractions for scenarios that don't exist yet
- Commit frequently with meaningful messages — not one big commit per phase

### After completing a session
- Append an entry to `aiDocs/changelog.md` — date, what was built (technical), business impact (1–2 sentences), any deferred items
- Update checkboxes in the relevant roadmap tracking doc

---

## File Structure (Key Paths)

```
src/
  app/
    page.tsx                    ← Landing page + ProjectionCard
    setup/                      ← 4-step wizard (page, 529, utma, credit, done)
    auth/                       ← Magic-link auth pages
    account/                    ← Contribution slider (requires auth)
    admin/                      ← Event funnel dashboard (requires auth)
    g/[token]/                  ← Gift link landing
    api/                        ← All API routes
  components/
    ProjectionCard.tsx
    ProjectionChart.tsx
    StepLayout.tsx
    MarkAsDone.tsx
    IssuerInstructions.tsx
  data/
    statePlans.ts               ← All 50 states mapped to 529 plans
    issuerInstructions.ts       ← Chase, Amex, Citi, CapOne, Discover, Other
  lib/
    projection.ts               ← calcProjection() — pure math, no dependencies
    storage.ts                  ← localStorage helpers
    auth.ts                     ← createSession, getSession, deleteSession
    db.ts                       ← Database client (better-sqlite3 in Phase 2, Supabase in Phase 3+)
    events.ts                   ← trackEvent() — fire-and-forget
    syncProgress.ts             ← Reads localStorage, POSTs to /api/sync
aiDocs/                         ← Project documentation (committed)
ai/                             ← AI workspace: guides and roadmaps (gitignored)
```

---

## What Not To Do

- **Don't re-litigate locked decisions.** If something is in `aiDocs/decisions.md`, it's decided. Build around it.
- **Don't add features beyond the current phase.** If Phase 3 doesn't call for it, don't build it.
- **Don't use `NEXT_PUBLIC_` prefix on secrets.** It exposes them to the browser bundle.
- **Don't commit `.env.local` or `nestegg.db`.** Both are in `.gitignore`.
- **Don't use `better-sqlite3` in Phase 3+.** It won't work on Vercel's serverless runtime.
- **Don't write `console.log` for debugging in production code.** Use structured logging in API routes.
- **Don't skip the disclosure copy.** Every step and every projection must have it.
