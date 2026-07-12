import type {
  ChildDashboardSnapshot,
  Learner,
  OfflineAttemptPayload,
  OfflineCatalogue,
  OfflineRemediationActionPayload,
  OfflineTaskActionPayload,
  ServerAttempt
} from '@/lib/shared/types';
import type { SyncTaskTemplate } from '@/lib/shared/taskProjection';

// Sync lifecycle of a locally-created attempt.
export type LocalAttemptStatus = 'pending' | 'syncing' | 'confirmed' | 'rejected' | 'needs_review';

export type LocalAttempt = OfflineAttemptPayload & {
  status: LocalAttemptStatus;
  serverAttemptId?: number;
  reward?: unknown;
  reasonCode?: string;
  lastError?: string;
  retryCount: number;
  createdLocallyAt: string;
  syncLeaseUntil?: string;
  nextRetryAt?: string;
};

// A resumable, in-progress exercise. The EXACT generated question payload is
// stored so an app update cannot change the questions on resume.
export type LocalSession = {
  sessionId: string;
  learner: Learner | null;
  subject: string | null;
  topic: string;
  category: string;
  exerciseId: string | null;
  catalogueVersion: string | null;
  seed: number;
  startedAt: string;
  currentIndex: number;
  elapsedSeconds: number;
  questionsPayload: unknown; // the generated questions, verbatim
  answers: string[];
  orderingAnswers: string[][];
  choiceAnswers: string[];
  appVersion: string;
  updatedAt: string;
};

// v3 is the single durable envelope used by every exercise runner. `sessionId`
// intentionally mirrors `runId`: the v1/v2 object store uses sessionId as its
// key path, so the additive upgrade can preserve every existing session.
export type RunnerSessionV3<
  Question = unknown,
  Answer = unknown,
  RunnerState = unknown,
  Feedback = unknown
> = {
  schemaVersion: 3;
  sessionId: string;
  runId: string;
  status: 'active' | 'paused' | 'finalizing';
  learner: Learner | null;
  runnerId: string;
  exerciseId: string | null;
  subject: string | null;
  topic: string;
  category: string;
  seed: number | string | null;
  questions: Question[];
  optionOrder: unknown;
  answers: Answer[];
  currentIndex: number;
  currentPhase: string;
  feedback: Feedback | null;
  hints: unknown;
  runnerState: RunnerState;
  activeElapsedMs: number;
  startedAt: string;
  lastActiveAt: string | null;
  updatedAt: string;
  catalogueVersion: string | null;
  rewardPolicyVersion: string | null;
  generatorVersion: string;
  runnerVersion: string;
  rotationVersion: number | null;
  buildId: string;
  storageRevision: number;
  abandonedAt?: string | null;
};

export type AnyLocalSession = LocalSession | RunnerSessionV3;

export type MetaRecord = {
  key: string;
  value: unknown;
};

export type ConfirmedAttempt = ServerAttempt;
export type CatalogueRecord = OfflineCatalogue;
export type SnapshotRecord = ChildDashboardSnapshot;
export type TaskTemplateRecord = SyncTaskTemplate;

export type LocalTaskActionStatus = 'pending' | 'syncing' | 'applied' | 'duplicate' | 'pending_approval' | 'returned' | 'conflict' | 'rejected' | 'needs_review';

// A queued offline task completion. Once resolved by the server it stays for
// visibility (conflict/needs_review) or is cleared (applied/duplicate).
export type LocalTaskAction = OfflineTaskActionPayload & {
  status: LocalTaskActionStatus;
  reasonCode?: string;
  serverState?: unknown;
  createdLocallyAt: string;
  resolvedAt?: string;
  syncLeaseUntil?: string;
  nextRetryAt?: string;
};

export type LocalRemediationActionStatus = 'pending' | 'syncing' | 'created' | 'duplicate' | 'rejected' | 'needs_review';
export type LocalRemediationAction = OfflineRemediationActionPayload & {
  status: LocalRemediationActionStatus;
  syncLeaseUntil?: string;
  nextRetryAt?: string;
  retryCount: number;
  reasonCode?: string;
  lastError?: string;
  resolvedAt?: string;
  createdLocallyAt: string;
};

export type TaskAssignmentRecord = {
  assignmentId: string;
  learner: Learner;
  taskDate: string;
  templateId: number;
  state: unknown;
  updatedAt: string;
};

export type PreparedRemediationBundle = {
  bundleId: string;
  learner: Learner;
  status: 'prepared' | 'active' | 'completed' | 'stale' | 'needs_review';
  exerciseId: string;
  questions: unknown[];
  issuedAt: string;
  validUntil: string;
  serverSessionId: string | null;
  catalogueVersion: string | null;
  generatorVersion: string;
  payload: unknown;
  updatedAt: string;
};

export type SyncLeaseRecord = {
  name: string;
  owner: string;
  expiresAt: string;
  renewedAt: string;
};

export type BootstrapRecord = {
  key: string;
  value: unknown;
  updatedAt: string;
};
