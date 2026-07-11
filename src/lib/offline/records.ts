import type {
  ChildDashboardSnapshot,
  Learner,
  OfflineAttemptPayload,
  OfflineCatalogue,
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

export type MetaRecord = {
  key: string;
  value: unknown;
};

export type ConfirmedAttempt = ServerAttempt;
export type CatalogueRecord = OfflineCatalogue;
export type SnapshotRecord = ChildDashboardSnapshot;
export type TaskTemplateRecord = SyncTaskTemplate;

export type LocalTaskActionStatus = 'pending' | 'syncing' | 'applied' | 'duplicate' | 'pending_approval' | 'conflict' | 'rejected' | 'needs_review';

// A queued offline task completion. Once resolved by the server it stays for
// visibility (conflict/needs_review) or is cleared (applied/duplicate).
export type LocalTaskAction = OfflineTaskActionPayload & {
  status: LocalTaskActionStatus;
  reasonCode?: string;
  serverState?: unknown;
  createdLocallyAt: string;
};
