# Phase 4 — V1 Launch

**Timeline:** Weeks 9–12
**Tracking:** [roadmap-phase4-v1-launch.md](roadmap-phase4-v1-launch.md)
**Goal:** Get real users. 500 through the complete flow. 5 written testimonials. At least one distribution channel proven.

---

## Overview

Phase 4 is the least technical phase in the roadmap. The app is built and deployed. This phase is about getting it in front of real parents through three channels — clinics, employers, and direct/social — and building the infrastructure to measure what's working.

The single biggest mistake here is building features instead of distributing. Resist it.

---

## Week 1 — Beta Infrastructure + UTM Tracking

### Schema additions

Run in Supabase SQL editor:

```sql
create table if not exists beta_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  rating integer,         -- 1-5 star or 1-2 thumbs
  text text,
  path text,              -- which page the feedback was submitted from
  created_at timestamptz default now()
);

create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  utm_source text,
  created_at timestamptz default now()
);
```

### Floating feedback modal

Create `src/components/FeedbackModal.tsx`:

```typescript
'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const DISMISSED_KEY = 'nestegg_feedback_dismissed';
const EXCLUDED_PATHS = ['/auth', '/auth/confirm', '/admin'];
const DELAY_MS = 30_000; // show after 30 seconds

export default function FeedbackModal() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (EXCLUDED_PATHS.some(p => pathname.startsWith(p))) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  }

  async function handleSubmit() {
    await fetch('/api/feedback/beta', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, text, path: pathname }),
    });
    setSubmitted(true);
    setTimeout(dismiss, 2000);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 w-72">
      {submitted ? (
        <p className="text-sm text-green-600 font-medium text-center py-2">Thanks for the feedback!</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-800">How&apos;s NestEgg?</p>
            <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
          </div>
          <div className="flex gap-2 mb-3">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => setRating(n)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${rating === n ? 'bg-green-600 text-white border-green-600' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}
              >
                {n}
              </button>
            ))}
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Anything else? (optional)"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={2}
          />
          <button
            onClick={handleSubmit}
            disabled={!rating}
            className="w-full mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-semibold py-2 rounded-xl transition-colors"
          >
            Send feedback
          </button>
        </>
      )}
    </div>
  );
}
```

Add `<FeedbackModal />` to `src/app/layout.tsx` so it appears on all pages.

### `POST /api/feedback/beta`

```typescript
// src/app/api/feedback/beta/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const { rating, text, path } = await req.json();
  const cookieStore = await cookies();
  const token = cookieStore.get('nestegg_session')?.value;
  const session = token ? await getSession(token) : null;

  await db.from('beta_feedback').insert({
    user_id: session?.userId ?? null,
    rating,
    text: text ?? null,
    path,
  });

  return NextResponse.json({ ok: true });
}
```

### `/waitlist` page

```typescript
// src/app/waitlist/page.tsx — server component wrapper
export const metadata = {
  title: 'Join NestEgg — Set Your Kids Up for Life',
  description: 'NestEgg walks new parents through opening a 529, UTMA, and credit card in under 10 minutes.',
};
```

Client component handles form submit → `POST /api/waitlist`. After submit: "You're on the list. We'll be in touch."

### `POST /api/waitlist`

```typescript
// src/app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, utm_source } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  await db.from('waitlist').upsert({ email, utm_source: utm_source ?? null }, { onConflict: 'email' });
  return NextResponse.json({ ok: true });
}
```

### UTM tracking

In `src/app/page.tsx` (landing page), read UTM params from the URL and store in localStorage on first load. Since it's a server component, pass to a small client component:

```typescript
// src/components/UTMCapture.tsx
'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UTMCapture() {
  const params = useSearchParams();

  useEffect(() => {
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');

    if (utmSource || utmMedium || utmCampaign) {
      localStorage.setItem('nestegg_utm', JSON.stringify({ utmSource, utmMedium, utmCampaign }));
    }
  }, [params]);

  return null;
}
```

Include `<Suspense><UTMCapture /></Suspense>` in `layout.tsx`.

Update `src/lib/events.ts` to attach UTM data to every event:

```typescript
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  let utm = {};
  try {
    utm = JSON.parse(localStorage.getItem('nestegg_utm') ?? '{}');
  } catch {}

  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties: { ...properties, ...utm } }),
  }).catch(() => {});
}
```

---

## Week 2 — Clinic Distribution Channel

### `/clinic` landing page

```typescript
// src/app/clinic/page.tsx
export const metadata = {
  title: 'Set Your Child Up for Life — NestEgg',
  description: 'Open a 529, UTMA, and start building credit for your child in under 10 minutes. Free.',
};
```

Page design: minimal, fast-loading, no distractions. Parents scan a QR code in a waiting room — the page needs to load and make sense in 5 seconds.

Layout:
```
[NestEgg logo]

"Open three accounts for your new baby — in 10 minutes."

[ProjectionCard — pre-filled at $50/month, current year]

"Your pediatrician thinks every new parent should know about this."

[Set this up for free →]

[Tiny footer disclosure]
```

The CTA routes to `/setup` with `?utm_source=clinic` appended so all subsequent events are tagged.

### Print handout

Create `src/app/clinic/handout/page.tsx` — a printable HTML page (no nav, no footer, optimized for 8.5×11 printing):

```typescript
export const metadata = { robots: 'noindex' }; // don't index the handout page
```

Content:
```
[NestEgg logo — large]

Set your new baby up for life.
In 10 minutes. For free.

[QR code image → nestegg.app/clinic]
(Generate QR code at qr-code-generator.com, save as PNG in /public/clinic-qr.png)

Three accounts. One session.

  529 Plan          — tax-free education savings
  UTMA Account     — flexible investing in their name
  Credit History   — start building it today

"$50/month, started at birth → $21,500 by age 18"
(Hypothetical. 7% avg. annual return. Not a guarantee.)

nestegg.app/clinic

---
NestEgg is a financial education tool, not a registered investment adviser.
This is not personalized financial advice.
```

### Clinic outreach

Identify 3 clinics via:
- Your own pediatrician or OB-GYN (warm intro — easiest)
- Local parenting Facebook groups (ask who their pediatrician is)
- Google Maps: search "pediatrician [city]" — look for practices with 50+ reviews

Email template for office managers:

```
Subject: Free resource for new parents — would your office display it?

Hi [Name],

I'm building NestEgg (nestegg.app) — a free tool that walks new parents
through opening the right financial accounts for their child in under 10 minutes.

I'd love to leave a small stack of one-page handouts in your waiting room,
or have you share the link with new parents at their first appointment.

It's completely free, has no sign-up required, and takes under 10 minutes
to complete. The only ask is that you think it's useful enough to share.

Would you be open to a quick call or email to discuss?

[Your name]
```

Goal: 3 practices agree to display or distribute by end of Week 2.

---

## Week 3 — Employer + Partner Channels

### `/employers` landing page

```typescript
// src/app/employers/page.tsx
export const metadata = {
  title: 'NestEgg for Employee Benefits',
  description: 'Give new parents the most impactful benefit you\'ve never heard of. NestEgg sets up a 529, UTMA, and credit head start in 10 minutes.',
};
```

Page structure:
```
[Headline] "Give new parents the most impactful benefit you've never heard of."

[Sub] "When an employee has a baby, NestEgg walks them through opening a 529,
      UTMA, and authorized user credit card in under 10 minutes. Free for employees.
      No account management. No compliance burden."

[Three benefit cards]
  → "Costs you nothing per employee"
  → "Immediate, concrete value — not a gym discount"
  → "Takes 10 minutes. Not a 30-minute webinar."

[CTA] "Get the one-pager" → email capture → send employer PDF

[Disclosure footer]
```

The "Get the one-pager" CTA should capture email and `utm_source=employers` into the waitlist table, then trigger a Resend email with the PDF attached (or link to `/employers/one-pager`).

### Employer one-pager

Create `src/app/employers/one-pager/page.tsx` — printable HTML, same pattern as clinic handout:

```
[NestEgg — For Employee Benefits]

The problem: 82% of children have no 529 plan.
The moment: New parents are maximally motivated and have zero guidance.
The solution: NestEgg walks them through it in 10 minutes.

How it works:
  1. Employee visits nestegg.app
  2. Interactive projection shows what $50/month becomes by age 18
  3. Guided flow opens 529, UTMA, and authorized user card
  4. Done in under 10 minutes

What you do: Share the link with employees at the life-event moment.
What you pay: Nothing in Phase 1. (Employer pricing coming in 2026.)

Contact: [your email]
```

### Employer outreach

Identify 5 targets:
- Founders in your network (fastest yes/no)
- HR leads at 50–200 person startups (LinkedIn, warm intros)
- Mid-size companies that already offer financial wellness benefits (good signal they'd care)

Email template:

```
Subject: New parent benefit — takes 10 minutes, costs you nothing

Hi [Name],

Quick pitch: NestEgg is a free tool that walks new parents through opening
a 529, UTMA custodial account, and credit card authorized user for their
newborn — in under 10 minutes.

82% of children have no 529 plan. The barrier isn't money — it's the blank
page. NestEgg removes it.

I'm looking for 5 companies to pilot this as a new-parent benefit. You share
the link with employees when they report a birth. That's it.

Worth a 15-minute call?

[Your name]
nestegg.app/employers
```

Goal: 5 conversations initiated.

### `/gift` or `/babylist` landing page

Build this if:
- A BabyList or Bump.com partnership is in progress, **or**
- You want a standalone landing page for the gift link use case

```typescript
// src/app/gift/page.tsx
// Renders the projection card, framed for gifters
// Headline: "Start [Name]'s financial foundation as a gift"
// Copy: grandparents, aunts/uncles, close friends
// utm_source=gift
```

If no partnership, this page still serves as a better landing for anonymous gift links than the plain homepage.

---

## Week 4 — Launch Metrics + Testimonials

### 500-user progress tracking

Add a "milestone" query to `/admin`:

```sql
-- Total users who completed the flow
select count(distinct user_id) as completions
from events
where event = 'flow_completed';

-- Completions by utm_source
select
  properties->>'utmSource' as source,
  count(*) as completions
from events
where event = 'flow_completed'
group by source
order by completions desc;
```

Add these tables to the `/admin` page alongside the existing funnel.

### Testimonial outreach

Pull a list of users who fired `flow_completed` from Supabase. Email them:

```
Subject: Quick question about NestEgg

Hi there,

You completed NestEgg's setup flow a few weeks ago — thank you.

I'm building this in public and would love a quote from you if you're willing.
Something like: "What made you try it? What did you actually do after?"

Even two sentences would mean a lot. I'd feature it on the site (first name +
state, or anonymous — your choice).

Reply to this email. No form, no survey.

[Your name]
```

Goal: 5 quotes with permission to publish. Add to landing page above-the-fold once collected.

### Channel analysis + Phase 5 decision

Review UTM data in Supabase at end of Week 4:

| Signal | Next action |
|---|---|
| Clinic UTM driving > 20% of completions | Scale clinic channel — identify 5 more practices |
| Employer UTM converting | Build employer-specific features earlier (Phase 5 pull-forward) |
| Organic / direct is > 50% of traffic | Invest in SEO content (pull from Phase 6) |
| All channels are flat | Revisit projection card copy and landing page CTA before Phase 5 |

Document the decision in `aiDocs/decisions.md` before starting Phase 5.

---

## File Structure Additions

```
src/
  app/
    waitlist/
      page.tsx                   ← email capture + submit
    clinic/
      page.tsx                   ← clinic landing page
      handout/page.tsx           ← printable handout
    employers/
      page.tsx                   ← employer landing page
      one-pager/page.tsx         ← printable one-pager
    gift/
      page.tsx                   ← standalone gift landing (optional)
    api/
      feedback/
        beta/route.ts            ← floating modal feedback
      waitlist/route.ts          ← email capture
  components/
    FeedbackModal.tsx             ← floating feedback modal
    UTMCapture.tsx                ← reads + stores UTM params
public/
  clinic-qr.png                  ← QR code pointing to /clinic
  employers-one-pager.pdf        ← optional static PDF
```

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Clinics say no | Medium | Start with your own pediatrician — warmest intro. Three is a low bar. |
| Employer outreach gets no replies | Medium | Personalize each email. Use a warm intro if possible. 5 conversations, not 5 yeses. |
| 500-user target feels far | Medium | Clinic + employer channels compound. Each practice serves dozens of new parents per month. |
| BabyList partnership doesn't materialize | High (in this phase) | `/gift` standalone page works regardless. Partnership is a nice-to-have, not a blocker. |
