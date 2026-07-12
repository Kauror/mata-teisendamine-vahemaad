import { describe, expect, it } from 'vitest';
import {
  CLIENT_ACTION_BATCH_SIZE,
  CLIENT_ATTEMPT_BATCH_SIZE,
  SYNC_RETRY_MAX_MS,
  SYNC_RETRY_MIN_MS,
  chunkRecords,
  classifySyncHttpStatus,
  historyEpochDecision,
  isManualSync,
  retryDelayMs
} from '@/lib/offline/syncPolicy';

describe('sync HTTP failure policy', () => {
  it.each([408, 429, 500, 502, 503])('keeps HTTP %i retryable', (status) => {
    expect(classifySyncHttpStatus(status)).toBe('retryable');
  });

  it('distinguishes auth, payload, validation and upgrade failures', () => {
    expect(classifySyncHttpStatus(401)).toBe('auth_blocked');
    expect(classifySyncHttpStatus(413)).toBe('shrink_batch');
    expect(classifySyncHttpStatus(422)).toBe('record_validation');
    expect(classifySyncHttpStatus(426)).toBe('upgrade_required');
    expect(classifySyncHttpStatus(400)).toBe('terminal');
  });
});
describe('bounded retry policy', () => {
  it('starts at 15 seconds and never exceeds 30 minutes', () => {
    expect(retryDelayMs(0, () => 0)).toBe(SYNC_RETRY_MIN_MS);
    expect(retryDelayMs(0, () => 1)).toBe(Math.round(SYNC_RETRY_MIN_MS * 1.25));
    expect(retryDelayMs(99, () => 1)).toBe(SYNC_RETRY_MAX_MS);
  });

  it('only bypasses delay for an explicit manual sync', () => {
    expect(isManualSync('manual')).toBe(true);
    expect(isManualSync('manual:status-bar')).toBe(true);
    expect(isManualSync('startup')).toBe(false);
    expect(isManualSync('attempt-complete')).toBe(false);
  });
});

describe('sync batches', () => {
  it('uses the protocol v2 client limits without dropping records', () => {
    const attempts = Array.from({ length: 45 }, (_, index) => index);
    const actions = Array.from({ length: 101 }, (_, index) => index);
    expect(chunkRecords(attempts, CLIENT_ATTEMPT_BATCH_SIZE).map((batch) => batch.length)).toEqual([20, 20, 5]);
    expect(chunkRecords(actions, CLIENT_ACTION_BATCH_SIZE).map((batch) => batch.length)).toEqual([50, 50, 1]);
    expect(chunkRecords(attempts, CLIENT_ATTEMPT_BATCH_SIZE).flat()).toEqual(attempts);
  });
});

describe('history epoch safety', () => {
  it('clears confirmed history on the first 0 -> 1 reset', () => {
    expect(historyEpochDecision(0, 1)).toBe('reset_confirmed');
  });

  it('stops on epoch regression and otherwise keeps or resets safely', () => {
    expect(historyEpochDecision(4, 3)).toBe('stop_regression');
    expect(historyEpochDecision(4, 4)).toBe('keep');
    expect(historyEpochDecision(4, 7)).toBe('reset_confirmed');
  });
});
