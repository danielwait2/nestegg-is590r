import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { log } from '@/lib/log';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    log('warn', '/api/auth/confirm', 'missing_token');
    return NextResponse.redirect(new URL('/auth?error=missing', req.url));
  }

  const session = getSession(token);
  if (!session) {
    log('warn', '/api/auth/confirm', 'invalid_token');
    return NextResponse.redirect(new URL('/auth?error=invalid', req.url));
  }

  log('info', '/api/auth/confirm', 'session_confirmed', { userId: session.userId });
  const res = NextResponse.redirect(new URL('/setup/done', req.url));
  res.cookies.set('nestegg_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
