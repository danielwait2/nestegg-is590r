# Phase 3 — V1 Polish *(Deferred)*

**Status:** Deferred — complete Phase 2 (Local MVP) first.
**Original timeline:** Weeks 5–8
**Original goal:** Automated contribution reminders, a working gifting flow, and notifications — turning NestEgg from a one-time setup wizard into something parents return to.

---

## Why Deferred

Phases 3–6 introduce external services (email APIs, push notifications, mobile apps, affiliate partners, analytics platforms) that are out of scope until the local MVP is validated with real users.

## When to Revisit

Come back to this phase when:
- Phase 2 is complete and `npm run build` passes
- The full flow has been tested end-to-end locally
- Admin funnel data shows real drop-off points worth fixing
- You have at least a handful of real users whose feedback informs polish priorities

## Original Deliverables (for reference)

- [ ] Gift link: unique token URLs, pre-filled projection, click + conversion tracking
- [ ] Gift link generator on Done screen (copy + Web Share API)
- [ ] Contribution reminder emails (monthly or quarterly, opt-in)
- [ ] Birthday push notification (opt-in)
- [ ] Editable monthly contribution in `/account`
- [ ] Projection nudge ("what if $X more?")
- [ ] SEO: title, meta, OG image, FAQ schema on landing page
- [ ] NPS email + `/feedback` response capture at D+7
- [ ] Lighthouse score > 90 on landing page
- [ ] Top 2–3 drop-off issues fixed based on Phase 2 event data
