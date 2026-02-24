import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { logger } from '@/lib/logger';

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) {
    logger.warn('contribution_unauthorized', { route: '/api/me/contribution', reason: 'no_cookie' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const session = getSession(token);
  if (!session) {
    logger.warn('contribution_unauthorized', { route: '/api/me/contribution', reason: 'invalid_session' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { monthlyContribution } = await req.json();
  if (typeof monthlyContribution !== 'number') {
    logger.warn('contribution_invalid_input', { route: '/api/me/contribution', userId: session.userId, received: monthlyContribution });
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  db.prepare(`UPDATE children SET monthly_contribution = ? WHERE user_id = ?`)
    .run(monthlyContribution, session.userId);

  logger.info('contribution_updated', { route: '/api/me/contribution', userId: session.userId, monthlyContribution });
  return NextResponse.json({ ok: true });
}
