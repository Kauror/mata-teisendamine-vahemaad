import { APP_BUILD_ID, OFFLINE_CAPABILITY_MANIFEST, OFFLINE_CAPABILITY_MANIFEST_VERSION, validateOfflineCapabilityManifest } from '@/lib/offline/capabilities';
import { getStorageHealth, offlineDb } from '@/lib/offline/db';
import { ensurePersistentStorage, getCursor, getDeviceId, getStoragePersisted } from '@/lib/offline/meta';
import { attemptRepo, bootstrapRepo, catalogRepo, remediationBundleRepo, snapshotRepo, taskActionRepo } from '@/lib/offline/repositories';
import { syncNow, type SyncOutcome } from '@/lib/offline/syncEngine';
import { shouldRunSync, syncedRecently } from '@/lib/offline/syncPolicy';
import { GENERATOR_VERSION } from '@/lib/shared/types';
import { isSupportedRotationAlgorithm } from '@/lib/shared/rotation';

export type WorkerOfflineStatus = {
  buildId: string;
  manifestVersion: number;
  cacheComplete: boolean;
  missingAssets: string[];
};

export type OfflineReadinessReport = {
  ready: boolean;
  serviceWorkerControlling: boolean;
  serviceWorkerActive: boolean;
  serviceWorkerBuildMatches: boolean;
  appShellCached: boolean;
  cacheComplete: boolean;
  missingAssets: string[];
  runnerMappingsComplete: boolean;
  cataloguesPresent: boolean;
  cataloguesCompatible: boolean;
  dashboardsPresent: boolean;
  taskBootstrapComplete: boolean;
  deviceBootstrapComplete: boolean;
  remediationPrepared: boolean;
  indexedDbWritable: boolean;
  storagePersisted: boolean;
  storageHealth: string;
  lastSuccessfulSyncAt?: string;
  pendingAttempts: number;
};

export async function getWorkerOfflineStatus(timeoutMs = 2500): Promise<WorkerOfflineStatus | null> {
  if (typeof navigator === 'undefined' || !navigator.serviceWorker?.controller || typeof MessageChannel === 'undefined') return null;
  const controller = navigator.serviceWorker.controller;
  const requestId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
  return new Promise((resolve) => {
    const channel = new MessageChannel();
    const timeout = window.setTimeout(() => resolve(null), timeoutMs);
    channel.port1.onmessage = (event: MessageEvent<WorkerOfflineStatus & { type?: string; requestId?: string }>) => {
      if (event.data?.type !== 'OFFLINE_STATUS' || event.data.requestId !== requestId) return;
      window.clearTimeout(timeout);
      resolve(event.data);
    };
    controller.postMessage({ type: 'OFFLINE_STATUS_REQUEST', requestId }, [channel.port2]);
  });
}

async function indexedDbWritable(): Promise<boolean> {
  try {
    const db = await offlineDb();
    const value = `${Date.now()}:${Math.random()}`;
    const tx = db.transaction('meta', 'readwrite');
    await tx.store.put({ key: '__rwcheck', value });
    const back = await tx.store.get('__rwcheck');
    await tx.store.delete('__rwcheck');
    await tx.done;
    return back?.value === value;
  } catch {
    return false;
  }
}

export async function checkOfflineReadiness(): Promise<OfflineReadinessReport> {
  const [kiur, kirsi, kiurSnapshot, kirsiSnapshot, worker, persisted, cursor, writable, taskBootstrapComplete, deviceBootstrapComplete, remediationAdvertised] = await Promise.all([
    catalogRepo.get('kiur'),
    catalogRepo.get('kirsi'),
    snapshotRepo.get('kiur'),
    snapshotRepo.get('kirsi'),
    getWorkerOfflineStatus(),
    getStoragePersisted(),
    getCursor(),
    indexedDbWritable(),
    bootstrapRepo.get('taskBootstrapComplete', false),
    bootstrapRepo.get('deviceBootstrapComplete', false),
    bootstrapRepo.get<Partial<Record<'kiur' | 'kirsi', boolean>>>('remediationAdvertised', {})
  ]);

  const cataloguesPresent = Boolean(kiur && kirsi);
  const now = Date.now();
  const cataloguesCompatible = Boolean(kiur && kirsi && [kiur, kirsi].every((catalogue) =>
    catalogue.generatorVersion === GENERATOR_VERSION &&
    isSupportedRotationAlgorithm(catalogue.algorithmVersion) &&
    catalogue.dailyLimit > 0 &&
    new Date(catalogue.validUntil).getTime() >= now
  ));
  const runnerErrors = validateOfflineCapabilityManifest();
  const serviceWorkerControlling = typeof navigator !== 'undefined' && Boolean(navigator.serviceWorker?.controller);
  const serviceWorkerActive = serviceWorkerControlling && navigator.serviceWorker.controller?.state === 'activated';
  const serviceWorkerBuildMatches = Boolean(worker && worker.buildId === APP_BUILD_ID && worker.manifestVersion === OFFLINE_CAPABILITY_MANIFEST_VERSION);

  const remediationRequirements = (['kiur', 'kirsi'] as const).filter((learner) => remediationAdvertised[learner]);
  const remediationPrepared = remediationRequirements.length === 0 || (await Promise.all(remediationRequirements.map((learner) => remediationBundleRepo.preparedFor(learner)))).every((rows) => rows.length > 0);
  const pendingAttempts = await attemptRepo.pendingCount();
  const cacheComplete = Boolean(worker?.cacheComplete);
  const dashboardsPresent = Boolean(kiurSnapshot && kirsiSnapshot);
  // Only runners that promise offline start are part of the offline-ready
  // guarantee. Runners marked offlineStart:false (e.g. remediation, which needs
  // a live server session) are intentionally excluded so the readiness report
  // never claims an online-only exercise is prepared for offline use (RTM-004).
  const offlineCapableRunners = OFFLINE_CAPABILITY_MANIFEST.runners.filter((runner) => runner.offlineStart);
  const runnerMappingsComplete = runnerErrors.length === 0 && offlineCapableRunners.length > 0 && offlineCapableRunners.every((runner) => runner.learners.length > 0);

  return {
    ready: serviceWorkerActive && serviceWorkerBuildMatches && cacheComplete && runnerMappingsComplete && cataloguesPresent && cataloguesCompatible && dashboardsPresent && Boolean(taskBootstrapComplete) && Boolean(deviceBootstrapComplete) && remediationPrepared && writable,
    serviceWorkerControlling,
    serviceWorkerActive,
    serviceWorkerBuildMatches,
    appShellCached: cacheComplete,
    cacheComplete,
    missingAssets: worker?.missingAssets ?? [],
    runnerMappingsComplete,
    cataloguesPresent,
    cataloguesCompatible,
    dashboardsPresent,
    taskBootstrapComplete: Boolean(taskBootstrapComplete),
    deviceBootstrapComplete: Boolean(deviceBootstrapComplete),
    remediationPrepared,
    indexedDbWritable: writable,
    storagePersisted: persisted,
    storageHealth: getStorageHealth().state,
    lastSuccessfulSyncAt: cursor.lastSuccessfulSyncAt,
    pendingAttempts
  };
}

// Persistence is an enhancement. A denied request does not abort bootstrap;
// readiness reports it as a warning while still proving actual read/write.
// Local only: no network, safe offline.
export async function prepareLocalOffline(): Promise<void> {
  await ensurePersistentStorage();
  await getDeviceId();
}

async function localPendingCount(): Promise<number> {
  try {
    const counts = await Promise.all([attemptRepo.pendingCount(), taskActionRepo.pendingCount()]);
    return counts.reduce((sum, count) => sum + count, 0);
  } catch {
    // Unknown counts as "something may be waiting": never throttle on it.
    return Number.POSITIVE_INFINITY;
  }
}

export type OfflineSyncRunner = (reason: string) => Promise<SyncOutcome | null>;

export type OfflineBootstrapDeps = {
  runSync: OfflineSyncRunner;
  // Date.now() of the last successful cycle seen in this page; null when none
  // yet or a later cycle failed (see syncedRecently).
  lastSuccessAt?: () => number | null;
  pendingCount?: () => Promise<number>;
  prepareLocal?: () => Promise<void>;
  now?: () => number;
};

export type OfflineBootstrapResult = { done: boolean; outcome: SyncOutcome | null };

// Full offline preparation in exactly one network round (OFF-06): local
// persistence + device id, then ONE push-before-pull cycle. The cycle's own
// ping decides reachable / unauthorized (auth_blocked) / offline, so there is
// no separate pre-ping. Done only when that cycle succeeded: the first
// successful pull writes the bootstrap markers, and a failed or skipped cycle
// leaves preparation retriggerable (RTM-008).
//
// A successful cycle that finished under a minute ago with nothing queued
// (e.g. the family-login sync right before the first protected page) already
// is that complete online preparation, so it is reused instead of repeated.
export async function runOfflineBootstrap(deps: OfflineBootstrapDeps): Promise<OfflineBootstrapResult> {
  const now = deps.now ?? Date.now;
  await (deps.prepareLocal ?? prepareLocalOffline)();
  const lastSuccessAt = deps.lastSuccessAt?.() ?? null;
  if (lastSuccessAt !== null && syncedRecently({ lastSuccessAt, now: now(), pending: await (deps.pendingCount ?? localPendingCount)() })) {
    return { done: true, outcome: null };
  }
  const outcome = await deps.runSync('startup');
  return { done: Boolean(outcome?.ok), outcome };
}

// A catch-up trigger once bootstrap is done (visibility, interval, online
// event, ...): skipped with no network at all when shouldRunSync says the data
// is fresh. Pending rows are read only when they can change the decision.
export async function runCatchUpSync(
  reason: string,
  deps: Omit<OfflineBootstrapDeps, 'prepareLocal'>
): Promise<SyncOutcome | null | 'skipped'> {
  const now = deps.now ?? Date.now;
  const lastSuccessAt = deps.lastSuccessAt?.() ?? null;
  if (lastSuccessAt !== null && !shouldRunSync({ reason, lastSuccessAt, now: now(), pending: await (deps.pendingCount ?? localPendingCount)() })) {
    return 'skipped';
  }
  return deps.runSync(reason);
}

// One-shot preparation for callers outside OfflineProvider: one ping + one
// push/pull at most. Returns whether preparation completed.
export async function prepareOffline(): Promise<boolean> {
  return (await runOfflineBootstrap({ runSync: syncNow })).done;
}
