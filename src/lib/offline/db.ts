import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type {
  BootstrapRecord,
  CatalogueRecord,
  ConfirmedAttempt,
  LocalAttempt,
  LocalRemediationAction,
  LocalSession,
  LocalTaskAction,
  MetaRecord,
  PreparedRemediationBundle,
  RunnerSessionV3,
  SnapshotRecord,
  SyncLeaseRecord,
  TaskAssignmentRecord,
  TaskTemplateRecord
} from '@/lib/offline/records';
import type { CatalogueGrant } from '@/lib/shared/types';

// The single client-side IndexedDB database. Never use localStorage for attempts,
// sessions, history or the sync queue — everything durable lives here.

export const OFFLINE_DB_NAME = 'harjutaja-offline';
export const OFFLINE_DB_VERSION = 3;

interface OfflineDB extends DBSchema {
  meta: { key: string; value: MetaRecord };
  catalogues: { key: string; value: CatalogueRecord }; // key = learner
  catalogueGrants: { key: string; value: CatalogueGrant }; // key = learner
  sessions: {
    key: string;
    value: LocalSession | RunnerSessionV3;
    indexes: { byLearner: string; byRunner: string; byUpdatedAt: string };
  };
  attempts: {
    key: string;
    value: LocalAttempt;
    indexes: { byStatus: string; byCompletedAt: string; byLearner: string; byNextRetryAt: string };
  }; // key = clientAttemptId
  history: {
    key: number;
    value: ConfirmedAttempt;
    indexes: { byCompletedAt: string; byClientAttemptId: string };
  }; // key = server id
  snapshots: { key: string; value: SnapshotRecord }; // key = learner
  taskTemplates: { key: number; value: TaskTemplateRecord }; // key = template id
  taskActions: {
    key: string;
    value: LocalTaskAction;
    indexes: { byStatus: string; byTaskDate: string; byLearner: string; byNextRetryAt: string; byResolvedAt: string };
  }; // key = clientActionId
  remediationActions: {
    key: string;
    value: LocalRemediationAction;
    indexes: { byStatus: string; byNextRetryAt: string; byResolvedAt: string };
  };
  taskAssignments: { key: string; value: TaskAssignmentRecord; indexes: { byLearner: string; byTaskDate: string } };
  remediationBundles: { key: string; value: PreparedRemediationBundle; indexes: { byLearner: string; byStatus: string; byValidUntil: string } };
  syncLeases: { key: string; value: SyncLeaseRecord };
  bootstrap: { key: string; value: BootstrapRecord };
}

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

export type StorageHealthState = 'unknown' | 'healthy' | 'blocked' | 'versionchange' | 'terminated' | 'quota_exceeded' | 'error';
export type StorageHealth = { state: StorageHealthState; changedAt: string; message?: string };
let storageHealth: StorageHealth = { state: 'unknown', changedAt: new Date(0).toISOString() };
const storageHealthListeners = new Set<(health: StorageHealth) => void>();

function setStorageHealth(state: StorageHealthState, message?: string) {
  storageHealth = { state, changedAt: new Date().toISOString(), message };
  storageHealthListeners.forEach((listener) => listener(storageHealth));
}

export function getStorageHealth(): StorageHealth {
  return storageHealth;
}

export function subscribeStorageHealth(listener: (health: StorageHealth) => void): () => void {
  storageHealthListeners.add(listener);
  return () => storageHealthListeners.delete(listener);
}

export function recordStorageError(error: unknown): void {
  const candidate = error as { name?: string; message?: string } | null;
  const quota = candidate?.name === 'QuotaExceededError';
  setStorageHealth(quota ? 'quota_exceeded' : 'error', candidate?.message ?? String(error));
}

export async function withStorageHealth<T>(operation: () => Promise<T>): Promise<T> {
  try {
    const value = await operation();
    setStorageHealth('healthy');
    return value;
  } catch (error) {
    recordStorageError(error);
    throw error;
  }
}

export function offlineDb() {
  if (typeof indexedDB === 'undefined') throw new Error('IndexedDB is not available in this context.');
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>(OFFLINE_DB_NAME, OFFLINE_DB_VERSION, {
      upgrade(db, _oldVersion, _newVersion, transaction) {
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('catalogues')) db.createObjectStore('catalogues', { keyPath: 'learner' });
        if (!db.objectStoreNames.contains('catalogueGrants')) db.createObjectStore('catalogueGrants', { keyPath: 'learner' });
        if (!db.objectStoreNames.contains('sessions')) {
          const store = db.createObjectStore('sessions', { keyPath: 'sessionId' });
          store.createIndex('byLearner', 'learner');
        }
        if (!db.objectStoreNames.contains('attempts')) {
          const store = db.createObjectStore('attempts', { keyPath: 'clientAttemptId' });
          store.createIndex('byStatus', 'status');
        }
        if (!db.objectStoreNames.contains('history')) {
          const store = db.createObjectStore('history', { keyPath: 'id' });
          store.createIndex('byCompletedAt', 'completedAt');
        }
        if (!db.objectStoreNames.contains('snapshots')) db.createObjectStore('snapshots', { keyPath: 'learner' });
        // v2: offline daily tasks
        if (!db.objectStoreNames.contains('taskTemplates')) db.createObjectStore('taskTemplates', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('taskActions')) {
          const store = db.createObjectStore('taskActions', { keyPath: 'clientActionId' });
          store.createIndex('byStatus', 'status');
        }
        if (!db.objectStoreNames.contains('remediationActions')) {
          const store = db.createObjectStore('remediationActions', { keyPath: 'clientActionId' });
          store.createIndex('byStatus', 'status');
          store.createIndex('byNextRetryAt', 'nextRetryAt');
          store.createIndex('byResolvedAt', 'resolvedAt');
        }
        // v3 is additive. Existing stores and records are retained; only missing
        // indexes and new protocol stores are created.
        const sessions = transaction.objectStore('sessions');
        if (!sessions.indexNames.contains('byLearner')) sessions.createIndex('byLearner', 'learner');
        if (!sessions.indexNames.contains('byRunner')) sessions.createIndex('byRunner', 'runnerId');
        if (!sessions.indexNames.contains('byUpdatedAt')) sessions.createIndex('byUpdatedAt', 'updatedAt');

        const attempts = transaction.objectStore('attempts');
        if (!attempts.indexNames.contains('byStatus')) attempts.createIndex('byStatus', 'status');
        if (!attempts.indexNames.contains('byCompletedAt')) attempts.createIndex('byCompletedAt', 'completedAt');
        if (!attempts.indexNames.contains('byLearner')) attempts.createIndex('byLearner', 'learner');
        if (!attempts.indexNames.contains('byNextRetryAt')) attempts.createIndex('byNextRetryAt', 'nextRetryAt');

        const history = transaction.objectStore('history');
        if (!history.indexNames.contains('byCompletedAt')) history.createIndex('byCompletedAt', 'completedAt');
        if (!history.indexNames.contains('byClientAttemptId')) history.createIndex('byClientAttemptId', 'clientAttemptId');

        const taskActions = transaction.objectStore('taskActions');
        if (!taskActions.indexNames.contains('byStatus')) taskActions.createIndex('byStatus', 'status');
        if (!taskActions.indexNames.contains('byTaskDate')) taskActions.createIndex('byTaskDate', 'taskDate');
        if (!taskActions.indexNames.contains('byLearner')) taskActions.createIndex('byLearner', 'learner');
        if (!taskActions.indexNames.contains('byNextRetryAt')) taskActions.createIndex('byNextRetryAt', 'nextRetryAt');
        if (!taskActions.indexNames.contains('byResolvedAt')) taskActions.createIndex('byResolvedAt', 'resolvedAt');

        if (!db.objectStoreNames.contains('taskAssignments')) {
          const store = db.createObjectStore('taskAssignments', { keyPath: 'assignmentId' });
          store.createIndex('byLearner', 'learner');
          store.createIndex('byTaskDate', 'taskDate');
        }
        if (!db.objectStoreNames.contains('remediationBundles')) {
          const store = db.createObjectStore('remediationBundles', { keyPath: 'bundleId' });
          store.createIndex('byLearner', 'learner');
          store.createIndex('byStatus', 'status');
          store.createIndex('byValidUntil', 'validUntil');
        }
        if (!db.objectStoreNames.contains('syncLeases')) db.createObjectStore('syncLeases', { keyPath: 'name' });
        if (!db.objectStoreNames.contains('bootstrap')) db.createObjectStore('bootstrap', { keyPath: 'key' });
      },
      blocked() {
        setStorageHealth('blocked', 'Close other tabs so the offline database can be upgraded.');
      },
      blocking(_currentVersion, _blockedVersion, event) {
        setStorageHealth('versionchange', `Offline database update requested (${event.type}).`);
        dbPromise?.then((db) => db.close()).catch(() => {});
        dbPromise = null;
      },
      terminated() {
        setStorageHealth('terminated', 'The browser terminated the offline database connection.');
        dbPromise = null;
      }
    }).then((db) => {
      setStorageHealth('healthy');
      return db;
    }).catch((error) => {
      recordStorageError(error);
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}

// Test-only lifecycle hook. Production code keeps one connection for the page
// lifetime; migration tests need to close it before deleting/recreating the DB.
export async function closeOfflineDbForTests(): Promise<void> {
  if (dbPromise) {
    try { (await dbPromise).close(); } catch { /* already terminated */ }
  }
  dbPromise = null;
}

export type { OfflineDB };
