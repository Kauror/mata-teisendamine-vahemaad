// Client-safe shared types. This module has NO server-only imports (no `db`), so
// it can be bundled into the browser and reused by the offline layer, the sync
// protocol and the server domain services alike.

export type Learner = 'kiur' | 'kirsi';

export type LearningExerciseStatus = 'hidden' | 'rotation' | 'permanent';
export type LearningExerciseSubject = 'matemaatika' | 'inglise-keel' | 'lugemine' | 'loodusopetus';

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
  // v1 catalogue rows predate immutable policy grants. The client maps a
  // missing value to LEGACY_REWARD_POLICY_VERSION during the compatibility
  // window; every newly-issued v2 grant supplies an explicit content hash.
  rewardPolicyVersion?: string;
  runnerVersion?: string;
  dailyLimit: number;
  entries: CatalogueEntry[];
};

export type OfflineCatalogueV2 = OfflineCatalogue & Required<Pick<OfflineCatalogue, 'rewardPolicyVersion' | 'runnerVersion'>>;

export type CatalogueGrant = {
  learner: Learner;
  catalogueVersion: string;
  rewardPolicyVersion: string;
  generatorVersion: string;
  runnerVersion: string;
  rotationVersion: number;
  issuedAt: string;
  validUntil: string;
};

export const ROTATION_ALGORITHM_VERSION = 1;

// Bump when the bundled question generators change in a way that could alter
// generated questions for a given seed. Recorded on each catalogue version so the
// server can tell whether an offline device's generator is compatible.
export const GENERATOR_VERSION = '2026-07-1';
export const LEGACY_REWARD_POLICY_VERSION = 'legacy-v1';
export const LEGACY_RUNNER_VERSION = 'legacy-v1';

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
  // Protocol-v2 runner contract. Optional on the base type solely so an
  // additive IndexedDB upgrade can still read and surface legacy v1 outbox
  // rows; every newly-created v2 attempt supplies all five fields.
  rewardPolicyVersion?: string;
  generatorVersion?: string;
  runnerVersion?: string;
  rotationVersion?: number;
  clientCorrectedCompletedAt?: string;
  seed?: number | string;
  runnerId?: string;
  questionIds?: string[];
};

export type OfflineAttemptPayloadV2 = OfflineAttemptPayload & Required<Pick<
  OfflineAttemptPayload,
  | 'rewardPolicyVersion'
  | 'generatorVersion'
  | 'runnerVersion'
  | 'rotationVersion'
  | 'clientCorrectedCompletedAt'
  | 'seed'
  | 'runnerId'
  | 'questionIds'
>>;

export type AttemptSyncStatus = 'created' | 'duplicate' | 'rejected' | 'needs_review';

export type AttemptResult = {
  clientAttemptId: string;
  status: AttemptSyncStatus;
  serverAttemptId?: number;
  // v2 always returns the canonical row for created and duplicate uploads. The
  // client can therefore put confirmed history before deleting its outbox row
  // in one IndexedDB transaction, even if the pull cursor has advanced.
  canonicalAttempt?: ServerAttempt;
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
  // Reward settlement so a held (withheld / needs_review) attempt is not shown as
  // an ordinary confirmed history item once the outbox row is cleared (RTM2-H03).
  // Absent/'eligible' for legacy v1 rows and normal v2 rows.
  rewardSettlementStatus?: 'eligible' | 'withheld' | 'needs_review' | null;
  reviewReasonCode?: string | null;
  // Compact but complete review payload, retained by IndexedDB after sync so a
  // confirmed result remains reviewable without a network route.
  questions?: unknown[];
};

export function isHeldRewardStatus(status: ServerAttempt['rewardSettlementStatus']): boolean {
  return status === 'withheld' || status === 'needs_review';
}

// ---- Task actions (offline daily-task completion) ----

export type TaskActionStatus = 'applied' | 'duplicate' | 'pending_approval' | 'returned' | 'conflict' | 'rejected' | 'needs_review';

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

export type CanonicalTaskState = 'pending_approval' | 'applied' | 'returned' | 'conflict' | 'needs_review' | 'rejected';

// Append-only server change record. Changes are pulled on every device, so a
// parent approval/rejection or first-completer conflict cannot remain stuck in
// the state originally returned to the submitting device.
export type TaskActionChange = {
  changeId: number;
  clientActionId: string | null;
  assignmentId: number | null;
  learner: Learner | null;
  state: CanonicalTaskState;
  reasonCode?: string;
  serverState?: unknown;
  changedAt: string;
};

export type OfflineRemediationActionPayload = {
  clientActionId: string;
  deviceId: string;
  bundleId: string;
  sessionId: string;
  learner: Learner;
  completedAt: string;
  answers: unknown[];
};

export type RemediationActionResult = {
  clientActionId: string;
  status: AttemptSyncStatus;
  serverAttemptId?: number;
  canonicalAttempt?: ServerAttempt;
  reasonCode?: string;
  message?: string;
};

export type RemediationChange = {
  changeId: number;
  bundleId: string;
  learner: Learner;
  state: 'prepared' | 'completed' | 'expired' | 'needs_review';
  payload?: unknown;
  changedAt: string;
};

// ---- Sync protocol (POST /api/offline/sync) ----

export const OFFLINE_PROTOCOL_VERSION = 2 as const;

export type OfflineSyncDevice = {
  deviceId: string;
  appVersion: string;
  buildId?: string;
  timeZone: string;
  clientNow: string;
  lastKnownServerOffsetMs?: number;
};

export type OfflineSyncCursorV2 = {
  lastServerAttemptId: number;
  lastTombstoneId: number;
  lastTaskChangeId: number;
  lastRemediationChangeId: number;
  // RTM3-H01: cursor over the attempt-update stream, so existing cached attempts
  // whose settlement/reward changed after they were first pulled are re-delivered.
  lastAttemptChangeId?: number;
  historyEpoch: number;
  catalogueVersions: Partial<Record<Learner, string>>;
  historyBackfillCursor?: number | null;
  lastSuccessfulSyncAt?: string;
};

type OfflineSyncRequestV2Base = {
  protocolVersion: 2;
  device: OfflineSyncDevice;
  cursor: OfflineSyncCursorV2;
};

export type OfflineSyncPushRequestV2 = OfflineSyncRequestV2Base & {
  phase: 'push';
  pushKind: 'attempts' | 'actions';
  pending: {
    attempts?: OfflineAttemptPayloadV2[];
    taskActions?: OfflineTaskActionPayload[];
    remediationActions?: OfflineRemediationActionPayload[];
  };
};

export type OfflineSyncPullRequestV2 = OfflineSyncRequestV2Base & {
  phase: 'pull';
  pageSize?: {
    attempts?: number;
    tombstones?: number;
    taskChanges?: number;
    remediationChanges?: number;
    historyBackfill?: number;
  };
};

export type OfflineSyncRequestV2 = OfflineSyncPushRequestV2 | OfflineSyncPullRequestV2;

export type OfflineSyncPushResponseV2 = {
  protocolVersion: 2;
  phase: 'push';
  serverTime: string;
  attemptResults: AttemptResult[];
  taskActionResults: TaskActionResult[];
  remediationActionResults: RemediationActionResult[];
};

export type OfflineSyncPullDataV2 = {
  attempts: ServerAttempt[];
  tombstones: AttemptTombstone[];
  taskChanges: TaskActionChange[];
  remediationChanges: RemediationChange[];
  catalogues?: Partial<Record<Learner, OfflineCatalogue>>;
  catalogueGrants?: Partial<Record<Learner, CatalogueGrant>>;
  dashboards?: Partial<Record<Learner, ChildDashboardSnapshot>>;
  taskTemplates?: import('@/lib/shared/taskProjection').SyncTaskTemplate[];
  taskAssignments?: unknown[];
  remediationBundles?: unknown[];
  notices?: unknown;
};

export type OfflineSyncPullResponseV2 = {
  protocolVersion: 2;
  phase: 'pull';
  serverTime: string;
  historyEpoch: number;
  pull: OfflineSyncPullDataV2;
  hasMore: {
    attempts: boolean;
    tombstones: boolean;
    taskChanges: boolean;
    remediationChanges: boolean;
    historyBackfill: boolean;
  };
  nextCursor: OfflineSyncCursorV2 & { syncedAt: string };
  resetRequired?: {
    reason: 'cursor_expired' | 'history_epoch' | 'device_unknown';
  };
};

export type OfflineSyncResponseV2 = OfflineSyncPushResponseV2 | OfflineSyncPullResponseV2;

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
  protocolVersion: 1 | 2;
  supportedProtocolVersions?: Array<1 | 2>;
  appVersion: string;
  buildId?: string;
};

// Human-readable app version reported by the ping/sync endpoints. Independent of
// the service-worker cache id (which is the build hash).
export const APP_VERSION = '0.9.3';

// Server-side batch limits for the sync endpoint (untrusted client input).
export const CLIENT_PENDING_ATTEMPTS_PER_SYNC = 20;
export const CLIENT_PENDING_ACTIONS_PER_SYNC = 50;
export const MAX_PENDING_ATTEMPTS_PER_SYNC = 50;
export const MAX_PENDING_ACTIONS_PER_SYNC = 100;
export const MAX_HISTORY_PULL_PER_SYNC = 300;
