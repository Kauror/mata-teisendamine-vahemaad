import { Category, GeneratedQuestion } from '@/lib/types';
import { RNG, randomInt, seededRng, shuffleWithRng } from '@/lib/random';
import { MATH_GENERATOR_VERSION, MATH_GENERATOR_VERSION_V1, MATH_GENERATOR_VERSION_V5, isMathGeneratorAtLeast, type MathGeneratorVersion } from '@/lib/exercises/mathGeneratorVersion';

type KirsiCategory = 'Loendamine' | 'Arvutamine 10 piires' | 'Arvutamine 20 piires' | 'Suurem või väiksem kuni 100' | 'Segaülesanded' | 'Kellaaeg';

const rInt = randomInt;
const shuffle = shuffleWithRng;
const COUNTING_EXERCISE_KEY = 'kirsi.math.counting-20';
const CLOCK_EXERCISE_KEY = 'kirsi.math.kellaaeg';

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

// v5: the two numbers next to the right one (1-2-3, 6-7-8, 18-19-20), so the
// wrong options are near misses a counting child makes, not a random 1..20.
function countingChoicesV5(rng: RNG, correct: number) {
  const low = Math.max(1, Math.min(correct - 1, 18));
  return shuffle(rng, [low, low + 1, low + 2]);
}

function countingSession(count: number, seed: number, generatorVersion: MathGeneratorVersion): GeneratedQuestion[] {
  const v5 = isMathGeneratorAtLeast(generatorVersion, MATH_GENERATOR_VERSION_V5);
  const rng = seededRng(seed);
  const bank = COUNTING_BANK.flatMap((item) => item.counts.map((itemCount) => ({
    id: `${item.objectLabel}-${itemCount}`,
    emoji: item.emoji,
    objectLabel: item.objectLabel,
    count: itemCount
  })));

  return shuffle(rng, bank).slice(0, count).map((item, index) => {
    const choices = v5 ? countingChoicesV5(rng, item.count) : countingChoices(rng, item.count);
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

// v5 sums: v1-v4 drew both operands from 0 up, so 31 % of «10 piires» sums had
// a zero operand and 13 % were a − a. v5 keeps a zero in about 5 % and a − a in
// about 3 % of sums; the rest use two non-zero numbers.
function plusMinusV5(rng: RNG, i: number, max: number, id: string, difficulty: GeneratedQuestion['difficulty']): GeneratedQuestion {
  const add = i % 2 === 0;
  const roll = rInt(rng, 1, 100);
  let a: number;
  let b: number;
  if (add) {
    a = rInt(rng, 1, max - 1);
    b = rInt(rng, 1, max - a);
    if (roll <= 5) b = 0;
  } else {
    a = rInt(rng, 2, max);
    b = rInt(rng, 1, a - 1);
    if (roll <= 5) b = 0;
    else if (roll <= 11) b = a;
  }
  return {
    id: `${id}-${i}`,
    category: 'Arvutamine' as Category,
    difficulty,
    question: `${a} ${add ? '+' : '-'} ${b} = ___`,
    correctAnswer: add ? a + b : a - b,
    kind: 'numeric'
  };
}

// v5 comparisons: v1-v4 made every fourth pair equal on purpose and random
// pairs could be equal too, so 30 % were «=». v5 asks an equal pair about 8 %
// of the time, and half of the others share the tens digit (47 ___ 42), which
// is where comparing actually needs thought.
function compare100V5(rng: RNG, i: number): GeneratedQuestion {
  const a = rInt(rng, 1, 99);
  const roll = rInt(rng, 1, 100);
  let b: number;
  if (roll <= 8) b = a;
  else {
    do {
      b = roll <= 54 ? Math.floor(a / 10) * 10 + rInt(rng, 0, 9) : rInt(rng, 1, 99);
    } while (b === a || b < 1);
  }
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

type ClockMinutes = 0 | 15 | 30 | 45;
type ClockType = 'full-hour' | 'half-hour' | 'quarter-hour';

type ClockTask = {
  id: string;
  hour: number;
  minutes: ClockMinutes;
  clockType: ClockType;
};

function normalizeHour(hour: number): number {
  const h = hour % 12;
  return h === 0 ? 12 : h;
}

function formatClockTime(hour: number, minutes: ClockMinutes): string {
  return `${normalizeHour(hour)}:${String(minutes).padStart(2, '0')}`;
}

function buildClockChoices(rng: RNG, hour: number, minutes: ClockMinutes): string[] {
  const prev = formatClockTime(hour - 1, 0);
  const onHour = formatClockTime(hour, 0);
  const next = formatClockTime(hour + 1, 0);
  let base: string[];
  if (minutes === 0) base = [prev, onHour, next];
  else if (minutes === 30) base = [onHour, formatClockTime(hour, 30), next];
  else if (minutes === 15) base = [onHour, formatClockTime(hour, 15), formatClockTime(hour, 30)];
  else base = [formatClockTime(hour, 30), formatClockTime(hour, 45), next];
  return shuffle(rng, Array.from(new Set(base)));
}

function buildClockBank(generatorVersion: MathGeneratorVersion): ClockTask[] {
  const bank: ClockTask[] = [];
  for (let h = 1; h <= 12; h++) bank.push({ id: `full-${h}`, hour: h, minutes: 0, clockType: 'full-hour' });
  for (let h = 1; h <= 12; h++) bank.push({ id: `half-${h}`, hour: h, minutes: 30, clockType: 'half-hour' });
  for (let h = 1; h <= 12; h++) bank.push({ id: `q15-${h}`, hour: h, minutes: 15, clockType: 'quarter-hour' });
  for (let h = 1; h <= 12; h++) bank.push({ id: `q45-${h}`, hour: h, minutes: 45, clockType: 'quarter-hour' });
  // v2 drops these: they are 12:00 and 12:30 again, so 71 of 3000 v1 sessions
  // showed the same clock twice. v1 keeps them for replay (mathGeneratorVersion.ts).
  if (generatorVersion !== MATH_GENERATOR_VERSION_V1) return bank;
  // Two extra anchor variants to round the bank to ~50 distinct items.
  bank.push({ id: 'anchor-12-00', hour: 12, minutes: 0, clockType: 'full-hour' });
  bank.push({ id: 'anchor-12-30', hour: 12, minutes: 30, clockType: 'half-hour' });
  return bank;
}

function clockExplanation(task: ClockTask): string {
  const next = normalizeHour(task.hour + 1);
  if (task.minutes === 0) return `Pikk seier on 12 peal ja väike seier näitab ${normalizeHour(task.hour)}.`;
  if (task.minutes === 30) return `Pikk seier on 6 peal ja väike seier on ${normalizeHour(task.hour)} ja ${next} vahel.`;
  if (task.minutes === 15) return `Pikk seier on 3 peal ja väike seier on natuke pärast ${normalizeHour(task.hour)}.`;
  return `Pikk seier on 9 peal ja väike seier liigub ${next} poole.`;
}

function clockSession(count: number, seed: number, generatorVersion: MathGeneratorVersion): GeneratedQuestion[] {
  const rng = seededRng(seed);
  return shuffle(rng, buildClockBank(generatorVersion)).slice(0, count).map((task, index) => {
    const choices = buildClockChoices(rng, task.hour, task.minutes);
    const correctText = formatClockTime(task.hour, task.minutes);
    return {
      id: `kirsi-clock-${task.id}-${index}`,
      type: 'clock',
      category: 'Kellaaeg' as Category,
      difficulty: 'Lihtne',
      question: 'Mis kell on?',
      kind: 'choice',
      clockHour: task.hour,
      clockMinutes: task.minutes,
      clockType: task.clockType,
      choiceOptions: choices,
      correctAnswer: choices.indexOf(correctText),
      correctAnswerText: correctText,
      explanation: clockExplanation(task),
      exerciseKey: CLOCK_EXERCISE_KEY
    };
  });
}

// `generatorVersion`: see mathGeneratorVersion.ts.
export function generateKirsiSession(mode: KirsiCategory, count: number, seed: number, generatorVersion: MathGeneratorVersion = MATH_GENERATOR_VERSION): GeneratedQuestion[] {
  if (mode === 'Loendamine') return countingSession(count, seed, generatorVersion);
  const v5 = isMathGeneratorAtLeast(generatorVersion, MATH_GENERATOR_VERSION_V5);
  if (mode === 'Kellaaeg') return clockSession(count, seed, generatorVersion);
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
      const index = i + tries * 7;
      q = t === 'Arvutamine 10 piires' ? (v5 ? plusMinusV5(rng, index, 10, 'k10', 'Lihtne') : calc10(rng, index))
        : t === 'Arvutamine 20 piires' ? (v5 ? plusMinusV5(rng, index, 20, 'k20', 'Keskmine') : calc20(rng, index))
        : v5 ? compare100V5(rng, index) : compare100(rng, index);
      tries += 1;
    } while (used.has(q.question) && tries < 20);
    used.add(q.question);
    out.push({ ...q, id: `${q.id}-${i}` });
  }
  return out;
}
