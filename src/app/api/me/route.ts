import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) return NextResponse.json(null);

  const session = getSession(token);
  if (!session) return NextResponse.json(null);

  const child = db.prepare(`
    SELECT c.*, sp.step_529_done, sp.step_529_plan_name, sp.step_utma_done, sp.step_credit_done, sp.step_credit_issuer, sp.completed_at
    FROM children c
    LEFT JOIN setup_progress sp ON sp.child_id = c.id
    WHERE c.user_id = ?
    LIMIT 1
  `).get(session.userId);

  if (!child) return NextResponse.json(null);
  return NextResponse.json({ email: session.email, child });
}
