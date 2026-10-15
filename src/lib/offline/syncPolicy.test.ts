import { describe, expect, it } from 'vitest';
import {
  CLIENT_ACTION_BATCH_SIZE,
  CLIENT_ATTEMPT_BATCH_SIZE,
  SYNC_RETRY_MAX_MS,
  SYNC_RETRY_MIN_MS,
  SYNC_THROTTLE_MS,
  chunkRecords,
  classifySyncHttpStatus,
  historyEpochDecision,
  isManualSync,
  retryDelayMs,
  shouldRunSync,
  syncedRecently
} from '@/lib/offline/syncPolicy';
import { PENDING_FOLLOW_UP_LIMIT, shouldFollowUpPending } from '@/lib/offline/syncPolicy';

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

describe('catch-up sync throttle (OFF-06)', () => {
  const now = 1_000_000;
  const fresh = now - 30_000;

  it.each(['visibility', 'interval', 'online-event'])('skips %s within 60 s of a success with nothing pending', (reason) => {
    expect(shouldRunSync({ reason, lastSuccessAt: fresh, now, pending: 0 })).toBe(false);
  });

  it('runs once the last success is 60 s old, or when there was none / the last cycle failed', () => {
    expect(shouldRunSync({ reason: 'visibility', lastSuccessAt: now - SYNC_THROTTLE_MS, now, pending: 0 })).toBe(true);
    expect(shouldRunSync({ reason: 'visibility', lastSuccessAt: null, now, pending: 0 })).toBe(true);
  });

  it('always runs with pending rows, including an unknown count', () => {
    expect(shouldRunSync({ reason: 'visibility', lastSuccessAt: fresh, now, pending: 1 })).toBe(true);
    expect(shouldRunSync({ reason: 'interval', lastSuccessAt: fresh, now, pending: Number.POSITIVE_INFINITY })).toBe(true);
  });

  it.each(['manual', 'manual:sync-now', 'startup', 'reconnect-retry', 'attempt-complete', 'task-complete'])('always runs %s', (reason) => {
    expect(shouldRunSync({ reason, lastSuccessAt: fresh, now, pending: 0 })).toBe(true);
  });

  it('does not trust a success stamped in the future (clock change)', () => {
    expect(syncedRecently({ lastSuccessAt: now + 5_000, now, pending: 0 })).toBe(false);
  });
});

describe('follow-up sync for results still queued', () => {
  it('follows up after a successful or interrupted cycle while results wait', () => {
    expect(shouldFollowUpPending({ outcomeReason: 'ok', ok: true, pending: 1, followUps: 0 })).toBe(true);
    expect(shouldFollowUpPending({ outcomeReason: 'locked', ok: false, pending: 2, followUps: 1 })).toBe(true);
    expect(shouldFollowUpPending({ outcomeReason: 'timeout', ok: false, pending: 1, followUps: 4 })).toBe(true);
  });

  it('stops when nothing waits, after the limit, or when the server cannot take it', () => {
    expect(shouldFollowUpPending({ outcomeReason: 'ok', ok: true, pending: 0, followUps: 0 })).toBe(false);
    expect(shouldFollowUpPending({ outcomeReason: 'ok', ok: true, pending: 1, followUps: PENDING_FOLLOW_UP_LIMIT })).toBe(false);
    for (const reason of ['offline', 'auth_blocked', 'retry_wait', 'storage_error', 'upgrade_required']) {
      expect(shouldFollowUpPending({ outcomeReason: reason, ok: false, pending: 1, followUps: 0 })).toBe(false);
    }
  });
});
