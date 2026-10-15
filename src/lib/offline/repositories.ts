import type { DBSchema, IDBPDatabase } from 'idb';
import { offlineDb, withStorageHealth } from '@/lib/offline/db';
import type {
  AnyLocalSession,
  ConfirmedAttempt,
  LocalAttempt,
  LocalTaskAction,
  PreparedRemediationBundle,
  RunnerSessionV3,
  TaskAssignmentRecord,
  TaskTemplateRecord
} from '@/lib/offline/records';
import type { CatalogueGrant, ChildDashboardSnapshot, Learner, OfflineCatalogue } from '@/lib/shared/types';

// Small, responsibility-separated repositories over the IndexedDB stores. The UI
// and sync engine talk to these, never to raw IndexedDB.

// A manual sync ("Sünkrooni nüüd") pushes rows that are still backing off.
export type PendingDueOptions = { ignoreRetryAt?: boolean };

// ---- Outbox stores ----
//
// Every locally created record the server must settle (attempts, task actions)
// lives in an outbox store with the same lifecycle:
// 'pending' -> 'syncing' under a short lease -> settled by the server's
// acknowledgement, or back to 'pending' with a retry time. Expired leases (a
// tab that died mid-push) are returned to 'pending' at the start of a cycle.

export type OutboxStoreName = 'attempts' | 'taskActions';

export type OutboxRecord = {
  status: string;
  syncLeaseUntil?: string;
  nextRetryAt?: string;
  retryCount?: number;
  lastError?: string;
};

// The three stores share this shape; typing the database through it keeps the
// generic code free of per-store casts.
type OutboxStoreSchema = { key: string; value: OutboxRecord; indexes: { byStatus: string } };
interface OutboxSchema extends DBSchema {
  attempts: OutboxStoreSchema;
  taskActions: OutboxStoreSchema;
}

async function outboxDb(): Promise<IDBPDatabase<OutboxSchema>> {
  return (await offlineDb()) as unknown as IDBPDatabase<OutboxSchema>;
}

export type OutboxRepo<Row> = {
  storeName: OutboxStoreName;
  idOf(row: Row): string;
  pendingCount(): Promise<number>;
  pendingDue(limit: number, now?: Date, options?: PendingDueOptions): Promise<Row[]>;
  recoverExpiredSyncing(now?: Date): Promise<number>;
  markSyncing(ids: string[], leaseUntil: string): Promise<void>;
  returnPending(ids: string[], error: string, nextRetryAt?: string): Promise<void>;
};

export function outboxRepo<Row extends OutboxRecord>(storeName: OutboxStoreName, idKey: keyof Row & string): OutboxRepo<Row> {
  return {
    storeName,
    idOf: (row) => String(row[idKey]),
    async pendingCount() {
      const db = await outboxDb();
      const [pending, syncing] = await Promise.all([
        db.countFromIndex(storeName, 'byStatus', 'pending'),
        db.countFromIndex(storeName, 'byStatus', 'syncing')
      ]);
      return pending + syncing;
    },
    async pendingDue(limit, now = new Date(), options = {}) {
      const db = await outboxDb();
      const nowMs = now.getTime();
      const tx = db.transaction(storeName);
      const rows: Row[] = [];
      let cursor = await tx.store.index('byStatus').openCursor('pending');
      while (cursor && rows.length < limit) {
        if (options.ignoreRetryAt || !cursor.value.nextRetryAt || new Date(cursor.value.nextRetryAt).getTime() <= nowMs) rows.push(cursor.value as Row);
        cursor = await cursor.continue();
      }
      await tx.done;
      return rows;
    },
    async recoverExpiredSyncing(now = new Date()) {
      const db = await outboxDb();
      const rows = await db.getAllFromIndex(storeName, 'byStatus', 'syncing');
      const expired = rows.filter((row) => !row.syncLeaseUntil || new Date(row.syncLeaseUntil).getTime() <= now.getTime());
      if (!expired.length) return 0;
      const tx = db.transaction(storeName, 'readwrite');
      await Promise.all(expired.map((row) => tx.store.put({ ...row, status: 'pending', syncLeaseUntil: undefined })));
      await tx.done;
      return expired.length;
    },
    async markSyncing(ids, leaseUntil) {
      const db = await outboxDb();
      const tx = db.transaction(storeName, 'readwrite');
      for (const id of ids) {
        const row = await tx.store.get(id);
        if (row?.status === 'pending') await tx.store.put({ ...row, status: 'syncing', syncLeaseUntil: leaseUntil });
      }
      await tx.done;
    },
    // Every return counts as a retry. Task actions written before this was
    // shared have no retryCount yet, hence the fallback.
    async returnPending(ids, error, nextRetryAt) {
      const db = await outboxDb();
      const tx = db.transaction(storeName, 'readwrite');
      for (const id of ids) {
        const row = await tx.store.get(id);
        if (row?.status === 'syncing') {
          await tx.store.put({ ...row, status: 'pending', syncLeaseUntil: undefined, lastError: error, nextRetryAt, retryCount: (row.retryCount ?? 0) + 1 });
        }
      }
      await tx.done;
    }
  };
}

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
  async put(session: AnyLocalSession) {
    const db = await offlineDb();
    await withStorageHealth(() => db.put('sessions', session));
  },
  async get(sessionId: string): Promise<AnyLocalSession | undefined> {
    const db = await offlineDb();
    return db.get('sessions', sessionId);
  },
  async delete(sessionId: string) {
    const db = await offlineDb();
    await db.delete('sessions', sessionId);
  },
  async all(): Promise<AnyLocalSession[]> {
    const db = await offlineDb();
    return db.getAll('sessions');
  },
  async active(): Promise<AnyLocalSession[]> {
    const rows = await this.all();
    return rows.filter((row) => !('schemaVersion' in row) || row.status === 'active' || row.status === 'paused' || row.status === 'finalizing');
  }
};

export const catalogueGrantRepo = {
  async put(grant: CatalogueGrant): Promise<void> {
    const db = await offlineDb();
    await withStorageHealth(() => db.put('catalogueGrants', grant));
  },
  async get(learner: Learner): Promise<CatalogueGrant | undefined> {
    const db = await offlineDb();
    return db.get('catalogueGrants', learner);
  }
};

export const runnerSessionRepo = {
  async put(session: RunnerSessionV3): Promise<void> {
    await sessionRepo.put(session);
  },
  async get(runId: string): Promise<RunnerSessionV3 | undefined> {
    const row = await sessionRepo.get(runId);
    return row && 'schemaVersion' in row && row.schemaVersion === 3 ? row : undefined;
  },
  async patch<Session extends RunnerSessionV3>(runId: string, patch: Partial<Session>): Promise<Session> {
    const db = await offlineDb();
    return withStorageHealth(async () => {
      const tx = db.transaction('sessions', 'readwrite');
      const row = await tx.store.get(runId);
      if (!row || !('schemaVersion' in row) || row.schemaVersion !== 3) {
        tx.abort();
        throw new Error(`Runner session ${runId} was not found.`);
      }
      const updated = {
        ...row,
        ...patch,
        sessionId: row.sessionId,
        runId: row.runId,
        schemaVersion: 3 as const,
        storageRevision: row.storageRevision + 1,
        updatedAt: new Date().toISOString()
      } as Session;
      await tx.store.put(updated);
      await tx.done;
      return updated;
    });
  },
  async active(): Promise<RunnerSessionV3[]> {
    return (await sessionRepo.active()).filter((row): row is RunnerSessionV3 => 'schemaVersion' in row && row.schemaVersion === 3);
  }
};

export const attemptRepo = {
  ...outboxRepo<LocalAttempt>('attempts', 'clientAttemptId'),
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
    const db = await offlineDb();
    const [pending, syncing] = await Promise.all([
      db.getAllFromIndex('attempts', 'byStatus', 'pending'),
      db.getAllFromIndex('attempts', 'byStatus', 'syncing')
    ]);
    return [...pending, ...syncing];
  },
  async finalize(sessionId: string | undefined, attempt: LocalAttempt): Promise<{ attempt?: LocalAttempt; confirmed?: ConfirmedAttempt; created: boolean }> {
    const db = await offlineDb();
    return withStorageHealth(async () => {
      const tx = db.transaction(['attempts', 'sessions', 'history'], 'readwrite');
      const attempts = tx.objectStore('attempts');
      const sessions = tx.objectStore('sessions');
      const history = tx.objectStore('history');
      const existing = await attempts.get(attempt.clientAttemptId);
      if (existing) {
        if (sessionId) await sessions.delete(sessionId);
        await tx.done;
        return { attempt: existing, created: false };
      }
      const confirmed = await history.index('byClientAttemptId').get(attempt.clientAttemptId);
      if (confirmed) {
        if (sessionId) await sessions.delete(sessionId);
        await tx.done;
        return { confirmed, created: false };
      }
      await attempts.add(attempt);
      if (sessionId) await sessions.delete(sessionId);
      await tx.done;
      return { attempt, created: true };
    });
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
    const tx = db.transaction('history');
    const index = tx.store.index('byCompletedAt');
    const rows: ConfirmedAttempt[] = [];
    let cursor = await index.openCursor(null, 'prev');
    while (cursor && rows.length < limit) {
      rows.push(cursor.value);
      cursor = await cursor.continue();
    }
    await tx.done;
    return rows;
  },
  async get(id: number): Promise<ConfirmedAttempt | undefined> {
    const db = await offlineDb();
    return db.get('history', id);
  },
  async findByClientId(clientAttemptId: string): Promise<ConfirmedAttempt | undefined> {
    const db = await offlineDb();
    return db.getFromIndex('history', 'byClientAttemptId', clientAttemptId);
  },
  async delete(id: number) {
    const db = await offlineDb();
    await db.delete('history', id);
  },
  async deleteByClientId(clientAttemptId: string) {
    const db = await offlineDb();
    const match = await db.getFromIndex('history', 'byClientAttemptId', clientAttemptId);
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
  ...outboxRepo<LocalTaskAction>('taskActions', 'clientActionId'),
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
    const db = await offlineDb();
    const [pending, syncing] = await Promise.all([
      db.getAllFromIndex('taskActions', 'byStatus', 'pending'),
      db.getAllFromIndex('taskActions', 'byStatus', 'syncing')
    ]);
    return [...pending, ...syncing];
  },
  async delete(clientActionId: string) {
    const db = await offlineDb();
    await db.delete('taskActions', clientActionId);
  }
};

export const metaRepo = {
  async get<T>(key: string, fallback: T): Promise<T> {
    const db = await offlineDb();
    const row = await db.get('meta', key);
    return row ? row.value as T : fallback;
  },
  async put(key: string, value: unknown): Promise<void> {
    const db = await offlineDb();
    await withStorageHealth(() => db.put('meta', { key, value }));
  }
};

export const syncLeaseRepo = {
  async tryAcquire(name: string, owner: string, expiresAt: string): Promise<boolean> {
    const db = await offlineDb();
    const tx = db.transaction('syncLeases', 'readwrite');
    const existing = await tx.store.get(name);
    if (existing && existing.owner !== owner && new Date(existing.expiresAt).getTime() > Date.now()) {
      await tx.done;
      return false;
    }
    await tx.store.put({ name, owner, expiresAt, renewedAt: new Date().toISOString() });
    await tx.done;
    return true;
  },
  async renew(name: string, owner: string, expiresAt: string): Promise<boolean> {
    const db = await offlineDb();
    const tx = db.transaction('syncLeases', 'readwrite');
    const existing = await tx.store.get(name);
    if (!existing || existing.owner !== owner) {
      await tx.done;
      return false;
    }
    await tx.store.put({ ...existing, expiresAt, renewedAt: new Date().toISOString() });
    await tx.done;
    return true;
  },
  async release(name: string, owner: string): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('syncLeases', 'readwrite');
    const existing = await tx.store.get(name);
    if (existing?.owner === owner) await tx.store.delete(name);
    await tx.done;
  }
};

export const bootstrapRepo = {
  async get<T>(key: string, fallback: T): Promise<T> {
    const db = await offlineDb();
    const row = await db.get('bootstrap', key);
    return row ? row.value as T : fallback;
  },
  async put(key: string, value: unknown): Promise<void> {
    const db = await offlineDb();
    await withStorageHealth(() => db.put('bootstrap', { key, value, updatedAt: new Date().toISOString() }));
  }
};

export const taskAssignmentRepo = {
  async putMany(rows: TaskAssignmentRecord[]): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('taskAssignments', 'readwrite');
    await Promise.all(rows.map((row) => tx.store.put(row)));
    await tx.done;
  },
  async forLearner(learner: Learner): Promise<TaskAssignmentRecord[]> {
    const db = await offlineDb();
    return db.getAllFromIndex('taskAssignments', 'byLearner', learner);
  }
};

export const remediationBundleRepo = {
  async put(bundle: PreparedRemediationBundle): Promise<void> {
    const db = await offlineDb();
    await withStorageHealth(() => db.put('remediationBundles', bundle));
  },
  async get(bundleId: string): Promise<PreparedRemediationBundle | undefined> {
    const db = await offlineDb();
    return db.get('remediationBundles', bundleId);
  },
  async preparedFor(learner: Learner): Promise<PreparedRemediationBundle[]> {
    const db = await offlineDb();
    const rows = await db.getAllFromIndex('remediationBundles', 'byLearner', learner);
    const now = Date.now();
    return rows.filter((row) => (row.status === 'prepared' || row.status === 'active') && new Date(row.validUntil).getTime() >= now);
  }
};
