# NestEgg — Environment Variables

All environment variables the app needs, by phase. No values stored here — this is a reference and setup checklist.

Add to `.env.local` for local development. Add to Vercel project settings for production and preview environments.

---

## Phase 1 — MVP (client-side only)

| Variable | Where used | Description |
|---|---|---|
| `NEXT_PUBLIC_BASE_URL` | Share link generation | Full base URL of the app (e.g. `https://nestegg.app` in prod, `http://localhost:3000` in dev). Used to construct shareable links. |

**Notes:**
- `NEXT_PUBLIC_` prefix makes these variables available in the browser bundle. Do not use this prefix for secrets.
- No secrets in Phase 1 — everything is client-side.

---

## Phase 2 — Auth + Supabase + Email

| Variable | Where used | Client-safe? | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client | Yes | Your Supabase project URL. Found in Supabase dashboard → Settings → API. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client (browser) | Yes | Public anon key. Safe to expose — access is controlled by Row Level Security policies. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase client (server only) | **No** | Bypasses RLS. Never expose to the browser. Use only in server-side route handlers and middleware. |
| `RESEND_API_KEY` | Email sending | **No** | API key from Resend dashboard. Server-side only. |
| `ADMIN_EMAIL` | `/admin` route protection | **No** | Email address allowed to access the admin page. Middleware checks session email against this value. |

**Setup checklist:**
- [ ] Create Supabase project → copy URL and anon key
- [ ] Generate service role key in Supabase → Settings → API
- [ ] Create Resend account → API Keys → create key
- [ ] Set all five variables in Vercel (Settings → Environment Variables) for Production and Preview

---

## Phase 3 — Push Notifications

| Variable | Where used | Client-safe? | Description |
|---|---|---|---|
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Service worker, push subscription | Yes | VAPID public key for Web Push. Generate with `npx web-push generate-vapid-keys`. |
| `VAPID_PRIVATE_KEY` | Push notification sending (server) | **No** | VAPID private key. Server-side only. Never expose to browser. |
| `VAPID_SUBJECT` | Push notification sending (server) | **No** | Contact URI for VAPID (e.g. `mailto:hello@nestegg.app`). Required by the Web Push spec. |

**How to generate VAPID keys:**
```bash
npx web-push generate-vapid-keys
```
Copy the output — public key goes to `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, private key goes to `VAPID_PRIVATE_KEY`.

---

## Phase 5 — Affiliate + Stripe (if subscription tier)

| Variable | Where used | Client-safe? | Description |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Subscription billing (server) | **No** | Stripe secret key. Server-side only. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe.js (browser) | Yes | Stripe publishable key. Safe to expose. |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook handler | **No** | Used to verify Stripe webhook signatures. Server-side only. |

**Only add if subscription tier is built.** If affiliate revenue is sufficient, Stripe is not needed.

---

## Full Reference (all phases combined)

```bash
# Phase 1
NEXT_PUBLIC_BASE_URL=

# Phase 2 — Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Phase 2 — Email
RESEND_API_KEY=

# Phase 2 — Admin
ADMIN_EMAIL=

# Phase 3 — Push notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=

# Phase 5 — Stripe (only if subscription tier)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

---

## Rules

- **Never commit `.env.local` to git.** It is already in `.gitignore`.
- **Never use `NEXT_PUBLIC_` prefix on secrets.** Anything with that prefix is bundled into the client.
- **Rotate `SUPABASE_SERVICE_ROLE_KEY` if it is ever accidentally exposed.** It bypasses all RLS policies.
- **Vercel preview environments** should use the same Supabase project as production but a separate Resend domain if possible, to avoid polluting real user inboxes during development.
