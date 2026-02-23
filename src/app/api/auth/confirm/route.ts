import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.redirect(new URL('/auth?error=missing', req.url));

  const session = getSession(token);
  if (!session) return NextResponse.redirect(new URL('/auth?error=invalid', req.url));

  const res = NextResponse.redirect(new URL('/setup/done', req.url));
  res.cookies.set('nestegg_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
  return res;
}
