import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import crypto from 'crypto';
import { log } from '@/lib/log';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) {
    log('warn', '/api/gift', 'unauthorized', { reason: 'no_token' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const session = getSession(token);
  if (!session) {
    log('warn', '/api/gift', 'unauthorized', { reason: 'invalid_token' });
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const child = db.prepare(`SELECT id FROM children WHERE user_id = ? LIMIT 1`).get(session.userId) as { id: number } | undefined;
  if (!child) {
    log('warn', '/api/gift', 'no_child_found', { userId: session.userId });
    return NextResponse.json({ error: 'no child found' }, { status: 404 });
  }

  const giftToken = crypto.randomBytes(4).toString('hex'); // 8-char hex token

  db.prepare(`INSERT INTO gift_links (user_id, child_id, token) VALUES (?, ?, ?)`)
    .run(session.userId, child.id, giftToken);

  log('info', '/api/gift', 'gift_link_created', { userId: session.userId, childId: child.id, giftToken });
  return NextResponse.json({ token: giftToken });
}
