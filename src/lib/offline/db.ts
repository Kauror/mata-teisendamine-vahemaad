import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { CatalogueRecord, ConfirmedAttempt, LocalAttempt, LocalSession, MetaRecord, SnapshotRecord } from '@/lib/offline/records';

// The single client-side IndexedDB database. Never use localStorage for attempts,
// sessions, history or the sync queue — everything durable lives here.

export const OFFLINE_DB_NAME = 'harjutaja-offline';
export const OFFLINE_DB_VERSION = 1;

interface OfflineDB extends DBSchema {
  meta: { key: string; value: MetaRecord };
  catalogues: { key: string; value: CatalogueRecord }; // key = learner
  sessions: { key: string; value: LocalSession; indexes: { byLearner: string } };
  attempts: { key: string; value: LocalAttempt; indexes: { byStatus: string } }; // key = clientAttemptId
  history: { key: number; value: ConfirmedAttempt; indexes: { byCompletedAt: string } }; // key = server id
  snapshots: { key: string; value: SnapshotRecord }; // key = learner
}

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | null = null;

export function offlineDb() {
  if (typeof indexedDB === 'undefined') throw new Error('IndexedDB is not available in this context.');
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>(OFFLINE_DB_NAME, OFFLINE_DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
        if (!db.objectStoreNames.contains('catalogues')) db.createObjectStore('catalogues', { keyPath: 'learner' });
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
      }
    });
  }
  return dbPromise;
}

export type { OfflineDB };
