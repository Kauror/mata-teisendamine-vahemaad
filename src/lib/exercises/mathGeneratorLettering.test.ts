import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { MATH_GENERATOR_VERSION, MATH_GENERATOR_VERSION_V1, MATH_GENERATOR_VERSION_V2 } from '@/lib/exercises/mathGeneratorVersion';
import type { GeneratedQuestion } from '@/lib/types';
import { figureLabels, isFigureLabelling } from '@/lib/visualLabels';

// Property tests for maths generator v3: the lettered Ring figures and «Leia
// arvutusviga». v1/v2 answered «Leia raadius» with A, «Leia läbimõõt» with B and
// «Kus asub punkt A?» with «ringi sees» every time, and «Leia arvutusviga» was
// «Õige» 75 % of the time. v1/v2 keep that on purpose (they only replay).
const SEEDS = 3000;
const TIMEOUT = 120_000;
const v = MATH_GENERATOR_VERSION;

function seeds() {
  return Array.from({ length: SEEDS }, (_, index) => index + 1);
}

function kiur(topic: string, category: string, count: number, seed: number) {
  return generateKiurMathSession(topic, category, 'Lihtne', count, seed, v);
}

function expectShares(counts: number[], label: string, min: number, max: number) {
  const total = counts.reduce((sum, value) => sum + value, 0);
  for (const count of counts) {
    expect(count / total, `${label}: ${counts.join('/')}`).toBeGreaterThanOrEqual(min);
    expect(count / total, `${label}: ${counts.join('/')}`).toBeLessThanOrEqual(max);
  }
}

// The letters the figure draws, one per place (see visualLabels.ts).
function lettering(question: GeneratedQuestion) {
  expect(isFigureLabelling(question.visualLabels), question.question).toBe(true);
  return question.visualLabels!;
}

describe('lettered Ring figures (v3)', () => {
  it.each([
    ['Leia raadius', 'radius-demo', 'Milline sirglõik on raadius?'],
    ['Leia läbimõõt', 'diameter-demo', 'Milline sirglõik on läbimõõt?']
  ] as const)(`%s: the letter on the asked-for segment is the answer, each letter wins about a third of ${SEEDS} seeds`, (category, visual, text) => {
    const counts = [0, 0, 0];
    for (const seed of seeds()) {
      const [question] = kiur('ring-ja-ringjoon', category, 1, seed);
      expect(question.question).toBe(text);
      expect(question.visual).toBe(visual);
      expect(question.choiceOptions).toEqual(['A', 'B', 'C']);
      // Place 0 of radius-demo/diameter-demo is the green segment the question asks for.
      expect(question.choiceOptions![question.correctAnswer]).toBe(lettering(question)[0]);
      counts[question.correctAnswer] += 1;
    }
    expectShares(counts, category, 0.2, 0.5);
  }, TIMEOUT);

  it(`Punkti asukoht: the asked letter stands on the right point, each answer wins about a third of ${SEEDS} seeds`, () => {
    const counts = [0, 0, 0];
    const byLetter = new Map<string, number[]>();
    for (const seed of seeds()) {
      const [question] = kiur('ring-ja-ringjoon', 'Punkti asukoht', 1, seed);
      const letter = /^Kus asub punkt ([ABC])\?$/.exec(question.question)?.[1];
      expect(letter, question.question).toBeDefined();
      expect(question.visual).toBe('point-position');
      expect(question.choiceOptions).toEqual(['ringi sees', 'ringjoone peal', 'ringist väljas']);
      // point-position places are [inside, on, outside], the order of the options.
      expect(lettering(question)[question.correctAnswer]).toBe(letter);
      counts[question.correctAnswer] += 1;
      const perLetter = byLetter.get(letter!) ?? [0, 0, 0];
      perLetter[question.correctAnswer] += 1;
      byLetter.set(letter!, perLetter);
    }
    expectShares(counts, 'Punkti asukoht', 0.2, 0.5);
    // No letter is tied to one place any more.
    expect(byLetter.size).toBe(3);
    for (const [letter, perLetter] of byLetter) expectShares(perLetter, `punkt ${letter}`, 0.2, 0.5);
  }, TIMEOUT);

  it(`keeps every figure consistent and balanced in mixed Ring sessions (${SEEDS} sessions)`, () => {
    const counts: Record<string, number[]> = { raadius: [0, 0, 0], läbimõõt: [0, 0, 0], punkt: [0, 0, 0] };
    for (const seed of seeds()) {
      for (const question of kiur('ring-ja-ringjoon', 'Segaharjutus', 15, seed)) {
        if (question.visual === 'radius-demo' || question.visual === 'diameter-demo') {
          expect(question.choiceOptions![question.correctAnswer]).toBe(lettering(question)[0]);
          counts[question.visual === 'radius-demo' ? 'raadius' : 'läbimõõt'][question.correctAnswer] += 1;
        } else if (question.visual === 'point-position') {
          expect(lettering(question)[question.correctAnswer]).toBe(question.question.slice(-2, -1));
          counts.punkt[question.correctAnswer] += 1;
        } else {
          expect(question.visualLabels).toBeUndefined();
        }
      }
    }
    for (const [name, perAnswer] of Object.entries(counts)) expectShares(perAnswer, name, 0.2, 0.5);
  }, TIMEOUT);

  it('draws the lettering v1/v2 always drew when a question carries none', () => {
    expect(figureLabels('radius-demo', undefined)[0]).toBe('A');
    expect(figureLabels('diameter-demo', undefined)[0]).toBe('B');
    expect(figureLabels('point-position', undefined)).toBe('ABC');
    expect(figureLabels('point-position', 'AAB')).toBe('ABC');
    expect(figureLabels('point-position', 'CAB')).toBe('CAB');
    for (const version of [MATH_GENERATOR_VERSION_V1, MATH_GENERATOR_VERSION_V2] as const) {
      for (const seed of [1, 2, 3, 9]) {
        for (const question of generateKiurMathSession('ring-ja-ringjoon', 'Segaharjutus', 'Lihtne', 15, seed, version)) expect(question.visualLabels).toBeUndefined();
      }
    }
  });
});

describe('Leia arvutusviga (v3)', () => {
  const ROW = /^Kas arvutus on õige\? (\d{4}) ([+-]) (\d+) = (\d{4})$/;

  it(`is «Õige» about half of ${SEEDS} seeds, with right arithmetic or exactly one plausible slip`, () => {
    let right = 0;
    for (const seed of seeds()) {
      const [question] = kiur('arvud-10000-piires', 'Leia arvutusviga', 1, seed);
      const match = ROW.exec(question.question);
      expect(match, question.question).not.toBeNull();
      const [, aText, op, bText, shownText] = match!;
      const a = Number(aText), b = Number(bText), shown = Number(shownText);
      const correct = op === '+' ? a + b : a - b;
      expect(question.choiceOptions).toEqual(['Õige', 'Vale']);
      // Round numbers: whole hundreds plus or minus whole hundreds or whole thousands.
      expect(a % 100).toBe(0);
      expect(b < 1000 ? b % 100 === 0 : b % 1000 === 0, question.question).toBe(true);
      expect(correct).toBeGreaterThanOrEqual(1000);
      expect(correct).toBeLessThanOrEqual(9900);
      if (question.correctAnswer === 0) {
        right += 1;
        expect(shown, question.question).toBe(correct);
        expect(question.explanation).toContain(`= ${correct}.`);
      } else {
        expect(question.correctAnswer).toBe(1);
        expect(shown, question.question).not.toBe(correct);
        // Exactly one slip: off by one step of the place it works in (a miscount,
        // or a forgotten carry/borrow), or the digit read in the wrong place.
        const unit = b >= 1000 ? 1000 : 100;
        const swapped = b >= 1000 ? b / 10 : b * 10;
        const slips = [correct + unit, correct - unit, correct + 1000, correct - 1000, op === '+' ? a + swapped : a - swapped];
        expect(slips, question.question).toContain(shown);
        expect(question.explanation).toContain(`Õige vastus on ${correct}.`);
      }
    }
    expect(right / SEEDS).toBeGreaterThanOrEqual(0.35);
    expect(right / SEEDS).toBeLessThanOrEqual(0.65);
  }, TIMEOUT);

  it(`stays balanced inside mixed «Arvud 10 000 piires» sessions (${SEEDS} sessions)`, () => {
    const counts = [0, 0];
    for (const seed of seeds()) {
      for (const question of kiur('arvud-10000-piires', 'Segaharjutus', 15, seed)) {
        if (question.question.startsWith('Kas arvutus on õige?')) counts[question.correctAnswer] += 1;
      }
    }
    expectShares(counts, 'Leia arvutusviga', 0.35, 0.65);
  }, TIMEOUT);
});
