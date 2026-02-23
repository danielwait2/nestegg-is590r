import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (token) deleteSession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set('nestegg_session', '', { maxAge: 0, path: '/' });
  return res;
}
