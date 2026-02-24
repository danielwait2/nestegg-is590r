import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { log } from '@/lib/log';

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) {
    log('warn', '/api/me/contribution', 'unauthorized', { reason: 'no_token' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const session = getSession(token);
  if (!session) {
    log('warn', '/api/me/contribution', 'unauthorized', { reason: 'invalid_token' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { monthlyContribution } = await req.json();
  if (typeof monthlyContribution !== 'number') {
    log('warn', '/api/me/contribution', 'invalid_input', { userId: session.userId, received: typeof monthlyContribution });
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  db.prepare(`UPDATE children SET monthly_contribution = ? WHERE user_id = ?`)
    .run(monthlyContribution, session.userId);

  log('info', '/api/me/contribution', 'contribution_updated', { userId: session.userId, monthlyContribution });
  return NextResponse.json({ ok: true });
}
