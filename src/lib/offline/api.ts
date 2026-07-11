import { attemptRepo, catalogRepo, historyRepo, sessionRepo, snapshotRepo } from '@/lib/offline/repositories';
import { correctedNow, getDeviceId, getServerOffsetMs } from '@/lib/offline/meta';
import { syncNow } from '@/lib/offline/syncEngine';
import type { LocalAttempt, LocalSession } from '@/lib/offline/records';
import { childExerciseCards, type ChildExerciseCard } from '@/lib/childExerciseCards';
import { selectTodaysLearningExercises } from '@/lib/shared/rotation';
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
  try {
    await syncNow('attempt-complete');
  } catch {
    /* stays pending */
  }

  const stillLocal = await attemptRepo.get(clientAttemptId);
  if (!stillLocal) {
    const confirmed = await historyRepo.findByClientId(clientAttemptId);
    return { clientAttemptId, serverAttemptId: confirmed?.id, synced: true };
  }
  return { clientAttemptId, synced: false };
}

export async function getLocalAttempt(clientAttemptId: string): Promise<LocalAttempt | undefined> {
  return attemptRepo.get(clientAttemptId);
}

export async function getPendingCount(): Promise<number> {
  const all = await attemptRepo.all();
  return all.filter((a) => a.status === 'pending' || a.status === 'syncing').length;
}

export { syncNow };
