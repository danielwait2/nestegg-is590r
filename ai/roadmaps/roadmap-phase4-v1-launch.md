# Roadmap — Phase 4: V1 Launch

**Timeline:** Weeks 9–12
**Detailed plan:** [phase4-v1-launch.md](phase4-v1-launch.md)

> Phase 4 is about getting real users — not building more features.
> The goal is 500 people through the complete flow and 5 written testimonials.
> Resist the urge to polish instead of distribute.

---

## Gate: Must Be True Before Starting Phase 4

- [ ] Phase 3 complete — all success criteria checked
- [ ] App live at a public URL with a custom domain
- [ ] Supabase migration complete — no SQLite in production
- [ ] Email reminders + NPS working
- [ ] Lighthouse > 90 on landing page
- [ ] Legal review of copy and disclosures completed
- [ ] At least 10 real users through the full flow in production

---

## Success Criteria

- [ ] Beta waitlist page live with email capture
- [ ] Floating feedback modal deployed on all pages (except auth)
- [ ] UTM source tracking end-to-end (source → event stored in DB)
- [ ] `/clinic` landing page live with downloadable print handout
- [ ] 3 pediatric or OB-GYN practices distributing NestEgg materials
- [ ] `/employers` landing page live with employer one-pager
- [ ] 5 employer benefits conversations initiated (email/call)
- [ ] 500 real users through the complete flow
- [ ] 5 written testimonials collected
- [ ] `/babylist` or partner landing page live (if partnership confirmed)

---

## Week 1 — Beta Infrastructure + UTM Tracking

- [ ] Add `beta_feedback` table to Supabase: id, user_id (nullable), rating int, text, path, created_at
- [ ] Build floating feedback modal component
  - Appears bottom-right after user has been on any page > 30 seconds
  - Dismissable (stores dismissed state in localStorage so it doesn't re-appear same session)
  - Not shown on `/auth`, `/auth/confirm`, `/admin`
  - "How's NestEgg?" → 1–5 star or thumbs up/down + optional text
- [ ] `POST /api/feedback/beta` — stores rating + text + current path in `beta_feedback`
- [ ] Build `/waitlist` page
  - Headline: "NestEgg is live — join the families setting their kids up for life"
  - Email input + "Join waitlist" CTA
  - Social proof placeholder (update once real numbers exist)
- [ ] Add `waitlist` table to Supabase: id, email UNIQUE, utm_source, created_at
- [ ] `POST /api/waitlist` — upserts email to waitlist table
- [ ] UTM tracking implementation
  - On landing page load: read `utm_source`, `utm_medium`, `utm_campaign` from URL query params
  - Store in localStorage: `nestegg_utm`
  - Attach UTM fields to all `trackEvent()` calls as properties
  - `POST /api/events` — save UTM properties alongside event
- [ ] Verify UTM data flows into Supabase `events` table correctly

---

## Week 2 — Clinic Distribution Channel

- [ ] Build `/clinic` landing page
  - URL: `/clinic` (simple, printable on a handout)
  - Audience: parents in a waiting room who just scanned a QR code
  - Headline: "Your pediatrician thinks you should know about this."
  - Show projection card (pre-filled at $50/month, current year)
  - CTA: "Set this up for free →" links to `/setup`
  - No login prompt, no distractions
  - UTM auto-appended: `utm_source=clinic`
- [ ] Build print handout (printable HTML at `/clinic/handout` or PDF via `/public`)
  - One page, large text
  - Headline: "Set your new baby up for life — in 10 minutes"
  - QR code → `nestegg.app/clinic`
  - Three bullets: 529 Plan, UTMA Account, Credit History
  - Projection example: "$50/month → $21,500 by age 18"
  - Footer disclaimer: financial education tool, not financial advice
- [ ] Identify 3 target clinics (pediatric or OB-GYN, local or via network)
- [ ] Draft outreach email/script for clinic office managers
- [ ] Goal: 3 practices agree to display QR code or distribute handouts
- [ ] Track `/clinic` UTM events in `/admin` to measure channel performance

---

## Week 3 — Partner + Employer Channels

**Employer channel:**
- [ ] Build `/employers` landing page
  - Audience: HR benefits managers, founders, people ops leads
  - Headline: "Give new parents the most impactful benefit you've never heard of."
  - Three bullets: 529 setup, UTMA setup, credit history head start — all in 10 minutes
  - Social proof (update with real numbers once available)
  - CTA: "Get the employer one-pager" (email capture → `waitlist` table with `utm_source=employers`)
- [ ] Build employer one-pager (printable HTML at `/employers/one-pager` or PDF)
  - One page
  - Headline: "NestEgg for Employee Benefits"
  - Value prop, how it works, pricing/contact CTA
  - Compliance note: financial education tool, not investment management
- [ ] Identify 5 target employers (startups with people ops, mid-size companies with benefits programs)
- [ ] Initiate 5 employer benefits conversations (email outreach using one-pager)

**Baby registry / partner channel (if applicable):**
- [ ] Build `/babylist` or `/bump` landing page if partnership is in progress
  - Pre-fill projection card with referral context
  - Headline tailored to gift/registry use case: "Start [Baby's Name]'s NestEgg as a gift"
  - UTM: `utm_source=babylist` or `utm_source=bump`
- [ ] If no partnership: build `/gift` landing page as a standalone gifting entry point
  - For grandparents and family members who receive a gift link directly

---

## Week 4 — Launch Metrics + Testimonials

- [ ] Review `/admin` funnel — track progress toward 500-user milestone
- [ ] Review UTM data — which channel (clinic, employer, direct, social) is converting best
- [ ] Active outreach for written testimonials
  - Pull list of users who completed the full flow from Supabase (`flow_completed` events)
  - Send personal email asking for a quote: "What made you try NestEgg? What happened after?"
  - Goal: 5 quotes with name (or first name + state) and permission to publish
- [ ] Add testimonials to landing page once collected (above the fold or below projection card)
- [ ] Decide if any distribution channel warrants doubling down before Phase 5
  - If clinic channel is working: identify 5 more clinics
  - If employer channel is working: build more employer-specific features
  - If organic/social is working: invest in SEO content earlier (pull from Phase 6)
- [ ] Legal counsel engaged on RIA/solicitor/affiliate structure (required before Phase 5)
- [ ] Revenue model decision documented in `aiDocs/decisions.md` before any Phase 5 code is written

---

## Gate: Before Moving to Phase 5

- [ ] All success criteria above checked
- [ ] 500 real users through the complete flow (verified in Supabase)
- [ ] 5 written testimonials collected with permission to publish
- [ ] At least 3 external distribution touchpoints active (clinic, employer, partner, or social)
- [ ] Legal counsel engaged — RIA/affiliate question answered
- [ ] Revenue model decision logged in `aiDocs/decisions.md`
- [ ] Domain and branding finalized (no placeholder names, no `.vercel.app` URL)
- [ ] `npm run build` passes with zero errors
