import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    logger.warn('auth_confirm_missing_token', { route: '/api/auth/confirm' });
    return NextResponse.redirect(new URL('/auth?error=missing', req.url));
  }

  const session = getSession(token);
  if (!session) {
    logger.warn('auth_confirm_invalid_token', { route: '/api/auth/confirm' });
    return NextResponse.redirect(new URL('/auth?error=invalid', req.url));
  }

  logger.info('auth_confirm_success', { route: '/api/auth/confirm', userId: session.userId });
  const res = NextResponse.redirect(new URL('/setup/done', req.url));
  res.cookies.set('nestegg_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
