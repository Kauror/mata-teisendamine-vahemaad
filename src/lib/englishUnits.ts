// Vocabulary unit runner rules. Pure and shared by the server and unit tests.
// The server owns the state and checks every transition; the browser never grades itself.
export const VOCAB_PASS_PERCENT = 95;
export type VocabularyMode = 'study' | 'test' | 'weak';
export type VocabularyWord = {
  id: string;
  estonian: string;
  english: string;
  pronunciation: string;
  acceptedAnswers: string[];
};
export type VocabularyFeedback = {
  correct: boolean;
  answer: string;
  expected: string;
};
export type VocabularyState = {
  mode: VocabularyMode;
  words: VocabularyWord[];
  queue: string[];
  cursor: number;
  phase: 'study' | 'full' | 'correction';
  round: number;
  revealed: boolean;
  feedback: VocabularyFeedback | null;
  firstSeen: string[];
  firstKnown: number;
  mastered: string[];
  roundCorrect: number;
  roundWrong: string[];
  firstTestScore: number | null;
  lastTestScore: number | null;
  completed: boolean;
  passed: boolean;
  answerCount: number;
};
export type VocabularyAction =
  | { action: 'reveal' }
  | { action: 'grade'; known: boolean }
  | { action: 'answer'; answer: string }
  | { action: 'next' };
export type VocabularyEvent = {
  wordId: string;
  correct: boolean;
  answer: string | null;
  kind: 'study' | 'weak' | 'test-full' | 'test-correction';
};

export function normalizeVocabularyAnswer(input: string): string {
  return input.normalize('NFC').replace(/[\u2018\u2019]/g, "'").trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-GB');
}
export function isVocabularyAnswerCorrect(word: VocabularyWord, answer: string): boolean {
  const normalized = normalizeVocabularyAnswer(answer);
  return normalized.length > 0 &&
    [word.english, ...word.acceptedAnswers].some((candidate) => normalizeVocabularyAnswer(candidate) === normalized);
}
export function vocabularyPasses(score: number, total: number): boolean {
  return Number.isInteger(score) && Number.isInteger(total) && total > 0 && score >= 0 && score <= total
    && score * 100 >= total * VOCAB_PASS_PERCENT;
}
export function shuffleWords(ids: readonly string[], random: () => number = Math.random): string[] {
  const items = [...ids];
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}
export function makeVocabularyState(words: VocabularyWord[], mode: VocabularyMode, random: () => number = Math.random): VocabularyState {
  if (words.length === 0) throw new Error('Selles õppetükis ei ole veel sõnu.');
  if (new Set(words.map((word) => word.id)).size !== words.length) throw new Error('Sõnade ID-d peavad olema kordumatud.');
  return {
    mode,
    words: words.map((word) => ({ ...word, acceptedAnswers: [...word.acceptedAnswers] })),
    queue: shuffleWords(words.map((word) => word.id), random),
    cursor: 0,
    phase: mode === 'test' ? 'full' : 'study',
    round: 1,
    revealed: false,
    feedback: null,
    firstSeen: [],
    firstKnown: 0,
    mastered: [],
    roundCorrect: 0,
    roundWrong: [],
    firstTestScore: null,
    lastTestScore: null,
    completed: false,
    passed: false,
    answerCount: 0
  };
}
export function currentVocabularyWord(state: VocabularyState): VocabularyWord | null {
  if (state.completed) return null;
  const id = state.queue[state.cursor];
  return state.words.find((word) => word.id === id) ?? null;
}
export function advanceVocabularyState(
  original: VocabularyState,
  action: VocabularyAction,
  random: () => number = Math.random
): { state: VocabularyState; event: VocabularyEvent | null } {
  if (original.completed) throw new Error('See harjutuskord on juba lõpetatud.');
  const state: VocabularyState = {
    ...original,
    words: original.words.map((word) => ({ ...word, acceptedAnswers: [...word.acceptedAnswers] })),
    queue: [...original.queue],
    firstSeen: [...original.firstSeen],
    mastered: [...original.mastered],
    roundWrong: [...original.roundWrong],
    feedback: original.feedback ? { ...original.feedback } : null
  };
  const word = currentVocabularyWord(state);
  if (!word) throw new Error('Harjutuse olek on vigane.');
  if (state.mode !== 'test') {
    if (action.action === 'reveal') {
      state.revealed = true;
      return { state, event: null };
    }
    if (action.action !== 'grade' || !state.revealed || typeof action.known !== 'boolean') {
      throw new Error('Kõigepealt vaata kaardi tagakülge.');
    }
    if (!state.firstSeen.includes(word.id)) {
      state.firstSeen.push(word.id);
      if (action.known) state.firstKnown++;
    }
    if (action.known) state.mastered.push(word.id);
    else state.queue.push(word.id);
    state.cursor++;
    state.revealed = false;
    state.answerCount++;
    if (state.cursor === state.queue.length) {
      state.completed = true;
      state.passed = true; // Every original word has received at least one right swipe.
    }
    return { state, event: { wordId: word.id, correct: action.known, answer: null, kind: state.mode } };
  }

  if (action.action === 'answer') {
    if (state.feedback) throw new Error('Jätkamiseks vajuta „Edasi“.');
    if (typeof action.answer !== 'string' || action.answer.length > 120) throw new Error('Vastus on liiga pikk.');
    const correct = isVocabularyAnswerCorrect(word, action.answer);
    if (state.phase === 'full') {
      if (correct) state.roundCorrect++;
      else state.roundWrong.push(word.id);
    } else if (!correct) {
      // Mistakes in the correction round return at the back of that same pile.
      state.queue.push(word.id);
    }
    state.feedback = { correct, answer: action.answer, expected: word.english };
    state.answerCount++;
    return {
      state,
      event: { wordId: word.id, correct, answer: action.answer, kind: state.phase === 'full' ? 'test-full' : 'test-correction' }
    };
  }
  if (action.action !== 'next' || !state.feedback) throw new Error('Kõigepealt sisesta vastus.');
  state.feedback = null;
  state.cursor++;
  if (state.cursor < state.queue.length) return { state, event: null };
  if (state.phase === 'correction') {
    // All missed words have now been entered correctly. Test the FULL deck anew.
    state.phase = 'full';
    state.round++;
    state.queue = shuffleWords(state.words.map((item) => item.id), random);
    state.cursor = 0;
    state.roundCorrect = 0;
    state.roundWrong = [];
    return { state, event: null };
  }
  state.lastTestScore = state.roundCorrect;
  if (state.firstTestScore === null) state.firstTestScore = state.roundCorrect;
  if (vocabularyPasses(state.roundCorrect, state.words.length)) {
    state.completed = true;
    state.passed = true;
  } else {
    state.phase = 'correction';
    state.queue = shuffleWords([...new Set(state.roundWrong)], random);
    state.cursor = 0;
    state.roundCorrect = 0;
    state.roundWrong = [];
  }
  return { state, event: null };
}
