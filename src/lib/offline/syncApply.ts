import { offlineDb, withStorageHealth } from '@/lib/offline/db';
import type { LocalAttempt, LocalRemediationAction, LocalTaskAction, PreparedRemediationBundle, TaskAssignmentRecord } from '@/lib/offline/records';
import { historyEpochDecision } from '@/lib/offline/syncPolicy';
import type {
  AttemptResult,
  OfflineCatalogue,
  OfflineSyncCursorV2,
  OfflineSyncPullDataV2,
  RemediationActionResult,
  ServerAttempt,
  TaskActionResult
} from '@/lib/shared/types';
import type { SyncTaskTemplate } from '@/lib/shared/taskProjection';

const DATA_REVISION_KEY = 'dataRevision';
const SYNC_CURSOR_KEY = 'syncCursor';
const HISTORY_RETENTION_DAYS = 365;
const HISTORY_RETENTION_ROWS = 2_000;
const TASK_ACTION_RETENTION_DAYS = 90;
const MAX_CLEANUP_DELETES_PER_APPLY = 100;

export class HistoryEpochRegressionError extends Error {
  constructor(readonly localEpoch: number, readonly serverEpoch: number) {
    super(`Server history epoch regressed from ${localEpoch} to ${serverEpoch}.`);
    this.name = 'HistoryEpochRegressionError';
  }
}

export type SyncCursorValue = OfflineSyncCursorV2 & {
  syncedAt?: string;
  lastSuccessfulSyncAt?: string;
  lastAttemptedSyncAt?: string;
};

export type SyncApplyInput = {
  serverTime: string;
  attemptResults?: AttemptResult[];
  taskActionResults?: TaskActionResult[];
  remediationActionResults?: RemediationActionResult[];
  pull?: OfflineSyncPullDataV2;
  historyEpoch?: number;
  nextCursor?: SyncCursorValue;
  resetRequired?: boolean;
};

export type SyncApplyResult = {
  dataRevision: number;
  missingCanonicalAttemptIds: string[];
  confirmedAttempts: number;
};

function taskStatus(result: TaskActionResult): LocalTaskAction['status'] {
  return result.status === 'duplicate' ? 'duplicate' : result.status;
}

function isResolvedTaskStatus(status: LocalTaskAction['status']): boolean {
  return status === 'applied' || status === 'duplicate' || status === 'returned' || status === 'conflict' || status === 'rejected';
}

function asTaskAssignment(value: unknown): TaskAssignmentRecord | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Record<string, unknown>;
  if ((row.learner !== 'kiur' && row.learner !== 'kirsi') || typeof row.taskDate !== 'string' || !Number.isInteger(row.templateId)) return null;
  if (typeof row.assignmentId !== 'string' && typeof row.assignmentId !== 'number') return null;
  return {
    assignmentId: String(row.assignmentId),
    learner: row.learner,
    taskDate: row.taskDate,
    templateId: row.templateId as number,
    state: row.state,
    updatedAt: typeof row.updatedAt === 'string' ? row.updatedAt : new Date().toISOString()
  };
}

function asRemediationBundle(value: unknown): PreparedRemediationBundle | null {
  if (!value || typeof value !== 'object') return null;
  const row = value as Partial<PreparedRemediationBundle>;
  if (typeof row.bundleId !== 'string' || (row.learner !== 'kiur' && row.learner !== 'kirsi')) return null;
  if (typeof row.exerciseId !== 'string' || !Array.isArray(row.questions) || typeof row.issuedAt !== 'string' || typeof row.validUntil !== 'string') return null;
  if (!row.status || !['prepared', 'active', 'completed', 'stale', 'needs_review'].includes(row.status)) return null;
  if (typeof row.generatorVersion !== 'string' || typeof row.updatedAt !== 'string') return null;
  return row as PreparedRemediationBundle;
}

function broadcastRevision(dataRevision: number) {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('offline-data-revision', { detail: { dataRevision } }));
  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel('harjutaja-offline-data');
    channel.postMessage({ dataRevision });
    channel.close();
  }
}

// Acknowledgements, canonical history, pulled projections, tombstones and cursor
// movement are committed together. A crash can therefore leave the old state or
// the new state, but never delete an outbox row without its canonical history.
export async function applySyncEnvelope(input: SyncApplyInput): Promise<SyncApplyResult> {
  const db = await offlineDb();
  const existingCursorRow = await db.get('meta', SYNC_CURSOR_KEY);
  const existingCursor = (existingCursorRow?.value ?? {
    lastServerAttemptId: 0,
    lastTombstoneId: 0,
    lastTaskChangeId: 0,
    lastRemediationChangeId: 0,
    lastAttemptChangeId: 0,
    historyEpoch: 0,
    catalogueVersions: {}
  }) as SyncCursorValue;
  const serverEpoch = input.historyEpoch ?? input.nextCursor?.historyEpoch ?? existingCursor.historyEpoch;
  const epochDecision = historyEpochDecision(existingCursor.historyEpoch ?? 0, serverEpoch ?? 0);
  if (epochDecision === 'stop_regression') throw new HistoryEpochRegressionError(existingCursor.historyEpoch, serverEpoch);

  const result = await withStorageHealth(async (): Promise<SyncApplyResult> => {
    const tx = db.transaction([
      'meta',
      'attempts',
      'history',
      'catalogues',
      'catalogueGrants',
      'snapshots',
      'taskTemplates',
      'taskActions',
      'remediationActions',
      'taskAssignments',
      'remediationBundles',
      'bootstrap'
    ], 'readwrite');
    const meta = tx.objectStore('meta');
    const attempts = tx.objectStore('attempts');
    const history = tx.objectStore('history');
    const taskActions = tx.objectStore('taskActions');
    const remediationActions = tx.objectStore('remediationActions');
    const pulledAttempts = input.pull?.attempts ?? [];
    const pulledByClientId = new Map(pulledAttempts.filter((row) => row.clientAttemptId).map((row) => [row.clientAttemptId!, row]));
    const missingCanonicalAttemptIds: string[] = [];
    let confirmedAttempts = 0;

    if (input.resetRequired || epochDecision === 'reset_confirmed') {
      await history.clear();
      // A retained-floor reset also drops server-derived projections. Pending
      // attempts and task actions stay untouched by design.
      if (input.resetRequired) {
        await tx.objectStore('catalogues').clear();
        await tx.objectStore('catalogueGrants').clear();
        await tx.objectStore('snapshots').clear();
        await tx.objectStore('taskTemplates').clear();
        await tx.objectStore('taskAssignments').clear();
        await tx.objectStore('remediationBundles').clear();
        await tx.objectStore('bootstrap').put({ key: 'deviceBootstrapComplete', value: false, updatedAt: input.serverTime });
        await tx.objectStore('bootstrap').put({ key: 'taskBootstrapComplete', value: false, updatedAt: input.serverTime });
      }
    }

    const putCanonical = async (canonical: ServerAttempt) => {
      if (canonical.clientAttemptId) {
        const index = history.index('byClientAttemptId');
        let cursor = await index.openCursor(IDBKeyRange.only(canonical.clientAttemptId));
        while (cursor) {
          if (cursor.primaryKey !== canonical.id) await cursor.delete();
          cursor = await cursor.continue();
        }
      }
      await history.put(canonical);
      if (canonical.clientAttemptId) await attempts.delete(canonical.clientAttemptId);
      confirmedAttempts += 1;
    };

    for (const acknowledgement of input.attemptResults ?? []) {
      const local = await attempts.get(acknowledgement.clientAttemptId);
      if (acknowledgement.status === 'created' || acknowledgement.status === 'duplicate') {
        const canonical = acknowledgement.canonicalAttempt ?? pulledByClientId.get(acknowledgement.clientAttemptId);
        if (canonical) await putCanonical(canonical);
        else if (local) {
          // Never remove the only durable copy. A retry is idempotent and should
          // return the missing canonical row on the next request.
          missingCanonicalAttemptIds.push(acknowledgement.clientAttemptId);
          await attempts.put({ ...local, status: 'pending', syncLeaseUntil: undefined, lastError: 'missing_canonical_ack' } as LocalAttempt);
        }
      } else if (local) {
        await attempts.put({
          ...local,
          status: acknowledgement.status,
          syncLeaseUntil: undefined,
          serverAttemptId: acknowledgement.serverAttemptId,
          reward: acknowledgement.reward,
          reasonCode: acknowledgement.reasonCode,
          lastError: acknowledgement.message
        });
      }
    }

    for (const acknowledgement of input.taskActionResults ?? []) {
      const local = await taskActions.get(acknowledgement.clientActionId);
      if (!local) continue;
      const status = taskStatus(acknowledgement);
      await taskActions.put({
        ...local,
        status,
        syncLeaseUntil: undefined,
        nextRetryAt: undefined,
        reasonCode: acknowledgement.reasonCode,
        serverState: acknowledgement.serverState,
        resolvedAt: isResolvedTaskStatus(status) ? input.serverTime : undefined
      });
    }

    for (const acknowledgement of input.remediationActionResults ?? []) {
      const local = await remediationActions.get(acknowledgement.clientActionId);
      if (!local) continue;
      if (acknowledgement.status === 'created' || acknowledgement.status === 'duplicate') {
        if (acknowledgement.canonicalAttempt) {
          await putCanonical(acknowledgement.canonicalAttempt);
          await remediationActions.put({
            ...local,
            status: acknowledgement.status,
            syncLeaseUntil: undefined,
            nextRetryAt: undefined,
            reasonCode: acknowledgement.reasonCode,
            resolvedAt: input.serverTime
          } as LocalRemediationAction);
        } else {
          await remediationActions.put({ ...local, status: 'pending', syncLeaseUntil: undefined, lastError: 'missing_canonical_ack' });
        }
      } else {
        await remediationActions.put({
          ...local,
          status: acknowledgement.status,
          syncLeaseUntil: undefined,
          nextRetryAt: undefined,
          reasonCode: acknowledgement.reasonCode,
          lastError: acknowledgement.message,
          resolvedAt: acknowledgement.status === 'rejected' ? input.serverTime : undefined
        });
      }
    }

    for (const canonical of pulledAttempts) await putCanonical(canonical);

    for (const tombstone of input.pull?.tombstones ?? []) {
      if (typeof tombstone.serverAttemptId === 'number') await history.delete(tombstone.serverAttemptId);
      if (tombstone.clientAttemptId) {
        const index = history.index('byClientAttemptId');
        let cursor = await index.openCursor(IDBKeyRange.only(tombstone.clientAttemptId));
        while (cursor) {
          await cursor.delete();
          cursor = await cursor.continue();
        }
      }
    }

    for (const grant of Object.values(input.pull?.catalogueGrants ?? {})) {
      if (grant) await tx.objectStore('catalogueGrants').put(grant);
    }
    for (const catalogue of Object.values(input.pull?.catalogues ?? {}) as OfflineCatalogue[]) {
      if (!catalogue) continue;
      const grant = input.pull?.catalogueGrants?.[catalogue.learner] ?? await tx.objectStore('catalogueGrants').get(catalogue.learner);
      await tx.objectStore('catalogues').put(grant ? {
        ...catalogue,
        rewardPolicyVersion: grant.rewardPolicyVersion,
        generatorVersion: grant.generatorVersion,
        runnerVersion: grant.runnerVersion,
        algorithmVersion: grant.rotationVersion
      } : catalogue);
    }
    for (const snapshot of Object.values(input.pull?.dashboards ?? {})) {
      if (snapshot) await tx.objectStore('snapshots').put(snapshot);
    }
    if (input.pull?.taskTemplates !== undefined) {
      const templates = tx.objectStore('taskTemplates');
      await templates.clear();
      for (const template of input.pull.taskTemplates as SyncTaskTemplate[]) await templates.put(template);
    }

    // RTM3-H05: the dated assignment collection is an authoritative snapshot, not
    // an append-only feed. Editing a current-day template deletes its old task
    // instance + assignments and materialises new ones with new ids; if we only
    // upserted, the stale assignment would linger in IndexedDB and — because the
    // offline read picks the first assignment matching template+date — could
    // shadow the freshly created canonical one. So for every date present in the
    // response we clear the local assignments first, then insert the authoritative
    // rows. Dates not in the response are left untouched.
    if (input.pull?.taskAssignments !== undefined) {
      const assignmentStore = tx.objectStore('taskAssignments');
      const incoming = input.pull.taskAssignments
        .map(asTaskAssignment)
        .filter((row): row is TaskAssignmentRecord => row !== null);
      const snapshotDates = new Set(incoming.map((row) => row.taskDate));
      for (const date of snapshotDates) {
        let assignmentCursor = await assignmentStore.index('byTaskDate').openCursor(IDBKeyRange.only(date));
        while (assignmentCursor) {
          await assignmentCursor.delete();
          assignmentCursor = await assignmentCursor.continue();
        }
      }
      for (const assignment of incoming) await assignmentStore.put(assignment);
    }
    for (const change of input.pull?.taskChanges ?? []) {
      if (!change.clientActionId) continue;
      const local = await taskActions.get(change.clientActionId);
      if (!local) continue;
      const status = change.state;
      await taskActions.put({
        ...local,
        status,
        reasonCode: change.reasonCode,
        serverState: change.serverState,
        resolvedAt: isResolvedTaskStatus(status) ? change.changedAt : undefined,
        syncLeaseUntil: undefined,
        nextRetryAt: undefined
      });
    }

    for (const raw of input.pull?.remediationBundles ?? []) {
      const bundle = asRemediationBundle(raw);
      if (bundle) await tx.objectStore('remediationBundles').put(bundle);
    }
    for (const change of input.pull?.remediationChanges ?? []) {
      const bundle = await tx.objectStore('remediationBundles').get(change.bundleId);
      if (!bundle) continue;
      const status = change.state === 'expired' ? 'stale' : change.state === 'prepared' ? 'prepared' : change.state;
      await tx.objectStore('remediationBundles').put({ ...bundle, status, payload: change.payload ?? bundle.payload, updatedAt: change.changedAt });
    }

    if (input.nextCursor) {
      await meta.put({
        key: SYNC_CURSOR_KEY,
        value: {
          ...existingCursor,
          ...input.nextCursor,
          historyEpoch: serverEpoch,
          lastSuccessfulSyncAt: input.nextCursor.syncedAt ?? input.nextCursor.lastSuccessfulSyncAt ?? input.serverTime,
          lastAttemptedSyncAt: input.serverTime
        }
      });
    }

    // A complete bootstrap is an evidence marker, not merely "some sync ran".
    const hasBothCatalogues = Boolean(await tx.objectStore('catalogues').get('kiur')) && Boolean(await tx.objectStore('catalogues').get('kirsi'));
    const hasBothSnapshots = Boolean(await tx.objectStore('snapshots').get('kiur')) && Boolean(await tx.objectStore('snapshots').get('kirsi'));
    const grantsAdvertised = input.pull?.catalogueGrants !== undefined;
    const hasBothGrants = Boolean(await tx.objectStore('catalogueGrants').get('kiur')) && Boolean(await tx.objectStore('catalogueGrants').get('kirsi'));
    if (hasBothCatalogues && hasBothSnapshots && (!grantsAdvertised || hasBothGrants)) {
      await tx.objectStore('bootstrap').put({ key: 'deviceBootstrapComplete', value: true, updatedAt: input.serverTime });
    }
    if (input.pull?.taskTemplates !== undefined) {
      await tx.objectStore('bootstrap').put({ key: 'taskBootstrapComplete', value: true, updatedAt: input.serverTime });
    }

    // Bounded retention cleanup keeps the transaction short on iPhone. Further
    // old rows are removed by subsequent successful pages/cycles.
    const historyCutoff = Date.now() - HISTORY_RETENTION_DAYS * 86_400_000;
    let historyPosition = 0;
    let cleanupDeletes = 0;
    let historyCursor = await history.index('byCompletedAt').openCursor(null, 'prev');
    while (historyCursor && cleanupDeletes < MAX_CLEANUP_DELETES_PER_APPLY) {
      historyPosition += 1;
      const timestamp = new Date(historyCursor.value.completedAt ?? historyCursor.value.createdAt).getTime();
      if (historyPosition > HISTORY_RETENTION_ROWS || !Number.isFinite(timestamp) || timestamp < historyCutoff) {
        await historyCursor.delete();
        cleanupDeletes += 1;
      }
      historyCursor = await historyCursor.continue();
    }

    const taskCutoff = new Date(Date.now() - TASK_ACTION_RETENTION_DAYS * 86_400_000).toISOString();
    let taskCursor = await taskActions.index('byResolvedAt').openCursor(IDBKeyRange.upperBound(taskCutoff, true));
    while (taskCursor && cleanupDeletes < MAX_CLEANUP_DELETES_PER_APPLY) {
      if (isResolvedTaskStatus(taskCursor.value.status)) {
        await taskCursor.delete();
        cleanupDeletes += 1;
      }
      taskCursor = await taskCursor.continue();
    }

    let remediationCursor = await remediationActions.index('byResolvedAt').openCursor(IDBKeyRange.upperBound(taskCutoff, true));
    while (remediationCursor && cleanupDeletes < MAX_CLEANUP_DELETES_PER_APPLY) {
      await remediationCursor.delete();
      cleanupDeletes += 1;
      remediationCursor = await remediationCursor.continue();
    }

    const revisionRow = await meta.get(DATA_REVISION_KEY);
    const dataRevision = Math.max(0, Number(revisionRow?.value) || 0) + 1;
    await meta.put({ key: DATA_REVISION_KEY, value: dataRevision });
    await tx.done;
    return { dataRevision, missingCanonicalAttemptIds, confirmedAttempts };
  });

  broadcastRevision(result.dataRevision);
  return result;
}
