import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';
import { log } from '@/lib/log';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) return NextResponse.json(null);

  const session = getSession(token);
  if (!session) {
    log('warn', '/api/me', 'invalid_session');
    return NextResponse.json(null);
  }

  const child = db.prepare(`
    SELECT c.*, sp.step_529_done, sp.step_529_plan_name, sp.step_utma_done, sp.step_credit_done, sp.step_credit_issuer, sp.completed_at
    FROM children c
    LEFT JOIN setup_progress sp ON sp.child_id = c.id
    WHERE c.user_id = ?
    LIMIT 1
  `).get(session.userId);

  if (!child) {
    log('info', '/api/me', 'no_child_found', { userId: session.userId });
    return NextResponse.json(null);
  }

  log('info', '/api/me', 'user_fetched', { userId: session.userId });
  return NextResponse.json({ email: session.email, child });
}
