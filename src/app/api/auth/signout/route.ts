import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';
import { log } from '@/lib/log';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (token) {
    deleteSession(token);
    log('info', '/api/auth/signout', 'session_deleted');
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set('nestegg_session', '', { maxAge: 0, path: '/' });
  return res;
}
