import { getBalance, nowIso, todayDateString, type Learner } from '@/lib/tasks';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { currentCatalogueVersion, getCurrentCatalogue } from '@/lib/offline/server/catalogVersions';
import { applyOfflineTaskAction, getSyncTaskAssignments, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import { getHistoryEpoch, getTombstonePageAfter } from '@/lib/offline/server/tombstones';
import { getTaskChangesAfter, MAX_TASK_CHANGES_PER_SYNC } from '@/lib/offline/server/taskChanges';
import { getChangedAttemptIdsAfter, MAX_ATTEMPT_CHANGES_PER_SYNC } from '@/lib/offline/server/attemptChanges';
import { canonicalAttemptById, canonicalAttemptsAfter, canonicalAttemptsByIds } from '@/lib/server/attempts/canonicalAttempts';
import { catalogueGrantForDevice, currentRewardPolicyVersion, grantCatalogueContract, grantContractIsCurrent } from '@/lib/server/rewards/policy';
import {
  validateAttemptRecordV2,
  validateRemediationActionRecordV2,
  validateTaskActionRecordV2
} from '@/lib/server/http/requestValidation';
import {
  CATALOGUE_RESEND_REMAINING_DAYS,
  GENERATOR_VERSION,
  LEGACY_RUNNER_VERSION,
  MAX_HISTORY_PULL_PER_SYNC,
  MIN_PULL_PAGE_SIZE,
  ROTATION_ALGORITHM_VERSION,
  type AttemptResult,
  type CatalogueGrant,
  type ChildDashboardSnapshot,
  type OfflineCatalogue,
  type OfflineSyncPullRequestV2,
  type OfflineSyncPullResponseV2,
  type OfflineSyncPushRequestV2,
  type OfflineSyncPushResponseV2,
  type RemediationActionResult,
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
    const result = insertAttempt({ ...payload, protocolVersion: 2, syncedAt: serverTime });
    const canonical = result.serverAttemptId ? canonicalAttemptById(result.serverAttemptId) : undefined;
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

const LEARNERS: Learner[] = ['kiur', 'kirsi'];
const RESEND_REMAINING_MS = CATALOGUE_RESEND_REMAINING_DAYS * 86_400_000;

// Honour the client's page size within [MIN_PULL_PAGE_SIZE, max].
function clampPageSize(requested: number | undefined, max: number): number {
  if (!Number.isInteger(requested)) return max;
  return Math.min(max, Math.max(MIN_PULL_PAGE_SIZE, requested as number));
}

function nearExpiry(validUntil: string | undefined, nowMs: number): boolean {
  const until = validUntil ? new Date(validUntil).getTime() : Number.NaN;
  return !Number.isFinite(until) || until - nowMs < RESEND_REMAINING_MS;
}

// OFF-07: whether this device must be (re)sent a learner's catalogue + grant.
// A delta-aware client reports what it holds (knownCatalogues); an older client
// is judged by its cursor. Either way the server's own grant row for this
// device must exist, carry the current contract and have at least half of its
// window left: that row is what the device's offline attempts are validated
// against, so it may never lapse while the device keeps syncing.
function catalogueNeedsSend(
  learner: Learner,
  currentVersion: string,
  request: OfflineSyncPullRequestV2,
  expectedContract: Parameters<typeof grantContractIsCurrent>[1],
  nowMs: number
): boolean {
  const known = request.knownCatalogues;
  const clientVersion = known ? known[learner]?.catalogueVersion : request.cursor.catalogueVersions?.[learner];
  if (clientVersion !== currentVersion) return true;
  if (known && nearExpiry(known[learner]?.validUntil, nowMs)) return true;
  const row = catalogueGrantForDevice(learner, currentVersion, request.device.deviceId);
  if (!row || nearExpiry(row.validUntil, nowMs)) return true;
  return !grantContractIsCurrent(row, expectedContract);
}

export function runSyncPullV2(request: OfflineSyncPullRequestV2): OfflineSyncPullResponseV2 {
  const serverTime = nowIso();
  const nowMs = new Date(serverTime).getTime();
  const attemptLimit = clampPageSize(request.pageSize?.attempts, MAX_HISTORY_PULL_PER_SYNC);
  const tombstoneLimit = clampPageSize(request.pageSize?.tombstones, MAX_HISTORY_PULL_PER_SYNC);
  const taskChangeLimit = clampPageSize(request.pageSize?.taskChanges, MAX_TASK_CHANGES_PER_SYNC);

  const pulledAttempts = canonicalAttemptsAfter(request.cursor.lastServerAttemptId, attemptLimit);
  const lastServerAttemptId = pulledAttempts.reduce((max, row) => Math.max(max, row.id), request.cursor.lastServerAttemptId);

  // RTM3-H01: re-deliver attempts whose settlement/reward changed after they were
  // first pulled (parent approval, or a late attempt revising an earlier reward).
  // Only those the device could already have cached (id <= new attempt cursor) need
  // resending; anything newer is already in pulledAttempts above.
  const attemptChangeCursor = getChangedAttemptIdsAfter(request.cursor.lastAttemptChangeId ?? 0, MAX_ATTEMPT_CHANGES_PER_SYNC);
  const alreadyPulled = new Set(pulledAttempts.map((row) => row.id));
  const changedIds = attemptChangeCursor.attemptIds.filter((id) => id <= lastServerAttemptId && !alreadyPulled.has(id));
  const changedAttempts = canonicalAttemptsByIds(changedIds);
  const attempts = [...pulledAttempts, ...changedAttempts];

  const tombstonePage = getTombstonePageAfter(request.cursor.lastTombstoneId, tombstoneLimit);
  const tombstones = tombstonePage.tombstones;
  const taskChanges = getTaskChangesAfter(request.cursor.lastTaskChangeId, taskChangeLimit);
  const lastTombstoneId = tombstones.reduce((max, row) => Math.max(max, row.tombstoneId), request.cursor.lastTombstoneId);
  const lastTaskChangeId = taskChanges.reduce((max, row) => Math.max(max, row.changeId), request.cursor.lastTaskChangeId);
  const epoch = getHistoryEpoch();

  const hasMore = {
    // Keep paging while either fresh attempts or attempt-update notices remain.
    attempts: pulledAttempts.length >= attemptLimit || attemptChangeCursor.attemptIds.length >= MAX_ATTEMPT_CHANGES_PER_SYNC,
    tombstones: tombstonePage.hasMore,
    taskChanges: taskChanges.length >= taskChangeLimit,
    remediationChanges: false,
    historyBackfill: false
  };
  const lastPage = !Object.values(hasMore).some(Boolean);

  // OFF-07: catalogues and grants only when this device lacks them or they are
  // due a refresh (see catalogueNeedsSend). The current version is a read-only
  // hash; the window refresh and the grant upsert happen only when sending.
  const expectedContract = {
    rewardPolicyVersion: currentRewardPolicyVersion(),
    generatorVersion: GENERATOR_VERSION,
    runnerVersion: LEGACY_RUNNER_VERSION,
    rotationVersion: ROTATION_ALGORITHM_VERSION
  };
  const catalogueVersions: Partial<Record<Learner, string>> = {};
  const catalogues: Partial<Record<Learner, OfflineCatalogue>> = {};
  const grants: Partial<Record<Learner, CatalogueGrant>> = {};
  for (const learner of LEARNERS) {
    const current = currentCatalogueVersion(learner);
    catalogueVersions[learner] = current.version;
    if (!catalogueNeedsSend(learner, current.version, request, expectedContract, nowMs)) continue;
    const catalogue = getCurrentCatalogue(learner, current);
    catalogues[learner] = catalogue;
    grants[learner] = grantCatalogueContract({
      learner, catalogueVersion: catalogue.version, deviceId: request.device.deviceId,
      generatorVersion: GENERATOR_VERSION, runnerVersion: LEGACY_RUNNER_VERSION,
      rotationVersion: catalogue.algorithmVersion, issuedAt: catalogue.issuedAt, validUntil: catalogue.validUntil
    });
  }
  const anyCatalogue = Object.keys(catalogues).length > 0;

  // OFF-07: the projections (dashboards, templates, today's assignments) are
  // computed once per pull, on its final page, after every feed has been paged.
  // Earlier pages omit them, which the client reads as "unchanged".
  const taskDate = todayDateString();
  const finalPageSnapshots = lastPage ? {
    dashboards: { kiur: dashboardFor('kiur'), kirsi: dashboardFor('kirsi') },
    taskTemplates: getSyncTaskTemplates(),
    taskAssignments: getSyncTaskAssignments(taskDate),
    taskAssignmentDates: [taskDate]
  } : {};

  return {
    protocolVersion: 2,
    phase: 'pull',
    serverTime,
    historyEpoch: epoch,
    pull: {
      attempts,
      tombstones,
      taskChanges,
      remediationChanges: [],
      ...(anyCatalogue ? { catalogues, catalogueGrants: grants } : {}),
      ...finalPageSnapshots,
      remediationBundles: []
    },
    hasMore,
    nextCursor: {
      ...request.cursor,
      lastServerAttemptId,
      lastTombstoneId,
      lastTaskChangeId,
      lastAttemptChangeId: attemptChangeCursor.lastChangeId,
      historyEpoch: epoch,
      catalogueVersions,
      syncedAt: serverTime
    }
  };
}
