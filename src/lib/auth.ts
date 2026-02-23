import crypto from 'crypto';
import db from './db';

export function createSession(email: string): string {
  db.prepare(`INSERT OR IGNORE INTO users (email) VALUES (?)`).run(email);
  const user = db.prepare(`SELECT id FROM users WHERE email = ?`).get(email) as { id: number };

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  db.prepare(`INSERT INTO sessions (user_id, token, expires_at) VALUES (?, ?, ?)`)
    .run(user.id, token, expiresAt);

  return token;
}

export function getSession(token: string): { userId: number; email: string } | null {
  const row = db.prepare(`
    SELECT s.user_id as userId, u.email
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ? AND s.expires_at > datetime('now')
  `).get(token) as { userId: number; email: string } | undefined;
  return row ?? null;
}

export function deleteSession(token: string): void {
  db.prepare(`DELETE FROM sessions WHERE token = ?`).run(token);
}
