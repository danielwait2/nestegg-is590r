# Roadmap — Phase 3: V1 Polish

**Timeline:** Weeks 5–8
**Detailed plan:** [phase3-v1-polish.md](phase3-v1-polish.md)

> Phase 3 starts with the Supabase migration — SQLite (better-sqlite3) will not work on Vercel's serverless functions.
> Migration unlocks public deployment and email. Do not skip it.

---

## Gate: Must Be True Before Starting Phase 3

- [ ] Phase 2 complete — all success criteria checked
- [ ] `npm run build` passes with zero errors locally
- [ ] Full flow tested end-to-end locally: project → sign in → sync → clear localStorage → sign in again → progress restored
- [ ] Admin funnel reviewed — at least one test run with real event data
- [ ] All 3 known Phase 2 gaps documented and ready to fix

---

## Success Criteria

- [ ] Supabase DB live in production with full schema migrated from SQLite
- [ ] App deployed to Vercel at a public URL
- [ ] Auth + sync works end-to-end in production (not just localhost)
- [ ] All 3 Phase 2 gaps resolved (gift link wiring, welcome-back banner, gift_link_clicked event)
- [ ] Contribution reminder email sends correctly to opted-in users
- [ ] D+7 NPS email fires and `/feedback` captures responses
- [ ] SEO metadata on all pages (title, description, OG image)
- [ ] Lighthouse score > 90 on landing page
- [ ] Mobile-responsive confirmed at 375px and 768px

---

## Week 1 — Supabase Migration + Deployment

- [ ] Create Supabase project (free tier) — copy URL, anon key, service role key
- [ ] Set env vars locally in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Install `@supabase/supabase-js` and `@supabase/ssr`
- [ ] Recreate schema in Supabase (SQL editor):
  - [ ] `users` table (id uuid PK, email text UNIQUE, created_at)
  - [ ] `sessions` table (id uuid PK, user_id FK, token text UNIQUE, expires_at, created_at)
  - [ ] `children` table (id uuid PK, user_id FK, name, birth_month, birth_year, state, monthly_contribution DEFAULT 50, created_at)
  - [ ] `setup_progress` table (id uuid PK, child_id FK, step_529_done, step_529_plan_name, step_utma_done, step_credit_done, step_credit_issuer, completed_at, created_at)
  - [ ] `events` table (id uuid PK, user_id nullable FK, event text, properties jsonb, created_at)
  - [ ] `gift_links` table (id uuid PK, user_id FK, child_id FK, token text UNIQUE, clicks DEFAULT 0, created_at)
- [ ] Rewrite `src/lib/db.ts` — replace better-sqlite3 with Supabase client
- [ ] Rewrite `src/lib/auth.ts` — createSession, getSession, deleteSession using Supabase
- [ ] Update all API routes to use Supabase client (no more raw SQL)
- [ ] Remove `better-sqlite3` and `@types/better-sqlite3` from package.json
- [ ] Remove webpack externals for better-sqlite3 from `next.config.ts`
- [ ] Remove `nestegg.db` reference (already gitignored, confirm it's deleted)
- [ ] `npm run build` passes with zero errors
- [ ] Connect GitHub repo to Vercel (if not already done)
- [ ] Set all env vars in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_BASE_URL`
- [ ] Push to main → confirm Vercel auto-deploys
- [ ] Verify auth flow in production: sign in → console log disappears → use Supabase instead
- [ ] Verify sync flow in production: complete flow → `/api/sync` → check Supabase dashboard

---

## Week 2 — Phase 2 Gaps + End-to-End QA

- [ ] Fix: wire Done screen gift link to `/api/gift` for signed-in users
  - Signed-in: call `POST /api/gift` → share `[base_url]/g/[token]`
  - Anonymous: fall back to query-param URL (existing behavior)
- [ ] Fix: add `trackEvent('gift_link_clicked')` on `/g/[token]` page load
- [ ] Fix: add welcome-back banner after `/auth/confirm` redirect
  - Call `GET /api/me` after confirm → if child found, show "Welcome back — [Name]'s setup is saved."
- [ ] Full end-to-end QA in production (not localhost):
  - [ ] Full flow on Chrome desktop
  - [ ] Full flow on Safari mobile (iPhone)
  - [ ] Share link opens with correct pre-filled values in incognito
  - [ ] Gift link generates, opens `/g/[token]`, click count increments in Supabase
  - [ ] All external links open in new tab
  - [ ] localStorage cleared → flow starts fresh
- [ ] `/admin` shows real event data from production test run
- [ ] Mobile layout verified at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)

---

## Week 3 — Email + NPS (Resend)

- [ ] Create Resend account — verify domain or use resend.dev subdomain for testing
- [ ] Set `RESEND_API_KEY` env var (local + Vercel)
- [ ] Add `email_subscriptions` column to `users` table (or separate table): `reminder_opted_in bool DEFAULT false`, `nps_sent_at timestamp nullable`
- [ ] Add opt-in checkbox to Done screen: "Email me a monthly reminder to contribute"
- [ ] `POST /api/email/subscribe` — stores email + opt-in preference for current user
- [ ] Build contribution reminder email template (React Email or plain HTML)
  - Subject: "Don't forget — [Name]'s NestEgg"
  - Body: restate projection, link to `/account` to update contribution
- [ ] Schedule reminder sends: Vercel cron (`vercel.json`) or Supabase pg_cron
  - Monthly cadence, only to opted-in users
- [ ] Build D+7 NPS email template
  - Subject: "Quick question about NestEgg"
  - Body: 1–10 scale, link to `/feedback?token=[user_token]`
- [ ] `POST /api/feedback` — stores NPS score + open text response in `feedback` table (id, user_id nullable, score int, text, created_at)
- [ ] Build `/feedback` page — NPS scale (1–10 radio or buttons) + optional open text field + submit
- [ ] Trigger NPS email: fire when `flow_completed` event is inserted, schedule send at D+7
- [ ] Test full email flow locally using Resend test mode

---

## Week 4 — SEO + Polish

- [ ] Add `<title>`, `<meta name="description">`, OG image, Twitter card to all pages
  - Landing page: "Set Your Kids Up for Life — NestEgg"
  - `/setup`: "Start Your Child's Financial Foundation — NestEgg"
  - `/setup/529`: "Open a 529 Plan for Your Child — NestEgg"
  - `/setup/done`: "Your Child's Financial Foundation Is Set — NestEgg"
- [ ] Build OG image: `src/app/opengraph-image.tsx` (Next.js static OG) or upload static PNG to `/public`
- [ ] Add FAQ schema markup (`application/ld+json`) on landing page:
  - "What is a 529 plan?"
  - "What is a UTMA account?"
  - "How do I add my child as an authorized user?"
  - "How much should I contribute per month?"
- [ ] Review Phase 2 event funnel in `/admin` — identify top 1–2 drop-off steps
- [ ] Fix top drop-off issues (at least 1 must be addressed before this week closes)
- [ ] Run Lighthouse on landing page in Chrome DevTools
  - [ ] Performance > 90
  - [ ] Accessibility > 90
  - [ ] SEO > 90
- [ ] Final copy pass: confirm all disclosures present, no "financial advice" language

---

## Gate: Before Moving to Phase 4

- [ ] All success criteria above checked
- [ ] App is live at a public URL with a custom domain (not just .vercel.app)
- [ ] At least 10 real users have completed the full flow in production
- [ ] `/admin` event funnel shows real data — top drop-off identified and addressed
- [ ] Email reminders and NPS email confirmed working end-to-end
- [ ] Legal review of all copy and disclosures completed by a human (not AI)
- [ ] `npm run build` passes with zero errors
