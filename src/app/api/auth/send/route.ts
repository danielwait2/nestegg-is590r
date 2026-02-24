import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    logger.warn('auth_send_missing_email', { route: '/api/auth/send' });
    return NextResponse.json({ error: 'email required' }, { status: 400 });
  }

  const token = createSession(email);
  const link = `http://localhost:3000/auth/confirm?token=${token}`;

  logger.info('auth_send_link_created', { route: '/api/auth/send', email });
  console.log('\n--- NestEgg sign-in link ---');
  console.log(link);
  console.log('----------------------------\n');

  return NextResponse.json({ ok: true });
}
