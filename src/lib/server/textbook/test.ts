import { randomUUID } from 'node:crypto';
import db from '@/lib/db';
import { nowIso } from '@/lib/tasks';
import {
  toClientQuestion,
  type ObjectiveRef,
  type TestAnswerResponse,
  type TestResultView,
  type TestSessionView,
  type TestSubmitResponse,
  type TextbookErrorCode,
  type TextbookLearner
} from '@/lib/textbook/api';
import { TextbookRuleError } from '@/lib/textbook/errors';
import { displayPercent } from '@/lib/textbook/scoring';
import { seedFromString } from '@/lib/textbook/scoring';
import { buildTestSnapshot, historyFromSnapshots, TestBuildError, type TestSnapshot } from '@/lib/textbook/testSelection';
import { answeredCount, createTestState, saveTestAnswer, submitTest, type TestRunState } from '@/lib/textbook/testSession';
import { forbidden, notFound, TextbookApiError, type TextbookContext } from '@/lib/server/textbook/context';
import { resolveUnitState } from '@/lib/server/textbook/learner';
import {
  allVisiblePassed,
  ensureProgressRow,
  nextOpenUnit,
  nextUnitOpenedBy,
  objectiveRef,
  parseObjectives,
  type CourseState
} from '@/lib/server/textbook/progress';
import { rewardViewFor, settlePassedTest } from '@/lib/server/textbook/rewards';
import { recordObjectiveResult } from '@/lib/server/textbook/stats';

// The final test: 20 questions frozen at start (questions, order, option
// order, keys — SPEC A4), answers saved without feedback, one submit that
// grades everything in integer arithmetic and, in the same transaction,
// records the round, the weak-area statistics, the first pass (which opens the
// next published unit) and the reward. The browser never gets a key before
// submit: questions go out through toClientQuestion only.

type TestRow = {
  id: string;
  learner: TextbookLearner;
  courseId: string;
  unitId: string;
  attemptNumber: number;
  status: 'active' | 'submitted';
  contentVersion: string;
  stateJson: string;
  objectivesJson: string;
  revision: number;
  lastActionId: string | null;
  correct: number | null;
  total: number | null;
  passed: number | null;
  attemptId: number | null;
  startedAt: string;
  updatedAt: string;
  submittedAt: string | null;
};

export const TEST_SESSION_PATTERN = /^tt_[0-9a-f-]{36}$/u;

function loadRow(context: TextbookContext, sessionId: string): TestRow {
  const row = TEST_SESSION_PATTERN.test(sessionId)
    ? db.prepare('SELECT * FROM textbook_test_sessions WHERE id = ? AND learner = ?').get(sessionId, context.learner) as TestRow | undefined
    : undefined;
  if (!row) throw notFound('Testi ei leitud.');
  return row;
}

function parseState(row: TestRow): TestRunState {
  const state = JSON.parse(row.stateJson) as TestRunState;
  if (state?.kind !== 'test_run' || state.version !== 1 || !Array.isArray(state.snapshot?.questions)) throw new Error('Textbook test state is invalid.');
  return state;
}

function resultView(context: TextbookContext, row: TestRow, state: TestRunState, courseState: CourseState): TestResultView | null {
  const result = state.result;
  if (row.status !== 'submitted' || !result) return null;
  const refs = new Map(parseObjectives(row.objectivesJson).map((ref) => [ref.objectiveId, ref]));
  const ref = (id: string): ObjectiveRef => refs.get(id) ?? { objectiveId: id, description: id, required: true };
  const explanations = new Map(state.snapshot.questions.map((frozen) => [frozen.question.id, frozen.question.explanation]));
  const unitState = courseState.byId.get(row.unitId);
  const firstPass = result.passed && unitState?.progress?.passedSessionId === row.id;
  const nextUnit = result.passed ? nextOpenUnit(courseState, row.unitId) : null;
  return {
    correct: result.correct,
    total: result.total,
    requiredCorrect: result.requiredCorrect,
    passed: result.passed,
    percent: displayPercent(result.correct, result.total),
    missedObjectives: result.missedObjectiveIds.map(ref),
    review: result.questions.map((item) => ({
      questionId: item.questionId,
      correct: item.correct,
      response: item.response,
      correctResponse: item.correctResponse,
      explanation: explanations.get(item.questionId) ?? '',
      objective: ref(item.primaryObjectiveId)
    })),
    retakePracticeRequired: !result.passed && courseState.course.settings.retakePracticeRequired,
    firstPass,
    nextUnit,
    nextUnitOpened: firstPass && nextUnit !== null && nextUnitOpenedBy(courseState, row.unitId, row.id),
    allUnitsPassed: allVisiblePassed(courseState),
    // Preview never has an attempt, so never a reward.
    reward: context.realEffects ? rewardViewFor(row.attemptId) : null
  };
}

function buildView(context: TextbookContext, row: TestRow, courseState: CourseState): TestSessionView {
  const state = parseState(row);
  const submitted = row.status === 'submitted';
  return {
    scope: context.scope,
    sessionId: row.id,
    revision: row.revision,
    courseId: row.courseId,
    unitId: row.unitId,
    status: row.status,
    total: state.snapshot.questions.length,
    requiredCorrect: state.snapshot.requiredCorrect,
    questions: state.snapshot.questions.map((frozen) => toClientQuestion(frozen)),
    answers: JSON.parse(JSON.stringify(state.answers)) as TestSessionView['answers'],
    answeredCount: answeredCount(state),
    result: submitted ? resultView(context, row, state, courseState) : null
  };
}

function viewWithAccess(context: TextbookContext, row: TestRow): TestSessionView {
  const { courseState } = resolveUnitState(context, row.courseId, row.unitId);
  return buildView(context, row, courseState);
}

export function getTestSession(context: TextbookContext, sessionId: string): TestSessionView {
  return viewWithAccess(context, loadRow(context, sessionId));
}

// Starts the unit's test or resumes the one in progress (whatever content
// version it was built from: it runs on its own frozen copy).
export function startTest(context: TextbookContext, courseId: string, unitId: string): TestSessionView {
  return db.transaction(() => {
    const { courseState, state } = resolveUnitState(context, courseId, unitId);
    if (state.activeTestSessionId) return buildView(context, loadRow(context, state.activeTestSessionId), courseState);
    if (!state.facts.testPassed) {
      if (!state.gates.readingComplete) throw new TextbookApiError('gate_reading', 'Loe enne testi kõik õppetunnid läbi.');
      if (state.gates.retakePracticePending) throw new TextbookApiError('gate_retake_practice', 'Enne uut testi harjuta läbi mõisted, mis eelmises testis valesti läksid.');
    }
    if (!state.gates.testUnlocked) throw new TextbookApiError('gate_practice', 'Test avaneb, kui harjutus on tehtud.');

    const now = nowIso();
    // A practice run left open would let answers be checked mid-test: set it aside.
    if (state.activePracticeSessionId) {
      db.prepare("UPDATE textbook_practice_sessions SET status = 'abandoned', updatedAt = ? WHERE id = ?").run(now, state.activePracticeSessionId);
    }
    const previous = (db.prepare('SELECT stateJson FROM textbook_test_sessions WHERE learner = ? AND courseId = ? AND unitId = ? ORDER BY attemptNumber').all(context.learner, courseId, unitId) as Array<{ stateJson: string }>)
      .map((item) => (JSON.parse(item.stateJson) as TestRunState).snapshot as Pick<TestSnapshot, 'questions'>);
    const attemptNumber = previous.length + 1;
    const id = `tt_${randomUUID()}`;
    let snapshot: TestSnapshot;
    try {
      snapshot = buildTestSnapshot({ courseId, unit: state.unit, settings: courseState.course.settings, seed: seedFromString(id), history: historyFromSnapshots(previous) });
    } catch (error) {
      if (error instanceof TestBuildError) throw forbidden('Testi ei saa praegu koostada.');
      throw error;
    }
    const run = createTestState(snapshot);
    db.prepare(`
      INSERT INTO textbook_test_sessions (id, learner, courseId, unitId, attemptNumber, status, contentVersion, stateJson, objectivesJson, revision, startedAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, 0, ?, ?)
    `).run(id, context.learner, courseId, unitId, attemptNumber, state.unit.contentVersion, JSON.stringify(run), JSON.stringify(state.unit.objectives.map(objectiveRef)), now, now);
    ensureProgressRow(context.learner, courseId, unitId, now);
    return viewWithAccess(context, loadRow(context, id));
  }).immediate();
}

const RULE_CODES: Partial<Record<TextbookRuleError['code'], TextbookErrorCode>> = {
  unknown_question: 'invalid_request',
  invalid_response: 'invalid_response',
  incomplete_response: 'incomplete_response',
  not_all_answered: 'not_all_answered',
  already_submitted: 'already_submitted'
};

function ruleError(error: unknown, session: () => TestSessionView): never {
  if (error instanceof TextbookRuleError) {
    const code = RULE_CODES[error.code] ?? 'invalid_request';
    throw new TextbookApiError(code, error.message, code === 'already_submitted' ? { session: session() } : {});
  }
  throw error;
}

// Common checks for a test action: retried request, submitted, stale revision,
// unit still open.
function guard(context: TextbookContext, sessionId: string, input: { actionId: string; revision: number }) {
  const row = loadRow(context, sessionId);
  if (row.lastActionId === input.actionId) return { row, replay: true as const };
  if (row.status !== 'active') throw new TextbookApiError('already_submitted', 'Test on juba esitatud.', { session: viewWithAccess(context, row) });
  if (row.revision !== input.revision) throw new TextbookApiError('stale', 'Test jätkus teises aknas.', { session: viewWithAccess(context, row) });
  resolveUnitState(context, row.courseId, row.unitId);
  return { row, replay: false as const };
}

export type TestAnswerInput = { actionId: string; revision: number; questionId: string; response: unknown };

// Saves or replaces one answer. No grading, no feedback.
export function saveAnswer(context: TextbookContext, sessionId: string, input: TestAnswerInput): TestAnswerResponse {
  return db.transaction(() => {
    const { row, replay } = guard(context, sessionId, input);
    if (replay) return { session: viewWithAccess(context, row) };
    let next: TestRunState;
    try {
      next = saveTestAnswer(parseState(row), input.questionId, input.response);
    } catch (error) {
      ruleError(error, () => viewWithAccess(context, row));
    }
    const now = nowIso();
    const update = db.prepare('UPDATE textbook_test_sessions SET stateJson = ?, revision = revision + 1, lastActionId = ?, updatedAt = ? WHERE id = ? AND revision = ?')
      .run(JSON.stringify(next), input.actionId, now, row.id, row.revision);
    if (update.changes !== 1) throw new TextbookApiError('stale', 'Test jätkus teises aknas.', { session: viewWithAccess(context, loadRow(context, sessionId)) });
    return { session: viewWithAccess(context, loadRow(context, sessionId)) };
  }).immediate();
}

export type TestSubmitInput = { actionId: string; revision: number };

export function submit(context: TextbookContext, sessionId: string, input: TestSubmitInput): TestSubmitResponse {
  return db.transaction(() => {
    const { row, replay } = guard(context, sessionId, input);
    if (replay) {
      const session = viewWithAccess(context, row);
      if (!session.result) throw new TextbookApiError('stale', 'Test ei ole veel esitatud.', { session });
      return { session, result: session.result };
    }
    const { courseState } = resolveUnitState(context, row.courseId, row.unitId);
    let graded: ReturnType<typeof submitTest>;
    try {
      graded = submitTest(parseState(row));
    } catch (error) {
      ruleError(error, () => viewWithAccess(context, row));
    }
    const { state, result } = graded;
    const now = nowIso();

    db.prepare(`
      INSERT INTO textbook_test_rounds (sessionId, learner, courseId, unitId, attemptNumber, contentVersion, correct, total, requiredCorrect, passed, questionIdsJson, missedObjectiveIdsJson, submittedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(row.id, context.learner, row.courseId, row.unitId, row.attemptNumber, row.contentVersion, result.correct, result.total, result.requiredCorrect,
      result.passed ? 1 : 0, JSON.stringify(state.snapshot.questions.map((frozen) => frozen.question.id)), JSON.stringify(result.missedObjectiveIds), now);

    if (context.realEffects) {
      for (const item of result.questions) recordObjectiveResult(context, row.courseId, row.unitId, item.primaryObjectiveId, 'test', item.correct, now);
    }

    let attemptId: number | null = null;
    if (result.passed) {
      // Stars and the leaderboard for a real child only (once per unit per day).
      if (context.realEffects) {
        attemptId = settlePassedTest(context, { sessionId: row.id, course: courseState.course, unitId: row.unitId, startedAt: row.startedAt, state, now });
      }
      ensureProgressRow(context.learner, row.courseId, row.unitId, now);
      // The first pass is the record and is never overwritten; it is what
      // keeps the unit open and opens the next published unit.
      db.prepare(`
        UPDATE textbook_unit_progress
        SET passedScore = CASE WHEN firstPassedAt IS NULL THEN ? ELSE passedScore END,
            passedTotal = CASE WHEN firstPassedAt IS NULL THEN ? ELSE passedTotal END,
            passedSessionId = CASE WHEN firstPassedAt IS NULL THEN ? ELSE passedSessionId END,
            passedContentVersion = CASE WHEN firstPassedAt IS NULL THEN ? ELSE passedContentVersion END,
            passedAttemptId = CASE WHEN firstPassedAt IS NULL THEN ? ELSE passedAttemptId END,
            firstPassedAt = COALESCE(firstPassedAt, ?),
            passCount = passCount + 1,
            updatedAt = ?
        WHERE learner = ? AND courseId = ? AND unitId = ?
      `).run(result.correct, result.total, row.id, row.contentVersion, attemptId, now, now, context.learner, row.courseId, row.unitId);
    }

    const update = db.prepare(`
      UPDATE textbook_test_sessions
      SET stateJson = ?, status = 'submitted', revision = revision + 1, lastActionId = ?, correct = ?, total = ?, passed = ?, attemptId = ?, submittedAt = ?, updatedAt = ?
      WHERE id = ? AND revision = ? AND status = 'active'
    `).run(JSON.stringify(state), input.actionId, result.correct, result.total, result.passed ? 1 : 0, attemptId, now, now, row.id, row.revision);
    if (update.changes !== 1) throw new TextbookApiError('stale', 'Test jätkus teises aknas.');
    const session = viewWithAccess(context, loadRow(context, sessionId));
    return { session, result: session.result! };
  }).immediate();
}
