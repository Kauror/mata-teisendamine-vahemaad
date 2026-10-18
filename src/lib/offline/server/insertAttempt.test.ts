import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { cid, FIXTURE_DEVICE_ID, FIXTURE_EXERCISE as EXERCISE, resetAttemptData as resetData, serveGrant, v2Attempt } from '@/lib/offline/server/v2AttemptFixture';
import { getBalance } from '@/lib/tasks';
import { getLearningPointSettings, updateLearningPointSettings } from '@/lib/learningPoints';
import { runSyncPullV2 } from '@/lib/offline/server/syncService';
import { approveHeldRewardAttempt } from '@/lib/server/rewards/projection';

// insertAttempt only ever writes protocol-v2 attempts (its one production
// caller is the v2 sync push), so every case here is a real v2 submission.

beforeAll(() => {
  process.env.OFFLINE_PROTOCOL_V2_ENABLED = '1';
  vi.useFakeTimers({ toFake: ['Date'] });
});
afterAll(() => {
  vi.useRealTimers();
});
beforeEach(() => {
  resetData();
  updateChildLearningExerciseStatus(EXERCISE, 'kiur', 'permanent');
});

describe('insertAttempt', () => {
  it('is idempotent on clientAttemptId (retry returns the original, no duplicate)', () => {
    const payload = v2Attempt(serveGrant(), 'idem-1', '2026-07-12T09:00:00.000Z');
    const first = insertAttempt(payload);
    expect(first.status).toBe('created');

    const balanceAfterFirst = getBalance('kiur');
    expect(balanceAfterFirst).toBeGreaterThan(0);
    const retry = insertAttempt(payload);
    expect(retry.status).toBe('duplicate');
    expect(retry.serverAttemptId).toBe(first.serverAttemptId);

    const rows = db.prepare('SELECT COUNT(*) AS c FROM attempts WHERE clientAttemptId = ?').get(cid('idem-1')) as { c: number };
    expect(rows.c).toBe(1);
    // Duplicate retry must not award again.
    expect(getBalance('kiur')).toBe(balanceAfterFirst);
  });

  it('holds a reused clientAttemptId with different data for review', () => {
    const served = serveGrant();
    const first = insertAttempt(v2Attempt(served, 'conflict-1', '2026-07-12T09:00:00.000Z', 14));
    const changed = insertAttempt(v2Attempt(served, 'conflict-1', '2026-07-12T09:00:00.000Z', 10));
    expect(changed).toMatchObject({ status: 'needs_review', serverAttemptId: first.serverAttemptId, reasonCode: 'attempt_id_conflict' });
  });

  it('produces the same final balance regardless of sync order (same day)', () => {
    // Two distinct same-day attempts on the same exercise: decay applies, but
    // the total must be order-independent.
    let served = serveGrant();
    insertAttempt(v2Attempt(served, 'order-a', '2026-07-12T08:00:00.000Z'));
    insertAttempt(v2Attempt(served, 'order-b', '2026-07-12T10:00:00.000Z'));
    const forward = getBalance('kiur');

    // Wipe and replay in the opposite order.
    resetData();
    served = serveGrant();
    insertAttempt(v2Attempt(served, 'order-b', '2026-07-12T10:00:00.000Z'));
    insertAttempt(v2Attempt(served, 'order-a', '2026-07-12T08:00:00.000Z'));
    const reverse = getBalance('kiur');

    expect(reverse).toBe(forward);
    expect(forward).toBeGreaterThan(0);
  });

  it('keeps an attempt whose exercise the catalogue version no longer permits, without a reward', () => {
    // Captured while the exercise is active: accepted against that version.
    const before = serveGrant();
    expect(insertAttempt(v2Attempt(before, 'review-1', '2026-07-12T09:00:00.000Z')).status).toBe('created');

    // The parent hides it; a version served afterwards does not permit it.
    updateChildLearningExerciseStatus(EXERCISE, 'kiur', 'hidden');
    const after = serveGrant();
    expect(after.catalogue.version).not.toBe(before.catalogue.version);
    const balance = getBalance('kiur');
    const reviewed = insertAttempt(v2Attempt({ ...after, catalogue: { ...after.catalogue, entries: before.catalogue.entries } }, 'review-2', '2026-07-12T10:00:00.000Z'));
    expect(reviewed).toMatchObject({ status: 'needs_review', reasonCode: 'not_permitted' });
    const stored = db.prepare('SELECT rewardSettlementStatus, reviewReasonCode FROM attempts WHERE clientAttemptId = ?').get(cid('review-2'));
    expect(stored).toEqual({ rewardSettlementStatus: 'needs_review', reviewReasonCode: 'not_permitted' });
    expect(getBalance('kiur')).toBe(balance);
  });
});

// The runner stamps the reward policy when the exercise starts; a parent's
// settings edit plus a background pull mid-run refreshes the device's grant.
describe('a reward policy edit during a run', () => {
  it('keeps the finished attempt and holds it for the parent instead of rejecting it', () => {
    const served = serveGrant();
    const original = getLearningPointSettings();
    try {
      updateLearningPointSettings({ ...original, dailyCap: original.dailyCap + 2 });
      // The device syncs (pull) while the exercise is still open.
      runSyncPullV2({
        protocolVersion: 2,
        phase: 'pull',
        device: { deviceId: FIXTURE_DEVICE_ID, appVersion: 'insert-attempt-test', timeZone: 'Europe/Tallinn', clientNow: new Date().toISOString() },
        cursor: { lastServerAttemptId: 0, lastTombstoneId: 0, lastTaskChangeId: 0, lastRemediationChangeId: 0, lastAttemptChangeId: 0, historyEpoch: 0, catalogueVersions: { kiur: served.catalogue.version } },
        knownCatalogues: { kiur: { catalogueVersion: served.catalogue.version, validUntil: served.grant.validUntil } }
      });

      const payload = v2Attempt(served, 'policy-mid-run', '2026-07-14T11:59:00.000Z');
      const result = insertAttempt(payload);
      expect(result).toMatchObject({ status: 'needs_review', reasonCode: 'reward_policy_changed' });
      const stored = db.prepare('SELECT id, rewardSettlementStatus, rewardPolicyVersion FROM attempts WHERE clientAttemptId = ?').get(cid('policy-mid-run')) as { id: number; rewardSettlementStatus: string; rewardPolicyVersion: string };
      expect(stored.rewardSettlementStatus).toBe('needs_review');
      expect(stored.rewardPolicyVersion).toBe(served.grant.rewardPolicyVersion);
      expect(getBalance('kiur')).toBe(0);

      // A retry is a duplicate; the parent's approval settles it under the
      // policy the child started with.
      expect(insertAttempt(payload).status).toBe('duplicate');
      approveHeldRewardAttempt(stored.id);
      expect(getBalance('kiur')).toBe(1);

      // Any other metadata drift is still refused.
      const forged = { ...v2Attempt(served, 'policy-forged', '2026-07-14T11:59:30.000Z'), rewardPolicyVersion: 'rp2-not-a-real-policy' };
      expect(insertAttempt(forged)).toMatchObject({ status: 'rejected', reasonCode: 'metadata_mismatch' });
    } finally {
      updateLearningPointSettings(original);
    }
  });
});
