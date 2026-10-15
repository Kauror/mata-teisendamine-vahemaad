'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isOnlineHint } from '@/lib/offline/connection';
import { SYNC_COMPLETE_EVENT, syncNow, type SyncCompleteDetail, type SyncOutcome } from '@/lib/offline/syncEngine';
import { createReconnectRetry, type ReconnectRetry } from '@/lib/offline/reconnectRetry';
import { getPendingCount } from '@/lib/offline/api';
import { getCursor } from '@/lib/offline/meta';
import { prepareLocalOffline, runCatchUpSync, runOfflineBootstrap } from '@/lib/offline/readiness';
import { isInstallFailure, newestWaitingWorker, UPDATE_CHECK_MIN_INTERVAL_MS } from '@/lib/offline/swUpdate';
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
  updating: boolean;
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
  const [updating, setUpdating] = useState(false);
  const [serviceWorkerError, setServiceWorkerError] = useState<string | null>(null);
  const registrationRef = useRef<ServiceWorkerRegistration | null>(null);
  // Whether this page was already controlled by a worker when it loaded. A
  // controller change then means a new version took over (reload); without
  // one it is just the very first install claiming the page (no reload).
  const hadControllerRef = useRef(false);
  const reloadingRef = useRef(false);
  const reloadPendingRef = useRef(false);
  const lastUpdateCheckRef = useRef(0);
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const syncingRef = useRef(false);
  // Bootstrap tracks completion, not merely "started": a first attempt that
  // fails (e.g. the initial ping times out) must be retriggerable so full
  // offline preparation is not permanently skipped (RTM-008).
  const bootstrapDoneRef = useRef(false);
  const bootstrapInFlightRef = useRef(false);
  // Local preparation (persistent storage + device id) has run in this page,
  // so any successful cycle from here on completes the bootstrap.
  const localPreparedRef = useRef(false);
  // Date.now() when the latest finished cycle succeeded; null when none yet,
  // when a later cycle failed or the browser reported going offline. Drives
  // the 60 s catch-up throttle (OFF-06).
  const lastSuccessAtRef = useRef<number | null>(null);
  const registrationStartedRef = useRef(false);
  const updateActivationStartedRef = useRef(false);
  const activationTimeoutRef = useRef<number | null>(null);
  const runnerTabIdRef = useRef<string | null>(null);
  const reconnectRetryRef = useRef<ReconnectRetry | null>(null);
  const reconnectRunRef = useRef<() => void>(() => {});

  const refreshPending = useCallback(async () => {
    try {
      setPendingCount(await getPendingCount());
      const cursor = await getCursor();
      setLastSyncAt(cursor.lastSuccessfulSyncAt ?? null);
    } catch {
      /* IndexedDB unavailable — leave defaults */
    }
  }, []);

  // One place turns a finished cycle into UI state, whoever started it (this
  // provider, a result screen, the login page). 'locked' means another cycle
  // owns the sync; its own outcome arrives separately, so nothing changes here.
  const applyOutcome = useCallback((outcome: SyncOutcome) => {
    if (outcome.reason === 'locked') return;
    const offline = outcome.reason === 'offline';
    setOnline(!offline);
    // An expired session (auth_blocked) is a reachable server: online stays true.
    setSyncState(outcome.ok ? 'healthy' : (outcome.reason as OfflineSyncState) ?? 'unknown');
    if (outcome.ok) {
      lastSuccessAtRef.current = Date.now();
      // Whoever ran it (a result screen, a manual sync), a successful cycle
      // after local preparation is a complete online preparation.
      if (localPreparedRef.current) bootstrapDoneRef.current = true;
    } else {
      lastSuccessAtRef.current = null;
    }
    // While a bootstrap runs, it reports itself once its in-flight flag has
    // cleared, so the scheduled retry never fires into it and gets dropped.
    if (!bootstrapInFlightRef.current) reconnectRetryRef.current?.report(offline ? 'offline' : 'reachable');
  }, []);

  // Returns the cycle's outcome, or null when this provider already has one
  // running. The outcome also reaches applyOutcome through SYNC_COMPLETE_EVENT.
  const sync = useCallback(async (reason: string): Promise<SyncOutcome | null> => {
    if (syncingRef.current) return null;
    syncingRef.current = true;
    setSyncing(true);
    try {
      return await syncNow(reason);
    } catch {
      return null; /* transient */
    } finally {
      syncingRef.current = false;
      setSyncing(false);
      await refreshPending();
    }
  }, [refreshPending]);

  const syncForContext = useCallback(async (reason: string) => { await sync(reason); }, [sync]);

  // Full offline preparation: local persistence + device id (safe offline),
  // then ONE sync cycle whose own ping decides reachable / auth_blocked /
  // offline (OFF-06: a cold start is 1 ping + 1 push/pull, not 4 + 2). Marked
  // "done" only after a successful cycle — the first successful pull writes
  // the bootstrap markers — so a transient startup outage or an expired
  // session retries later via the quick reconnect retries and the
  // online/visibility/interval triggers instead of being skipped (RTM-008).
  const runBootstrap = useCallback(async () => {
    if (bootstrapDoneRef.current || bootstrapInFlightRef.current) return;
    bootstrapInFlightRef.current = true;
    let report: 'offline' | 'reachable' | null = null;
    try {
      const result = await runOfflineBootstrap({
        runSync: sync,
        lastSuccessAt: () => lastSuccessAtRef.current,
        prepareLocal: async () => {
          await prepareLocalOffline();
          localPreparedRef.current = true;
        }
      });
      if (result.done) bootstrapDoneRef.current = true;
      if (result.outcome && result.outcome.reason !== 'locked') report = result.outcome.reason === 'offline' ? 'offline' : 'reachable';
    } catch {
      /* leave bootstrapDoneRef false so a later trigger retries preparation */
    } finally {
      bootstrapInFlightRef.current = false;
      // Reported only after the in-flight flag clears, so the scheduled retry
      // can never fire into a bootstrap that is still running and be dropped.
      if (report) reconnectRetryRef.current?.report(report);
    }
  }, [sync]);

  // Catch-up triggers (online event, tab visible again, interval). Until the
  // bootstrap is complete they retry it (it carries the one sync); afterwards
  // they sync unless the last cycle succeeded < 60 s ago with nothing queued.
  const catchUp = useCallback(async (reason: string) => {
    if (!bootstrapDoneRef.current) {
      await runBootstrap();
      return;
    }
    try {
      await runCatchUpSync(reason, { runSync: sync, lastSuccessAt: () => lastSuccessAtRef.current });
    } catch {
      /* transient */
    }
  }, [runBootstrap, sync]);

  reconnectRunRef.current = () => {
    if (!bootstrapDoneRef.current) void runBootstrap();
    else void sync('reconnect-retry');
  };

  // Quick retries after a failed ping while the device says it is online.
  // Declared before the bootstrap effect so the scheduler exists first.
  useEffect(() => {
    const retry = createReconnectRetry({ run: () => reconnectRunRef.current(), isOnlineHint });
    reconnectRetryRef.current = retry;
    return () => {
      retry.cancel();
      if (reconnectRetryRef.current === retry) reconnectRetryRef.current = null;
    };
  }, []);

  // Direct syncNow calls (result screens, task completion, login) and data
  // written by any tab must refresh the pending count and sync state too.
  useEffect(() => {
    const onComplete = (event: Event) => {
      const detail = (event as CustomEvent<SyncCompleteDetail>).detail;
      if (detail?.outcome) applyOutcome(detail.outcome);
      void refreshPending();
    };
    const onRevision = () => { void refreshPending(); };
    window.addEventListener(SYNC_COMPLETE_EVENT, onComplete);
    window.addEventListener('offline-data-revision', onRevision);
    const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('harjutaja-offline-data');
    if (channel) channel.onmessage = onRevision;
    return () => {
      window.removeEventListener(SYNC_COMPLETE_EVENT, onComplete);
      window.removeEventListener('offline-data-revision', onRevision);
      channel?.close();
    };
  }, [applyOutcome, refreshPending]);

  // Register the service worker + prepare offline, then run an initial sync.
  useEffect(() => {
    let cancelled = false;
    void refreshPending();

    // Before family authentication, required child routes redirect to /access;
    // a strict all-or-nothing worker must therefore wait until login succeeds.
    if (pathname === '/access') return () => { cancelled = true; };

    if (!registrationStartedRef.current && typeof navigator !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      registrationStartedRef.current = true;
      hadControllerRef.current = Boolean(navigator.serviceWorker.controller);
      navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none', scope: '/' }).then((registration) => {
        registrationRef.current = registration;
        setServiceWorkerError(null);
        // Only an update over an existing installation is offered; the first
        // install simply starts working.
        if (registration.waiting && navigator.serviceWorker.controller) {
          setUpdateBlocked(false);
          setUpdateAvailable(true);
        }
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateBlocked(false);
              setUpdateAvailable(true);
            } else if (installing.state === 'redundant' && isInstallFailure(registration)) {
              // Superseded by a newer build is normal; only a failed install
              // with nothing in its place is an error.
              registrationStartedRef.current = false;
              setServiceWorkerError('Võrguühenduseta versiooni ei õnnestunud terviklikult salvestada.');
            }
          });
        });
        lastUpdateCheckRef.current = Date.now();
        void registration.update().catch(() => {});
      }).catch((error: unknown) => {
        registrationStartedRef.current = false;
        setServiceWorkerError(error instanceof Error ? error.message : 'Service worker registration failed.');
      });
    }

    if (!cancelled) void runBootstrap();

    return () => { cancelled = true; };
  }, [pathname, refreshPending, runBootstrap]);

  // A PWA can stay open for days, and the browser itself checks for a new
  // worker only on full page loads. Ask now and then, so the notice reflects
  // the newest build instead of one found when the app was first opened.
  const checkForUpdate = useCallback(() => {
    const registration = registrationRef.current;
    if (!registration || Date.now() - lastUpdateCheckRef.current < UPDATE_CHECK_MIN_INTERVAL_MS) return;
    lastUpdateCheckRef.current = Date.now();
    void registration.update().catch(() => {});
  }, []);

  // Catch-up triggers: back online, tab becomes visible, and a gentle interval.
  useEffect(() => {
    // If startup preparation never completed (e.g. the first ping failed),
    // catchUp retries the full bootstrap instead of a plain sync.
    const onOnline = () => { void catchUp('online-event'); checkForUpdate(); };
    const onOffline = () => {
      setOnline(false);
      // Coming back online must re-check, however recent the last sync was.
      lastSuccessAtRef.current = null;
    };
    const onVisible = () => { if (document.visibilityState === 'visible') { void catchUp('visibility'); checkForUpdate(); } };
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    document.addEventListener('visibilitychange', onVisible);
    const interval = window.setInterval(() => {
      if (document.visibilityState === 'visible' && isOnlineHint()) { void catchUp('interval'); checkForUpdate(); }
    }, PERIODIC_SYNC_MS);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(interval);
    };
  }, [catchUp, checkForUpdate]);

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

  const reloadForNewVersion = useCallback(() => {
    if (reloadingRef.current) return;
    reloadingRef.current = true;
    setUpdateAvailable(false);
    window.location.reload();
  }, []);

  // Every tab and window follows a new version, not just the one where
  // "Uuenda" was pressed: when a new worker takes control, this page reloads
  // too — unless it is in the middle of an exercise, in which case it waits
  // until the exercise is left (the old page keeps working meanwhile).
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
    const onControllerChange = () => {
      if (!hadControllerRef.current) {
        // The first install claimed this page; nothing to reload.
        hadControllerRef.current = true;
        return;
      }
      if (isRunnerPath(pathnameRef.current)) {
        reloadPendingRef.current = true;
        setUpdateAvailable(true);
        setUpdateBlocked(true);
        return;
      }
      reloadForNewVersion();
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, [reloadForNewVersion]);

  useEffect(() => {
    if (reloadPendingRef.current && !isRunnerPath(pathname)) reloadForNewVersion();
  }, [pathname, reloadForNewVersion]);

  const activateNewestWorker = useCallback(async () => {
    const registration = registrationRef.current;
    if (!registration || updateActivationStartedRef.current) return;
    updateActivationStartedRef.current = true;
    setUpdateBlocked(false);
    setUpdating(true);
    try {
      const worker = await newestWaitingWorker(registration);
      if (!worker) {
        // Nothing waiting any more: another tab already switched to the new
        // version (this page reloads on the controller change) or the update
        // vanished. Either way there is nothing to offer.
        setUpdateAvailable(false);
        return;
      }
      worker.postMessage({ type: 'SKIP_WAITING' });
      // The controller change reloads the page. If it never comes (the
      // worker was replaced mid-way, the browser refused), make the button
      // usable again instead of leaving it dead.
      if (activationTimeoutRef.current !== null) window.clearTimeout(activationTimeoutRef.current);
      activationTimeoutRef.current = window.setTimeout(() => {
        activationTimeoutRef.current = null;
        if (reloadingRef.current) return;
        updateActivationStartedRef.current = false;
        setUpdating(false);
      }, 10_000);
      return;
    } catch {
      /* fall through: let the child try again */
    }
    updateActivationStartedRef.current = false;
    setUpdating(false);
  }, []);

  const applyUpdate = useCallback(async () => {
    if (!registrationRef.current) return;
    if (hasLiveRunner()) {
      setUpdateBlocked(true);
      return;
    }
    await activateNewestWorker();
  }, [activateNewestWorker, hasLiveRunner]);

  // If an update was deferred, retry automatically when the runner route is
  // left or the last runner heartbeat in another tab expires/disappears.
  useEffect(() => {
    if (!updateAvailable || !updateBlocked || reloadPendingRef.current) return;
    const retry = () => {
      if (!hasLiveRunner()) void activateNewestWorker();
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
  }, [activateNewestWorker, hasLiveRunner, updateAvailable, updateBlocked]);

  // A stable value: consumers re-render only when a field they get changes,
  // not on every render of the provider.
  const value = useMemo<OfflineContextValue>(
    () => ({ online, syncing, pendingCount, syncState, lastSyncAt, updateAvailable, updateBlocked, updating, serviceWorkerError, sync: syncForContext, applyUpdate, refreshPending }),
    [online, syncing, pendingCount, syncState, lastSyncAt, updateAvailable, updateBlocked, updating, serviceWorkerError, syncForContext, applyUpdate, refreshPending]
  );

  return (
    <OfflineContext.Provider value={value}>
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
      updating: false,
      serviceWorkerError: null,
      sync: async () => {},
      applyUpdate: async () => {},
      refreshPending: async () => {}
    };
  }
  return ctx;
}
