// One sync at a time per device. Prefers the Web Locks API; falls back to an
// in-memory guard (single tab) where locks are unavailable.

let fallbackHeld = false;

export async function withSyncLock<T>(fn: () => Promise<T>): Promise<T | null> {
  if (typeof navigator !== 'undefined' && 'locks' in navigator && navigator.locks?.request) {
    return navigator.locks.request('harjutaja-sync', { ifAvailable: true }, async (lock) => {
      if (!lock) return null;
      return fn();
    });
  }
  if (fallbackHeld) return null;
  fallbackHeld = true;
  try {
    return await fn();
  } finally {
    fallbackHeld = false;
  }
}
