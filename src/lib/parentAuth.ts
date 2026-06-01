import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import db from '@/lib/db';

const COOKIE_NAME = 'parent_session';
const PASSWORD_KEY = 'parent_password';

function storedPassword() {
  const row = db.prepare('SELECT value FROM parent_settings WHERE key = ?').get(PASSWORD_KEY) as { value: string } | undefined;
  return row?.value || null;
}

export function parentPassword() {
  return storedPassword() || process.env.PARENT_PASSWORD || '1991';
}

export function isParentPasswordConfigured() {
  return parentPassword().length > 0;
}

function sessionValue() {
  return createHmac('sha256', parentPassword()).update('parent-session').digest('hex');
}

export function verifyParentPassword(input: string) {
  const configured = parentPassword();
  if (!configured) return false;
  const left = Buffer.from(input);
  const right = Buffer.from(configured);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function updateParentPassword(currentPassword: string, nextPassword: string) {
  const cleanNext = nextPassword.trim();
  if (!verifyParentPassword(currentPassword)) throw new Error('Praegune parool on vale.');
  if (cleanNext.length < 4) throw new Error('Uus parool peab olema vähemalt 4 märki.');
  db.prepare(`
    INSERT INTO parent_settings (key, value, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `).run(PASSWORD_KEY, cleanNext, new Date().toISOString());
}

export async function hasParentSession() {
  if (!isParentPasswordConfigured()) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value || '';
  const expected = sessionValue();
  const left = Buffer.from(value);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

export async function setParentSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, sessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
}

export async function clearParentSession() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });
}
