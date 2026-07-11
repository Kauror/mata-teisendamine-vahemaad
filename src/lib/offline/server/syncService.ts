import db from '@/lib/db';
import { getBalance, nowIso, type Learner } from '@/lib/tasks';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { getCurrentCatalogue } from '@/lib/offline/server/catalogVersions';
import { applyOfflineTaskAction, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import {
  MAX_HISTORY_PULL_PER_SYNC,
  MAX_PENDING_ATTEMPTS_PER_SYNC,
  type AttemptResult,
  type ChildDashboardSnapshot,
  type OfflineCatalogue,
  type OfflineSyncRequest,
  type OfflineSyncResponse,
  type ServerAttempt,
  type TaskActionResult
} from '@/lib/shared/types';

function historyEpoch(): number {
  const row = db.prepare('SELECT historyEpoch FROM offline_sync_state WHERE id = 1').get() as { historyEpoch: number } | undefined;
  return row?.historyEpoch ?? 0;
}

function dashboardFor(learner: Learner): ChildDashboardSnapshot {
  return {
    learner,
    balance: getBalance(learner),
    streak: getActiveLearningStreak(learner),
    trophies: getMonthlyTrophies(learner),
    updatedAt: nowIso()
  };
}

function attemptsAfter(cursorId: number): ServerAttempt[] {
  return db.prepare(`
    SELECT a.id, a.clientAttemptId, a.createdAt, a.completedAt, a.category, a.difficulty,
           a.questionCount, a.score, a.elapsedSeconds, a.learner, a.subject, a.topic, a.exerciseId,
           r.awardedAmount AS earnedStars
    FROM attempts a
    LEFT JOIN study_attempt_rewards r ON r.attemptId = a.id
    WHERE a.id > ?
    ORDER BY a.id ASC
    LIMIT ?
  `).all(cursorId, MAX_HISTORY_PULL_PER_SYNC) as ServerAttempt[];
}

// The push-before-pull sync cycle: process uploaded attempts idempotently (in
// effective completion order), then return newer server data and the next cursor.
export function runSync(request: OfflineSyncRequest): OfflineSyncResponse {
  const serverTime = nowIso();
  const pendingAttempts = (request.pending?.attempts ?? []).slice(0, MAX_PENDING_ATTEMPTS_PER_SYNC);

  // Deterministic processing order by effective completion time, then clientAttemptId.
  const ordered = [...pendingAttempts].sort((a, b) => {
    const at = a.completedAt || '';
    const bt = b.completedAt || '';
    if (at !== bt) return at < bt ? -1 : 1;
    return (a.clientAttemptId || '').localeCompare(b.clientAttemptId || '');
  });

  const attemptResults: AttemptResult[] = [];
  for (const payload of ordered) {
    if (!payload?.clientAttemptId || typeof payload.clientAttemptId !== 'string') {
      attemptResults.push({ clientAttemptId: String(payload?.clientAttemptId ?? ''), status: 'rejected', reasonCode: 'bad_payload' });
      continue;
    }
    const result = insertAttempt({ ...payload, syncedAt: serverTime });
    attemptResults.push({
      clientAttemptId: payload.clientAttemptId,
      status: result.status,
      serverAttemptId: result.serverAttemptId,
      reward: result.reward,
      reasonCode: result.reasonCode,
      message: result.message
    });
  }

  // Task actions are processed after attempts (both are child activity) and in
  // submission order; each is idempotent via clientActionId.
  const taskActionResults: TaskActionResult[] = [];
  for (const action of request.pending?.taskActions ?? []) {
    if (!action?.clientActionId || typeof action.clientActionId !== 'string') {
      taskActionResults.push({ clientActionId: String(action?.clientActionId ?? ''), status: 'rejected', reasonCode: 'bad_payload' });
      continue;
    }
    taskActionResults.push(applyOfflineTaskAction(action));
  }

  const catalogues = { kiur: getCurrentCatalogue('kiur'), kirsi: getCurrentCatalogue('kirsi') } as Record<Learner, OfflineCatalogue>;
  const dashboards = { kiur: dashboardFor('kiur'), kirsi: dashboardFor('kirsi') } as Record<Learner, ChildDashboardSnapshot>;
  const taskTemplates = getSyncTaskTemplates();

  const cursorId = Number(request.cursor?.lastServerAttemptId ?? 0) || 0;
  const pulledAttempts = attemptsAfter(cursorId);
  const maxId = pulledAttempts.reduce((max, row) => Math.max(max, row.id), cursorId);

  return {
    protocolVersion: 1,
    serverTime,
    historyEpoch: historyEpoch(),
    attemptResults,
    taskActionResults,
    pull: {
      attempts: pulledAttempts,
      catalogues,
      dashboards,
      taskTemplates
    },
    nextCursor: {
      lastServerAttemptId: maxId,
      historyEpoch: historyEpoch(),
      catalogueVersions: { kiur: catalogues.kiur.version, kirsi: catalogues.kirsi.version },
      syncedAt: serverTime
    }
  };
}
