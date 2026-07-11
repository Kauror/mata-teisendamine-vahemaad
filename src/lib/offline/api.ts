import { attemptRepo, catalogRepo, historyRepo, sessionRepo, snapshotRepo, taskActionRepo, taskTemplateRepo } from '@/lib/offline/repositories';
import { correctedNow, getDeviceId, getServerOffsetMs } from '@/lib/offline/meta';
import { syncNow } from '@/lib/offline/syncEngine';
import type { LocalAttempt, LocalSession, LocalTaskAction } from '@/lib/offline/records';
import { childExerciseCards, type ChildExerciseCard } from '@/lib/childExerciseCards';
import { selectTodaysLearningExercises } from '@/lib/shared/rotation';
import { projectTasksForDate } from '@/lib/shared/taskProjection';
import { todayDateString } from '@/lib/appDate';
import type { ChildDashboardSnapshot, Learner } from '@/lib/shared/types';

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
  const chosen = selectTodaysLearningExercises(catalogue.entries, learner, date);
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
  return sessionRepo.get(sessionId);
}
export async function clearSession(sessionId: string): Promise<void> {
  await sessionRepo.delete(sessionId);
}

// ---- Local-first completion ----
export type CompleteAttemptInput = {
  sessionId?: string;
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
  const clientAttemptId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `att-${Date.now()}-${Math.random().toString(36).slice(2)}`;

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
    status: 'pending',
    retryCount: 0,
    createdLocallyAt: rawNow.toISOString()
  };

  await attemptRepo.put(attempt);
  if (input.sessionId) await sessionRepo.delete(input.sessionId);

  // Best-effort sync; failure just leaves it pending.
  let reward: unknown;
  try {
    const outcome = await syncNow('attempt-complete');
    const result = outcome.attemptResults?.find((r) => r.clientAttemptId === clientAttemptId);
    if (result && (result.status === 'created' || result.status === 'duplicate')) reward = result.reward;
  } catch {
    /* stays pending */
  }

  const stillLocal = await attemptRepo.get(clientAttemptId);
  if (!stillLocal) {
    const confirmed = await historyRepo.findByClientId(clientAttemptId);
    return { clientAttemptId, serverAttemptId: confirmed?.id, synced: true, reward };
  }
  return { clientAttemptId, synced: false, reward };
}

export async function getLocalAttempt(clientAttemptId: string): Promise<LocalAttempt | undefined> {
  return attemptRepo.get(clientAttemptId);
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
  pending?: boolean;
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
    earnedStars: row.earnedStars
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
      pending: true
    });
  }

  return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getPendingCount(): Promise<number> {
  const [attempts, actions] = await Promise.all([attemptRepo.all(), taskActionRepo.all()]);
  const pendingAttempts = attempts.filter((a) => a.status === 'pending' || a.status === 'syncing').length;
  const pendingActions = actions.filter((a) => a.status === 'pending' || a.status === 'syncing').length;
  return pendingAttempts + pendingActions;
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

// Today's projected tasks from the cached templates, with any queued local
// completion overlaid so a task the child finished offline shows as done.
export async function getDailyTasksOffline(learner: Learner, date = todayDateString()): Promise<OfflineDailyTask[]> {
  const [templates, actions] = await Promise.all([taskTemplateRepo.all(), taskActionRepo.all()]);
  if (templates.length === 0) return [];
  const projected = projectTasksForDate(templates, learner, date);
  const actionFor = (templateId: number) => actions.find((a) => a.templateId === templateId && a.taskDate === date && a.learner === learner);

  return projected.map((task) => {
    const action = actionFor(task.templateId);
    let status: OfflineDailyTask['status'] = 'active';
    if (action) {
      if (action.status === 'conflict') status = 'locked';
      else if (task.requiresApproval) status = 'pending_approval';
      else status = 'completed';
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
export async function completeTaskOffline(input: { learner: Learner; templateId: number; templateVersion: string; taskDate: string; snapshot: { title: string; points: number; assignmentMode: string; requiresApproval: boolean } }): Promise<CompleteTaskOfflineResult> {
  const existing = (await taskActionRepo.all()).find((a) => a.templateId === input.templateId && a.taskDate === input.taskDate && a.learner === input.learner);
  if (existing) return { clientActionId: existing.clientActionId, queued: false };

  const deviceId = await getDeviceId();
  const offsetMs = await getServerOffsetMs();
  const clientActionId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `task-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
