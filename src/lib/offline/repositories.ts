import { offlineDb } from '@/lib/offline/db';
import type { ConfirmedAttempt, LocalAttempt, LocalSession, LocalTaskAction, TaskTemplateRecord } from '@/lib/offline/records';
import type { ChildDashboardSnapshot, Learner, OfflineCatalogue } from '@/lib/shared/types';

// Small, responsibility-separated repositories over the IndexedDB stores. The UI
// and sync engine talk to these, never to raw IndexedDB.

export const catalogRepo = {
  async put(catalogue: OfflineCatalogue) {
    const db = await offlineDb();
    await db.put('catalogues', catalogue);
  },
  async get(learner: Learner): Promise<OfflineCatalogue | undefined> {
    const db = await offlineDb();
    return db.get('catalogues', learner);
  },
  async all(): Promise<OfflineCatalogue[]> {
    const db = await offlineDb();
    return db.getAll('catalogues');
  }
};

export const snapshotRepo = {
  async put(snapshot: ChildDashboardSnapshot) {
    const db = await offlineDb();
    await db.put('snapshots', snapshot);
  },
  async get(learner: Learner): Promise<ChildDashboardSnapshot | undefined> {
    const db = await offlineDb();
    return db.get('snapshots', learner);
  }
};

export const sessionRepo = {
  async put(session: LocalSession) {
    const db = await offlineDb();
    await db.put('sessions', session);
  },
  async get(sessionId: string): Promise<LocalSession | undefined> {
    const db = await offlineDb();
    return db.get('sessions', sessionId);
  },
  async delete(sessionId: string) {
    const db = await offlineDb();
    await db.delete('sessions', sessionId);
  },
  async all(): Promise<LocalSession[]> {
    const db = await offlineDb();
    return db.getAll('sessions');
  }
};

export const attemptRepo = {
  async put(attempt: LocalAttempt) {
    const db = await offlineDb();
    await db.put('attempts', attempt);
  },
  async get(clientAttemptId: string): Promise<LocalAttempt | undefined> {
    const db = await offlineDb();
    return db.get('attempts', clientAttemptId);
  },
  async all(): Promise<LocalAttempt[]> {
    const db = await offlineDb();
    return db.getAll('attempts');
  },
  async pending(): Promise<LocalAttempt[]> {
    const all = await this.all();
    return all.filter((a) => a.status === 'pending' || a.status === 'syncing');
  },
  async delete(clientAttemptId: string) {
    const db = await offlineDb();
    await db.delete('attempts', clientAttemptId);
  }
};

export const historyRepo = {
  async putMany(rows: ConfirmedAttempt[]) {
    const db = await offlineDb();
    const tx = db.transaction('history', 'readwrite');
    await Promise.all(rows.map((row) => tx.store.put(row)));
    await tx.done;
  },
  async recent(limit = 50): Promise<ConfirmedAttempt[]> {
    const db = await offlineDb();
    const all = await db.getAll('history');
    return all.sort((a, b) => (b.createdAt < a.createdAt ? -1 : 1)).slice(0, limit);
  },
  async get(id: number): Promise<ConfirmedAttempt | undefined> {
    const db = await offlineDb();
    return db.get('history', id);
  },
  async findByClientId(clientAttemptId: string): Promise<ConfirmedAttempt | undefined> {
    const db = await offlineDb();
    const all = await db.getAll('history');
    return all.find((row) => row.clientAttemptId === clientAttemptId);
  },
  async delete(id: number) {
    const db = await offlineDb();
    await db.delete('history', id);
  },
  async deleteByClientId(clientAttemptId: string) {
    const db = await offlineDb();
    const all = await db.getAll('history');
    const match = all.find((row) => row.clientAttemptId === clientAttemptId);
    if (match) await db.delete('history', match.id);
  },
  async clear() {
    const db = await offlineDb();
    await db.clear('history');
  }
};

export const taskTemplateRepo = {
  async replaceAll(templates: TaskTemplateRecord[]) {
    const db = await offlineDb();
    const tx = db.transaction('taskTemplates', 'readwrite');
    await tx.store.clear();
    await Promise.all(templates.map((template) => tx.store.put(template)));
    await tx.done;
  },
  async all(): Promise<TaskTemplateRecord[]> {
    const db = await offlineDb();
    return db.getAll('taskTemplates');
  }
};

export const taskActionRepo = {
  async put(action: LocalTaskAction) {
    const db = await offlineDb();
    await db.put('taskActions', action);
  },
  async get(clientActionId: string): Promise<LocalTaskAction | undefined> {
    const db = await offlineDb();
    return db.get('taskActions', clientActionId);
  },
  async all(): Promise<LocalTaskAction[]> {
    const db = await offlineDb();
    return db.getAll('taskActions');
  },
  async pending(): Promise<LocalTaskAction[]> {
    const all = await this.all();
    return all.filter((a) => a.status === 'pending' || a.status === 'syncing');
  },
  async delete(clientActionId: string) {
    const db = await offlineDb();
    await db.delete('taskActions', clientActionId);
  }
};
