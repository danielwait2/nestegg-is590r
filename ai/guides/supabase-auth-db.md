# Supabase Auth & Database — NestEgg Quick Reference

**Version confirmed:** @supabase/supabase-js 2.97.0 | @supabase/ssr (latest)
**Date verified:** 2026-02-21

---

## Install

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## Environment variables (.env.local)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Client Setup — @supabase/ssr (Next.js App Router)

### Browser client (Client Components)

```ts
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server client (Server Components / Route Handlers)

```ts
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )
}
```

### Middleware (token refresh)

```ts
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Refresh session — do not remove
  await supabase.auth.getUser()
  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## Auth — Magic Link / OTP

### Send magic link (email)

```ts
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://yourdomain.com/auth/callback',
  },
})
```

### Send OTP (no redirect — user enters code)

Configure your Supabase email template to use `{{ .Token }}` instead of `{{ .ConfirmationURL }}`, then:

```ts
const { error } = await supabase.auth.signInWithOtp({ email: 'user@example.com' })
```

### Verify OTP

```ts
const { data, error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email',
})
```

### Get current user (Server Component)

```ts
const supabase = await createClient()
const { data: { user } } = await supabase.auth.getUser()
```

### Sign out

```ts
await supabase.auth.signOut()
```

---

## Database Queries

### Select

```ts
// All rows
const { data, error } = await supabase.from('portfolios').select('*')

// Specific columns
const { data, error } = await supabase
  .from('portfolios')
  .select('id, name, target_amount')

// With filter
const { data, error } = await supabase
  .from('portfolios')
  .select('*')
  .eq('user_id', user.id)
  .order('created_at', { ascending: false })
```

### Insert

```ts
const { data, error } = await supabase
  .from('portfolios')
  .insert({ user_id: user.id, name: 'Retirement', target_amount: 500000 })
  .select()
  .single()
```

### Upsert (insert or update)

```ts
// By primary key
const { data, error } = await supabase
  .from('portfolios')
  .upsert({ id: existingId, name: 'Updated Name', target_amount: 600000 })
  .select()

// By unique column (non-PK conflict)
const { data, error } = await supabase
  .from('user_settings')
  .upsert({ user_id: user.id, theme: 'dark' }, { onConflict: 'user_id' })
  .select()
```

---

## Row-Level Security (RLS)

RLS is enforced automatically when using the anon key. Policies typically look like:

```sql
-- Enable RLS
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rows
CREATE POLICY "Users see own portfolios"
  ON portfolios FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own rows
CREATE POLICY "Users insert own portfolios"
  ON portfolios FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

The Supabase client automatically sends the user's JWT, so `auth.uid()` resolves correctly in policies.

---

## Error handling pattern

```ts
const { data, error } = await supabase.from('portfolios').select('*')
if (error) {
  console.error('Supabase error:', error.message)
  // handle error
}
```
