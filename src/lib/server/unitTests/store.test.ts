import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { updateLearningPointSettings } from '@/lib/learningPoints';
import { getBalance } from '@/lib/tasks';
import { ensureCurrentRewardPolicy } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2 } from '@/lib/server/rewards/projection';
import { VOCAB_EXERCISE_ID } from '@/lib/vocabulary/constants';
import { addWord, createUnit, updateUnit } from '@/lib/server/vocabulary/units';
import { getChildVocabularyHome } from '@/lib/server/vocabulary/overview';
import { sampleUnitTest } from '@/lib/unitTests/fixture';
import { crosswordCellAnswerKey } from '@/lib/unitTests/grading';
import {
  getParentReview,
  importUnitTests,
  listPendingReviews,
  listVariants,
  reviewUnitTest,
  saveUnitTestAnswers,
  setVariantActive,
  startOrResumeUnitTest,
  UnitTestConflictError,
  UnitTestForbiddenError,
  UnitTestStaleError,
  UnitTestValidationError,
  cancelUnitTest,
  getChildAttempt,
  pendingReviewCount
} from '@/lib/server/unitTests/store';

const LEARNER = 'kiur' as const;

function unit(unitNumber: number) {
  const created = createUnit({ unitNumber, title: `Teema ${unitNumber}` });
  addWord(created.id, { estonian: 'kass', english: 'cat', pronunciation: '' });
  updateUnit(created.id, { published: true });
  return created;
}

function passWordsTest(unitId: string) {
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO english_vocab_progress (learner, unitId, studyCompletedAt, testPassedAt, updatedAt) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(learner, unitId) DO UPDATE SET studyCompletedAt = excluded.studyCompletedAt, testPassedAt = excluded.testPassedAt
  `).run(LEARNER, unitId, now, now, now);
}

const cell = (row: number, col: number) => crosswordCellAnswerKey('4', row, col);
const RIGHT = {
  '1.1': "No, they aren't.",
  '1.2': 'Yes, they are.',
  '2.1.0': 'spot',
  '2.1.1': 'täpp',
  '2.2.0': 'I go to school.',
  '3.1': 'Are you Estonian?',
  [cell(0, 0)]: 'C', [cell(0, 1)]: 'A', [cell(0, 2)]: 'T', [cell(1, 0)]: 'A', [cell(2, 0)]: 'R'
};

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM english_unit_test_attempts; DELETE FROM english_unit_test_variants;
    DELETE FROM english_vocab_events; DELETE FROM english_vocab_test_rounds; DELETE FROM english_vocab_word_stats;
    DELETE FROM english_vocab_sessions; DELETE FROM english_vocab_progress; DELETE FROM english_vocab_word_revisions;
    DELETE FROM english_vocab_words; DELETE FROM english_vocab_units; DELETE FROM english_vocab_imports;
    DELETE FROM attempt_reward_components; DELETE FROM reward_projection_runs; DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger; DELETE FROM attempts; DELETE FROM daily_leaderboard;
  `);
  db.pragma('foreign_keys = ON');
  updateChildLearningExerciseStatus(VOCAB_EXERCISE_ID, LEARNER, 'rotation');
  updateLearningPointSettings({ baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, streakIntervalDays: 7, streakBonusAmount: 0, learningPointsEnabled: true, streakBonusEnabled: false });
});

describe('unit test import', () => {
  it('imports variants, reports unchanged files and blocks the whole batch on one bad file', () => {
    expect(importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }, { name: 'b.json', data: sampleUnitTest(3, 'B') }]).map((item) => item.status)).toEqual(['added', 'added']);
    expect(importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }])[0].status).toBe('unchanged');
    expect(() => importUnitTests([{ name: 'c.json', data: sampleUnitTest(4, 'A') }, { name: 'bad.json', data: { format: 'x' } }])).toThrow(UnitTestValidationError);
    expect(listVariants().map((item) => `${item.unitNumber}${item.variant}`)).toEqual(['3A', '3B']);
    expect(listVariants()[0]).toMatchObject({ points: 8, parentChecked: 1 });
  });
});

describe('unit test flow', () => {
  it('stays closed until the words test is passed, then shows on the unit card', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    expect(() => startOrResumeUnitTest(LEARNER, u.id)).toThrow(UnitTestForbiddenError);
    expect(getChildVocabularyHome(LEARNER).units[0].unitTest).toBeNull();
    passWordsTest(u.id);
    expect(getChildVocabularyHome(LEARNER).units[0].unitTest).toMatchObject({ state: 'available' });
  });

  it('is closed when every variant is switched off', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    setVariantActive(3, 'A', false);
    passWordsTest(u.id);
    expect(() => startOrResumeUnitTest(LEARNER, u.id)).toThrow(UnitTestForbiddenError);
  });

  it('runs start → submit → return → fix → approve, paying stars only on approval', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    passWordsTest(u.id);
    const before = getBalance(LEARNER);

    let view = startOrResumeUnitTest(LEARNER, u.id);
    expect(view.status).toBe('in_progress');
    expect(JSON.stringify(view.test)).not.toContain('Are you Estonian');
    // Resuming returns the same attempt.
    expect(startOrResumeUnitTest(LEARNER, u.id).id).toBe(view.id);

    view = saveUnitTestAnswers(LEARNER, view.id, { revision: view.revision, answers: { ...RIGHT, '1.1': 'Yes, they are.', unknown: 'x' }, submit: false });
    expect(view.answers.unknown).toBeUndefined();
    expect(() => saveUnitTestAnswers(LEARNER, view.id, { revision: view.revision - 1, answers: {}, submit: false })).toThrow(UnitTestStaleError);
    view = saveUnitTestAnswers(LEARNER, view.id, { revision: view.revision, answers: {}, submit: true });
    expect(view.status).toBe('submitted');
    expect(view.results).toBeNull();
    expect(getChildVocabularyHome(LEARNER).units[0].unitTest?.state).toBe('submitted');

    const pending = listPendingReviews();
    expect(pending).toHaveLength(1);
    expect(pending[0].autoScore).toMatchObject({ earned: 6, unmarked: 1 });

    let review = getParentReview(view.id);
    const marks = Object.fromEntries(review.slots.map((slot) => [slot.key, slot.mark]));
    expect(marks['1.1']).toBe(0);
    expect(marks['2.2.0']).toBeNull();
    expect(() => reviewUnitTest(view.id, { revision: review.revision, marks, comment: '', decision: 'approve' })).toThrow(UnitTestValidationError);
    review = reviewUnitTest(view.id, { revision: review.revision, marks: { ...marks, '2.2.0': 1 }, comment: 'Vaata esimest küsimust.', decision: 'return' });
    expect(review.status).toBe('returned');
    expect(getBalance(LEARNER)).toBe(before);

    view = startOrResumeUnitTest(LEARNER, u.id);
    expect(view.status).toBe('returned');
    expect(view.editable).toEqual(['1.1']);
    expect(view.comment).toBe('Vaata esimest küsimust.');
    // A locked (right) answer cannot be changed.
    view = saveUnitTestAnswers(LEARNER, view.id, { revision: view.revision, answers: { '1.1': "No, they aren't.", '2.1.0': 'wrong' }, submit: true });
    expect(view.answers['2.1.0']).toBe('spot');

    review = getParentReview(view.id);
    expect(review.submissions).toBe(2);
    expect(review.score).toMatchObject({ earned: 8, total: 8, unmarked: 0 });
    review = reviewUnitTest(view.id, { revision: review.revision, marks: Object.fromEntries(review.slots.map((slot) => [slot.key, slot.mark])), comment: 'Tubli!', decision: 'approve' });
    expect(review.status).toBe('approved');
    expect(review.stars).toBe(1);
    expect(getBalance(LEARNER)).toBe(before + 1);

    const attempt = db.prepare("SELECT topic, exerciseId, runnerId, score, questionCount FROM attempts WHERE clientAttemptId = ?").get(`unit-test:${view.id}`);
    expect(attempt).toEqual({ topic: 'lisatest', exerciseId: VOCAB_EXERCISE_ID, runnerId: 'kiur-english-unit-test', score: 8, questionCount: 8 });
    expect(getChildVocabularyHome(LEARNER).units[0].unitTest).toMatchObject({ state: 'passed', grade: 5 });
    expect(() => startOrResumeUnitTest(LEARNER, u.id)).toThrow(UnitTestConflictError);
  });

  it('a failed test pays nothing and opens a retake on a fresh attempt', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }, { name: 'b.json', data: sampleUnitTest(3, 'B') }]);
    passWordsTest(u.id);
    const before = getBalance(LEARNER);
    let view = startOrResumeUnitTest(LEARNER, u.id);
    view = saveUnitTestAnswers(LEARNER, view.id, { revision: view.revision, answers: { '1.1': "No, they aren't." }, submit: true });
    const review = getParentReview(view.id);
    const marks = Object.fromEntries(review.slots.map((slot) => [slot.key, slot.mark ?? 0]));
    const done = reviewUnitTest(view.id, { revision: review.revision, marks, comment: '', decision: 'approve' });
    expect(done.score.passed).toBe(false);
    expect(done.stars).toBeNull();
    expect(getBalance(LEARNER)).toBe(before);
    expect(getChildVocabularyHome(LEARNER).units[0].unitTest?.state).toBe('retake');
    const retake = startOrResumeUnitTest(LEARNER, u.id);
    expect(retake.id).not.toBe(view.id);
    expect(['A', 'B']).toContain(retake.test.variant);
  });

  it('keeps the content snapshot when the variant is re-imported or deleted mid-test', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    passWordsTest(u.id);
    const view = startOrResumeUnitTest(LEARNER, u.id);
    const changed = sampleUnitTest(3, 'A');
    changed.title = 'Changed';
    importUnitTests([{ name: 'a.json', data: changed }]);
    expect(startOrResumeUnitTest(LEARNER, u.id).test.title).toBe('Sample');
    expect(view.test.title).toBe('Sample');
  });
});

describe('unit test review rules', () => {
  function handIn(unitId: string, answers: Record<string, string>) {
    let view = startOrResumeUnitTest(LEARNER, unitId);
    view = saveUnitTestAnswers(LEARNER, view.id, { revision: view.revision, answers, submit: true });
    return view;
  }
  const marksOf = (id: string) => Object.fromEntries(getParentReview(id).slots.map((slot) => [slot.key, slot.mark]));

  it('keeps the parent marks on answers the child did not change, and re-marks only changed ones', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    passWordsTest(u.id);
    const view = handIn(u.id, { ...RIGHT, '1.2': "No, they aren't." });
    const review = getParentReview(view.id);
    // The parent gives ✗ to an answer the app accepted, ½ to the open answer, and sends it back.
    reviewUnitTest(view.id, { revision: review.revision, marks: { ...marksOf(view.id), '2.1.0': 0, '2.2.0': 0.5 }, comment: '', decision: 'return' });
    let back = startOrResumeUnitTest(LEARNER, u.id);
    back = saveUnitTestAnswers(LEARNER, back.id, { revision: back.revision, answers: { '1.2': 'Yes, they are.' }, submit: true });
    const after = marksOf(back.id);
    expect(after['2.1.0']).toBe(0);
    expect(after['2.2.0']).toBe(0.5);
    expect(after['1.2']).toBe(1);
  });

  it('shows the right answers after approval, only for answers that were not right', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    passWordsTest(u.id);
    const view = handIn(u.id, { ...RIGHT, '1.2': "No, they aren't." });
    const review = getParentReview(view.id);
    reviewUnitTest(view.id, { revision: review.revision, marks: { ...marksOf(view.id), '2.2.0': 1 }, comment: '', decision: 'approve' });
    const graded = getParentReview(view.id);
    expect(graded.status).toBe('approved');
    const child = getChildAttempt(LEARNER, view.id);
    expect(child.results?.find((item) => item.key === '1.2')).toEqual({ key: '1.2', mark: 0, correct: 'Yes, they are.' });
    expect(child.results?.find((item) => item.key === '1.1')).toEqual({ key: '1.1', mark: 1 });
  });

  it('a retake gets the variant the child has not taken yet', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }, { name: 'b.json', data: sampleUnitTest(3, 'B') }]);
    passWordsTest(u.id);
    const first = handIn(u.id, {});
    const review = getParentReview(first.id);
    reviewUnitTest(first.id, { revision: review.revision, marks: Object.fromEntries(review.slots.map((slot) => [slot.key, 0])), comment: '', decision: 'approve' });
    const retake = startOrResumeUnitTest(LEARNER, u.id);
    expect(retake.test.variant).not.toBe(first.test.variant);
  });

  it('the parent can cancel a test that is not approved, and the unit opens again', () => {
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    passWordsTest(u.id);
    const view = handIn(u.id, RIGHT);
    expect(pendingReviewCount()).toBe(1);
    cancelUnitTest(view.id);
    expect(pendingReviewCount()).toBe(0);
    expect(getChildVocabularyHome(LEARNER).units[0].unitTest?.state).toBe('available');
    const again = handIn(u.id, RIGHT);
    const review = getParentReview(again.id);
    reviewUnitTest(again.id, { revision: review.revision, marks: { ...marksOf(again.id), '2.2.0': 1 }, comment: '', decision: 'approve' });
    expect(() => cancelUnitTest(again.id)).toThrow(UnitTestConflictError);
  });
});

// B6: the kontrolltöö counts on the day the child handed it in, not on the day
// the parent happens to approve it, so the approval day's daily cap cannot
// zero it and its streak day is the child's.
describe('unit test star day', () => {
  afterEach(() => vi.useRealTimers());

  it('dates the approved attempt by the child\'s hand-in day', () => {
    updateLearningPointSettings({ baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 1, streakIntervalDays: 7, streakBonusAmount: 0, learningPointsEnabled: true, streakBonusEnabled: false });
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-11-18T15:00:00.000Z'));
    const u = unit(3);
    importUnitTests([{ name: 'a.json', data: sampleUnitTest(3, 'A') }]);
    passWordsTest(u.id);
    let view = startOrResumeUnitTest(LEARNER, u.id);
    view = saveUnitTestAnswers(LEARNER, view.id, { revision: view.revision, answers: { ...RIGHT, '2.2.0': 'I go to school.' }, submit: true });

    // Next day the child fills that day's cap with another exercise...
    vi.setSystemTime(new Date('2026-11-19T09:00:00.000Z'));
    const policy = ensureCurrentRewardPolicy();
    const other = Number(db.prepare(`
      INSERT INTO attempts (createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, topic,
        exerciseId, runnerId, clientAttemptId, completedAt, effectiveCompletedAt, completionDate, rewardPolicyVersion, protocolVersion, rewardSettlementStatus)
      VALUES (?, 'Lugemine', 'Lihtne', 5, 5, 60, '[]', ?, 'lugemine', 'loe-ja-vasta', 'kiur.reading.loe-ja-vasta', 'kiur-reading', 'b6-other', ?, ?, '2026-11-19', ?, 2, 'eligible')
    `).run('2026-11-19T09:00:00.000Z', LEARNER, '2026-11-19T09:00:00.000Z', '2026-11-19T09:00:00.000Z', policy.version).lastInsertRowid);
    applyRewardProjectionV2(LEARNER, other);
    expect(getBalance(LEARNER)).toBe(1);

    // ...and the parent approves the test only in the evening.
    vi.setSystemTime(new Date('2026-11-19T18:00:00.000Z'));
    let review = getParentReview(view.id);
    review = reviewUnitTest(view.id, { revision: review.revision, marks: Object.fromEntries(review.slots.map((slot) => [slot.key, slot.mark ?? 1])), comment: '', decision: 'approve' });
    expect(review.stars).toBe(1);
    expect(getBalance(LEARNER)).toBe(2);
    const attempt = db.prepare('SELECT completionDate, effectiveCompletedAt FROM attempts WHERE clientAttemptId = ?').get(`unit-test:${view.id}`);
    expect(attempt).toEqual({ completionDate: '2026-11-18', effectiveCompletedAt: '2026-11-18T15:00:00.000Z' });
  });
});
