# NestEgg — Midterm Presentation
### "Set Your Kids Up for Life."
**BYU IS 590R — AI-Augmented Software Development**
**15-Minute Pitch | February 2026**

---

> **Presenter guide:** Each `---` is a slide break. Estimated time per slide is noted. Total runtime ~14–15 min with normal pacing. All team members should speak — suggested split noted per section.

---

## SLIDE 1 — The Hook *(~45 seconds)*

# 82% of children have no 529 plan.
# 54% of parents have never heard of one.

**The problem isn't intent. It's the blank page.**

A new parent Googles "529 plan," lands on a 2,000-word NerdWallet article, and closes the tab.

> *Speaker note: Open with this stat. Let it land. Then ask: "What if the blank page just disappeared?"*

---

## SLIDE 2 — The Problem *(~1 minute)*

### The System Is Broken at the Decision Layer

Parents go through three stages when a child is born:

| Stage | What Happens |
|---|---|
| **Awareness** | "I should do something for my kid financially." |
| **Decision** | "Which accounts? Which provider? In what order?" ← **THIS IS WHERE THEY STOP** |
| **Action** | Opens 0–3 accounts |

**The primary failure point is Decision → Action.**

- 54% of parents have never heard of a 529 (LIMRA 2022)
- In our own survey of 17 parents: **9 of 17 had set up zero of the three target accounts**
- Top barriers: "I kept meaning to but never got around to it" (5) + "I didn't know these were options" (5) + "I didn't know where to start" (2)

> *This is not a motivation problem. It's a guidance problem.*

---

## SLIDE 3 — System Architecture Diagram *(~1.5 minutes)*

### The Ecosystem NestEgg Operates In

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOUSEHOLD FINANCIAL FORMATION SYSTEM                     │
│                                                                             │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐               │
│  │   AWARENESS   │───▶│   DECISION    │───▶│    ACTION     │               │
│  │               │    │               │    │               │               │
│  │ "I should do  │    │ Which accounts │   │  Opens 0–3    │               │
│  │  something"   │    │ do I open?     │    │  accounts     │               │
│  │               │    │ Which plan?    │    │               │               │
│  └───────────────┘    │ In what order? │   └───────────────┘               │
│                       └───────────────┘                                    │
│                               ▲                                             │
│                    ❌ PRIMARY FAILURE POINT                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Where NestEgg sits:**

```
NEW PARENT (first weeks after birth)
        │
        ▼
  ┌─────────────────────────────────────────┐
  │              NESTEGG                    │
  │         (guidance layer only)           │
  │                                         │
  │  Projection Card → Setup Wizard → Done  │
  └────────┬──────────────┬──────────┬──────┘
           │              │          │
           ▼              ▼          ▼
      529 PLAN       UTMA/FIDELITY  CREDIT ISSUER
      PROVIDER       CUSTODIAN      (Chase, Amex,
    (Utah my529 or                   Citi, etc.)
      state-specific)
```

**NestEgg is a guidance layer — not a custodian, not a broker, not a fiduciary.**
NestEgg points parents to the right door. It does not hold money or receive commissions.

**Leverage Points in the System:**
| Leverage Point | How NestEgg Exploits It |
|---|---|
| Birth moment — peak motivation | Flow is designed for the first 2–4 weeks; share links propagate via word of mouth |
| Decision paralysis → blank page | Opinionated, state-based recommendation removes choice entirely |
| Dollar projection visibility | "$287K at age 18" converts abstract intent to concrete action |
| Social sharing at completion | Done screen creates acquisition loops via share + gift links |
| No custody = no regulatory burden | Guidance-only model avoids RIA registration through Phase 4 |

---

## SLIDE 4 — The Founding Hypothesis *(~1 minute)*

### What We Bet On

> **"New parents in the first weeks after birth are maximally motivated to act on their child's financial future, but fail to do so because no single product removes the blank-page problem — the decision of which accounts to open, in what order, at which provider."**

**The hypothesis holds if all five assumptions are true:**

| # | Assumption | Status |
|---|---|---|
| 1 | Peak intent is at/shortly after birth | Supported by survey — 11 of 17 respondents were expecting or had children under 1 year old |
| 2 | Decision paralysis is the primary barrier — not cost or distrust | Supported — "didn't know where to start" + "didn't know these were options" dominate |
| 3 | A concrete dollar projection converts intent to action | Supported — 13 of 17 said the projection was "motivating" or "I'd want to start immediately" |
| 4 | No existing product serves this specific moment with this breadth | **Falsification Test #1 — Passed** (see next slide) |
| 5 | Parents will complete a 3-step flow without an account or login | Being tested — Phase 1 MVP built and functional |

---

## SLIDE 5 — Falsification Tests *(~1 minute)*

### We Tried to Prove Ourselves Wrong

**Falsification Test #1 — Does this product already exist?**

We searched: App Store, Google Play, Product Hunt, VC portfolios, and researched each competitor directly.

**Finding:** No product found that satisfies all three criteria simultaneously:
1. Targets the birth / newborn moment *(not older children)*
2. Covers 529 + UTMA + authorized user in one session *(not one account type)*
3. Provides a guided setup flow *(not account management after opening)*

| Competitor | Newborn moment? | Multi-account? | Gap |
|---|---|---|---|
| Fabric | ✅ | ❌ | Life insurance/wills only |
| Backer | ❌ | ❌ | Starts after 529 already exists |
| UNest | ❌ | ❌ | UTMA only, any age |
| Greenlight | ❌ | ✅ | Ages 6–17, not newborns |

**Result: The trifecta-at-birth position is unoccupied as of February 2026.**

---

**Falsification Test #2 — Is this just an awareness problem, not a guidance problem?**

If parents simply don't know 529s exist, a marketing campaign — not a product — would be the solution.

**Finding:** Awareness IS part of the problem (54% of parents haven't heard of 529s). But NestEgg's design accounts for this — the projection card shows the outcome *before* explaining the mechanism. Parents see "$287K at age 18" before they ever learn what a 529 is.

**Result: Awareness is real, but the product design addresses it. Hypothesis holds.**

---

## SLIDE 6 — The Customer *(~1.5 minutes)*

### Who We're Building For

**Primary:** New parents (or expecting parents) in the US
- Ages 25–40
- Household income > $60K
- Motivated to act on their child's financial future
- Overwhelmed by financial complexity

**Secondary:** Grandparents and close family who want to give a meaningful financial gift at birth

**Not our customer:** Parents of older kids (6+), teens learning to spend, active investors

---

### Survey Data — 17 Real Respondents (Feb 22–23, 2026)

**Who responded:** 3 expecting, 8 with children under 1, 6 with children aged 1–2

| Question | Finding |
|---|---|
| Financial preparedness (1–5) | Avg **3.5/5** — most feel moderately unprepared |
| Had zero accounts set up | **9 of 17 (53%)** had set up none of the three target accounts |
| Had authorized user credit card | **0 of 17** — no one had done this |
| Top barriers | "Never got around to it" (5) + "Didn't know these were options" (5) |
| Reaction to projection message | 5 said "I'd want to start immediately" · 8 said "Motivating but I'd hesitate" · only 1 was not compelled |
| Likelihood to use the app (1–5) | Avg **3.5/5** — 10 of 17 rated 4 or 5 |
| Primary trust drivers | Institutional partnerships · Peer recommendations · Transparency about monetization |
| Willingness to pay | 8 prefer free · 7 up to $5/mo · 3 up to $10–$15/mo |

**Key insight from the open-ended question ("One thing you wish you'd known"):**
> "I wish I just had all the information of everything I COULD do for my child." — Respondent 10
> "Just like a list of all the options and resources." — Respondent 3

This is exactly the product we're building.

---

**What the data changed:**
- Reinforced that the projection hook is essential — 13/17 found it motivating
- Surfaced that "free" is expected at baseline — monetization through premium features, not a paywall at the top of the funnel
- Confirmed the authorized user credit card is widely unknown — this is a differentiator, not an assumed feature
- Flagged that parents aged 1–2 years with children still haven't acted — the urgency window may be wider than the first 72 hours

---

## SLIDE 7 — Differentiation 2x2 Grid *(~45 seconds)*

**Axes:** X = Target moment (birth → older children) | Y = Account breadth (single → multi-product)

```
HIGH BREADTH
(Multi-product)
        │
        │                              ┌─────────────────────┐
        │                              │  ★ NestEgg          │
        │                              │  529 + UTMA +       │
        │                              │  credit trifecta    │
        │                              │  at birth           │
        │                              └─────────────────────┘
        │
        │  ┌──────────────┐                      ┌──────────────────┐
        │  │  Fabric      │                      │  Greenlight      │
        │  │  Life ins. + │                      │  Spending +      │
        │  │  wills       │                      │  investing       │
        │  │  at birth    │                      │  ages 6–17       │
        │  └──────────────┘                      └──────────────────┘
        │
        ├──────────────────────────────────────────────────────────────
        │   AT BIRTH /                            OLDER CHILDREN /
        │   NEWBORN MOMENT                        EXISTING ACCOUNT
        │
        │  ┌──────────────┐  ┌──────────┐        ┌──────────────────┐
        │  │  Backer      │  │  State   │        │  UNest           │
        │  │  529 gifting │  │  529     │        │  UTMA only       │
        │  │  (post-open) │  │  portals │        │  any age         │
        │  └──────────────┘  └──────────┘        └──────────────────┘
        │
LOW BREADTH
(Single product)
```

**NestEgg is the only product in the top-right quadrant.** No competitor has claimed this position.

---

## SLIDE 8 — The Product *(~1 minute)*

### What We Built

A guided web app that walks new parents through opening three accounts for their child — in under 10 minutes — with a compounding projection that makes the outcome concrete before they commit to anything.

**The three accounts:**
1. **529 Plan** — tax-advantaged education savings (state-specific recommendation)
2. **UTMA Custodial Account** — flexible investing for any goal (Fidelity)
3. **Authorized User Credit Card** — a 10+ year credit history head start

**The hook:** Before any signup, the parent sees:
> *"$50/month → $[X] by [child's name]'s 18th birthday"*

This is the acquisition mechanism. It converts "I should do something" into "I need to do this now."

**The flow:**
```
Landing (projection card)
    → Child info (name, state)
    → Step 1: 529 (state-specific recommendation + "Open → " button)
    → Step 2: UTMA (Fidelity link + "Mark as done")
    → Step 3: Authorized User (issuer-specific instructions)
    → Done Screen (summary + share link + gift link)
```

**Technical guardrail:** NestEgg is financial education, not investment advice. No RIA registration required. No custody. No affiliate revenue until Phase 5 legal review.

---

## SLIDE 9 — Success & Failure Planning *(~1 minute)*

### How We'll Know If It's Working

**Success Metrics (MVP — directional targets):**

| Metric | Definition | Target |
|---|---|---|
| Projection engagement | % of visitors who interact with the slider | > 40% |
| Step 1 start rate | % of visitors who click "Set this up free →" | > 20% |
| Step completion rate | % of flow starters who reach the Done screen | > 50% |
| Share rate | % of Done-screen users who share or send a gift | > 15% |

**What success looks like:** The projection card drives action AND the guided flow completes. This validates both sides of the hypothesis.

---

**Failure Indicators:**

| Signal | What It Means | Pivot |
|---|---|---|
| Projection interaction > 40% but step starts < 20% | The hook works; trust or friction is the barrier | Add social proof, simplify the first step, remove friction |
| Step starts > 20% but completion < 50% | The flow loses people mid-way | Identify the drop-off step; shorten or clarify it |
| Parents report they already knew what to do | The product is a reminder, not a guide | Pivot to notification/nudge product, not wizard |
| A competitor occupies the trifecta-at-birth position | Our differentiation is gone | Narrow focus to one account type with deeper integration |

**Our plan for making it succeed:**
1. Deploy MVP → collect funnel data from `/admin` event dashboard
2. Share with target parents (new-parent Facebook groups, pediatrician waiting rooms, birth announcement circles)
3. Review funnel data after first 50 sessions — find the drop-off step and fix it
4. Phase 2: Add magic-link auth and return-to-progress to recover abandoned sessions

---

## SLIDE 10 — Live Demo *(~1.5 minutes)*

### Show the Product

> *Speaker note: Pull up http://localhost:3000 or the Vercel URL if deployed. Walk through:*
> 1. *Land on home page — show the projection card and move the slider*
> 2. *Click "Set this up for free →"*
> 3. *Enter child name, state — show how it personalizes*
> 4. *Show the 529 step with state-specific recommendation*
> 5. *Show the "Mark as done" — progress indicator advances*
> 6. *Show the Done screen with summary and share link*
> 7. *Show the `/admin` event funnel (if auth is working)*

---

## SLIDE 11 — Technical Process: Document-Driven Development *(~1 minute)*

### Casey's Domain — How We Built This

**Our document pipeline:**

```
PRD (aiDocs/prd.md)
    → Decisions log (aiDocs/decisions.md) — 11 locked decisions
    → Phase roadmaps (ai/roadmaps/phase1–6) — task-level checklists
    → Implementation
    → Changelog (aiDocs/changelog.md) — append-only session log
```

**Each AI coding session starts with:**
1. Read `aiDocs/context.md` — project overview
2. Read `aiDocs/decisions.md` — no re-litigation
3. Read `aiDocs/changelog.md` — what was already built
4. Read the active phase roadmap — what to build next

**CLAUDE.md** defines the behavioral contract: every AI session reads these docs before touching code. This enforced the document-driven workflow across multiple sessions.

**Evidence of living documents:**
- PRD: written before any code, never violated
- Decisions log: 11 decisions locked on 2026-02-21; zero re-litigation
- Changelog: 3 sessions logged (Foundation + Phase 1 MVP + Phase 2 auth)
- Roadmap checklists: Phase 1 tasks individually checked off; Phase 2 tracks 3 known gaps

---

## SLIDE 12 — Technical Process: AI Infrastructure & Implementation *(~1 minute)*

### AI Development Infrastructure

**Folder structure:**
```
/ai
  /guides         — library references (Supabase, shadcn, Recharts) — gitignored
  /roadmaps       — phase-by-phase plans (phases 1–6 written before Phase 1 code)
/aiDocs
  context.md      — session anchor (read first)
  decisions.md    — locked decisions
  prd.md          — source of truth
  changelog.md    — session log
  hypothesis.md   — founding hypothesis + falsification tests
  differentiation.md
  copy-guidelines.md
  env-vars.md
CLAUDE.md         — AI agent behavioral instructions
```

**Phase-by-phase implementation:**
- **Phase 1 (MVP):** ✅ Full flow built in 3 sessions — projection card, 3-step wizard, done screen, localStorage state, shareable/gift links. `npm run build` passes with zero TypeScript errors, 9 static pages generated.
- **Phase 2 (Persistence + Auth):** ✅ SQLite via `better-sqlite3`, magic-link auth (token printed to terminal), 8 API routes, `/admin` event funnel dashboard, `/account` contribution editor, `/g/[token]` gift link page. 3 documented deferred items.
- **Phase 3–6:** Planned and documented. Not started.

**Structured logging:**
- `src/lib/log.ts` — structured logging module (not `console.log("here")`)
- `src/lib/auth.test.ts`, `src/lib/projection.test.ts` — unit tests with Vitest
- `scripts/test.sh`, `scripts/test-integration.sh`, `scripts/lint.sh`, `scripts/build.sh`, `scripts/run.sh` — CLI scripts for every stage of the test-log-fix loop

---

## SLIDE 13 — What's Next *(~30 seconds)*

### Roadmap

| Phase | Focus | Status |
|---|---|---|
| Phase 1 — MVP | Projection card + 3-step flow + share links | ✅ Complete |
| Phase 2 — Persistence | SQLite auth, API routes, admin funnel, gift links | ✅ Mostly complete (3 gaps) |
| Phase 3 — Production | Supabase migration, real email (Resend), SEO | 🔜 Next |
| Phase 4 — Launch | Baby registry integration, employer benefits | Planned |
| Phase 5 — V2 | Mobile app, affiliate revenue (post legal review) | Planned |
| Phase 6 — V3 | RIA/solicitor agreement, personalized portfolios | Planned |

---

## SLIDE 14 — The Ask *(~30 seconds)*

### Green-light us. Here's why.

1. **The gap is real and validated** — 9 of 17 parents had zero accounts. The blank page is the problem. We built the solution.
2. **The position is unoccupied** — we did the competitor search. No one is doing trifecta-at-birth guidance. We have first-mover advantage.
3. **The hypothesis is testable right now** — Phase 1 is live. We can run the experiment and have funnel data within weeks.
4. **The process is sound** — documents drove the code. Every decision is logged. Every phase is planned. The roadmap exists through Phase 6.
5. **The regulatory path is clear** — education-only through Phase 4. Legal review is a hard gate before any affiliate revenue. No shortcuts.

> *"Set Your Kids Up for Life."*

---
---
---

# GAPS ANALYSIS
## What the Midterm Rubric Requires vs. What We Have

---

### ✅ Strengths (Well-Covered)

| Rubric Requirement | Evidence |
|---|---|
| PRD clear enough to build from | `aiDocs/prd.md` — 251 lines, scoped to 5-day build |
| Documents drive coding | PRD → decisions → roadmap → implementation pipeline documented and followed |
| AI folder structure with context.md | `aiDocs/context.md`, `CLAUDE.md`, `ai/guides/`, `ai/roadmaps/` |
| Roadmaps with tasks checked off | `ai/roadmaps/roadmap-phase1-mvp.md` — every task individually checked |
| Phase-by-phase build (not one-shot) | Changelog shows 3 distinct sessions: Foundation → Phase 1 → Phase 2 |
| Structured logging implemented | `src/lib/log.ts` — structured logger, not raw console.log |
| CLI test scripts exist | `scripts/test.sh`, `scripts/test-integration.sh`, `scripts/lint.sh`, etc. |
| System design diagram | `aiDocs/system-architecture.md` — full ecosystem + technical + data flow diagrams |
| Problem statement with justification | `aiDocs/hypothesis.md` — founding hypothesis + 2 falsification tests |
| Alternative problems considered | Falsification Test #2 (awareness vs. guidance) explicitly tested and documented |
| Falsifiability check performed | `aiDocs/hypothesis.md` — 4 explicit falsification conditions documented |
| Target customer identified | PRD §3, `aiDocs/hypothesis.md`, and 17-respondent survey |
| Differentiation from competition | `aiDocs/differentiation.md` — 2x2 grid + competitor breakdown |
| Success criteria defined | PRD §9 — 4 metrics with numeric targets |
| Failure indicators defined | `aiDocs/hypothesis.md` — 4 explicit falsification conditions |
| Pivot plans documented | Differentiation doc notes weaknesses; phase roadmap has clear phase gates |
| Customer research evidence | 17-respondent survey with raw data and summary statistics (`aiDocs/user-survey-data.md`) |
| .gitignore covers sensitive files | `.gitignore` — `ai/`, `.env`, secrets excluded |

---

### ⚠️ Gaps — Action Required Before Presentation

| Gap | Rubric Requirement | Recommended Fix |
|---|---|---|
| **No Vercel deployment** | Phase 1 roadmap gate requires a public URL before Phase 2 | Connect GitHub repo to Vercel; set `NEXT_PUBLIC_BASE_URL`. One-time 10-minute task. |
| **No documented customer *conversations*** | Midterm artifacts require "documentation around at least 2 real customer conversations" — a survey alone may not satisfy this | Write up 2 brief interview notes from people who took the survey or others. A 10-minute conversation with a new parent in your family/network is sufficient. Format: who, when, what they said, what changed. |
| **Git history shows minimal branching** | Rubric: "Git workflow shows branching, meaningful commits, and PRs" | Future commits should use feature branches and PRs. For the presentation, highlight the meaningful commit messages and multi-session structure in the changelog as evidence of iterative workflow. |
| **MCP not demonstrated** | Rubric: "MCP configured and working" | If MCP (Model Context Protocol / Cursor rules) was used during development, document it in `aiDocs/` or `CLAUDE.md` and be ready to show it. If not configured, set it up or note it as a gap honestly. |
| **Mobile QA not done** | Phase 1 roadmap — multiple unchecked mobile items | Run a manual pass on iPhone Safari at 375px. Fix any layout breaks. Check off those roadmap items. |
| **Test-log-fix loop evidence** | Rubric: "Evidence that AI read logs, diagnosed issues, and fixed them" | Add a brief note to the changelog documenting one specific bug that was found via a log, diagnosed, and fixed. This demonstrates the loop in action. |
| **Pivot plan detail** | Rubric: "Pivot plans for both success and failure scenarios" | The failure pivots are implicit in hypothesis.md. Write an explicit "If the metrics show X, we pivot to Y" document section or add it to the hypothesis doc. |
| **No formal customer interview notes** | Midterm product artifacts: "Documentation around at least 2 real customer conversations" | Schedule 2 brief (15 min) conversations with new parents. Take notes. Write them up in `aiDocs/` or a `class_docs/` file. The rubric explicitly says "a friend, a family member, someone at a bus stop" — no formality required. |

---

### 📋 Pre-Presentation Checklist

- [ ] Deploy to Vercel — get a public URL
- [ ] Run mobile QA at 375px and 390px — fix layout issues
- [ ] Write up notes from 2 real customer conversations (new parents)
- [ ] Add one concrete test-log-fix loop example to `aiDocs/changelog.md`
- [ ] Confirm `npm test` runs and all tests pass
- [ ] Assign speaking roles — all team members must present
- [ ] Practice the live demo (projection slider → full flow → admin dashboard)
- [ ] Prepare the system architecture diagram for the slide deck (consider an image version of the ASCII diagrams above)

---

*Built from: `aiDocs/prd.md`, `aiDocs/hypothesis.md`, `aiDocs/differentiation.md`, `aiDocs/system-architecture.md`, `aiDocs/user-survey-data.md`, `aiDocs/context.md`, `aiDocs/decisions.md`, `aiDocs/changelog.md`, `ai/roadmaps/roadmap-phase1-mvp.md`, `class_docs/midterm_rubric/midterm-rubric.md`, `class_docs/midterm_rubric/midterm-product-artifacts.md`*
