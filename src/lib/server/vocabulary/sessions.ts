import { randomUUID } from 'node:crypto';
import db from '@/lib/db';
import { isoToAppDate } from '@/lib/appDate';
import { hasActiveLearningExercise } from '@/lib/learningExercises';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { nowIso, type Learner } from '@/lib/tasks';
import { ensureCurrentRewardPolicy, REWARD_ENGINE_VERSION } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2, getProjectedRewardV2 } from '@/lib/server/rewards/projection';
import {
  applyPracticeAction,
  applyStudyAction,
  applyTestAction,
  createPracticeState,
  createStudyState,
  createTestState,
  currentPracticeWord,
  currentStudyWord,
  currentTestWord,
  practiceTotal,
  prunePractice,
  studySummary,
  VocabRuleError,
  type PracticeState,
  type StudyAction,
  type StudyState,
  type TestState,
  type TypedAction,
  type TypedFeedback
} from '@/lib/vocabulary/engine';
import {
  VOCAB_CATEGORY,
  VOCAB_EXERCISE_ID,
  VOCAB_GENERATOR_VERSION,
  VOCAB_RUNNER_ID,
  VOCAB_RUNNER_VERSION,
  VOCAB_SUBJECT,
  VOCAB_TOPIC,
  vocabUnitLabel
} from '@/lib/vocabulary/constants';
import { displayPercent, requiredCorrect } from '@/lib/vocabulary/threshold';
import type { VocabEvent, VocabMode } from '@/lib/vocabulary/types';
import { applyEventToWeakState } from '@/lib/vocabulary/weakWords';
import { computeUnitAccess, unitOpenedByPassing } from '@/lib/vocabulary/unlock';
import {
  activeWordCounts,
  activeWords,
  ensureProgressRow,
  getUnit,
  progressRows,
  studiedWordIds,
  unstudiedWordIds,
  listUnits,
  toSnapshot,
  unitAccessFor,
  unitAccessInputs,
  VocabConflictError,
  VocabNotFoundError,
  type UnitRow,
  type WordRow
} from '@/lib/server/vocabulary/units';

// Server-authoritative vocabulary sessions. The browser only sends intents
// ("reveal", "known", "this is my answer"); the state machine in
// lib/vocabulary/engine.ts runs here, inside one SQLite transaction per action
// together with every side effect — events, word statistics, progress, the
// canonical attempt and its stars. Either all of it is stored or none of it.
//
// Idempotency: each action carries a client-minted actionId and the revision
// the client last saw. Repeating the last action (a retried request) returns the
// stored result without applying it again; an action based on an old revision
// (another tab moved on) is refused with the current state.

export class VocabForbiddenError extends Error {}
export class VocabStaleError extends Error {
  constructor(message: string, readonly view: SessionView) {
    super(message);
  }
}

type EngineState = StudyState | TestState | PracticeState;

type SessionRow = {
  id: string;
  learner: Learner;
  unitId: string | null;
  scopeKey: string;
  mode: VocabMode;
  status: 'active' | 'completed';
  unitContentVersion: number | null;
  stateJson: string;
  revision: number;
  lastActionId: string | null;
  attemptId: number | null;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export type VocabUnitInfo = { id: string; unitNumber: number; title: string; label: string };

export type SessionView = {
  id: string;
  revision: number;
  mode: VocabMode;
  status: 'active' | 'completed';
  unit: VocabUnitInfo | null;
  study?: {
    total: number;
    knownCount: number;
    firstKnown: number;
    neededRetry: number;
    remainingCards: number;
    // 'new' when only the words added since the last study are studied.
    scope: 'all' | 'new';
    completed: boolean;
    // `sequence` counts the assessments made so far, so it differs for every
    // card shown — including the same word coming straight back as the last
    // card in the deck.
    card: { wordId: string; sequence: number; estonian: string; english: string; pronunciation: string; revealed: boolean } | null;
  };
  test?: {
    phase: TestState['phase'];
    round: number;
    total: number;
    requiredCorrect: number;
    position: number;
    queueLength: number;
    prompt: { wordId: string; estonian: string } | null;
    feedback: TypedFeedback | null;
    lastRound: { round: number; correct: number; total: number; percent: number; wrongCount: number; passed: boolean } | null;
    firstRound: { correct: number; total: number; percent: number } | null;
    counted: boolean | null;
  };
  practice?: {
    total: number;
    masteredCount: number;
    firstTryCorrect: number;
    position: number;
    queueLength: number;
    completed: boolean;
    prompt: { wordId: string; estonian: string } | null;
    feedback: TypedFeedback | null;
  };
  reward: { awardedAmount: number; balanceAfter: number; held: boolean } | null;
  nextUnit: VocabUnitInfo | null;
  // True only when this very pass opened nextUnit; a unit that was already
  // open (manual unlock, earlier pass, a repeat pass) is just "next".
  nextUnitOpened: boolean;
  // Every unit the child can see is passed. Unpublished units are not counted
  // and are never mentioned to the child.
  allUnitsPassed: boolean;
};

export type SessionActionInput =
  | { type: 'reveal' }
  | { type: 'grade'; known: boolean }
  | { type: 'answer'; answer: string }
  | { type: 'continue' };

const MAX_ACTIVE_GAP_SECONDS = 120;

function unitInfo(unit: UnitRow | null): VocabUnitInfo | null {
  return unit ? { id: unit.id, unitNumber: unit.unitNumber, title: unit.title, label: vocabUnitLabel(unit) } : null;
}

function parseState(row: SessionRow): EngineState {
  const state = JSON.parse(row.stateJson) as EngineState;
  if (state.kind !== row.mode) throw new Error('Session state does not match its mode.');
  return state;
}

function loadSession(learner: Learner, sessionId: string): SessionRow {
  const row = db.prepare('SELECT * FROM english_vocab_sessions WHERE id = ? AND learner = ?').get(sessionId, learner) as SessionRow | undefined;
  if (!row) throw new VocabNotFoundError('Harjutuskorda ei leitud.');
  return row;
}

export function assertVocabularyEnabled(learner: Learner) {
  if (!hasActiveLearningExercise(learner, VOCAB_EXERCISE_ID)) throw new VocabForbiddenError('Sõnavara ei ole praegu avatud.');
}

function assertUnitAccess(learner: Learner, unitId: string, needTest: boolean) {
  const access = unitAccessFor(learner).get(unitId);
  if (!access || !access.accessible) throw new VocabForbiddenError('See õppetükk on veel lukus.');
  if (needTest && !access.testUnlocked) throw new VocabForbiddenError('Test avaneb, kui õppimine on lõpetatud.');
}

type PassOutcome = Pick<SessionView, 'nextUnit' | 'nextUnitOpened' | 'allUnitsPassed'>;

const NO_PASS_OUTCOME: PassOutcome = { nextUnit: null, nextUnitOpened: false, allUnitsPassed: false };

// What the passed-test screen may say about the next unit. Computed from the
// current data on every read (so a reload says the same thing): "opened" is
// decided by replaying the access rules without this pass — and only for the
// session that recorded the unit's first pass, since a repeat pass opens nothing.
function passOutcome(row: SessionRow, unit: UnitRow | null): PassOutcome {
  if (!unit) return NO_PASS_OUTCOME;
  const units = listUnits();
  const counts = activeWordCounts();
  const progress = progressRows(row.learner);
  const inputs = unitAccessInputs(row.learner, units, counts, progress);
  const access = computeUnitAccess(inputs);
  const nextRow = units.find((candidate) => candidate.unitNumber > unit.unitNumber && candidate.published && (counts.get(candidate.id) ?? 0) > 0);
  const nextUnit = nextRow && access.get(nextRow.id)?.accessible ? unitInfo(nextRow) : null;
  let nextUnitOpened = false;
  if (nextUnit && progress.get(unit.id)?.passedSessionId === row.id) {
    const beforePass = inputs.map((input) => input.id === unit.id ? { ...input, testPassed: false } : input);
    nextUnitOpened = unitOpenedByPassing(beforePass, unit.id) === nextUnit.id;
  }
  const visible = inputs.filter((input) => input.published);
  return { nextUnit, nextUnitOpened, allUnitsPassed: visible.length > 0 && visible.every((input) => input.testPassed) };
}

function rewardFor(row: SessionRow): SessionView['reward'] {
  if (!row.attemptId) return null;
  const attempt = db.prepare('SELECT rewardSettlementStatus FROM attempts WHERE id = ?').get(row.attemptId) as { rewardSettlementStatus: string } | undefined;
  const reward = getProjectedRewardV2(row.attemptId);
  return {
    awardedAmount: reward?.awardedAmount ?? 0,
    balanceAfter: reward?.balanceAfter ?? 0,
    held: attempt?.rewardSettlementStatus !== 'eligible'
  };
}

function typedPrompt(word: { id: string; estonian: string } | null) {
  return word ? { wordId: word.id, estonian: word.estonian } : null;
}

export function buildSessionView(row: SessionRow): SessionView {
  const state = parseState(row);
  const unit = row.unitId ? getUnit(row.unitId) : null;
  const base = { id: row.id, revision: row.revision, mode: row.mode, status: row.status, unit: unitInfo(unit), reward: rewardFor(row), ...NO_PASS_OUTCOME };

  if (state.kind === 'study') {
    const word = currentStudyWord(state);
    return {
      ...base,
      study: {
        ...studySummary(state),
        scope: state.scope ?? 'all',
        completed: state.completed,
        card: word ? { wordId: word.id, sequence: state.swipes, estonian: word.estonian, english: word.english, pronunciation: word.pronunciation, revealed: state.revealed } : null
      }
    };
  }

  if (state.kind === 'test') {
    const last = state.rounds.at(-1) ?? null;
    const first = state.rounds[0] ?? null;
    return {
      ...base,
      ...(state.phase === 'passed' ? passOutcome(row, unit) : NO_PASS_OUTCOME),
      test: {
        phase: state.phase,
        round: state.round,
        total: state.words.length,
        requiredCorrect: requiredCorrect(state.words.length),
        position: Math.min(state.cursor + 1, state.queue.length),
        queueLength: state.queue.length,
        // The English answer is never sent before the child has answered.
        prompt: typedPrompt(currentTestWord(state)),
        feedback: state.feedback,
        lastRound: last ? { round: last.round, correct: last.correct, total: last.total, percent: displayPercent(last.correct, last.total), wrongCount: last.wrongWordIds.length, passed: last.passed } : null,
        firstRound: first ? { correct: first.correct, total: first.total, percent: displayPercent(first.correct, first.total) } : null,
        // A passed test counts (stars, history, the daily contest) once per unit
        // per day; a repeat on the same day is practice.
        counted: state.phase === 'passed' ? row.attemptId !== null : null
      }
    };
  }

  return {
    ...base,
    practice: {
      total: practiceTotal(state),
      masteredCount: state.mastered.length,
      firstTryCorrect: state.firstTryCorrect.length,
      position: Math.min(state.cursor + 1, state.queue.length),
      queueLength: state.queue.length,
      completed: state.completed,
      prompt: typedPrompt(currentPracticeWord(state)),
      feedback: state.feedback
    }
  };
}

// Reading a session is subject to the same rules as acting in it: the
// exercise must be enabled and a study or test unit must still be open.
export function getSessionView(learner: Learner, sessionId: string): SessionView {
  assertVocabularyEnabled(learner);
  const row = loadSession(learner, sessionId);
  if (row.unitId && row.mode !== 'practice') assertUnitAccess(learner, row.unitId, false);
  return buildSessionView(row);
}

/* ------------------------------------------------------------- start */

function unitsWithActiveTest(learner: Learner): Set<string> {
  const rows = db.prepare("SELECT unitId FROM english_vocab_sessions WHERE learner = ? AND mode = 'test' AND status = 'active' AND unitId IS NOT NULL").all(learner) as Array<{ unitId: string }>;
  return new Set(rows.map((row) => row.unitId));
}

// Words to practise: weak, not retired, in an open unit, and not in a unit
// whose test is under way — those wait until the test is over.
function weakWordRows(learner: Learner, unitId: string | null): WordRow[] {
  const access = unitAccessFor(learner);
  const testing = unitsWithActiveTest(learner);
  const rows = db.prepare(`
    SELECT w.* FROM english_vocab_word_stats s
    JOIN english_vocab_words w ON w.id = s.wordId
    JOIN english_vocab_units u ON u.id = w.unitId
    WHERE s.learner = ? AND s.needsPractice = 1 AND w.retiredAt IS NULL
    ORDER BY u.unitNumber ASC, w.position ASC
  `).all(learner) as WordRow[];
  return rows.filter((row) => (unitId === null || row.unitId === unitId) && access.get(row.unitId)?.accessible && !testing.has(row.unitId));
}

// Brings a practice session in line with the current words: words that
// recovered, were retired or became unavailable are dropped. Returns the
// row as stored afterwards.
function refreshPractice(row: SessionRow, actionId: string | null): SessionRow {
  const state = parseState(row);
  if (state.kind !== 'practice' || row.status !== 'active') return row;
  const keep = new Set(weakWordRows(row.learner, row.unitId).map((word) => word.id));
  const pruned = prunePractice(state, keep);
  if (pruned === state) return row;
  const now = nowIso();
  db.prepare(`
    UPDATE english_vocab_sessions
    SET stateJson = ?, revision = revision + 1, lastActionId = COALESCE(?, lastActionId), status = ?, completedAt = ?, updatedAt = ?
    WHERE id = ? AND revision = ?
  `).run(JSON.stringify(pruned), actionId, pruned.completed ? 'completed' : 'active', pruned.completed ? now : null, now, row.id, row.revision);
  return loadSession(row.learner, row.id);
}

// Has a passed test of this unit already counted today?
function testCountedOn(learner: Learner, unitId: string, completionDate: string) {
  return Boolean(db.prepare(`
    SELECT 1 FROM english_vocab_sessions s JOIN attempts a ON a.id = s.attemptId
    WHERE s.learner = ? AND s.unitId = ? AND s.mode = 'test' AND a.completionDate = ?
    LIMIT 1
  `).get(learner, unitId, completionDate));
}

export function weakWordCounts(learner: Learner): Map<string, number> {
  const counts = new Map<string, number>();
  for (const row of weakWordRows(learner, null)) counts.set(row.unitId, (counts.get(row.unitId) ?? 0) + 1);
  return counts;
}

export function activeSessionIds(learner: Learner): Array<{ id: string; unitId: string | null; mode: VocabMode }> {
  return db.prepare("SELECT id, unitId, mode FROM english_vocab_sessions WHERE learner = ? AND status = 'active'").all(learner) as Array<{ id: string; unitId: string | null; mode: VocabMode }>;
}

function seedFor(id: string) {
  let hash = 2166136261;
  for (const char of id) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619) >>> 0;
  return hash;
}

// Starts a session, or returns the one already in progress for this unit and
// mode. Every access rule is checked here, so a direct URL or API call cannot
// open a locked unit or a locked test.
export function startOrResumeSession(learner: Learner, input: { unitId: string | null; mode: VocabMode }): SessionView {
  assertVocabularyEnabled(learner);
  const { mode } = input;
  const unitId = input.unitId;
  if (mode !== 'practice' && !unitId) throw new VocabNotFoundError('Õppetükk puudub.');
  const scopeKey = unitId ?? '*';

  return db.transaction(() => {
    const found = db.prepare("SELECT * FROM english_vocab_sessions WHERE learner = ? AND scopeKey = ? AND mode = ? AND status = 'active'").get(learner, scopeKey, mode) as SessionRow | undefined;
    // A practice session is refreshed first; if nothing is left to practise
    // it closes, and a fresh one (if any words remain) starts below.
    const existing = found && found.mode === 'practice' ? refreshPractice(found, null) : found;
    if (existing && existing.status === 'active') {
      if (existing.unitId && existing.mode !== 'practice') assertUnitAccess(learner, existing.unitId, false);
      return buildSessionView(existing);
    }

    let unit: UnitRow | null = null;
    if (unitId) {
      unit = getUnit(unitId);
      if (!unit) throw new VocabNotFoundError('Õppetükki ei leitud.');
      assertUnitAccess(learner, unitId, mode === 'test');
    }

    const id = `vs_${randomUUID()}`;
    const seed = seedFor(id);
    let state: EngineState;
    if (mode === 'study') {
      const words = activeWords(unitId!);
      // A unit studied before the parent added words, and not passed yet:
      // study just the new words, after which the test opens again.
      const fresh = new Set(unstudiedWordIds(progressRows(learner).get(unitId!), words.map((word) => word.id)));
      state = fresh.size > 0
        ? createStudyState(words.filter((word) => fresh.has(word.id)).map(toSnapshot), seed, 'new')
        : createStudyState(words.map(toSnapshot), seed, 'all');
    } else if (mode === 'test') state = createTestState(activeWords(unitId!).map(toSnapshot), seed);
    else {
      const words = weakWordRows(learner, unitId);
      if (words.length === 0) {
        if (unitId && unitsWithActiveTest(learner).has(unitId)) throw new VocabRuleError('Selle õppetüki eksitud sõnu saab korrata pärast testi.');
        throw new VocabRuleError('Praegu ei ole ühtegi sõna, mida korrata.');
      }
      state = createPracticeState(words.map(toSnapshot), seed);
    }

    const now = nowIso();
    db.prepare(`
      INSERT INTO english_vocab_sessions (id, learner, unitId, scopeKey, mode, status, unitContentVersion, stateJson, revision, startedAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'active', ?, ?, 0, ?, ?)
    `).run(id, learner, unitId, scopeKey, mode, unit?.contentVersion ?? null, JSON.stringify(state), now, now);
    if (unitId) ensureProgressRow(learner, unitId);
    return buildSessionView(loadSession(learner, id));
  }).immediate();
}

/* ------------------------------------------------------------ action */

function parseAction(mode: VocabMode, raw: unknown): StudyAction | TypedAction {
  const action = raw as Record<string, unknown> | null;
  const type = action?.type;
  if (mode === 'study') {
    if (type === 'reveal') return { type: 'reveal' };
    if (type === 'grade' && typeof action?.known === 'boolean') return { type: 'grade', known: action.known };
  } else {
    if (type === 'continue') return { type: 'continue' };
    if (type === 'answer' && typeof action?.answer === 'string') return { type: 'answer', answer: action.answer };
  }
  throw new VocabRuleError('Tundmatu tegevus.');
}

const STAT_COLUMNS: Record<VocabEvent['phase'], [string, string]> = {
  study: ['studyCorrect', 'studyWrong'],
  full: ['testCorrect', 'testWrong'],
  correction: ['correctionCorrect', 'correctionWrong'],
  practice: ['practiceCorrect', 'practiceWrong']
};

function recordEvent(row: SessionRow, event: VocabEvent, now: string) {
  db.prepare(`
    INSERT INTO english_vocab_events (sessionId, learner, unitId, wordId, phase, roundNumber, correct, answer, expected, firstEncounter, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(row.id, row.learner, row.unitId ?? (db.prepare('SELECT unitId FROM english_vocab_words WHERE id = ?').get(event.wordId) as { unitId: string } | undefined)?.unitId ?? null,
    event.wordId, event.phase, event.round, event.correct ? 1 : 0, event.answer, event.expected, event.firstEncounter ? 1 : 0, now);

  db.prepare(`
    INSERT INTO english_vocab_word_stats (learner, wordId, updatedAt) VALUES (?, ?, ?)
    ON CONFLICT(learner, wordId) DO NOTHING
  `).run(row.learner, event.wordId, now);
  const stats = db.prepare('SELECT needsPractice, recoveryStreak FROM english_vocab_word_stats WHERE learner = ? AND wordId = ?').get(row.learner, event.wordId) as { needsPractice: number; recoveryStreak: number };
  const weak = applyEventToWeakState({ needsPractice: Boolean(stats.needsPractice), recoveryStreak: stats.recoveryStreak }, event);
  const column = STAT_COLUMNS[event.phase][event.correct ? 0 : 1];
  db.prepare(`
    UPDATE english_vocab_word_stats
    SET ${column} = ${column} + 1, needsPractice = ?, recoveryStreak = ?, lastResult = ?, lastPhase = ?, lastAttemptAt = ?, updatedAt = ?
    WHERE learner = ? AND wordId = ?
  `).run(weak.needsPractice ? 1 : 0, weak.recoveryStreak, event.correct ? 'correct' : 'wrong', event.phase, now, now, row.learner, event.wordId);
}

// Active time, not wall time: a gap longer than two minutes between answers
// (the child left the screen) counts as two minutes.
function activeSeconds(sessionId: string, startedAt: string, now: string) {
  const times = (db.prepare('SELECT createdAt FROM english_vocab_events WHERE sessionId = ? ORDER BY id').all(sessionId) as Array<{ createdAt: string }>).map((row) => Date.parse(row.createdAt));
  let previous = Date.parse(startedAt);
  let total = 0;
  for (const time of [...times, Date.parse(now)]) {
    if (Number.isFinite(time) && Number.isFinite(previous)) total += Math.min(Math.max(0, (time - previous) / 1000), MAX_ACTIVE_GAP_SECONDS);
    previous = time;
  }
  return Math.round(total);
}

// The one canonical learning attempt a passed test produces. It is a
// protocol-v2 row settled by the existing reward projection, so the parent's
// learning-point settings, decay, daily cap, streaks and reward rules apply
// exactly as for every other exercise. Correction rounds never create one.
function insertPassedTestAttempt(row: SessionRow, state: TestState, now: string) {
  const clientAttemptId = `vocab-test:${row.id}`;
  const existing = db.prepare('SELECT id FROM attempts WHERE clientAttemptId = ?').get(clientAttemptId) as { id: number } | undefined;
  if (existing) return existing.id;

  const passing = state.rounds.at(-1)!;
  const answers = new Map(state.roundAnswers.map((answer) => [answer.wordId, answer]));
  const questions = state.words.map((word) => {
    const answer = answers.get(word.id);
    return {
      id: `${row.id}:${passing.round}:${word.id}`,
      taskId: word.id,
      vocabularyId: word.id,
      question: word.estonian,
      estonian: word.estonian,
      userAnswer: answer?.answer ?? '',
      correctAnswer: 0,
      correctAnswerText: word.english,
      acceptedAnswers: word.acceptedAnswers,
      isCorrect: answer?.correct ?? false,
      kind: 'text' as const
    };
  });
  const completionDate = isoToAppDate(now) ?? now.slice(0, 10);
  // The parent can hide the exercise while a test is under way. The attempt
  // is still recorded truthfully, but held for the parent's review instead of
  // awarding stars, exactly like any other not-permitted attempt.
  const permitted = hasActiveLearningExercise(row.learner, VOCAB_EXERCISE_ID);
  const policy = ensureCurrentRewardPolicy();
  const result = db.prepare(`
    INSERT INTO attempts (
      createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId,
      clientAttemptId, deviceId, startedAt, completedAt, rawDeviceCompletedAt, syncedAt,
      catalogueVersion, clientCorrectedCompletedAt, effectiveCompletedAt, completionDate, clockStatus, clockSkewMs,
      rewardPolicyVersion, rewardEngineVersion, generatorVersion, runnerId, runnerVersion,
      rotationVersion, runnerSeed, questionIdsJson, protocolVersion, rewardSettlementStatus, reviewReasonCode
    ) VALUES (?, ?, 'Tavaline', ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, NULL, ?, ?, ?, 'ok', 0, ?, ?, ?, ?, ?, 1, ?, ?, 2, ?, ?)
  `).run(
    now, VOCAB_CATEGORY, passing.total, passing.correct, activeSeconds(row.id, row.startedAt, now), JSON.stringify(questions),
    row.learner, VOCAB_SUBJECT, VOCAB_TOPIC, VOCAB_EXERCISE_ID,
    clientAttemptId, row.startedAt, now, now, now,
    now, now, completionDate,
    policy.version, REWARD_ENGINE_VERSION, VOCAB_GENERATOR_VERSION, VOCAB_RUNNER_ID, VOCAB_RUNNER_VERSION,
    String(state.seed), JSON.stringify(state.words.map((word) => word.id)),
    permitted ? 'eligible' : 'withheld', permitted ? null : 'not_permitted'
  );
  const attemptId = Number(result.lastInsertRowid);
  if (permitted) {
    applyRewardProjectionV2(row.learner, attemptId);
    recordDailyLeaderboard(completionDate);
  }
  return attemptId;
}

function completeStudy(row: SessionRow, state: StudyState, now: string) {
  const summary = studySummary(state);
  ensureProgressRow(row.learner, row.unitId!);
  const progress = progressRows(row.learner).get(row.unitId!);
  const studied = [...new Set([...studiedWordIds(progress), ...state.words.map((word) => word.id)])].sort();
  db.prepare('UPDATE english_vocab_progress SET studiedWordIdsJson = ? WHERE learner = ? AND unitId = ?').run(JSON.stringify(studied), row.learner, row.unitId);
  // Studying only the newly added words does not replace the record of the
  // first full study.
  if (state.scope === 'new') {
    db.prepare('UPDATE english_vocab_progress SET updatedAt = ? WHERE learner = ? AND unitId = ?').run(now, row.learner, row.unitId);
    return;
  }
  // The first completion is the record; later study rounds only add to the
  // count and never overwrite it.
  db.prepare(`
    UPDATE english_vocab_progress
    SET studyFirstKnown = CASE WHEN studyCompletedAt IS NULL THEN ? ELSE studyFirstKnown END,
        studyTotal = CASE WHEN studyCompletedAt IS NULL THEN ? ELSE studyTotal END,
        studyCompletedAt = COALESCE(studyCompletedAt, ?),
        studyCompletions = studyCompletions + 1,
        updatedAt = ?
    WHERE learner = ? AND unitId = ?
  `).run(summary.firstKnown, summary.total, now, now, row.learner, row.unitId);
}

function completeTest(row: SessionRow, state: TestState, now: string) {
  const unit = getUnit(row.unitId!);
  if (!unit) throw new VocabNotFoundError('Õppetükki ei leitud.');
  const passing = state.rounds.at(-1)!;
  // Once per unit per day: a repeat pass on the same day is practice and
  // creates no attempt (no stars, no history row, no contest count).
  const completionDate = isoToAppDate(now) ?? now.slice(0, 10);
  const attemptId = testCountedOn(row.learner, unit.id, completionDate) ? null : insertPassedTestAttempt(row, state, now);
  ensureProgressRow(row.learner, unit.id);
  // The original pass is never overwritten by a later repeat.
  db.prepare(`
    UPDATE english_vocab_progress
    SET passedScore = CASE WHEN testPassedAt IS NULL THEN ? ELSE passedScore END,
        passedTotal = CASE WHEN testPassedAt IS NULL THEN ? ELSE passedTotal END,
        passedRound = CASE WHEN testPassedAt IS NULL THEN ? ELSE passedRound END,
        passedSessionId = CASE WHEN testPassedAt IS NULL THEN ? ELSE passedSessionId END,
        passedAttemptId = CASE WHEN testPassedAt IS NULL THEN ? ELSE passedAttemptId END,
        testPassedAt = COALESCE(testPassedAt, ?),
        testPasses = testPasses + 1,
        updatedAt = ?
    WHERE learner = ? AND unitId = ?
  `).run(passing.correct, passing.total, passing.round, row.id, attemptId, now, now, row.learner, unit.id);
  return attemptId;
}

export function applySessionAction(learner: Learner, sessionId: string, input: { actionId: unknown; revision: unknown; action: unknown }): SessionView {
  const actionId = typeof input.actionId === 'string' && /^[A-Za-z0-9_-]{8,80}$/u.test(input.actionId) ? input.actionId : null;
  if (!actionId) throw new VocabRuleError('Tegevuse tunnus puudub.');
  const revision = Number(input.revision);
  if (!Number.isInteger(revision) || revision < 0) throw new VocabRuleError('Sessiooni versioon puudub.');

  return db.transaction(() => {
    const row = loadSession(learner, sessionId);
    // A retried request: the action is already stored, return its result.
    if (row.lastActionId === actionId) return buildSessionView(row);
    if (row.status !== 'active') throw new VocabStaleError('See harjutuskord on juba lõpetatud.', buildSessionView(row));
    if (row.revision !== revision) throw new VocabStaleError('Harjutus jätkus teises aknas.', buildSessionView(row));
    // A test already under way may finish even if words were added meanwhile
    // (it works from its own copy); the unit itself must still be open.
    if (row.unitId && row.mode !== 'practice') assertUnitAccess(learner, row.unitId, false);
    if (row.mode === 'practice') {
      const refreshed = refreshPractice(row, null);
      if (refreshed.status !== 'active') return buildSessionView(refreshed);
      if (refreshed.revision !== row.revision) {
        // Words dropped out before this action: continue from the new state.
        row.stateJson = refreshed.stateJson;
        row.revision = refreshed.revision;
      }
    }

    const state = parseState(row);
    const action = parseAction(row.mode, input.action);
    const now = nowIso();
    let next: EngineState;
    let event: VocabEvent | null;
    let completed = false;
    let attemptId: number | null = row.attemptId;

    if (state.kind === 'study') {
      const result = applyStudyAction(state, action as StudyAction);
      next = result.state;
      event = result.event;
      completed = result.state.completed;
    } else if (state.kind === 'test') {
      const result = applyTestAction(state, action as TypedAction);
      next = result.state;
      event = result.event;
      if (result.completedRound) {
        const record = result.completedRound;
        db.prepare(`
          INSERT INTO english_vocab_test_rounds (sessionId, learner, unitId, roundNumber, kind, total, correct, wrongWordIdsJson, answerCount, passed, completedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(row.id, learner, row.unitId, record.round, record.kind, record.total, record.correct, JSON.stringify(record.wrongWordIds),
          record.kind === 'full' ? record.total : record.correctionAnswers, record.kind === 'full' && record.passed ? 1 : 0, now);
      }
      completed = result.state.phase === 'passed';
    } else {
      const result = applyPracticeAction(state, action as TypedAction);
      next = result.state;
      event = result.event;
      completed = result.state.completed;
    }

    if (event) recordEvent(row, event, now);
    if (completed && next.kind === 'study') completeStudy(row, next, now);
    if (completed && next.kind === 'test') attemptId = completeTest(row, next, now);

    const update = db.prepare(`
      UPDATE english_vocab_sessions
      SET stateJson = ?, revision = revision + 1, lastActionId = ?, status = ?, completedAt = ?, attemptId = ?, updatedAt = ?
      WHERE id = ? AND revision = ?
    `).run(JSON.stringify(next), actionId, completed ? 'completed' : 'active', completed ? now : null, attemptId, now, row.id, row.revision);
    if (update.changes !== 1) throw new VocabConflictError('Harjutust ei saanud salvestada.');
    return buildSessionView(loadSession(learner, sessionId));
  }).immediate();
}
