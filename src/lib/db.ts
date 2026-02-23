import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'nestegg.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS children (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT,
    birth_month INTEGER,
    birth_year INTEGER,
    state TEXT,
    monthly_contribution INTEGER DEFAULT 50,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS setup_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    child_id INTEGER NOT NULL REFERENCES children(id),
    step_529_done INTEGER DEFAULT 0,
    step_529_plan_name TEXT,
    step_utma_done INTEGER DEFAULT 0,
    step_credit_done INTEGER DEFAULT 0,
    step_credit_issuer TEXT,
    completed_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event TEXT NOT NULL,
    properties TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS gift_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    child_id INTEGER NOT NULL REFERENCES children(id),
    token TEXT UNIQUE NOT NULL,
    clicks INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
