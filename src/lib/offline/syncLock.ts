import { syncLeaseRepo } from '@/lib/offline/repositories';

// One sync at a time per browser installation. Web Locks give the strongest
// native cross-tab guarantee. Safari/iOS does not consistently expose them, so
// the fallback is a renewable IndexedDB lease rather than a per-tab boolean.

export const SYNC_LEASE_NAME = 'harjutaja-sync';
// Short, often-renewed lease: a page closed or reloaded mid-sync (a child shutting
// the app right after an exercise) cannot release it, and until it expires every
// sync on this phone answers "locked". 60 s held results back for a minute or
// more; 20 s with a 5 s renewal keeps a live sync safe and frees a dead one fast.
export const SYNC_LEASE_DURATION_MS = 20_000;
export const SYNC_LEASE_RENEW_MS = 5_000;

export type SyncLockContext = { signal: AbortSignal; owner: string };

export class SyncLeaseLostError extends Error {
  constructor() {
    super('The IndexedDB sync lease was lost.');
    this.name = 'SyncLeaseLostError';
  }
}
function leaseOwner(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `sync-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function expiresAt(): string {
  return new Date(Date.now() + SYNC_LEASE_DURATION_MS).toISOString();
}

// The lease this page holds, so leaving the page can hand it back at once. The
// write may not finish while the page goes away; expiry is the backstop.
let heldLeaseOwner: string | null = null;
let pagehideHooked = false;

function releaseOnPagehide() {
  if (pagehideHooked || typeof window === 'undefined') return;
  pagehideHooked = true;
  window.addEventListener('pagehide', () => {
    if (heldLeaseOwner) void syncLeaseRepo.release(SYNC_LEASE_NAME, heldLeaseOwner).catch(() => {});
  });
}

async function withIndexedDbLease<T>(fn: (context: SyncLockContext) => Promise<T>): Promise<T | null> {
  const owner = leaseOwner();
  if (!(await syncLeaseRepo.tryAcquire(SYNC_LEASE_NAME, owner, expiresAt()))) return null;
  heldLeaseOwner = owner;
  releaseOnPagehide();

  const controller = new AbortController();
  let leaseLost = false;
  let finished = false;
  const timer = setInterval(() => {
    void syncLeaseRepo.renew(SYNC_LEASE_NAME, owner, expiresAt()).then((renewed) => {
      if (!renewed && !finished) {
        leaseLost = true;
        controller.abort(new SyncLeaseLostError());
      }
    }).catch(() => {
      if (!finished) {
        leaseLost = true;
        controller.abort(new SyncLeaseLostError());
      }
    });
  }, SYNC_LEASE_RENEW_MS);

  try {
    const result = await fn({ signal: controller.signal, owner });
    if (leaseLost) throw new SyncLeaseLostError();
    return result;
  } finally {
    finished = true;
    clearInterval(timer);
    if (heldLeaseOwner === owner) heldLeaseOwner = null;
    await syncLeaseRepo.release(SYNC_LEASE_NAME, owner).catch(() => {});
  }
}

export async function withSyncLock<T>(fn: (context: SyncLockContext) => Promise<T>): Promise<T | null> {
  const owner = leaseOwner();
  const controller = new AbortController();
  if (typeof navigator !== 'undefined' && 'locks' in navigator && navigator.locks?.request) {
    return navigator.locks.request(SYNC_LEASE_NAME, { ifAvailable: true }, async (lock) => {
      if (!lock) return null;
      return fn({ signal: controller.signal, owner });
    });
  }
  return withIndexedDbLease(fn);
}
