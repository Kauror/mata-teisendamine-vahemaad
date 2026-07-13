import { csrfHeaders } from '@/lib/auth/client';
import { pingServer } from '@/lib/offline/connection';
import { getCursor, getDeviceId, getServerOffsetMs, type SyncCursor } from '@/lib/offline/meta';
import { attemptRepo, metaRepo, remediationActionRepo, taskActionRepo } from '@/lib/offline/repositories';
import type { LocalAttempt, LocalRemediationAction, LocalTaskAction } from '@/lib/offline/records';
import { applySyncEnvelope } from '@/lib/offline/syncApply';
import { withSyncLock } from '@/lib/offline/syncLock';
import {
  CLIENT_ACTION_BATCH_SIZE,
  CLIENT_ATTEMPT_BATCH_SIZE,
  MAX_PULL_PAGES_PER_CYCLE,
  SYNC_REQUEST_TIMEOUT_MS,
  chunkRecords,
  classifySyncHttpStatus,
  isManualSync,
  retryDelayMs,
  type SyncFailureDisposition
} from '@/lib/offline/syncPolicy';
import {
  APP_VERSION,
  OFFLINE_PROTOCOL_VERSION,
  type AttemptResult,
  type OfflineAttemptPayload,
  type OfflineAttemptPayloadV2,
  type OfflineSyncCursorV2,
  type OfflineSyncDevice,
  type OfflineSyncPullRequestV2,
  type OfflineSyncPullResponseV2,
  type OfflineSyncPushRequestV2,
  type OfflineSyncPushResponseV2,
  type OfflineRemediationActionPayload,
  type OfflineTaskActionPayload,
  type PingResponse,
  type RemediationActionResult,
  type TaskActionResult
} from '@/lib/shared/types';

const RETRY_STATE_KEY = 'syncRetryState';
const OUTBOX_LEASE_MS = 60_000;
const MAX_DUE_RECORDS_PER_CYCLE = 2_000;

type SyncRetryState = {
  status: 'idle' | 'retry_wait' | 'auth_blocked' | 'upgrade_required' | 'storage_error' | 'epoch_regression';
  retryCount: number;
  nextRetryAt?: string;
  lastError?: string;
  updatedAt: string;
};

export type SyncOutcome = {
  ok: boolean;
  reason?: string;
  pushed: number;
  pulled: number;
  attemptResults?: AttemptResult[];
  taskActionResults?: TaskActionResult[];
  remediationActionResults?: RemediationActionResult[];
};

class SyncHttpError extends Error {
  constructor(readonly status: number, readonly body: unknown) {
    super(`sync-http-${status}`);
    this.name = 'SyncHttpError';
  }
}

class StopSyncCycle extends Error {
  constructor(readonly reason: string, readonly disposition: SyncFailureDisposition | 'offline' | 'timeout') {
    super(reason);
    this.name = 'StopSyncCycle';
  }
}

function toActionPayload(action: LocalTaskAction): OfflineTaskActionPayload {
  return {
    clientActionId: action.clientActionId,
    deviceId: action.deviceId,
    learner: action.learner,
    actionType: action.actionType,
    templateId: action.templateId,
    templateVersion: action.templateVersion,
    taskDate: action.taskDate,
    snapshot: action.snapshot,
    completedAt: action.completedAt
  };
}

function toRemediationPayload(action: LocalRemediationAction): OfflineRemediationActionPayload {
  return {
    clientActionId: action.clientActionId,
    deviceId: action.deviceId,
    bundleId: action.bundleId,
    sessionId: action.sessionId,
    learner: action.learner,
    completedAt: action.completedAt,
    answers: action.answers
  };
}

function toPayload(attempt: LocalAttempt): OfflineAttemptPayload {
  return {
    clientAttemptId: attempt.clientAttemptId,
    deviceId: attempt.deviceId,
    learner: attempt.learner,
    subject: attempt.subject,
    topic: attempt.topic,
    category: attempt.category,
    difficulty: attempt.difficulty,
    exerciseId: attempt.exerciseId,
    catalogueVersion: attempt.catalogueVersion,
    startedAt: attempt.startedAt,
    rawDeviceCompletedAt: attempt.rawDeviceCompletedAt,
    completedAt: attempt.completedAt,
    clientTimeZone: attempt.clientTimeZone,
    clientUtcOffsetMinutes: attempt.clientUtcOffsetMinutes,
    questionCount: attempt.questionCount,
    score: attempt.score,
    elapsedSeconds: attempt.elapsedSeconds,
    questions: attempt.questions,
    rewardPolicyVersion: attempt.rewardPolicyVersion,
    generatorVersion: attempt.generatorVersion,
    runnerVersion: attempt.runnerVersion,
    rotationVersion: attempt.rotationVersion,
    clientCorrectedCompletedAt: attempt.clientCorrectedCompletedAt,
    seed: attempt.seed,
    runnerId: attempt.runnerId,
    questionIds: attempt.questionIds
  };
}

function toV2Payload(attempt: LocalAttempt): OfflineAttemptPayloadV2 | null {
  const payload = toPayload(attempt);
  if (
    typeof payload.rewardPolicyVersion !== 'string' || !payload.rewardPolicyVersion ||
    typeof payload.generatorVersion !== 'string' || !payload.generatorVersion ||
    typeof payload.runnerVersion !== 'string' || !payload.runnerVersion ||
    !Number.isSafeInteger(payload.rotationVersion) ||
    typeof payload.clientCorrectedCompletedAt !== 'string' || !payload.clientCorrectedCompletedAt ||
    (typeof payload.seed !== 'string' && typeof payload.seed !== 'number') ||
    typeof payload.runnerId !== 'string' || !payload.runnerId ||
    !Array.isArray(payload.questionIds)
  ) return null;
  return payload as OfflineAttemptPayloadV2;
}

function cursorV2(cursor: SyncCursor): OfflineSyncCursorV2 {
  return {
    lastServerAttemptId: cursor.lastServerAttemptId,
    lastTombstoneId: cursor.lastTombstoneId,
    lastTaskChangeId: cursor.lastTaskChangeId,
    lastRemediationChangeId: cursor.lastRemediationChangeId,
    lastAttemptChangeId: cursor.lastAttemptChangeId,
    historyEpoch: cursor.historyEpoch,
    catalogueVersions: cursor.catalogueVersions,
    historyBackfillCursor: cursor.historyBackfillCursor,
    lastSuccessfulSyncAt: cursor.lastSuccessfulSyncAt
  };
}

async function deviceDescriptor(): Promise<OfflineSyncDevice> {
  return {
    deviceId: await getDeviceId(),
    appVersion: APP_VERSION,
    buildId: process.env.NEXT_PUBLIC_APP_BUILD_ID,
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Europe/Tallinn',
    clientNow: new Date().toISOString(),
    lastKnownServerOffsetMs: await getServerOffsetMs()
  };
}

function responseProtocols(ping: PingResponse): Set<1 | 2> {
  return new Set(ping.supportedProtocolVersions?.length ? ping.supportedProtocolVersions : [ping.protocolVersion]);
}

async function postSync<T>(request: unknown, signal: AbortSignal): Promise<T> {
  const json = JSON.stringify(request);
  if (new TextEncoder().encode(json).byteLength > 1024 * 1024) throw new SyncHttpError(413, { code: 'body_too_large' });
  const response = await fetch('/api/offline/sync', {
    method: 'POST',
    cache: 'no-store',
    headers: csrfHeaders({ 'Content-Type': 'application/json' }),
    body: json,
    signal
  });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = { code: 'malformed_response' };
  }
  if (!response.ok) throw new SyncHttpError(response.status, body);
  return body as T;
}

async function retryState(): Promise<SyncRetryState> {
  return metaRepo.get<SyncRetryState>(RETRY_STATE_KEY, { status: 'idle', retryCount: 0, updatedAt: new Date(0).toISOString() });
}

async function writeRetryState(state: Omit<SyncRetryState, 'updatedAt'>): Promise<void> {
  await metaRepo.put(RETRY_STATE_KEY, { ...state, updatedAt: new Date().toISOString() });
}

// A successful family PIN login establishes fresh credentials. Do not leave a
// persisted 401 block preventing normal reconnect/startup sync afterwards.
export async function clearAuthBlockedSyncState(): Promise<void> {
  const state = await retryState();
  if (state.status === 'auth_blocked') await writeRetryState({ status: 'idle', retryCount: 0 });
}

async function scheduleRetry(message: string): Promise<string> {
  const current = await retryState();
  const retryCount = current.retryCount + 1;
  const nextRetryAt = new Date(Date.now() + retryDelayMs(current.retryCount)).toISOString();
  await writeRetryState({ status: 'retry_wait', retryCount, nextRetryAt, lastError: message });
  return nextRetryAt;
}

async function blockRetry(status: 'auth_blocked' | 'upgrade_required' | 'storage_error' | 'epoch_regression', message: string): Promise<void> {
  const current = await retryState();
  await writeRetryState({ status, retryCount: current.retryCount, lastError: message });
}

function errorDisposition(error: unknown): SyncFailureDisposition | 'timeout' {
  if (error instanceof SyncHttpError) return classifySyncHttpStatus(error.status);
  if (error instanceof DOMException && (error.name === 'AbortError' || error.name === 'TimeoutError')) return 'timeout';
  return 'retryable';
}

async function returnAttemptBatch(batch: LocalAttempt[], error: string, nextRetryAt?: string) {
  await attemptRepo.returnPending(batch.map((row) => row.clientAttemptId), error, nextRetryAt);
}

async function returnTaskBatch(batch: LocalTaskAction[], error: string, nextRetryAt?: string) {
  await taskActionRepo.returnPending(batch.map((row) => row.clientActionId), error, nextRetryAt);
}

async function returnRemediationBatch(batch: LocalRemediationAction[], error: string, nextRetryAt?: string) {
  await remediationActionRepo.returnPending(batch.map((row) => row.clientActionId), error, nextRetryAt);
}

async function handleAttemptPushError(error: unknown, batch: LocalAttempt[]): Promise<never | void> {
  const disposition = errorDisposition(error);
  const message = error instanceof Error ? error.message : String(error);
  if (disposition === 'record_validation' || disposition === 'terminal') {
    await applySyncEnvelope({
      serverTime: new Date().toISOString(),
      attemptResults: batch.map((row) => ({ clientAttemptId: row.clientAttemptId, status: 'needs_review', reasonCode: 'invalid_request', message }))
    });
    return;
  }
  if (disposition === 'auth_blocked' || disposition === 'upgrade_required') {
    await returnAttemptBatch(batch, message);
    await blockRetry(disposition, message);
    throw new StopSyncCycle(message, disposition);
  }
  const nextRetryAt = await scheduleRetry(message);
  await returnAttemptBatch(batch, message, nextRetryAt);
  throw new StopSyncCycle(message, disposition === 'timeout' ? 'timeout' : 'retryable');
}

async function handleTaskPushError(error: unknown, batch: LocalTaskAction[]): Promise<never | void> {
  const disposition = errorDisposition(error);
  const message = error instanceof Error ? error.message : String(error);
  if (disposition === 'record_validation' || disposition === 'terminal') {
    await applySyncEnvelope({
      serverTime: new Date().toISOString(),
      taskActionResults: batch.map((row) => ({ clientActionId: row.clientActionId, status: 'needs_review', reasonCode: 'invalid_request', message }))
    });
    return;
  }
  if (disposition === 'auth_blocked' || disposition === 'upgrade_required') {
    await returnTaskBatch(batch, message);
    await blockRetry(disposition, message);
    throw new StopSyncCycle(message, disposition);
  }
  const nextRetryAt = await scheduleRetry(message);
  await returnTaskBatch(batch, message, nextRetryAt);
  throw new StopSyncCycle(message, disposition === 'timeout' ? 'timeout' : 'retryable');
}

async function handleRemediationPushError(error: unknown, batch: LocalRemediationAction[]): Promise<never | void> {
  const disposition = errorDisposition(error);
  const message = error instanceof Error ? error.message : String(error);
  if (disposition === 'record_validation' || disposition === 'terminal') {
    await applySyncEnvelope({
      serverTime: new Date().toISOString(),
      remediationActionResults: batch.map((row) => ({ clientActionId: row.clientActionId, status: 'needs_review', reasonCode: 'invalid_request', message }))
    });
    return;
  }
  if (disposition === 'auth_blocked' || disposition === 'upgrade_required') {
    await returnRemediationBatch(batch, message);
    await blockRetry(disposition, message);
    throw new StopSyncCycle(message, disposition);
  }
  const nextRetryAt = await scheduleRetry(message);
  await returnRemediationBatch(batch, message, nextRetryAt);
  throw new StopSyncCycle(message, disposition === 'timeout' ? 'timeout' : 'retryable');
}

async function pushAttemptBatch(
  batch: LocalAttempt[],
  device: OfflineSyncDevice,
  signal: AbortSignal,
  aggregate: AttemptResult[],
  alreadyMarked = false
): Promise<number> {
  if (!batch.length) return 0;
  if (!alreadyMarked) await attemptRepo.markSyncing(batch.map((row) => row.clientAttemptId), new Date(Date.now() + OUTBOX_LEASE_MS).toISOString());
  const payloads = batch.map(toV2Payload);
  if (payloads.some((row) => !row)) {
    await returnAttemptBatch(batch, 'legacy_protocol_required');
    return 0;
  }
  const request: OfflineSyncPushRequestV2 = {
    protocolVersion: OFFLINE_PROTOCOL_VERSION,
    phase: 'push',
    pushKind: 'attempts',
    device: { ...device, clientNow: new Date().toISOString() },
    cursor: cursorV2(await getCursor()),
    pending: { attempts: payloads as OfflineAttemptPayloadV2[] }
  };
  try {
    const response = await postSync<OfflineSyncPushResponseV2>(request, signal);
    if (response.protocolVersion !== 2 || response.phase !== 'push') throw new Error('invalid-v2-push-response');
    aggregate.push(...response.attemptResults);
    const applied = await applySyncEnvelope({ serverTime: response.serverTime, attemptResults: response.attemptResults });
    for (const id of applied.missingCanonicalAttemptIds) {
      const row = await attemptRepo.get(id);
      if (row) await attemptRepo.put({ ...row, nextRetryAt: new Date(Date.now() + retryDelayMs(row.retryCount)).toISOString() });
    }
    return response.attemptResults.length;
  } catch (error) {
    if (error instanceof SyncHttpError && error.status === 413 && batch.length > 1) {
      const midpoint = Math.ceil(batch.length / 2);
      return (await pushAttemptBatch(batch.slice(0, midpoint), device, signal, aggregate, true)) +
        (await pushAttemptBatch(batch.slice(midpoint), device, signal, aggregate, true));
    }
    if (error instanceof SyncHttpError && error.status === 413) {
      await applySyncEnvelope({
        serverTime: new Date().toISOString(),
        attemptResults: [{ clientAttemptId: batch[0].clientAttemptId, status: 'needs_review', reasonCode: 'payload_too_large' }]
      });
      return 0;
    }
    await handleAttemptPushError(error, batch);
    return 0;
  }
}

async function pushTaskBatch(
  batch: LocalTaskAction[],
  device: OfflineSyncDevice,
  signal: AbortSignal,
  aggregate: TaskActionResult[],
  alreadyMarked = false
): Promise<number> {
  if (!batch.length) return 0;
  if (!alreadyMarked) await taskActionRepo.markSyncing(batch.map((row) => row.clientActionId), new Date(Date.now() + OUTBOX_LEASE_MS).toISOString());
  const request: OfflineSyncPushRequestV2 = {
    protocolVersion: OFFLINE_PROTOCOL_VERSION,
    phase: 'push',
    pushKind: 'actions',
    device: { ...device, clientNow: new Date().toISOString() },
    cursor: cursorV2(await getCursor()),
    pending: { taskActions: batch.map(toActionPayload), remediationActions: [] }
  };
  try {
    const response = await postSync<OfflineSyncPushResponseV2>(request, signal);
    if (response.protocolVersion !== 2 || response.phase !== 'push') throw new Error('invalid-v2-push-response');
    aggregate.push(...response.taskActionResults);
    await applySyncEnvelope({ serverTime: response.serverTime, taskActionResults: response.taskActionResults });
    return response.taskActionResults.length;
  } catch (error) {
    if (error instanceof SyncHttpError && error.status === 413 && batch.length > 1) {
      const midpoint = Math.ceil(batch.length / 2);
      return (await pushTaskBatch(batch.slice(0, midpoint), device, signal, aggregate, true)) +
        (await pushTaskBatch(batch.slice(midpoint), device, signal, aggregate, true));
    }
    if (error instanceof SyncHttpError && error.status === 413) {
      await applySyncEnvelope({
        serverTime: new Date().toISOString(),
        taskActionResults: [{ clientActionId: batch[0].clientActionId, status: 'needs_review', reasonCode: 'payload_too_large' }]
      });
      return 0;
    }
    await handleTaskPushError(error, batch);
    return 0;
  }
}

async function pushRemediationBatch(
  batch: LocalRemediationAction[],
  device: OfflineSyncDevice,
  signal: AbortSignal,
  aggregate: RemediationActionResult[],
  alreadyMarked = false
): Promise<number> {
  if (!batch.length) return 0;
  if (!alreadyMarked) await remediationActionRepo.markSyncing(batch.map((row) => row.clientActionId), new Date(Date.now() + OUTBOX_LEASE_MS).toISOString());
  const request: OfflineSyncPushRequestV2 = {
    protocolVersion: OFFLINE_PROTOCOL_VERSION,
    phase: 'push',
    pushKind: 'actions',
    device: { ...device, clientNow: new Date().toISOString() },
    cursor: cursorV2(await getCursor()),
    pending: { taskActions: [], remediationActions: batch.map(toRemediationPayload) }
  };
  try {
    const response = await postSync<OfflineSyncPushResponseV2>(request, signal);
    if (response.protocolVersion !== 2 || response.phase !== 'push') throw new Error('invalid-v2-push-response');
    aggregate.push(...response.remediationActionResults);
    await applySyncEnvelope({ serverTime: response.serverTime, remediationActionResults: response.remediationActionResults });
    return response.remediationActionResults.length;
  } catch (error) {
    if (error instanceof SyncHttpError && error.status === 413 && batch.length > 1) {
      const midpoint = Math.ceil(batch.length / 2);
      return (await pushRemediationBatch(batch.slice(0, midpoint), device, signal, aggregate, true)) +
        (await pushRemediationBatch(batch.slice(midpoint), device, signal, aggregate, true));
    }
    if (error instanceof SyncHttpError && error.status === 413) {
      await applySyncEnvelope({
        serverTime: new Date().toISOString(),
        remediationActionResults: [{ clientActionId: batch[0].clientActionId, status: 'needs_review', reasonCode: 'payload_too_large' }]
      });
      return 0;
    }
    await handleRemediationPushError(error, batch);
    return 0;
  }
}

async function pullV2(device: OfflineSyncDevice, signal: AbortSignal): Promise<number> {
  let pulled = 0;
  let previousCursor = '';
  for (let page = 0; page < MAX_PULL_PAGES_PER_CYCLE; page += 1) {
    const cursor = cursorV2(await getCursor());
    const signature = JSON.stringify(cursor);
    if (page > 0 && signature === previousCursor) throw new StopSyncCycle('pull_cursor_stalled', 'retryable');
    previousCursor = signature;
    const request: OfflineSyncPullRequestV2 = {
      protocolVersion: OFFLINE_PROTOCOL_VERSION,
      phase: 'pull',
      device: { ...device, clientNow: new Date().toISOString() },
      cursor,
      pageSize: { attempts: 300, tombstones: 300, taskChanges: 300, remediationChanges: 300, historyBackfill: 300 }
    };
    const response = await postSync<OfflineSyncPullResponseV2>(request, signal);
    if (response.protocolVersion !== 2 || response.phase !== 'pull') throw new Error('invalid-v2-pull-response');
    await applySyncEnvelope({
      serverTime: response.serverTime,
      historyEpoch: response.historyEpoch,
      pull: response.pull,
      nextCursor: response.nextCursor,
      resetRequired: Boolean(response.resetRequired)
    });
    pulled += response.pull.attempts.length;
    if (!Object.values(response.hasMore).some(Boolean)) return pulled;
  }
  throw new StopSyncCycle('pull_page_limit', 'retryable');
}

async function runSyncCycle(reason: string, lockSignal: AbortSignal): Promise<SyncOutcome> {
  const cycleController = new AbortController();
  const onLockAbort = () => cycleController.abort(lockSignal.reason);
  lockSignal.addEventListener('abort', onLockAbort, { once: true });
  const timeout = setTimeout(() => cycleController.abort(new DOMException('Sync cycle timed out.', 'TimeoutError')), SYNC_REQUEST_TIMEOUT_MS);
  const aggregateAttempts: AttemptResult[] = [];
  const aggregateActions: TaskActionResult[] = [];
  const aggregateRemediationActions: RemediationActionResult[] = [];
  let pushed = 0;
  let pulled = 0;

  try {
    await Promise.all([attemptRepo.recoverExpiredSyncing(), taskActionRepo.recoverExpiredSyncing(), remediationActionRepo.recoverExpiredSyncing()]);
    const state = await retryState();
    const manual = isManualSync(reason);
    if (!manual && (state.status === 'auth_blocked' || state.status === 'upgrade_required' || state.status === 'epoch_regression')) {
      return { ok: false, reason: state.status, pushed: 0, pulled: 0 };
    }
    if (!manual && state.status === 'retry_wait' && state.nextRetryAt && new Date(state.nextRetryAt).getTime() > Date.now()) {
      return { ok: false, reason: 'retry_wait', pushed: 0, pulled: 0 };
    }

    const ping = await pingServer(5_000, cycleController.signal);
    if (!ping) {
      if (cycleController.signal.aborted) throw new StopSyncCycle('sync_timeout', 'timeout');
      return { ok: false, reason: 'offline', pushed: 0, pulled: 0 };
    }
    const protocols = responseProtocols(ping);
    const device = await deviceDescriptor();
    const dueAttempts = await attemptRepo.pendingDue(MAX_DUE_RECORDS_PER_CYCLE);
    const dueActions = await taskActionRepo.pendingDue(MAX_DUE_RECORDS_PER_CYCLE);
    const dueRemediationActions = await remediationActionRepo.pendingDue(MAX_DUE_RECORDS_PER_CYCLE);

    if (!protocols.has(2)) {
      await blockRetry('upgrade_required', 'No mutually supported offline protocol.');
      return { ok: false, reason: 'upgrade_required', pushed: 0, pulled: 0 };
    } else {
      const modernAttempts = dueAttempts.filter((row) => toV2Payload(row) !== null);
      const legacyAttempts = dueAttempts.filter((row) => toV2Payload(row) === null);
      for (const batch of chunkRecords(modernAttempts, CLIENT_ATTEMPT_BATCH_SIZE)) {
        pushed += await pushAttemptBatch(batch, device, cycleController.signal, aggregateAttempts);
      }
      // All task/remediation actions are pushed only after every attempt batch.
      for (const batch of chunkRecords(dueActions, CLIENT_ACTION_BATCH_SIZE)) {
        pushed += await pushTaskBatch(batch, device, cycleController.signal, aggregateActions);
      }
      for (const batch of chunkRecords(dueRemediationActions, CLIENT_ACTION_BATCH_SIZE)) {
        pushed += await pushRemediationBatch(batch, device, cycleController.signal, aggregateRemediationActions);
      }
      // Preserve pre-v2 outbox rows in IndexedDB for explicit manual review.
      // They cannot be safely upgraded because their immutable runner contract
      // and server-verifiable answer payload do not exist.
      if (legacyAttempts.length) {
        await applySyncEnvelope({
          serverTime: ping.serverTime,
          attemptResults: legacyAttempts.map((row) => ({ clientAttemptId: row.clientAttemptId, status: 'needs_review', reasonCode: 'legacy_client_upgrade_required' }))
        });
      }
      pulled += await pullV2(device, cycleController.signal);
    }

    await writeRetryState({ status: 'idle', retryCount: 0 });
    return { ok: true, pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
  } catch (error) {
    if (error instanceof StopSyncCycle) return { ok: false, reason: error.disposition, pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('history epoch regressed')) {
      await blockRetry('epoch_regression', message);
      return { ok: false, reason: 'epoch_regression', pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
    }
    if (cycleController.signal.aborted) {
      await scheduleRetry(message);
      return { ok: false, reason: 'timeout', pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
    }
    await blockRetry('storage_error', message).catch(() => {});
    return { ok: false, reason: 'storage_error', pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
  } finally {
    clearTimeout(timeout);
    lockSignal.removeEventListener('abort', onLockAbort);
  }
}

// Full push-before-pull cycle guarded by a cross-tab lock. Manual sync bypasses
// backoff; background/open/visibility triggers respect it.
export async function syncNow(reason: string): Promise<SyncOutcome> {
  try {
    const outcome = await withSyncLock((context) => runSyncCycle(reason, context.signal));
    return outcome ?? { ok: false, reason: 'locked', pushed: 0, pulled: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await blockRetry('storage_error', message).catch(() => {});
    return { ok: false, reason: 'storage_error', pushed: 0, pulled: 0 };
  }
}
