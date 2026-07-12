import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { applySyncEnvelope } from '@/lib/offline/syncApply';
import { taskAssignmentRepo } from '@/lib/offline/repositories';
import { closeOfflineDbForTests, OFFLINE_DB_NAME } from '@/lib/offline/db';
import type { OfflineSyncPullDataV2 } from '@/lib/shared/types';

async function resetDatabase() {
  await closeOfflineDbForTests();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(OFFLINE_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
}

afterEach(resetDatabase);

function envelope(taskAssignments: unknown[]): Parameters<typeof applySyncEnvelope>[0] {
  const pull: OfflineSyncPullDataV2 = {
    attempts: [],
    tombstones: [],
    taskChanges: [],
    remediationChanges: [],
    taskAssignments
  };
  return { serverTime: '2026-07-12T10:00:00.000Z', pull };
}

function assignment(assignmentId: string, templateId: number, taskDate: string, state = 'assigned') {
  return { assignmentId, learner: 'kiur', taskDate, templateId, state, updatedAt: '2026-07-12T10:00:00.000Z' };
}

describe('task assignment snapshot replacement (RTM3-H05)', () => {
  it('replaces obsolete assignment ids for a date after a template edit', async () => {
    const today = '2026-07-12';
    // First sync: the original assignment for template 1.
    await applySyncEnvelope(envelope([assignment('old-assignment', 1, today)]));

    // A parent edits the template: the server deletes the old instance/assignment
    // and materialises a new one with a NEW id for the same template + date.
    await applySyncEnvelope(envelope([assignment('new-assignment', 1, today)]));

    const rows = await taskAssignmentRepo.forLearner('kiur');
    const forToday = rows.filter((row) => row.taskDate === today && row.templateId === 1);
    // The stale id must be gone, leaving exactly the authoritative assignment, so
    // the offline read cannot pick the obsolete row.
    expect(forToday.map((row) => row.assignmentId)).toEqual(['new-assignment']);
  });

  it('preserves assignments for dates not present in the response', async () => {
    const today = '2026-07-12';
    const tomorrow = '2026-07-13';
    await applySyncEnvelope(envelope([assignment('today-1', 1, today), assignment('tomorrow-1', 1, tomorrow)]));

    // A later snapshot only covers today; tomorrow must be left untouched.
    await applySyncEnvelope(envelope([assignment('today-2', 1, today)]));

    const rows = await taskAssignmentRepo.forLearner('kiur');
    expect(rows.find((row) => row.taskDate === tomorrow)?.assignmentId).toBe('tomorrow-1');
    expect(rows.filter((row) => row.taskDate === today).map((row) => row.assignmentId)).toEqual(['today-2']);
  });
});
