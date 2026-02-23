# Phase 2 — Local MVP: Persistence + Auth

**Timeline:** 2 weeks
**Tracking:** [roadmap-phase2-v1-core.md](roadmap-phase2-v1-core.md)
**Goal:** Add SQLite persistence, simple local auth, gift links, and an admin view. No external APIs. Runs entirely on localhost.

---

## Week 1 — Auth + Persistence

### Day 1–2: SQLite Setup

Install dependencies:
```bash
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
```

Create `src/lib/db.ts` — initializes `nestegg.db` on first run and creates all tables:

```ts
// src/lib/db.ts
import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'nestegg.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT,
    birth_month INTEGER,
    birth_year INTEGER,
    state TEXT,
    monthly_contribution INTEGER DEFAULT 50,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS setup_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL REFERENCES children(id),
    step_529_done INTEGER DEFAULT 0,
    step_529_plan_name TEXT,
    step_utma_done INTEGER DEFAULT 0,
    step_credit_done INTEGER DEFAULT 0,
    step_credit_issuer TEXT,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event TEXT NOT NULL,
    properties TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gift_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    child_id INTEGER NOT NULL REFERENCES children(id),
    token TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
```

Add `nestegg.db` to `.gitignore`.

Create `src/lib/auth.ts`:

```ts
// src/lib/auth.ts
import crypto from 'crypto';
import db from './db';

export function createSession(email: string): string {
  db.prepare(`INSERT OR IGNORE INTO users (email) VALUES (?)`).run(email);
  const user = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email) as { id: number };

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)`)
    .run(user.id, token, expiresAt);

  return token;
}

export function getSession(token: string): { userId: number; email: string } | null {
  const row = db.prepare(`
    SELECT s.user_id as userId, u.email
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as { userId: number; email: string } | undefined;

  return row ?? null;
}

export function deleteSession(token: string): void {
  db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
}
```

---

### Day 3–4: Auth API Routes + Pages

**`POST /api/auth/send`** — body: `{ email }`. Creates a session token. Logs the confirm link to the console in dev. Returns `{ ok: true }`. Never returns the token in the response body — the user must get it from the terminal.

```ts
// src/app/api/auth/send/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 });

  const token = createSession(email);
  const link = `http://localhost:3000/auth/confirm?token=${token}`;

  console.log('\n--- NestEgg sign-in link ---');
  console.log(link);
  console.log('----------------------------\n');

  return NextResponse.json({ ok: true });
}
```

**`GET /api/auth/confirm`** — query param `token`. Validates token, sets httpOnly cookie `nestegg_session`, redirects to `/setup/done`.

```ts
// src/app/api/auth/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect(new URL('/auth?error=missing', req.url));

  const session = getSession(token);
  if (!session) return NextResponse.redirect(new URL('/auth?error=invalid', req.url));

  const res = NextResponse.redirect(new URL('/setup/done', req.url));
  res.cookies.set('nestegg_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
```

**`POST /api/auth/signout`** — reads cookie, deletes session from DB, clears cookie.

**Pages:**

`/auth/page.tsx` — email input form. On submit, POST to `/api/auth/send`. After submit, show: "Check the server console for your sign-in link."

`/auth/confirm/page.tsx` — reads `token` from the URL query string, hits `GET /api/auth/confirm` via a redirect, shows "Signing you in…" briefly while the redirect resolves.

---

### Day 5: Progress Sync

**`POST /api/sync`** — requires session cookie. Body: `{ child, progress, monthlyAmount }`. Upserts to `children` and `setup_progress`. Returns `{ ok: true }`.

**`GET /api/me`** — requires session cookie. Returns user's child + progress from SQLite, or `null` if none found.

Create `src/lib/syncProgress.ts` — client helper that reads localStorage and POSTs to `/api/sync`:

```ts
// src/lib/syncProgress.ts
export async function syncProgress() {
  const child = JSON.parse(localStorage.getItem('nestegg_child') ?? 'null');
  const progress = JSON.parse(localStorage.getItem('nestegg_progress') ?? 'null');
  const monthlyAmount = localStorage.getItem('nestegg_monthly');

  if (!child) return;

  await fetch('/api/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ child, progress, monthlyAmount }),
  });
}
```

On Done screen: if session cookie is present, call `syncProgress` on mount.

Add "Save your progress →" CTA to Done screen that links to `/auth`.

---

## Week 2 — Gift Links, Account, Admin, Polish

### Day 6–7: Return Flow + Event Tracking

**Return flow:**

After `/auth/confirm`, call `GET /api/me`. If a child record is found, show a welcome-back banner on the landing page or Done screen. Display the child's name and which steps are already complete.

**Event tracking:**

Create `src/lib/events.ts`:

```ts
// src/lib/events.ts
export function trackEvent(event: string, properties?: Record<string, unknown>) {
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, properties }),
  }).catch(() => {}); // fire and forget, never throws
}
```

**`POST /api/events`** — inserts to `events` table. Reads `user_id` from session cookie if present, null if not.

Add `trackEvent` calls at these points:

| Event | Trigger |
|---|---|
| `projection_interacted` | First slider move |
| `flow_started` | Step 0 submit |
| `step_529_completed` | 529 step marked done |
| `step_utma_completed` | UTMA step marked done |
| `step_credit_completed` | Credit step marked done |
| `flow_completed` | Done screen with all 3 checked |
| `share_link_clicked` | Share/copy button on Done screen |
| `gift_link_clicked` | `/g/[token]` page load |

---

### Day 8–9: Gift Links + /account

**Gift links:**

**`POST /api/gift`** — requires session cookie. Generates a random 8-character token. Inserts to `gift_links`. Returns `{ token }`.

**`/g/[token]/page.tsx`** — reads gift link from SQLite, increments `clicks`, renders a projection card pre-filled with the child's name and birth year.

Update Done screen `GiftLinkGenerator`:
- Signed-in users: call `POST /api/gift` → share `localhost:3000/g/[token]`
- Anonymous users: fall back to a query-param URL with name + birth year

**Account page:**

**`/account/page.tsx`** — server component that checks session cookie. If no session, redirect to `/auth`. Shows child's current monthly contribution as a slider. Projection re-calculates live on slide.

**`PATCH /api/me/contribution`** — body: `{ monthlyContribution: number }`. Updates `children.monthly_contribution` in SQLite for the current user's child.

**Projection nudge:**

Add a dashed second line to `ProjectionCard.tsx` at `monthly + 25`. Plain-language label: "That's $[X] more by [Name]'s 18th birthday."

---

### Day 10: Admin Page

**`/admin/page.tsx`** — server component. Access check: read session cookie, look up email, compare to `process.env.ADMIN_EMAIL`. In dev, if `ADMIN_EMAIL` is not set, any signed-in user can access.

Queries SQLite directly. No charts — plain tables.

```sql
-- Total users
SELECT COUNT(*) as total FROM users;

-- Funnel: event counts
SELECT event, COUNT(*) as count
FROM events
GROUP BY event
ORDER BY count DESC;

-- Most common 529 plans
SELECT step_529_plan_name, COUNT(*) as count
FROM setup_progress
WHERE step_529_plan_name IS NOT NULL
GROUP BY step_529_plan_name
ORDER BY count DESC;

-- Most common card issuers
SELECT step_credit_issuer, COUNT(*) as count
FROM setup_progress
WHERE step_credit_issuer IS NOT NULL
GROUP BY step_credit_issuer
ORDER BY count DESC;
```

---

## File Structure Additions

```
src/
  app/
    auth/
      page.tsx
      confirm/page.tsx
    account/page.tsx
    admin/page.tsx
    g/[token]/page.tsx
    api/
      auth/
        send/route.ts
        confirm/route.ts
        signout/route.ts
      sync/route.ts
      me/route.ts
      me/contribution/route.ts    ← PATCH
      events/route.ts
      gift/route.ts
  lib/
    db.ts
    auth.ts
    events.ts
    syncProgress.ts
nestegg.db                        ← gitignored
```

No new env vars required for local dev. Optionally set `ADMIN_EMAIL=your@email.com` in `.env.local`.

---

## Success Criteria

- [ ] SQLite DB auto-creates on first `npm run dev`
- [ ] Sign-in link appears in the terminal console
- [ ] Signed-in users see progress restored after clearing localStorage
- [ ] Gift links work and click count increments in `nestegg.db`
- [ ] `/account` updates contribution and re-projects
- [ ] `/admin` shows real funnel data
- [ ] `npm run build` passes with zero errors
- [ ] No external API calls at any point
