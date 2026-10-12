// Typed-answer checking for the vocabulary test. Deliberately strict: the
// comparison forgives only differences that are not spelling — letter case,
// surrounding and repeated whitespace, the typographic variant of an
// apostrophe (iOS turns ' into ’ on its own) and a sentence's closing
// punctuation ("Good morning!" vs "good morning"). A misspelling is never
// accepted unless the parent stored that exact spelling as an alternative.
// No fuzzy matching and no AI: the child gets the same verdict every time.

export type AnswerTarget = {
  english: string;
  acceptedAnswers: readonly string[];
};

const APOSTROPHES = /[‘’‛ʼʹ´`′]/g;
const TRAILING_SENTENCE_PUNCTUATION = /[.!?…]+$/u;

// Invisible characters (soft hyphen, zero-width space/joiners, word joiner,
// byte-order mark) never count as part of an answer on either side.
const INVISIBLE = new RegExp(`[${[0x00ad, 0x200b, 0x200c, 0x200d, 0x2060, 0xfeff].map((code) => String.fromCharCode(code)).join('')}]`, 'gu');

export function normalizeAnswer(value: string): string {
  return value
    .normalize('NFC')
    .replace(INVISIBLE, '')
    .replace(APOSTROPHES, "'")
    .replace(/\s+/gu, ' ')
    .trim()
    .replace(TRAILING_SENTENCE_PUNCTUATION, '')
    .trim()
    .toLocaleLowerCase('en');
}

export function acceptedSpellings(target: AnswerTarget): string[] {
  return [target.english, ...target.acceptedAnswers];
}

export function isAnswerCorrect(target: AnswerTarget, answer: string): boolean {
  const given = normalizeAnswer(answer);
  if (!given) return false;
  return acceptedSpellings(target).some((candidate) => normalizeAnswer(candidate) === given);
}

// Typed answers are stored for the parent's drill-down, so they are bounded
// rather than rejected: a child who pastes a paragraph still gets a verdict.
export const MAX_ANSWER_LENGTH = 200;

export function boundedAnswer(value: string) {
  return value.slice(0, MAX_ANSWER_LENGTH);
}
