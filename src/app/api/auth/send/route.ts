import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { log } from '@/lib/log';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    log('warn', '/api/auth/send', 'missing_email');
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const token = createSession(email);
  const link = `http://localhost:3000/auth/confirm?token=${token}`;

  log('info', '/api/auth/send', 'magic_link_generated', { link, note: 'dev-only: replace with Resend in Phase 3' });

  return NextResponse.json({ ok: true });
}
