import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { hashSecret } from '@/lib/auth/password';
import { DEVICE_BINDING_COOKIE, signDeviceBinding, verifyDeviceBindingToken } from '@/lib/auth/deviceBinding';
import { POST } from '@/app/api/device/switch/route';
import { listDevices, registerDevice } from '@/lib/server/deviceRegistry';

// The stop page's "Vaheta seadet": a shared device is handed to the other child
// with the parent password, and the parent is not signed in by it.

let passwordHash = '';
beforeAll(() => { passwordHash = hashSecret('right-password'); });
beforeEach(() => {
  process.env.APP_SESSION_SECRET_CURRENT = 'device-switch-route-secret-0123456789';
  process.env.PARENT_PASSWORD_HASH = passwordHash;
  db.exec('DELETE FROM parent_settings;');
  db.exec('DELETE FROM auth_login_limits;');
});

let ip = 0;
const switchDevice = (body: unknown, cookie = '') => POST(new NextRequest('https://example.test/api/device/switch', {
  method: 'POST',
  headers: { 'content-type': 'application/json', cookie, 'x-forwarded-for': `10.0.0.${++ip}` },
  body: JSON.stringify(body)
}));

describe('POST /api/device/switch', { timeout: 60_000 }, () => {
  it('switches Kirsi\'s phone to Kiur with the parent password and keeps its row', async () => {
    const id = registerDevice({ id: null, binding: 'kirsi', device: 'iPhone', app: 'app' });
    const cookie = `${DEVICE_BINDING_COOKIE}=${await signDeviceBinding('kirsi', Date.now(), id)}`;
    const response = await switchDevice({ password: 'right-password', binding: 'kiur', app: true }, cookie);
    expect(response.status).toBe(200);
    const token = await verifyDeviceBindingToken(response.cookies.get(DEVICE_BINDING_COOKIE)?.value);
    expect(token).toMatchObject({ binding: 'kiur', deviceId: id });
    expect(listDevices()).toEqual([expect.objectContaining({ id, binding: 'kiur' })]);
    expect(response.cookies.get('parent_session')).toBeUndefined();
  });

  it('can make a device shared by both children', async () => {
    const response = await switchDevice({ password: 'right-password', binding: 'both' });
    expect((await verifyDeviceBindingToken(response.cookies.get(DEVICE_BINDING_COOKIE)?.value))?.binding).toBe('both');
  });

  it('refuses a wrong password and leaves the binding alone', async () => {
    const response = await switchDevice({ password: 'guess', binding: 'kiur' });
    expect(response.status).toBe(401);
    expect(response.cookies.get(DEVICE_BINDING_COOKIE)).toBeUndefined();
    expect(listDevices()).toEqual([]);
  });

  it('refuses an unknown child', async () => {
    expect((await switchDevice({ password: 'right-password', binding: 'kaur' })).status).toBe(400);
  });
});
