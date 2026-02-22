# NestEgg — Product Requirements Document

**Version:** 1.0
**Date:** February 2026
**Tagline:** Set Your Kids Up for Life.
**Build target:** 5-day MVP

---

## 1. Problem

82% of children have no 529 plan. 54% of parents have never heard of one. The barrier is not intent — it's the blank page. Parents who just had a baby are maximally motivated and have zero guidance on what to actually do. They land on a 2,000-word NerdWallet article and close the tab.

No product today walks a new parent through opening the right combination of accounts in a single session. Competitors either:
- Serve older kids (Greenlight, Acorns Early — ages 6–17)
- Solve gifting after an account already exists (Backer)
- Cover one account type at a time (UNest — UTMA only)
- Focus on protection, not wealth-building (Fabric — life insurance/wills)

The first 72 hours home with a new baby is an unoccupied moment of peak intent.

---

## 2. Solution

A guided web app that walks new parents through opening three accounts for their child — in under 10 minutes — with a personalized compounding projection that makes the outcome concrete before they commit to anything.

**The three accounts:**
1. **529 Plan** — tax-advantaged college savings
2. **UTMA Custodial Account** — flexible investing for any goal
3. **Authorized User Credit Card** — a 10+ year credit history head start

**The hook:** A real-time projection card — "Here's what $50/month becomes by [child's name]'s 18th birthday" — visible from the first screen, before any signup.

---

## 3. Target User

**Primary:** New parents (or expecting parents) in the US, ages 25–40, with a household income above $60K. Motivated to do the right thing for their child but overwhelmed by financial complexity.

**Secondary:** Grandparents or close family members who want to start a financial gift at birth.

**Not targeting:** Parents with older children (6+), teens learning to manage money, or users seeking active investment management. Those are other products.

---

## 4. Competitive Positioning

| Competitor | Their moment | Their gap vs NestEgg |
|---|---|---|
| Greenlight | Ages 6–17, daily spending | Not for newborns; no 529/UTMA/credit trifecta |
| Backer | Post-529 gifting | Starts after account exists; 529 only |
| UNest | UTMA for any age | One account type; no 529 or credit bundling |
| Fabric | Birth, but protection | Insurance/wills only; no investing or credit |
| State 529 portals | Already-aware parents | Plan-by-plan; no cross-account guided flow |

NestEgg's position: **The only product that orchestrates 529 + UTMA + authorized user credit card in a single guided session for brand-new parents.**

---

## 5. Core Product — MVP Scope

### 5.1 The Projection Card (above the fold, no login required)

The first thing a user sees is a live, interactive projection — not a marketing headline, not a form.

**Inputs (two fields):**
- Child's birth year (or "just born")
- Monthly contribution amount (default: $50, slider or input)

**Output:**
- Projected value at age 18, using a fixed 7% average annual return
- Displayed as: `"$50/month → $[X] by [child name or 'your child']'s 18th birthday"`
- A simple line chart showing the compounding curve

**Rules:**
- Projection is hypothetical. Disclosure copy required: "Hypothetical illustration assuming 7% avg. annual return. Not a guarantee. Investment values fluctuate."
- No account required to see this. It is the acquisition hook.
- The number updates live as the user adjusts the slider.

### 5.2 The Guided Setup Flow (3 steps)

After the projection card, a single CTA: **"Set this up for free →"**

Clicking it begins a linear, step-by-step flow. No branching logic in the MVP. No decisions to make beyond one state-selection question.

---

**Step 0 — Quick context (30 seconds)**

- "Before we start, tell us about your child."
- Fields: Child's first name, birth month/year, home state
- This personalizes all downstream copy and pre-fills the state plan recommendation

---

**Step 1 — 529 Plan**

*What it is (one sentence):* "A tax-advantaged savings account for education — grows tax-free and withdraws tax-free for qualified expenses."

*State logic:*
- If the user's state has a competitive in-state plan with a state tax deduction (e.g., NY, VA, IL), show: "Good news — [State] offers a state tax deduction for contributions to [Plan Name]. We recommend starting there."
- Otherwise: "Your state doesn't offer a meaningful tax deduction, so we recommend Utah's my529 — one of the lowest-fee plans in the country, open to all states."

*Action:*
- A clearly labeled button: **"Open [Plan Name] 529 →"** — opens the plan provider in a new tab
- A "Mark as done" checkbox that returns the user to NestEgg to continue
- Brief "what to expect" note: "You'll need your SSN, your child's SSN (or you can add it later), and a funding source. Takes about 5 minutes."

---

**Step 2 — UTMA Custodial Account**

*What it is (one sentence):* "A flexible investment account in your child's name — no restrictions on what it's used for. Great for goals beyond college."

*Why both (one sentence):* "The 529 is optimized for college. The UTMA is a backstop — if your child starts a business, buys a house, or skips college, this money is still theirs."

*Recommended provider:* Fidelity Youth / Fidelity custodial account (no account minimums, no fees, trusted brand)

*Action:*
- Button: **"Open Fidelity Custodial Account →"** — new tab
- "Mark as done" checkbox

---

**Step 3 — Authorized User Credit Card**

*What it is (one sentence):* "Add your child as an authorized user on your credit card — they never touch the card, but they start building a credit history today."

*Why it matters (one sentence):* "By the time they're 18, they could have 10+ years of credit history — giving them a head start most adults don't have."

*How-to (issuer-specific):*
- Ask: "Which card do you have?" — dropdown with: Chase, Amex, Citi, Capital One, Discover, Other
- Show the exact steps for that issuer (e.g., Chase: log in → Account Services → Authorized Users → Add)
- For "Other": show the generic process (call customer service or log in, add authorized user, enter child's name and date of birth — SSN often optional)

*Action:*
- No external redirect needed — instructions are inline
- "Mark as done" checkbox

---

**Step 4 — Done screen**

"[Child's name]'s financial foundation is set."

Show a summary card:
- ✓ 529 Plan — [Plan name]
- ✓ UTMA Account — Fidelity
- ✓ Authorized User — [Card issuer]
- Restate the projection: "$50/month, starting today → $[X] by [Child's name]'s 18th birthday"

Two CTAs:
1. **"Share with your partner →"** — generates a shareable link to the done screen with the child's projection pre-filled
2. **"Send as a baby gift →"** — generates a sharable link to the projection card, framed as "Start [Child's name]'s NestEgg" for grandparents/family

---

### 5.3 What Is Explicitly Out of Scope for MVP

- User accounts / authentication
- Saving progress server-side
- Push notifications or email reminders
- Portfolio recommendations or investment allocation advice
- Affiliate revenue integration (build first, monetize later)
- Mobile app
- Admin dashboard
- Any account held or managed by NestEgg

---

## 6. Technical Decisions

**Web app only, no mobile app.** Reasons:
- Browser-based removes app store friction at the moment of peak intent
- The flow is linear and form-heavy — desktop/laptop is fine for new parents at home
- Faster to build and iterate
- Mobile-responsive is required; native app is not

**Stack (recommended for 5-day build):**
- Next.js (React) — routing, SSR for SEO on landing page
- Tailwind CSS — fast, consistent styling
- No backend in MVP — all state is client-side (localStorage for progress tracking)
- Recharts or Chart.js — compounding projection curve
- Vercel — deployment

**No database in MVP.** The "Mark as done" state lives in localStorage. Progress is not persisted across devices or sessions — acceptable trade-off for a 5-day build.

---

## 7. Content & Tone

- **Voice:** Warm, direct, confident. Not salesy. Not preachy. Not jargony.
- **Reading level:** Write for a smart, busy parent who has never heard of a 529. If a sentence needs a follow-up sentence to explain it, rewrite the first sentence.
- **Disclosures:** Required on the projection card and on each account step. Short, plain-language. Not buried in a footer.
- **Never say:** "financial advice," "guaranteed returns," "best plan," "you should invest."
- **Always say:** "here's what this is," "here's how to do it," "this is hypothetical."

---

## 8. Legal / Regulatory Guardrails (MVP)

NestEgg operates as **financial education**, not investment advice. This is intentional and must be preserved in design and copy.

- NestEgg does not hold, manage, or recommend specific securities
- NestEgg does not receive compensation from 529 plans or brokerages in the MVP (no affiliate relationships to disclose)
- All external account-opening happens on the provider's own platform via redirect
- State plan recommendations are based on publicly available fee comparisons, not personalized financial advice
- The projection tool uses a fixed, disclosed rate (7%) and is clearly labeled hypothetical
- A short disclaimer appears on every step: "NestEgg is a financial education tool, not a registered investment adviser. This is not personalized financial advice."

**Before any revenue or affiliate arrangement is added, consult legal counsel on RIA registration obligations.** UNest and Backer both operate through registered adviser entities once they begin managing or recommending specific securities.

---

## 9. Success Metrics (MVP)

| Metric | Definition | MVP target |
|---|---|---|
| Projection engagement | % of visitors who interact with the projection slider | > 40% |
| Step 1 start rate | % of visitors who click "Set this up free →" | > 20% |
| Step completion rate | % of users who reach the Done screen | > 50% of starters |
| Share rate | % of Done-screen users who click Share or Send as gift | > 15% |

These are directional. The MVP goal is to validate that the guided flow converts and that the projection hook drives action — not to hit a user count target.

---

## 10. 5-Day Build Plan

| Day | Focus | Deliverable |
|---|---|---|
| 1 | Foundation | Next.js project setup, Tailwind, routing skeleton, projection card with live chart |
| 2 | Step flow | Step 0–1 (context + 529 with state logic), progress indicator, "Mark as done" |
| 3 | Step flow | Step 2–3 (UTMA + authorized user with issuer-specific instructions), Done screen |
| 4 | Polish | Copy review, disclosure language, mobile responsiveness, edge cases (no state match, etc.) |
| 5 | Ship | Vercel deploy, shareable link generation, QA on desktop + mobile |

---

## 11. Future Phases (not MVP)

- **Phase 2:** Email capture on the Done screen, return-to-progress flow, email reminders at 30/60/90 days
- **Phase 3:** Employer benefits integration — life-event trigger when employee reports a birth
- **Phase 4:** Baby registry integration — "Add NestEgg to your Babylist registry"
- **Phase 5:** RIA partnership or registration — personalized portfolio recommendations, affiliate revenue from 529 plan providers

---

*This PRD is intentionally scoped for a 5-day build. Resist the urge to add features before validating the core flow. The projection card and the trifecta account flow are the product.*
