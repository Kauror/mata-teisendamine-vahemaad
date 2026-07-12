import { APP_BUILD_ID, OFFLINE_CAPABILITY_MANIFEST, OFFLINE_CAPABILITY_MANIFEST_VERSION, validateOfflineCapabilityManifest } from '@/lib/offline/capabilities';
import { getStorageHealth, offlineDb } from '@/lib/offline/db';
import { ensurePersistentStorage, getCursor, getDeviceId, getStoragePersisted } from '@/lib/offline/meta';
import { attemptRepo, bootstrapRepo, catalogRepo, remediationBundleRepo, snapshotRepo } from '@/lib/offline/repositories';
import { pingServer } from '@/lib/offline/connection';
import { syncNow } from '@/lib/offline/syncEngine';
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
  const pendingAttempts = (await attemptRepo.pending()).length;
  const cacheComplete = Boolean(worker?.cacheComplete);
  const dashboardsPresent = Boolean(kiurSnapshot && kirsiSnapshot);
  const runnerMappingsComplete = runnerErrors.length === 0 && OFFLINE_CAPABILITY_MANIFEST.runners.every((runner) => runner.offlineStart);

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
export async function prepareOffline(): Promise<void> {
  await ensurePersistentStorage();
  await getDeviceId();
  const ping = await pingServer();
  if (ping) await syncNow('prepare-offline');
}
