import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { completeTaskOffline } from '@/lib/offline/api';
import { taskActionRepo } from '@/lib/offline/repositories';
import { closeOfflineDbForTests, OFFLINE_DB_NAME } from '@/lib/offline/db';
import type { LocalTaskAction } from '@/lib/offline/records';

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

function seededAction(status: LocalTaskAction['status']): LocalTaskAction {
  return {
    clientActionId: `seed-${status}`,
    deviceId: 'device-1',
    learner: 'kiur',
    actionType: 'complete',
    templateId: 1,
    templateVersion: 'v1',
    taskDate: '2026-07-12',
    snapshot: { title: 'Koda', points: 2, assignmentMode: 'shared', requiresApproval: false },
    completedAt: '2026-07-12T10:00:00.000Z',
    status,
    createdLocallyAt: '2026-07-12T10:00:00.000Z'
  };
}

const input = {
  learner: 'kiur' as const,
  templateId: 1,
  templateVersion: 'v1',
  taskDate: '2026-07-12',
  snapshot: { title: 'Koda', points: 2, assignmentMode: 'shared', requiresApproval: false }
};

describe('completeTaskOffline needs_review handling (RTM3-H04)', () => {
  it('queues a fresh completion after a needs_review action (frees the slot)', async () => {
    await taskActionRepo.put(seededAction('needs_review'));

    const result = await completeTaskOffline(input);

    // A brand-new action was queued rather than reusing the wedged one.
    expect(result.queued).toBe(true);
    expect(result.clientActionId).not.toBe('seed-needs_review');
    const all = await taskActionRepo.all();
    expect(all.filter((a) => a.templateId === 1 && a.taskDate === '2026-07-12')).toHaveLength(2);
  });

  it('does not re-queue when an action already occupies the slot', async () => {
    await taskActionRepo.put(seededAction('pending_approval'));

    const result = await completeTaskOffline(input);

    // Nothing new — the caller must not show a "saved" confirmation for this.
    expect(result.queued).toBe(false);
    expect(result.clientActionId).toBe('seed-pending_approval');
    const all = await taskActionRepo.all();
    expect(all.filter((a) => a.templateId === 1 && a.taskDate === '2026-07-12')).toHaveLength(1);
  });
});
