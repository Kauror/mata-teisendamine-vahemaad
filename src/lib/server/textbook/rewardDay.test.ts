import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { updateLearningPointSettings } from '@/lib/learningPoints';
import { TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { correctResponseFor } from '@/lib/textbook/grading';
import { currentPracticeQuestion, parsePracticeState } from '@/lib/textbook/practiceScheduler';
import type { TestRunState } from '@/lib/textbook/testSession';
import type { Course } from '@/lib/textbook/types';
import { childContext, previewContext, type TextbookContext } from '@/lib/server/textbook/context';
import { setTextbookCoursesForTests } from '@/lib/server/textbook/courses';
import { completeLesson, getUnitDetail } from '@/lib/server/textbook/learner';
import { setPublished } from '@/lib/server/textbook/parent';
import { answerPractice, startPractice } from '@/lib/server/textbook/practice';
import { saveAnswer, startTest, submit } from '@/lib/server/textbook/test';

// "Stars like a vocabulary pass, once per unit per day" — the day is the
// family's day in Tallinn, not the server's UTC day, and the preview never
// earns anything whatever the clock says.

const COURSE_ID = 'opik-reward-day';
const WATER = 'demo-vesi';

function course(): Course {
  const units = (JSON.parse(JSON.stringify(textbookDemoCourse.units)) as Course['units']).map((unit) => ({ ...unit, courseId: COURSE_ID }));
  return { ...JSON.parse(JSON.stringify(textbookDemoCourse)) as Course, id: COURSE_ID, title: 'Päevakursus', learners: ['kiur'], previewOnly: false, units };
}

let counter = 0;
const aid = () => `reward-day-${++counter}-x`;

function count(sql: string) {
  return (db.prepare(sql).get() as { count: number }).count;
}

function readAndPractise(context: TextbookContext, courseId: string) {
  for (const lesson of getUnitDetail(context, courseId, WATER).lessons) completeLesson(context, courseId, WATER, lesson.lessonId);
  let view = startPractice(context, courseId, WATER);
  while (view.status === 'active') {
    const row = db.prepare('SELECT stateJson FROM textbook_practice_sessions WHERE id = ?').get(view.sessionId) as { stateJson: string };
    const frozen = currentPracticeQuestion(parsePracticeState(row.stateJson))!;
    view = answerPractice(context, view.sessionId, { actionId: aid(), revision: view.revision, questionId: frozen.question.id, response: correctResponseFor(frozen.question.answer) }).session;
  }
}

function passTest(context: TextbookContext, courseId: string) {
  let view = startTest(context, courseId, WATER);
  const state = JSON.parse((db.prepare('SELECT stateJson FROM textbook_test_sessions WHERE id = ?').get(view.sessionId) as { stateJson: string }).stateJson) as TestRunState;
  for (const frozen of state.snapshot.questions) {
    view = saveAnswer(context, view.sessionId, { actionId: aid(), revision: view.revision, questionId: frozen.question.id, response: correctResponseFor(frozen.question.answer) }).session;
  }
  return submit(context, view.sessionId, { actionId: aid(), revision: view.revision }).result;
}

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  for (const table of ['textbook_rewards', 'textbook_test_rounds', 'textbook_test_sessions', 'textbook_practice_sessions', 'textbook_lesson_reads', 'textbook_unit_progress', 'textbook_objective_stats', 'textbook_manual_unlocks', 'textbook_unit_publication']) db.exec(`DELETE FROM ${table}`);
  db.exec('DELETE FROM attempt_reward_components; DELETE FROM reward_projection_runs; DELETE FROM study_attempt_rewards; DELETE FROM point_ledger; DELETE FROM attempts; DELETE FROM daily_leaderboard;');
  db.pragma('foreign_keys = ON');
  updateLearningPointSettings({ baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, streakIntervalDays: 7, streakBonusAmount: 0, learningPointsEnabled: true, streakBonusEnabled: false });
  setTextbookCoursesForTests([...TEXTBOOK_COURSES, course()]);
  setPublished(COURSE_ID, WATER, true);
  vi.useFakeTimers({ toFake: ['Date'] });
});

afterEach(() => vi.useRealTimers());
afterAll(() => setTextbookCoursesForTests(null));

describe('textbook reward day', () => {
  it('counts one pass per unit per Tallinn day: 23:50 and 23:55 are one day, 00:05 is the next', () => {
    vi.setSystemTime(new Date('2026-10-17T20:00:00Z'));
    readAndPractise(childContext('kiur'), COURSE_ID);
    vi.setSystemTime(new Date('2026-10-17T20:50:00Z')); // 23:50 in Tallinn (EEST)
    expect(passTest(childContext('kiur'), COURSE_ID).reward?.awardedAmount).toBeGreaterThan(0);
    vi.setSystemTime(new Date('2026-10-17T20:55:00Z')); // 23:55, same Tallinn day, still 17.10 in UTC
    expect(passTest(childContext('kiur'), COURSE_ID)).toMatchObject({ passed: true, reward: null });
    vi.setSystemTime(new Date('2026-10-17T21:05:00Z')); // 00:05 on 18.10 in Tallinn, still 17.10 in UTC
    expect(passTest(childContext('kiur'), COURSE_ID).reward?.awardedAmount).toBeGreaterThan(0);
    expect(db.prepare('SELECT completionDate FROM textbook_rewards ORDER BY createdAt').all()).toEqual([{ completionDate: '2026-10-17' }, { completionDate: '2026-10-18' }]);
    expect(count('SELECT COUNT(*) AS count FROM attempts')).toBe(2);
  });

  it('never rewards the preview, on any day', () => {
    vi.setSystemTime(new Date('2026-10-17T20:50:00Z'));
    readAndPractise(previewContext(), textbookDemoCourse.id);
    expect(passTest(previewContext(), textbookDemoCourse.id)).toMatchObject({ passed: true, reward: null });
    vi.setSystemTime(new Date('2026-10-17T21:05:00Z'));
    expect(passTest(previewContext(), textbookDemoCourse.id)).toMatchObject({ passed: true, reward: null });
    expect(count('SELECT COUNT(*) AS count FROM textbook_rewards')).toBe(0);
    expect(count('SELECT COUNT(*) AS count FROM attempts')).toBe(0);
    expect(count('SELECT COUNT(*) AS count FROM point_ledger')).toBe(0);
  });
});
