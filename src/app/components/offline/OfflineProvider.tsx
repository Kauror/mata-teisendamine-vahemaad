'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { pingServer, isOnlineHint } from '@/lib/offline/connection';
import { syncNow } from '@/lib/offline/syncEngine';
import { getPendingCount } from '@/lib/offline/api';
import { getCursor } from '@/lib/offline/meta';
import { prepareOffline } from '@/lib/offline/readiness';

type OfflineContextValue = {
  online: boolean; // server actually reachable (ping), not just navigator.onLine
  syncing: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
  updateAvailable: boolean;
  sync: (reason: string) => Promise<void>;
  applyUpdate: () => void;
  refreshPending: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

const PERIODIC_SYNC_MS = 5 * 60 * 1000;

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const waitingWorker = useRef<ServiceWorker | null>(null);
  const syncingRef = useRef(false);

  const refreshPending = useCallback(async () => {
    try {
      setPendingCount(await getPendingCount());
      const cursor = await getCursor();
      setLastSyncAt(cursor.lastSuccessfulSyncAt ?? null);
    } catch {
      /* IndexedDB unavailable — leave defaults */
    }
  }, []);

  const sync = useCallback(async (reason: string) => {
    if (syncingRef.current) return;
    syncingRef.current = true;
    setSyncing(true);
    try {
      const outcome = await syncNow(reason);
      setOnline(outcome.reason !== 'offline');
    } catch {
      /* transient */
    } finally {
      syncingRef.current = false;
      setSyncing(false);
      await refreshPending();
    }
  }, [refreshPending]);

  // Register the service worker + prepare offline, then run an initial sync.
  useEffect(() => {
    let cancelled = false;
    void refreshPending();

    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).then((registration) => {
        if (registration.waiting) {
          waitingWorker.current = registration.waiting;
          setUpdateAvailable(true);
        }
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              waitingWorker.current = registration.waiting;
              setUpdateAvailable(true);
            }
          });
        });
      }).catch(() => {});
    }

    void (async () => {
      const ping = await pingServer();
      if (cancelled) return;
      setOnline(Boolean(ping));
      if (ping) {
        await prepareOffline();
        await sync('startup');
      }
    })();

    return () => { cancelled = true; };
  }, [refreshPending, sync]);

  // Catch-up triggers: back online, tab becomes visible, and a gentle interval.
  useEffect(() => {
    const onOnline = () => void sync('online-event');
    const onVisible = () => { if (document.visibilityState === 'visible') void sync('visibility'); };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', () => setOnline(false));
    document.addEventListener('visibilitychange', onVisible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && isOnlineHint()) void sync('interval');
    }, PERIODIC_SYNC_MS);
    return () => {
      window.removeEventListener('online', onOnline);
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(interval);
    };
  }, [sync]);

  const applyUpdate = useCallback(() => {
    const worker = waitingWorker.current;
    if (!worker) return;
    worker.postMessage('SKIP_WAITING');
    worker.addEventListener('statechange', () => {
      if (worker.state === 'activated') window.location.reload();
    });
  }, []);

  return (
    <OfflineContext.Provider value={{ online, syncing, pendingCount, lastSyncAt, updateAvailable, sync, applyUpdate, refreshPending }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline(): OfflineContextValue {
  const ctx = useContext(OfflineContext);
  if (!ctx) {
    // Safe no-op default so components work even outside the provider (e.g. tests).
    return {
      online: true,
      syncing: false,
      pendingCount: 0,
      lastSyncAt: null,
      updateAvailable: false,
      sync: async () => {},
      applyUpdate: () => {},
      refreshPending: async () => {}
    };
  }
  return ctx;
}
