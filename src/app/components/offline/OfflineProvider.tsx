'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { pingServer, isOnlineHint } from '@/lib/offline/connection';
import { syncNow } from '@/lib/offline/syncEngine';
import { getPendingCount } from '@/lib/offline/api';
import { getCursor } from '@/lib/offline/meta';
import { prepareOffline } from '@/lib/offline/readiness';
import {
  RUNNER_HEARTBEAT_INTERVAL_MS,
  clearRunnerHeartbeat,
  hasLiveRunnerHeartbeat,
  isRunnerPath,
  writeRunnerHeartbeat
} from '@/lib/offline/runnerLiveness';

export type OfflineSyncState = 'healthy' | 'offline' | 'retry_wait' | 'auth_blocked' | 'upgrade_required' | 'storage_error' | 'epoch_regression' | 'timeout' | 'unknown';

type OfflineContextValue = {
  online: boolean; // server actually reachable (ping), not just navigator.onLine
  syncing: boolean;
  pendingCount: number;
  syncState: OfflineSyncState;
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
  const [syncState, setSyncState] = useState<OfflineContextValue['syncState']>('unknown');
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
  const updateActivationStartedRef = useRef(false);
  const runnerTabIdRef = useRef<string | null>(null);

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
      setSyncState(outcome.ok ? 'healthy' : (outcome.reason as OfflineContextValue['syncState']) ?? 'unknown');
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
          setUpdateBlocked(false);
          setUpdateAvailable(true);
        }
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              waitingWorker.current = registration.waiting;
              setUpdateBlocked(false);
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

  // A durable runner session can remain in IndexedDB after a tab is abandoned.
  // Track only tabs that are actually on a runner route, with a short lease so
  // a crashed or closed tab cannot keep the update guard stuck indefinitely.
  useEffect(() => {
    if (!runnerTabIdRef.current) {
      runnerTabIdRef.current = typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;
    }
    const tabId = runnerTabIdRef.current;
    if (!tabId) return;

    const clear = () => {
      try { clearRunnerHeartbeat(window.localStorage, tabId); } catch { /* storage unavailable */ }
    };

    if (!isRunnerPath(pathname)) {
      clear();
      return;
    }

    const heartbeat = () => {
      try { writeRunnerHeartbeat(window.localStorage, tabId); } catch { /* current route still guards locally */ }
    };
    heartbeat();
    const interval = window.setInterval(heartbeat, RUNNER_HEARTBEAT_INTERVAL_MS);
    window.addEventListener('pagehide', clear);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('pagehide', clear);
      clear();
    };
  }, [pathname]);

  const hasLiveRunner = useCallback(() => {
    if (isRunnerPath(pathname)) return true;
    try { return hasLiveRunnerHeartbeat(window.localStorage); } catch { return false; }
  }, [pathname]);

  const activateWaitingWorker = useCallback(() => {
    const worker = waitingWorker.current;
    if (!worker || updateActivationStartedRef.current) return;
    updateActivationStartedRef.current = true;
    setUpdateBlocked(false);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      setUpdateAvailable(false);
      window.location.reload();
    }, { once: true });
    worker.postMessage({ type: 'SKIP_WAITING' });
  }, []);

  const applyUpdate = useCallback(async () => {
    if (!waitingWorker.current) return;
    if (hasLiveRunner()) {
      setUpdateBlocked(true);
      return;
    }
    activateWaitingWorker();
  }, [activateWaitingWorker, hasLiveRunner]);

  // If an update was deferred, retry automatically when the runner route is
  // left or the last runner heartbeat in another tab expires/disappears.
  useEffect(() => {
    if (!updateAvailable || !updateBlocked) return;
    const retry = () => {
      if (!hasLiveRunner()) activateWaitingWorker();
    };
    retry();
    const interval = window.setInterval(retry, 2_000);
    window.addEventListener('storage', retry);
    document.addEventListener('visibilitychange', retry);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', retry);
      document.removeEventListener('visibilitychange', retry);
    };
  }, [activateWaitingWorker, hasLiveRunner, updateAvailable, updateBlocked]);

  return (
    <OfflineContext.Provider value={{ online, syncing, pendingCount, syncState, lastSyncAt, updateAvailable, updateBlocked, serviceWorkerError, sync, applyUpdate, refreshPending }}>
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
      syncState: 'healthy',
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
