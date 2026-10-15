// Pure policy helpers for the foreground sync engine. Keeping these decisions
// free of browser and IndexedDB dependencies makes retry/epoch behaviour easy
// to exhaustively test.

export const SYNC_REQUEST_TIMEOUT_MS = 20_000;
export const SYNC_RETRY_MIN_MS = 15_000;
export const SYNC_RETRY_MAX_MS = 30 * 60_000;
export const CLIENT_ATTEMPT_BATCH_SIZE = 20;
export const CLIENT_ACTION_BATCH_SIZE = 50;
export const MAX_PULL_PAGES_PER_CYCLE = 100;

export type SyncFailureDisposition =
  | 'auth_blocked'
  | 'shrink_batch'
  | 'retryable'
  | 'record_validation'
  | 'upgrade_required'
  | 'terminal';

export function classifySyncHttpStatus(status: number): SyncFailureDisposition {
  if (status === 401 || status === 403) return 'auth_blocked';
  if (status === 413) return 'shrink_batch';
  if (status === 408 || status === 429 || status >= 500) return 'retryable';
  if (status === 422) return 'record_validation';
  if (status === 426) return 'upgrade_required';
  return 'terminal';
}

// Bounded exponential backoff with positive jitter. The first retry is never
// sooner than 15 seconds and every later delay is capped at 30 minutes.
export function retryDelayMs(retryCount: number, random = Math.random): number {
  const exponent = Math.max(0, Math.min(30, Math.trunc(retryCount)));
  const base = Math.min(SYNC_RETRY_MAX_MS, SYNC_RETRY_MIN_MS * 2 ** exponent);
  const randomValue = Math.max(0, Math.min(1, random()));
  return Math.min(SYNC_RETRY_MAX_MS, Math.round(base * (1 + randomValue * 0.25)));
}

export function isManualSync(reason: string): boolean {
  return reason === 'manual' || reason.startsWith('manual:');
}

// A result the child has just finished goes now, like a manual sync: the retry
// delay exists to spare an unreachable server from background triggers, and a
// stale delay (left, say, by a request the page cancelled on its way out) must
// not hold a fresh result back for up to half an hour.
export function bypassesRetryWait(reason: string): boolean {
  return isManualSync(reason) || reason === 'attempt-complete' || reason === 'task-complete';
}

export function chunkRecords<T>(records: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) throw new Error('Batch size must be a positive integer.');
  const chunks: T[][] = [];
  for (let offset = 0; offset < records.length; offset += size) {
    chunks.push(records.slice(offset, offset + size));
  }
  return chunks;
}

export type HistoryEpochDecision = 'keep' | 'reset_confirmed' | 'stop_regression';

// A server epoch increment invalidates confirmed cached history even for the
// first 0 -> 1 reset. Pending/review work lives in a different store and is not
// affected. A regression is never silently accepted because it can resurrect
// history deleted on another device.
export function historyEpochDecision(localEpoch: number, serverEpoch: number): HistoryEpochDecision {
  if (!Number.isSafeInteger(localEpoch) || localEpoch < 0) throw new Error('Invalid local history epoch.');
  if (!Number.isSafeInteger(serverEpoch) || serverEpoch < 0) throw new Error('Invalid server history epoch.');
  if (serverEpoch < localEpoch) return 'stop_regression';
  if (serverEpoch > localEpoch) return 'reset_confirmed';
  return 'keep';
}

// OFF-06: catch-up triggers (tab back in view, the periodic interval, the
// browser's 'online' event) fire often on a phone. When the last cycle in this
// page succeeded under a minute ago and nothing is waiting locally, another
// ping + pull adds nothing, so those triggers are skipped. Manual syncs, any
// other reason (startup, reconnect retries, result screens) and any pending
// row (attempts, task actions, remediation) always run.
export const SYNC_THROTTLE_MS = 60_000;
const THROTTLED_SYNC_REASONS: ReadonlySet<string> = new Set(['visibility', 'interval', 'online-event']);

export type SyncThrottleInput = {
  // Date.now() when the most recent finished cycle ended successfully; null
  // when there was none yet or a later cycle failed / the device went offline.
  lastSuccessAt: number | null;
  now: number;
  // Locally queued rows; a failed read must be passed as Infinity, not 0.
  pending: number;
};

export function syncedRecently({ lastSuccessAt, now, pending }: SyncThrottleInput): boolean {
  if (pending !== 0 || lastSuccessAt === null || !Number.isFinite(lastSuccessAt)) return false;
  const age = now - lastSuccessAt;
  return age >= 0 && age < SYNC_THROTTLE_MS;
}

export function shouldRunSync(input: SyncThrottleInput & { reason: string }): boolean {
  if (isManualSync(input.reason) || !THROTTLED_SYNC_REASONS.has(input.reason)) return true;
  return !syncedRecently(input);
}

// A cycle can end with results still queued: a navigation aborted the push
// (WebKit cancels in-flight requests on a page change), or the rows were
// mid-lease when it started. Nothing else would send them before the next
// trigger, which can be minutes away, so a short follow-up goes — a few times
// at most, so rows that are backing off never cause a loop.
export const PENDING_FOLLOW_UP_MS = 3_000;
export const PENDING_FOLLOW_UP_LIMIT = 5;

export function shouldFollowUpPending(input: { outcomeReason: string; ok: boolean; pending: number; followUps: number }) {
  if (input.pending <= 0 || input.followUps >= PENDING_FOLLOW_UP_LIMIT) return false;
  // No point while the server is unreachable, the session expired or the
  // device needs attention: those have their own recovery paths.
  return input.ok || input.outcomeReason === 'locked' || input.outcomeReason === 'timeout' || input.outcomeReason === 'unknown';
}
