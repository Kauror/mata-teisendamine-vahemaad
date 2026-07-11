// Client-safe shared types. This module has NO server-only imports (no `db`), so
// it can be bundled into the browser and reused by the offline layer, the sync
// protocol and the server domain services alike.

export type Learner = 'kiur' | 'kirsi';

export type LearningExerciseStatus = 'hidden' | 'rotation' | 'permanent';
export type LearningExerciseSubject = 'matemaatika' | 'inglise-keel' | 'lugemine';

// The parent-configured catalogue entry for one exercise, plus each child's
// visibility status. Mirrors the server's LearningExerciseRow but lives in a
// client-safe module so the browser can compute today's cards offline.
export type CatalogueEntry = {
  id: string;
  title: string;
  learnerScope: Learner[];
  subject: LearningExerciseSubject;
  topic: string;
  category: string;
  routePath: string;
  sortOrder: number;
  childStatus: Record<Learner, LearningExerciseStatus | null>;
};

// An immutable, content-hashed snapshot of one child's permitted exercise pool.
// A synced attempt records the catalogue version its session started from so the
// server can validate it against the historical pool, not the current one.
export type OfflineCatalogue = {
  learner: Learner;
  version: string; // content hash
  issuedAt: string; // ISO
  refreshAfter: string; // ISO — UI warns to reconnect after this
  validUntil: string; // ISO — attempts referencing this stay acceptable until here
  algorithmVersion: number; // rotation algorithm version
  generatorVersion: string; // question-generator/app compatibility version
  dailyLimit: number;
  entries: CatalogueEntry[];
};

export const ROTATION_ALGORITHM_VERSION = 1;

// Bump when the bundled question generators change in a way that could alter
// generated questions for a given seed. Recorded on each catalogue version so the
// server can tell whether an offline device's generator is compatible.
export const GENERATOR_VERSION = '2026-07-1';

// Offline validity windows (days).
export const CATALOGUE_REFRESH_AFTER_DAYS = 21;
export const CATALOGUE_VALID_DAYS = 30;

// The value that finalizes into a server attempt. Generated and stored locally
// first (IndexedDB), then uploaded; safe to retry because clientAttemptId is
// immutable and unique.
export type OfflineAttemptPayload = {
  clientAttemptId: string; // UUID minted on the device
  deviceId: string;
  learner: Learner | null;
  subject: string | null;
  topic: string | null;
  category: string;
  difficulty: string;
  exerciseId: string | null;
  catalogueVersion: string | null;
  startedAt: string | null; // ISO
  rawDeviceCompletedAt: string; // ISO as the device recorded it
  completedAt: string; // effective/corrected ISO used for day-based logic
  clientTimeZone: string;
  clientUtcOffsetMinutes: number;
  questionCount: number;
  score: number;
  elapsedSeconds: number;
  questions: unknown[]; // full per-question result payload
};

export type AttemptSyncStatus = 'created' | 'duplicate' | 'rejected' | 'needs_review';

export type AttemptResult = {
  clientAttemptId: string;
  status: AttemptSyncStatus;
  serverAttemptId?: number;
  reward?: unknown;
  reasonCode?: string;
  message?: string;
};

// A confirmed server attempt row as returned to the device for local caching.
export type ServerAttempt = {
  id: number;
  clientAttemptId: string | null;
  createdAt: string;
  completedAt: string | null;
  category: string;
  difficulty: string;
  questionCount: number;
  score: number;
  elapsedSeconds: number;
  learner: string | null;
  subject: string | null;
  topic: string | null;
  exerciseId: string | null;
  earnedStars: number | null;
};

// ---- Task actions (offline daily-task completion) ----

export type TaskActionStatus = 'applied' | 'duplicate' | 'pending_approval' | 'conflict' | 'rejected' | 'needs_review';

export type OfflineTaskActionPayload = {
  clientActionId: string;
  deviceId: string;
  learner: Learner;
  actionType: 'complete';
  templateId: number | null;
  templateVersion: string | null;
  taskDate: string; // 'YYYY-MM-DD'
  snapshot?: { title: string; points: number; assignmentMode: string; requiresApproval: boolean } | null;
  completedAt: string | null; // effective ISO
};

export type TaskActionResult = {
  clientActionId: string;
  status: TaskActionStatus;
  reasonCode?: string;
  message?: string;
  serverState?: unknown;
};

// ---- Sync protocol (POST /api/offline/sync) ----

export type OfflineSyncRequest = {
  protocolVersion: 1;
  device: {
    deviceId: string;
    appVersion: string;
    timeZone: string;
    clientNow: string; // ISO
    lastKnownServerOffsetMs?: number;
  };
  cursor: {
    lastServerAttemptId?: number;
    lastTombstoneId?: number;
    historyEpoch?: number;
    catalogueVersions?: Partial<Record<Learner, string>>;
    lastSuccessfulSyncAt?: string;
  };
  pending: {
    attempts: OfflineAttemptPayload[];
    taskActions?: OfflineTaskActionPayload[];
  };
};

export type OfflineSyncResponse = {
  protocolVersion: 1;
  serverTime: string;
  historyEpoch: number;
  attemptResults: AttemptResult[];
  taskActionResults: TaskActionResult[];
  pull: {
    attempts: ServerAttempt[];
    tombstones: AttemptTombstone[];
    catalogues: Record<Learner, OfflineCatalogue>;
    dashboards: Record<Learner, ChildDashboardSnapshot>;
    taskTemplates: import('@/lib/shared/taskProjection').SyncTaskTemplate[];
    notices?: unknown;
  };
  nextCursor: {
    lastServerAttemptId: number;
    lastTombstoneId: number;
    historyEpoch: number;
    catalogueVersions: Partial<Record<Learner, string>>;
    syncedAt: string;
  };
};

// A compact, server-authoritative snapshot the device caches to render the
// dashboard offline. Confirmed values only; the device never mints these.
export type ChildDashboardSnapshot = {
  learner: Learner;
  balance: number;
  streak: number;
  trophies: number;
  updatedAt: string;
};

// A record that a confirmed attempt was deleted server-side, so devices drop it
// from their cache. Never affects the ledger or a pending local attempt.
export type AttemptTombstone = {
  tombstoneId: number;
  serverAttemptId: number | null;
  clientAttemptId: string | null;
  deletedAt: string;
};

export type PingResponse = {
  ok: true;
  serverTime: string;
  protocolVersion: 1;
  appVersion: string;
};

export const OFFLINE_PROTOCOL_VERSION = 1 as const;

// Human-readable app version reported by the ping/sync endpoints. Independent of
// the service-worker cache id (which is the build hash).
export const APP_VERSION = '1.0.0-offline';

// Server-side batch limits for the sync endpoint (untrusted client input).
export const MAX_PENDING_ATTEMPTS_PER_SYNC = 500;
export const MAX_HISTORY_PULL_PER_SYNC = 300;
