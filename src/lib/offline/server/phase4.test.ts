import { describe, it, expect, beforeEach } from 'vitest';
import db from '@/lib/db';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { getCurrentCatalogue } from '@/lib/offline/server/catalogVersions';
import { getHistoryEpoch, getTombstonesAfter } from '@/lib/offline/server/tombstones';
import { computeExpectedStudyTotal, reconcileStudyRewards } from '@/lib/offline/server/reconcile';
import { deleteAllHistory, deleteAttempt } from '@/lib/historyMaintenance';
import { getBalance } from '@/lib/tasks';

function reset() {
  db.pragma('foreign_keys = OFF');
  db.exec('DELETE FROM point_ledger; DELETE FROM study_attempt_rewards; DELETE FROM streak_bonus_awards; DELETE FROM reward_rule_awards; DELETE FROM mistake_pool; DELETE FROM attempts; DELETE FROM daily_leaderboard; DELETE FROM attempt_tombstones; DELETE FROM reconciliation_audits;');
  db.pragma('foreign_keys = ON');
}
beforeEach(reset);

function offlineAttempt(clientAttemptId: string, completedAt: string, score = 14) {
  const catalogue = getCurrentCatalogue('kiur');
  return insertAttempt({
    clientAttemptId, deviceId: 'device-1', learner: 'kiur', subject: 'matemaatika', topic: 'korrutamine',
    category: 'Korrutamine', difficulty: 'Lihtne', questionCount: 15, score, elapsedSeconds: 100, questions: [],
    startedAt: completedAt, completedAt, rawDeviceCompletedAt: completedAt, catalogueVersion: catalogue.version,
    clientTimeZone: 'Europe/Tallinn', clientUtcOffsetMinutes: 180
  });
}

describe('tombstones + history epoch', () => {
  it('deleting an attempt writes a tombstone and preserves the balance', () => {
    const created = offlineAttempt('t-1', '2026-06-10T09:00:00.000Z');
    const balanceBefore = getBalance('kiur');
    expect(balanceBefore).toBeGreaterThan(0);

    const removed = deleteAttempt(created.serverAttemptId!);
    expect(removed).toBe(1);

    // Stars earned are intentionally NOT reversed by deletion.
    expect(getBalance('kiur')).toBe(balanceBefore);

    const tombstones = getTombstonesAfter(0);
    expect(tombstones).toHaveLength(1);
    expect(tombstones[0].serverAttemptId).toBe(created.serverAttemptId);
    expect(tombstones[0].clientAttemptId).toBe('t-1');
  });

  it('serves tombstones incrementally by cursor', () => {
    const a = offlineAttempt('t-a', '2026-06-10T09:00:00.000Z');
    const b = offlineAttempt('t-b', '2026-06-10T10:00:00.000Z');
    deleteAttempt(a.serverAttemptId!);
    const first = getTombstonesAfter(0);
    expect(first).toHaveLength(1);
    deleteAttempt(b.serverAttemptId!);
    const afterCursor = getTombstonesAfter(first[0].tombstoneId);
    expect(afterCursor).toHaveLength(1);
    expect(afterCursor[0].clientAttemptId).toBe('t-b');
  });

  it('bumps the history epoch on delete-all', () => {
    offlineAttempt('t-x', '2026-06-10T09:00:00.000Z');
    const before = getHistoryEpoch();
    deleteAllHistory();
    expect(getHistoryEpoch()).toBe(before + 1);
  });
});

describe('reconciliation (shadow mode)', () => {
  it('computes the same expected total regardless of insertion order', () => {
    offlineAttempt('r-a', '2026-06-11T08:00:00.000Z');
    offlineAttempt('r-b', '2026-06-11T09:00:00.000Z');
    offlineAttempt('r-c', '2026-06-11T10:00:00.000Z');
    const forward = computeExpectedStudyTotal('kiur', '2026-06-01');

    reset();
    offlineAttempt('r-c', '2026-06-11T10:00:00.000Z');
    offlineAttempt('r-a', '2026-06-11T08:00:00.000Z');
    offlineAttempt('r-b', '2026-06-11T09:00:00.000Z');
    const reverse = computeExpectedStudyTotal('kiur', '2026-06-01');

    // The deterministic expected total is independent of the order attempts were
    // synced/inserted in — the whole point of reconciliation.
    expect(reverse.expectedTotal).toBe(forward.expectedTotal);
    expect(forward.expectedTotal).toBeCloseTo(2.7, 5); // 1.0 + 0.9 + 0.8 (decayed)
    // Backdated attempts were over-awarded (decay mis-bucketed at award time), so
    // the reconciler correctly detects a downward drift vs the immediate awards.
    expect(forward.actualTotal).toBeGreaterThan(forward.expectedTotal);
  });

  it('records an audit and changes NO stars in shadow mode', () => {
    offlineAttempt('s-1', '2026-06-12T08:00:00.000Z');
    const balanceBefore = getBalance('kiur');
    const ledgerBefore = (db.prepare('SELECT COUNT(*) AS c FROM point_ledger').get() as { c: number }).c;
    const auditsBefore = (db.prepare('SELECT COUNT(*) AS c FROM reconciliation_audits').get() as { c: number }).c;

    const audit = reconcileStudyRewards('kiur', '2026-06-01', 'test');
    expect(audit.mode).toBe('shadow');

    // One more audit row recorded.
    expect((db.prepare('SELECT COUNT(*) AS c FROM reconciliation_audits').get() as { c: number }).c).toBe(auditsBefore + 1);
    // Shadow mode: no ledger entry added, balance unchanged, no adjustment.
    expect((db.prepare('SELECT COUNT(*) AS c FROM point_ledger').get() as { c: number }).c).toBe(ledgerBefore);
    expect(getBalance('kiur')).toBe(balanceBefore);
    expect((db.prepare("SELECT COUNT(*) AS c FROM point_ledger WHERE source = 'reconciliation_adjustment'").get() as { c: number }).c).toBe(0);
  });

  it('records a shadow audit automatically when a late attempt arrives', () => {
    // A back-dated attempt (past Tallinn day) triggers the reconciliation audit.
    offlineAttempt('late-1', '2026-06-13T08:00:00.000Z');
    const audits = db.prepare("SELECT COUNT(*) AS c FROM reconciliation_audits WHERE trigger = 'late_attempt'").get() as { c: number };
    expect(audits.c).toBeGreaterThanOrEqual(1);
  });
});
