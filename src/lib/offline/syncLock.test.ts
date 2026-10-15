import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { closeOfflineDbForTests, OFFLINE_DB_NAME } from '@/lib/offline/db';
import { syncLeaseRepo } from '@/lib/offline/repositories';
import { SYNC_LEASE_DURATION_MS, SYNC_LEASE_NAME, SYNC_LEASE_RENEW_MS, withSyncLock } from '@/lib/offline/syncLock';

async function resetDatabase() {
  await closeOfflineDbForTests();
  await new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(OFFLINE_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  });
}

afterEach(async () => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  await resetDatabase();
});

describe('the IndexedDB sync lease (Safari/iOS)', () => {
  it('frees a lease left by a closed page within seconds, not a minute', async () => {
    // A page that died mid-sync leaves its lease behind.
    await syncLeaseRepo.tryAcquire(SYNC_LEASE_NAME, 'closed-page', new Date(Date.now() + SYNC_LEASE_DURATION_MS).toISOString());
    expect(await withSyncLock(async () => 'ran')).toBeNull();

    expect(SYNC_LEASE_DURATION_MS).toBeLessThanOrEqual(20_000);
    // A live sync renews well before its lease runs out.
    expect(SYNC_LEASE_RENEW_MS * 3).toBeLessThanOrEqual(SYNC_LEASE_DURATION_MS);

    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(Date.now() + SYNC_LEASE_DURATION_MS + 1);
    expect(await withSyncLock(async () => 'ran')).toBe('ran');
  });

  it('hands the lease back when the page goes away mid-sync', async () => {
    const page = new EventTarget();
    vi.stubGlobal('window', page);
    let held = false;
    // The cycle never finishes: the page is closed under it.
    void withSyncLock(() => new Promise<void>(() => { held = true; }));
    while (!held) await new Promise((resolve) => setTimeout(resolve, 5));
    expect(await withSyncLock(async () => 'ran')).toBeNull();

    page.dispatchEvent(new Event('pagehide'));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(await withSyncLock(async () => 'ran')).toBe('ran');
  });
});
