import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { hashSecret } from '@/lib/auth/password';
import { issueSession } from '@/lib/auth/session';
import { DEVICE_BINDING_COOKIE, verifyDeviceBindingToken } from '@/lib/auth/deviceBinding';
import { GET, POST } from '@/app/api/parent/device-binding/route';
import { POST as logout } from '@/app/api/parent/logout/route';
import { hasParentSession } from '@/lib/parentAuth';

// B4: only a signed-in parent binds a device; the binding is an HttpOnly cookie.
// C4: parent logout revokes the token it was given.

const cookieState = vi.hoisted(() => ({ parentToken: '' }));

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => name === 'parent_session' && cookieState.parentToken ? { name, value: cookieState.parentToken } : undefined,
    set: () => undefined
  })
}));

const bind = (body: unknown, cookie = '') => POST(new NextRequest('https://example.test/api/parent/device-binding', {
  method: 'POST',
  headers: { 'content-type': 'application/json', cookie },
  body: JSON.stringify(body)
}));

let passwordHash = '';
beforeAll(() => { passwordHash = hashSecret('right-password'); });

beforeEach(async () => {
  process.env.APP_SESSION_SECRET_CURRENT = 'device-binding-route-secret-0123456789';
  process.env.PARENT_PASSWORD_HASH = passwordHash;
  db.exec('DELETE FROM parent_settings; DELETE FROM parent_session_revocations;');
  cookieState.parentToken = (await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1 })).token;
});

describe('/api/parent/device-binding', { timeout: 60_000 }, () => {
  it('requires a parent session', async () => {
    cookieState.parentToken = '';
    expect((await bind({ binding: 'kiur' })).status).toBe(401);
    expect((await GET(new NextRequest('https://example.test/api/parent/device-binding'))).status).toBe(401);
  });

  it('binds this device with a signed HttpOnly cookie', async () => {
    const response = await bind({ binding: 'kirsi' });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ binding: 'kirsi', required: false });
    const cookie = response.cookies.get(DEVICE_BINDING_COOKIE);
    expect(cookie?.httpOnly).toBe(true);
    expect((await verifyDeviceBindingToken(cookie?.value))?.binding).toBe('kirsi');

    const read = await GET(new NextRequest('https://example.test/api/parent/device-binding', { headers: { cookie: `${DEVICE_BINDING_COOKIE}=${cookie?.value}` } }));
    expect(await read.json()).toEqual({ binding: 'kirsi', required: false });
  });

  it('unbinds, switches "nõua sidumist" and refuses unknown values', async () => {
    const unbound = await bind({ binding: null });
    expect(unbound.cookies.get(DEVICE_BINDING_COOKIE)?.value).toBe('');
    expect(await (await bind({ required: true })).json()).toEqual({ binding: null, required: true });
    expect((await bind({ binding: 'kaur' })).status).toBe(400);
    expect((await bind({ required: 'yes' })).status).toBe(400);
    expect((await bind({})).status).toBe(400);
  });
});

describe('POST /api/parent/logout', () => {
  it('revokes the parent token, not only the cookie', async () => {
    expect(await hasParentSession()).toBe(true);
    await logout();
    // The same token (a copied cookie) is no longer a parent session.
    expect(await hasParentSession()).toBe(false);
  });
});
