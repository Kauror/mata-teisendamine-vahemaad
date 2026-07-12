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
