import { offlineDb } from '@/lib/offline/db';
import type { Learner } from '@/lib/shared/types';

// Typed access to the `meta` key/value store: device identity, clock offset and
// the sync cursor.

async function getMeta<T>(key: string, fallback: T): Promise<T> {
  const db = await offlineDb();
  const row = await db.get('meta', key);
  return row ? (row.value as T) : fallback;
}

async function setMeta(key: string, value: unknown): Promise<void> {
  const db = await offlineDb();
  await db.put('meta', { key, value });
}

const DEVICE_ID_KEY = 'deviceId';

// One stable UUID per browser installation, generated once and reused forever.
export async function getDeviceId(): Promise<string> {
  const existing = await getMeta<string | null>(DEVICE_ID_KEY, null);
  if (existing) return existing;
  const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `dev-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  await setMeta(DEVICE_ID_KEY, id);
  return id;
}

export async function getServerOffsetMs(): Promise<number> {
  return getMeta<number>('serverOffsetMs', 0);
}
export async function setServerOffsetMs(ms: number): Promise<void> {
  await setMeta('serverOffsetMs', ms);
}

// Best-estimate "now" corrected by the last measured server offset. Offline
// timestamps record both this and the raw device time.
export function correctedNow(offsetMs: number): Date {
  return new Date(Date.now() + offsetMs);
}

export type SyncCursor = {
  lastServerAttemptId: number;
  lastTombstoneId: number;
  lastTaskChangeId: number;
  lastRemediationChangeId: number;
  historyEpoch: number;
  catalogueVersions: Partial<Record<Learner, string>>;
  historyBackfillCursor?: number | null;
  lastSuccessfulSyncAt?: string;
  lastAttemptedSyncAt?: string;
};

const CURSOR_KEY = 'syncCursor';
export async function getCursor(): Promise<SyncCursor> {
  const cursor = await getMeta<Partial<SyncCursor>>(CURSOR_KEY, {});
  return {
    lastServerAttemptId: cursor.lastServerAttemptId ?? 0,
    lastTombstoneId: cursor.lastTombstoneId ?? 0,
    lastTaskChangeId: cursor.lastTaskChangeId ?? 0,
    lastRemediationChangeId: cursor.lastRemediationChangeId ?? 0,
    historyEpoch: cursor.historyEpoch ?? 0,
    catalogueVersions: cursor.catalogueVersions ?? {},
    historyBackfillCursor: cursor.historyBackfillCursor,
    lastSuccessfulSyncAt: cursor.lastSuccessfulSyncAt,
    lastAttemptedSyncAt: cursor.lastAttemptedSyncAt
  };
}
export async function setCursor(cursor: SyncCursor): Promise<void> {
  await setMeta(CURSOR_KEY, cursor);
}

export async function getAppVersion(): Promise<string> {
  return getMeta<string>('appVersion', 'dev');
}
export async function setAppVersion(version: string): Promise<void> {
  await setMeta('appVersion', version);
}

// Request durable storage where supported; record the result for diagnostics.
export async function ensurePersistentStorage(): Promise<boolean> {
  try {
    if (typeof navigator === 'undefined' || !navigator.storage?.persist) return false;
    const already = navigator.storage.persisted ? await navigator.storage.persisted() : false;
    const granted = already || (await navigator.storage.persist());
    await setMeta('storagePersisted', granted);
    return granted;
  } catch {
    return false;
  }
}

export async function getStoragePersisted(): Promise<boolean> {
  return getMeta<boolean>('storagePersisted', false);
}
