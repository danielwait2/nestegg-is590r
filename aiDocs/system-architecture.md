# NestEgg — System Architecture

---

## 1. The Problem System

The larger system NestEgg operates in is the **household financial formation system for new families**. It spans awareness, decision, and action — and has two well-known failure modes: parents intend to act but don't, and when they do act, they open only one account type.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HOUSEHOLD FINANCIAL FORMATION SYSTEM                     │
│                                                                             │
│  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐               │
│  │   AWARENESS   │───▶│   DECISION    │───▶│    ACTION     │               │
│  │               │    │               │    │               │               │
│  │ "I should do  │    │ "Which accounts│   │  Opens 0–3    │               │
│  │  something"   │    │  do I open?   │    │  accounts     │               │
│  │               │    │  Which plan?  │    │               │               │
│  └───────────────┘    │  In what order│    └───────────────┘               │
│                       └───────────────┘                                    │
│                               ▲                                             │
│                               │                                             │
│                    ❌ PRIMARY FAILURE POINT                                  │
│                    Decision paralysis stops 529 adoption.                   │
│                    54% of parents have never heard of a 529.                │
│                    No single product removes the blank page.                │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Goal of the larger system:** New families build wealth efficiently across three account types (tax-advantaged education, general custodial, credit history) from the moment of birth.

**Leverage point:** The decision-to-action gap at the birth moment. Parents are maximally motivated but have no opinionated guide. Intervening here converts latent intent into completed account openings before the motivation fades.

---

## 2. Where NestEgg Sits in the Ecosystem

NestEgg is a **guidance layer** — it does not hold money, manage accounts, or serve as a broker. It sits between the parent and the third-party financial institutions.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           NESTEGG ECOSYSTEM                                 │
│                                                                             │
│   NEW PARENT                                                                │
│   (first weeks after birth)                                                 │
│        │                                                                    │
│        │  Arrives via: search, word of mouth,                               │
│        │  birth announcement share link, gift link                          │
│        ▼                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          NESTEGG                                    │   │
│  │                   (guidance layer only)                             │   │
│  │                                                                     │   │
│  │  Landing Page           Setup Wizard             Done Screen        │   │
│  │  ─────────────          ─────────────            ───────────        │   │
│  │  Projection card  ───▶  Step 1: 529        ───▶  Shareable link    │   │
│  │  (see the $$ first)     Step 2: UTMA             Gift link         │   │
│  │                         Step 3: Auth user         Progress saved   │   │
│  │                                                                     │   │
│  └──────────────┬──────────────┬──────────────┬──────────────────────┘   │
│                 │              │              │                             │
│                 ▼              ▼              ▼                             │
│         ┌──────────┐   ┌──────────┐   ┌──────────────────┐               │
│         │ 529 PLAN │   │  UTMA    │   │  CREDIT ISSUER   │               │
│         │ PROVIDER │   │ CUSTODIAN│   │  (Chase, Amex,   │               │
│         │          │   │          │   │   Citi, CapOne,  │               │
│         │ Utah my529│  │ Fidelity │   │   Discover)      │               │
│         │ (or state │  │ Vanguard │   │                  │               │
│         │ specific) │  │ Schwab   │   │                  │               │
│         └──────────┘   └──────────┘   └──────────────────┘               │
│                                                                             │
│   NestEgg's role: point parents to the right door.                         │
│   NestEgg does NOT hold money, manage accounts, or receive commissions.     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technical Architecture (Current: Phase 2)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TECHNICAL SYSTEM (Phase 2)                           │
│                                                                             │
│   BROWSER (Client)                                                          │
│   ─────────────────────────────────────────────────────────────────────    │
│   Next.js App Router (React Server + Client Components)                    │
│   Tailwind CSS + shadcn/ui                                                  │
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │  Pages / Routes                                                    │   │
│   │                                                                    │   │
│   │  /                 Landing + ProjectionCard (slider, Recharts)     │   │
│   │  /setup            Wizard shell (progress indicator)               │   │
│   │  /setup/529        State selector → plan recommendation            │   │
│   │  /setup/utma       UTMA explainer + MarkAsDone                     │   │
│   │  /setup/credit     Issuer selector + step-by-step instructions     │   │
│   │  /setup/done       Summary + share link + gift link                │   │
│   │  /auth             Magic-link email entry                          │   │
│   │  /auth/confirm     Token validation → session cookie               │   │
│   │  /account          Contribution slider (auth required)             │   │
│   │  /admin            Event funnel dashboard (auth required)          │   │
│   │  /g/[token]        Gift link landing                               │   │
│   └───────────────────────────────┬────────────────────────────────────┘   │
│                                   │ API calls                               │
│                                   ▼                                         │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │  API Routes (Next.js Route Handlers — server-side)                 │   │
│   │                                                                    │   │
│   │  POST /api/auth/send       Log magic link to terminal              │   │
│   │  GET  /api/auth/confirm    Validate token → set httpOnly cookie    │   │
│   │  POST /api/auth/signout    Clear session cookie                    │   │
│   │  POST /api/sync            Persist localStorage progress to DB     │   │
│   │  GET  /api/me              Return current user + child data        │   │
│   │  PATCH /api/me/contribution Update monthly contribution amount     │   │
│   │  POST /api/events          Fire-and-forget event tracking          │   │
│   │  POST /api/gift            Create DB-backed gift link token        │   │
│   └───────────────────────────────┬────────────────────────────────────┘   │
│                                   │                                         │
│                                   ▼                                         │
│   ┌────────────────────────────────────────────────────────────────────┐   │
│   │  Local SQLite DB (better-sqlite3 — Phase 2 only, not on Vercel)   │   │
│   │                                                                    │   │
│   │  Tables: users, sessions, children, setup_progress, events,       │   │
│   │          gift_links                                                │   │
│   └────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   CLIENT-SIDE STATE                                                         │
│   localStorage: child name, birth year, monthly contribution,              │
│                 step completion flags, projection params                    │
└─────────────────────────────────────────────────────────────────────────────┘

   HOSTING: Vercel (auto-deploy from GitHub main branch)
```

---

## 4. Technical Architecture (Phase 3+: Production)

Phase 3 replaces the local SQLite layer with Supabase and adds real email delivery.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TECHNICAL SYSTEM (Phase 3+ — Production)                 │
│                                                                             │
│   BROWSER ──▶ Next.js on Vercel ──▶ Supabase (Postgres + Auth + RLS)      │
│                        │                                                    │
│                        └──▶ Resend (transactional email)                   │
│                                                                             │
│   Supabase replaces: better-sqlite3, local session management              │
│   Resend replaces:   console.log magic links                               │
│   Same API surface — only src/lib/db.ts and src/lib/auth.ts change        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Data Flow — Core User Journey

```
Parent lands on /
        │
        ▼
Adjusts projection slider
(monthly contribution, birth year)
        │
        │  calcProjection() runs client-side
        │  localStorage updated
        ▼
Clicks "Set this up free →"
        │
        ▼
/setup/529 — selects state
        │
        │  statePlans.ts lookup: state → 529 recommendation
        │  trackEvent('step_529_viewed') → POST /api/events
        ▼
Clicks MarkAsDone → /setup/utma
        │
        │  trackEvent('step_529_done')
        ▼
/setup/utma → MarkAsDone → /setup/credit
        │
        ▼
/setup/credit — selects issuer
        │
        │  issuerInstructions.ts lookup → inline steps
        │  MarkAsDone
        ▼
/setup/done
        │
        │  trackEvent('flow_complete')
        │  Generates shareable link (query params)
        │  Optional: enter email → magic link → /account
        ▼
    Done. Parent owns all three accounts.
    NestEgg's job is finished.
```

---

## 6. Leverage Points in the System

| Leverage Point | Why It Matters | How NestEgg Exploits It |
|---|---|---|
| **Birth moment** | Parents are maximally motivated immediately after birth — intent decays rapidly | Product is designed for the first 2–4 weeks; share links make it easy to act on a recommendation from a friend |
| **Decision paralysis → blank page** | The #1 reason parents don't open a 529 is not knowing which one or where to start | Opinionated state-based recommendation removes the choice entirely |
| **Dollar projection visibility** | Seeing "$287,000 at age 18" converts abstract intent into concrete motivation | Projection card is above the fold, before any login or commitment |
| **Trifecta framing** | No competitor frames all three accounts as a package — parents think in silos | "529 + UTMA + authorized user" is the product; each account addresses a different risk |
| **Social sharing at completion** | Parents who complete the flow become acquisition channels for other new parents | Done screen generates a pre-filled share link; gift link turns grandparents into contributors |
| **No custody = no regulatory burden** | Holding money triggers RIA/broker-dealer requirements; guidance does not | NestEgg sends parents to third-party providers — no custody, no fiduciary liability |
