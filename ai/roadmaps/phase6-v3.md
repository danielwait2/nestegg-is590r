# Phase 6 — V3

**Timeline:** Months 7–12
**Tracking:** [roadmap-phase6-v3.md](roadmap-phase6-v3.md)
**Goal:** Data flywheel, SEO content moat, employer revenue, and the RIA/solicitor layer — NestEgg becomes defensible.

---

## Overview

Phase 6 uses data you've accumulated from real users to make the product more compelling to new users. The four threads are independent and can run in parallel once the infrastructure is in place:

1. **Data flywheel** — aggregate stats that power social proof and benchmark nudges
2. **SEO content** — four `/learn/` articles and the `/plans/[state]` pages that capture search traffic
3. **Employer revenue** — first paid contract and the co-branded landing page generator
4. **RIA/portfolio layer** — conditional on Phase 5 legal outcome; builds personalized recommendations if confirmed viable

The 10,000-user goal is the end-of-phase gate. Social proof only works at scale — don't ship the "X families have started their NestEgg" counter until the number is meaningful (at least 500).

---

## Milestone 1 — Data Flywheel

### `stats_cache` table

```sql
create table if not exists stats_cache (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);
```

Keys stored:
- `total_users` — `{ "count": 1234 }`
- `flows_completed` — `{ "count": 987 }`
- `most_popular_plan` — `{ "plan": "Utah my529", "count": 312 }`
- `median_monthly_contribution` — `{ "median": 50 }`
- `users_by_state` — `{ "NY": 145, "CA": 98, "TX": 67, ... }`
- `most_popular_plan_by_state` — `{ "NY": "NY 529 Direct Plan", "CA": "Utah my529", ... }`

### Nightly cron to populate cache

Add to `vercel.json`:

```json
{
  "crons": [
    { "path": "/api/cron/reminders", "schedule": "0 9 1 * *" },
    { "path": "/api/cron/stats", "schedule": "0 0 * * *" }
  ]
}
```

Create `src/app/api/cron/stats/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Total users
  const { count: totalUsers } = await db.from('users').select('*', { count: 'exact', head: true });

  // Flows completed
  const { count: flowsCompleted } = await db.from('events')
    .select('*', { count: 'exact', head: true })
    .eq('event', 'flow_completed');

  // Most popular 529 plan overall
  const { data: planData } = await db.from('setup_progress')
    .select('step_529_plan_name')
    .not('step_529_plan_name', 'is', null);
  const planCounts: Record<string, number> = {};
  for (const row of planData ?? []) {
    planCounts[row.step_529_plan_name] = (planCounts[row.step_529_plan_name] ?? 0) + 1;
  }
  const mostPopularPlan = Object.entries(planCounts).sort((a, b) => b[1] - a[1])[0];

  // Median monthly contribution
  const { data: contribData } = await db.from('children').select('monthly_contribution');
  const contribs = (contribData ?? []).map(r => r.monthly_contribution).sort((a, b) => a - b);
  const median = contribs.length ? contribs[Math.floor(contribs.length / 2)] : 50;

  // Users by state
  const { data: stateData } = await db.from('children').select('state').not('state', 'is', null);
  const stateCounts: Record<string, number> = {};
  for (const row of stateData ?? []) {
    stateCounts[row.state] = (stateCounts[row.state] ?? 0) + 1;
  }

  // Upsert all cache entries
  const now = new Date().toISOString();
  await db.from('stats_cache').upsert([
    { key: 'total_users', value: { count: totalUsers ?? 0 }, updated_at: now },
    { key: 'flows_completed', value: { count: flowsCompleted ?? 0 }, updated_at: now },
    { key: 'most_popular_plan', value: { plan: mostPopularPlan?.[0] ?? null, count: mostPopularPlan?.[1] ?? 0 }, updated_at: now },
    { key: 'median_monthly_contribution', value: { median }, updated_at: now },
    { key: 'users_by_state', value: stateCounts, updated_at: now },
  ], { onConflict: 'key' });

  return NextResponse.json({ ok: true });
}
```

### `GET /api/stats` — public endpoint

```typescript
// src/app/api/stats/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { data } = await db.from('stats_cache').select('key, value');
  const stats: Record<string, unknown> = {};
  for (const row of data ?? []) stats[row.key] = row.value;
  return NextResponse.json(stats, {
    headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
```

Cache at the CDN level — stats are a day old at most, no need to hit Supabase on every landing page load.

### Social proof counters

In `src/app/page.tsx`, fetch stats server-side:

```typescript
const statsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stats`, { next: { revalidate: 3600 } });
const stats = await statsRes.json();
const flowsCompleted = stats?.flows_completed?.count ?? 0;
```

Add below the three-account cards:

```tsx
{flowsCompleted >= 500 && (
  <p className="text-center text-sm text-gray-400 mt-8">
    {flowsCompleted.toLocaleString()} families have started their NestEgg.
  </p>
)}
```

Only show when count ≥ 500 — don't show a small number, it signals low traction.

**Contribution benchmark nudge in ProjectionCard:**

```tsx
// In ProjectionCard.tsx, add below the projection output:
{stats?.median_monthly_contribution?.median && (
  <p className="text-xs text-gray-400 mt-1">
    NestEgg families contribute ${stats.median_monthly_contribution.median}/month on average.
  </p>
)}
```

Pass `medianContribution` as a prop from the server component down to `ProjectionCard`.

### `/plans` leaderboard

Create `src/app/plans/page.tsx` — server component, fetch from stats cache:

```typescript
export const metadata = {
  title: 'Best 529 Plans by State — NestEgg',
  description: 'See which 529 plans NestEgg families are using in every state. Recommendations based on fees and tax deductions.',
};

// Fetch users_by_state and most_popular_plan_by_state from /api/stats
// Build a sorted table: state | recommended plan | families using it
```

Create `src/app/plans/[state]/page.tsx` — static generation:

```typescript
import { statePlans } from '@/data/statePlans';

export async function generateStaticParams() {
  return statePlans.map(plan => ({ state: plan.state.toLowerCase().replace(/\s/g, '-') }));
}

export async function generateMetadata({ params }: { params: { state: string } }) {
  const stateName = params.state.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    title: `Best 529 Plan for ${stateName} Residents — NestEgg`,
    description: `NestEgg's recommended 529 plan for ${stateName}, based on fees and state tax deduction eligibility.`,
  };
}
```

Page content:
- Recommended plan name (from `statePlans.ts`)
- Why it's recommended: deduction note if available, "lowest-fee plan open to all states" if Utah fallback
- "Open [Plan Name] →" button
- Number of NestEgg families in this state using this plan (from stats cache)
- Disclosure: "Recommendations based on publicly available fee comparisons. Not personalized financial advice."

These pages are SEO targets. Each one should index for "[State] 529 plan" queries over time.

Submit sitemap update to Google Search Console after `/plans` and `/plans/[state]` pages go live.

---

## Milestone 2 — SEO Content

### `/learn/` hub structure

```typescript
// src/app/learn/page.tsx — index page
export const metadata = {
  title: 'Learn About 529 Plans, UTMA Accounts, and More — NestEgg',
  description: 'Plain-language guides for new parents on 529 plans, UTMA accounts, and building credit for kids.',
};
// List all four articles with titles, descriptions, and links
```

### Article template pattern

Each article at `/learn/[slug]/page.tsx`:

```typescript
export const metadata = {
  title: '[Article Title] — NestEgg',
  description: '[1-2 sentence summary]',
  openGraph: { type: 'article', publishedTime: '2026-MM-DD', authors: ['NestEgg'] },
};

// Article schema:
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '[Title]',
  datePublished: '2026-MM-DD',
  dateModified: '2026-MM-DD',
  author: { '@type': 'Organization', name: 'NestEgg' },
  publisher: { '@type': 'Organization', name: 'NestEgg', url: 'https://nestegg.app' },
};
```

Add a "Try NestEgg →" CTA box at the bottom of every article:

```tsx
<div className="bg-green-50 border border-green-100 rounded-2xl p-6 mt-12">
  <p className="font-semibold text-gray-800">Ready to set this up?</p>
  <p className="text-gray-500 text-sm mt-1">NestEgg walks you through opening a 529, UTMA, and authorized user card in under 10 minutes.</p>
  <a href="/" className="inline-block mt-4 bg-green-600 text-white font-semibold py-2 px-5 rounded-xl text-sm">
    See your projection →
  </a>
</div>
```

### Four articles — scope and key points

**`/learn/529-plan-basics`**
- What is a 529, who can open one, what can it pay for
- State deduction vs. no deduction — how to decide
- Common myths (it's only for college, you lose money if they don't go to college)
- Internal link: "See what $50/month grows to by age 18 →" (links to projection card)
- FAQ schema: "What if my child doesn't go to college?" / "Can I use a 529 for K-12?"

**`/learn/utma-vs-529`**
- Key difference: 529 is restricted to education, UTMA is unrestricted
- The case for both: hedge against "what if they don't need the 529"
- Tax treatment of each
- Internal link: "NestEgg sets up both in the same session →"
- FAQ schema: "Which is better, a 529 or UTMA?" / "Can I have both?"

**`/learn/authorized-user-credit-card-kids`**
- How authorized user credit building works
- Age at which cards report to bureaus (varies by issuer)
- Common misconceptions (they don't need to use the card)
- Table: major issuers and their minimum age for authorized users
- Internal link: "NestEgg walks you through adding them →"
- FAQ schema: "What age can you add a child as authorized user?" / "Does adding an authorized user hurt your credit?"

**`/learn/how-much-to-save-for-college`**
- Current 4-year public vs. private tuition costs and projections
- The 1/3 rule (1/3 savings, 1/3 income at time, 1/3 loans/aid)
- What $25/mo, $50/mo, $100/mo, $200/mo grows to — table format
- Framing: something is always better than nothing
- Embed the projection card: `<ProjectionCard />` inline in the article
- FAQ schema: "How much does college cost?" / "Is $50/month enough for college?"

---

## Milestone 3 — Employer Revenue

### Employers table

```sql
create table if not exists employers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  logo_url text,
  custom_headline text,
  contact_email text,
  active boolean default true,
  created_at timestamptz default now()
);
```

### `/e/[employer-slug]` route

```typescript
// src/app/e/[slug]/page.tsx
import { notFound } from 'next/navigation';
import db from '@/lib/db';
import ProjectionCard from '@/components/ProjectionCard';

type Employer = { name: string; slug: string; logo_url: string | null; custom_headline: string | null };

export default async function EmployerPage({ params }: { params: { slug: string } }) {
  const { data: employer } = await db
    .from('employers')
    .select('name, slug, logo_url, custom_headline')
    .eq('slug', params.slug)
    .eq('active', true)
    .single() as { data: Employer | null };

  if (!employer) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          {employer.logo_url && (
            <img src={employer.logo_url} alt={employer.name} className="h-10 mx-auto mb-6 object-contain" />
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {employer.custom_headline ?? `${employer.name} — NestEgg for New Parents`}
          </h1>
          <p className="text-gray-500">Open a 529, UTMA, and start building credit for your child — in under 10 minutes.</p>
        </header>
        <ProjectionCard />
      </div>
    </div>
  );
}
```

All events from `/e/[slug]` visits include `utm_source=employer&utm_medium=[slug]` — pass as query params when generating the employer URL.

### Admin employer management

Add an employer section to `/admin`:

```tsx
// In AdminPage, add form:
// Name, Slug, Logo URL (optional), Custom Headline (optional), Contact Email
// POST /api/admin/employers → creates record, returns /e/[slug] URL
// Table: list of employers, their slugs, created_at, link to /e/[slug]
```

Create `src/app/api/admin/employers/route.ts`:

```typescript
export async function POST(req: NextRequest) {
  // Verify admin session
  // Insert to employers table
  // Return { slug, url: `${BASE_URL}/e/${slug}` }
}

export async function GET(req: NextRequest) {
  // Verify admin session
  // Return all employers
}
```

### Employer reporting

Add to `/admin` — per-employer funnel:

```sql
-- Events from a specific employer (utm_medium = slug)
select
  event,
  count(*) as count
from events
where properties->>'utmSource' = 'employer'
  and properties->>'utmMedium' = '[slug]'
group by event
order by count desc;
```

Send a monthly summary email to each employer's `contact_email`:
- "This month, X employees from [Company] started their child's financial foundation."
- Powered by the existing Resend + Vercel cron infrastructure.

### Pricing + contract

Define before building the reporting:

```
Pricing options (pick one before the first contract):
  - Per-seat: $3–5/employee/year (billed annually, capped at headcount)
  - Per-completion: $25–50 per employee who completes all 3 steps
  - Flat annual: $500/year for <100 employees, $1,500/year for 100–500

Contract template must be reviewed by legal before signing.
Log chosen pricing model in aiDocs/decisions.md.
```

---

## Milestone 4 — RIA / Portfolio Recommendations (Conditional)

Only build this if Phase 5 legal review confirmed a viable path (solicitor agreement or full RIA registration).

### If solicitor agreement confirmed:

Add a portfolio recommendation step after `/setup/529` plan selection. New route: `/setup/portfolio`.

```typescript
// src/app/setup/portfolio/page.tsx
// Reads child's birth year from localStorage
// Calculates approximate age
// Renders age-based recommendation:
//   Age 0-8:  "Age-Based Aggressive Growth Portfolio"
//   Age 8-14: "Age-Based Moderate Growth Portfolio"
//   Age 14+:  "Age-Based Conservative Portfolio"
//
// Framing: "Most families with a [age]-year-old in [Plan Name] choose..."
// Copy MUST be reviewed by counsel before going live
// This page MUST include the solicitor disclosure
```

Solicitor disclosure (counsel must provide final language):

```
"NestEgg has a solicitor agreement with [Plan Provider]. NestEgg may receive
compensation if you open an account or select a portfolio through our link.
This does not affect the recommendations shown. See our full disclosure policy."
```

Track:
- `portfolio_recommendation_shown`
- `portfolio_recommendation_accepted` (clicked through)
- `portfolio_recommendation_dismissed` (skipped)

The `/setup/portfolio` step is **opt-in** — users can skip directly to `/setup/utma`. Never block flow progress on a recommendation step.

---

## File Structure Additions

```
src/
  app/
    plans/
      page.tsx                   ← state leaderboard
      [state]/page.tsx           ← per-state static page
    learn/
      page.tsx                   ← content hub index
      529-plan-basics/page.tsx
      utma-vs-529/page.tsx
      authorized-user-credit-card-kids/page.tsx
      how-much-to-save-for-college/page.tsx
    e/
      [slug]/page.tsx            ← employer co-branded landing
    setup/
      portfolio/page.tsx         ← conditional portfolio step
    api/
      stats/route.ts             ← public stats cache
      cron/
        stats/route.ts           ← nightly cache refresh
      admin/
        employers/route.ts       ← employer CRUD
```

---

## New Env Vars (Phase 6)

No new env vars required. All infrastructure (Supabase, Vercel cron, Resend, `CRON_SECRET`) was set up in Phase 3.

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| 10,000-user goal requires consistent acquisition for 6 months | Medium | Clinic + employer channels compound; don't rely on organic alone. Review UTM data monthly. |
| `/plans/[state]` pages take 6+ months to index | High | This is normal for SEO. Submit sitemap immediately and treat it as a long-term asset, not a Phase 6 deliverable. |
| First employer contract takes longer than expected | Medium | Keep the pricing and contract template ready. One warm intro from your network moves faster than cold outreach. |
| Portfolio recommendation step adds regulatory complexity | High | This step is conditional. If legal doesn't clear it, skip it — the product works without it. |
| Stats counter shows a number < 500 | Low (by Phase 6) | The component checks for the threshold before rendering. Don't ship social proof until the number is meaningful. |
