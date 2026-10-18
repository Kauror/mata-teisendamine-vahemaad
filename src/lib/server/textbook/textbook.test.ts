import { NextRequest } from 'next/server';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { getBalance } from '@/lib/tasks';
import { updateLearningPointSettings } from '@/lib/learningPoints';
import { isChildWritePath } from '@/lib/peekMode';
import { TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { correctResponseFor, hotspotRegionIds } from '@/lib/textbook/grading';
import { currentPracticeQuestion, parsePracticeState } from '@/lib/textbook/practiceScheduler';
import type { TestRunState } from '@/lib/textbook/testSession';
import type { AnswerResponse, AnswerSpec, Course, Unit } from '@/lib/textbook/types';
import type { TestSessionView } from '@/lib/textbook/api';
import { childContext, previewContext, TextbookApiError, type TextbookContext } from '@/lib/server/textbook/context';
import { setTextbookCoursesForTests } from '@/lib/server/textbook/courses';
import { completeLesson, getCourseOverview, getLesson, getUnitDetail } from '@/lib/server/textbook/learner';
import { answerPractice, getPracticeSession, startPractice } from '@/lib/server/textbook/practice';
import { getTestSession, saveAnswer, startTest, submit } from '@/lib/server/textbook/test';
import { getParentOverview, getParentUnitDetail, resetPreview, setManualUnlock, setPublished } from '@/lib/server/textbook/parent';
import { childHandlers } from '@/lib/server/textbook/http';

// DB-backed tests of the textbook server (SPEC B12 1–19 server side, A5, A7).
// A child course "opik-test" is a real-learner copy of the two demo units
// plus a metadata-only draft, so the child flow can be exercised without
// touching the real course (its ready units are unpublished; the rest are drafts).

const COURSE_ID = 'opik-test';
const WATER = 'demo-vesi';
const PLANT = 'demo-taim';
const DRAFT = 'opik-test-u3';
const DEMO = textbookDemoCourse.id;
const REAL = 'loodusopetus-opik';
const REAL_UNITS = TEXTBOOK_COURSES.find((course) => course.id === REAL)!.units;
// The real course's ready units in order (all unpublished for Kiur; the preview shows them).
const REAL_READY = REAL_UNITS.filter((unit) => unit.status === 'ready').map((unit) => unit.id);

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function makeCourse(edit?: (units: Unit[]) => void): Course {
  const units = clone(textbookDemoCourse.units).map((unit) => ({ ...unit, courseId: COURSE_ID }));
  units.push({ id: DRAFT, courseId: COURSE_ID, number: 3, title: 'Mustand', status: 'draft', contentVersion: '0', objectives: [], lessons: [], questions: [] });
  edit?.(units);
  return { ...clone(textbookDemoCourse), id: COURSE_ID, title: 'Testkursus', learners: ['kiur'], previewOnly: false, units };
}

function useCourse(course: Course) {
  setTextbookCoursesForTests([...TEXTBOOK_COURSES, course]);
}

const kiur = () => childContext('kiur');
const preview = () => previewContext();
let counter = 0;
const aid = () => `action-${++counter}-xx`;

function expectCode(fn: () => unknown, code: string) {
  try {
    fn();
  } catch (error) {
    expect(error).toBeInstanceOf(TextbookApiError);
    expect((error as TextbookApiError).code).toBe(code);
    return error as TextbookApiError;
  }
  throw new Error(`expected ${code}`);
}

function wrongResponseFor(answer: AnswerSpec): AnswerResponse {
  switch (answer.type) {
    case 'single_choice':
      return { type: 'single_choice', optionId: answer.options.find((option) => option.id !== answer.correctOptionId)!.id };
    case 'multiple_selection':
      return { type: 'multiple_selection', optionIds: [answer.options.find((option) => !answer.correctOptionIds.includes(option.id))!.id] };
    case 'matching': {
      const prompts = answer.prompts.map((prompt) => prompt.id);
      const pairs = { ...answer.correctPairs };
      [pairs[prompts[0]], pairs[prompts[1]]] = [pairs[prompts[1]], pairs[prompts[0]]];
      return { type: 'matching', pairs };
    }
    case 'grouping': {
      const assignments = { ...answer.correctGroupByItem };
      const first = answer.items[0].id;
      assignments[first] = answer.groups.find((group) => group.id !== assignments[first])!.id;
      return { type: 'grouping', assignments };
    }
    case 'ordering':
      return { type: 'ordering', order: [...answer.correctOrder].reverse() };
    case 'diagram_hotspot':
      return { type: 'diagram_hotspot', regionId: hotspotRegionIds(answer).find((id) => id !== answer.correctRegionId)! };
  }
}

function readAll(context: TextbookContext, courseId: string, unitId: string) {
  const detail = getUnitDetail(context, courseId, unitId);
  for (const lesson of detail.lessons) completeLesson(context, courseId, unitId, lesson.lessonId);
}

function practiceRow(sessionId: string) {
  return db.prepare('SELECT * FROM textbook_practice_sessions WHERE id = ?').get(sessionId) as { stateJson: string; revision: number; status: string };
}

// Answers the run to completion; `wrongFirst` answers that many questions wrong first.
function finishPractice(context: TextbookContext, courseId: string, unitId: string, wrongFirst = 0) {
  let view = startPractice(context, courseId, unitId);
  let wrongLeft = wrongFirst;
  for (let guard = 0; view.status === 'active'; guard++) {
    if (guard > 200) throw new Error('practice did not end');
    const frozen = currentPracticeQuestion(parsePracticeState(practiceRow(view.sessionId).stateJson))!;
    const wrong = wrongLeft-- > 0;
    view = answerPractice(context, view.sessionId, {
      actionId: aid(),
      revision: view.revision,
      questionId: frozen.question.id,
      response: wrong ? wrongResponseFor(frozen.question.answer) : correctResponseFor(frozen.question.answer)
    }).session;
  }
  return view;
}

function testState(sessionId: string) {
  return JSON.parse((db.prepare('SELECT stateJson FROM textbook_test_sessions WHERE id = ?').get(sessionId) as { stateJson: string }).stateJson) as TestRunState;
}

function answerTest(context: TextbookContext, view: TestSessionView, wrong: number, skip = 0) {
  const state = testState(view.sessionId);
  let current = view;
  state.snapshot.questions.slice(0, state.snapshot.questions.length - skip).forEach((frozen, index) => {
    const response = index < wrong ? wrongResponseFor(frozen.question.answer) : correctResponseFor(frozen.question.answer);
    current = saveAnswer(context, current.sessionId, { actionId: aid(), revision: current.revision, questionId: frozen.question.id, response }).session;
  });
  return current;
}

function playTest(context: TextbookContext, courseId: string, unitId: string, wrong: number) {
  const view = answerTest(context, startTest(context, courseId, unitId), wrong);
  return submit(context, view.sessionId, { actionId: aid(), revision: view.revision });
}

function readyForTest(context: TextbookContext, courseId: string, unitId: string) {
  readAll(context, courseId, unitId);
  finishPractice(context, courseId, unitId);
}

// The preview follows the real order: passes every ready unit before `unitId`
// (whatever units are ready by then), so `unitId` opens for the preview learner.
function passEarlierReadyUnits(courseId: string, unitId: string) {
  const units = TEXTBOOK_COURSES.find((course) => course.id === courseId)!.units;
  const target = units.find((unit) => unit.id === unitId)!;
  for (const unit of units.filter((item) => item.status === 'ready' && item.number < target.number)) {
    readyForTest(preview(), courseId, unit.id);
    expect(playTest(preview(), courseId, unit.id, 0).result).toMatchObject({ passed: true });
  }
}

// What passing a real unit in the preview opens: the next ready unit, or nothing after the last one.
function nextAfter(unitId: string) {
  const next = REAL_READY[REAL_READY.indexOf(unitId) + 1];
  return next ? { nextUnitOpened: true, nextUnit: { unitId: next } } : { nextUnitOpened: false, nextUnit: null };
}

function count(sql: string, ...args: unknown[]) {
  return (db.prepare(sql).get(...args) as { count: number }).count;
}

const TEXTBOOK_TABLES = ['textbook_rewards', 'textbook_test_rounds', 'textbook_test_sessions', 'textbook_practice_sessions', 'textbook_lesson_reads', 'textbook_unit_progress', 'textbook_objective_stats', 'textbook_manual_unlocks', 'textbook_unit_publication'];

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  for (const table of TEXTBOOK_TABLES) db.exec(`DELETE FROM ${table}`);
  db.exec('DELETE FROM attempt_reward_components; DELETE FROM reward_projection_runs; DELETE FROM study_attempt_rewards; DELETE FROM point_ledger; DELETE FROM attempts; DELETE FROM daily_leaderboard;');
  db.pragma('foreign_keys = ON');
  updateLearningPointSettings({ baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, streakIntervalDays: 7, streakBonusAmount: 0, learningPointsEnabled: true, streakBonusEnabled: false });
  useCourse(makeCourse());
  setPublished(COURSE_ID, WATER, true);
  setPublished(COURSE_ID, PLANT, true);
});

afterAll(() => setTextbookCoursesForTests(null));

describe('textbook access and gates', () => {
  it('gives a fresh learner only the first published unit; unpublished units are not listed or reachable (B12 1–3)', () => {
    const overview = getCourseOverview(kiur(), COURSE_ID);
    expect(overview.units.map((unit) => [unit.unitId, unit.status])).toEqual([[WATER, 'start_learning'], [PLANT, 'locked']]);
    expect(overview.currentUnitId).toBe(WATER);
    expectCode(() => getUnitDetail(kiur(), COURSE_ID, DRAFT), 'forbidden');
    expectCode(() => getUnitDetail(kiur(), COURSE_ID, PLANT), 'locked');
    expectCode(() => startPractice(kiur(), COURSE_ID, PLANT), 'locked');
    expectCode(() => startTest(kiur(), COURSE_ID, PLANT), 'locked');
    setPublished(COURSE_ID, WATER, false);
    // The first published unit opens whatever its number.
    expect(getCourseOverview(kiur(), COURSE_ID).units.map((unit) => [unit.unitId, unit.status])).toEqual([[PLANT, 'start_learning']]);
    expectCode(() => getLesson(kiur(), COURSE_ID, WATER, 'demo-vesi-l1'), 'forbidden');
  });

  it('locks practice until every required lesson is read, and the reading survives a reload (B12 4–5)', () => {
    expectCode(() => startPractice(kiur(), COURSE_ID, WATER), 'gate_reading');
    const lessons = getUnitDetail(kiur(), COURSE_ID, WATER).lessons;
    expect(lessons.length).toBeGreaterThan(1);
    const first = completeLesson(kiur(), COURSE_ID, WATER, lessons[0].lessonId);
    expect(first).toMatchObject({ completed: true, readingComplete: false, practiceUnlocked: false, unitStatus: 'learning_in_progress' });
    expectCode(() => startPractice(kiur(), COURSE_ID, WATER), 'gate_reading');
    // A reload (a fresh read) still knows the lesson was read; repeating it is harmless.
    expect(getLesson(kiur(), COURSE_ID, WATER, lessons[0].lessonId).completed).toBe(true);
    completeLesson(kiur(), COURSE_ID, WATER, lessons[0].lessonId);
    for (const lesson of lessons.slice(1)) completeLesson(kiur(), COURSE_ID, WATER, lesson.lessonId);
    const detail = getUnitDetail(kiur(), COURSE_ID, WATER);
    expect(detail.gates).toMatchObject({ readingComplete: true, practiceUnlocked: true, testUnlocked: false });
    expect(detail).toMatchObject({ nextStep: 'practice' });
    expect(startPractice(kiur(), COURSE_ID, WATER).status).toBe('active');
  });

  it('locks the test until practice is complete, also through the HTTP route (B12 6–7)', async () => {
    readAll(kiur(), COURSE_ID, WATER);
    expectCode(() => startTest(kiur(), COURSE_ID, WATER), 'gate_practice');
    const response = await childHandlers.testStart.POST(
      new NextRequest(`http://localhost/api/textbook/courses/${COURSE_ID}/units/${WATER}/test`, { method: 'POST', body: JSON.stringify({ actionId: aid() }) }),
      { params: Promise.resolve({ courseId: COURSE_ID, unitId: WATER }) }
    );
    expect(response.status).toBe(403);
    expect(await response.json()).toMatchObject({ code: 'gate_practice' });
    const locked = await childHandlers.unitDetail.GET(new NextRequest(`http://localhost/api/textbook/courses/${COURSE_ID}/units/${PLANT}`), { params: Promise.resolve({ courseId: COURSE_ID, unitId: PLANT }) });
    expect(locked.status).toBe(403);
    expect(await locked.json()).toMatchObject({ code: 'locked' });
    finishPractice(kiur(), COURSE_ID, WATER, 2);
    expect(getUnitDetail(kiur(), COURSE_ID, WATER)).toMatchObject({ nextStep: 'test', gates: { testUnlocked: true } });
  });

  it('requires a correct answer for every objective and schedules a different question after a wrong one (A3/A7)', () => {
    readAll(kiur(), COURSE_ID, WATER);
    const view = startPractice(kiur(), COURSE_ID, WATER);
    const frozen = currentPracticeQuestion(parsePracticeState(practiceRow(view.sessionId).stateJson))!;
    const result = answerPractice(kiur(), view.sessionId, { actionId: aid(), revision: view.revision, questionId: frozen.question.id, response: wrongResponseFor(frozen.question.answer) });
    expect(result.feedback).toMatchObject({ correct: false, objectiveSatisfied: false, explanation: frozen.question.explanation });
    expect(result.feedback.correctResponse).toEqual(correctResponseFor(frozen.question.answer));
    expect(result.session.question?.id).not.toBe(frozen.question.id);
    const queue = parsePracticeState(practiceRow(view.sessionId).stateJson).queue;
    // The objective stays open with another question on it later in the run
    // (a correction, or an already planned one).
    const later = queue.filter((entry) => entry.objectiveId === frozen.question.primaryObjectiveId);
    expect(later.length).toBeGreaterThan(0);
    expect(later.some((entry) => entry.questionId !== frozen.question.id)).toBe(true);
    expect(queue[0].questionId).not.toBe(frozen.question.id);
    expect(getUnitDetail(kiur(), COURSE_ID, WATER).gates.testUnlocked).toBe(false);
  });
});

describe('textbook test', () => {
  beforeEach(() => readyForTest(kiur(), COURSE_ID, WATER));

  it('passes at 19/20 and fails at 18/20 in integer arithmetic (B12 8–9)', () => {
    const failed = playTest(kiur(), COURSE_ID, WATER, 2);
    expect(failed.result).toMatchObject({ correct: 18, total: 20, requiredCorrect: 19, passed: false, percent: 90, retakePracticeRequired: true, reward: null, firstPass: false });
    expect(failed.result.missedObjectives.length).toBeGreaterThan(0);
    finishPractice(kiur(), COURSE_ID, WATER);
    const passed = playTest(kiur(), COURSE_ID, WATER, 1);
    expect(passed.result).toMatchObject({ correct: 19, total: 20, passed: true, percent: 95, firstPass: true });
  });

  it('refuses submit until all 20 are answered (B12 10)', () => {
    const view = answerTest(kiur(), startTest(kiur(), COURSE_ID, WATER), 0, 1);
    expect(view.answeredCount).toBe(19);
    expectCode(() => submit(kiur(), view.sessionId, { actionId: aid(), revision: view.revision }), 'not_all_answered');
    expect(getTestSession(kiur(), view.sessionId).status).toBe('active');
  });

  it('pays once: a retried or duplicate submit adds nothing, and a same-day repeat pass is practice (B12 11, D3)', () => {
    const balanceBefore = getBalance('kiur');
    const view = answerTest(kiur(), startTest(kiur(), COURSE_ID, WATER), 0);
    const actionId = aid();
    const first = submit(kiur(), view.sessionId, { actionId, revision: view.revision });
    expect(first.result.passed).toBe(true);
    expect(first.result.reward?.awardedAmount).toBeGreaterThan(0);
    const ledgerAfter = count('SELECT COUNT(*) AS count FROM point_ledger');
    const balanceAfter = getBalance('kiur');
    expect(balanceAfter).toBeGreaterThan(balanceBefore);

    const retried = submit(kiur(), view.sessionId, { actionId, revision: view.revision });
    expect(retried.result).toEqual(first.result);
    expectCode(() => submit(kiur(), view.sessionId, { actionId: aid(), revision: first.session.revision }), 'already_submitted');
    expect(count('SELECT COUNT(*) AS count FROM attempts')).toBe(1);
    expect(count('SELECT COUNT(*) AS count FROM point_ledger')).toBe(ledgerAfter);
    expect(count('SELECT COALESCE(SUM(kiurCount), 0) AS count FROM daily_leaderboard')).toBeGreaterThan(0);

    const attempt = db.prepare('SELECT protocolVersion, rewardSettlementStatus, exerciseId, runnerId, subject, clientAttemptId, score, questionCount FROM attempts').get();
    expect(attempt).toEqual({ protocolVersion: 2, rewardSettlementStatus: 'eligible', exerciseId: `kiur.textbook.${COURSE_ID}`, runnerId: 'textbook', subject: 'loodusopetus', clientAttemptId: `textbook-test:${view.sessionId}`, score: 20, questionCount: 20 });

    // The unit stays open for revision; a repeat pass the same day earns nothing.
    const repeat = playTest(kiur(), COURSE_ID, WATER, 0);
    expect(repeat.result).toMatchObject({ passed: true, firstPass: false, reward: null });
    expect(count('SELECT COUNT(*) AS count FROM attempts')).toBe(1);
    expect(getBalance('kiur')).toBe(balanceAfter);
    expect(db.prepare('SELECT passedSessionId, passCount FROM textbook_unit_progress WHERE learner = ? AND unitId = ?').get('kiur', WATER)).toEqual({ passedSessionId: view.sessionId, passCount: 2 });
  });

  it('opens the next published unit on the first pass only (B12 12)', () => {
    const result = playTest(kiur(), COURSE_ID, WATER, 0).result;
    expect(result).toMatchObject({ firstPass: true, nextUnit: { unitId: PLANT }, nextUnitOpened: true, allUnitsPassed: false });
    expect(getCourseOverview(kiur(), COURSE_ID).units.map((unit) => [unit.unitId, unit.status])).toEqual([[WATER, 'passed'], [PLANT, 'start_learning']]);
    const again = playTest(kiur(), COURSE_ID, WATER, 0).result;
    expect(again).toMatchObject({ firstPass: false, nextUnitOpened: false, nextUnit: { unitId: PLANT } });
  });

  it('handles a failed test: targeted practice on the missed objectives, then a varied retake (D2)', () => {
    const failed = playTest(kiur(), COURSE_ID, WATER, 3);
    const missed = failed.result.missedObjectives.map((objective) => objective.objectiveId);
    const detail = getUnitDetail(kiur(), COURSE_ID, WATER);
    expect(detail).toMatchObject({ nextStep: 'retake_practice', gates: { retakePracticePending: true, testUnlocked: false }, unit: { status: 'review' } });
    expect(detail.missedObjectives.map((objective) => objective.objectiveId)).toEqual(missed);
    expectCode(() => startTest(kiur(), COURSE_ID, WATER), 'gate_retake_practice');
    const practice = startPractice(kiur(), COURSE_ID, WATER);
    expect(practice.mode).toBe('targeted');
    expect(practice.objectives.map((objective) => objective.objectiveId).sort()).toEqual([...missed].sort());
    const done = finishPractice(kiur(), COURSE_ID, WATER);
    expect(done).toMatchObject({ status: 'completed', testUnlocked: true });
    const retake = startTest(kiur(), COURSE_ID, WATER);
    const firstIds = new Set(testState(failed.session.sessionId).snapshot.questions.map((frozen) => frozen.question.id));
    expect(retake.questions.filter((question) => !firstIds.has(question.id)).length).toBeGreaterThan(0);
    expect(getUnitDetail(kiur(), COURSE_ID, WATER).attempts.map((attempt) => [attempt.attemptNumber, attempt.passed])).toEqual([[1, false]]);
  });

  it('never sends a key before submit and reveals the review only after it (B12 16)', () => {
    const view = startTest(kiur(), COURSE_ID, WATER);
    const json = JSON.stringify(view);
    for (const secret of ['correctOptionId', 'correctOptionIds', 'correctPairs', 'correctGroupByItem', 'correctOrder', 'correctRegionId', 'explanation', 'misconception', 'primaryObjectiveId', 'variantGroupId', 'cognitiveLevel']) {
      expect(json).not.toContain(secret);
    }
    const answered = answerTest(kiur(), view, 0, 1);
    expect(JSON.stringify(answered)).not.toContain('correctResponse');
    expect(answered.result).toBeNull();
    const practice = getPracticeSession(kiur(), (db.prepare("SELECT id FROM textbook_practice_sessions WHERE learner = 'kiur' ORDER BY startedAt DESC LIMIT 1").get() as { id: string }).id);
    expect(JSON.stringify(practice.question ?? {})).not.toContain('correct');
  });

  it('stores the question and option order once: a reload changes nothing (B12 15, 17)', () => {
    const view = startTest(kiur(), COURSE_ID, WATER);
    const again = startTest(kiur(), COURSE_ID, WATER);
    expect(again.sessionId).toBe(view.sessionId);
    expect(getTestSession(kiur(), view.sessionId).questions).toEqual(view.questions);
    const partial = answerTest(kiur(), view, 0, 15);
    const reloaded = getTestSession(kiur(), view.sessionId);
    expect(reloaded.answeredCount).toBe(5);
    expect(reloaded.answers).toEqual(partial.answers);
    expect(getUnitDetail(kiur(), COURSE_ID, WATER)).toMatchObject({ nextStep: 'resume_test', activeTestSessionId: view.sessionId, unit: { status: 'test_in_progress' } });
  });

  it('refuses a stale revision with the current session, and a retried action is applied once', () => {
    const view = startTest(kiur(), COURSE_ID, WATER);
    const question = testState(view.sessionId).snapshot.questions[0].question;
    const actionId = aid();
    const saved = saveAnswer(kiur(), view.sessionId, { actionId, revision: view.revision, questionId: question.id, response: correctResponseFor(question.answer) }).session;
    expect(saveAnswer(kiur(), view.sessionId, { actionId, revision: view.revision, questionId: question.id, response: correctResponseFor(question.answer) }).session.revision).toBe(saved.revision);
    const stale = expectCode(() => saveAnswer(kiur(), view.sessionId, { actionId: aid(), revision: view.revision, questionId: question.id, response: correctResponseFor(question.answer) }), 'stale');
    expect((stale.extra.session as TestSessionView).revision).toBe(saved.revision);
    expectCode(() => saveAnswer(kiur(), view.sessionId, { actionId: aid(), revision: saved.revision, questionId: question.id, response: { type: 'ordering', order: [] } }), 'invalid_response');
  });
});

describe('practice sessions', () => {
  it('resumes a run with its unresolved objectives intact, and a retried answer does not advance it (B12 17, A7)', () => {
    readAll(kiur(), COURSE_ID, WATER);
    const view = startPractice(kiur(), COURSE_ID, WATER);
    const frozen = currentPracticeQuestion(parsePracticeState(practiceRow(view.sessionId).stateJson))!;
    const input = { actionId: aid(), revision: view.revision, questionId: frozen.question.id, response: wrongResponseFor(frozen.question.answer) };
    const first = answerPractice(kiur(), view.sessionId, input);
    const retried = answerPractice(kiur(), view.sessionId, input);
    expect(retried).toEqual(first);
    const resumed = startPractice(kiur(), COURSE_ID, WATER);
    expect(resumed.sessionId).toBe(view.sessionId);
    expect(resumed.progress).toEqual(first.session.progress);
    expect(resumed.progress.satisfiedCount).toBe(0);
    // The question counts come from the frozen queue: answered + still queued.
    const queued = parsePracticeState(practiceRow(view.sessionId).stateJson).queue.length;
    expect(resumed.progress).toMatchObject({ answeredCount: 1, remainingCount: queued, totalQuestionCount: 1 + queued, currentQuestionNumber: 2 });
    expect(resumed.lastFeedback).toEqual(first.feedback);
    expectCode(() => answerPractice(kiur(), view.sessionId, { ...input, actionId: aid() }), 'stale');
    expectCode(() => answerPractice(kiur(), view.sessionId, { ...input, actionId: aid(), revision: first.session.revision }), 'not_current_question');
  });
});

describe('parent controls', () => {
  it('refuses to publish invalid content with Estonian problems (B12 19)', () => {
    const error = expectCode(() => setPublished(COURSE_ID, DRAFT, true), 'validation_failed');
    expect(error.extra.problems?.length).toBeGreaterThan(0);
    expect(error.extra.problems?.[0].message).toMatch(/[a-zäöüõ]/u);
    expectCode(() => setPublished('loodusopetus-opik', 'lo-opik-u22', true), 'validation_failed');
    expectCode(() => setPublished(DEMO, 'demo-vesi', true), 'forbidden');
    const broken = makeCourse((units) => { units[0].questions = units[0].questions.slice(0, 5); });
    useCourse(broken);
    expectCode(() => setPublished(COURSE_ID, WATER, true), 'validation_failed');
  });

  it('a manual unlock opens a unit but records no pass (B12 13)', () => {
    const { unit } = setManualUnlock(COURSE_ID, PLANT, true);
    expect(unit).toMatchObject({ manualUnlock: true, progress: [{ learner: 'kiur', status: 'start_learning', passedAt: null, attempts: [] }] });
    const overview = getCourseOverview(kiur(), COURSE_ID);
    expect(overview.units.map((item) => [item.unitId, item.status, item.testPassed])).toEqual([[WATER, 'start_learning', false], [PLANT, 'start_learning', false]]);
    expect(count('SELECT COUNT(*) AS count FROM textbook_unit_progress WHERE firstPassedAt IS NOT NULL')).toBe(0);
    expect(count('SELECT COUNT(*) AS count FROM attempts')).toBe(0);
    setManualUnlock(COURSE_ID, PLANT, false);
    expect(getCourseOverview(kiur(), COURSE_ID).units[1].status).toBe('locked');
  });

  it('shows every course with drafts, validity, progress, attempts and weak objectives; the keys only to the parent', () => {
    readyForTest(kiur(), COURSE_ID, WATER);
    playTest(kiur(), COURSE_ID, WATER, 2);
    const overview = getParentOverview();
    expect(overview.courses.map((course) => course.courseId)).toEqual(['loodusopetus-opik', DEMO, COURSE_ID]);
    const real = overview.courses[0];
    expect(real.units).toHaveLength(13);
    expect(real.units[0]).toMatchObject({ number: 10, contentStatus: 'ready', published: false, validation: { publishable: true } });
    // Every real unit is listed for the parent, unpublished: the ready ones publishable, the drafts not.
    for (const unit of real.units) {
      const ready = REAL_UNITS.find((item) => item.number === unit.number)!.status === 'ready';
      expect(unit, String(unit.number)).toMatchObject({ contentStatus: ready ? 'ready' : 'draft', published: false, validation: { publishable: ready } });
    }
    expect(real.units[12]).toMatchObject({ number: 22, contentStatus: 'draft' });
    expect(overview.courses[1]).toMatchObject({ previewOnly: true, learners: [] });
    expect(overview.courses[1].units.every((unit) => unit.progress.length === 0 && unit.validation.publishable)).toBe(true);
    const water = overview.courses[2].units[0];
    expect(water).toMatchObject({ published: true, validation: { publishable: true } });
    expect(water.progress[0]).toMatchObject({ learner: 'kiur', status: 'review', practiceCompleted: true, practiceRuns: 1 });
    expect(water.progress[0].attempts).toMatchObject([{ attemptNumber: 1, correct: 18, total: 20, passed: false }]);
    expect(water.progress[0].weakObjectives.reduce((sum, item) => sum + item.missCount, 0)).toBe(2);
    const detail = getParentUnitDetail(COURSE_ID, WATER);
    expect(JSON.stringify(detail.questions)).toContain('correctOptionId');
  });

  it('keeps passes and open units through content changes and republication (B12 14)', () => {
    readyForTest(kiur(), COURSE_ID, WATER);
    playTest(kiur(), COURSE_ID, WATER, 0);
    // The author adds a required lesson and bumps the version.
    useCourse(makeCourse((units) => {
      const unit = units[0];
      unit.contentVersion = '2026-11-01.1';
      unit.lessons.push({ ...clone(unit.lessons[0]), id: 'demo-vesi-l9', order: 9, sections: clone(unit.lessons[0].sections).map((section, index) => ({ ...section, id: `demo-vesi-l9-s${index}`, blocks: section.blocks.map((block) => ({ ...block, id: `${block.id}-l9` })) })) });
    }));
    setPublished(COURSE_ID, WATER, false);
    setPublished(COURSE_ID, WATER, true);
    const overview = getCourseOverview(kiur(), COURSE_ID);
    expect(overview.units.map((unit) => [unit.unitId, unit.status])).toEqual([[WATER, 'passed'], [PLANT, 'start_learning']]);
    expect(getUnitDetail(kiur(), COURSE_ID, WATER).gates.testUnlocked).toBe(true);
  });
});

describe('frozen sessions and content changes (A4)', () => {
  it('an active test and practice run keep their own copy after a content edit; a new run uses the new content', () => {
    readyForTest(kiur(), COURSE_ID, WATER);
    const view = startTest(kiur(), COURSE_ID, WATER);
    const originalStem = view.questions[0].stem;
    // Every stem and explanation of the published units changes.
    useCourse(makeCourse((units) => {
      for (const unit of units) {
        unit.contentVersion = 'edited';
        for (const question of unit.questions) {
          question.stem = `MUUDETUD ${question.stem}`;
          question.explanation = `MUUDETUD ${question.explanation}`;
        }
      }
    }));
    const resumed = getTestSession(kiur(), view.sessionId);
    expect(resumed.questions).toEqual(view.questions);
    const submitted = submit(kiur(), view.sessionId, { actionId: aid(), revision: answerTest(kiur(), resumed, 0).revision });
    expect(submitted.result.passed).toBe(true);
    expect(submitted.result.review.every((item) => !item.explanation.startsWith('MUUDETUD'))).toBe(true);
    expect(submitted.session.questions[0].stem).toBe(originalStem);
    readAll(kiur(), COURSE_ID, PLANT);

    // A historical test keeps its questions and answers after yet another edit.
    useCourse(makeCourse());
    const history = getTestSession(kiur(), view.sessionId);
    expect(history.questions).toEqual(view.questions);
    expect(history.result?.correct).toBe(20);

    // New practice uses the current (here: original again) content.
    const fresh = startPractice(kiur(), COURSE_ID, PLANT);
    expect(fresh.question?.stem.startsWith('MUUDETUD')).toBe(false);
  });

  it('an active practice run keeps its frozen pool after an edit', () => {
    readAll(kiur(), COURSE_ID, WATER);
    const view = startPractice(kiur(), COURSE_ID, WATER);
    useCourse(makeCourse((units) => {
      units[0].contentVersion = 'edited';
      for (const question of units[0].questions) question.stem = `MUUDETUD ${question.stem}`;
    }));
    const resumed = startPractice(kiur(), COURSE_ID, WATER);
    expect(resumed.sessionId).toBe(view.sessionId);
    expect(resumed.question).toEqual(view.question);
    expect(finishPractice(kiur(), COURSE_ID, WATER).status).toBe('completed');
  });
});

describe('preview isolation (A5, A6)', () => {
  function realFootprint() {
    return {
      attempts: count('SELECT COUNT(*) AS count FROM attempts'),
      ledger: count('SELECT COUNT(*) AS count FROM point_ledger'),
      leaderboard: JSON.stringify(db.prepare('SELECT * FROM daily_leaderboard ORDER BY date').all()),
      rewards: count('SELECT COUNT(*) AS count FROM textbook_rewards'),
      projections: count('SELECT COUNT(*) AS count FROM reward_projection_runs'),
      stats: count('SELECT COUNT(*) AS count FROM textbook_objective_stats'),
      childRows: TEXTBOOK_TABLES.filter((table) => table !== 'textbook_unit_publication' && table !== 'textbook_rewards')
        .map((table) => count(`SELECT COUNT(*) AS count FROM ${table} WHERE learner IN ('kiur', 'kirsi')`)),
      balances: [getBalance('kiur'), getBalance('kirsi')]
    };
  }

  it('runs the whole demo flow without touching any real record, reward, leaderboard or history (B12 18)', () => {
    readyForTest(kiur(), COURSE_ID, WATER);
    const before = realFootprint();

    const overview = getCourseOverview(preview(), DEMO);
    expect(overview).toMatchObject({ scope: 'preview', course: { previewOnly: true } });
    expect(overview.units.map((unit) => [unit.unitId, unit.status])).toEqual([['demo-vesi', 'start_learning'], ['demo-taim', 'locked']]);
    readyForTest(preview(), DEMO, 'demo-vesi');
    const failed = playTest(preview(), DEMO, 'demo-vesi', 2);
    expect(failed.result).toMatchObject({ correct: 18, passed: false, reward: null });
    finishPractice(preview(), DEMO, 'demo-vesi');
    const passed = playTest(preview(), DEMO, 'demo-vesi', 1);
    expect(passed.result).toMatchObject({ correct: 19, passed: true, firstPass: true, nextUnitOpened: true, reward: null });
    expect(passed.session.scope).toBe('preview');
    expect(getCourseOverview(preview(), DEMO).units[1].status).toBe('start_learning');

    expect(realFootprint()).toEqual(before);
    expect(count("SELECT COUNT(*) AS count FROM textbook_objective_stats WHERE learner = 'preview'")).toBe(0);
    // The child's own unit is untouched by the preview.
    expect(getCourseOverview(kiur(), COURSE_ID).units[0].status).toBe('test_ready');
  });

  it('sees every ready unit of a real course without publication, and never real progress', () => {
    setPublished(COURSE_ID, PLANT, false);
    readyForTest(kiur(), COURSE_ID, WATER);
    playTest(kiur(), COURSE_ID, WATER, 0);
    const view = getCourseOverview(preview(), COURSE_ID);
    expect(view.units.map((unit) => [unit.unitId, unit.status])).toEqual([[WATER, 'start_learning'], [PLANT, 'locked']]);
    // The real course: every ready unit is in the preview (the first open, the rest wait in order), nothing is published for Kiur.
    expect(REAL_READY[0]).toBe('lo-opik-u10');
    expect(getCourseOverview(preview(), REAL).units.map((unit) => [unit.unitId, unit.status])).toEqual(REAL_READY.map((id, index) => [id, index === 0 ? 'start_learning' : 'locked']));
    for (const id of REAL_READY.slice(1)) expectCode(() => getUnitDetail(preview(), REAL, id), 'locked');
    expect(getCourseOverview(kiur(), REAL).units).toEqual([]);
    expectCode(() => getUnitDetail(kiur(), REAL, 'lo-opik-u10'), 'forbidden');
  });

  // Every ready unit of the real course, data-driven: a unit that becomes
  // ready (15–22) is covered here without writing a new test. This is where
  // the full pass/fail logic of the real units is proved; the browser only
  // smoke-tests how they render (e2e/textbook-real-units.spec.ts).
  it('lists the real authored units as ready, in order', () => {
    expect(REAL_READY).toEqual(['lo-opik-u10', 'lo-opik-u11', 'lo-opik-u12', 'lo-opik-u13', 'lo-opik-u14', 'lo-opik-u15', 'lo-opik-u19']);
  });

  it.each(REAL_READY)('runs the real unit %s in the preview after the earlier ready units: read, practise with a correction, 18/20 fails, targeted practice, 19/20 passes; Kiur sees nothing', (unitId) => {
    useCourse(makeCourse());
    const unit = REAL_UNITS.find((item) => item.id === unitId)!;
    const required = new Set(unit.objectives.filter((objective) => objective.required).map((objective) => objective.id));
    const before = realFootprint();
    // The preview keeps the child's order: the unit opens only when every earlier ready unit is passed.
    if (unitId !== REAL_READY[0]) expectCode(() => getUnitDetail(preview(), REAL, unitId), 'locked');
    passEarlierReadyUnits(REAL, unitId);
    expect(getCourseOverview(preview(), REAL).units.find((item) => item.unitId === unitId)?.status).toBe('start_learning');

    const detail = getUnitDetail(preview(), REAL, unitId);
    expect(detail.lessons.map((lesson) => lesson.title)).toEqual(unit.lessons.map((lesson) => lesson.title));
    expectCode(() => startPractice(preview(), REAL, unitId), 'gate_reading');
    readAll(preview(), REAL, unitId);
    expectCode(() => startTest(preview(), REAL, unitId), 'gate_practice');

    // Practice: the first two answers are wrong, a missed objective comes back,
    // and every required objective is answered correctly before the run ends.
    const practice = finishPractice(preview(), REAL, unitId, 2);
    expect(practice.status).toBe('completed');
    const answers = parsePracticeState(practiceRow(practice.sessionId).stateJson).answers;
    expect(answers.slice(0, 2).map((answer) => answer.correct)).toEqual([false, false]);
    expect(answers.slice(1).some((answer) => answer.correct && answer.objectiveId === answers[0].objectiveId)).toBe(true);
    for (const id of required) expect(answers.some((answer) => answer.correct && answer.objectiveId === id), `practice ${id}`).toBe(true);

    const failed = playTest(preview(), REAL, unitId, 2);
    expect(failed.result).toMatchObject({ correct: 18, total: 20, passed: false, reward: null, nextUnitOpened: false });
    expect(failed.result.missedObjectives.length).toBeGreaterThan(0);
    // A failed test asks for targeted practice before a retake.
    expectCode(() => startTest(preview(), REAL, unitId), 'gate_retake_practice');
    finishPractice(preview(), REAL, unitId);
    const passed = playTest(preview(), REAL, unitId, 1);
    // Passing opens the next ready unit of the preview, or nothing after the last one.
    expect(passed.result).toMatchObject({ correct: 19, total: 20, passed: true, reward: null, ...nextAfter(unitId) });

    // Each test: 20 questions from 20 variant groups, 8/7/5, every required objective.
    const shown: string[][] = [];
    for (const view of [failed.session, passed.session]) {
      const questions = testState(view.sessionId).snapshot.questions.map((frozen) => frozen.question);
      shown.push(questions.map((question) => question.id));
      expect(questions).toHaveLength(20);
      expect(new Set(questions.map((question) => question.variantGroupId)).size).toBe(20);
      const levels = { factual: 0, understanding: 0, application: 0 };
      for (const question of questions) levels[question.cognitiveLevel] += 1;
      expect(levels).toEqual({ factual: 8, understanding: 7, application: 5 });
      for (const id of required) expect(questions.some((question) => question.primaryObjectiveId === id), `test covers ${id}`).toBe(true);
    }
    // The historical snapshots keep exactly the questions that were shown; both attempts are recorded.
    expect(getTestSession(preview(), failed.session.sessionId).questions.map((question) => question.id)).toEqual(shown[0]);
    expect(getTestSession(preview(), passed.session.sessionId).questions.map((question) => question.id)).toEqual(shown[1]);
    expect(getUnitDetail(preview(), REAL, unitId).attempts.map((attempt) => [attempt.correct, attempt.total, attempt.passed])).toEqual([[18, 20, false], [19, 20, true]]);

    const position = REAL_READY.indexOf(unitId);
    expect(getCourseOverview(preview(), REAL).units.map((item) => [item.unitId, item.status]))
      .toEqual(REAL_READY.map((id, index) => [id, index <= position ? 'passed' : index === position + 1 ? 'start_learning' : 'locked']));
    expect(realFootprint()).toEqual(before);
    expect(getCourseOverview(kiur(), REAL).units).toEqual([]);
    expectCode(() => getUnitDetail(kiur(), REAL, unitId), 'forbidden');
    // Each run first passes every earlier ready unit in the preview, so the
    // later units take several seconds each; the 5 s default is too tight.
  }, 60_000);

  it('keeps the real course\'s draft units out of the preview and unpublishable; the ready ones publishable and unpublished', () => {
    const drafts = REAL_UNITS.filter((unit) => unit.status !== 'ready').map((unit) => unit.id);
    expect(drafts).toContain('lo-opik-u22');
    const listed = getCourseOverview(preview(), REAL).units.map((unit) => unit.unitId);
    for (const id of drafts) expect(listed).not.toContain(id);
    const real = getParentOverview().courses.find((course) => course.courseId === REAL)!;
    for (const id of drafts) expect(real.units.find((unit) => unit.unitId === id), id).toMatchObject({ published: false, validation: { publishable: false } });
    for (const id of REAL_READY) expect(real.units.find((unit) => unit.unitId === id), id).toMatchObject({ contentStatus: 'ready', published: false, validation: { publishable: true } });
  });

  it('"Lähtesta eelvaade" removes only preview rows (A7)', () => {
    readyForTest(kiur(), COURSE_ID, WATER);
    playTest(kiur(), COURSE_ID, WATER, 2);
    readyForTest(preview(), DEMO, 'demo-vesi');
    startTest(preview(), DEMO, 'demo-vesi');
    readAll(preview(), COURSE_ID, WATER);
    const before = realFootprint();
    const result = resetPreview(DEMO);
    expect(result).toEqual({ reset: true, sessionsRemoved: 2 });
    expect(count("SELECT COUNT(*) AS count FROM textbook_lesson_reads WHERE learner = 'preview' AND courseId = ?", COURSE_ID)).toBeGreaterThan(0);
    expect(getCourseOverview(preview(), DEMO).units[0].status).toBe('start_learning');
    resetPreview();
    for (const table of TEXTBOOK_TABLES) expect(count(`SELECT COUNT(*) AS count FROM ${table} WHERE ${table === 'textbook_unit_publication' ? '0' : "learner = 'preview'"}`)).toBe(0);
    expect(realFootprint()).toEqual(before);
    expect(getUnitDetail(kiur(), COURSE_ID, WATER).attempts).toHaveLength(1);
  });

  it('keeps the demo and the preview learner out of every child route and API (A6/A7)', async () => {
    expectCode(() => getCourseOverview(kiur(), DEMO), 'forbidden');
    expectCode(() => getUnitDetail(kiur(), DEMO, 'demo-vesi'), 'forbidden');
    expectCode(() => startPractice(kiur(), DEMO, 'demo-vesi'), 'forbidden');
    expect(() => childContext('preview' as never)).toThrow(TextbookApiError);
    const response = await childHandlers.courseOverview.GET(new NextRequest(`http://localhost/api/textbook/courses/${DEMO}`), { params: Promise.resolve({ courseId: DEMO }) });
    expect(response.status).toBe(403);
    // A preview session id is not reachable as the child.
    readAll(preview(), DEMO, 'demo-vesi');
    const session = startPractice(preview(), DEMO, 'demo-vesi');
    expectCode(() => getPracticeSession(kiur(), session.sessionId), 'not_found');
    const viaRoute = await childHandlers.practiceSession.GET(new NextRequest(`http://localhost/api/textbook/practice/${session.sessionId}`), { params: Promise.resolve({ sessionId: session.sessionId }) });
    expect(viaRoute.status).toBe(404);
    // A child session is not reachable from the preview either.
    readAll(kiur(), COURSE_ID, WATER);
    const child = startPractice(kiur(), COURSE_ID, WATER);
    expectCode(() => getPracticeSession(preview(), child.sessionId), 'not_found');
  });

  it('puts child textbook writes under the peek read-only rule but not the parent preview', () => {
    expect(isChildWritePath(`/api/textbook/courses/${COURSE_ID}/units/${WATER}/test`)).toBe(true);
    expect(isChildWritePath('/api/textbook/test/tt_x/submit')).toBe(true);
    expect(isChildWritePath('/api/parent/textbook/preview/test/tt_x/submit')).toBe(false);
  });
});
