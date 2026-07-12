import { offlineDb, withStorageHealth } from '@/lib/offline/db';
import type {
  AnyLocalSession,
  ConfirmedAttempt,
  LocalAttempt,
  LocalRemediationAction,
  LocalTaskAction,
  PreparedRemediationBundle,
  RunnerSessionV3,
  TaskAssignmentRecord,
  TaskTemplateRecord
} from '@/lib/offline/records';
import type { CatalogueGrant, ChildDashboardSnapshot, Learner, OfflineCatalogue } from '@/lib/shared/types';

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
  async pendingCount(): Promise<number> {
    const db = await offlineDb();
    const [pending, syncing] = await Promise.all([
      db.countFromIndex('attempts', 'byStatus', 'pending'),
      db.countFromIndex('attempts', 'byStatus', 'syncing')
    ]);
    return pending + syncing;
  },
  async pendingDue(limit: number, now = new Date()): Promise<LocalAttempt[]> {
    const db = await offlineDb();
    const nowMs = now.getTime();
    const tx = db.transaction('attempts');
    const rows: LocalAttempt[] = [];
    let cursor = await tx.store.index('byStatus').openCursor('pending');
    while (cursor && rows.length < limit) {
      if (!cursor.value.nextRetryAt || new Date(cursor.value.nextRetryAt).getTime() <= nowMs) rows.push(cursor.value);
      cursor = await cursor.continue();
    }
    await tx.done;
    return rows;
  },
  async recoverExpiredSyncing(now = new Date()): Promise<number> {
    const db = await offlineDb();
    const rows = await db.getAllFromIndex('attempts', 'byStatus', 'syncing');
    const expired = rows.filter((row) => !row.syncLeaseUntil || new Date(row.syncLeaseUntil).getTime() <= now.getTime());
    if (!expired.length) return 0;
    const tx = db.transaction('attempts', 'readwrite');
    await Promise.all(expired.map((row) => tx.store.put({ ...row, status: 'pending' as const, syncLeaseUntil: undefined })));
    await tx.done;
    return expired.length;
  },
  async markSyncing(ids: string[], leaseUntil: string): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('attempts', 'readwrite');
    for (const id of ids) {
      const row = await tx.store.get(id);
      if (row?.status === 'pending') await tx.store.put({ ...row, status: 'syncing', syncLeaseUntil: leaseUntil });
    }
    await tx.done;
  },
  async returnPending(ids: string[], error: string, nextRetryAt?: string): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('attempts', 'readwrite');
    for (const id of ids) {
      const row = await tx.store.get(id);
      if (row?.status === 'syncing') {
        await tx.store.put({ ...row, status: 'pending', syncLeaseUntil: undefined, lastError: error, nextRetryAt, retryCount: row.retryCount + 1 });
      }
    }
    await tx.done;
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
  async pendingCount(): Promise<number> {
    const db = await offlineDb();
    const [pending, syncing] = await Promise.all([
      db.countFromIndex('taskActions', 'byStatus', 'pending'),
      db.countFromIndex('taskActions', 'byStatus', 'syncing')
    ]);
    return pending + syncing;
  },
  async pendingDue(limit: number, now = new Date()): Promise<LocalTaskAction[]> {
    const db = await offlineDb();
    const nowMs = now.getTime();
    const tx = db.transaction('taskActions');
    const rows: LocalTaskAction[] = [];
    let cursor = await tx.store.index('byStatus').openCursor('pending');
    while (cursor && rows.length < limit) {
      if (!cursor.value.nextRetryAt || new Date(cursor.value.nextRetryAt).getTime() <= nowMs) rows.push(cursor.value);
      cursor = await cursor.continue();
    }
    await tx.done;
    return rows;
  },
  async recoverExpiredSyncing(now = new Date()): Promise<number> {
    const db = await offlineDb();
    const rows = await db.getAllFromIndex('taskActions', 'byStatus', 'syncing');
    const expired = rows.filter((row) => !row.syncLeaseUntil || new Date(row.syncLeaseUntil).getTime() <= now.getTime());
    if (!expired.length) return 0;
    const tx = db.transaction('taskActions', 'readwrite');
    await Promise.all(expired.map((row) => tx.store.put({ ...row, status: 'pending' as const, syncLeaseUntil: undefined })));
    await tx.done;
    return expired.length;
  },
  async markSyncing(ids: string[], leaseUntil: string): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('taskActions', 'readwrite');
    for (const id of ids) {
      const row = await tx.store.get(id);
      if (row?.status === 'pending') await tx.store.put({ ...row, status: 'syncing', syncLeaseUntil: leaseUntil });
    }
    await tx.done;
  },
  async returnPending(ids: string[], reasonCode: string, nextRetryAt?: string): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('taskActions', 'readwrite');
    for (const id of ids) {
      const row = await tx.store.get(id);
      if (row?.status === 'syncing') await tx.store.put({ ...row, status: 'pending', syncLeaseUntil: undefined, reasonCode, nextRetryAt });
    }
    await tx.done;
  },
  async delete(clientActionId: string) {
    const db = await offlineDb();
    await db.delete('taskActions', clientActionId);
  }
};

export const remediationActionRepo = {
  async put(action: LocalRemediationAction): Promise<void> {
    const db = await offlineDb();
    await withStorageHealth(() => db.put('remediationActions', action));
  },
  async get(clientActionId: string): Promise<LocalRemediationAction | undefined> {
    const db = await offlineDb();
    return db.get('remediationActions', clientActionId);
  },
  async pendingCount(): Promise<number> {
    const db = await offlineDb();
    const [pending, syncing] = await Promise.all([
      db.countFromIndex('remediationActions', 'byStatus', 'pending'),
      db.countFromIndex('remediationActions', 'byStatus', 'syncing')
    ]);
    return pending + syncing;
  },
  async pendingDue(limit: number, now = new Date()): Promise<LocalRemediationAction[]> {
    const db = await offlineDb();
    const nowMs = now.getTime();
    const tx = db.transaction('remediationActions');
    const rows: LocalRemediationAction[] = [];
    let cursor = await tx.store.index('byStatus').openCursor('pending');
    while (cursor && rows.length < limit) {
      if (!cursor.value.nextRetryAt || new Date(cursor.value.nextRetryAt).getTime() <= nowMs) rows.push(cursor.value);
      cursor = await cursor.continue();
    }
    await tx.done;
    return rows;
  },
  async recoverExpiredSyncing(now = new Date()): Promise<number> {
    const db = await offlineDb();
    const rows = await db.getAllFromIndex('remediationActions', 'byStatus', 'syncing');
    const expired = rows.filter((row) => !row.syncLeaseUntil || new Date(row.syncLeaseUntil).getTime() <= now.getTime());
    if (!expired.length) return 0;
    const tx = db.transaction('remediationActions', 'readwrite');
    await Promise.all(expired.map((row) => tx.store.put({ ...row, status: 'pending' as const, syncLeaseUntil: undefined })));
    await tx.done;
    return expired.length;
  },
  async markSyncing(ids: string[], leaseUntil: string): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('remediationActions', 'readwrite');
    for (const id of ids) {
      const row = await tx.store.get(id);
      if (row?.status === 'pending') await tx.store.put({ ...row, status: 'syncing', syncLeaseUntil: leaseUntil });
    }
    await tx.done;
  },
  async returnPending(ids: string[], error: string, nextRetryAt?: string): Promise<void> {
    const db = await offlineDb();
    const tx = db.transaction('remediationActions', 'readwrite');
    for (const id of ids) {
      const row = await tx.store.get(id);
      if (row?.status === 'syncing') {
        await tx.store.put({ ...row, status: 'pending', syncLeaseUntil: undefined, lastError: error, nextRetryAt, retryCount: row.retryCount + 1 });
      }
    }
    await tx.done;
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
