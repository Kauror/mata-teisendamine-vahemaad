import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { buildKirsiPictureWordQuestion, KIRSI_READING_PAIRS } from '@/lib/kirsiReadingPairs';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import { writeTombstone } from '@/lib/offline/server/tombstones';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import type { GeneratedQuestion } from '@/lib/types';
import type { OfflineSyncCursorV2, OfflineSyncDevice, OfflineSyncPullRequestV2, OfflineSyncPullResponseV2 } from '@/lib/shared/types';
import { parseOfflineSyncRequest, PublicRequestError } from '@/lib/server/http/requestValidation';

const deviceId = '018f47f6-9f2c-7b9a-8a2e-123456789abc';

function answerFor(question: GeneratedQuestion) {
  if (question.kind === 'ordering' && question.orderingCards) {
    return [...question.orderingCards]
      .sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm)
      .map((card) => card.label)
      .join(' → ');
  }
  if (question.kind === 'choice' && question.choiceOptions) return question.choiceOptions[question.correctAnswer];
  if (question.kind === 'text' || question.correctAnswerText) return question.correctAnswerText;
  return String(question.correctAnswer);
}

function cursor(): OfflineSyncCursorV2 {
  return {
    lastServerAttemptId: 0,
    lastTombstoneId: 0,
    lastTaskChangeId: 0,
    lastRemediationChangeId: 0,
    lastAttemptChangeId: 0,
    historyEpoch: 0,
    catalogueVersions: {}
  };
}

function device(): OfflineSyncDevice {
  return {
    deviceId,
    appVersion: 'phase-3-test',
    timeZone: 'Europe/Tallinn',
    clientNow: new Date().toISOString()
  };
}

beforeEach(() => {
  process.env.OFFLINE_PROTOCOL_V2_ENABLED = '1';
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM attempt_reward_components;
    DELETE FROM reward_projection_runs;
    DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger;
    DELETE FROM attempts;
    DELETE FROM attempt_tombstones;
    DELETE FROM catalogue_grants;
    DELETE FROM offline_catalog_versions;
    DELETE FROM reward_policy_current;
    DELETE FROM reward_policy_versions;
  `);
  db.pragma('foreign_keys = ON');
  updateChildLearningExerciseStatus('kiur.math.mootuhikud-pikkused', 'kiur', 'permanent');
  updateChildLearningExerciseStatus('kirsi.reading.pilt-ja-sona', 'kirsi', 'permanent');
});

describe('protocol-v2 attempt writes', () => {
  it('continues pulling when more than one tombstone page exists', () => {
    const insertTombstones = db.transaction(() => {
      for (let index = 0; index < 301; index += 1) writeTombstone(null, `deleted-${index}`);
    });
    insertTombstones();

    const first = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    expect(first.pull.tombstones).toHaveLength(300);
    expect(first.hasMore.tombstones).toBe(true);
    expect(first.nextCursor.lastTombstoneId).toBe(first.pull.tombstones.at(-1)?.tombstoneId);

    const second = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor });
    expect(second.pull.tombstones).toHaveLength(1);
    expect(second.pull.tombstones[0].clientAttemptId).toBe('deleted-300');
    expect(second.hasMore.tombstones).toBe(false);
    expect(second.nextCursor.lastTombstoneId).toBe(second.pull.tombstones[0].tombstoneId);
  });

  it('accepts a valid submission and ignores a forged client score', () => {
    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const catalogue = pull.pull.catalogues?.kiur;
    const grant = pull.pull.catalogueGrants?.kiur;
    expect(catalogue).toBeTruthy();
    expect(grant).toBeTruthy();
    const entry = catalogue!.entries.find((candidate) => candidate.id === 'kiur.math.mootuhikud-pikkused');
    expect(entry).toBeTruthy();

    const generated = generateKiurMathSession(entry!.topic, entry!.category, 'Lihtne', 1, 42);
    const completedAt = new Date(Date.now() - 60_000).toISOString();
    const response = runSyncPushV2({
      protocolVersion: 2,
      phase: 'push',
      pushKind: 'attempts',
      device: device(),
      cursor: cursor(),
      pending: {
        attempts: [{ clientAttemptId: 'malformed-sibling' } as never, {
          clientAttemptId: '018f47f6-9f2c-7b9a-8a2e-abcdefabcdef',
          deviceId,
          learner: 'kiur',
          subject: entry!.subject,
          topic: entry!.topic,
          category: entry!.category,
          difficulty: 'Lihtne',
          exerciseId: entry!.id,
          catalogueVersion: catalogue!.version,
          rewardPolicyVersion: grant!.rewardPolicyVersion,
          generatorVersion: getOfflineRunnerCapability('math')!.generatorVersion,
          runnerVersion: 'math-v1',
          rotationVersion: grant!.rotationVersion,
          startedAt: completedAt,
          rawDeviceCompletedAt: completedAt,
          completedAt,
          clientCorrectedCompletedAt: completedAt,
          clientTimeZone: 'Europe/Tallinn',
          clientUtcOffsetMinutes: 180,
          questionCount: 1,
          score: 0,
          elapsedSeconds: 60,
          seed: 42,
          runnerId: 'math',
          questionIds: generated.map((question) => question.id),
          questions: generated.map((question) => ({ ...question, userAnswer: answerFor(question), isCorrect: false }))
        }]
      }
    });

    expect(response.attemptResults[0]).toMatchObject({ status: 'rejected' });
    expect(response.attemptResults[1]).toMatchObject({ status: 'created' });
    const stored = db.prepare('SELECT protocolVersion, score, questionCount FROM attempts').get() as { protocolVersion: number; score: number; questionCount: number };
    expect(stored).toEqual({ protocolVersion: 2, score: 1, questionCount: 1 });
  });

  it('accepts the picture-word runner payload through the full sync contract', () => {
    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const catalogue = pull.pull.catalogues?.kirsi;
    const grant = pull.pull.catalogueGrants?.kirsi;
    const entry = catalogue?.entries.find((candidate) => candidate.id === 'kirsi.reading.pilt-ja-sona');
    const capability = getOfflineRunnerCapability('kirsi-picture-word');
    expect(entry).toBeTruthy();
    expect(grant).toBeTruthy();
    expect(capability).toBeTruthy();

    const pair = KIRSI_READING_PAIRS[0];
    const questionId = `run:0:0:${pair.id}`;
    const completedAt = new Date(Date.now() - 60_000).toISOString();
    const response = runSyncPushV2({
      protocolVersion: 2,
      phase: 'push',
      pushKind: 'attempts',
      device: device(),
      cursor: cursor(),
      pending: {
        attempts: [{
          clientAttemptId: '018f47f6-9f2c-7b9a-8a2e-fedcbafedcba',
          deviceId,
          learner: 'kirsi',
          subject: entry!.subject,
          topic: entry!.topic,
          category: entry!.category,
          difficulty: 'Sprint',
          exerciseId: entry!.id,
          catalogueVersion: catalogue!.version,
          rewardPolicyVersion: grant!.rewardPolicyVersion,
          generatorVersion: capability!.generatorVersion,
          runnerVersion: capability!.runnerVersion,
          rotationVersion: capability!.rotationVersion,
          startedAt: completedAt,
          rawDeviceCompletedAt: completedAt,
          completedAt,
          clientCorrectedCompletedAt: completedAt,
          clientTimeZone: 'Europe/Tallinn',
          clientUtcOffsetMinutes: 180,
          questionCount: 1,
          score: 0,
          elapsedSeconds: 10,
          seed: 1,
          runnerId: capability!.runnerId,
          questionIds: [questionId],
          questions: [{
            taskId: questionId,
            id: questionId,
            question: buildKirsiPictureWordQuestion(pair),
            userAnswer: pair.word,
            selectedWord: pair.word,
            correctWord: pair.word,
            vocabularyId: pair.id,
            isCorrect: false,
            kind: 'choice',
            image: pair.image,
            correctAnswer: 0
          }]
        }]
      }
    });

    expect(response.attemptResults[0]).toMatchObject({ status: 'created' });
    const stored = db.prepare('SELECT score, questionCount FROM attempts WHERE clientAttemptId = ?')
      .get('018f47f6-9f2c-7b9a-8a2e-fedcbafedcba');
    expect(stored).toEqual({ score: 1, questionCount: 1 });
  });

  // Regression: an unchanged exercise pool keeps its catalogue version, so the
  // grant row was written once and never touched again while the catalogue
  // window kept rolling forward. Thirty days later every ordinary attempt was
  // held as `completion_after_grant`, which also emptied that child's day on the
  // daily leaderboard.
  it('re-extends the grant of a device that keeps syncing an unchanged catalogue', () => {
    runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const original = db.prepare('SELECT issuedAt, validUntil FROM catalogue_grants WHERE learner = ?').get('kiur') as { issuedAt: string; validUntil: string };
    db.prepare('UPDATE catalogue_grants SET validUntil = ? WHERE learner = ?')
      .run(new Date(Date.now() - 2 * 86_400_000).toISOString(), 'kiur');

    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const served = pull.pull.catalogueGrants?.kiur;
    const stored = db.prepare('SELECT issuedAt, validUntil FROM catalogue_grants WHERE learner = ?').get('kiur') as { issuedAt: string; validUntil: string };

    // The row the server validates against is the contract the device was handed.
    expect(stored.validUntil).toBe(served?.validUntil);
    expect(stored.validUntil).toBe(pull.pull.catalogues?.kiur?.validUntil);
    expect(new Date(stored.validUntil).getTime()).toBeGreaterThan(Date.now());
    // Only the window moves; when this catalogue version first appeared does not.
    expect(stored.issuedAt).toBe(original.issuedAt);
  });

  it('settles an attempt made after the original grant window instead of holding it', () => {
    runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    db.prepare('UPDATE catalogue_grants SET validUntil = ? WHERE learner = ?')
      .run(new Date(Date.now() - 2 * 86_400_000).toISOString(), 'kiur');

    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    const catalogue = pull.pull.catalogues!.kiur!;
    const grant = pull.pull.catalogueGrants!.kiur!;
    const entry = catalogue.entries.find((candidate) => candidate.id === 'kiur.math.mootuhikud-pikkused')!;
    const generated = generateKiurMathSession(entry.topic, entry.category, 'Lihtne', 1, 7);
    const completedAt = new Date(Date.now() - 60_000).toISOString();

    const response = runSyncPushV2({
      protocolVersion: 2,
      phase: 'push',
      pushKind: 'attempts',
      device: device(),
      cursor: cursor(),
      pending: {
        attempts: [{
          clientAttemptId: '018f47f6-9f2c-7b9a-8a2e-0123456789ab',
          deviceId,
          learner: 'kiur',
          subject: entry.subject,
          topic: entry.topic,
          category: entry.category,
          difficulty: 'Lihtne',
          exerciseId: entry.id,
          catalogueVersion: catalogue.version,
          rewardPolicyVersion: grant.rewardPolicyVersion,
          generatorVersion: grant.generatorVersion,
          runnerVersion: 'math-v1',
          rotationVersion: grant.rotationVersion,
          startedAt: completedAt,
          rawDeviceCompletedAt: completedAt,
          completedAt,
          clientCorrectedCompletedAt: completedAt,
          clientTimeZone: 'Europe/Tallinn',
          clientUtcOffsetMinutes: 180,
          questionCount: 1,
          score: 1,
          elapsedSeconds: 60,
          seed: 7,
          runnerId: 'math',
          questionIds: generated.map((question) => question.id),
          questions: generated.map((question) => ({ ...question, userAnswer: answerFor(question), isCorrect: true }))
        }]
      }
    });

    expect(response.attemptResults[0]).toMatchObject({ status: 'created' });
    const stored = db.prepare('SELECT rewardSettlementStatus, reviewReasonCode FROM attempts WHERE clientAttemptId = ?')
      .get('018f47f6-9f2c-7b9a-8a2e-0123456789ab');
    expect(stored).toEqual({ rewardSettlementStatus: 'eligible', reviewReasonCode: null });
  });

  it('never materializes a hidden attempt through normal or changed-attempt pulls', () => {
    db.prepare(`INSERT INTO attempts (createdAt, completedAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, clientAttemptId, protocolVersion, rewardSettlementStatus, deletedAt)
      VALUES (?, ?, 'x', 'x', 1, 1, 1, '[]', 'kiur', 'matemaatika', ?, 2, 'eligible', ?)`)
      .run('2026-07-13T10:00:00.000Z', '2026-07-13T10:00:00.000Z', 'hidden-attempt', '2026-07-13T11:00:00.000Z');
    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor() });
    expect(pull.pull.attempts.find((row) => row.clientAttemptId === 'hidden-attempt')).toBeUndefined();
  });
});

// OFF-07: a pull page carries only what the device lacks. Catalogues + grants go
// once (or when near expiry / contract drift); dashboards, task templates and
// today's assignments go on the final page only.
describe('slim pull pages (OFF-07)', () => {
  const DAY = 86_400_000;
  const inDays = (days: number) => new Date(Date.now() + days * DAY).toISOString();

  function seedAttempts(count: number) {
    const insert = db.prepare(`INSERT INTO attempts (createdAt, completedAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, clientAttemptId, protocolVersion, rewardSettlementStatus)
      VALUES (?, ?, 'Teisendamine', 'Lihtne', 10, 9, 60, '[]', 'kiur', 'matemaatika', ?, 2, 'eligible')`);
    db.transaction(() => {
      for (let index = 0; index < count; index += 1) insert.run('2026-07-13T10:00:00.000Z', '2026-07-13T10:00:00.000Z', `backfill-${index}`);
    })();
  }

  type Known = NonNullable<OfflineSyncPullRequestV2['knownCatalogues']>;

  // Pages until no hasMore flag is set. With `known`, behaves like a delta-aware
  // client (reports what it was handed); without, like a pre-OFF-07 client.
  function pullAll(start: OfflineSyncCursorV2, known: Known | undefined) {
    const pages: OfflineSyncPullResponseV2[] = [];
    let current = start;
    for (let page = 0; page < 10; page += 1) {
      const response = runSyncPullV2({
        protocolVersion: 2, phase: 'pull', device: device(), cursor: current,
        ...(known ? { knownCatalogues: { ...known } } : {})
      });
      pages.push(response);
      for (const catalogue of Object.values(response.pull.catalogues ?? {})) {
        if (catalogue && known) known[catalogue.learner] = { catalogueVersion: catalogue.version, validUntil: catalogue.validUntil };
      }
      current = response.nextCursor;
      if (!Object.values(response.hasMore).some(Boolean)) break;
    }
    return pages;
  }

  function knownFrom(response: OfflineSyncPullResponseV2): Known {
    const catalogues = response.pull.catalogues!;
    return {
      kiur: { catalogueVersion: catalogues.kiur!.version, validUntil: catalogues.kiur!.validUntil },
      kirsi: { catalogueVersion: catalogues.kirsi!.version, validUntil: catalogues.kirsi!.validUntil }
    };
  }

  it('sends catalogues and grants once and the projections only on the last page of a backfill', () => {
    seedAttempts(700);
    const pages = pullAll(cursor(), {});

    expect(pages).toHaveLength(3);
    expect(pages.map((page) => page.pull.attempts.length)).toEqual([300, 300, 100]);
    expect(Object.keys(pages[0].pull.catalogues ?? {}).sort()).toEqual(['kirsi', 'kiur']);
    expect(Object.keys(pages[0].pull.catalogueGrants ?? {}).sort()).toEqual(['kirsi', 'kiur']);
    for (const page of pages.slice(1)) {
      expect(page.pull.catalogues).toBeUndefined();
      expect(page.pull.catalogueGrants).toBeUndefined();
    }
    for (const page of pages.slice(0, 2)) {
      expect(page.pull.dashboards).toBeUndefined();
      expect(page.pull.taskTemplates).toBeUndefined();
      expect(page.pull.taskAssignments).toBeUndefined();
      expect(page.pull.taskAssignmentDates).toBeUndefined();
    }
    const last = pages[2].pull;
    expect(Object.keys(last.dashboards ?? {}).sort()).toEqual(['kirsi', 'kiur']);
    expect(Array.isArray(last.taskTemplates)).toBe(true);
    expect(Array.isArray(last.taskAssignments)).toBe(true);
    expect(last.taskAssignmentDates).toHaveLength(1);
    // Every page still advertises the current versions in the cursor.
    for (const page of pages) expect(page.nextCursor.catalogueVersions).toEqual(pages[0].nextCursor.catalogueVersions);
  });

  it('sends no catalogue to a client that already holds the current versions', () => {
    const first = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), knownCatalogues: {} });
    const known = knownFrom(first);

    const steady = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: known });
    expect(steady.pull.catalogues).toBeUndefined();
    expect(steady.pull.catalogueGrants).toBeUndefined();
    // A single-page pull is also the last page: projections are present.
    expect(steady.pull.dashboards).toBeDefined();

    // A learner the client does not report (e.g. its store was lost) is resent alone.
    const partial = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: { kiur: known.kiur } });
    expect(Object.keys(partial.pull.catalogues ?? {})).toEqual(['kirsi']);
    expect(Object.keys(partial.pull.catalogueGrants ?? {})).toEqual(['kirsi']);

    // A changed pool is a new version and is sent.
    updateChildLearningExerciseStatus('kiur.math.mootuhikud-pikkused', 'kiur', 'hidden');
    const changed = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: known });
    expect(Object.keys(changed.pull.catalogues ?? {})).toEqual(['kiur']);
    expect(changed.pull.catalogues!.kiur!.version).not.toBe(known.kiur!.catalogueVersion);
  });

  it('refreshes a grant once less than half of its window is left', () => {
    const first = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), knownCatalogues: {} });
    const known = (kiurDays: number): Known => ({
      kiur: { catalogueVersion: first.pull.catalogues!.kiur!.version, validUntil: inDays(kiurDays) },
      kirsi: { catalogueVersion: first.pull.catalogues!.kirsi!.version, validUntil: inDays(29) }
    });

    expect(runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: known(16) }).pull.catalogues).toBeUndefined();

    const refreshed = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: known(14) });
    expect(Object.keys(refreshed.pull.catalogueGrants ?? {})).toEqual(['kiur']);
    expect(new Date(refreshed.pull.catalogueGrants!.kiur!.validUntil).getTime()).toBeGreaterThan(Date.now() + 29 * DAY);
    const row = db.prepare('SELECT validUntil FROM catalogue_grants WHERE learner = ? AND deviceId = ?').get('kiur', deviceId) as { validUntil: string };
    expect(row.validUntil).toBe(refreshed.pull.catalogueGrants!.kiur!.validUntil);

    // The server's own row is checked too: it is what offline attempts are
    // validated against, so it must not lapse even if the client reports a long window.
    db.prepare('UPDATE catalogue_grants SET validUntil = ? WHERE learner = ?').run(inDays(10), 'kirsi');
    const serverSide = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: known(29) });
    expect(Object.keys(serverSide.pull.catalogueGrants ?? {})).toEqual(['kirsi']);
  });

  it('refreshes a grant whose contract drifted even with a long window left', () => {
    const first = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), knownCatalogues: {} });
    // As if the row predates a deploy that changed the runner contracts.
    db.prepare('UPDATE catalogue_grants SET runnerContractsJson = ? WHERE learner = ?').run('[]', 'kiur');

    const pull = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: knownFrom(first) });
    expect(Object.keys(pull.pull.catalogueGrants ?? {})).toEqual(['kiur']);
    const row = db.prepare('SELECT runnerContractsJson FROM catalogue_grants WHERE learner = ?').get('kiur') as { runnerContractsJson: string };
    expect(row.runnerContractsJson).not.toBe('[]');

    // A parent's reward-policy edit changes the expected policy version.
    const before = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: knownFrom(first) });
    expect(before.pull.catalogueGrants).toBeUndefined();
    db.prepare(`INSERT INTO reward_rules (type, thresholdDays, rewardStars, learnerScope, enabled, createdAt, updatedAt)
      VALUES ('learning_streak', 3, 2, 'both', 1, ?, ?)`).run(new Date().toISOString(), new Date().toISOString());
    const after = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: first.nextCursor, knownCatalogues: knownFrom(first) });
    expect(Object.keys(after.pull.catalogueGrants ?? {}).sort()).toEqual(['kirsi', 'kiur']);
    expect(after.pull.catalogueGrants!.kiur!.rewardPolicyVersion).not.toBe(first.pull.catalogueGrants!.kiur!.rewardPolicyVersion);
  });

  it('honours the client page size within safe bounds', () => {
    seedAttempts(260);
    const small = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), pageSize: { attempts: 100 } });
    expect(small.pull.attempts).toHaveLength(100);
    expect(small.hasMore.attempts).toBe(true);
    expect(small.pull.dashboards).toBeUndefined();

    const tiny = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), pageSize: { attempts: 1 } });
    expect(tiny.pull.attempts).toHaveLength(50);

    const huge = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), pageSize: { attempts: 500 } });
    expect(huge.pull.attempts).toHaveLength(260);
    expect(huge.hasMore.attempts).toBe(false);
  });

  // Deploy window: a client from before OFF-07 sends no knownCatalogues and
  // echoes cursor.catalogueVersions. It is judged by that cursor plus the
  // server's grant row, and every omitted section is one its syncApply already
  // skips when undefined.
  it('serves a pre-OFF-07 client from its cursor and the server grant row', () => {
    seedAttempts(350);
    const pages = pullAll(cursor(), undefined);
    expect(pages).toHaveLength(2);
    expect(pages[0].pull.catalogues).toBeDefined();
    expect(pages[1].pull.catalogues).toBeUndefined();
    expect(pages[0].pull.dashboards).toBeUndefined();
    expect(pages[1].pull.dashboards).toBeDefined();

    const steady = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: pages[1].nextCursor });
    expect(steady.pull.catalogues).toBeUndefined();

    db.prepare('UPDATE catalogue_grants SET validUntil = ? WHERE learner = ?').run(inDays(14), 'kiur');
    const nearExpiry = runSyncPullV2({ protocolVersion: 2, phase: 'pull', device: device(), cursor: pages[1].nextCursor });
    expect(Object.keys(nearExpiry.pull.catalogues ?? {})).toEqual(['kiur']);
  });

  it('rejects a malformed knownCatalogues field', () => {
    expect(() => parseOfflineSyncRequest({
      protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), knownCatalogues: { kiur: { catalogueVersion: 5 } }
    })).toThrow(PublicRequestError);
    expect(parseOfflineSyncRequest({
      protocolVersion: 2, phase: 'pull', device: device(), cursor: cursor(), knownCatalogues: { kiur: { catalogueVersion: 'abc', validUntil: inDays(20) } }
    })).toMatchObject({ phase: 'pull' });
  });
});
