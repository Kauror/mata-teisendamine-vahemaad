import { Category, GeneratedQuestion } from '@/lib/types';
import { RNG, randomInt, seededRng, shuffleWithRng } from '@/lib/random';

type KirsiCategory = 'Loendamine' | 'Arvutamine 10 piires' | 'Arvutamine 20 piires' | 'Suurem või väiksem kuni 100' | 'Segaülesanded';

const rInt = randomInt;
const shuffle = shuffleWithRng;
const COUNTING_EXERCISE_KEY = 'kirsi.math.counting-20';

const COUNTING_BANK = [
  { emoji: '🍎', objectLabel: 'õun', counts: [1, 5, 9, 13, 17] },
  { emoji: '⭐', objectLabel: 'täht', counts: [2, 6, 10, 14, 18] },
  { emoji: '🐟', objectLabel: 'kala', counts: [3, 7, 11, 15, 19] },
  { emoji: '🧸', objectLabel: 'karu', counts: [4, 8, 12, 16, 20] },
  { emoji: '⚽', objectLabel: 'pall', counts: [1, 6, 11, 16, 20] },
  { emoji: '🚗', objectLabel: 'auto', counts: [2, 7, 12, 17, 19] },
  { emoji: '🌸', objectLabel: 'lill', counts: [3, 8, 13, 18, 20] },
  { emoji: '🐱', objectLabel: 'kass', counts: [4, 9, 14, 19, 20] },
  { emoji: '🐶', objectLabel: 'koer', counts: [5, 10, 15, 18, 20] },
  { emoji: '🦋', objectLabel: 'liblikas', counts: [1, 7, 13, 16, 19] },
  { emoji: '🍓', objectLabel: 'maasikas', counts: [2, 8, 14, 17, 20] },
  { emoji: '🥕', objectLabel: 'porgand', counts: [3, 9, 15, 18, 20] },
  { emoji: '🐝', objectLabel: 'mesilane', counts: [4, 10, 12, 16, 19] },
  { emoji: '🐸', objectLabel: 'konn', counts: [5, 11, 13, 17, 20] },
  { emoji: '🐧', objectLabel: 'pingviin', counts: [1, 8, 12, 15, 18] },
  { emoji: '🐰', objectLabel: 'jänes', counts: [2, 9, 13, 16, 19] },
  { emoji: '🍄', objectLabel: 'seen', counts: [3, 10, 14, 17, 20] },
  { emoji: '🐠', objectLabel: 'kalake', counts: [4, 11, 15, 18, 20] },
  { emoji: '🦆', objectLabel: 'part', counts: [5, 12, 14, 16, 19] },
  { emoji: '🍪', objectLabel: 'küpsis', counts: [6, 8, 10, 15, 20] }
] as const;

function countingChoices(rng: RNG, correct: number) {
  const values = new Set<number>([correct]);
  const close = shuffle(rng, [correct - 1, correct + 1].filter((value) => value >= 1 && value <= 20));
  for (const value of close) {
    if (values.size < 2) values.add(value);
  }
  while (values.size < 3) values.add(rInt(rng, 1, 20));
  return shuffle(rng, Array.from(values));
}

function countingSession(count: number, seed: number): GeneratedQuestion[] {
  const rng = seededRng(seed);
  const bank = COUNTING_BANK.flatMap((item) => item.counts.map((itemCount) => ({
    id: `${item.objectLabel}-${itemCount}`,
    emoji: item.emoji,
    objectLabel: item.objectLabel,
    count: itemCount
  })));

  return shuffle(rng, bank).slice(0, count).map((item, index) => {
    const choices = countingChoices(rng, item.count);
    return {
      id: `counting-${item.id}-${index}`,
      type: 'counting',
      category: 'Loendamine' as Category,
      difficulty: 'Lihtne',
      question: 'Mitu asja on?',
      prompt: 'Mitu asja on?',
      emoji: item.emoji,
      objectLabel: item.objectLabel,
      count: item.count,
      correctAnswer: choices.indexOf(item.count),
      correctAnswerText: String(item.count),
      choices,
      choiceOptions: choices.map(String),
      kind: 'choice',
      explanation: `Siin on ${item.count} asja.`,
      exerciseKey: COUNTING_EXERCISE_KEY
    };
  });
}

function calc10(rng: RNG, i: number): GeneratedQuestion {
  const add = i % 2 === 0;
  const a = rInt(rng, 0, 10);
  const b = add ? rInt(rng, 0, 10 - a) : rInt(rng, 0, a);
  return {
    id: `k10-${i}`,
    category: 'Arvutamine' as Category,
    difficulty: 'Lihtne',
    question: `${a} ${add ? '+' : '-'} ${b} = ___`,
    correctAnswer: add ? a + b : a - b,
    kind: 'numeric'
  };
}

function calc20(rng: RNG, i: number): GeneratedQuestion {
  const add = i % 2 === 0;
  const a = rInt(rng, 0, 20);
  const b = add ? rInt(rng, 0, 20 - a) : rInt(rng, 0, a);
  return {
    id: `k20-${i}`,
    category: 'Arvutamine' as Category,
    difficulty: 'Keskmine',
    question: `${a} ${add ? '+' : '-'} ${b} = ___`,
    correctAnswer: add ? a + b : a - b,
    kind: 'numeric'
  };
}

function compare100(rng: RNG, i: number): GeneratedQuestion {
  const eq = i % 4 === 0;
  const a = rInt(rng, 0, 100);
  const b = eq ? a : rInt(rng, 0, 100);
  const correct = a === b ? '=' : a > b ? '>' : '<';
  return {
    id: `kcmp-${i}`,
    category: 'Võrdlemine' as Category,
    difficulty: 'Lihtne',
    question: `${a} ___ ${b}`,
    correctAnswer: correct === '<' ? -1 : correct === '=' ? 0 : 1,
    kind: 'choice'
  };
}

export function generateKirsiSession(mode: KirsiCategory, count: number, seed: number): GeneratedQuestion[] {
  if (mode === 'Loendamine') return countingSession(count, seed);
  const rng = seededRng(seed);
  const types = mode === 'Segaülesanded'
    ? (count <= 3 ? shuffle(rng, ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100']).slice(0, count)
      : Array.from({ length: count }, (_, i) => ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100'][i % 3]).map((t) => t as KirsiCategory))
    : Array.from({ length: count }, () => mode);

  const out: GeneratedQuestion[] = [];
  const used = new Set<string>();
  for (let i = 0; i < count; i++) {
    let q: GeneratedQuestion;
    let tries = 0;
    do {
      const t = types[i];
      q = t === 'Arvutamine 10 piires' ? calc10(rng, i + tries * 7)
        : t === 'Arvutamine 20 piires' ? calc20(rng, i + tries * 7)
        : compare100(rng, i + tries * 7);
      tries += 1;
    } while (used.has(q.question) && tries < 20);
    used.add(q.question);
    out.push({ ...q, id: `${q.id}-${i}` });
  }
  return out;
}
