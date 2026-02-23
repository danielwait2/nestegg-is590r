# Phase 1 — MVP Web App

**Timeline:** 5 days
**Tracking:** [roadmap-phase1-mvp.md](roadmap-phase1-mvp.md)
**Goal:** Ship a working, public web app that validates the core hypothesis — the projection card drives action, and the guided trifecta flow converts.

---

## Overview

Build the minimum product: an interactive projection card above the fold, followed by a 3-step guided flow for opening a 529, UTMA, and authorized user credit card. No auth, no backend, no database. All state in localStorage. Deploy to Vercel.

---

## Success Criteria

- [ ] Projection card loads on first visit, no login required
- [ ] Slider updates projected value live
- [ ] All three account steps are completable end-to-end
- [ ] "Mark as done" persists in localStorage across page refreshes
- [ ] Done screen renders with correct child name and projection
- [ ] Share link and gift link both generate and open correctly
- [ ] Deployed to Vercel with a public URL
- [ ] Mobile-responsive on 375px and 768px viewports
- [ ] Disclosure language present on every step

---

## Prerequisites

- Node.js 18+ installed locally
- Vercel account (free tier is fine)
- GitHub repo created and connected to Vercel
- State plan data prepared (see Step 2 below)

---

## Detailed Steps

### Day 1 — Foundation

**1. Initialize project**
```bash
npx create-next-app@latest nestegg --typescript --tailwind --app --src-dir
cd nestegg
npx shadcn@latest init
```

**2. Install dependencies**
```bash
npm install recharts
```

**3. Set up routing skeleton**

```
app/
  page.tsx              ← Landing + projection card
  setup/
    page.tsx            ← Step 0: child context
    529/page.tsx        ← Step 1: 529 plan
    utma/page.tsx       ← Step 2: UTMA
    credit/page.tsx     ← Step 3: authorized user
    done/page.tsx       ← Done screen
```

**4. Build the projection engine**

File: `src/lib/projection.ts`

```typescript
export function calcProjection(
  monthlyContribution: number,
  yearsToGrow: number,
  annualRate = 0.07
): number {
  const monthlyRate = annualRate / 12;
  const months = yearsToGrow * 12;
  if (monthlyRate === 0) return monthlyContribution * months;
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}
```

No library. Pure math. Test it manually: $50/month × 18 years × 7% ≈ $21,700.

**5. Build the projection card**

- Two inputs: birth year (select, range: current year back 2 years + "Just born") and monthly amount (slider, $10–$500, default $50)
- Output: formatted dollar amount, updates on every input change
- Line chart: x-axis = child's age (0–18), y-axis = cumulative value, one line
- Disclosure below chart: "Hypothetical illustration assuming 7% avg. annual return. Not a guarantee. Investment values fluctuate."
- CTA button: "Set this up for free →" links to `/setup`

---

### Day 2 — Steps 0 and 1

**Step 0 — Child context (`/setup`)**

Form fields:
- Child's first name (text input)
- Birth month + year (two selects)
- Home state (select, all 50 states)

On submit: store `{ name, birthYear, birthMonth, state }` to localStorage key `nestegg_child`. Navigate to `/setup/529`.

**Step 1 — 529 Plan (`/setup/529`)**

State logic — build a data file:

File: `src/data/statePlans.ts`

```typescript
type StatePlan = {
  state: string;
  hasTaxDeduction: boolean;
  planName: string;
  planUrl: string;
  deductionNote?: string; // e.g. "$5,000/year per filer"
};
```

Populate for all 50 states. Key entries:
- NY → NY 529 Direct Plan, hasTaxDeduction: true
- VA → Invest529, hasTaxDeduction: true
- IL → Bright Start, hasTaxDeduction: true
- CA → ScholarShare 529, hasTaxDeduction: false (no CA deduction)
- TX → Texas College Savings, hasTaxDeduction: false
- Default fallback → Utah my529, always shown when hasTaxDeduction: false

Page reads state from localStorage, renders:
- One-sentence explainer
- Recommended plan name + deduction note if applicable
- "Open [Plan Name] →" button (target="_blank")
- "Mark as done" checkbox (stores to localStorage key `nestegg_progress.step1`)
- "Continue →" button (disabled until checked, or user can skip)
- Progress indicator: Step 1 of 3

---

### Day 3 — Steps 2, 3, and Done

**Step 2 — UTMA (`/setup/utma`)**

- One-sentence explainer + one-sentence "why both" framing
- "Open Fidelity Custodial Account →" button (target="_blank")
- "Mark as done" checkbox → `nestegg_progress.step2`
- Progress indicator: Step 2 of 3

**Step 3 — Authorized User (`/setup/credit`)**

- One-sentence explainer + one-sentence "why it matters"
- Issuer dropdown: Chase, Amex, Citi, Capital One, Discover, Other
- On selection: render inline step-by-step instructions for that issuer
- "Mark as done" checkbox → `nestegg_progress.step3`
- Progress indicator: Step 3 of 3

Issuer instructions — keep them in a data file:

File: `src/data/issuerInstructions.ts`

```typescript
type IssuerInstructions = {
  issuer: string;
  steps: string[];
  ssnRequired: boolean;
  note?: string;
};
```

**Done screen (`/setup/done`)**

- Reads child name, state plan, issuer from localStorage
- Renders summary card with three checkmarks
- Restates projection (re-runs calcProjection using stored values)
- Two CTAs:
  - "Share with your partner →" — generates URL with query params encoding child name + birth year + monthly amount, copies to clipboard
  - "Send as a baby gift →" — same URL but framed for gifting (different landing copy via query param)

---

### Day 4 — Polish

- Mobile responsiveness: test at 375px (iPhone SE), 390px (iPhone 14), 768px (iPad)
- Copy pass: every page, every button label, every disclosure
- Edge cases:
  - User visits `/setup/529` without completing Step 0 → redirect to `/setup`
  - User visits `/setup/done` without completing steps → show partial summary with "Still to do" items
  - Birth year = current year → treat as 18 years of growth
  - Monthly amount = $0 → projection shows $0, no divide-by-zero
- Shareable link: test that pre-filled query params populate the projection card correctly
- Disclosure footer on every page, not just projection card

---

### Day 5 — Ship

- Connect GitHub repo to Vercel (if not already done)
- Set `NEXT_PUBLIC_BASE_URL` env var in Vercel for share link generation
- Run `npm run build` locally — fix any TypeScript errors
- Push to main → Vercel auto-deploys
- QA checklist:
  - [ ] Full flow on Chrome desktop
  - [ ] Full flow on Safari mobile (iPhone)
  - [ ] Share link opens with correct pre-filled values
  - [ ] Gift link opens correctly
  - [ ] All external links open in new tab
  - [ ] localStorage cleared → flow starts fresh

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO on landing page; fast routing |
| Styling | Tailwind CSS + shadcn/ui | Fast, consistent, no custom CSS |
| Charts | Recharts | Simple API, React-native, small bundle |
| Projections | Vanilla JS | No dependency, fully controlled |
| State | localStorage | No backend needed for MVP |
| Deployment | Vercel | Zero-config, free tier, auto-deploy from GitHub |

---

## File Structure

```
src/
  app/
    page.tsx                    ← Landing page + projection card
    layout.tsx                  ← Root layout (font, metadata)
    setup/
      page.tsx                  ← Step 0: child context
      529/page.tsx              ← Step 1: 529 plan
      utma/page.tsx             ← Step 2: UTMA
      credit/page.tsx           ← Step 3: authorized user
      done/page.tsx             ← Done screen
  components/
    ProjectionCard.tsx          ← Projection card (inputs + chart + CTA)
    ProjectionChart.tsx         ← Recharts line chart
    StepLayout.tsx              ← Shared wrapper for steps 1–3 (header, progress, disclosure)
    MarkAsDone.tsx              ← Checkbox + localStorage write
    IssuerInstructions.tsx      ← Issuer dropdown + inline steps
  data/
    statePlans.ts               ← State → plan recommendation map
    issuerInstructions.ts       ← Issuer → step-by-step instructions
  lib/
    projection.ts               ← calcProjection()
    storage.ts                  ← localStorage read/write helpers
```

---

## Testing Strategy

No test framework in MVP. Manual QA only:

- Happy path: full flow, all three steps checked, Done screen correct
- Skip path: navigate directly to Done without completing steps — confirm graceful handling
- Share link: generate link, open in incognito tab, confirm projection pre-fills
- Mobile: Safari iOS (most common for this demographic)
- Refresh: complete Step 1, refresh, confirm checkbox still checked

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Fidelity or state plan changes their URL | Low | Store URLs in `statePlans.ts` — easy to update |
| Issuer instructions become outdated | Medium | Mark instructions with a "last verified" date in the data file |
| localStorage blocked (private mode Safari) | Low | Catch errors silently, don't block progress |
| Share link too long for some platforms | Low | Use base64-encoded query params if URL length becomes an issue |

---

## Deliverables

- [ ] Public Vercel URL
- [ ] Working projection card (live updates)
- [ ] 3-step guided flow (529 → UTMA → Authorized User)
- [ ] Done screen with share + gift links
- [ ] Mobile-responsive layout
- [ ] All disclosures present
- [ ] `statePlans.ts` populated for all 50 states
- [ ] `issuerInstructions.ts` populated for Chase, Amex, Citi, Capital One, Discover, Other
