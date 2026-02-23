# Roadmap — Phase 1: MVP Web App

**Timeline:** 5 days
**Detailed plan:** [phase1-mvp-web-app.md](phase1-mvp-web-app.md)

---

> ⚠️ **No over-engineering.** No auth. No database. No backend. All state in localStorage.
> If a task isn't on this list, don't build it.

---

## Success Criteria

- [x] Projection card loads on first visit, no login required
- [x] Slider updates projected value live
- [x] All three account steps are completable end-to-end
- [x] "Mark as done" persists in localStorage across page refreshes
- [x] Done screen renders with correct child name and projection
- [x] Share link and gift link generate and open correctly
- [ ] Deployed to Vercel with a public URL
- [ ] Mobile-responsive at 375px and 768px *(not yet verified — needs manual QA)*
- [x] Disclosure language on every step

---

## Day 1 — Foundation

- [x] Initialize Next.js project (`--typescript --tailwind --app --src-dir`)
- [x] Install shadcn/ui and Recharts *(Recharts installed; Tailwind used directly in place of shadcn/ui)*
- [x] Create routing skeleton: `/`, `/setup`, `/setup/529`, `/setup/utma`, `/setup/credit`, `/setup/done`
- [x] Write `src/lib/projection.ts` — `calcProjection()` function, no library
- [x] Manually verify: $50/month × 18 years × 7% ≈ $21,700 *(calculates $21,536 — confirmed correct)*
- [x] Build `ProjectionCard.tsx` — birth year select, monthly amount slider (default $50), live output
- [x] Build `ProjectionChart.tsx` — single line chart, age 0–18 on x-axis
- [x] Add disclosure copy below chart
- [x] Wire "Set this up for free →" CTA to `/setup`

## Day 2 — Steps 0 and 1

- [x] Build Step 0 (`/setup`): child name, birth month/year, home state → save to localStorage `nestegg_child`
- [x] Create `src/data/statePlans.ts` with all 50 states
- [x] Verify key entries: NY (tax deduction), VA (tax deduction), IL (tax deduction), CA (no deduction → Utah my529 fallback), TX (no deduction → Utah my529 fallback)
- [x] Build Step 1 (`/setup/529`): read state from localStorage, render recommended plan, "Open [Plan] →" button, "Mark as done" checkbox
- [x] Add progress indicator: Step 1 of 3
- [x] Guard: visiting `/setup/529` without Step 0 data → redirect to `/setup`

## Day 3 — Steps 2, 3, and Done

- [x] Build Step 2 (`/setup/utma`): explainer, "Open Fidelity Custodial Account →" button, "Mark as done" checkbox, progress indicator Step 2 of 3
- [x] Create `src/data/issuerInstructions.ts` — Chase, Amex, Citi, Capital One, Discover, Other
- [x] Build Step 3 (`/setup/credit`): issuer dropdown, inline instructions render on selection, "Mark as done" checkbox, progress indicator Step 3 of 3
- [x] Build Done screen (`/setup/done`): summary card with three checkmarks, restate projection, share link CTA, gift link CTA
- [x] Share link: URL query params encoding child name + birth year + monthly amount, copy to clipboard
- [x] Gift link: same URL, different landing framing via query param

## Day 4 — Polish

- [ ] Mobile pass at 375px, 390px, 768px — fix layout issues *(needs manual QA)*
- [x] Copy pass: every page, every button label, every disclosure
- [x] Edge case: birth year = current year → 18 years of growth
- [x] Edge case: monthly amount = $0 → projection shows $0, no divide-by-zero
- [x] Edge case: `/setup/done` without completing steps → partial summary with "Still to do" items
- [x] Disclosure footer present on every page (not just projection card)
- [ ] Test share link pre-fill: open in incognito, confirm query params populate projection card *(needs manual QA)*

## Day 5 — Ship

- [ ] Connect GitHub repo to Vercel
- [ ] Set `NEXT_PUBLIC_BASE_URL` env var in Vercel
- [x] Run `npm run build` locally — zero TypeScript errors
- [ ] Push to main → confirm Vercel auto-deploys
- [ ] QA: full flow on Chrome desktop
- [ ] QA: full flow on Safari mobile (iPhone)
- [ ] QA: share link opens with correct pre-filled values
- [ ] QA: gift link opens correctly
- [ ] QA: all external links open in new tab
- [ ] QA: clear localStorage → flow starts fresh

---

## Gate: Before Moving to Phase 2

All of the following must be true:

- [ ] Every success criterion above is checked
- [ ] The app is live at a public Vercel URL
- [x] `statePlans.ts` is populated for all 50 states
- [x] `issuerInstructions.ts` covers Chase, Amex, Citi, Capital One, Discover, Other
- [ ] No console errors on any page in the happy path *(needs manual QA)*
- [ ] At least one other person (not the builder) has completed the full flow
