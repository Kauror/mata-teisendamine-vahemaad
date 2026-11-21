import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import {
  DEVICE_BINDING_COOKIE,
  deviceMayActAs,
  redirectForBoundDevice,
  signDeviceBinding,
  verifyDeviceBindingToken,
  type DeviceBinding
} from '@/lib/auth/deviceBinding';
import { issueSession } from '@/lib/auth/session';
import { APP_ACCESS_COOKIE, PARENT_SESSION_COOKIE } from '@/lib/auth/constants';
import { setDeviceBindingRequired } from '@/lib/server/deviceAccess';
import { middleware } from '@/middleware';
import { POST as purchase } from '@/app/api/store/purchase/route';
import { POST as freeze } from '@/app/api/store/freeze/route';
import { POST as gift } from '@/app/api/store/gift/route';
import { POST as complete } from '@/app/api/tasks/complete/route';
import { POST as remediationStart } from '@/app/api/remediation/route';
import { POST as remediationSubmit } from '@/app/api/remediation/[sessionId]/route';
import { POST as englishStart } from '@/app/api/english/sessions/route';
import { POST as englishAction } from '@/app/api/english/sessions/[id]/route';
import { POST as unitTestStart } from '@/app/api/english/unit-tests/route';
import { POST as unitTestSave } from '@/app/api/english/unit-tests/[id]/route';
import { POST as sync } from '@/app/api/offline/sync/route';
import { childHandlers as textbook } from '@/lib/server/textbook/http';
import { kaardimangHandlers } from '@/lib/server/kaardimang/http';

// B4: each phone remembers its child. The family session lets any device in;
// the signed device binding decides which child a device may act for.


beforeEach(() => {
  vi.stubEnv('APP_SESSION_SECRET_CURRENT', 'device-binding-test-secret-0123456789abcdef');
  vi.stubEnv('APP_SESSION_SECRET_PREVIOUS', '');
  vi.stubEnv('APP_ORIGIN', 'https://example.test');
  setDeviceBindingRequired(false);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('device binding decision', () => {
  it('lets a bound phone act only for its own child', () => {
    expect(deviceMayActAs('kiur', 'kiur', false)).toEqual({ ok: true });
    expect(deviceMayActAs('kiur', 'kirsi', false)).toMatchObject({ ok: false, code: 'device_other_child' });
    expect(deviceMayActAs('kirsi', 'kiur', true)).toMatchObject({ ok: false, code: 'device_other_child' });
  });

  it('lets a parent device act for both children', () => {
    expect(deviceMayActAs('both', 'kiur', true)).toEqual({ ok: true });
    expect(deviceMayActAs('both', 'kirsi', true)).toEqual({ ok: true });
  });

  it('keeps unbound devices working until the parent requires binding', () => {
    expect(deviceMayActAs(null, 'kirsi', false)).toEqual({ ok: true });
    expect(deviceMayActAs(null, 'kirsi', true)).toMatchObject({ ok: false, code: 'device_not_bound' });
  });

  it('names the bound child in Estonian', () => {
    const decision = deviceMayActAs('kirsi', 'kiur', false);
    expect(decision.ok ? '' : decision.message).toBe('See seade on seotud lapsega Kirsi. Teise lapse eest siin midagi muuta ei saa.');
  });

  it('redirects only the other child pages on a bound device', () => {
    expect(redirectForBoundDevice('/kirsi/pood', 'kiur')).toBe('/kiur');
    expect(redirectForBoundDevice('/kiur', 'kirsi')).toBe('/kirsi');
    expect(redirectForBoundDevice('/kiur/pood', 'kiur')).toBeNull();
    expect(redirectForBoundDevice('/kirsi', 'both')).toBeNull();
    expect(redirectForBoundDevice('/kirsi', null)).toBeNull();
    expect(redirectForBoundDevice('/kiurx', 'kirsi')).toBeNull();
    expect(redirectForBoundDevice('/vanem', 'kirsi')).toBeNull();
  });
});

describe('device binding cookie', () => {
  it('round-trips and refuses a tampered or foreign token', async () => {
    const token = await signDeviceBinding('kirsi');
    expect((await verifyDeviceBindingToken(token))?.binding).toBe('kirsi');
    const [payload, signature] = token.split('.');
    const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url').toString()), binding: 'both' })).toString('base64url');
    expect(await verifyDeviceBindingToken(`${forged}.${signature}`)).toBeNull();
    vi.stubEnv('APP_SESSION_SECRET_CURRENT', 'another-secret-entirely-0123456789abcdefgh');
    expect(await verifyDeviceBindingToken(token)).toBeNull();
    expect(await verifyDeviceBindingToken('both')).toBeNull();
  });
});

async function cookieFor(binding: DeviceBinding | null) {
  return binding ? `${DEVICE_BINDING_COOKIE}=${await signDeviceBinding(binding)}` : '';
}

function post(path: string, body: unknown, cookie: string) {
  return new NextRequest(`https://example.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', cookie },
    body: JSON.stringify(body)
  });
}

const device = {
  deviceId: '018f47f6-9f2c-7b9a-8a2e-123456789abc',
  appVersion: 'test',
  timeZone: 'Europe/Tallinn',
  clientNow: '2026-07-13T10:00:00.000Z'
};

const uuid = '018f47f6-9f2c-7b9a-8a2e-123456789abd';
type Handler = (req: NextRequest) => Promise<Response>;
const lessonParams = { params: Promise.resolve({ courseId: 'loodusopetus', unitId: 'unit-1', lessonId: 'lesson-1' }) };

// Every child write route, called as `learner`.
const routes: Array<{ name: string; call: (learner: 'kiur' | 'kirsi', cookie: string) => Promise<Response>; fixedLearner?: 'kiur' }> = [
  { name: 'store/purchase', call: (l, c) => purchase(post('/api/store/purchase', { learner: l, itemId: 987654 }, c)) },
  { name: 'store/freeze', call: (l, c) => freeze(post('/api/store/freeze', { learner: l }, c)) },
  { name: 'store/gift', call: (l, c) => gift(post('/api/store/gift', { from: l, to: l === 'kiur' ? 'kirsi' : 'kiur', amount: 1 }, c)) },
  { name: 'tasks/complete', call: (l, c) => complete(post('/api/tasks/complete', { learner: l, assignmentId: 987654 }, c)) },
  { name: 'remediation', call: (l, c) => remediationStart(post('/api/remediation', { learner: l }, c)) },
  { name: 'remediation/[id]', call: (l, c) => remediationSubmit(post('/api/remediation/1', { learner: l, answers: [] }, c), { params: Promise.resolve({ sessionId: '1' }) }) },
  {
    name: 'offline/sync push', call: (l, c) => sync(post('/api/offline/sync', {
      protocolVersion: 2, phase: 'push', pushKind: 'actions', device, cursor: {},
      pending: { taskActions: [{ clientActionId: uuid, deviceId: device.deviceId, learner: l, actionType: 'complete', taskDate: '2026-07-13', templateId: null, completedAt: null }] }
    }, c))
  },
  { name: 'english/sessions', fixedLearner: 'kiur', call: (_l, c) => englishStart(post('/api/english/sessions', { mode: 'study', unitId: 'u1' }, c)) },
  { name: 'english/sessions/[id]', fixedLearner: 'kiur', call: (_l, c) => englishAction(post(`/api/english/sessions/vs_${uuid}`, { actionId: 'a' }, c), { params: Promise.resolve({ id: `vs_${uuid}` }) }) },
  { name: 'english/unit-tests', fixedLearner: 'kiur', call: (_l, c) => unitTestStart(post('/api/english/unit-tests', { unitId: 'u1' }, c)) },
  { name: 'english/unit-tests/[id]', fixedLearner: 'kiur', call: (_l, c) => unitTestSave(post('/api/english/unit-tests/x', { revision: 0, answers: {} }, c), { params: Promise.resolve({ id: `ut_${uuid}` }) }) },
  { name: 'textbook lesson complete', fixedLearner: 'kiur', call: (_l, c) => textbook.lessonComplete.POST(post('/api/textbook/x', { actionId: uuid }, c), lessonParams) },
  { name: 'kaardimang start', call: (l, c) => (kaardimangHandlers('child').start.POST as Handler)(post(`/api/kaardimang/rounds?player=${l}`, { actionId: uuid }, c)) }
];

async function code(response: Response) {
  return ((await response.clone().json().catch(() => ({}))) as { code?: string }).code;
}

async function message(response: Response) {
  return ((await response.clone().json().catch(() => ({}))) as { message?: string }).message ?? '';
}

describe.each(routes)('$name', ({ call, fixedLearner }) => {
  const learner = fixedLearner ?? 'kiur';
  const other = learner === 'kiur' ? 'kirsi' : 'kiur';

  it('refuses a device bound to the other child with 403', async () => {
    const response = await call(learner, await cookieFor(other));
    expect(response.status).toBe(403);
    expect(await message(response)).toContain(`lapsega ${other === 'kiur' ? 'Kiur' : 'Kirsi'}`);
  });

  it('lets the own child and a parent device past the binding check', async () => {
    for (const binding of [learner, 'both'] as const) {
      const response = await call(learner, await cookieFor(binding));
      expect(['device_other_child', 'device_not_bound']).not.toContain(await code(response));
      expect(await message(response)).not.toContain('seotud lapsega');
    }
  });

  it('keeps an unbound device working until binding is required', async () => {
    const before = await call(learner, '');
    expect(await code(before)).not.toBe('device_not_bound');
    expect(await message(before)).not.toContain('pole veel lapsega seotud');
    setDeviceBindingRequired(true);
    const after = await call(learner, '');
    expect(after.status).toBe(403);
    expect(await message(after)).toContain('pole veel lapsega seotud');
  });
});

describe('pages of the other child on a bound device', () => {
  async function navigate(path: string, binding: DeviceBinding | null, dest = 'document', extra: Record<string, string> = {}) {
    const family = await issueSession('family', { maxAgeSeconds: 60 });
    const cookie = [`${APP_ACCESS_COOKIE}=${family.token}`, await cookieFor(binding)].filter(Boolean).join('; ');
    return middleware(new NextRequest(`https://example.test${path}`, { headers: { cookie, 'sec-fetch-dest': dest, ...extra } }));
  }

  it('redirects an in-app tap (a Next.js RSC fetch) to the bound child too', async () => {
    // Kaur 21.11: on Kiur's bound phone, tapping Kirsi's card on the home page
    // opened Kirsi's page, because only full page loads were redirected.
    // Next strips RSC: 1 before middleware; the router's Next-Url header stays.
    const response = await navigate('/kirsi', 'kiur', 'empty', { 'next-url': '/' });
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/kiur');
  });

  it('redirects a navigation to the bound child', async () => {
    const response = await navigate('/kirsi/pood', 'kiur');
    expect(response.status).toBe(307);
    expect(new URL(response.headers.get('location')!).pathname).toBe('/kiur');
  });

  it('leaves own pages, parent devices and service-worker precache fetches alone', async () => {
    expect((await navigate('/kiur/pood', 'kiur')).headers.get('x-middleware-next')).toBe('1');
    expect((await navigate('/kirsi', 'both')).headers.get('x-middleware-next')).toBe('1');
    expect((await navigate('/kirsi', null)).headers.get('x-middleware-next')).toBe('1');
    expect((await navigate('/kirsi', 'kiur', 'empty')).headers.get('x-middleware-next')).toBe('1');
  });
});

describe('peek mode and offline sync (C3b)', () => {
  async function syncAs(phase: 'push' | 'pull', options: { parent: boolean; optOut?: boolean }) {
    const parent = options.parent ? await issueSession('parent', { maxAgeSeconds: 60, authVersion: 1 }) : null;
    const cookie = [parent ? `${PARENT_SESSION_COOKIE}=${parent.token}` : '', options.optOut ? 'harjutaja_peek_off=1' : ''].filter(Boolean).join('; ');
    const body = phase === 'push'
      ? { protocolVersion: 2, phase, pushKind: 'attempts', device, cursor: {}, pending: { attempts: [] } }
      : { protocolVersion: 2, phase, device, cursor: {} };
    return sync(post('/api/offline/sync', body, cookie));
  }

  it('refuses a push while a parent peeks', async () => {
    const response = await syncAs('push', { parent: true });
    expect(response.status).toBe(403);
    expect(await code(response)).toBe('peek_read_only');
  });

  it('keeps the pull working while peeking, and pushes for the child or "Vaata nagu laps"', async () => {
    expect((await syncAs('pull', { parent: true })).status).toBe(200);
    expect((await syncAs('push', { parent: false })).status).toBe(200);
    expect((await syncAs('push', { parent: true, optOut: true })).status).toBe(200);
  });
});
