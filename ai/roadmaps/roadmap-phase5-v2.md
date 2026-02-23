# Roadmap — Phase 5: V2

**Timeline:** Months 4–6
**Detailed plan:** [phase5-v2.md](phase5-v2.md)

> Phase 5 has two hard prerequisites before any code is written:
> (1) Legal counsel has answered the RIA/solicitor/affiliate question.
> (2) Revenue model is confirmed and logged in `aiDocs/decisions.md`.
> Do not build affiliate links or a subscription paywall without legal sign-off.

---

## Gate: Must Be True Before Starting Phase 5

- [ ] Phase 4 complete — all success criteria checked
- [ ] 500+ real users through the complete flow
- [ ] Legal counsel engaged and RIA/affiliate structure confirmed
- [ ] Revenue model decision logged in `aiDocs/decisions.md`
- [ ] At least one affiliate partner in negotiation (if affiliate route chosen)
- [ ] `npm run build` passes with zero errors

---

## Success Criteria

- [ ] Expo app submitted to App Store and Google Play
- [ ] Legal review complete — affiliate/RIA structure confirmed in writing
- [ ] At least one revenue stream live and generating (affiliate click revenue or subscription)
- [ ] Insurance marketplace (term life + will cards) on Done screen
- [ ] All affiliate/compensation disclosures reviewed by counsel and live on affected pages
- [ ] Supabase schema confirmed sufficient (no migration needed, or migration completed)

---

## Milestone 1 (Month 4) — Legal + Revenue Structure

- [ ] Brief legal counsel: share PRD, decisions.md, current product flow
  - Key question: does recommending specific 529 plan providers (not securities) require RIA registration or a solicitor agreement?
  - Key question: does receiving affiliate revenue from a 529 plan provider require RIA or solicitor status?
- [ ] Review UNest and Backer public disclosures — document patterns in `aiDocs/decisions.md`
- [ ] Legal delivers written answer: affiliate OK / solicitor required / RIA required
- [ ] Based on legal answer, make revenue model decision:
  - **Affiliate (solicitor agreement):** identify 2–3 529 plan provider contacts (Utah my529, Fidelity, Vanguard)
  - **Flat-fee subscription:** design pricing tier (e.g., $4.99/month or $29/year for return-to-progress + reminders) + Stripe integration spec
  - **Hybrid:** affiliate for 529/UTMA + subscription for premium features
- [ ] Decision logged in `aiDocs/decisions.md` before any code is written
- [ ] If affiliate: draft solicitor agreement template with counsel; initiate partner outreach
- [ ] If subscription: define which features are free vs. paid; design upgrade flow

---

## Milestone 2 (Month 4–5) — Mobile App (Expo)

- [ ] Initialize Expo project: `npx create-expo-app nestegg-mobile --template`
  - TypeScript template
  - Same GitHub org/repo or monorepo alongside web app
- [ ] Extract shared logic to `packages/core` (or `src/shared/` in monorepo):
  - [ ] `calcProjection()` — identical to web
  - [ ] `statePlans.ts` — state → plan map
  - [ ] `issuerInstructions.ts` — issuer → steps
  - [ ] Type definitions
- [ ] Build core mobile screens:
  - [ ] Home screen — projection card (slider, birth year, live output)
  - [ ] Setup flow — 4 screens mirroring web wizard (child context, 529, UTMA, credit)
  - [ ] Done screen — summary card, share button
  - [ ] Account screen — contribution slider, live re-projection, save
  - [ ] Settings screen — notification preferences, sign out
- [ ] Auth: magic-link flow
  - Send link opens device browser for confirmation
  - On return, app reads session from Supabase (deep link or manual entry)
  - Same Supabase project as web — shared user records
- [ ] Push notifications via Expo Notifications:
  - [ ] Contribution reminder (monthly/quarterly) — opt-in on Done screen
  - [ ] Birthday notification — child's 1st, 5th, 10th, 18th birthdays
  - [ ] Set `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` env vars
- [ ] App Store submission:
  - [ ] App icon + splash screen
  - [ ] Screenshots for all required device sizes
  - [ ] App description + keywords (ASO)
  - [ ] Privacy policy page live at `nestegg.app/privacy`
  - [ ] Age rating: 4+ (no user-generated content, no adult content)
  - [ ] Submit for review
- [ ] Google Play submission:
  - [ ] Same assets adapted for Play Store requirements
  - [ ] Submit for review

---

## Milestone 3 (Month 5–6) — Revenue Live

**If affiliate route (solicitor agreement):**
- [ ] Solicitor agreement signed with at least one 529 plan provider
- [ ] Disclosure language drafted by counsel: "NestEgg may receive compensation if you open an account through our link"
- [ ] Replace "Open [Plan] →" button with tracked affiliate links in `statePlans.ts`
- [ ] Add affiliate disclosure to `/setup/529` and Done screen
- [ ] Add `affiliate_click` event type to event tracking
- [ ] Verify disclosure language is present on every page that links to a provider

**If subscription route:**
- [ ] Stripe integration
  - [ ] Install `stripe` npm package
  - [ ] Set `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` env vars
  - [ ] `POST /api/stripe/checkout` — creates Stripe checkout session
  - [ ] `POST /api/stripe/webhook` — handles `checkout.session.completed`, updates `users.is_subscribed`
  - [ ] `/pricing` page — free tier vs. paid tier feature comparison + CTA
  - [ ] Paywalled features: return-to-progress across devices, email reminders, account page
  - [ ] Upgrade prompt at the right moment (e.g., Done screen "Save your progress" CTA)

**Insurance marketplace (both routes):**
- [ ] Research partner: Fabric (Gerber Life, term life + wills) or similar API/affiliate
- [ ] Add two cards to Done screen below the summary:
  - Term life insurance: "Protect the income behind this plan — [Partner]"
  - Will + estate planning: "Name a guardian while you're at it — [Partner]"
- [ ] Track `insurance_cta_clicked` event
- [ ] Add affiliate disclosure if compensation is received from insurance partner
- [ ] Disclosure reviewed by counsel before going live

---

## Gate: Before Moving to Phase 6

- [ ] All success criteria above checked
- [ ] Mobile app live in both app stores with > 0 downloads
- [ ] At least one revenue stream generating (first dollar of affiliate revenue or subscription payment)
- [ ] 500+ users still active (not just total signups — returning users or subscription holders)
- [ ] Legal structure fully confirmed in writing for all active revenue streams
- [ ] All affiliate/compensation disclosures live and counsel-reviewed
- [ ] `npm run build` passes with zero errors
