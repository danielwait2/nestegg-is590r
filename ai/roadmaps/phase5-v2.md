# Phase 5 — V2

**Timeline:** Months 4–6
**Tracking:** [roadmap-phase5-v2.md](roadmap-phase5-v2.md)
**Goal:** Mobile app in both app stores, at least one revenue stream live, insurance marketplace on Done screen.

---

## Overview

Phase 5 is the biggest scope jump in the roadmap. Two hard rules before any code:

1. **Legal counsel must answer the RIA/affiliate question before any revenue code is written.** The affiliate link pattern and the subscription gate both depend on what legal confirms. Do not guess.
2. **The revenue model decision must be logged in `aiDocs/decisions.md`** before starting Milestone 3.

The mobile app and the revenue work can be parallelized once legal is resolved. The insurance marketplace is relatively self-contained and can be built regardless of the affiliate/subscription outcome.

---

## Milestone 1 — Legal + Revenue Structure

### Brief legal counsel

Share three documents before the call:
- `aiDocs/prd.md` — full product description and regulatory framing
- `aiDocs/decisions.md` — current legal position (education-only, no affiliate, no RIA)
- The current `/setup/529` page — shows the specific recommendation pattern (state plan by name, not securities)

Key questions to answer:
1. Does recommending a specific 529 plan provider (e.g., "Utah my529") by name constitute investment advice requiring RIA registration?
2. Does receiving a referral fee or affiliate commission from a 529 plan provider (e.g., a solicitor agreement) require RIA registration or a separate solicitor disclosure?
3. What's the minimum viable disclosure for the current product at Phase 4 scale?

### Research reference: how competitors handle it

Before the legal call, document how UNest and Backer handle disclosures — their public filings and app store descriptions reveal their regulatory structure. Add findings to `aiDocs/decisions.md`.

### Revenue model decision

After legal answers:

**Option A — Affiliate (solicitor agreement)**
- Sign a solicitor agreement with one 529 plan provider
- Receive a referral fee per account opened via NestEgg link
- Requires: solicitor disclosure on every page that links to the provider
- Estimated revenue: $10–50 per completed account opening (industry range)

**Option B — Subscription**
- Free tier: complete the setup flow, see projection, basic reminders
- Paid tier ($4.99/month or $29/year): return-to-progress across devices, contribution reminder emails, account page, gift link tracking
- Requires: Stripe integration, feature gate logic, upgrade prompts
- Estimated revenue: smaller per-user but no legal dependency

**Option C — Hybrid**
- Affiliate for 529 opens + free subscription base
- Most complex but highest ceiling
- Only viable if legal is clean on both paths

Document the decision and rationale in `aiDocs/decisions.md`. Lock it. Do not start Milestone 3 code until this is logged.

---

## Milestone 2 — Mobile App (Expo)

### Initialize project

```bash
npx create-expo-app@latest nestegg-mobile --template blank-typescript
cd nestegg-mobile
```

Recommended monorepo approach — keep web and mobile in the same GitHub repo:

```
/                          ← root
  package.json             ← workspace root (npm workspaces or turborepo)
  apps/
    web/                   ← existing Next.js app (move here from root)
    mobile/                ← new Expo app
  packages/
    core/                  ← shared logic
      src/
        projection.ts      ← calcProjection() — identical to web
        statePlans.ts      ← state → plan map
        issuerInstructions.ts
        types.ts           ← shared TypeScript types
```

If a full monorepo restructure is too disruptive, create `packages/core` as a local package and reference it from both apps via `package.json` workspace path. Either approach works; pick the one that doesn't require rewriting imports across the web app.

### Install mobile dependencies

```bash
cd apps/mobile
npx expo install expo-router expo-notifications expo-linking @supabase/supabase-js @react-native-async-storage/async-storage
```

- `expo-router` — file-based routing (same mental model as Next.js App Router)
- `expo-notifications` — push notification scheduling and delivery
- `expo-linking` — deep links for the magic-link auth confirmation flow
- `@supabase/supabase-js` — same Supabase project as web
- `@react-native-async-storage/async-storage` — replaces localStorage on mobile

### Screen structure

```
app/
  (tabs)/
    index.tsx         ← Home: projection card
    account.tsx       ← Account: contribution slider, re-projection
    settings.tsx      ← Notification prefs, sign out
  setup/
    index.tsx         ← Step 0: child context
    529.tsx           ← Step 1: 529 plan
    utma.tsx          ← Step 2: UTMA
    credit.tsx        ← Step 3: authorized user
    done.tsx          ← Done screen
  auth.tsx            ← Email input, magic link send
  _layout.tsx         ← Root layout, auth state, tab bar
```

### Shared projection logic

```typescript
// packages/core/src/projection.ts
// Identical to web app src/lib/projection.ts — do not diverge
export function calcProjection(monthlyContribution: number, yearsToGrow: number, annualRate = 0.07): number {
  const monthlyRate = annualRate / 12;
  const months = yearsToGrow * 12;
  if (monthlyRate === 0) return monthlyContribution * months;
  return monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
}
```

Import from `@nestegg/core` in both web and mobile. If the math ever needs updating, it updates in one place.

### Auth: magic-link deep link flow

Mobile can't set an httpOnly cookie the same way web does. The pattern:

1. User enters email on mobile auth screen
2. App calls `POST /api/auth/send` (same API endpoint as web)
3. Resend delivers the confirm link (same as web)
4. User taps the link on their phone — it deep-links back to the Expo app
5. Expo app reads the token from the deep link URL, calls `GET /api/auth/confirm`
6. Token is stored in AsyncStorage instead of a cookie

Configure deep links in `app.json`:

```json
{
  "expo": {
    "scheme": "nestegg",
    "intentFilters": [
      {
        "action": "VIEW",
        "data": [{ "scheme": "https", "host": "nestegg.app", "pathPrefix": "/api/auth/confirm" }],
        "category": ["BROWSABLE", "DEFAULT"]
      }
    ]
  }
}
```

Update `GET /api/auth/confirm` to support both web (cookie redirect) and mobile (JSON token response):

```typescript
// Check if request is from mobile (Accept: application/json header or ?mode=mobile)
const isMobile = req.nextUrl.searchParams.get('mode') === 'mobile';
if (isMobile) {
  return NextResponse.json({ ok: true, token, userId: session.userId });
}
// Otherwise: existing cookie + redirect flow
```

### Push notifications

Install and configure in `_layout.tsx`:

```typescript
import * as Notifications from 'expo-notifications';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return;
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // Save token to Supabase: users.expo_push_token
  await fetch('/api/me/push-token', { method: 'PATCH', body: JSON.stringify({ token }) });
}
```

Add `expo_push_token` column to `users` table:

```sql
alter table users add column if not exists expo_push_token text;
```

Contribution reminder (monthly):

```typescript
// src/app/api/cron/reminders/route.ts — extend existing cron
// If user has expo_push_token, send push notification instead of (or in addition to) email
const { ExpoPushMessage } = await import('expo-server-sdk');
// Push to token with: title "Don't forget", body "$50/month → $21,500 by age 18"
```

Birthday notifications (scheduled on sign-in, not cron):

```typescript
// When child data syncs, schedule a local notification for child's 1st, 5th, 10th, 18th birthdays
await Notifications.scheduleNotificationAsync({
  content: { title: `Happy birthday, ${childName}!`, body: `Check how ${childName}'s NestEgg has grown.` },
  trigger: { date: new Date(child.birth_year + 1, child.birth_month - 1, 1) },
});
```

### App Store submission checklist

**iOS (App Store Connect):**
- [ ] Apple Developer Program membership ($99/year)
- [ ] App icon: 1024×1024 PNG (no alpha channel, no rounded corners — Apple adds them)
- [ ] Screenshots: 6.7" (iPhone 15 Pro Max), 6.5" (iPhone 11 Pro Max), 12.9" iPad — at least 3 per device size
- [ ] App description (4,000 char max): lead with the projection hook, list 3 accounts, mention free
- [ ] Keywords (100 char): 529 plan, baby savings, college savings, UTMA, newborn finance
- [ ] Privacy policy URL: `nestegg.app/privacy` — must be live before submission
- [ ] Age rating: 4+ (no objectionable content)
- [ ] Review notes for Apple: explain the financial education framing, confirm no account management
- [ ] Submit for review

**Google Play (Play Console):**
- [ ] Google Play developer account ($25 one-time)
- [ ] Same screenshots adapted to Play Store spec (feature graphic: 1024×500)
- [ ] App content rating questionnaire: Financial category, no in-app purchases (if free tier only)
- [ ] Privacy policy URL (same as iOS)
- [ ] Submit for review

---

## Milestone 3 — Revenue Live

### If affiliate (Option A)

**In `statePlans.ts`:** Add an `affiliateUrl` field alongside `planUrl`. When `affiliateUrl` is set, use it for the "Open →" button; otherwise fall back to `planUrl`.

```typescript
type StatePlan = {
  state: string;
  hasTaxDeduction: boolean;
  planName: string;
  planUrl: string;
  affiliateUrl?: string;    // Set only after solicitor agreement is signed
  deductionNote?: string;
};
```

Track affiliate clicks separately:

```typescript
// In /setup/529, on "Open [Plan] →" click:
if (plan.affiliateUrl) {
  trackEvent('affiliate_click_529', { plan: plan.planName, state: child.state });
}
```

**Disclosure copy** (required on every page that contains an affiliate link):

```
"NestEgg may receive compensation if you open an account through our links.
This does not affect our recommendations. See our disclosure policy."
```

Add to `StepLayout.tsx` footer — it replaces the current education-only disclaimer when any affiliate link is present on the page.

### If subscription (Option B)

Install Stripe:

```bash
npm install stripe @stripe/stripe-js
```

Add env vars:
```bash
STRIPE_SECRET_KEY=sk_live_...        # server only
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Add to users table:

```sql
alter table users add column if not exists is_subscribed boolean default false;
alter table users add column if not exists stripe_customer_id text;
```

**`POST /api/stripe/checkout`** — creates a Stripe Checkout Session:

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const session = await getSession(token);
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: session.email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account?upgraded=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
    metadata: { userId: session.userId },
  });
  return NextResponse.json({ url: checkoutSession.url });
}
```

**`POST /api/stripe/webhook`** — handles `checkout.session.completed`:

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      await db.from('users').update({ is_subscribed: true, stripe_customer_id: session.customer as string }).eq('id', userId);
    }
  }

  return NextResponse.json({ received: true });
}
```

**Feature gate helper:**

```typescript
// src/lib/gate.ts
export function requiresSubscription(feature: 'reminders' | 'account' | 'gift_tracking') {
  // Returns true if the feature is paywalled
  // Consult decisions.md for which features are paid vs. free
  return true; // adjust per revenue model decision
}
```

**`/pricing` page:** Show free vs. paid feature comparison. CTA: "Upgrade — $4.99/month" → calls `POST /api/stripe/checkout`, redirects to Stripe Checkout.

### Insurance marketplace

Add two cards to the Done screen below the summary, above the share buttons:

```tsx
{allDone && (
  <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
    <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">While you're thinking about their future</p>
    <a
      href="https://[partner-url]?utm_source=nestegg"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('insurance_cta_clicked', { type: 'term_life' })}
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
    >
      <div>
        <p className="text-sm font-medium text-gray-800">Protect the income behind this plan</p>
        <p className="text-xs text-gray-500 mt-0.5">Term life insurance — from [Partner]</p>
      </div>
      <span className="text-gray-400 text-sm">→</span>
    </a>
    <a
      href="https://[partner-url]?utm_source=nestegg"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent('insurance_cta_clicked', { type: 'will' })}
      className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
    >
      <div>
        <p className="text-sm font-medium text-gray-800">Name a guardian while you're at it</p>
        <p className="text-xs text-gray-500 mt-0.5">Wills + estate planning — from [Partner]</p>
      </div>
      <span className="text-gray-400 text-sm">→</span>
    </a>
    {/* Only add this line if affiliate compensation is received from the partner */}
    {/* <p className="text-xs text-gray-400">NestEgg may receive compensation for these links.</p> */}
  </div>
)}
```

Research partners before building: Fabric (Gerber Life — term life + will), Trust & Will, or Tomorrow. Confirm whether each has an affiliate program or requires a solicitor agreement.

---

## File Structure Additions

```
apps/
  web/                           ← existing Next.js app (if monorepo)
  mobile/
    app/
      (tabs)/index.tsx           ← Home / projection
      (tabs)/account.tsx         ← Account
      (tabs)/settings.tsx        ← Settings
      setup/                     ← 4-step flow
      auth.tsx
      _layout.tsx
    app.json
    package.json
packages/
  core/
    src/
      projection.ts
      statePlans.ts
      issuerInstructions.ts
      types.ts
    package.json
src/app/
  api/
    stripe/
      checkout/route.ts
      webhook/route.ts
    me/
      push-token/route.ts        ← PATCH expo push token
  pricing/page.tsx               ← subscription pricing page
  privacy/page.tsx               ← required for app store submissions
```

---

## New Env Vars (Phase 5)

| Variable | Required | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | If subscription | Server-side only. Never expose. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | If subscription | Safe to expose to browser. |
| `STRIPE_WEBHOOK_SECRET` | If subscription | Verifies Stripe webhook signatures. |
| `STRIPE_PRICE_ID` | If subscription | Stripe Price ID for the subscription product. |

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| App Store review rejects for financial app policies | Medium | Frame clearly as education tool; no account management, no money movement. Include review notes. |
| Legal says affiliate requires full RIA | Medium | Subscription route is pre-planned. Revenue model decision is made before code is written. |
| Monorepo restructure breaks web app | Medium | Move web app to `apps/web/` in a separate commit; verify build passes before adding mobile. |
| Insurance partner has no affiliate program | Medium | The Done screen cards work without compensation — remove the affiliate disclosure line if no deal. |
