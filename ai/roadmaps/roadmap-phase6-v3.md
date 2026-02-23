# Roadmap — Phase 6: V3

**Timeline:** Months 7–12
**Detailed plan:** [phase6-v3.md](phase6-v3.md)

> Phase 6 is about defensibility and scale — SEO moats, social proof loops, employer revenue, and the RIA/solicitor layer.
> Do not start until mobile is live, at least one revenue stream is generating, and you have 2,000+ registered users.

---

## Gate: Must Be True Before Starting Phase 6

- [ ] Phases 2–5 complete
- [ ] Mobile app live in both app stores
- [ ] At least one revenue stream generating (affiliate or subscription)
- [ ] 2,000+ registered users
- [ ] Legal structure confirmed for all active revenue streams
- [ ] Supabase schema confirmed sufficient, or migration to dedicated Postgres completed

---

## Success Criteria

- [ ] `/plans` state plan leaderboard live (public, SEO-indexed)
- [ ] Social proof counters on landing page, Step 1, and Done screen
- [ ] Contribution benchmark nudge in projection card (shows median contribution from real users)
- [ ] `stats_cache` table + automated nightly cron running in production
- [ ] 4 SEO content pages live at `/learn/`
- [ ] First employer paid contract signed
- [ ] Employer co-branded landing page generator live
- [ ] RIA solicitor agreement signed (or confirmed not needed based on legal review in Phase 5)
- [ ] 10,000 registered users by end of Month 12

---

## Milestone 1 (Month 7–8) — Data Flywheel

**Stats cache infrastructure:**
- [ ] Add `stats_cache` table to Supabase: `{ key text PK, value jsonb, updated_at timestamp }`
- [ ] Write nightly cron job (Supabase pg_cron or Vercel cron at `vercel.json`) to populate cache:
  - `total_users` — COUNT from `users`
  - `flows_completed` — COUNT of `flow_completed` events
  - `most_popular_plan` — top `step_529_plan_name` from `setup_progress`
  - `median_monthly_contribution` — median `monthly_contribution` from `children`
  - `users_by_state` — COUNT grouped by `state` from `children`
- [ ] `GET /api/stats` — reads from `stats_cache`, returns JSON (public endpoint, no auth required)
- [ ] Cache TTL: cron runs nightly at midnight, stale data < 24 hours old is acceptable

**Social proof on product:**
- [ ] Landing page: "X families have started their NestEgg" (from `flows_completed` cache)
- [ ] Step 1 (`/setup/529`): "X families in [State] chose [Plan Name]" (from `users_by_state` + most popular plan per state)
- [ ] Done screen: "Join X families who set up their child's financial foundation today"
- [ ] All social proof numbers read from `/api/stats` — never hardcoded

**Contribution benchmark nudge:**
- [ ] Update `ProjectionCard.tsx` — add a line below the projection output:
  - "NestEgg families contribute $[median]/month on average"
  - Only show if `median_monthly_contribution` is available from stats cache
  - Never show a number that could be construed as a recommendation

**`/plans` leaderboard:**
- [ ] Build `/plans` page — public, no login required
  - Table: state, recommended plan name, number of NestEgg families using it
  - Sorted by user count descending
  - SEO: title "Best 529 Plans by State — NestEgg", meta description
- [ ] Build `/plans/[state]` dynamic route
  - State-specific page: "Best 529 Plan for [State] Residents"
  - Shows plan name, why it's recommended (deduction or low fees), link to open
  - Static generation (`generateStaticParams` from `statePlans.ts`)
  - These pages are SEO targets — each one indexes for "[State] 529 plan" queries
- [ ] Submit updated sitemap to Google Search Console

---

## Milestone 2 (Month 8–9) — SEO Content

- [ ] Build `/learn/` content hub (index page listing all articles)
- [ ] Write and publish 4 SEO content articles:
  - [ ] `/learn/529-plan-basics` — "What Is a 529 Plan? A Plain-Language Guide for New Parents"
  - [ ] `/learn/utma-vs-529` — "UTMA vs 529: Which Account Should You Open for Your Child?"
  - [ ] `/learn/authorized-user-credit-card-kids` — "How to Give Your Child a 10-Year Credit History Head Start"
  - [ ] `/learn/how-much-to-save-for-college` — "How Much Should You Save Per Month for College?"
- [ ] Each article:
  - [ ] 800–1,200 words, plain language, written for new parents who've never heard of a 529
  - [ ] Schema markup: `Article` (author, datePublished, dateModified) + `FAQPage` where applicable
  - [ ] Internal links to projection card and "Set this up free →" CTA
  - [ ] Disclosure at bottom: "NestEgg is a financial education tool, not a registered investment adviser."
- [ ] Submit sitemap update to Google Search Console after each article goes live
- [ ] Add `/learn/` links to site footer

---

## Milestone 3 (Month 9–10) — Employer Revenue

- [ ] Define employer pricing model (pick one before building):
  - Per-seat annual fee (e.g., $5/employee/year)
  - Per-event fee (e.g., $50 per employee who completes the flow)
  - Flat annual license (e.g., $500/year for companies under 100 employees)
- [ ] Draft employer contract template (with legal review)
- [ ] Goal: first employer paid contract signed

**Employer co-branded landing page generator:**
- [ ] Add `employers` table to Supabase: id, name, slug (UNIQUE), logo_url, custom_headline, contact_email, created_at
- [ ] Admin UI (`/admin`): add employer form → generates slug → returns `/e/[slug]` URL
- [ ] Build `/e/[employer-slug]` dynamic route:
  - Shows employer logo + custom headline
  - Projection card pre-loaded (no pre-fill — let the employee enter their own data)
  - UTM auto-appended: `utm_source=employer&utm_medium=[slug]`
  - "Powered by NestEgg" footer
- [ ] Track `employer_flow_started` and `employer_flow_completed` events with `employer_id` property
- [ ] Build employer reporting view in `/admin`: per-employer funnel data (starts, completions, conversion rate)
- [ ] Deliver reporting to employer contact monthly (manual export or automated email)

---

## Milestone 4 (Month 10–12) — RIA / Portfolio Recommendations (Conditional)

> Only proceed if legal counsel in Phase 5 confirmed a path to personalized portfolio recommendations
> (either via solicitor agreement or full RIA registration).

- [ ] Solicitor agreement in final review or signed
- [ ] If live: add portfolio recommendation step to setup flow after 529 plan selection
  - Shown only to users who opted into personalized recommendations
  - Age-based recommendation: aggressive (age 0–8), moderate (8–14), conservative (14–18)
  - Copy must be reviewed by counsel — cannot cross into personalized investment advice without proper registration
  - Example framing: "Most families in [State] with a child [age] choose the age-based moderate portfolio"
- [ ] Add `portfolio_recommendation_shown` and `portfolio_recommendation_clicked` events
- [ ] Update all affiliate/solicitor disclosures to reflect new step
- [ ] Disclosures reviewed and approved by counsel before going live

---

## Gate: End of Phase 6

- [ ] All success criteria above checked
- [ ] 10,000 registered users
- [ ] At least one employer paying under a signed contract
- [ ] Mobile app rated 4.0+ in both app stores (based on reviews)
- [ ] Revenue positive: affiliate + employer revenue covers Supabase, Resend, Vercel, and Expo infrastructure costs
- [ ] `/plans` pages indexed by Google (check Search Console)
- [ ] Legal structure fully confirmed for all active revenue streams — no open questions
