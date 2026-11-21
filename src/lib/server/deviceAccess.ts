import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import {
  DEVICE_BINDING_COOKIE,
  deviceMayActAs,
  verifyDeviceBindingToken,
  type ChildLearner,
  type DeviceBinding
} from '@/lib/auth/deviceBinding';
import { deviceStillListed } from '@/lib/server/deviceRegistry';

// Server side of the per-device child binding (src/lib/auth/deviceBinding.ts).
// Every child write route calls assertDeviceMayActAs with the learner it is
// about to act for; the learner may come from the request, so the binding is
// what stops Kiur's phone from spending, gifting or practising as Kirsi.

export const DEVICE_BINDING_REQUIRED_KEY = 'device_binding_required';

export function isDeviceBindingRequired(): boolean {
  const row = db.prepare('SELECT value FROM parent_settings WHERE key = ?').get(DEVICE_BINDING_REQUIRED_KEY) as { value: string } | undefined;
  return row?.value === '1';
}

export function setDeviceBindingRequired(required: boolean) {
  db.prepare(`
    INSERT INTO parent_settings (key, value, updatedAt) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `).run(DEVICE_BINDING_REQUIRED_KEY, required ? '1' : '0', new Date().toISOString());
}

export async function readDeviceToken(req: NextRequest) {
  return verifyDeviceBindingToken(req.cookies.get(DEVICE_BINDING_COOKIE)?.value);
}

// The device's binding, or null when it has none or the parent removed it from
// the list of bound devices (src/lib/server/deviceRegistry.ts). A binding made
// before the list existed carries no device id and still counts.
export async function readDeviceBinding(req: NextRequest): Promise<DeviceBinding | null> {
  const token = await readDeviceToken(req);
  if (!token) return null;
  if (token.deviceId && !deviceStillListed(token.deviceId)) return null;
  return token.binding;
}

// The decision for every learner listed, for handlers with their own error type.
export async function deviceDecision(req: NextRequest, learners: ChildLearner | readonly ChildLearner[]) {
  const list = typeof learners === 'string' ? [learners] : learners;
  if (list.length === 0) return { ok: true } as const;
  const binding = await readDeviceBinding(req);
  const required = binding === null ? isDeviceBindingRequired() : false;
  for (const learner of list) {
    const decision = deviceMayActAs(binding, learner, required);
    if (!decision.ok) return decision;
  }
  return { ok: true } as const;
}

// null when the device may act for every learner listed; otherwise the 403
// the route returns as is.
export async function assertDeviceMayActAs(req: NextRequest, learners: ChildLearner | readonly ChildLearner[]): Promise<NextResponse | null> {
  const decision = await deviceDecision(req, learners);
  return decision.ok ? null : NextResponse.json({ code: decision.code, message: decision.message }, { status: 403 });
}
