import { catalogRepo } from '@/lib/offline/repositories';
import { ensurePersistentStorage, getStoragePersisted, getCursor } from '@/lib/offline/meta';
import { offlineDb } from '@/lib/offline/db';
import { pingServer } from '@/lib/offline/connection';
import { syncNow } from '@/lib/offline/syncEngine';

export type OfflineReadinessReport = {
  ready: boolean;
  serviceWorkerControlling: boolean;
  appShellCached: boolean;
  cataloguesPresent: boolean;
  indexedDbWritable: boolean;
  storagePersisted: boolean;
  lastSuccessfulSyncAt?: string;
  pendingAttempts: number;
};

async function shellCached(): Promise<boolean> {
  try {
    if (typeof caches === 'undefined') return false;
    const keys = await caches.keys();
    const shell = keys.find((k) => k.startsWith('harjutaja-shell-'));
    if (!shell) return false;
    const cache = await caches.open(shell);
    const matched = await cache.match('/kiur');
    return Boolean(matched);
  } catch {
    return false;
  }
}

async function indexedDbWritable(): Promise<boolean> {
  try {
    const db = await offlineDb();
    await db.put('meta', { key: '__rwcheck', value: Date.now() });
    const back = await db.get('meta', '__rwcheck');
    return Boolean(back);
  } catch {
    return false;
  }
}

// "Ready" requires the SW to control the page, the shell to be cached, both
// catalogues present, and IndexedDB to be writable. Anything missing → partial.
export async function checkOfflineReadiness(): Promise<OfflineReadinessReport> {
  const [kiur, kirsi] = await Promise.all([catalogRepo.get('kiur'), catalogRepo.get('kirsi')]);
  const cataloguesPresent = Boolean(kiur && kirsi);
  const serviceWorkerControlling = typeof navigator !== 'undefined' && Boolean(navigator.serviceWorker?.controller);
  const [appShell, idbWritable, persisted, cursor] = await Promise.all([
    shellCached(),
    indexedDbWritable(),
    getStoragePersisted(),
    getCursor()
  ]);
  const { attemptRepo } = await import('@/lib/offline/repositories');
  const pending = (await attemptRepo.all()).filter((a) => a.status === 'pending' || a.status === 'syncing').length;

  return {
    ready: serviceWorkerControlling && appShell && cataloguesPresent && idbWritable,
    serviceWorkerControlling,
    appShellCached: appShell,
    cataloguesPresent,
    indexedDbWritable: idbWritable,
    storagePersisted: persisted,
    lastSuccessfulSyncAt: cursor.lastSuccessfulSyncAt,
    pendingAttempts: pending
  };
}

// Prepare the device for offline use after an online launch: request durable
// storage, prove reachability, and run a full sync (which downloads catalogues,
// dashboards and history).
export async function prepareOffline(): Promise<void> {
  await ensurePersistentStorage();
  const ping = await pingServer();
  if (ping) await syncNow('prepare-offline');
}
