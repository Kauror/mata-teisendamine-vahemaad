import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { MATH_GENERATOR_VERSION } from '@/lib/exercises/mathGeneratorVersion';
import { mathOptionDisplayOrder, shouldShuffleMathOptions } from '@/lib/mathOptionOrder';
import type { GeneratedQuestion } from '@/lib/types';

// Property tests over the CURRENT generator version (EX-04..EX-06). v1 keeps its
// known defects on purpose: it only replays attempts made before the bump.
const SEEDS = 3000;
const TIMEOUT = 120_000;
const v = MATH_GENERATOR_VERSION;
const PLACES = [1000, 100, 10, 1];

function seeds() {
  return Array.from({ length: SEEDS }, (_, index) => index + 1);
}

function kiur(topic: string, category: string, count: number, seed: number) {
  return generateKiurMathSession(topic, category, 'Lihtne', count, seed, v);
}

function questionKey(question: GeneratedQuestion) {
  return JSON.stringify([question.question, question.visual, question.visualKnownDegrees, question.clockHour, question.clockMinutes, question.emoji, question.count, question.orderingCards?.map((card) => card.label)]);
}

function expectDistinctOptions(question: GeneratedQuestion) {
  const options = question.choiceOptions ?? [];
  expect(new Set(options).size, `${question.question}: ${options.join(' | ')}`).toBe(options.length);
  expect(options[question.correctAnswer], question.question).toBeDefined();
}

function sumOf(option: string) {
  return option.split(' + ').reduce((sum, term) => sum + Number(term), 0);
}

describe('Numbri väärtus (EX-05)', () => {
  it(`has exactly one correct option in ${SEEDS} seeds`, () => {
    for (const seed of seeds()) {
      const [question] = kiur('arvud-10000-piires', 'Numbri väärtus', 1, seed);
      const match = /^Mis on numbri (\d) väärtus arvus (\d{4})\?$/.exec(question.question);
      expect(match, question.question).not.toBeNull();
      const digit = Number(match![1]);
      const digits = match![2].split('').map(Number);
      expect(digit).not.toBe(0);
      expect(digits.filter((candidate) => candidate === digit)).toHaveLength(1);
      const values = digits.map((candidate, index) => candidate === digit ? String(digit * PLACES[index]) : null);
      const correct = (question.choiceOptions ?? []).filter((option) => values.includes(option));
      expect(correct, question.question).toEqual([question.choiceOptions![question.correctAnswer]]);
      expectDistinctOptions(question);
      expect(question.choiceOptions).toHaveLength(3);
    }
  }, TIMEOUT);
});

describe('Lahuta arv järkudeks (EX-05)', () => {
  it(`has exactly one option that adds up to the number in ${SEEDS} seeds`, () => {
    for (const seed of seeds()) {
      const [question] = kiur('arvud-10000-piires', 'Lahuta arv järkudeks', 1, seed);
      const n = Number(/^Milline on arvu (\d{4}) õige lahutus\?$/.exec(question.question)?.[1]);
      expect(n).toBeGreaterThanOrEqual(1000);
      const options = question.choiceOptions ?? [];
      expect(options).toHaveLength(3);
      expect(options.filter((option) => sumOf(option) === n)).toEqual([options[question.correctAnswer]]);
      // Zero terms are dropped from every option alike, so «+ 0» gives nothing away.
      expect(options.some((option) => option.split(' + ').includes('0'))).toBe(false);
      const digits = String(n).split('').map(Number);
      expect(options[question.correctAnswer]).toBe(digits.map((digit, index) => digit * PLACES[index]).filter(Boolean).join(' + '));
      expectDistinctOptions(question);
    }
  }, TIMEOUT);
});

describe('Ümardamine', () => {
  it(`always offers three different options, one of them right, in ${SEEDS} seeds`, () => {
    for (const seed of seeds()) {
      const [question] = kiur('arvud-10000-piires', 'Ümardamine', 1, seed);
      const match = /^Ümarda lähima (sajani|tuhandeni): (\d+)$/.exec(question.question);
      expect(match, question.question).not.toBeNull();
      const step = match![1] === 'sajani' ? 100 : 1000;
      const n = Number(match![2]);
      expect(n % step).not.toBe(0);
      expect(question.choiceOptions).toHaveLength(3);
      expect(question.choiceOptions!.filter((option) => Number(option) === Math.round(n / step) * step)).toEqual([question.choiceOptions![question.correctAnswer]]);
      expectDistinctOptions(question);
    }
  }, TIMEOUT);
});

describe('Võrdle raadiuseid (EX-06)', () => {
  it(`is answered correctly and yields every outcome in ${SEEDS} seeds`, () => {
    const outcomes = new Map<string, number>();
    for (const seed of seeds()) {
      const [question] = kiur('ring-ja-ringjoon', 'Võrdle raadiuseid', 1, seed);
      const match = /^K raadius on (\d+) mm ja L raadius on (\d+) cm\. (Kas ringjooned on sama suured\?|Milline ringjoon on suurem\?)$/.exec(question.question);
      expect(match, question.question).not.toBeNull();
      const k = Number(match![1]);
      const l = Number(match![2]) * 10;
      const answer = question.choiceOptions![question.correctAnswer];
      const expected = match![3].startsWith('Kas') ? (k === l ? 'Jah' : 'Ei') : k > l ? 'K' : k < l ? 'L' : 'sama suured';
      expect(answer, question.question).toBe(expected);
      expect(k).toBeGreaterThan(0);
      expectDistinctOptions(question);
      outcomes.set(answer, (outcomes.get(answer) ?? 0) + 1);
    }
    for (const outcome of ['Jah', 'Ei', 'K', 'L', 'sama suured']) expect(outcomes.get(outcome) ?? 0, outcome).toBeGreaterThan(SEEDS / 20);
    expect(outcomes.get('Jah')! / (outcomes.get('Jah')! + outcomes.get('Ei')!)).toBeGreaterThan(0.3);
    expect(outcomes.get('Jah')! / (outcomes.get('Jah')! + outcomes.get('Ei')!)).toBeLessThan(0.7);
  }, TIMEOUT);
});

const SESSIONS: Array<[string, (seed: number) => GeneratedQuestion[]]> = [
  ['Ring ja ringjoon', (seed) => kiur('ring-ja-ringjoon', 'Segaharjutus', 15, seed)],
  ['Arvud 10 000 piires', (seed) => kiur('arvud-10000-piires', 'Segaharjutus', 15, seed)],
  ['Mõõtühikud', (seed) => kiur('mootuhikud-pikkused', 'Segaharjutus', 15, seed)],
  ['Jagamine', (seed) => kiur('jagamine-kahekohaline-uhekohaline', 'Segaharjutus', 15, seed)],
  ['Mustrid', (seed) => kiur('mustrid', 'Segaharjutus', 15, seed)],
  ['Kirsi Kellaaeg', (seed) => generateKirsiSession('Kellaaeg', 15, seed, v)],
  ['Kirsi Loendamine', (seed) => generateKirsiSession('Loendamine', 15, seed, v)]
];

describe('whole sessions (EX-06)', () => {
  it.each(SESSIONS)(`%s: no repeated question and no repeated option in ${SEEDS} sessions`, (_name, generate) => {
    for (const seed of seeds()) {
      const questions = generate(seed);
      expect(questions).toHaveLength(15);
      const keys = questions.map(questionKey);
      expect(new Set(keys).size, `seed ${seed}: ${keys.join('\n')}`).toBe(keys.length);
      expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
      for (const question of questions) if (question.kind === 'choice' && question.choiceOptions) expectDistinctOptions(question);
    }
  }, TIMEOUT);

  it('asks «Milline sirglõik on raadius/läbimõõt?» at most once per Ring session', () => {
    for (const seed of seeds()) {
      const questions = kiur('ring-ja-ringjoon', 'Segaharjutus', 15, seed).map((question) => question.question);
      expect(questions.filter((question) => question === 'Milline sirglõik on raadius?').length).toBeLessThanOrEqual(1);
      expect(questions.filter((question) => question === 'Milline sirglõik on läbimõõt?').length).toBeLessThanOrEqual(1);
    }
  }, TIMEOUT);
});

describe('displayed answer position (EX-04)', () => {
  it('spreads the right answer over every button of Kiur\'s shuffled choice questions', () => {
    const bySize = new Map<number, number[]>();
    const byCategory = new Map<string, number[]>();
    for (const seed of seeds()) {
      for (const [, generate] of SESSIONS.slice(0, 5)) {
        for (const question of generate(seed)) {
          if (!shouldShuffleMathOptions(question)) continue;
          const order = mathOptionDisplayOrder(question, seed);
          const position = order.indexOf(question.correctAnswer);
          const size = order.length;
          const counts = bySize.get(size) ?? Array(size).fill(0);
          counts[position] += 1;
          bySize.set(size, counts);
          if (size === 3) {
            const category = byCategory.get(String(question.category)) ?? [0, 0, 0];
            category[position] += 1;
            byCategory.set(String(question.category), category);
          }
        }
      }
    }
    const share = (counts: number[]) => counts.map((count) => count / counts.reduce((sum, value) => sum + value, 0));
    for (const fraction of share(bySize.get(3)!)) {
      expect(fraction).toBeGreaterThanOrEqual(0.15);
      expect(fraction).toBeLessThanOrEqual(0.5);
    }
    for (const [category, counts] of byCategory) {
      if (counts.reduce((sum, value) => sum + value, 0) < 300) continue;
      for (const fraction of share(counts)) expect(fraction, category).toBeGreaterThanOrEqual(0.15);
      for (const fraction of share(counts)) expect(fraction, category).toBeLessThanOrEqual(0.5);
    }
    for (const [size, counts] of bySize) {
      for (const fraction of share(counts)) expect(fraction, `${size} options`).toBeGreaterThanOrEqual(0.5 / size);
    }
  }, TIMEOUT);

  it('keeps Kirsi\'s already-shuffled counting and clock options as generated, still evenly spread', () => {
    for (const mode of ['Kellaaeg', 'Loendamine'] as const) {
      const counts = [0, 0, 0];
      for (const seed of seeds()) {
        for (const question of generateKirsiSession(mode, 15, seed, v)) {
          expect(shouldShuffleMathOptions(question)).toBe(false);
          counts[question.correctAnswer] += 1;
        }
      }
      const total = counts.reduce((sum, value) => sum + value, 0);
      for (const count of counts) expect(count / total, mode).toBeGreaterThanOrEqual(0.25);
    }
  }, TIMEOUT);
});
