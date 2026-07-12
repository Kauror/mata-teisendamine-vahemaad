import db from '@/lib/db';
import { getBalance, nowIso, type Learner } from '@/lib/tasks';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { getCurrentCatalogue } from '@/lib/offline/server/catalogVersions';
import { applyOfflineTaskAction, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import { getHistoryEpoch, getTombstonesAfter } from '@/lib/offline/server/tombstones';
import { grantCatalogueContract } from '@/lib/server/rewards/policy';
import {
  validateAttemptRecordV2,
  validateRemediationActionRecordV2,
  validateTaskActionRecordV2
} from '@/lib/server/http/requestValidation';
import {
  GENERATOR_VERSION,
  LEGACY_RUNNER_VERSION,
  MAX_HISTORY_PULL_PER_SYNC,
  MAX_PENDING_ATTEMPTS_PER_SYNC,
  type AttemptResult,
  type ChildDashboardSnapshot,
  type OfflineCatalogue,
  type OfflineSyncPullRequestV2,
  type OfflineSyncPullResponseV2,
  type OfflineSyncPushRequestV2,
  type OfflineSyncPushResponseV2,
  type OfflineSyncRequestV1,
  type OfflineSyncResponseV1,
  type RemediationActionResult,
  type ServerAttempt,
  type TaskActionResult
} from '@/lib/shared/types';

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

function canonicalAttempt(id: number): ServerAttempt | undefined {
  return attemptsAfter(Math.max(0, id - 1)).find((row) => row.id === id);
}

// The push-before-pull sync cycle: process uploaded attempts idempotently (in
// effective completion order), then return newer server data and the next cursor.
export function runSyncV1(request: OfflineSyncRequestV1): OfflineSyncResponseV1 {
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

  const tombstoneCursor = Number(request.cursor?.lastTombstoneId ?? 0) || 0;
  const tombstones = getTombstonesAfter(tombstoneCursor);
  const maxTombstoneId = tombstones.reduce((max, row) => Math.max(max, row.tombstoneId), tombstoneCursor);
  const epoch = getHistoryEpoch();

  return {
    protocolVersion: 1,
    serverTime,
    historyEpoch: epoch,
    attemptResults,
    taskActionResults,
    pull: {
      attempts: pulledAttempts,
      tombstones,
      catalogues,
      dashboards,
      taskTemplates
    },
    nextCursor: {
      lastServerAttemptId: maxId,
      lastTombstoneId: maxTombstoneId,
      historyEpoch: epoch,
      catalogueVersions: { kiur: catalogues.kiur.version, kirsi: catalogues.kirsi.version },
      syncedAt: serverTime
    }
  };
}

export function runSyncPushV2(request: OfflineSyncPushRequestV2): OfflineSyncPushResponseV2 {
  const serverTime = nowIso();
  const attemptResults: AttemptResult[] = [];
  const taskActionResults: TaskActionResult[] = [];
  const remediationActionResults: RemediationActionResult[] = [];

  for (const candidate of request.pending.attempts ?? []) {
    const validation = validateAttemptRecordV2(candidate, request.device.deviceId);
    if (!validation.ok) {
      attemptResults.push({
        clientAttemptId: validation.clientAttemptId,
        status: 'rejected',
        reasonCode: validation.reasonCode,
        message: validation.issues.join('; ')
      });
      continue;
    }
    const payload = validation.value;
    const result = insertAttempt({ ...payload, syncedAt: serverTime });
    const canonical = result.serverAttemptId ? canonicalAttempt(result.serverAttemptId) : undefined;
    attemptResults.push({
      clientAttemptId: payload.clientAttemptId,
      status: result.status,
      serverAttemptId: result.serverAttemptId,
      canonicalAttempt: canonical,
      reward: result.reward,
      reasonCode: result.reasonCode,
      message: result.message
    });
  }

  for (const candidate of request.pending.taskActions ?? []) {
    if (!validateTaskActionRecordV2(candidate, request.device.deviceId)) {
      taskActionResults.push({ clientActionId: String((candidate as { clientActionId?: unknown })?.clientActionId ?? ''), status: 'rejected', reasonCode: 'invalid_request' });
      continue;
    }
    taskActionResults.push(applyOfflineTaskAction(candidate));
  }

  for (const candidate of request.pending.remediationActions ?? []) {
    if (!validateRemediationActionRecordV2(candidate, request.device.deviceId)) {
      remediationActionResults.push({ clientActionId: String((candidate as { clientActionId?: unknown })?.clientActionId ?? ''), status: 'rejected', reasonCode: 'invalid_request' });
      continue;
    }
    // Prepared remediation settlement is deliberately retained for parent
    // review until the server session/action domain service is available. The
    // client keeps the complete answer payload and never silently discards it.
    remediationActionResults.push({
      clientActionId: candidate.clientActionId,
      status: 'needs_review',
      reasonCode: 'remediation_settlement_unavailable',
      message: 'Remediation work was preserved for review.'
    });
  }

  return { protocolVersion: 2, phase: 'push', serverTime, attemptResults, taskActionResults, remediationActionResults };
}

export function runSyncPullV2(request: OfflineSyncPullRequestV2): OfflineSyncPullResponseV2 {
  const serverTime = nowIso();
  const catalogues = { kiur: getCurrentCatalogue('kiur'), kirsi: getCurrentCatalogue('kirsi') } as Record<Learner, OfflineCatalogue>;
  const grants = {
    kiur: grantCatalogueContract({
      learner: 'kiur', catalogueVersion: catalogues.kiur.version, deviceId: request.device.deviceId,
      generatorVersion: GENERATOR_VERSION, runnerVersion: LEGACY_RUNNER_VERSION,
      rotationVersion: catalogues.kiur.algorithmVersion, issuedAt: catalogues.kiur.issuedAt, validUntil: catalogues.kiur.validUntil
    }),
    kirsi: grantCatalogueContract({
      learner: 'kirsi', catalogueVersion: catalogues.kirsi.version, deviceId: request.device.deviceId,
      generatorVersion: GENERATOR_VERSION, runnerVersion: LEGACY_RUNNER_VERSION,
      rotationVersion: catalogues.kirsi.algorithmVersion, issuedAt: catalogues.kirsi.issuedAt, validUntil: catalogues.kirsi.validUntil
    })
  };
  const pulledAttempts = attemptsAfter(request.cursor.lastServerAttemptId);
  const tombstones = getTombstonesAfter(request.cursor.lastTombstoneId);
  const lastServerAttemptId = pulledAttempts.reduce((max, row) => Math.max(max, row.id), request.cursor.lastServerAttemptId);
  const lastTombstoneId = tombstones.reduce((max, row) => Math.max(max, row.tombstoneId), request.cursor.lastTombstoneId);
  const epoch = getHistoryEpoch();

  return {
    protocolVersion: 2,
    phase: 'pull',
    serverTime,
    historyEpoch: epoch,
    pull: {
      attempts: pulledAttempts,
      tombstones,
      taskChanges: [],
      remediationChanges: [],
      catalogues,
      catalogueGrants: grants,
      dashboards: { kiur: dashboardFor('kiur'), kirsi: dashboardFor('kirsi') },
      taskTemplates: getSyncTaskTemplates(),
      taskAssignments: [],
      remediationBundles: []
    },
    hasMore: {
      attempts: pulledAttempts.length >= MAX_HISTORY_PULL_PER_SYNC,
      tombstones: false,
      taskChanges: false,
      remediationChanges: false,
      historyBackfill: false
    },
    nextCursor: {
      ...request.cursor,
      lastServerAttemptId,
      lastTombstoneId,
      historyEpoch: epoch,
      catalogueVersions: { kiur: catalogues.kiur.version, kirsi: catalogues.kirsi.version },
      syncedAt: serverTime
    }
  };
}
