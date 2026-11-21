import { currentSecret, decodeBase64Url, encodeBase64Url, hmac, keyId, sessionSecrets } from '@/lib/auth/session';

// Per-device child binding ("each phone remembers its child").
//
// The family PIN lets any device in, and a family session alone cannot tell
// Kiur's phone from Kirsi's. The parent, signed in on a device, decides what
// that device is: Kiur's, Kirsi's, or a parent device that may act for both.
// The choice lives in a signed, HttpOnly cookie, so a child can neither read
// nor rewrite it from the page; only /api/parent/device-binding sets it.
//
// Unbound devices (every device on the morning after this ships) keep working
// as before; Vanem shows a prompt to bind them. Once every phone is bound the
// parent can switch on "nõua sidumist", after which an unbound device can no
// longer act for a child (see src/lib/server/deviceAccess.ts).

export const DEVICE_BINDING_COOKIE = 'device_child';
export type DeviceBinding = 'kiur' | 'kirsi' | 'both';
export type ChildLearner = 'kiur' | 'kirsi';

// Browsers cap cookie lifetime at 400 days. The middleware re-signs the cookie
// on page loads once it is older than DEVICE_BINDING_REFRESH_SECONDS, so a phone
// in daily use never loses its binding.
export const DEVICE_BINDING_MAX_AGE_SECONDS = 60 * 60 * 24 * 400;
export const DEVICE_BINDING_REFRESH_SECONDS = 60 * 60 * 24 * 30;

type DeviceBindingPayload = {
  v: 1;
  kind: 'device_binding';
  binding: DeviceBinding;
  issuedAt: number;
  keyId: string;
  // The device's row in the parent's list of bound devices
  // (src/lib/server/deviceRegistry.ts). Missing on bindings made before the
  // list existed; those keep working but are not listed.
  deviceId?: string;
};

const DEVICE_ID = /^[A-Za-z0-9_-]{8,40}$/;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function isDeviceBinding(value: unknown): value is DeviceBinding {
  return value === 'kiur' || value === 'kirsi' || value === 'both';
}

export async function signDeviceBinding(binding: DeviceBinding, nowMs = Date.now(), deviceId?: string) {
  const secret = currentSecret();
  if (!secret) throw new Error('APP_SESSION_SECRET_CURRENT is not configured.');
  const payload: DeviceBindingPayload = {
    v: 1,
    kind: 'device_binding',
    binding,
    issuedAt: Math.floor(nowMs / 1000),
    keyId: await keyId(secret),
    ...(deviceId && DEVICE_ID.test(deviceId) ? { deviceId } : {})
  };
  const encoded = encodeBase64Url(encoder.encode(JSON.stringify(payload)));
  return `${encoded}.${encodeBase64Url(await hmac(secret, encoded))}`;
}

export async function verifyDeviceBindingToken(token: string | null | undefined): Promise<{ binding: DeviceBinding; issuedAt: number; deviceId: string | null } | null> {
  if (!token || token.length > 1024) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;
  let payload: DeviceBindingPayload;
  try {
    payload = JSON.parse(decoder.decode(decodeBase64Url(encoded))) as DeviceBindingPayload;
  } catch {
    return null;
  }
  if (payload?.v !== 1 || payload.kind !== 'device_binding' || !isDeviceBinding(payload.binding) || !Number.isInteger(payload.issuedAt)) return null;
  let secrets: string[];
  try {
    secrets = sessionSecrets();
  } catch {
    return null;
  }
  for (const secret of secrets) {
    if (await keyId(secret) !== payload.keyId) continue;
    let actual: Uint8Array;
    try {
      actual = decodeBase64Url(signature);
    } catch {
      return null;
    }
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    if (await crypto.subtle.verify('HMAC', key, actual, encoder.encode(encoded))) {
      const deviceId = typeof payload.deviceId === 'string' && DEVICE_ID.test(payload.deviceId) ? payload.deviceId : null;
      return { binding: payload.binding, issuedAt: payload.issuedAt, deviceId };
    }
  }
  return null;
}

export function deviceBindingCookieOptions(maxAge = DEVICE_BINDING_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge
  };
}

const CHILD_NAMES: Record<ChildLearner, string> = { kiur: 'Kiur', kirsi: 'Kirsi' };

export function childPageLearner(pathname: string): ChildLearner | null {
  if (pathname === '/kiur' || pathname.startsWith('/kiur/')) return 'kiur';
  if (pathname === '/kirsi' || pathname.startsWith('/kirsi/')) return 'kirsi';
  return null;
}

// The stop page a bound phone gets instead of the other child's pages: it says
// whose device this is, links to that child's page, and lets a parent switch
// the device with the parent password (src/app/vale-seade).
export const WRONG_DEVICE_PATH = '/vale-seade';

// Where a navigation should go on a bound device: from the other child's pages
// to the stop page (never straight into the bound child's page — Kaur 21.11:
// the child should see that this is not their device and pick themselves).
export function redirectForBoundDevice(pathname: string, binding: DeviceBinding | null): string | null {
  if (!binding || binding === 'both') return null;
  const page = childPageLearner(pathname);
  if (!page || page === binding) return null;
  return `${WRONG_DEVICE_PATH}?laps=${page}`;
}

export const DEVICE_OTHER_CHILD_CODE = 'device_other_child';
export const DEVICE_NOT_BOUND_CODE = 'device_not_bound';

export function otherChildMessage(binding: ChildLearner) {
  return `See seade on seotud lapsega ${CHILD_NAMES[binding]}. Teise lapse eest siin midagi muuta ei saa.`;
}

export const DEVICE_NOT_BOUND_MESSAGE = 'See seade pole veel lapsega seotud. Palu vanemal see Vanema lehel siduda.';

// The decision itself, without I/O: may a device with this binding act for
// this learner? `required` is the parent's "nõua sidumist" switch.
export function deviceMayActAs(
  binding: DeviceBinding | null,
  learner: ChildLearner,
  required: boolean
): { ok: true } | { ok: false; code: string; message: string } {
  if (binding === 'both') return { ok: true };
  if (binding === null) {
    return required ? { ok: false, code: DEVICE_NOT_BOUND_CODE, message: DEVICE_NOT_BOUND_MESSAGE } : { ok: true };
  }
  return binding === learner ? { ok: true } : { ok: false, code: DEVICE_OTHER_CHILD_CODE, message: otherChildMessage(binding) };
}
