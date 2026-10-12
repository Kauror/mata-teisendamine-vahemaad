// The vocabulary runners as pure state machines. The server owns the state,
// stores it after every action and is the only place an action is applied, so
// a browser can never grade itself or skip a step. Pure functions make every
// rule — retry spacing, the full-round 95% rule, correction rounds — testable
// without a database or a browser.
//
// Every function returns a NEW state; inputs are never mutated. Randomness is a
// stored seed, so replaying a session's actions always reproduces it.

import { seededRng, shuffleWithRng } from '@/lib/random';
import { boundedAnswer, isAnswerCorrect } from '@/lib/vocabulary/answers';
import { passesThreshold } from '@/lib/vocabulary/threshold';
import type { VocabEvent, VocabWordSnapshot } from '@/lib/vocabulary/types';

// A card answered "Ei teadnud" comes back after this many other cards (or at
// the end of the deck when fewer remain), so the child cannot simply keep
// guessing the same card twice in a row.
export const STUDY_RETRY_GAP = 3;
// A word missed in a correction round or in practice comes back after this
// many other words.
export const TYPED_RETRY_GAP = 2;

export class VocabRuleError extends Error {}

function shuffled(ids: readonly string[], seed: number, salt: number) {
  return shuffleWithRng(seededRng((seed + salt * 7919) >>> 0), ids);
}

function reinsert(queue: readonly string[], cursor: number, wordId: string, gap: number) {
  const next = [...queue];
  const position = Math.min(cursor + 1 + gap, next.length);
  next.splice(position, 0, wordId);
  return next;
}

function wordById(words: readonly VocabWordSnapshot[], id: string) {
  const word = words.find((item) => item.id === id);
  if (!word) throw new VocabRuleError('Sessiooni sõna puudub.');
  return word;
}

function assertWords(words: readonly VocabWordSnapshot[]) {
  if (words.length === 0) throw new VocabRuleError('Selles õppetükis ei ole veel sõnu.');
  if (new Set(words.map((word) => word.id)).size !== words.length) throw new VocabRuleError('Sõnade tunnused peavad olema kordumatud.');
}

/* ------------------------------------------------------------------ study */

export type StudyState = {
  kind: 'study';
  version: 1;
  seed: number;
  words: VocabWordSnapshot[];
  queue: string[];
  cursor: number;
  revealed: boolean;
  // The first assessment each word received in this session.
  firstResults: Record<string, boolean>;
  // Words that have had at least one "Teadsin".
  known: string[];
  wrongSwipes: Record<string, number>;
  swipes: number;
  completed: boolean;
  // 'new': only the words added to the unit after it was last studied, which
  // must be studied before the (not yet passed) test opens again. Absent in
  // sessions created before this existed, which means 'all'.
  scope?: 'all' | 'new';
};

export type StudyAction = { type: 'reveal' } | { type: 'grade'; known: boolean };

export function createStudyState(words: VocabWordSnapshot[], seed: number, scope: 'all' | 'new' = 'all'): StudyState {
  assertWords(words);
  return {
    kind: 'study',
    version: 1,
    scope,
    seed,
    words: words.map((word) => ({ ...word, acceptedAnswers: [...word.acceptedAnswers] })),
    queue: shuffled(words.map((word) => word.id), seed, 0),
    cursor: 0,
    revealed: false,
    firstResults: {},
    known: [],
    wrongSwipes: {},
    swipes: 0,
    completed: false
  };
}

export function currentStudyWord(state: StudyState): VocabWordSnapshot | null {
  if (state.completed) return null;
  const id = state.queue[state.cursor];
  return id ? wordById(state.words, id) : null;
}

export function applyStudyAction(state: StudyState, action: StudyAction): { state: StudyState; event: VocabEvent | null } {
  if (state.completed) throw new VocabRuleError('Õppimine on juba lõpetatud.');
  const word = currentStudyWord(state);
  if (!word) throw new VocabRuleError('Õppimise olek on vigane.');

  if (action.type === 'reveal') {
    if (state.revealed) return { state, event: null };
    return { state: { ...state, revealed: true }, event: null };
  }
  if (action.type !== 'grade' || typeof action.known !== 'boolean') throw new VocabRuleError('Tundmatu tegevus.');
  // The answer must be on screen before the child can say whether they knew it.
  if (!state.revealed) throw new VocabRuleError('Puuduta kõigepealt kaarti, et vastust näha.');

  const firstEncounter = !(word.id in state.firstResults);
  const firstResults = firstEncounter ? { ...state.firstResults, [word.id]: action.known } : state.firstResults;
  const known = action.known && !state.known.includes(word.id) ? [...state.known, word.id] : state.known;
  const queue = action.known ? state.queue : reinsert(state.queue, state.cursor, word.id, STUDY_RETRY_GAP);
  const wrongSwipes = action.known ? state.wrongSwipes : { ...state.wrongSwipes, [word.id]: (state.wrongSwipes[word.id] ?? 0) + 1 };
  const cursor = state.cursor + 1;
  // A wrong card is always put back into the queue, so the deck runs out only
  // once every word has had a "Teadsin".
  const completed = cursor >= queue.length;
  if (completed && known.length !== state.words.length) throw new VocabRuleError('Õppimise järjekord on vigane.');

  return {
    state: { ...state, queue, cursor, revealed: false, firstResults, known, wrongSwipes, swipes: state.swipes + 1, completed },
    event: {
      wordId: word.id,
      phase: 'study',
      round: 1,
      correct: action.known,
      answer: null,
      expected: word.english,
      firstEncounter,
      countsForRecovery: false
    }
  };
}

export function studySummary(state: StudyState) {
  const total = state.words.length;
  const firstKnown = state.words.filter((word) => state.firstResults[word.id] === true).length;
  return {
    total,
    knownCount: state.known.length,
    firstKnown,
    neededRetry: state.words.filter((word) => state.firstResults[word.id] === false).length,
    // Cards still waiting in the queue after the current one, retries included.
    remainingCards: Math.max(0, state.queue.length - state.cursor)
  };
}

/* ------------------------------------------------------------------- test */

export type TestRoundRecord = {
  round: number;
  total: number;
  correct: number;
  wrongWordIds: string[];
  correctionAnswers: number;
  passed: boolean;
};

export type TypedFeedback = {
  wordId: string;
  answer: string;
  correct: boolean;
  expected: string;
  pronunciation: string;
};

export type TestPhase = 'full' | 'full_summary' | 'correction' | 'correction_summary' | 'passed';

export type TestState = {
  kind: 'test';
  version: 1;
  seed: number;
  words: VocabWordSnapshot[];
  phase: TestPhase;
  // Number of the current (or last) complete round, starting at 1.
  round: number;
  queue: string[];
  cursor: number;
  feedback: TypedFeedback | null;
  roundAnswers: Array<{ wordId: string; answer: string; correct: boolean }>;
  correctionAnswers: number;
  rounds: TestRoundRecord[];
};

export type TypedAction = { type: 'answer'; answer: string } | { type: 'continue' };

export function createTestState(words: VocabWordSnapshot[], seed: number): TestState {
  assertWords(words);
  return {
    kind: 'test',
    version: 1,
    seed,
    words: words.map((word) => ({ ...word, acceptedAnswers: [...word.acceptedAnswers] })),
    phase: 'full',
    round: 1,
    queue: shuffled(words.map((word) => word.id), seed, 1),
    cursor: 0,
    feedback: null,
    roundAnswers: [],
    correctionAnswers: 0,
    rounds: []
  };
}

export function currentTestWord(state: TestState): VocabWordSnapshot | null {
  if (state.phase !== 'full' && state.phase !== 'correction') return null;
  const id = state.queue[state.cursor];
  return id ? wordById(state.words, id) : null;
}

export type TestTransition = {
  state: TestState;
  event: VocabEvent | null;
  // Set when this action finished a round, so the server can store it.
  completedRound: (TestRoundRecord & { kind: 'full' | 'correction' }) | null;
};

export function applyTestAction(state: TestState, action: TypedAction): TestTransition {
  if (state.phase === 'passed') throw new VocabRuleError('Test on juba läbitud.');

  if (action.type === 'answer') {
    if (state.phase !== 'full' && state.phase !== 'correction') throw new VocabRuleError('Praegu ei saa vastata.');
    if (state.feedback) throw new VocabRuleError('Jätkamiseks vajuta „Edasi“.');
    if (typeof action.answer !== 'string') throw new VocabRuleError('Vastus puudub.');
    const word = currentTestWord(state);
    if (!word) throw new VocabRuleError('Testi olek on vigane.');
    const answer = boundedAnswer(action.answer);
    const correct = isAnswerCorrect(word, answer);
    const feedback: TypedFeedback = { wordId: word.id, answer, correct, expected: word.english, pronunciation: word.pronunciation };
    const isFull = state.phase === 'full';
    const next: TestState = isFull
      ? { ...state, feedback, roundAnswers: [...state.roundAnswers, { wordId: word.id, answer, correct }] }
      : {
          ...state,
          feedback,
          correctionAnswers: state.correctionAnswers + 1,
          // A correction answered wrong is asked again until it is right.
          queue: correct ? state.queue : reinsert(state.queue, state.cursor, word.id, TYPED_RETRY_GAP)
        };
    return {
      state: next,
      completedRound: null,
      event: {
        wordId: word.id,
        phase: isFull ? 'full' : 'correction',
        round: state.round,
        correct,
        answer,
        expected: word.english,
        firstEncounter: false,
        // The child has just been shown this word's spelling in a correction
        // round, so getting it right there proves little.
        countsForRecovery: isFull
      }
    };
  }

  if (action.type !== 'continue') throw new VocabRuleError('Tundmatu tegevus.');

  if (state.phase === 'full_summary') {
    const targets = [...new Set(state.rounds.at(-1)?.wrongWordIds ?? [])];
    return {
      state: { ...state, phase: 'correction', queue: shuffled(targets, state.seed, 100 + state.round), cursor: 0, feedback: null, correctionAnswers: 0 },
      event: null,
      completedRound: null
    };
  }
  if (state.phase === 'correction_summary') {
    const round = state.round + 1;
    return {
      state: { ...state, phase: 'full', round, queue: shuffled(state.words.map((word) => word.id), state.seed, round), cursor: 0, feedback: null, roundAnswers: [] },
      event: null,
      completedRound: null
    };
  }

  if (!state.feedback) throw new VocabRuleError('Kirjuta kõigepealt vastus.');
  const cursor = state.cursor + 1;
  const cleared: TestState = { ...state, feedback: null, cursor };
  if (cursor < state.queue.length) return { state: cleared, event: null, completedRound: null };

  if (state.phase === 'correction') {
    // Every missed word has now been typed correctly. The rounds record keeps
    // how many answers that took; the next step is a whole new full round.
    const rounds = state.rounds.map((record, index) => index === state.rounds.length - 1 ? { ...record, correctionAnswers: state.correctionAnswers } : record);
    const last = rounds.at(-1)!;
    return {
      state: { ...cleared, phase: 'correction_summary', rounds },
      event: null,
      completedRound: { ...last, kind: 'correction', total: last.wrongWordIds.length, correct: last.wrongWordIds.length }
    };
  }

  // A full round just ended. Only this kind of round can pass the test.
  const total = state.words.length;
  const correctCount = state.roundAnswers.filter((answer) => answer.correct).length;
  const wrongWordIds = state.roundAnswers.filter((answer) => !answer.correct).map((answer) => answer.wordId);
  const passed = passesThreshold(correctCount, total);
  const record: TestRoundRecord = { round: state.round, total, correct: correctCount, wrongWordIds, correctionAnswers: 0, passed };
  return {
    state: { ...cleared, phase: passed ? 'passed' : 'full_summary', rounds: [...state.rounds, record] },
    event: null,
    completedRound: { ...record, kind: 'full' }
  };
}

/* --------------------------------------------------------------- practice */

export type PracticeState = {
  kind: 'practice';
  version: 1;
  seed: number;
  words: VocabWordSnapshot[];
  queue: string[];
  cursor: number;
  feedback: TypedFeedback | null;
  // Words answered correctly at least once in this session.
  mastered: string[];
  // Words that have had a first attempt; a later attempt is a re-ask.
  attempted: string[];
  firstTryCorrect: string[];
  answers: number;
  completed: boolean;
  // Words taken out of this session because they stopped needing practice or
  // became unavailable (retired, unpublished, locked). Absent in older sessions.
  dropped?: string[];
};

// Removes words that should no longer be practised from what is still to
// come. The word on screen with its feedback stays; everything after it is
// filtered. If nothing is left, the session is complete.
export function prunePractice(state: PracticeState, keep: ReadonlySet<string>): PracticeState {
  if (state.completed) return state;
  const protectedCount = state.feedback ? state.cursor + 1 : state.cursor;
  const head = state.queue.slice(0, protectedCount);
  const tail = state.queue.slice(protectedCount).filter((id) => keep.has(id));
  const queue = [...head, ...tail];
  const dropped = [...new Set([...(state.dropped ?? []), ...state.words
    .filter((word) => !keep.has(word.id) && !state.mastered.includes(word.id) && !queue.slice(state.cursor).includes(word.id))
    .map((word) => word.id)])];
  const unchanged = queue.length === state.queue.length && dropped.length === (state.dropped ?? []).length;
  if (unchanged) return state;
  return { ...state, queue, dropped, completed: !state.feedback && state.cursor >= queue.length };
}

export function practiceTotal(state: PracticeState) {
  return state.words.length - (state.dropped ?? []).length;
}

export function createPracticeState(words: VocabWordSnapshot[], seed: number): PracticeState {
  assertWords(words);
  return {
    kind: 'practice',
    version: 1,
    seed,
    words: words.map((word) => ({ ...word, acceptedAnswers: [...word.acceptedAnswers] })),
    queue: shuffled(words.map((word) => word.id), seed, 2),
    cursor: 0,
    feedback: null,
    mastered: [],
    attempted: [],
    firstTryCorrect: [],
    answers: 0,
    completed: false
  };
}

export function currentPracticeWord(state: PracticeState): VocabWordSnapshot | null {
  if (state.completed) return null;
  const id = state.queue[state.cursor];
  return id ? wordById(state.words, id) : null;
}

export function applyPracticeAction(state: PracticeState, action: TypedAction): { state: PracticeState; event: VocabEvent | null } {
  if (state.completed) throw new VocabRuleError('Kordamine on juba lõpetatud.');
  if (action.type === 'answer') {
    if (state.feedback) throw new VocabRuleError('Jätkamiseks vajuta „Edasi“.');
    if (typeof action.answer !== 'string') throw new VocabRuleError('Vastus puudub.');
    const word = currentPracticeWord(state);
    if (!word) throw new VocabRuleError('Kordamise olek on vigane.');
    const answer = boundedAnswer(action.answer);
    const correct = isAnswerCorrect(word, answer);
    const firstTry = !state.attempted.includes(word.id);
    return {
      state: {
        ...state,
        feedback: { wordId: word.id, answer, correct, expected: word.english, pronunciation: word.pronunciation },
        attempted: firstTry ? [...state.attempted, word.id] : state.attempted,
        firstTryCorrect: firstTry && correct ? [...state.firstTryCorrect, word.id] : state.firstTryCorrect,
        mastered: correct && !state.mastered.includes(word.id) ? [...state.mastered, word.id] : state.mastered,
        queue: correct ? state.queue : reinsert(state.queue, state.cursor, word.id, TYPED_RETRY_GAP),
        answers: state.answers + 1
      },
      event: {
        wordId: word.id,
        phase: 'practice',
        round: 1,
        correct,
        answer,
        expected: word.english,
        firstEncounter: firstTry,
        countsForRecovery: firstTry
      }
    };
  }
  if (action.type !== 'continue') throw new VocabRuleError('Tundmatu tegevus.');
  if (!state.feedback) throw new VocabRuleError('Kirjuta kõigepealt vastus.');
  const cursor = state.cursor + 1;
  return { state: { ...state, feedback: null, cursor, completed: cursor >= state.queue.length }, event: null };
}
