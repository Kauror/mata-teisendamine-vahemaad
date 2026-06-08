import db from '@/lib/db';

const NOTICE_KEY = 'family_notice';
const MAX_LENGTH = 2000;

export function getFamilyNotice(): string {
  const row = db.prepare('SELECT value FROM parent_settings WHERE key = ?').get(NOTICE_KEY) as { value: string } | undefined;
  return row?.value ?? '';
}

export function setFamilyNotice(text: string): string {
  const clean = String(text ?? '').replace(/\r\n/g, '\n').slice(0, MAX_LENGTH).trimEnd();
  db.prepare(`
    INSERT INTO parent_settings (key, value, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `).run(NOTICE_KEY, clean, new Date().toISOString());
  return clean;
}
