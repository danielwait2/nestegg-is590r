import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function PATCH(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { monthlyContribution } = await req.json();
  if (typeof monthlyContribution !== 'number') return NextResponse.json({ error: 'invalid' }, { status: 400 });

  db.prepare(`UPDATE children SET monthly_contribution = ? WHERE user_id = ?`)
    .run(monthlyContribution, session.userId);

  return NextResponse.json({ ok: true });
}
