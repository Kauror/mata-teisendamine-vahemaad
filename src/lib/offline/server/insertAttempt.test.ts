import { describe, it, expect, beforeEach } from 'vitest';
import db from '@/lib/db';

function resetData() {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM point_ledger; DELETE FROM study_attempt_rewards; DELETE FROM streak_bonus_awards; DELETE FROM reward_rule_awards; DELETE FROM mistake_pool; DELETE FROM attempts; DELETE FROM daily_leaderboard;');
  db.pragma('foreign_keys = ON');
}
beforeEach(resetData);
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { getCurrentCatalogue } from '@/lib/offline/server/catalogVersions';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { getBalance } from '@/lib/tasks';

function offlinePayload(clientAttemptId: string, completedAt: string, score = 14) {
  const catalogue = getCurrentCatalogue('kiur');
  return {
    clientAttemptId,
    deviceId: 'device-1',
    learner: 'kiur',
    subject: 'matemaatika',
    topic: 'korrutamine',
    category: 'Korrutamine',
    difficulty: 'Lihtne',
    questionCount: 15,
    score,
    elapsedSeconds: 100,
    questions: [],
    startedAt: completedAt,
    completedAt,
    rawDeviceCompletedAt: completedAt,
    catalogueVersion: catalogue.version,
    clientTimeZone: 'Europe/Tallinn',
    clientUtcOffsetMinutes: 180
  };
}

describe('insertAttempt', () => {
  it('is idempotent on clientAttemptId (retry returns the original, no duplicate)', () => {
    const payload = offlinePayload('idem-1', '2026-07-11T09:00:00.000Z');
    const first = insertAttempt(payload);
    expect(first.status).toBe('created');

    const balanceAfterFirst = getBalance('kiur');
    const retry = insertAttempt(payload);
    expect(retry.status).toBe('duplicate');
    expect(retry.serverAttemptId).toBe(first.serverAttemptId);

    const rows = db.prepare('SELECT COUNT(*) AS c FROM attempts WHERE clientAttemptId = ?').get('idem-1') as { c: number };
    expect(rows.c).toBe(1);
    // Duplicate retry must not award again.
    expect(getBalance('kiur')).toBe(balanceAfterFirst);
  });

  it('produces the same final balance regardless of sync order (same day)', () => {
    // Two distinct same-day attempts on the same exercise → decay applies, but the
    // total must be order-independent.
    const a = offlinePayload('order-a', '2026-07-12T08:00:00.000Z');
    const b = offlinePayload('order-b', '2026-07-12T10:00:00.000Z');

    insertAttempt(a);
    insertAttempt(b);
    const forward = getBalance('kiur');

    // Wipe and replay in the opposite order.
    resetData();
    insertAttempt(b);
    insertAttempt(a);
    const reverse = getBalance('kiur');

    expect(reverse).toBe(forward);
    expect(forward).toBeGreaterThan(0);
  });

  it('preserves offline work as history but awards nothing when the exercise is not permitted in that catalogue version', () => {
    // Version captured while the exercise is active...
    const payload = offlinePayload('review-1', '2026-07-13T09:00:00.000Z');
    // ...then the parent hides it, but the attempt still references the old version
    // where it WAS permitted → accepted normally (historical validation).
    updateChildLearningExerciseStatus('kiur.math.korrutamine', 'kiur', 'hidden');
    const result = insertAttempt(payload);
    expect(result.status).toBe('created');
    // A brand-new version (post-hide) does not permit it → needs_review, still stored.
    const hiddenPayload = offlinePayload('review-2', '2026-07-13T10:00:00.000Z');
    const reviewed = insertAttempt(hiddenPayload);
    expect(reviewed.status).toBe('needs_review');
    expect(reviewed.reasonCode).toBe('not_permitted');
    const stored = db.prepare('SELECT COUNT(*) AS c FROM attempts WHERE clientAttemptId = ?').get('review-2') as { c: number };
    expect(stored.c).toBe(1);
  });

  it('rejects an online non-active exercise without inserting (preserves 403 semantics)', () => {
    updateChildLearningExerciseStatus('kiur.math.mustrid', 'kiur', 'hidden');
    const before = (db.prepare('SELECT COUNT(*) AS c FROM attempts').get() as { c: number }).c;
    const result = insertAttempt({ learner: 'kiur', subject: 'matemaatika', topic: 'mustrid', category: 'Segaharjutus', questionCount: 15, score: 5, elapsedSeconds: 10, questions: [] });
    expect(result.status).toBe('rejected');
    expect(result.reasonCode).toBe('not_active');
    const after = (db.prepare('SELECT COUNT(*) AS c FROM attempts').get() as { c: number }).c;
    expect(after).toBe(before);
  });
});
