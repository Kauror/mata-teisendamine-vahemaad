import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { getHistoryEpoch, getTombstonesAfter } from '@/lib/offline/server/tombstones';
import { cid, FIXTURE_EXERCISE, resetAttemptData, serveGrant, v2Attempt } from '@/lib/offline/server/v2AttemptFixture';
import { deleteAllHistory, deleteAttempt } from '@/lib/historyMaintenance';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { getBalance } from '@/lib/tasks';

beforeAll(() => {
  process.env.OFFLINE_PROTOCOL_V2_ENABLED = '1';
  vi.useFakeTimers({ toFake: ['Date'] });
});
afterAll(() => {
  vi.useRealTimers();
});
beforeEach(() => {
  resetAttemptData();
  updateChildLearningExerciseStatus(FIXTURE_EXERCISE, 'kiur', 'permanent');
});

function offlineAttempt(label: string, completedAt: string) {
  return insertAttempt(v2Attempt(serveGrant(), label, completedAt));
}

describe('tombstones + history epoch', () => {
  it('deleting an attempt writes a tombstone and preserves the balance', () => {
    const created = offlineAttempt('t-1', '2026-07-12T09:00:00.000Z');
    const balanceBefore = getBalance('kiur');
    expect(balanceBefore).toBeGreaterThan(0);

    const removed = deleteAttempt(created.serverAttemptId!);
    expect(removed).toBe(1);

    // Stars earned are intentionally NOT reversed by deletion.
    expect(getBalance('kiur')).toBe(balanceBefore);

    const tombstones = getTombstonesAfter(0);
    expect(tombstones).toHaveLength(1);
    expect(tombstones[0].serverAttemptId).toBe(created.serverAttemptId);
    expect(tombstones[0].clientAttemptId).toBe(cid('t-1'));
  });

  it('serves tombstones incrementally by cursor', () => {
    const a = offlineAttempt('t-a', '2026-07-12T09:00:00.000Z');
    const b = offlineAttempt('t-b', '2026-07-12T10:00:00.000Z');
    deleteAttempt(a.serverAttemptId!);
    const first = getTombstonesAfter(0);
    expect(first).toHaveLength(1);
    deleteAttempt(b.serverAttemptId!);
    const afterCursor = getTombstonesAfter(first[0].tombstoneId);
    expect(afterCursor).toHaveLength(1);
    expect(afterCursor[0].clientAttemptId).toBe(cid('t-b'));
  });

  it('bumps the history epoch on delete-all', () => {
    offlineAttempt('t-x', '2026-07-12T09:00:00.000Z');
    const before = getHistoryEpoch();
    deleteAllHistory();
    expect(getHistoryEpoch()).toBe(before + 1);
  });
});
