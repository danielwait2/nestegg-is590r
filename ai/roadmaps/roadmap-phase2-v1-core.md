# Roadmap — Phase 2: Local MVP (Persistence + Auth)

**Timeline:** 2 weeks
**Detailed plan:** [phase2-v1-core.md](phase2-v1-core.md)

> No external APIs. No email sending. No cron jobs. Runs on localhost.
> `nestegg.db` auto-creates on first `npm run dev`. Auth link appears in the terminal console.

---

## Success Criteria

- [x] SQLite DB auto-creates on first `npm run dev`
- [x] Sign-in link appears in the terminal console
- [x] Signed-in users see progress restored after clearing localStorage
- [~] Gift links work and click count increments in `nestegg.db` — PARTIAL (query-param fallback only; `/api/gift` not wired to Done screen for signed-in users)
- [x] `/account` updates contribution and re-projects
- [x] `/admin` shows real funnel data
- [x] `npm run build` passes with zero errors
- [x] No external API calls at any point

---

## Week 1 — Auth + Persistence

### Day 1–2: SQLite Setup

- [x] Install `better-sqlite3` and `@types/better-sqlite3`
- [x] Create `src/lib/db.ts` — initializes `nestegg.db`, creates all tables on first run
  - [x] `users` table (id, email UNIQUE, created_at)
  - [x] `sessions` table (id, user_id FK, token UNIQUE, expires_at, created_at)
  - [x] `children` table (id, user_id FK, name, birth_month, birth_year, state, monthly_contribution DEFAULT 50, created_at)
  - [x] `setup_progress` table (id, child_id FK, step_529_done, step_529_plan_name, step_utma_done, step_credit_done, step_credit_issuer, completed_at, created_at)
  - [x] `events` table (id, user_id nullable, event, properties, created_at)
  - [x] `gift_links` table (id, user_id FK, child_id FK, token UNIQUE, clicks DEFAULT 0, created_at)
- [x] Add `nestegg.db` to `.gitignore`
- [x] Create `src/lib/auth.ts`
  - [x] `createSession(email)` — upsert user, generate crypto token, insert session (30-day expiry), return token
  - [x] `getSession(token)` — validate token not expired, return `{ userId, email }` or null
  - [x] `deleteSession(token)` — delete session row

### Day 3–4: Auth Pages + API Routes

- [x] `POST /api/auth/send` — creates session, logs confirm link to console, returns `{ ok: true }` (token never in response body)
- [x] `GET /api/auth/confirm` — validates token, sets httpOnly cookie `nestegg_session`, redirects to `/setup/done`
- [x] `POST /api/auth/signout` — deletes session from DB, clears cookie
- [x] Build `/auth/page.tsx` — email input form, shows "Check the server console for your sign-in link" after submit
- [x] Build `/auth/confirm/page.tsx` — reads `token` from query param, hits confirm route, redirects automatically

### Day 5: Progress Sync

- [x] `POST /api/sync` — requires session cookie, upserts to `children` and `setup_progress`, returns `{ ok: true }`
- [x] `GET /api/me` — requires session cookie, returns child + progress from SQLite or `null`
- [x] Create `src/lib/syncProgress.ts` — reads localStorage, POSTs to `/api/sync`
- [x] Done screen: call `syncProgress` on mount if session cookie is present
- [x] Done screen: add "Save your progress →" CTA linking to `/auth`

---

## Week 2 — Gift Links, Account, Admin, Polish

### Day 6–7: Return Flow + Event Tracking

- [~] After `/auth/confirm`, call `GET /api/me` and show welcome-back banner if child found — MISSING (no welcome-back banner)
- [x] Create `src/lib/events.ts` — `trackEvent(event, properties?)` fires POST to `/api/events`, fire-and-forget, never throws
- [x] `POST /api/events` — inserts to `events` table, reads `user_id` from session cookie (null if not signed in)
- [x] Add `trackEvent('projection_interacted')` on first slider move
- [x] Add `trackEvent('flow_started')` on Step 0 submit
- [x] Add `trackEvent('step_529_completed')` when 529 step is marked done
- [x] Add `trackEvent('step_utma_completed')` when UTMA step is marked done
- [x] Add `trackEvent('step_credit_completed')` when credit step is marked done
- [x] Add `trackEvent('flow_completed')` on Done screen when all 3 are checked
- [x] Add `trackEvent('share_link_clicked')` on share/copy button
- [~] Add `trackEvent('gift_link_clicked')` on `/g/[token]` page load — PARTIAL (tracked on Done page, not on gift page load)

### Day 8–9: Gift Links + /account

- [x] `POST /api/gift` — requires session cookie, generates 8-char token, inserts to `gift_links`, returns `{ token }`
- [x] `/g/[token]/page.tsx` — reads gift link from SQLite, increments `clicks`, renders projection card pre-filled with child name + birth year
- [~] Update Done screen `GiftLinkGenerator` — signed-in users call `/api/gift`; anonymous users fall back to query-param URL — PARTIAL (both signed-in and anonymous use query-param URL)
- [x] Build `/account/page.tsx` — requires session cookie (redirect to `/auth` if not), shows contribution slider, live re-projection
- [x] `PATCH /api/me/contribution` — updates `children.monthly_contribution` in SQLite
- [x] Add projection nudge to `ProjectionCard.tsx` — dashed second line at `monthly + 25`, label "That's $[X] more by [Name]'s 18th birthday"

### Day 10: Admin Page

- [x] Build `/admin/page.tsx` — server component, checks session cookie email against `ADMIN_EMAIL` env var
- [x] Query: total user count from `users`
- [x] Query: event funnel — COUNT per event type from `events`
- [x] Query: most common 529 plans — GROUP BY `step_529_plan_name`
- [x] Query: most common card issuers — GROUP BY `step_credit_issuer`
- [x] Render as simple tables (no charts needed)

---

## Gate: Before Considering Phase 3+

- [x] `npm run build` passes with zero errors
- [ ] Full flow tested end-to-end: project → sign in → sync → clear localStorage → sign in again → progress restored
- [ ] Gift link generates, opens, and increments click count in `nestegg.db`
- [ ] `/admin` shows real data from at least one test run
- [x] No external API calls confirmed (no Resend, no SMTP, no analytics endpoints)
