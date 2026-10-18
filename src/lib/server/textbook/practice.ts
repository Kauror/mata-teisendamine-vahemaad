import { randomUUID } from 'node:crypto';
import { toClientQuestion } from '@/lib/textbook/clientQuestion';
import db from '@/lib/db';
import { nowIso } from '@/lib/tasks';
import { type ObjectiveRef, type PracticeAnswerResponse, type PracticeFeedbackView, type PracticeSessionView, type TextbookLearner } from '@/lib/textbook/api';
import { TextbookRuleError } from '@/lib/textbook/errors';
import { isResponseComplete, parseResponse } from '@/lib/textbook/grading';
import {
  createPracticeState,
  currentPracticeQuestion,
  parsePracticeState,
  practiceProgress,
  recordPracticeAnswer,
  type PracticeMode,
  type PracticeState
} from '@/lib/textbook/practiceScheduler';
import { seedFromString } from '@/lib/textbook/scoring';
import { forbidden, notFound, TextbookApiError, type TextbookContext } from '@/lib/server/textbook/context';
import { resolveUnitState } from '@/lib/server/textbook/learner';
import { ensureProgressRow, objectiveRef, parseIds, parseObjectives } from '@/lib/server/textbook/progress';
import { recordObjectiveResult } from '@/lib/server/textbook/stats';

// Practice ("Harjuta") sessions: the pure scheduler runs here over a pool
// frozen at start (SPEC A3/A4) and every answer is one transaction. Immediate
// feedback with the explanation; a wrong answer schedules a correction. No
// stars, no attempts, no exercise counts — completion only opens the test.

type PracticeRow = {
  id: string;
  learner: TextbookLearner;
  courseId: string;
  unitId: string;
  mode: PracticeMode;
  status: 'active' | 'completed' | 'abandoned';
  contentVersion: string;
  afterTestSessionId: string | null;
  stateJson: string;
  objectivesJson: string;
  lastFeedbackJson: string | null;
  revision: number;
  lastActionId: string | null;
  startedAt: string;
  updatedAt: string;
  completedAt: string | null;
};

export const PRACTICE_SESSION_PATTERN = /^tp_[0-9a-f-]{36}$/u;

function loadRow(context: TextbookContext, sessionId: string): PracticeRow {
  const row = PRACTICE_SESSION_PATTERN.test(sessionId)
    ? db.prepare('SELECT * FROM textbook_practice_sessions WHERE id = ? AND learner = ?').get(sessionId, context.learner) as PracticeRow | undefined
    : undefined;
  if (!row || row.status === 'abandoned') throw notFound('Harjutuskorda ei leitud.');
  return row;
}

function objectiveFor(row: PracticeRow, objectiveId: string): ObjectiveRef {
  return parseObjectives(row.objectivesJson).find((ref) => ref.objectiveId === objectiveId) ?? { objectiveId, description: objectiveId, required: true };
}

function buildView(context: TextbookContext, row: PracticeRow, testUnlocked: boolean): PracticeSessionView {
  const state = parsePracticeState(row.stateJson);
  const current = row.status === 'active' ? currentPracticeQuestion(state) : null;
  const refs = parseObjectives(row.objectivesJson);
  return {
    scope: context.scope,
    sessionId: row.id,
    revision: row.revision,
    courseId: row.courseId,
    unitId: row.unitId,
    mode: row.mode,
    status: row.status === 'completed' ? 'completed' : 'active',
    progress: practiceProgress(state),
    question: current ? toClientQuestion(current) : null,
    sequence: state.answers.length,
    lastFeedback: row.lastFeedbackJson ? JSON.parse(row.lastFeedbackJson) as PracticeFeedbackView : null,
    objectives: state.objectiveIds.map((id) => refs.find((ref) => ref.objectiveId === id) ?? { objectiveId: id, description: id, required: true }),
    testUnlocked
  };
}

// Reading a session obeys the same rules as acting in it: the course must be
// this learner's and the unit still open.
function viewWithGates(context: TextbookContext, row: PracticeRow): PracticeSessionView {
  const { state } = resolveUnitState(context, row.courseId, row.unitId);
  return buildView(context, row, state.gates.testUnlocked);
}

export function getPracticeSession(context: TextbookContext, sessionId: string): PracticeSessionView {
  return viewWithGates(context, loadRow(context, sessionId));
}

function completeRun(context: TextbookContext, row: Pick<PracticeRow, 'courseId' | 'unitId' | 'mode'>, now: string) {
  ensureProgressRow(context.learner, row.courseId, row.unitId, now);
  db.prepare(`
    UPDATE textbook_unit_progress
    SET practiceCompletedAt = CASE WHEN ? = 'normal' THEN COALESCE(practiceCompletedAt, ?) ELSE practiceCompletedAt END,
        practiceRuns = practiceRuns + 1,
        updatedAt = ?
    WHERE learner = ? AND courseId = ? AND unitId = ?
  `).run(row.mode, now, now, context.learner, row.courseId, row.unitId);
}

// Starts a practice run or resumes the one in progress. The server picks the
// mode: 'targeted' while a failed test still needs its revision run (D2),
// otherwise 'normal'. Every gate is checked here.
export function startPractice(context: TextbookContext, courseId: string, unitId: string): PracticeSessionView {
  return db.transaction(() => {
    const { courseState, state } = resolveUnitState(context, courseId, unitId);
    if (!state.gates.practiceUnlocked) throw new TextbookApiError('gate_reading', 'Loe enne harjutamist kõik õppetunnid läbi.');
    if (state.activeTestSessionId) throw new TextbookApiError('locked', 'Test on pooleli. Lõpeta enne test.');

    const targeted = state.gates.retakePracticePending && state.lastRound !== null;
    const mode: PracticeMode = targeted ? 'targeted' : 'normal';
    const afterTest = targeted ? state.lastRound!.sessionId : null;
    const now = nowIso();

    const existing = state.activePracticeSessionId
      ? db.prepare('SELECT * FROM textbook_practice_sessions WHERE id = ?').get(state.activePracticeSessionId) as PracticeRow
      : null;
    if (existing) {
      if (existing.mode === mode && existing.afterTestSessionId === afterTest) return buildView(context, existing, state.gates.testUnlocked);
      // A run of the wrong kind (e.g. a normal run left open before the failed
      // test) is set aside; it gave no credit and is never resumed.
      db.prepare("UPDATE textbook_practice_sessions SET status = 'abandoned', updatedAt = ? WHERE id = ?").run(now, existing.id);
    }

    const id = `tp_${randomUUID()}`;
    let practice: PracticeState;
    try {
      practice = createPracticeState({
        courseId,
        unit: state.unit,
        settings: courseState.course.settings,
        seed: seedFromString(id),
        mode,
        ...(targeted ? { objectiveIds: parseIds(state.lastRound!.missedObjectiveIdsJson), avoidQuestionIds: parseIds(state.lastRound!.questionIdsJson) } : {})
      });
    } catch (error) {
      if (error instanceof TextbookRuleError) throw forbidden(error.message);
      throw error;
    }
    const objectives = state.unit.objectives.map(objectiveRef);
    db.prepare(`
      INSERT INTO textbook_practice_sessions (id, learner, courseId, unitId, mode, status, contentVersion, afterTestSessionId, stateJson, objectivesJson, revision, startedAt, updatedAt, completedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)
    `).run(id, context.learner, courseId, unitId, mode, practice.completed ? 'completed' : 'active', state.unit.contentVersion, afterTest,
      JSON.stringify(practice), JSON.stringify(objectives), now, now, practice.completed ? now : null);
    ensureProgressRow(context.learner, courseId, unitId, now);
    // A targeted run with nothing to practise (no practice question for the
    // missed objectives) is complete at once and opens the retake.
    if (practice.completed) completeRun(context, { courseId, unitId, mode }, now);
    return viewWithGates(context, loadRow(context, id));
  }).immediate();
}

export type PracticeAnswerInput = { actionId: string; revision: number; questionId: string; response: unknown };

export function answerPractice(context: TextbookContext, sessionId: string, input: PracticeAnswerInput): PracticeAnswerResponse {
  return db.transaction(() => {
    const row = loadRow(context, sessionId);
    // A retried request: already applied, return what it returned.
    if (row.lastActionId === input.actionId && row.lastFeedbackJson) {
      return { session: viewWithGates(context, row), feedback: JSON.parse(row.lastFeedbackJson) as PracticeFeedbackView };
    }
    if (row.status !== 'active') throw new TextbookApiError('stale', 'See harjutuskord on juba lõpetatud.', { session: viewWithGates(context, row) });
    if (row.revision !== input.revision) throw new TextbookApiError('stale', 'Harjutus jätkus teises aknas.', { session: viewWithGates(context, row) });
    resolveUnitState(context, row.courseId, row.unitId);

    const state = parsePracticeState(row.stateJson);
    const current = currentPracticeQuestion(state);
    if (!current || current.question.id !== input.questionId) {
      throw new TextbookApiError('not_current_question', 'See küsimus ei ole praegu ekraanil.', { session: viewWithGates(context, row) });
    }
    const response = parseResponse(current.question.answer, input.response);
    if (!response) throw new TextbookApiError('invalid_response', 'Vastus ei sobi selle küsimusega.');
    if (!isResponseComplete(current.question.answer, response)) throw new TextbookApiError('incomplete_response', 'Vasta küsimusele lõpuni.');

    let result: ReturnType<typeof recordPracticeAnswer>;
    try {
      result = recordPracticeAnswer(state, input.questionId, response);
    } catch (error) {
      if (error instanceof TextbookRuleError) throw new TextbookApiError('stale', error.message, { session: viewWithGates(context, row) });
      throw error;
    }
    const now = nowIso();
    const { feedback } = result;
    const view: PracticeFeedbackView = {
      question: toClientQuestion(current),
      response,
      correct: feedback.correct,
      correctResponse: feedback.correctResponse,
      explanation: feedback.explanation,
      misconception: feedback.misconception,
      objective: objectiveFor(row, feedback.objectiveId),
      objectiveSatisfied: feedback.objectiveSatisfied,
      correctionScheduled: feedback.correctionScheduled
    };
    // Weak-area statistics are real-child data: never written for the preview.
    if (context.realEffects) recordObjectiveResult(context, row.courseId, row.unitId, feedback.objectiveId, 'practice', feedback.correct, now);
    const completed = result.state.completed;
    if (completed) completeRun(context, row, now);

    const update = db.prepare(`
      UPDATE textbook_practice_sessions
      SET stateJson = ?, lastFeedbackJson = ?, revision = revision + 1, lastActionId = ?, status = ?, completedAt = ?, updatedAt = ?
      WHERE id = ? AND revision = ?
    `).run(JSON.stringify(result.state), JSON.stringify(view), input.actionId, completed ? 'completed' : 'active', completed ? now : null, now, row.id, row.revision);
    if (update.changes !== 1) throw new TextbookApiError('stale', 'Harjutus jätkus teises aknas.', { session: viewWithGates(context, loadRow(context, sessionId)) });
    return { session: viewWithGates(context, loadRow(context, sessionId)), feedback: view };
  }).immediate();
}
