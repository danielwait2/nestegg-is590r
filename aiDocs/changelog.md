# NestEgg — Changelog

Append-only. One entry per AI session or meaningful work block.
Format: date, what was built (technical), business impact (1–2 sentences).

---

## 2026-02-24 — Interview-Driven UX Copy Improvements (Setup Flow)

**What was built:**
Added contextual copy to all three setup step pages based on user interview feedback:

- **529 page** (`src/app/setup/529/page.tsx`): Added "Good to know" callout addressing two common objections — (1) 529s work for trade/vocational schools and IT certs, not just 4-year colleges; (2) money doesn't disappear if unused for education, it just loses tax benefits on gains. Added SSN trust note ("NestEgg never stores your SSN"). Added "What to expect on the site" callout to orient users after clicking through to the plan site.
- **UTMA page** (`src/app/setup/utma/page.tsx`): Added "Why both a 529 and a UTMA?" explainer addressing Aaron's question about account tradeoffs. Added SSN trust note. Added "What to expect on the site" callout.
- **Credit page** (`src/app/setup/credit/page.tsx`): Added "What to expect" callout explaining where to find the "Add authorized user" option and clarifying the child doesn't need to use a card.

All 22 tests passing post-change (no logic changes, copy only).

**Business impact:**
Directly addresses the two biggest drop-off risks surfaced in user interviews: (1) parents skipping the 529 because they're unsure their child is "college-bound," and (2) users feeling lost after clicking through to official plan sites. The SSN trust notes reduce hesitation around the most sensitive data point in the flow.

---

## 2026-02-24 — Test-Log-Fix: calcProjection negative-input bug

**What was found:**
Running `./scripts/test.sh` (unit-only pass) confirmed all 20 existing tests green. Two new edge-case tests were added to `src/lib/projection.test.ts` to cover negative inputs:

- `calcProjection(-50, 18)` — negative monthly contribution
- `calcProjection(200, -5)` — negative years to grow

**Log output (failing run):**

```
FAIL src/lib/projection.test.ts > calcProjection > negative monthly contribution returns 0
AssertionError: expected -21536.051330174898 to be +0
  Received: -21536.051330174898

FAIL src/lib/projection.test.ts > calcProjection > negative years returns 0
AssertionError: expected -10100.39870023293 to be +0
  Received: -10100.39870023293

Test Files  1 failed | 1 passed (2)
Tests       2 failed | 20 passed (22)
```

**Diagnosis:**
`calcProjection` in `src/lib/projection.ts` had no guard against negative inputs. A negative `monthlyContribution` or negative `yearsToGrow` passed directly into the FV formula, producing a large negative projection value. If ever called with bad input (e.g., a malformed `?monthly=-50` URL param), the ProjectionCard would display a nonsensical negative dollar figure — directly violating the legal requirement that every projection be a meaningful hypothetical illustration.

**Fix applied:**
Added a single early-return guard at the top of `calcProjection`:

```ts
if (monthlyContribution < 0 || yearsToGrow < 0) return 0;
```

**Verification:**

```
✓ src/lib/projection.test.ts (13 tests)
✓ src/lib/auth.test.ts (9 tests)

Test Files  2 passed (2)
Tests       22 passed (22)
```

**Business impact:**
The projection engine now safely handles any negative input — a defensive fix that protects the UI from displaying invalid financial figures regardless of how the function is called. Zero regressions; 2 new tests added.

---

## 2026-02-23 — Phase 2 Local MVP Build (Persistence + Auth)

**What was built:**
Full persistence and auth layer on top of Phase 1: `src/lib/db.ts` (SQLite via `better-sqlite3`, 6 tables auto-created on first run: users, sessions, children, setup_progress, events, gift_links), `src/lib/auth.ts` (createSession, getSession, deleteSession with 30-day httpOnly cookie), `src/lib/events.ts` (fire-and-forget event tracker), `src/lib/syncProgress.ts` (reads localStorage, POSTs to /api/sync). All API routes: `POST /api/auth/send` (logs confirm link to terminal), `GET /api/auth/confirm` (sets cookie, redirects), `POST /api/auth/signout`, `POST /api/sync`, `GET /api/me`, `PATCH /api/me/contribution`, `POST /api/events`, `POST /api/gift`. New pages: `/auth`, `/auth/confirm`, `/account` (with AccountClient.tsx contribution slider + live re-projection), `/admin` (SQLite funnel + plan/issuer stats), `/g/[token]` (gift link with click increment). Event tracking added to all setup steps, Done screen, and ProjectionCard slider. Projection nudge added to ProjectionCard (+$25/mo comparison line). `next.config.ts` updated with webpack externals for `better-sqlite3`. `npm run build` passes with zero errors.

**Business impact:**
Users can now save progress to a local SQLite database by signing in via a magic link printed to the terminal — no email service required. The event funnel in `/admin` gives first-party behavioral data (projection interactions, step completions, flow completions) from day one, enabling data-driven iteration before any external analytics are added.

**Partial / deferred items:**
- Done screen gift link generator still uses query-param URL for all users (signed-in users should call `/api/gift` for DB-backed tokens — minor)
- `trackEvent('gift_link_clicked')` not fired on `/g/[token]` page load (tracked on send only)
- Welcome-back banner after `/auth/confirm` not implemented

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
