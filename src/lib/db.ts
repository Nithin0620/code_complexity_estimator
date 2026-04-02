import Database from 'better-sqlite3';
import path from 'path';
import { User, HistoryItem } from '@/types';

/**
 * Basic SQLite Database setup for storing code complexity results.
 * Tables:
 * - users: Stores unique user UIDs and optional names.
 * - history: Stores a log of complexity analyses per user UID.
 */
const dbPath = path.resolve(process.cwd(), 'estimator.db');
const db = new Database(dbPath);

// Initialize DB schema
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    name TEXT
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid TEXT,
    code TEXT,
    result TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// USER FUNCTIONS
export function getUser(uid: string): User | undefined {
  return db.prepare('SELECT * FROM users WHERE uid = ?').get(uid) as User | undefined;
}

export function updateUserName(uid: string, name: string) {
  // First check if user exists, if not create them
  const user = getUser(uid);
  if (!user) {
    db.prepare('INSERT INTO users (uid, name) VALUES (?, ?)').run(uid, name);
  } else {
    db.prepare('UPDATE users SET name = ? WHERE uid = ?').run(name, uid);
  }
}

// HISTORY FUNCTIONS
export function saveHistory(uid: string, code: string, result: string) {
  return db.prepare('INSERT INTO history (uid, code, result) VALUES (?, ?, ?)').run(uid, code, result);
}

export function getHistory(uid: string): HistoryItem[] {
  return db.prepare('SELECT * FROM history WHERE uid = ? ORDER BY createdAt DESC').all(uid) as HistoryItem[];
}

export function deleteHistory(id: number) {
  return db.prepare('DELETE FROM history WHERE id = ?').run(id);
}

export default db;
