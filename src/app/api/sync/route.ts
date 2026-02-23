import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('nestegg_session')?.value;
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const session = getSession(token);
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { child, progress, monthlyAmount } = await req.json();
  if (!child) return NextResponse.json({ ok: true });

  // Upsert child
  const existing = db.prepare(`SELECT id FROM children WHERE user_id = ?`).get(session.userId) as { id: number } | undefined;

  let childId: number;
  if (existing) {
    db.prepare(`
      UPDATE children SET name = ?, birth_month = ?, birth_year = ?, state = ?, monthly_contribution = ?
      WHERE id = ?
    `).run(child.name, child.birthMonth, child.birthYear, child.state, monthlyAmount ?? 50, existing.id);
    childId = existing.id;
  } else {
    const result = db.prepare(`
      INSERT INTO children (user_id, name, birth_month, birth_year, state, monthly_contribution)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(session.userId, child.name, child.birthMonth, child.birthYear, child.state, monthlyAmount ?? 50);
    childId = result.lastInsertRowid as number;
  }

  // Upsert progress
  if (progress) {
    const existingProgress = db.prepare(`SELECT id FROM setup_progress WHERE child_id = ?`).get(childId) as { id: number } | undefined;
    const completedAt = (progress.step1 && progress.step2 && progress.step3) ? new Date().toISOString() : null;

    if (existingProgress) {
      db.prepare(`
        UPDATE setup_progress
        SET step_529_done = ?, step_529_plan_name = ?, step_utma_done = ?, step_credit_done = ?, step_credit_issuer = ?, completed_at = ?
        WHERE id = ?
      `).run(
        progress.step1 ? 1 : 0,
        progress.planName ?? null,
        progress.step2 ? 1 : 0,
        progress.step3 ? 1 : 0,
        progress.issuer ?? null,
        completedAt,
        existingProgress.id
      );
    } else {
      db.prepare(`
        INSERT INTO setup_progress (child_id, step_529_done, step_529_plan_name, step_utma_done, step_credit_done, step_credit_issuer, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        childId,
        progress.step1 ? 1 : 0,
        progress.planName ?? null,
        progress.step2 ? 1 : 0,
        progress.step3 ? 1 : 0,
        progress.issuer ?? null,
        completedAt
      );
    }
  }

  return NextResponse.json({ ok: true });
}
