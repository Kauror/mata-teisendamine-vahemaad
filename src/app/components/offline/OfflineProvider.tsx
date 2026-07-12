'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { pingServer, isOnlineHint } from '@/lib/offline/connection';
import { syncNow } from '@/lib/offline/syncEngine';
import { getPendingCount } from '@/lib/offline/api';
import { getCursor } from '@/lib/offline/meta';
import { prepareOffline } from '@/lib/offline/readiness';
import { hasActiveRunnerSessions } from '@/lib/offline/runnerSession';

type OfflineContextValue = {
  online: boolean; // server actually reachable (ping), not just navigator.onLine
  syncing: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
  updateAvailable: boolean;
  updateBlocked: boolean;
  serviceWorkerError: string | null;
  sync: (reason: string) => Promise<void>;
  applyUpdate: () => Promise<void>;
  refreshPending: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

const PERIODIC_SYNC_MS = 5 * 60 * 1000;

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [online, setOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateBlocked, setUpdateBlocked] = useState(false);
  const [serviceWorkerError, setServiceWorkerError] = useState<string | null>(null);
  const waitingWorker = useRef<ServiceWorker | null>(null);
  const syncingRef = useRef(false);
  // Bootstrap tracks completion, not merely "started": a first attempt that
  // fails (e.g. the initial ping times out) must be retriggerable so full
  // offline preparation is not permanently skipped (RTM-008).
  const bootstrapDoneRef = useRef(false);
  const bootstrapInFlightRef = useRef(false);
  const registrationStartedRef = useRef(false);

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

  // Full offline preparation: local persistence + device id (safe offline) and,
  // when the server is reachable, an initial sync. Marked "done" only after a
  // complete online preparation, so a transient startup outage retries later via
  // the online/visibility/interval triggers instead of being skipped forever.
  const runBootstrap = useCallback(async () => {
    if (bootstrapDoneRef.current || bootstrapInFlightRef.current) return;
    bootstrapInFlightRef.current = true;
    try {
      const ping = await pingServer();
      setOnline(Boolean(ping));
      await prepareOffline();
      if (ping) {
        await sync('startup');
        bootstrapDoneRef.current = true;
      }
    } catch {
      /* leave bootstrapDoneRef false so a later trigger retries preparation */
    } finally {
      bootstrapInFlightRef.current = false;
    }
  }, [sync]);

  // Register the service worker + prepare offline, then run an initial sync.
  useEffect(() => {
    let cancelled = false;
    void refreshPending();

    // Before family authentication, required child routes redirect to /access;
    // a strict all-or-nothing worker must therefore wait until login succeeds.
    if (pathname === '/access') return () => { cancelled = true; };

    if (!registrationStartedRef.current && typeof navigator !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registrationStartedRef.current = true;
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none', scope: '/' }).then((registration) => {
        setServiceWorkerError(null);
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
            } else if (installing.state === 'redundant') {
              registrationStartedRef.current = false;
              setServiceWorkerError('Võrguühenduseta versiooni ei õnnestunud terviklikult salvestada.');
            }
          });
        });
        void registration.update().catch(() => {});
      }).catch((error: unknown) => {
        registrationStartedRef.current = false;
        setServiceWorkerError(error instanceof Error ? error.message : 'Service worker registration failed.');
      });
    }

    if (!cancelled) void runBootstrap();

    return () => { cancelled = true; };
  }, [pathname, refreshPending, runBootstrap]);

  // Catch-up triggers: back online, tab becomes visible, and a gentle interval.
  useEffect(() => {
    // If startup preparation never completed (e.g. the first ping failed), retry
    // the full bootstrap here before syncing; runBootstrap no-ops once done.
    const onOnline = () => { void runBootstrap(); void sync('online-event'); };
    const onOffline = () => setOnline(false);
    const onVisible = () => { if (document.visibilityState === 'visible') { void runBootstrap(); void sync('visibility'); } };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && isOnlineHint()) { void runBootstrap(); void sync('interval'); }
    }, PERIODIC_SYNC_MS);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(interval);
    };
  }, [sync, runBootstrap]);

  const applyUpdate = useCallback(async () => {
    const worker = waitingWorker.current;
    if (!worker) return;
    if (await hasActiveRunnerSessions().catch(() => true)) {
      setUpdateBlocked(true);
      return;
    }
    setUpdateBlocked(false);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      void hasActiveRunnerSessions().then((active) => {
        if (!active) window.location.reload();
        else setUpdateBlocked(true);
      }).catch(() => setUpdateBlocked(true));
    }, { once: true });
    worker.postMessage({ type: 'SKIP_WAITING' });
  }, []);

  return (
    <OfflineContext.Provider value={{ online, syncing, pendingCount, lastSyncAt, updateAvailable, updateBlocked, serviceWorkerError, sync, applyUpdate, refreshPending }}>
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
      updateBlocked: false,
      serviceWorkerError: null,
      sync: async () => {},
      applyUpdate: async () => {},
      refreshPending: async () => {}
    };
  }
  return ctx;
}
