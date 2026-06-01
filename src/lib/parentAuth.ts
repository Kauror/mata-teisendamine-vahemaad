import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'parent_session';

function password() {
  return process.env.PARENT_PASSWORD || '';
}

export function isParentPasswordConfigured() {
  return password().length > 0;
}

function sessionValue() {
  return createHmac('sha256', password()).update('parent-session').digest('hex');
}

export function verifyParentPassword(input: string) {
  const configured = password();
  if (!configured) return false;
  const left = Buffer.from(input);
  const right = Buffer.from(configured);
  return left.length === right.length && timingSafeEqual(left, right);
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
