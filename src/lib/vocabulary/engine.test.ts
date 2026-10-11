import { describe, expect, it } from 'vitest';
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
  STUDY_RETRY_GAP,
  studySummary,
  VocabRuleError,
  type StudyState,
  type TestState
} from '@/lib/vocabulary/engine';
import { isAnswerCorrect, normalizeAnswer } from '@/lib/vocabulary/answers';
import { displayPercent, passesThreshold, requiredCorrect } from '@/lib/vocabulary/threshold';
import type { VocabWordSnapshot } from '@/lib/vocabulary/types';

function words(count: number): VocabWordSnapshot[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `w${index + 1}`,
    estonian: `sõna ${index + 1}`,
    english: `word${index + 1}`,
    pronunciation: `/wɜːd${index + 1}/`,
    acceptedAnswers: []
  }));
}

function grade(state: StudyState, known: boolean) {
  const revealed = applyStudyAction(state, { type: 'reveal' }).state;
  return applyStudyAction(revealed, { type: 'grade', known });
}

// Answers the current word right unless its id is in `wrong`, then continues.
function answerAndContinue(state: TestState, wrong: Set<string>) {
  const word = currentTestWord(state)!;
  const answered = applyTestAction(state, { type: 'answer', answer: wrong.has(word.id) ? 'nope' : word.english });
  return applyTestAction(answered.state, { type: 'continue' });
}

// Plays one full round, answering the given words wrong.
function playFullRound(state: TestState, wrong: Set<string>) {
  expect(state.phase).toBe('full');
  let current = state;
  let last = null;
  for (let index = 0; index < state.words.length; index += 1) {
    last = answerAndContinue(current, wrong);
    current = last.state;
  }
  return { state: current, completedRound: last!.completedRound };
}

function playCorrections(state: TestState, wrongFirstTime = new Set<string>()) {
  let current = applyTestAction(state, { type: 'continue' }).state;
  expect(current.phase).toBe('correction');
  const missedOnce = new Set<string>();
  let guard = 0;
  while (current.phase === 'correction') {
    const word = currentTestWord(current)!;
    const fail = wrongFirstTime.has(word.id) && !missedOnce.has(word.id);
    if (fail) missedOnce.add(word.id);
    const answered = applyTestAction(current, { type: 'answer', answer: fail ? 'wrong' : word.english });
    current = applyTestAction(answered.state, { type: 'continue' }).state;
    if (guard++ > 100) throw new Error('correction loop did not end');
  }
  return current;
}

describe('answer checking', () => {
  const cat = { english: 'cat', acceptedAnswers: [] };

  it('accepts the exact spelling and rejects a misspelling', () => {
    expect(isAnswerCorrect(cat, 'cat')).toBe(true);
    expect(isAnswerCorrect(cat, 'kat')).toBe(false);
    expect(isAnswerCorrect(cat, 'cats')).toBe(false);
    expect(isAnswerCorrect(cat, '')).toBe(false);
  });

  it('ignores capitals, surrounding spaces and repeated whitespace', () => {
    expect(isAnswerCorrect(cat, 'CAT')).toBe(true);
    expect(isAnswerCorrect(cat, '  cat  ')).toBe(true);
    expect(isAnswerCorrect({ english: 'good deed', acceptedAnswers: [] }, ' good   deed ')).toBe(true);
  });

  it('accepts explicitly stored alternatives only', () => {
    const word = { english: 'mum', acceptedAnswers: ['mom', 'mummy'] };
    expect(isAnswerCorrect(word, 'mom')).toBe(true);
    expect(isAnswerCorrect(word, 'Mummy')).toBe(true);
    expect(isAnswerCorrect(word, 'mam')).toBe(false);
  });

  it('treats typographic apostrophes and closing punctuation as the same answer', () => {
    expect(isAnswerCorrect({ english: "You're welcome.", acceptedAnswers: [] }, 'you’re welcome')).toBe(true);
    expect(isAnswerCorrect({ english: 'Like what?', acceptedAnswers: [] }, 'like what')).toBe(true);
    expect(isAnswerCorrect({ english: "You're welcome.", acceptedAnswers: [] }, 'youre welcome')).toBe(false);
  });

  it('keeps Unicode and multiword text intact when normalising', () => {
    expect(normalizeAnswer('  Café  au   lait ')).toBe('café au lait');
  });
});

describe('95% threshold', () => {
  it('fails 94% and passes 95% in a 20-word unit', () => {
    expect(passesThreshold(18, 20)).toBe(false);
    expect(passesThreshold(19, 20)).toBe(true);
    expect(requiredCorrect(20)).toBe(19);
  });

  it('uses exact integer arithmetic for small units', () => {
    expect(requiredCorrect(18)).toBe(18);
    expect(passesThreshold(17, 18)).toBe(false);
    expect(requiredCorrect(19)).toBe(19);
    expect(passesThreshold(18, 19)).toBe(false);
    expect(requiredCorrect(1)).toBe(1);
    expect(requiredCorrect(40)).toBe(38);
    expect(passesThreshold(38, 40)).toBe(true);
    expect(passesThreshold(37, 40)).toBe(false);
    for (let total = 1; total <= 200; total += 1) {
      const required = requiredCorrect(total);
      expect(passesThreshold(required, total)).toBe(true);
      expect(passesThreshold(required - 1, total)).toBe(false);
    }
  });

  it('never displays a failing score as 95%', () => {
    expect(displayPercent(18, 19)).toBe(94);
    expect(displayPercent(19, 20)).toBe(95);
  });
});

describe('study engine', () => {
  it('refuses an assessment before the card is revealed', () => {
    const state = createStudyState(words(3), 1);
    expect(() => applyStudyAction(state, { type: 'grade', known: true })).toThrow(VocabRuleError);
  });

  it('records a right swipe as known and a left swipe as unknown', () => {
    const state = createStudyState(words(3), 1);
    const first = currentStudyWord(state)!;
    const known = grade(state, true);
    expect(known.event).toMatchObject({ wordId: first.id, phase: 'study', correct: true, firstEncounter: true });
    expect(known.state.known).toContain(first.id);

    const second = currentStudyWord(known.state)!;
    const unknown = grade(known.state, false);
    expect(unknown.event).toMatchObject({ wordId: second.id, correct: false, firstEncounter: true });
    expect(unknown.state.known).not.toContain(second.id);
  });

  it('brings a missed word back after other cards instead of restarting the deck', () => {
    const state = createStudyState(words(6), 7);
    const missed = currentStudyWord(state)!;
    let current = grade(state, false).state;
    const seenBeforeRetry: string[] = [];
    while (currentStudyWord(current)!.id !== missed.id) {
      seenBeforeRetry.push(currentStudyWord(current)!.id);
      current = grade(current, true).state;
    }
    expect(seenBeforeRetry).toHaveLength(STUDY_RETRY_GAP);
    // The rest of the deck is not repeated: those three are already known.
    expect(new Set(seenBeforeRetry).size).toBe(STUDY_RETRY_GAP);
  });

  it('completes only when every word has had a right swipe, and keeps first-pass statistics', () => {
    let current = createStudyState(words(20), 11);
    const firstUnknown = new Set(current.queue.slice(0, 5));
    let guard = 0;
    while (!current.completed) {
      const word = currentStudyWord(current)!;
      // Unknown on the first encounter, known afterwards.
      const known = !(firstUnknown.has(word.id) && current.firstResults[word.id] === undefined);
      current = grade(current, known).state;
      if (guard++ > 100) throw new Error('study did not end');
    }
    expect(current.known).toHaveLength(20);
    expect(studySummary(current)).toMatchObject({ total: 20, firstKnown: 15, neededRetry: 5, knownCount: 20 });
    expect(current.swipes).toBe(25);
    expect(() => grade(current, true)).toThrow(VocabRuleError);
  });

  it('keeps asking a word answered wrong several times', () => {
    let current = createStudyState(words(1), 3);
    current = grade(current, false).state;
    current = grade(current, false).state;
    expect(current.completed).toBe(false);
    current = grade(current, true).state;
    expect(current.completed).toBe(true);
    expect(current.wrongSwipes.w1).toBe(2);
    expect(studySummary(current).firstKnown).toBe(0);
  });
});

describe('test engine', () => {
  it('passes at the first full round reaching 95%', () => {
    const state = createTestState(words(20), 5);
    const { state: done, completedRound } = playFullRound(state, new Set([state.queue[0]]));
    expect(completedRound).toMatchObject({ kind: 'full', round: 1, correct: 19, total: 20, passed: true });
    expect(done.phase).toBe('passed');
  });

  it('follows the full → corrections → full cycle and stops at 95%', () => {
    const initial = createTestState(words(20), 9);
    const ids = initial.words.map((word) => word.id);

    // Round 1: 16/20.
    let round = playFullRound(initial, new Set(ids.slice(0, 4)));
    expect(round.completedRound).toMatchObject({ round: 1, correct: 16, passed: false });
    expect(round.state.phase).toBe('full_summary');

    // Corrections contain exactly the 4 missed words.
    const corrections = applyTestAction(round.state, { type: 'continue' }).state;
    expect([...corrections.queue].sort()).toEqual(ids.slice(0, 4).sort());

    // A correction answered wrong comes back until it is right.
    let current = playCorrections(round.state, new Set([ids[0]]));
    expect(current.phase).toBe('correction_summary');
    expect(current.rounds[0].correctionAnswers).toBe(5);

    // Round 2 asks ALL 20 words again: 18/20 is 90% and fails.
    current = applyTestAction(current, { type: 'continue' }).state;
    expect(current.phase).toBe('full');
    expect(current.round).toBe(2);
    expect([...current.queue].sort()).toEqual([...ids].sort());
    round = playFullRound(current, new Set(ids.slice(0, 2)));
    expect(round.completedRound).toMatchObject({ round: 2, correct: 18, passed: false });

    // Round 3: 19/20 passes.
    current = playCorrections(round.state);
    current = applyTestAction(current, { type: 'continue' }).state;
    round = playFullRound(current, new Set([ids[5]]));
    expect(round.completedRound).toMatchObject({ round: 3, correct: 19, total: 20, passed: true });
    expect(round.state.phase).toBe('passed');

    // History of every round is preserved; the first score never changes.
    expect(round.state.rounds.map((record) => record.correct)).toEqual([16, 18, 19]);
    expect(round.state.rounds[0].wrongWordIds).toHaveLength(4);
    expect(() => applyTestAction(round.state, { type: 'continue' })).toThrow(VocabRuleError);
  });

  it('never passes on a correction round, however many answers are right', () => {
    const initial = createTestState(words(10), 2);
    // 5/10 wrong → corrections; finishing corrections perfectly is not a pass.
    const round = playFullRound(initial, new Set(initial.words.slice(0, 5).map((word) => word.id)));
    const corrected = playCorrections(round.state);
    expect(corrected.phase).toBe('correction_summary');
    expect(corrected.rounds.every((record) => !record.passed)).toBe(true);
  });

  it('applies the exact threshold to a small unit', () => {
    const initial = createTestState(words(18), 4);
    const failed = playFullRound(initial, new Set([initial.words[0].id]));
    expect(failed.completedRound).toMatchObject({ correct: 17, total: 18, passed: false });
    const perfect = playFullRound(createTestState(words(18), 4), new Set());
    expect(perfect.completedRound).toMatchObject({ correct: 18, passed: true });
  });

  it('requires feedback to be acknowledged before the next answer', () => {
    const state = createTestState(words(3), 1);
    const answered = applyTestAction(state, { type: 'answer', answer: 'x' });
    expect(() => applyTestAction(answered.state, { type: 'answer', answer: 'y' })).toThrow(VocabRuleError);
    expect(answered.state.feedback).toMatchObject({ correct: false, answer: 'x', expected: currentTestWord(state)!.english });
  });

  it('records full-round answers as recovery evidence and corrections as not', () => {
    const state = createTestState(words(2), 1);
    const full = applyTestAction(state, { type: 'answer', answer: currentTestWord(state)!.english });
    expect(full.event).toMatchObject({ phase: 'full', countsForRecovery: true });
    const round = playFullRound(createTestState(words(2), 1), new Set(['w1', 'w2']));
    const correction = applyTestAction(applyTestAction(round.state, { type: 'continue' }).state, { type: 'answer', answer: 'word1' });
    expect(correction.event).toMatchObject({ phase: 'correction', countsForRecovery: false });
  });

  it('is deterministic for the same seed', () => {
    expect(createTestState(words(30), 42).queue).toEqual(createTestState(words(30), 42).queue);
    expect(createStudyState(words(30), 42).queue).not.toEqual(createStudyState(words(30), 43).queue);
  });
});

describe('practice engine', () => {
  it('repeats a missed word until it is typed correctly, and only first tries count for recovery', () => {
    let state = createPracticeState(words(2), 8);
    const first = currentPracticeWord(state)!;
    const wrong = applyPracticeAction(state, { type: 'answer', answer: 'zzz' });
    expect(wrong.event).toMatchObject({ wordId: first.id, correct: false, countsForRecovery: true });
    state = applyPracticeAction(wrong.state, { type: 'continue' }).state;
    let guard = 0;
    while (!state.completed) {
      const word = currentPracticeWord(state)!;
      const result = applyPracticeAction(state, { type: 'answer', answer: word.english });
      if (word.id === first.id) expect(result.event?.countsForRecovery).toBe(false);
      state = applyPracticeAction(result.state, { type: 'continue' }).state;
      if (guard++ > 20) throw new Error('practice did not end');
    }
    expect(state.mastered).toHaveLength(2);
    expect(state.firstTryCorrect).toHaveLength(1);
  });
});
