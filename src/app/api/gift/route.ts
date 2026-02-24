import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) {
    logger.warn('gift_unauthorized', { route: '/api/gift', reason: 'no_cookie' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const session = getSession(token);
  if (!session) {
    logger.warn('gift_unauthorized', { route: '/api/gift', reason: 'invalid_session' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const child = db.prepare(`SELECT id FROM children WHERE user_id = ? LIMIT 1`).get(session.userId) as { id: number } | undefined;
  if (!child) {
    logger.warn('gift_no_child', { route: '/api/gift', userId: session.userId });
    return NextResponse.json({ error: 'no child found' }, { status: 404 });
  }

  const giftToken = crypto.randomBytes(4).toString('hex');

  db.prepare(`INSERT INTO gift_links (user_id, child_id, token) VALUES (?, ?, ?)`)
    .run(session.userId, child.id, giftToken);

  logger.info('gift_link_created', { route: '/api/gift', userId: session.userId, token: giftToken });
  return NextResponse.json({ token: giftToken });
}
