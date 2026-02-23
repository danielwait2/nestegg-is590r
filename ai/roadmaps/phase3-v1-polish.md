# Phase 3 — V1 Polish

**Timeline:** Weeks 5–8
**Tracking:** [roadmap-phase3-v1-polish.md](roadmap-phase3-v1-polish.md)
**Goal:** Migrate off SQLite, deploy to production, fix Phase 2 gaps, add email reminders and NPS, and nail SEO fundamentals.

---

## Overview

Phase 3 has one hard prerequisite before anything else: **migrate from `better-sqlite3` to Supabase**. SQLite with a persistent file doesn't work on Vercel's serverless runtime. The migration also unlocks real email delivery (no more console.log auth links), which is required before you can get users in Phase 4.

After the migration, Phase 3 cleans up the 3 known Phase 2 gaps, adds Resend email for auth and reminders, adds the NPS feedback loop, and pushes SEO fundamentals.

---

## Week 1 — Supabase Migration + Deployment

### Install dependencies

```bash
npm install @supabase/supabase-js
npm uninstall better-sqlite3 @types/better-sqlite3
```

### Create Supabase project

1. Create project at supabase.com (free tier)
2. Go to Settings → API — copy Project URL, anon key, service role key
3. Set env vars in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Create schema in Supabase SQL editor

```sql
-- Enable UUID extension
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  reminder_opted_in boolean default false,
  nps_sent_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token text unique not null,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text,
  birth_month integer,
  birth_year integer,
  state text,
  monthly_contribution integer default 50,
  created_at timestamptz default now()
);

create table if not exists setup_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  step_529_done boolean default false,
  step_529_plan_name text,
  step_utma_done boolean default false,
  step_credit_done boolean default false,
  step_credit_issuer text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  event text not null,
  properties jsonb,
  created_at timestamptz default now()
);

create table if not exists gift_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  token text unique not null,
  clicks integer default 0,
  created_at timestamptz default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  score integer,
  text text,
  created_at timestamptz default now()
);
```

### Rewrite `src/lib/db.ts`

Replace the entire file. The new version exports a single Supabase client for server-side use:

```typescript
// src/lib/db.ts
import { createClient } from '@supabase/supabase-js';

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role for server-side only
);

export default db;
```

`SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — never expose it to the browser. All calls through this client stay in API routes and server components only.

### Rewrite `src/lib/auth.ts`

Key change: `userId` is now `string` (UUID) instead of `number`.

```typescript
// src/lib/auth.ts
import crypto from 'crypto';
import db from './db';

export async function createSession(email: string): Promise<string> {
  // Upsert user
  await db.from('users').upsert({ email }, { onConflict: 'email' });
  const { data: user } = await db
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await db.from('sessions').insert({
    user_id: user!.id,
    token,
    expires_at: expiresAt,
  });

  return token;
}

export async function getSession(
  token: string
): Promise<{ userId: string; email: string } | null> {
  const { data } = await db
    .from('sessions')
    .select('user_id, users(email), expires_at')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (!data) return null;
  const user = data.users as { email: string } | null;
  return user ? { userId: data.user_id, email: user.email } : null;
}

export async function deleteSession(token: string): Promise<void> {
  await db.from('sessions').delete().eq('token', token);
}
```

### Update all API routes

All routes that called `db.prepare(...)` now use `db.from(...)`. The query logic stays the same — only the syntax changes. Key updates:

- `POST /api/auth/send` — `createSession` is now async; `await` it
- `GET /api/auth/confirm` — `getSession` is now async; `await` it
- `POST /api/auth/signout` — `deleteSession` is now async; `await` it
- `POST /api/sync` — replace `db.prepare(INSERT/UPDATE).run()` with `db.from().upsert()`
- `GET /api/me` — replace raw SQL joins with `db.from().select()`
- `PATCH /api/me/contribution` — replace `db.prepare(UPDATE).run()` with `db.from().update()`
- `POST /api/events` — replace insert with `db.from('events').insert()`
- `POST /api/gift` — replace insert with `db.from('gift_links').insert()`

All server components that called `db.prepare(...)` directly (admin page, gift link page) also need updating.

### Add Resend for auth email (replaces console.log)

Install:
```bash
npm install resend
```

Set `RESEND_API_KEY` in `.env.local`. For local dev without a domain, use Resend's test mode — it accepts any `from` address and logs delivery.

Update `POST /api/auth/send`:

```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);

// Replace console.log block with:
const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/confirm?token=${token}`;
await resend.emails.send({
  from: 'NestEgg <hello@nestegg.app>',
  to: email,
  subject: 'Your NestEgg sign-in link',
  html: `<p>Click to sign in:</p><a href="${confirmUrl}">${confirmUrl}</a><p>Link expires in 30 days.</p>`,
});
```

For local dev, if `RESEND_API_KEY` is not set, fall back to console.log so the local workflow still works:

```typescript
if (process.env.RESEND_API_KEY) {
  await resend.emails.send({ ... });
} else {
  console.log('\n--- NestEgg sign-in link ---');
  console.log(confirmUrl);
  console.log('----------------------------\n');
}
```

### Clean up `next.config.ts`

Remove the webpack externals block added for `better-sqlite3`:

```typescript
// next.config.ts — remove this entire block:
webpack: (config) => {
  config.externals.push({ 'better-sqlite3': 'commonjs better-sqlite3' });
  return config;
},
```

### Deploy to Vercel

```bash
npm run build  # must pass with zero errors before pushing
```

1. Connect GitHub repo to Vercel (Settings → Git → Connect)
2. Set all env vars in Vercel (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_BASE_URL` (e.g. `https://nestegg.app`)
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`
3. Push to main → Vercel auto-deploys
4. Verify: visit the public URL, complete sign-in flow, confirm session cookie is set

---

## Week 2 — Phase 2 Gaps + Production QA

### Fix 1: Wire gift link to `/api/gift` for signed-in users

In `src/app/setup/done/page.tsx`, update `handleGift()`:

```typescript
async function handleGift() {
  if (isSignedIn) {
    try {
      const res = await fetch('/api/gift', { method: 'POST' });
      const { token } = await res.json();
      const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? window.location.origin}/g/${token}`;
      await navigator.clipboard.writeText(url);
      setShareMsg('Gift link copied!');
    } catch {
      // Fall back to query-param URL
      const url = generateShareUrl(true);
      await navigator.clipboard.writeText(url);
      setShareMsg('Gift link copied!');
    }
  } else {
    const url = generateShareUrl(true);
    try { await navigator.clipboard.writeText(url); } catch { setShareMsg(url); return; }
    setShareMsg('Gift link copied!');
  }
  trackEvent('gift_link_clicked');
  setTimeout(() => setShareMsg(''), 3000);
}
```

### Fix 2: Track `gift_link_clicked` on `/g/[token]` page load

In `src/app/g/[token]/page.tsx` — add a client-side component that fires the event on mount:

```typescript
// Add to the gift page (client component wrapper or useEffect pattern)
'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/events';

export function GiftPageTracker() {
  useEffect(() => { trackEvent('gift_link_clicked'); }, []);
  return null;
}
```

Include `<GiftPageTracker />` in the gift page layout.

### Fix 3: Welcome-back banner after `/auth/confirm`

After sign-in confirmation redirects to `/setup/done`, the Done page should check for existing data. Update `DonePage` useEffect:

```typescript
// After syncProgress() call:
if (signedIn) {
  syncProgress();
  const res = await fetch('/api/me');
  const data = await res.json();
  if (data?.child) {
    setWelcomeBack(true); // new state: const [welcomeBack, setWelcomeBack] = useState(false)
  }
}
```

Render the banner above the summary card:

```tsx
{welcomeBack && (
  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-sm text-blue-700">
    Welcome back — your progress is saved.
  </div>
)}
```

### Production QA checklist

Run through this on the live Vercel URL, not localhost:

- [ ] Sign-in email arrives in inbox (not just console)
- [ ] Confirm link sets cookie and redirects to `/setup/done`
- [ ] Welcome-back banner appears after confirm redirect
- [ ] Full flow on Chrome desktop — all three steps, Done screen renders correctly
- [ ] Full flow on Safari mobile (iPhone) — test at 375px
- [ ] Share link in incognito: open URL, confirm projection card pre-fills
- [ ] Gift link (signed-in): generates `/g/[token]`, opens correctly, click count increments in Supabase
- [ ] Gift link (anonymous): generates query-param URL, projection card pre-fills on open
- [ ] All external links open in new tab
- [ ] localStorage cleared → flow starts fresh
- [ ] `/admin` shows real event data

---

## Week 3 — Email Reminders + NPS

### Schema additions

Run in Supabase SQL editor:

```sql
-- Already added reminder_opted_in and nps_sent_at to users table in Week 1 migration above.
-- If not already present:
alter table users add column if not exists reminder_opted_in boolean default false;
alter table users add column if not exists nps_sent_at timestamptz;
```

### Opt-in on Done screen

Add a checkbox above the "Save your progress" CTA:

```tsx
// In DonePage, new state:
const [reminderOptIn, setReminderOptIn] = useState(false);

// Below the projection card, before the share buttons:
{!isSignedIn && (
  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
    <input
      type="checkbox"
      checked={reminderOptIn}
      onChange={(e) => setReminderOptIn(e.target.checked)}
      className="rounded accent-green-600"
    />
    Email me a monthly reminder to contribute
  </label>
)}
```

When the user signs in from the Done screen, pass `reminderOptIn` as a query param to `/auth?reminder=1`. The auth flow saves this preference on sign-in.

### `POST /api/email/subscribe` route

```typescript
// src/app/api/email/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('nestegg_session')?.value;
  if (!token) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });
  const session = await getSession(token);
  if (!session) return NextResponse.json({ error: 'invalid session' }, { status: 401 });

  const { optIn } = await req.json();
  await db.from('users').update({ reminder_opted_in: !!optIn }).eq('id', session.userId);
  return NextResponse.json({ ok: true });
}
```

### Contribution reminder email template

Create `src/emails/ReminderEmail.tsx` (plain HTML string is fine if React Email feels heavy):

```typescript
// src/emails/reminder.ts
export function reminderEmailHtml(childName: string, monthly: number, projected: number, accountUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #15803d;">Don't forget — ${childName}'s NestEgg</h2>
      <p>A quick reminder: ${childName}'s compounding projection still shows
         <strong>$${projected.toLocaleString()}</strong> by age 18 at $${monthly}/month.</p>
      <p>If you've updated your contribution or want to adjust it, log in to your account.</p>
      <a href="${accountUrl}" style="background:#15803d;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0;">
        View ${childName}'s account →
      </a>
      <p style="font-size:11px;color:#9ca3af;margin-top:32px;">
        NestEgg is a financial education tool, not a registered investment adviser.
        Hypothetical illustration assuming 7% avg. annual return. Not a guarantee.
        <a href="${accountUrl}/unsubscribe" style="color:#9ca3af;">Unsubscribe</a>
      </p>
    </div>
  `;
}
```

### Monthly reminder cron

Create `src/app/api/cron/reminders/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import db from '@/lib/db';
import { calcProjection } from '@/lib/projection';
import { reminderEmailHtml } from '@/emails/reminder';

const resend = new Resend(process.env.RESEND_API_KEY);
const CURRENT_YEAR = new Date().getFullYear();

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: users } = await db
    .from('users')
    .select('id, email, children(name, birth_year, monthly_contribution)')
    .eq('reminder_opted_in', true);

  for (const user of users ?? []) {
    const child = (user.children as Array<{ name: string; birth_year: number; monthly_contribution: number }>)[0];
    if (!child) continue;
    const years = Math.max(18 - (CURRENT_YEAR - child.birth_year), 0);
    const projected = Math.round(calcProjection(child.monthly_contribution, years));
    await resend.emails.send({
      from: 'NestEgg <hello@nestegg.app>',
      to: user.email,
      subject: `Don't forget — ${child.name}'s NestEgg`,
      html: reminderEmailHtml(child.name, child.monthly_contribution, projected, `${process.env.NEXT_PUBLIC_BASE_URL}/account`),
    });
  }

  return NextResponse.json({ ok: true, sent: users?.length ?? 0 });
}
```

Add to `vercel.json` (create if it doesn't exist):

```json
{
  "crons": [
    {
      "path": "/api/cron/reminders",
      "schedule": "0 9 1 * *"
    }
  ]
}
```

Set `CRON_SECRET` in Vercel env vars — any random string, used to authenticate the cron trigger.

### D+7 NPS email + `/feedback`

NPS trigger: when a `flow_completed` event is inserted, record the timestamp on the user. A separate cron runs daily and sends the NPS email to any user whose `flow_completed` was 7 days ago and `nps_sent_at` is null.

Build `/feedback` page:

```typescript
// src/app/feedback/page.tsx — client component
// Query param: ?token=[user_token] (same session token, or a separate short-lived token)
// Score: 1-10 radio buttons
// Text: optional textarea
// On submit: POST /api/feedback { score, text }
// After submit: "Thanks — your feedback helps NestEgg improve."
```

`POST /api/feedback`:

```typescript
// src/app/api/feedback/route.ts
// Reads session cookie or token query param
// Inserts to feedback table: { user_id, score, text }
// Returns { ok: true }
```

---

## Week 4 — SEO + Polish

### Page metadata

Add `export const metadata` to every page that doesn't have it:

```typescript
// src/app/setup/page.tsx
export const metadata = {
  title: 'Start Your Child\'s Financial Foundation — NestEgg',
  description: 'Tell us about your child and we\'ll walk you through opening the right accounts in under 10 minutes.',
};

// src/app/setup/529/page.tsx
export const metadata = {
  title: 'Open a 529 Plan — NestEgg',
  description: 'We\'ll recommend the best 529 plan for your state and walk you through opening it.',
};

// src/app/setup/done/page.tsx
export const metadata = {
  title: 'Your Child\'s Financial Foundation Is Set — NestEgg',
  description: 'You\'ve opened a 529, UTMA, and started building credit. See what it grows to by their 18th birthday.',
};
```

### OG image

Create `src/app/opengraph-image.tsx`:

```typescript
import { ImageResponse } from 'next/og';
export const runtime = 'edge';
export const size = { width: 1200, height: 630 };

export default function OGImage() {
  return new ImageResponse(
    <div style={{ background: '#f0fdf4', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
      <div style={{ fontSize: 64, fontWeight: 700, color: '#15803d' }}>NestEgg</div>
      <div style={{ fontSize: 36, color: '#374151', marginTop: 24, textAlign: 'center' }}>Set Your Kids Up for Life.</div>
      <div style={{ fontSize: 24, color: '#6b7280', marginTop: 16 }}>Open a 529, UTMA, and credit head start — in 10 minutes.</div>
    </div>
  );
}
```

### FAQ schema on landing page

Add to `src/app/page.tsx` server component:

```typescript
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a 529 plan?',
      acceptedAnswer: { '@type': 'Answer', text: 'A 529 plan is a tax-advantaged savings account designed for education expenses. Contributions grow tax-free and withdrawals for qualified education expenses are also tax-free.' },
    },
    {
      '@type': 'Question',
      name: 'What is a UTMA account?',
      acceptedAnswer: { '@type': 'Answer', text: 'A UTMA (Uniform Transfers to Minors Act) account is a custodial investment account in your child\'s name. Unlike a 529, there are no restrictions on what it can be used for.' },
    },
    {
      '@type': 'Question',
      name: 'How do I add my child as an authorized user on my credit card?',
      acceptedAnswer: { '@type': 'Answer', text: 'Log in to your credit card account, go to account settings, and look for "Add authorized user." Enter your child\'s name and date of birth. SSN is often optional. They build credit history from day one but never need to touch the card.' },
    },
    {
      '@type': 'Question',
      name: 'How much should I contribute per month?',
      acceptedAnswer: { '@type': 'Answer', text: 'There\'s no right answer, but $50/month started at birth grows to roughly $21,500 by age 18 at a hypothetical 7% average annual return. Use the projection tool to find a number that works for your budget.' },
    },
  ],
};

// In the JSX:
<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
```

### Lighthouse checklist

Run in Chrome DevTools → Lighthouse → Mobile:

- Performance > 90: lazy-load `ProjectionChart` (already using `dynamic` import or add it), compress images
- Accessibility > 90: confirm all inputs have labels, all buttons have accessible names, color contrast passes
- SEO > 90: all pages have unique titles and descriptions, OG image is set, robots.txt is not blocking

If Performance is under 90, the most likely culprit is Recharts bundle size. Add dynamic import:

```typescript
// In ProjectionCard.tsx:
import dynamic from 'next/dynamic';
const ProjectionChart = dynamic(() => import('./ProjectionChart'), { ssr: false });
```

---

## File Structure Additions

```
src/
  app/
    api/
      email/
        subscribe/route.ts    ← PATCH reminder opt-in
      cron/
        reminders/route.ts    ← monthly reminder send
      feedback/route.ts       ← NPS score + text
    feedback/page.tsx         ← NPS feedback form
  emails/
    reminder.ts               ← reminder email HTML template
  opengraph-image.tsx         ← Next.js static OG image
vercel.json                   ← cron schedule
```

---

## New Env Vars (Phase 3)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key (safe to expose) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes — server only | Bypasses RLS. Never in browser. |
| `RESEND_API_KEY` | Yes | Resend API key for email sends |
| `NEXT_PUBLIC_BASE_URL` | Yes | Full app URL, e.g. `https://nestegg.app` |
| `CRON_SECRET` | Yes | Random string to authenticate cron endpoint |
| `ADMIN_EMAIL` | Optional | Locks `/admin` to one email address |

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Supabase cold starts slow down API routes | Low | Service role client is initialized at module level, not per-request |
| Resend free tier limits (100 emails/day) | Low | Well within range until Phase 4 scale |
| Vercel cron minimum interval is 1/day (paid), 1/day (hobby) | Low | Monthly reminder cadence fits hobby tier limits |
| UUID FK type mismatch after migration | Medium | Run all auth flows in staging before production; test `getSession` carefully |
