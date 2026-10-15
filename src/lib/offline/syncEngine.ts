import { csrfHeaders } from '@/lib/auth/client';
import { pingServer } from '@/lib/offline/connection';
import { getCursor, getDeviceId, getServerOffsetMs, type SyncCursor } from '@/lib/offline/meta';
import { attemptRepo, catalogRepo, catalogueGrantRepo, metaRepo, remediationActionRepo, taskActionRepo, type OutboxRepo } from '@/lib/offline/repositories';
import type { LocalAttempt, LocalRemediationAction, LocalTaskAction } from '@/lib/offline/records';
import { applySyncEnvelope, type SyncApplyInput, type SyncApplyResult } from '@/lib/offline/syncApply';
import { withSyncLock } from '@/lib/offline/syncLock';
import {
  CLIENT_ACTION_BATCH_SIZE,
  CLIENT_ATTEMPT_BATCH_SIZE,
  MAX_PULL_PAGES_PER_CYCLE,
  SYNC_REQUEST_TIMEOUT_MS,
  chunkRecords,
  classifySyncHttpStatus,
  bypassesRetryWait,
  isManualSync,
  retryDelayMs,
  type SyncFailureDisposition
} from '@/lib/offline/syncPolicy';
import {
  APP_VERSION,
  OFFLINE_PROTOCOL_VERSION,
  type AttemptResult,
  type KnownCatalogueGrant,
  type Learner,
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

// A request cancelled because the page is going away (the app closed or
// reloaded mid-sync) says nothing about the server, so it must not start a
// retry delay that would then hold every later background sync back.
let pageLeaving = false;
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', () => { pageLeaving = true; });
  window.addEventListener('pageshow', () => { pageLeaving = false; });
}

async function scheduleRetry(message: string): Promise<string> {
  if (pageLeaving) return new Date().toISOString();
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

// One outbox kind as the push path sees it: its store, how a batch becomes a
// request, and how the server's per-row results are read and applied.
type OutboxPush<Row, Result> = {
  repo: OutboxRepo<Row>;
  pushKind: OfflineSyncPushRequestV2['pushKind'];
  // null when a row cannot be sent with this protocol.
  pending(batch: Row[]): OfflineSyncPushRequestV2['pending'] | null;
  results(response: OfflineSyncPushResponseV2): Result[];
  envelope(results: Result[]): Omit<SyncApplyInput, 'serverTime'>;
  needsReview(id: string, reasonCode: string, message?: string): Result;
  afterApply?(applied: SyncApplyResult): Promise<void>;
};

const attemptOutbox: OutboxPush<LocalAttempt, AttemptResult> = {
  repo: attemptRepo,
  pushKind: 'attempts',
  pending(batch) {
    const payloads = batch.map(toV2Payload);
    return payloads.some((row) => !row) ? null : { attempts: payloads as OfflineAttemptPayloadV2[] };
  },
  results: (response) => response.attemptResults,
  envelope: (attemptResults) => ({ attemptResults }),
  needsReview: (clientAttemptId, reasonCode, message) => ({ clientAttemptId, status: 'needs_review', reasonCode, message }),
  async afterApply(applied) {
    for (const id of applied.missingCanonicalAttemptIds) {
      const row = await attemptRepo.get(id);
      if (row) await attemptRepo.put({ ...row, nextRetryAt: new Date(Date.now() + retryDelayMs(row.retryCount)).toISOString() });
    }
  }
};

const taskActionOutbox: OutboxPush<LocalTaskAction, TaskActionResult> = {
  repo: taskActionRepo,
  pushKind: 'actions',
  pending: (batch) => ({ taskActions: batch.map(toActionPayload), remediationActions: [] }),
  results: (response) => response.taskActionResults,
  envelope: (taskActionResults) => ({ taskActionResults }),
  needsReview: (clientActionId, reasonCode, message) => ({ clientActionId, status: 'needs_review', reasonCode, message })
};

const remediationActionOutbox: OutboxPush<LocalRemediationAction, RemediationActionResult> = {
  repo: remediationActionRepo,
  pushKind: 'actions',
  pending: (batch) => ({ taskActions: [], remediationActions: batch.map(toRemediationPayload) }),
  results: (response) => response.remediationActionResults,
  envelope: (remediationActionResults) => ({ remediationActionResults }),
  needsReview: (clientActionId, reasonCode, message) => ({ clientActionId, status: 'needs_review', reasonCode, message })
};

async function returnBatch<Row, Result>(outbox: OutboxPush<Row, Result>, batch: Row[], error: string, nextRetryAt?: string) {
  await outbox.repo.returnPending(batch.map(outbox.repo.idOf), error, nextRetryAt);
}

async function reviewBatch<Row, Result>(outbox: OutboxPush<Row, Result>, rows: Row[], reasonCode: string, message?: string) {
  await applySyncEnvelope({
    serverTime: new Date().toISOString(),
    ...outbox.envelope(rows.map((row) => outbox.needsReview(outbox.repo.idOf(row), reasonCode, message)))
  });
}

async function handlePushError<Row, Result>(outbox: OutboxPush<Row, Result>, error: unknown, batch: Row[]): Promise<void> {
  const disposition = errorDisposition(error);
  const message = error instanceof Error ? error.message : String(error);
  if (disposition === 'record_validation' || disposition === 'terminal') {
    await reviewBatch(outbox, batch, 'invalid_request', message);
    return;
  }
  if (disposition === 'auth_blocked' || disposition === 'upgrade_required') {
    await returnBatch(outbox, batch, message);
    await blockRetry(disposition, message);
    throw new StopSyncCycle(message, disposition);
  }
  const nextRetryAt = await scheduleRetry(message);
  await returnBatch(outbox, batch, message, nextRetryAt);
  throw new StopSyncCycle(message, disposition === 'timeout' ? 'timeout' : 'retryable');
}

// Pushes one batch and applies the per-row results. A 413 halves the batch
// (its rows stay leased) until a single row is still too large; that row goes
// to manual review. Returns how many rows the server acknowledged.
async function pushBatch<Row, Result>(
  outbox: OutboxPush<Row, Result>,
  batch: Row[],
  device: OfflineSyncDevice,
  signal: AbortSignal,
  aggregate: Result[],
  alreadyMarked = false
): Promise<number> {
  if (!batch.length) return 0;
  if (!alreadyMarked) await outbox.repo.markSyncing(batch.map(outbox.repo.idOf), new Date(Date.now() + OUTBOX_LEASE_MS).toISOString());
  const pending = outbox.pending(batch);
  if (!pending) {
    await returnBatch(outbox, batch, 'legacy_protocol_required');
    return 0;
  }
  const request: OfflineSyncPushRequestV2 = {
    protocolVersion: OFFLINE_PROTOCOL_VERSION,
    phase: 'push',
    pushKind: outbox.pushKind,
    device: { ...device, clientNow: new Date().toISOString() },
    cursor: cursorV2(await getCursor()),
    pending
  };
  try {
    const response = await postSync<OfflineSyncPushResponseV2>(request, signal);
    if (response.protocolVersion !== 2 || response.phase !== 'push') throw new Error('invalid-v2-push-response');
    const results = outbox.results(response);
    aggregate.push(...results);
    const applied = await applySyncEnvelope({ serverTime: response.serverTime, ...outbox.envelope(results) });
    await outbox.afterApply?.(applied);
    return results.length;
  } catch (error) {
    if (error instanceof SyncHttpError && error.status === 413 && batch.length > 1) {
      const midpoint = Math.ceil(batch.length / 2);
      return (await pushBatch(outbox, batch.slice(0, midpoint), device, signal, aggregate, true)) +
        (await pushBatch(outbox, batch.slice(midpoint), device, signal, aggregate, true));
    }
    if (error instanceof SyncHttpError && error.status === 413) {
      await reviewBatch(outbox, [batch[0]], 'payload_too_large');
      return 0;
    }
    await handlePushError(outbox, error, batch);
    return 0;
  }
}

// OFF-07: what this device actually holds, read from the stores rather than the
// cursor, so a catalogue lost locally is re-requested. A learner counts only
// when its grant matches the catalogue version; validUntil is the earlier of
// the two, so the server refreshes before either lapses offline.
export async function knownCataloguesForPull(): Promise<Partial<Record<Learner, KnownCatalogueGrant>>> {
  const known: Partial<Record<Learner, KnownCatalogueGrant>> = {};
  for (const learner of ['kiur', 'kirsi'] as const) {
    const [catalogue, grant] = await Promise.all([catalogRepo.get(learner), catalogueGrantRepo.get(learner)]);
    if (!catalogue || !grant || grant.catalogueVersion !== catalogue.version) continue;
    known[learner] = {
      catalogueVersion: catalogue.version,
      validUntil: new Date(catalogue.validUntil).getTime() <= new Date(grant.validUntil).getTime() ? catalogue.validUntil : grant.validUntil
    };
  }
  return known;
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
      knownCatalogues: await knownCataloguesForPull(),
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
    if (!bypassesRetryWait(reason) && state.status === 'retry_wait' && state.nextRetryAt && new Date(state.nextRetryAt).getTime() > Date.now()) {
      return { ok: false, reason: 'retry_wait', pushed: 0, pulled: 0 };
    }

    const pingResult = await pingServer(5_000, cycleController.signal);
    if (pingResult.status === 'unauthorized') {
      // An expired family session is not an outage: block like a 401 push so
      // the UI asks for the PIN, and keep every queued record untouched.
      const message = `ping-http-${pingResult.httpStatus}`;
      await blockRetry('auth_blocked', message);
      return { ok: false, reason: 'auth_blocked', pushed: 0, pulled: 0 };
    }
    if (pingResult.status !== 'reachable') {
      if (cycleController.signal.aborted) throw new StopSyncCycle('sync_timeout', 'timeout');
      return { ok: false, reason: 'offline', pushed: 0, pulled: 0 };
    }
    const ping = pingResult.ping;
    const protocols = responseProtocols(ping);
    const device = await deviceDescriptor();
    // "Sünkrooni nüüd" must push rows that are still backing off; otherwise a
    // manual sync bypasses the cycle-level wait but then finds nothing due.
    const dueOptions = { ignoreRetryAt: manual };
    const dueAttempts = await attemptRepo.pendingDue(MAX_DUE_RECORDS_PER_CYCLE, new Date(), dueOptions);
    const dueActions = await taskActionRepo.pendingDue(MAX_DUE_RECORDS_PER_CYCLE, new Date(), dueOptions);
    const dueRemediationActions = await remediationActionRepo.pendingDue(MAX_DUE_RECORDS_PER_CYCLE, new Date(), dueOptions);

    if (!protocols.has(2)) {
      await blockRetry('upgrade_required', 'No mutually supported offline protocol.');
      return { ok: false, reason: 'upgrade_required', pushed: 0, pulled: 0 };
    } else {
      const modernAttempts = dueAttempts.filter((row) => toV2Payload(row) !== null);
      const legacyAttempts = dueAttempts.filter((row) => toV2Payload(row) === null);
      for (const batch of chunkRecords(modernAttempts, CLIENT_ATTEMPT_BATCH_SIZE)) {
        pushed += await pushBatch(attemptOutbox, batch, device, cycleController.signal, aggregateAttempts);
      }
      // All task/remediation actions are pushed only after every attempt batch.
      for (const batch of chunkRecords(dueActions, CLIENT_ACTION_BATCH_SIZE)) {
        pushed += await pushBatch(taskActionOutbox, batch, device, cycleController.signal, aggregateActions);
      }
      for (const batch of chunkRecords(dueRemediationActions, CLIENT_ACTION_BATCH_SIZE)) {
        pushed += await pushBatch(remediationActionOutbox, batch, device, cycleController.signal, aggregateRemediationActions);
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
    // Pull requests use the same HTTP policy as every push path.  Do not turn
    // an authentication/server response into a local IndexedDB failure.
    const disposition = errorDisposition(error);
    if (disposition === 'auth_blocked' || disposition === 'upgrade_required') {
      await blockRetry(disposition, message);
      return { ok: false, reason: disposition, pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
    }
    if (disposition === 'retryable' || disposition === 'timeout') {
      await scheduleRetry(message);
      return { ok: false, reason: disposition === 'timeout' ? 'timeout' : 'retryable', pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
    }
    await blockRetry('storage_error', message).catch(() => {});
    return { ok: false, reason: 'storage_error', pushed, pulled, attemptResults: aggregateAttempts, taskActionResults: aggregateActions, remediationActionResults: aggregateRemediationActions };
  } finally {
    clearTimeout(timeout);
    lockSignal.removeEventListener('abort', onLockAbort);
  }
}

// Every finished cycle is announced in this tab, whoever started it. Result
// screens call syncNow directly; without this the provider's pending count and
// sync state stay at "Ootab sünkroonimist" until its own next trigger.
export const SYNC_COMPLETE_EVENT = 'offline-sync-complete';
export type SyncCompleteDetail = { reason: string; outcome: SyncOutcome };

function announceSyncComplete(reason: string, outcome: SyncOutcome) {
  if (typeof window === 'undefined' || typeof CustomEvent === 'undefined') return;
  try {
    window.dispatchEvent(new CustomEvent<SyncCompleteDetail>(SYNC_COMPLETE_EVENT, { detail: { reason, outcome } }));
  } catch { /* a listener failure must never fail the sync */ }
}

async function runLockedSync(reason: string): Promise<SyncOutcome> {
  try {
    const outcome = await withSyncLock((context) => runSyncCycle(reason, context.signal));
    return outcome ?? { ok: false, reason: 'locked', pushed: 0, pulled: 0 };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await blockRetry('storage_error', message).catch(() => {});
    return { ok: false, reason: 'storage_error', pushed: 0, pulled: 0 };
  }
}

// Full push-before-pull cycle guarded by a cross-tab lock. Manual sync bypasses
// backoff; background/open/visibility triggers respect it.
// A result saved while another cycle holds the lock would otherwise wait for the
// next trigger, which can be the 5-minute interval. A completion therefore waits
// for the running cycle and goes as soon as the lock is free.
const COMPLETION_REASONS = new Set(['attempt-complete', 'task-complete']);
export const LOCKED_COMPLETION_RETRY_MS = 750;
const LOCKED_COMPLETION_RETRY_LIMIT = 40;

export async function syncNow(reason: string): Promise<SyncOutcome> {
  let outcome = await runLockedSync(reason);
  for (let attempt = 0; outcome.reason === 'locked' && COMPLETION_REASONS.has(reason) && attempt < LOCKED_COMPLETION_RETRY_LIMIT; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, LOCKED_COMPLETION_RETRY_MS));
    outcome = await runLockedSync(reason);
  }
  announceSyncComplete(reason, outcome);
  return outcome;
}
