import { beforeEach, describe, expect, it } from 'vitest';
import db from '@/lib/db';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { getBalance } from '@/lib/tasks';
import { updateLearningPointSettings } from '@/lib/learningPoints';
import { VOCAB_EXERCISE_ID } from '@/lib/vocabulary/constants';
import {
  addWord,
  commitImport,
  createUnit,
  deleteUnit,
  editWord,
  previewImport,
  setManualUnlock,
  setWordRetired,
  updateUnit,
  VocabConflictError
} from '@/lib/server/vocabulary/units';
import {
  applySessionAction,
  startOrResumeSession,
  VocabForbiddenError,
  VocabStaleError,
  type SessionView
} from '@/lib/server/vocabulary/sessions';
import { getChildVocabularyHome, getParentUnitWords, getParentVocabularyOverview } from '@/lib/server/vocabulary/overview';
import { parseImportRows, type ImportTable } from '@/lib/vocabulary/importPlan';

const LEARNER = 'kiur' as const;
let actionCounter = 0;

function act(view: SessionView, action: Record<string, unknown>, actionId = `action-${++actionCounter}`) {
  return applySessionAction(LEARNER, view.id, { actionId, revision: view.revision, action });
}

function unitWithWords(unitNumber: number, count: number, publish = true) {
  const unit = createUnit({ unitNumber, title: `Teema ${unitNumber}` });
  for (let index = 1; index <= count; index += 1) addWord(unit.id, { estonian: `sõna ${unitNumber}.${index}`, english: `word${unitNumber}x${index}`, pronunciation: `/w${index}/` });
  if (publish) updateUnit(unit.id, { published: true });
  return unit;
}

function englishFor(unitId: string, estonian: string) {
  return (db.prepare('SELECT english FROM english_vocab_words WHERE unitId = ? AND estonian = ?').get(unitId, estonian) as { english: string }).english;
}

function finishStudy(unitId: string) {
  let view = startOrResumeSession(LEARNER, { unitId, mode: 'study' });
  while (view.status === 'active') {
    view = act(view, { type: 'reveal' });
    view = act(view, { type: 'grade', known: true });
  }
  return view;
}

// Plays the whole test, answering the listed English words wrong in round 1.
function playTest(unitId: string, wrongInFirstRound: number) {
  let view = startOrResumeSession(LEARNER, { unitId, mode: 'test' });
  let wrongLeft = wrongInFirstRound;
  let guard = 0;
  while (view.status === 'active') {
    const test = view.test!;
    if (test.phase === 'full_summary' || test.phase === 'correction_summary') {
      view = act(view, { type: 'continue' });
      continue;
    }
    const right = englishFor(unitId, test.prompt!.estonian);
    const wrong = test.phase === 'full' && test.round === 1 && wrongLeft > 0;
    if (wrong) wrongLeft -= 1;
    view = act(view, { type: 'answer', answer: wrong ? 'xxx' : right.toUpperCase() });
    view = act(view, { type: 'continue' });
    if (guard++ > 500) throw new Error('test did not end');
  }
  return view;
}

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec(`
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

describe('vocabulary sessions', () => {
  it('starts hidden in the catalogue and refuses sessions while the parent keeps it hidden', () => {
    updateChildLearningExerciseStatus(VOCAB_EXERCISE_ID, LEARNER, 'hidden');
    const unit = unitWithWords(3, 2);
    expect(getChildVocabularyHome(LEARNER).enabled).toBe(false);
    expect(() => startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'study' })).toThrow(VocabForbiddenError);
  });

  it('blocks unpublished units, locked units and a locked test, including direct API calls', () => {
    const first = unitWithWords(7, 2);
    const second = unitWithWords(8, 2);
    const draft = unitWithWords(9, 2, false);
    expect(() => startOrResumeSession(LEARNER, { unitId: draft.id, mode: 'study' })).toThrow(VocabForbiddenError);
    expect(() => startOrResumeSession(LEARNER, { unitId: second.id, mode: 'study' })).toThrow(VocabForbiddenError);
    expect(() => startOrResumeSession(LEARNER, { unitId: first.id, mode: 'test' })).toThrow(/Test avaneb/u);
    const home = getChildVocabularyHome(LEARNER);
    expect(home.units.map((card) => [card.unitNumber, card.status])).toEqual([[7, 'new'], [8, 'locked']]);
    expect(home.units[1]).toMatchObject({ lockReason: 'locked', previousUnitLabel: 'Unit 7 — Teema 7' });
  });

  it('runs study → test → pass, unlocks the next unit and records one canonical attempt with stars', () => {
    const first = unitWithWords(7, 20);
    const second = unitWithWords(8, 3);
    const balanceBefore = getBalance(LEARNER);

    const study = finishStudy(first.id);
    expect(study.study).toMatchObject({ completed: true, firstKnown: 20, total: 20 });
    expect(getChildVocabularyHome(LEARNER).units[0]).toMatchObject({ status: 'study_done', testUnlocked: true });

    const passed = playTest(first.id, 4);
    expect(passed.test).toMatchObject({ phase: 'passed', round: 2 });
    expect(passed.test?.firstRound).toMatchObject({ correct: 16, total: 20, percent: 80 });
    expect(passed.test?.lastRound).toMatchObject({ correct: 20, passed: true });
    expect(passed.nextUnit).toMatchObject({ id: second.id });
    expect(passed.reward?.awardedAmount).toBe(1);
    expect(getBalance(LEARNER)).toBe(balanceBefore + 1);

    const attempts = db.prepare("SELECT * FROM attempts WHERE topic = 'sonavara'").all() as Array<Record<string, unknown>>;
    expect(attempts).toHaveLength(1);
    expect(attempts[0]).toMatchObject({ subject: 'inglise-keel', exerciseId: VOCAB_EXERCISE_ID, runnerId: 'kiur-english-vocabulary', protocolVersion: 2, rewardSettlementStatus: 'eligible', score: 20, questionCount: 20, category: 'Inglise keel - sõnavara' });
    expect(db.prepare("SELECT COUNT(*) AS count FROM daily_leaderboard").get()).toMatchObject({ count: 1 });

    const rounds = db.prepare('SELECT kind, roundNumber, correct, total, passed, answerCount FROM english_vocab_test_rounds ORDER BY id').all();
    expect(rounds).toEqual([
      { kind: 'full', roundNumber: 1, correct: 16, total: 20, passed: 0, answerCount: 20 },
      { kind: 'correction', roundNumber: 1, correct: 4, total: 4, passed: 0, answerCount: 4 },
      { kind: 'full', roundNumber: 2, correct: 20, total: 20, passed: 1, answerCount: 20 }
    ]);

    const home = getChildVocabularyHome(LEARNER);
    expect(home.units.map((card) => card.status)).toEqual(['passed', 'new']);
    // The four missed words are now in weak-word practice.
    expect(home.units[0].weakCount).toBe(4);
    const overview = getParentVocabularyOverview(LEARNER).units[0];
    expect(overview).toMatchObject({ studyFirstKnown: 20, passedScore: 20, passedTotal: 20, fullRounds: 2, testPasses: 1, weakCount: 4 });
    expect(overview.firstTest).toMatchObject({ correct: 16, percent: 80 });
    expect(overview.bestTest).toMatchObject({ correct: 20, percent: 100 });
  });

  it('does not award stars for correction rounds or failing full rounds', () => {
    const unit = unitWithWords(7, 10);
    finishStudy(unit.id);
    let view = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'test' });
    for (let index = 0; index < 10; index += 1) {
      view = act(view, { type: 'answer', answer: index < 3 ? 'nope' : englishFor(unit.id, view.test!.prompt!.estonian) });
      view = act(view, { type: 'continue' });
    }
    expect(view.test).toMatchObject({ phase: 'full_summary' });
    view = act(view, { type: 'continue' });
    while (view.test!.phase === 'correction') {
      view = act(view, { type: 'answer', answer: englishFor(unit.id, view.test!.prompt!.estonian) });
      view = act(view, { type: 'continue' });
    }
    expect(view.test?.phase).toBe('correction_summary');
    expect(db.prepare('SELECT COUNT(*) AS count FROM attempts').get()).toMatchObject({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM point_ledger').get()).toMatchObject({ count: 0 });
  });

  it('treats a retried request as the same action and refuses a stale revision', () => {
    const unit = unitWithWords(3, 1);
    finishStudy(unit.id);
    const start = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'test' });
    const answered = act(start, { type: 'answer', answer: englishFor(unit.id, 'sõna 3.1') }, 'answer-once');
    const passed = act(answered, { type: 'continue' }, 'finish-once');
    expect(passed.status).toBe('completed');
    // The network dropped the response and the browser sends the same action again.
    const retried = applySessionAction(LEARNER, start.id, { actionId: 'finish-once', revision: answered.revision, action: { type: 'continue' } });
    expect(retried.revision).toBe(passed.revision);
    expect(db.prepare('SELECT COUNT(*) AS count FROM attempts').get()).toMatchObject({ count: 1 });
    expect(db.prepare("SELECT COUNT(*) AS count FROM point_ledger WHERE amount > 0").get()).toMatchObject({ count: 1 });
    // A different action based on an old revision is refused with the current state.
    expect(() => applySessionAction(LEARNER, start.id, { actionId: 'late-tab', revision: start.revision, action: { type: 'continue' } })).toThrow(VocabStaleError);
  });

  it('rolls back the attempt, stars and completion together when the transaction fails', () => {
    const unit = unitWithWords(3, 1);
    finishStudy(unit.id);
    let view = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'test' });
    view = act(view, { type: 'answer', answer: 'word3x1' });
    db.exec(`CREATE TEMP TRIGGER fail_progress BEFORE UPDATE OF testPassedAt ON english_vocab_progress BEGIN SELECT RAISE(ABORT, 'injected failure'); END;`);
    try {
      expect(() => act(view, { type: 'continue' })).toThrow(/injected failure/u);
    } finally {
      db.exec('DROP TRIGGER fail_progress');
    }
    expect(db.prepare('SELECT COUNT(*) AS count FROM attempts').get()).toMatchObject({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM point_ledger').get()).toMatchObject({ count: 0 });
    expect(db.prepare('SELECT status FROM english_vocab_sessions WHERE id = ?').get(view.id)).toMatchObject({ status: 'active' });
    // The same action succeeds once the fault is gone.
    expect(act(view, { type: 'continue' }).status).toBe('completed');
    expect(db.prepare('SELECT COUNT(*) AS count FROM attempts').get()).toMatchObject({ count: 1 });
  });

  it('resumes a study session with its queue and pending retries, and the same test session mid-round', () => {
    const unit = unitWithWords(3, 4);
    let view = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'study' });
    view = act(view, { type: 'reveal' });
    view = act(view, { type: 'grade', known: false });
    view = act(view, { type: 'reveal' });
    const resumed = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'study' });
    expect(resumed.id).toBe(view.id);
    expect(resumed.revision).toBe(view.revision);
    expect(resumed.study).toMatchObject({ neededRetry: 1, remainingCards: 4, card: { revealed: true } });
    expect(getChildVocabularyHome(LEARNER).units[0].status).toBe('studying');
  });

  it('keeps the original completion when a unit is repeated', () => {
    const unit = unitWithWords(3, 2);
    finishStudy(unit.id);
    playTest(unit.id, 0);
    const before = db.prepare('SELECT * FROM english_vocab_progress WHERE unitId = ?').get(unit.id) as Record<string, unknown>;
    finishStudy(unit.id);
    playTest(unit.id, 0);
    const after = db.prepare('SELECT * FROM english_vocab_progress WHERE unitId = ?').get(unit.id) as Record<string, unknown>;
    expect(after.testPassedAt).toBe(before.testPassedAt);
    expect(after.passedSessionId).toBe(before.passedSessionId);
    expect(after.studyCompletedAt).toBe(before.studyCompletedAt);
    expect(after).toMatchObject({ testPasses: 2, studyCompletions: 2 });
    // The repeat is its own attempt, decayed by the existing rules (1 → 0.9).
    expect((db.prepare("SELECT SUM(amount) AS total FROM point_ledger WHERE source = 'reward_v2'").get() as { total: number }).total).toBeCloseTo(1.9);
  });

  it('lets the parent unlock a unit by hand and withholds stars if the exercise was hidden mid-test', () => {
    unitWithWords(3, 1);
    const third = unitWithWords(4, 1);
    setManualUnlock(LEARNER, third.id, true);
    finishStudy(third.id);
    let view = startOrResumeSession(LEARNER, { unitId: third.id, mode: 'test' });
    view = act(view, { type: 'answer', answer: 'word4x1' });
    updateChildLearningExerciseStatus(VOCAB_EXERCISE_ID, LEARNER, 'hidden');
    view = act(view, { type: 'continue' });
    expect(view.reward).toMatchObject({ held: true, awardedAmount: 0 });
    expect(db.prepare('SELECT rewardSettlementStatus, reviewReasonCode FROM attempts').get()).toEqual({ rewardSettlementStatus: 'withheld', reviewReasonCode: 'not_permitted' });
  });

  it('practises weak words without touching test results, and a word recovers after two unaided right answers', () => {
    const unit = unitWithWords(3, 3);
    finishStudy(unit.id);
    playTest(unit.id, 1);
    const weak = db.prepare('SELECT wordId FROM english_vocab_word_stats WHERE needsPractice = 1').all() as Array<{ wordId: string }>;
    expect(weak).toHaveLength(1);
    const roundsBefore = db.prepare('SELECT COUNT(*) AS count FROM english_vocab_test_rounds').get();

    // The pass itself was one unaided right answer for the weak word; one more recovers it.
    let practice = startOrResumeSession(LEARNER, { unitId: null, mode: 'practice' });
    expect(practice.practice?.total).toBe(1);
    practice = act(practice, { type: 'answer', answer: englishFor(unit.id, practice.practice!.prompt!.estonian) });
    practice = act(practice, { type: 'continue' });
    expect(practice.status).toBe('completed');
    expect(db.prepare('SELECT COUNT(*) AS count FROM english_vocab_word_stats WHERE needsPractice = 1').get()).toMatchObject({ count: 0 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM english_vocab_test_rounds').get()).toEqual(roundsBefore);
    expect(db.prepare('SELECT COUNT(*) AS count FROM attempts').get()).toMatchObject({ count: 1 });
    expect(() => startOrResumeSession(LEARNER, { unitId: null, mode: 'practice' })).toThrow(/ei ole ühtegi sõna/u);

    const details = getParentUnitWords(LEARNER, unit.id);
    const missed = details.words.find((word) => word.testWrong > 0)!;
    expect(missed).toMatchObject({ testWrong: 1, correctionWrong: 0, studyWrong: 0, practiceCorrect: 1, needsPractice: false, recentWrongAnswers: ['xxx'] });
    expect(details.mostMissed[0]).toMatchObject({ id: missed.id, mistakes: 1 });
  });
});

describe('parent unit administration', () => {
  it('protects used units from renumbering and deletion, and refuses publishing an empty unit', () => {
    const empty = createUnit({ unitNumber: 5, title: '' });
    expect(empty.title).toBe('Unit 5');
    expect(() => updateUnit(empty.id, { published: true })).toThrow(/Tühja/u);
    expect(() => createUnit({ unitNumber: 5, title: 'x' })).toThrow(VocabConflictError);
    deleteUnit(empty.id);

    const used = unitWithWords(3, 1);
    finishStudy(used.id);
    expect(() => updateUnit(used.id, { unitNumber: 4 })).toThrow(VocabConflictError);
    expect(updateUnit(used.id, { title: 'Thank you' }).title).toBe('Thank you');
    expect(() => deleteUnit(used.id)).toThrow(VocabConflictError);
  });

  it('keeps a running session and history intact when the parent edits a word', () => {
    const unit = unitWithWords(3, 1);
    finishStudy(unit.id);
    let view = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'test' });
    const wordId = (db.prepare('SELECT id FROM english_vocab_words WHERE unitId = ?').get(unit.id) as { id: string }).id;
    editWord(wordId, { estonian: 'sõna 3.1', english: 'corrected', pronunciation: '/k/' });
    // The session grades against the spelling it started with.
    view = act(view, { type: 'answer', answer: 'word3x1' });
    expect(view.test?.feedback).toMatchObject({ correct: true, expected: 'word3x1' });
    view = act(view, { type: 'continue' });
    expect(view.status).toBe('completed');
    expect(db.prepare('SELECT revision FROM english_vocab_words WHERE id = ?').get(wordId)).toEqual({ revision: 2 });
    expect(db.prepare('SELECT COUNT(*) AS count FROM english_vocab_word_revisions WHERE wordId = ?').get(wordId)).toEqual({ count: 2 });
    expect(db.prepare("SELECT expected FROM english_vocab_events WHERE phase = 'full'").get()).toEqual({ expected: 'word3x1' });
    // Retiring keeps the row (and its statistics) but hides it from new sessions.
    setWordRetired(wordId, true);
    expect(getChildVocabularyHome(LEARNER).units).toEqual([]);
    expect(getParentUnitWords(LEARNER, unit.id).words[0]).toMatchObject({ retired: true, testCorrect: 1 });
  });

  it('imports through preview and commit, refuses a stale preview and never publishes', () => {
    const table: ImportTable = [
      ['English', 'Pronunciation', 'Estonian'],
      ['UNIT 3  |   Thank you', '', ''],
      ['friendly', "['frendli]", 'sõbralik'],
      ['good deed', '', 'heategu'],
      ['UNIT 4  |   Zoo', '', ''],
      ['zoo', '[zu:]', 'loomaaed']
    ].map((row) => row.map((value) => value ? { v: value, t: 's' as const } : { v: '', t: 'empty' as const }));
    const parsed = parseImportRows(table, { headerRow: 0, english: 0, pronunciation: 1, estonian: 2, accepted: null, unit: null, title: null, unitHeaderRows: true });
    const { plan, planHash } = previewImport(parsed, 'merge');
    expect(plan.canCommit).toBe(true);

    createUnit({ unitNumber: 4, title: 'Zoo' });
    expect(() => commitImport(parsed, 'merge', planHash, 'sonad.xlsx')).toThrow(/muutusid/u);

    const fresh = previewImport(parsed, 'merge');
    commitImport(parsed, 'merge', fresh.planHash, 'sonad.xlsx');
    const units = db.prepare('SELECT unitNumber, title, published FROM english_vocab_units ORDER BY unitNumber').all();
    expect(units).toEqual([{ unitNumber: 3, title: 'Thank you', published: 0 }, { unitNumber: 4, title: 'Zoo', published: 0 }]);
    expect(db.prepare("SELECT pronunciation FROM english_vocab_words WHERE english = 'friendly'").get()).toEqual({ pronunciation: "['frendli]" });

    // Re-importing the same file changes nothing.
    const again = previewImport(parsed, 'merge');
    expect(again.plan.totals).toMatchObject({ new: 0, updated: 0, unchanged: 3 });
  });
});
