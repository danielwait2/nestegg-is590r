# NestEgg — Key Decisions Log

Decisions made and locked. Do not re-litigate these without a specific reason.
When a decision changes, update this file with the new decision and why it changed.

---

## Product

### Web app first, not mobile
**Decision:** Build as a responsive web app. No native mobile app until Phase 5.
**Why:** Browser removes app store friction at the moment of peak intent (new parent, at home, on their laptop). The setup flow is linear and form-heavy — desktop/laptop is the right context. Faster to build and iterate. Mobile-responsive is required; native is not.
**When to revisit:** Phase 5, after V1 has validated retention on the web.

### Three accounts only (529 + UTMA + authorized user credit card)
**Decision:** The MVP covers exactly three account types. No more.
**Why:** Constraint is the feature. Adding a fourth account (brokerage, HSA, etc.) reintroduces the decision paralysis the product is designed to eliminate.
**When to revisit:** Never for the core flow. Additional products live outside the wizard (see: insurance marketplace in Phase 5).

### No auth in Phase 1 (MVP)
**Decision:** Users complete the full setup flow without creating an account. Auth is not required for the MVP.
**Why:** Auth adds friction at the top of the funnel. The MVP goal is to validate that the flow converts — not to retain users. Adding a required login before the value is delivered would suppress conversion and muddy the signal.
**When to revisit:** Phase 2. Auth is added then as an optional save-your-progress step offered at the Done screen.

### localStorage only in Phase 1 (no backend)
**Decision:** All progress state in the MVP lives in localStorage. No Supabase, no database, no server.
**Why:** The MVP is a 5-day build. A backend adds setup time and scope that doesn't validate the core hypothesis. localStorage is sufficient for single-session or single-device progress tracking.
**Tradeoff accepted:** Progress does not persist across devices or after clearing browser storage. This is acceptable for MVP.
**When to revisit:** Phase 2. Supabase comes online then.

### Auth is optional even in Phase 2+
**Decision:** Users can always complete the setup flow without signing in. Auth is offered — never required — to save progress.
**Why:** Forcing auth before value delivery kills top-of-funnel conversion for a product targeting low-awareness parents.

---

## 529 Plan Recommendations

### Utah my529 as the default fallback
**Decision:** For any state that does not offer a meaningful state income tax deduction for 529 contributions, recommend Utah's my529 plan.
**Why:** my529 is consistently rated among the lowest-fee, best-managed plans in the country and is open to residents of all states. It is a defensible, research-backed default.
**What counts as "meaningful":** A state deduction of at least $1,000/year single filer that is actually claimable by a typical NestEgg user (not limited to in-state plan contributions only).
**Disclosure required:** Recommendations are based on publicly available fee comparisons, not personalized financial advice.

### In-state plan recommended when meaningful deduction exists
**Decision:** If a user's state offers a meaningful tax deduction for contributions to the in-state plan, recommend that plan by name over Utah my529.
**Why:** A state tax deduction is real, immediate, guaranteed value. It outweighs marginal fee differences between plans for most users.
**Source of truth:** `src/data/statePlans.ts` — all 50 states mapped. Update there, not here.

---

## Legal / Regulatory

### Education-only framing (no RIA in Phase 1–4)
**Decision:** NestEgg operates as a financial education tool, not an investment adviser, through Phase 4.
**Why:** Registering as an RIA (or entering a solicitor agreement) adds significant legal, compliance, and operational overhead. The MVP and V1 do not require it. The product guides users to third-party providers — it does not manage money, hold accounts, or recommend specific securities.
**Hard line:** NestEgg does not receive affiliate compensation from any 529 plan, custodian, or insurer during Phases 1–4. Affiliate revenue requires legal sign-off first (Phase 5 gate).
**When to revisit:** Phase 5. Legal review is a hard prerequisite before any affiliate revenue goes live.

### No specific security recommendations
**Decision:** NestEgg recommends plan providers (e.g., "Utah my529"), not specific investment portfolios or securities within those plans.
**Why:** Recommending "the age-based aggressive portfolio in Utah my529" crosses from education into personalized investment advice. Plan-level recommendations based on fee data are defensible as education. Portfolio-level recommendations are not — without RIA status.
**When to revisit:** Phase 6, with a solicitor agreement in place.

---

## Tech

### Next.js App Router (not Pages Router)
**Decision:** Use the App Router introduced in Next.js 13+.
**Why:** It's the current default and recommended approach. Server Components, layouts, and the file-based routing model are well-suited to this app's structure.

### Vanilla JS for projection math (no charting library dependency for the calculation)
**Decision:** `calcProjection()` is pure JavaScript — no financial library, no external dependency.
**Why:** The formula is simple (future value of a series). A dependency would add bundle weight and a potential breaking change vector for a 5-line function.

### Recharts for the projection chart
**Decision:** Use Recharts for the line chart visualization.
**Why:** React-native, simple API, well-maintained, sufficient for a single-line (or dual-line) chart. Lazy-load it in Next.js to keep the initial bundle small.

### Supabase for backend (Phase 2+)
**Decision:** Supabase is the backend — auth, database, row-level security, cron, edge functions.
**Why:** Managed Postgres with built-in auth and RLS. Free tier is generous. Avoids the need to manage a separate auth service. The @supabase/ssr package integrates cleanly with Next.js App Router.

### Resend for email (Phase 2+)
**Decision:** Resend is the email provider.
**Why:** Simple API, React email template support, generous free tier, easy domain verification. No marketing platform overhead.

### Vercel for deployment
**Decision:** Deploy to Vercel.
**Why:** Zero-config Next.js deployment, auto-deploy from GitHub, free tier covers MVP, preview deployments per PR are useful for review.
