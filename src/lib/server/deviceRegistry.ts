import { randomBytes } from 'node:crypto';
import db from '@/lib/db';
import type { DeviceBinding } from '@/lib/auth/deviceBinding';

// The parent's list of bound devices. The binding itself is the signed cookie
// on the device (src/lib/auth/deviceBinding.ts); this list is what lets the
// parent see which phones are bound, and remove one. A cookie whose device id
// is no longer here counts as unbound (src/lib/server/deviceAccess.ts).
// One JSON row in parent_settings, like the family notice: no migration.

const REGISTRY_KEY = 'device_registry';
const MAX_DEVICES = 30;
const SEEN_EVERY_MS = 60 * 60 * 1000; // lastSeenAt is written at most hourly per device

export type DeviceApp = 'app' | 'browser' | 'unknown';
export type DeviceEntry = {
  id: string;
  binding: DeviceBinding;
  device: string; // "iPhone", "Android", "Windows arvuti" …
  app: DeviceApp; // installed home-screen app or a browser tab: on iPhone they keep separate cookies
  boundAt: string;
  lastSeenAt: string;
};

function isEntry(value: unknown): value is DeviceEntry {
  const v = value as DeviceEntry;
  return Boolean(v) && typeof v.id === 'string' && (v.binding === 'kiur' || v.binding === 'kirsi' || v.binding === 'both')
    && typeof v.device === 'string' && typeof v.boundAt === 'string' && typeof v.lastSeenAt === 'string';
}

export function listDevices(): DeviceEntry[] {
  const row = db.prepare('SELECT value FROM parent_settings WHERE key = ?').get(REGISTRY_KEY) as { value: string } | undefined;
  if (!row) return [];
  try {
    const parsed = JSON.parse(row.value);
    return Array.isArray(parsed) ? parsed.filter(isEntry) : [];
  } catch {
    return [];
  }
}

function save(devices: DeviceEntry[]) {
  db.prepare(`
    INSERT INTO parent_settings (key, value, updatedAt) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `).run(REGISTRY_KEY, JSON.stringify(devices), new Date().toISOString());
}

export function deviceLabel(userAgent: string | null | undefined) {
  const ua = userAgent ?? '';
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) return /Mobile/.test(ua) ? 'Android telefon' : 'Android tahvel';
  if (/Windows/.test(ua)) return 'Windows arvuti';
  if (/Macintosh/.test(ua)) return 'Mac';
  return 'Seade';
}

// Adds this device, or updates its row when it is already listed. Returns its id.
export function registerDevice(input: { id: string | null; binding: DeviceBinding; device: string; app: DeviceApp }, now = new Date()) {
  const devices = listDevices();
  const at = now.toISOString();
  const existing = input.id ? devices.find((d) => d.id === input.id) : undefined;
  if (existing) {
    Object.assign(existing, { binding: input.binding, device: input.device, app: input.app, boundAt: at, lastSeenAt: at });
    save(devices);
    return existing.id;
  }
  const id = randomBytes(12).toString('base64url');
  devices.push({ id, binding: input.binding, device: input.device, app: input.app, boundAt: at, lastSeenAt: at });
  // Oldest-seen devices fall off first when the list is full.
  devices.sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
  save(devices.slice(0, MAX_DEVICES));
  return id;
}

export function removeDevice(id: string) {
  const devices = listDevices();
  const left = devices.filter((d) => d.id !== id);
  if (left.length !== devices.length) save(left);
  return left.length !== devices.length;
}

// Whether a bound cookie's device is still on the list; updates "last seen".
export function deviceStillListed(id: string, now = new Date()) {
  const devices = listDevices();
  const entry = devices.find((d) => d.id === id);
  if (!entry) return false;
  if (now.getTime() - Date.parse(entry.lastSeenAt) > SEEN_EVERY_MS) {
    entry.lastSeenAt = now.toISOString();
    save(devices);
  }
  return true;
}
