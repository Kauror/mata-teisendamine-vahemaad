// Typed-answer checking for the vocabulary test. The comparison forgives
// differences that are not spelling — letter case, surrounding and repeated
// whitespace, the typographic variant of an apostrophe (iOS turns ' into ’ on
// its own) and a sentence's closing punctuation ("Good morning!" vs
// "good morning").
//
// A stored English entry that holds several forms accepts each form
// (answerForms, documented in docs/english-vocabulary.md):
//   - `;` separates whole alternatives: "girl; girls" accepts "girl" and "girls";
//   - a comma list of single words is a list of alternatives: "shoe, shoes",
//     "drink, drank, drunk" (a sentence such as "Sorry, I'm late." is not);
//   - `/` swaps the word before it for the word after it: "eat / have
//     breakfast" accepts "eat breakfast" and "have breakfast", "there is / are"
//     accepts "there is" and "there are";
//   - a bracketed part is optional: "look (at)" accepts "look" and "look at".
// Two spelling variants count as the same word: a hyphen and a space
// ("ice-cream" = "ice cream"), and the US and UK spelling of the common words
// in US_TO_UK ("color" = "colour").
//
// A misspelling is still never accepted unless the parent stored that exact
// spelling as an alternative. No fuzzy matching and no AI: the child gets the
// same verdict every time. Every rule only adds accepted answers: an answer
// that matched the stored text before matches it still (isAnswerCorrect keeps
// the old exact comparison as its first check).

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

// Whole words only, so a longer word that merely starts the same way
// ("literature") is never touched.
const US_TO_UK: Readonly<Record<string, string>> = {
  color: 'colour', colors: 'colours', colorful: 'colourful', colored: 'coloured',
  favorite: 'favourite', favorites: 'favourites',
  gray: 'grey',
  center: 'centre', centers: 'centres',
  theater: 'theatre', theaters: 'theatres',
  neighbor: 'neighbour', neighbors: 'neighbours',
  meter: 'metre', meters: 'metres',
  kilometer: 'kilometre', kilometers: 'kilometres',
  centimeter: 'centimetre', centimeters: 'centimetres',
  millimeter: 'millimetre', millimeters: 'millimetres',
  liter: 'litre', liters: 'litres',
  harbor: 'harbour', flavor: 'flavour', humor: 'humour', honor: 'honour', behavior: 'behaviour',
  pajamas: 'pyjamas', jewelry: 'jewellery', cozy: 'cosy',
  airplane: 'aeroplane', airplanes: 'aeroplanes',
  traveling: 'travelling', traveled: 'travelled', traveler: 'traveller', travelers: 'travellers',
  catalog: 'catalogue',
  mom: 'mum', moms: 'mums',
  math: 'maths'
};

// The comparison key: the normalised answer with hyphens read as spaces and US
// spellings read as UK ones.
function comparisonKey(value: string): string {
  return normalizeAnswer(value)
    .replace(/\s*-\s*/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim()
    .split(' ')
    .map((word) => US_TO_UK[word] ?? word)
    .join(' ');
}

const MAX_FORMS = 64;

function tidy(value: string) {
  return value.replace(/\s+/gu, ' ').replace(/\s+([.!?,])/gu, '$1').trim();
}

function expandSlash(value: string): string[] {
  const match = /(\S+)\s*\/\s*(\S+)/u.exec(value);
  if (!match) return [value];
  const before = value.slice(0, match.index);
  const after = value.slice(match.index + match[0].length);
  return [match[1], match[2]].flatMap((word) => expandSlash(tidy(`${before}${word}${after}`)));
}

function expandCommaList(value: string): string[] {
  if (!value.includes(',') || /[.!?…]$/u.test(value.trim())) return [value];
  const parts = value.split(',').map((part) => part.trim());
  return parts.every((part) => part.length > 0 && !/\s/u.test(part)) ? parts : [value];
}

function expandOptional(value: string): string[] {
  const match = /\(([^()]*)\)/u.exec(value);
  if (!match) return [value];
  const before = value.slice(0, match.index);
  const after = value.slice(match.index + match[0].length);
  return [tidy(`${before}${match[1]}${after}`), tidy(`${before} ${after}`)].flatMap(expandOptional);
}

// Every form one stored English entry accepts, the entry itself first.
export function answerForms(stored: string): string[] {
  const forms = new Set<string>([stored]);
  for (const alternative of stored.split(';')) {
    for (const swapped of expandSlash(tidy(alternative))) {
      for (const listed of expandCommaList(swapped)) {
        for (const form of expandOptional(listed)) {
          if (forms.size >= MAX_FORMS) return [...forms];
          if (form) forms.add(form);
        }
      }
    }
  }
  return [...forms];
}

export function acceptedSpellings(target: AnswerTarget): string[] {
  return [target.english, ...target.acceptedAnswers];
}

export function isAnswerCorrect(target: AnswerTarget, answer: string): boolean {
  const given = normalizeAnswer(answer);
  if (!given) return false;
  const spellings = acceptedSpellings(target);
  if (spellings.some((candidate) => normalizeAnswer(candidate) === given)) return true;
  const key = comparisonKey(answer);
  return spellings.some((candidate) => answerForms(candidate).some((form) => comparisonKey(form) === key));
}

// Typed answers are stored for the parent's drill-down, so they are bounded
// rather than rejected: a child who pastes a paragraph still gets a verdict.
export const MAX_ANSWER_LENGTH = 200;

export function boundedAnswer(value: string) {
  return value.slice(0, MAX_ANSWER_LENGTH);
}
