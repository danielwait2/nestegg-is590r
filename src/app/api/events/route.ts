import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const { event, properties } = await req.json();
  if (!event) return NextResponse.json({ ok: true });

  const token = req.cookies.get('nestegg_session')?.value;
  const session = token ? getSession(token) : null;

  db.prepare(`INSERT INTO events (user_id, event, properties) VALUES (?, ?, ?)`)
    .run(
      session?.userId ?? null,
      event,
      properties ? JSON.stringify(properties) : null
    );

  return NextResponse.json({ ok: true });
}
