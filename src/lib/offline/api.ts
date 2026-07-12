import { attemptRepo, catalogueGrantRepo, catalogRepo, historyRepo, remediationActionRepo, sessionRepo, snapshotRepo, taskActionRepo, taskAssignmentRepo, taskTemplateRepo } from '@/lib/offline/repositories';
import { createRunId } from '@/lib/offline/runnerSession';
import { correctedNow, getDeviceId, getServerOffsetMs } from '@/lib/offline/meta';
import { syncNow } from '@/lib/offline/syncEngine';
import type { LocalAttempt, LocalSession, LocalTaskAction } from '@/lib/offline/records';
export {
  createRunId,
  ensureRunIdInCurrentUrl,
  hasActiveRunnerSessions,
  isRunId,
  createRunnerSession,
  beginRunnerFinalization,
  checkpointRunnerSession,
  loadRunnerSession,
  makeRunnerSession,
  patchRunnerSession,
  pauseRunnerSession,
  runnerStorageFailure,
  resumeRunnerSession,
  saveRunnerSession
} from '@/lib/offline/runnerSession';
export type { CreateRunnerSessionInput, RunnerStorageFailure } from '@/lib/offline/runnerSession';
import { childExerciseCards, type ChildExerciseCard } from '@/lib/childExerciseCards';
import { selectTodaysLearningExercisesVersioned } from '@/lib/shared/rotation';
import { projectTasksForDate } from '@/lib/shared/taskProjection';
import { todayDateString } from '@/lib/appDate';
import type { ChildDashboardSnapshot, Learner } from '@/lib/shared/types';
import { LEGACY_REWARD_POLICY_VERSION, LEGACY_RUNNER_VERSION } from '@/lib/shared/types';

// The service layer the child UI calls instead of fetch(): local-first reads,
// best-effort refresh, status metadata. Client-only (touches IndexedDB).

export type TodaysExercises = {
  cards: ChildExerciseCard[];
  catalogueVersion: string | null;
  stale: boolean;
  refreshAfterPassed: boolean;
} | null;

// Today's cards derived from the cached catalogue using the shared rotation, so
// they match what the server would produce for the same Tallinn date.
export async function getTodaysExercisesOffline(learner: Learner, date = todayDateString()): Promise<TodaysExercises> {
  const catalogue = await catalogRepo.get(learner);
  if (!catalogue) return null;
  const chosen = selectTodaysLearningExercisesVersioned({
    exercises: catalogue.entries,
    learner,
    date,
    limit: catalogue.dailyLimit,
    algorithmVersion: catalogue.algorithmVersion,
    catalogueVersion: catalogue.version
  });
  const cards = childExerciseCards(learner, chosen);
  return {
    cards,
    catalogueVersion: catalogue.version,
    stale: new Date(catalogue.validUntil).getTime() < Date.now(),
    refreshAfterPassed: new Date(catalogue.refreshAfter).getTime() < Date.now()
  };
}

export async function getCatalogueVersion(learner: Learner): Promise<string | null> {
  return (await catalogRepo.get(learner))?.version ?? null;
}

export type CatalogueContract = {
  catalogueVersion: string;
  rewardPolicyVersion: string;
  generatorVersion: string;
  runnerVersion: string;
  algorithmVersion: number;
  rotationVersion: number;
  dailyLimit: number;
};

export async function getCatalogueContract(learner: Learner): Promise<CatalogueContract | null> {
  const [catalogue, grant] = await Promise.all([catalogRepo.get(learner), catalogueGrantRepo.get(learner)]);
  if (!catalogue) return null;
  return {
    catalogueVersion: catalogue.version,
    rewardPolicyVersion: grant?.rewardPolicyVersion ?? catalogue.rewardPolicyVersion ?? LEGACY_REWARD_POLICY_VERSION,
    generatorVersion: grant?.generatorVersion ?? catalogue.generatorVersion,
    runnerVersion: grant?.runnerVersion ?? catalogue.runnerVersion ?? LEGACY_RUNNER_VERSION,
    algorithmVersion: catalogue.algorithmVersion,
    rotationVersion: grant?.rotationVersion ?? catalogue.algorithmVersion,
    dailyLimit: catalogue.dailyLimit
  };
}

// Is `exerciseId` permitted for `learner` by the newest cached catalogue? Used to
// let a runner proceed offline instead of hard-blocking on the active-gate API.
export async function isExercisePermittedOffline(learner: Learner, match: { exerciseId?: string | null; subject: string; topic: string; category: string }): Promise<boolean> {
  const catalogue = await catalogRepo.get(learner);
  if (!catalogue) return false;
  const entry = catalogue.entries.find((e) => {
    if (match.exerciseId && e.id === match.exerciseId) return true;
    if (e.subject !== match.subject) return false;
    if (match.subject === 'matemaatika') return learner === 'kirsi' ? e.topic === match.topic && e.category === match.category : e.topic === match.topic;
    return e.topic === match.topic || e.category === match.category;
  });
  const status = entry?.childStatus[learner];
  return status === 'rotation' || status === 'permanent';
}

export async function getCatalogueExercise(learner: Learner, match: { exerciseId?: string | null; subject: string; topic: string; category: string }) {
  const catalogue = await catalogRepo.get(learner);
  if (!catalogue) return null;
  return catalogue.entries.find((entry) => {
    if (match.exerciseId) return entry.id === match.exerciseId;
    if (entry.subject !== match.subject) return false;
    if (match.subject === 'matemaatika') {
      return learner === 'kirsi'
        ? entry.topic === match.topic && entry.category === match.category
        : entry.topic === match.topic;
    }
    return entry.topic === match.topic || entry.category === match.category;
  }) ?? null;
}

export async function getDashboardSnapshot(learner: Learner): Promise<ChildDashboardSnapshot | undefined> {
  return snapshotRepo.get(learner);
}

// ---- Sessions ----
export async function startSession(session: LocalSession): Promise<void> {
  await sessionRepo.put(session);
}
export async function saveSessionProgress(session: LocalSession): Promise<void> {
  await sessionRepo.put({ ...session, updatedAt: new Date().toISOString() });
}
export async function getSession(sessionId: string): Promise<LocalSession | undefined> {
  const row = await sessionRepo.get(sessionId);
  return row && !('schemaVersion' in row) ? row : undefined;
}
export async function clearSession(sessionId: string): Promise<void> {
  await sessionRepo.delete(sessionId);
}

// ---- Local-first completion ----
export type CompleteAttemptInput = {
  sessionId?: string;
  // A v3 runner mints this before its first question. It is immutable and is
  // also the eventual clientAttemptId, making repeated finalisation a no-op.
  runId?: string;
  clientAttemptId?: string;
  learner: Learner | null;
  subject: string | null;
  topic: string;
  category: string;
  difficulty?: string;
  exerciseId: string | null;
  catalogueVersion: string | null;
  startedAt: string | null;
  questionCount: number;
  score: number;
  elapsedSeconds: number;
  questions: unknown[];
  seed?: number | string;
  runnerId?: string;
  questionIds?: string[];
  rewardPolicyVersion?: string;
  generatorVersion?: string;
  runnerVersion?: string;
  rotationVersion?: number;
};

export type CompleteAttemptResult = {
  clientAttemptId: string;
  serverAttemptId?: number;
  synced: boolean;
  reward?: unknown;
};

// Save the finished attempt to IndexedDB FIRST (so it survives a failed network),
// clear the active session in the same flow, then attempt a best-effort sync.
export async function completeAttempt(input: CompleteAttemptInput): Promise<CompleteAttemptResult> {
  const deviceId = await getDeviceId();
  const offsetMs = await getServerOffsetMs();
  const rawNow = new Date();
  const effective = correctedNow(offsetMs);
  const { createRunId, isRunId } = await import('@/lib/offline/runnerSession');
  const proposedId = input.clientAttemptId ?? input.runId;
  if (proposedId && !isRunId(proposedId)) throw new Error('clientAttemptId must be an RFC 4122 version 4 UUID.');
  const clientAttemptId = proposedId ?? createRunId();

  const attempt: LocalAttempt = {
    clientAttemptId,
    deviceId,
    learner: input.learner,
    subject: input.subject,
    topic: input.topic,
    category: input.category,
    difficulty: input.difficulty ?? 'Lihtne',
    exerciseId: input.exerciseId,
    catalogueVersion: input.catalogueVersion,
    startedAt: input.startedAt,
    rawDeviceCompletedAt: rawNow.toISOString(),
    completedAt: effective.toISOString(),
    clientTimeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Europe/Tallinn',
    clientUtcOffsetMinutes: -rawNow.getTimezoneOffset(),
    questionCount: input.questionCount,
    score: input.score,
    elapsedSeconds: input.elapsedSeconds,
    questions: input.questions,
    seed: input.seed,
    runnerId: input.runnerId,
    questionIds: input.questionIds,
    rewardPolicyVersion: input.rewardPolicyVersion,
    generatorVersion: input.generatorVersion,
    runnerVersion: input.runnerVersion,
    rotationVersion: input.rotationVersion,
    clientCorrectedCompletedAt: effective.toISOString(),
    status: 'pending',
    retryCount: 0,
    createdLocallyAt: rawNow.toISOString()
  };

  const finalized = await attemptRepo.finalize(input.sessionId ?? input.runId, attempt);

  if (finalized.confirmed) {
    return { clientAttemptId, serverAttemptId: finalized.confirmed.id, synced: true, reward: finalized.confirmed.earnedStars };
  }

  // Local completion is the user-visible commit point. Sync is deliberately
  // detached so a reachability timeout can never hold the result screen.
  void syncNow('attempt-complete').catch(() => {});
  return {
    clientAttemptId,
    serverAttemptId: finalized.attempt?.serverAttemptId,
    synced: finalized.attempt?.status === 'confirmed',
    reward: finalized.attempt?.reward
  };
}

export type FinalizeRunnerSessionInput = Omit<CompleteAttemptInput, 'sessionId' | 'clientAttemptId' | 'seed' | 'runnerId' | 'questionIds' | 'rewardPolicyVersion' | 'generatorVersion' | 'runnerVersion' | 'rotationVersion'> & {
  runId: string;
  seed: number | string;
  runnerId: string;
  questionIds: string[];
  rewardPolicyVersion: string;
  generatorVersion: string;
  runnerVersion: string;
  rotationVersion: number;
};

export async function finalizeRunnerSession(input: FinalizeRunnerSessionInput): Promise<CompleteAttemptResult> {
  return completeAttempt({ ...input, sessionId: input.runId, clientAttemptId: input.runId });
}

export async function getLocalAttempt(clientAttemptId: string): Promise<LocalAttempt | undefined> {
  return attemptRepo.get(clientAttemptId);
}

export async function getConfirmedAttemptByClientId(clientAttemptId: string) {
  return historyRepo.findByClientId(clientAttemptId);
}

export type OfflineHistoryItem = {
  id: number;
  clientAttemptId?: string;
  createdAt: string;
  category: string;
  difficulty: string;
  questionCount: number;
  score: number;
  elapsedSeconds: number | null;
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
  earnedStars?: number | null;
  // Preserved so a reward-held attempt is not shown as an ordinary confirmed
  // item once its outbox row is cleared (RTM2-H03), and so cached offline history
  // can explain why the stars are held (RTM3-H02).
  rewardSettlementStatus?: 'eligible' | 'withheld' | 'needs_review' | null;
  reviewReasonCode?: string | null;
  pending?: boolean;
  localStatus?: 'pending' | 'syncing' | 'rejected' | 'needs_review';
  reasonCode?: string;
};

// Merged exercise history for offline viewing: confirmed cached attempts plus any
// still-pending local attempts (shown with a pending flag). Deduped by
// clientAttemptId so a synced attempt never appears twice.
export async function getMergedExerciseHistory(): Promise<OfflineHistoryItem[]> {
  const confirmed = await historyRepo.recent(200);
  const confirmedClientIds = new Set(confirmed.map((row) => row.clientAttemptId).filter(Boolean) as string[]);
  const locals = (await attemptRepo.all()).filter((a) => a.status !== 'confirmed' && !confirmedClientIds.has(a.clientAttemptId));

  const items: OfflineHistoryItem[] = confirmed.map((row) => ({
    id: row.id,
    clientAttemptId: row.clientAttemptId ?? undefined,
    createdAt: row.createdAt,
    category: row.category,
    difficulty: row.difficulty,
    questionCount: row.questionCount,
    score: row.score,
    elapsedSeconds: row.elapsedSeconds,
    learner: row.learner,
    subject: row.subject,
    topic: row.topic,
    earnedStars: row.earnedStars,
    rewardSettlementStatus: row.rewardSettlementStatus ?? 'eligible',
    reviewReasonCode: row.reviewReasonCode ?? null
  }));

  let synthetic = -1;
  for (const local of locals) {
    items.push({
      id: synthetic--,
      clientAttemptId: local.clientAttemptId,
      createdAt: local.completedAt || local.createdLocallyAt,
      category: local.category,
      difficulty: local.difficulty,
      questionCount: local.questionCount,
      score: local.score,
      elapsedSeconds: local.elapsedSeconds,
      learner: local.learner,
      subject: local.subject,
      topic: local.topic,
      earnedStars: null,
      pending: local.status === 'pending' || local.status === 'syncing',
      localStatus: local.status === 'confirmed' ? undefined : local.status,
      reasonCode: local.reasonCode
    });
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPendingCount(): Promise<number> {
  const [attempts, actions, remediationActions] = await Promise.all([
    attemptRepo.pendingCount(),
    taskActionRepo.pendingCount(),
    remediationActionRepo.pendingCount()
  ]);
  return attempts + actions + remediationActions;
}

// ---- Offline daily tasks ----

export type OfflineDailyTask = {
  templateId: number;
  templateVersion: string;
  title: string;
  points: number;
  assignmentMode: string;
  requiresApproval: boolean;
  status: 'active' | 'completed' | 'pending_approval' | 'locked';
  reasonCode?: string;
};

function mapCanonicalAssignmentState(state: unknown): OfflineDailyTask['status'] {
  switch (state) {
    case 'completed':
      return 'completed';
    case 'locked':
      return 'locked';
    case 'pending_approval':
      return 'pending_approval';
    // 'active', 'missed' and anything unknown are still actionable for the child.
    default:
      return 'active';
  }
}

// Today's projected tasks, overlaying (1) the canonical server assignment status
// synced from the server, then (2) the most recent queued local action. The
// canonical layer is the base so a task completed online (by this or the other
// child) does not reappear as active offline; the local layer adds optimistic
// offline completions and surfaces failures (RTM-004/H04, RTM-005).
export async function getDailyTasksOffline(learner: Learner, date = todayDateString()): Promise<OfflineDailyTask[]> {
  const [templates, actions, assignments] = await Promise.all([
    taskTemplateRepo.all(),
    taskActionRepo.all(),
    taskAssignmentRepo.forLearner(learner)
  ]);
  if (templates.length === 0) return [];
  const projected = projectTasksForDate(templates, learner, date);
  const assignmentFor = (templateId: number) => assignments.find((a) => a.templateId === templateId && a.taskDate === date);
  // Most recent local action for this template/date wins (a re-queue after a
  // rejection supersedes the earlier returned action).
  const latestActionFor = (templateId: number) => actions
    .filter((a) => a.templateId === templateId && a.taskDate === date && a.learner === learner)
    .sort((a, b) => (b.createdLocallyAt ?? '').localeCompare(a.createdLocallyAt ?? ''))[0];

  return projected.map((task) => {
    // 1. Base status from the canonical server assignment.
    let status: OfflineDailyTask['status'] = mapCanonicalAssignmentState(assignmentFor(task.templateId)?.state);

    // 2. Overlay the latest local action. Only genuinely-settled or optimistic
    // actions may render as done; rejected / needs_review / returned must NOT
    // show as completed, or a child could see a failed task as successful.
    const action = latestActionFor(task.templateId);
    switch (action?.status) {
      case 'applied':
      case 'duplicate':
        status = 'completed';
        break;
      case 'conflict':
        status = 'locked';
        break;
      case 'pending_approval':
        status = 'pending_approval';
        break;
      case 'pending':
      case 'syncing':
        // Queued locally and not yet settled — optimistic done / awaiting approval.
        status = task.requiresApproval ? 'pending_approval' : 'completed';
        break;
      case 'rejected':
      case 'needs_review':
      case 'returned':
        // Not done: keep the canonical base status (usually active again).
        break;
    }
    return {
      templateId: task.templateId,
      templateVersion: task.templateVersion,
      title: task.title,
      points: task.points,
      assignmentMode: task.assignmentMode,
      requiresApproval: task.requiresApproval,
      status,
      reasonCode: action?.reasonCode
    };
  });
}

export type CompleteTaskOfflineResult = { clientActionId: string; queued: boolean };

// Queue an offline task completion (idempotent per template/date/learner) and try
// a best-effort sync. Never mints stars locally — the server settles on sync.
// A task action whose latest state still occupies the slot (queued, done, or
// under approval). A 'returned'/'rejected' action has freed the slot, so the
// child may queue a fresh completion (RTM2-H05).
//
// RTM3-H04: 'needs_review' is also a terminal, non-occupying state. A task goes
// needs_review on a template/version inconsistency; the read path already shows
// the task as active again, so the child must be able to re-complete it against
// the current template rather than tapping a task that queues nothing. Without
// this the needs_review action wedged the slot: the task looked active but no new
// action was ever created.
function taskActionStillOccupiesSlot(status: LocalTaskAction['status']): boolean {
  return status !== 'returned' && status !== 'rejected' && status !== 'needs_review';
}

export async function completeTaskOffline(input: { learner: Learner; templateId: number; templateVersion: string; taskDate: string; snapshot: { title: string; points: number; assignmentMode: string; requiresApproval: boolean } }): Promise<CompleteTaskOfflineResult> {
  const latest = (await taskActionRepo.all())
    .filter((a) => a.templateId === input.templateId && a.taskDate === input.taskDate && a.learner === input.learner)
    .sort((a, b) => (b.createdLocallyAt ?? '').localeCompare(a.createdLocallyAt ?? ''))[0];
  // Reuse the existing action unless it terminally failed; a returned/rejected
  // task must be re-queueable with a fresh id, keeping the old one as history.
  if (latest && taskActionStillOccupiesSlot(latest.status)) {
    return { clientActionId: latest.clientActionId, queued: false };
  }

  const deviceId = await getDeviceId();
  const offsetMs = await getServerOffsetMs();
  // Always an RFC 4122 v4 UUID (createRunId falls back to getRandomValues), so
  // the server's strict clientActionId validation accepts it on every browser.
  const clientActionId = createRunId();
  const action: LocalTaskAction = {
    clientActionId,
    deviceId,
    learner: input.learner,
    actionType: 'complete',
    templateId: input.templateId,
    templateVersion: input.templateVersion,
    taskDate: input.taskDate,
    snapshot: input.snapshot,
    completedAt: correctedNow(offsetMs).toISOString(),
    status: 'pending',
    createdLocallyAt: new Date().toISOString()
  };
  await taskActionRepo.put(action);
  try {
    await syncNow('task-complete');
  } catch {
    /* stays pending */
  }
  return { clientActionId, queued: true };
}

export { syncNow };
