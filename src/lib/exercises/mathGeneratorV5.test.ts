import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { MATH_GENERATOR_VERSION_V4, MATH_GENERATOR_VERSION_V5, type MathGeneratorVersion } from '@/lib/exercises/mathGeneratorVersion';
import { verifyGeneratedMathAnswer } from '@/lib/shared/answerVerification';
import { recomputeScore } from '@/lib/server/attempts/scoreVerifier';
import type { Difficulty, GeneratedQuestion } from '@/lib/types';

// What the exercise review of 2026-11-20 asked of maths generator v5
// (math-2026-11), measured over at least 500 seeds. The oracles in
// mathGeneratorOracle.test.ts check every answer key; these check the shape of
// whole sessions.

const SEEDS = 600;
const TIMEOUT = 120_000;
const v5 = MATH_GENERATOR_VERSION_V5;
const DIFFICULTIES: Difficulty[] = ['Lihtne', 'Keskmine', 'Raske'];
const seeds = () => Array.from({ length: SEEDS }, (_, index) => index + 1);

describe('Kirsi (v5)', () => {
  it.each([['Arvutamine 10 piires', 10], ['Arvutamine 20 piires', 20]] as const)('%s: at most 10 % zero operands and 5 % a − a', (mode, max) => {
    let zero = 0, same = 0, total = 0;
    for (const seed of seeds()) {
      for (const q of generateKirsiSession(mode, 15, seed, v5)) {
        const [, a, sign, b] = /^(\d+) ([+-]) (\d+) = ___$/.exec(q.question)!;
        total += 1;
        if (a === '0' || b === '0') zero += 1;
        if (sign === '-' && a === b) same += 1;
        expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(q.correctAnswer).toBeLessThanOrEqual(max);
      }
    }
    expect(zero / total).toBeLessThanOrEqual(0.1);
    expect(same / total).toBeLessThanOrEqual(0.05);
    // Still there now and then: a zero and a − a are things to learn too.
    expect(zero).toBeGreaterThan(0);
    expect(same).toBeGreaterThan(0);
  }, TIMEOUT);

  it('asks an equal pair in at most 10 % of comparisons', () => {
    let equal = 0, total = 0;
    for (const seed of seeds()) {
      for (const q of generateKirsiSession('Suurem või väiksem kuni 100', 15, seed, v5)) {
        total += 1;
        if (q.correctAnswer === 0) equal += 1;
      }
    }
    expect(equal / total).toBeLessThanOrEqual(0.1);
    expect(equal).toBeGreaterThan(0);
  }, TIMEOUT);

  it('offers the count and its neighbours when counting, never a random number', () => {
    for (const seed of seeds()) {
      for (const q of generateKirsiSession('Loendamine', 15, seed, v5)) {
        const options = q.choiceOptions!.map(Number).sort((a, b) => a - b);
        expect(options[1] - options[0]).toBe(1);
        expect(options[2] - options[1]).toBe(1);
        expect(options).toContain(q.count);
        expect(q.choiceOptions![q.correctAnswer]).toBe(String(q.count));
      }
    }
  }, TIMEOUT);

  it('leaves the clock exactly as v4 made it', () => {
    for (const seed of seeds().slice(0, 50)) expect(generateKirsiSession('Kellaaeg', 15, seed, v5)).toEqual(generateKirsiSession('Kellaaeg', 15, seed, MATH_GENERATOR_VERSION_V4));
  });
});

describe('Mõõtühikud (v5): no fixed numbers', () => {
  it.each(DIFFICULTIES)('%s: no question with numbers comes up in more than 10 %% of sessions', (difficulty) => {
    const sessionsWith = new Map<string, number>();
    for (const seed of seeds()) {
      const texts = new Set(generateKiurMathSession('mootuhikud-pikkused', 'Segaharjutus', difficulty, 15, seed, v5)
        .filter((q) => /\d/.test(q.question))
        .map((q) => q.question));
      for (const text of texts) sessionsWith.set(text, (sessionsWith.get(text) ?? 0) + 1);
    }
    const [mostCommon, count] = [...sessionsWith].sort((a, b) => b[1] - a[1])[0];
    expect(count / SEEDS, mostCommon).toBeLessThanOrEqual(0.1);
  }, TIMEOUT);

  it('was the problem in v4', () => {
    let fixed = 0;
    for (const seed of seeds()) {
      if (generateKiurMathSession('mootuhikud-pikkused', 'Segaharjutus', 'Lihtne', 15, seed, MATH_GENERATOR_VERSION_V4).some((q) => q.question === 'Lõik A on 45 mm. Lõik B on 6 cm. Kui palju on B pikem?')) fixed += 1;
    }
    expect(fixed / SEEDS).toBeGreaterThan(0.5);
  });
});

describe('Jagamine (v5)', () => {
  it.each(DIFFICULTIES)('%s: asks «abitehe» or «sobiv jaotus» exactly once a session, only past the table', (difficulty) => {
    for (const seed of seeds()) {
      const session = generateKiurMathSession('jagamine-kahekohaline-uhekohaline', 'Segaharjutus', difficulty, 15, seed, v5);
      const splits = session.filter((q) => /^Milline (?:abitehe|jaotus)/.test(q.question));
      expect(splits).toHaveLength(1);
      const [, a, d] = /(\d+) : (\d+)\?$/.exec(splits[0].question)!;
      expect(Number(a) / Number(d)).toBeGreaterThanOrEqual(11);
    }
  }, TIMEOUT);

  it('uses each difficulty\'s own range', () => {
    const quotients = (difficulty: Difficulty) => seeds().flatMap((seed) => generateKiurMathSession('jagamine-kahekohaline-uhekohaline', 'Arvuta jagatis', difficulty, 15, seed, v5).map((q) => q.correctAnswer));
    expect(Math.min(...quotients('Lihtne'))).toBe(2);
    expect(Math.min(...quotients('Keskmine'))).toBe(6);
    expect(Math.min(...quotients('Raske'))).toBe(11);
    expect(Math.max(...quotients('Raske'))).toBeGreaterThan(30);
  }, TIMEOUT);
});

describe('Tekstülesanded (v5)', () => {
  const tasks = (version: MathGeneratorVersion) => {
    const byId = new Map<string, GeneratedQuestion>();
    for (let seed = 1; seed <= 400; seed += 1) for (const q of generateKiurMathSession('tekstulesanded', 'Tekstülesanded', 'Lihtne', 5, seed, version)) byId.set(q.id.replace(/-\d+$/, ''), q);
    return byId;
  };
  const current = tasks(v5);
  const previous = tasks(MATH_GENERATOR_VERSION_V4);
  const check = (id: string, answer: string, version = current) => verifyGeneratedMathAnswer(version.get(id)!, answer);

  it('evaluates any expression typed for tekst-026', () => {
    for (const answer of ['9 - 6 : 2 - 5', '9 − 6 : 2 − 5 = 1', '9-6+2-5=0', '9 - 6 - 2 - 5 = -4', '9 - 6 × 2 - 5', '- + -', '- : -', 'miinus jagatud miinus']) {
      expect(check('tekst-026', answer), answer).toBe(true);
    }
    for (const answer of ['9 + 6 - 2 - 5', '9 - 6 + 2 - 5 = 3', '6 - 9 + 2 - 5', '9 - 6 + 2', '+ + +', '9 - 6 + 2 - 5 + 1']) {
      expect(check('tekst-026', answer), answer).toBe(false);
    }
  });

  it('accepts the natural forms the review found rejected', () => {
    expect(check('tekst-120', '19')).toBe(true);
    expect(check('tekst-115', '15.05')).toBe(true);
    expect(check('tekst-022', '5,4')).toBe(true);
    expect(check('tekst-022', '4,5')).toBe(true);
    expect(check('tekst-018', 'Mall magab 12 tundi.')).toBe(true);
    expect(check('tekst-001', 'Kahel riiulil on kokku 27 raamatut')).toBe(true);
    expect(check('tekst-024', 'Kõige rohkem korjas Eve.')).toBe(true);
    expect(check('tekst-024', 'Evel oli kõige rohkem seeni')).toBe(true);
    expect(check('tekst-032', 'Tiit on kõige lühem')).toBe(true);
    expect(check('tekst-101', 'sama pikk')).toBe(true);
    expect(check('tekst-101', 'Need on sama pikad')).toBe(true);
  });

  it('stays strict about wrong answers', () => {
    expect(check('tekst-120', '18')).toBe(false);
    expect(check('tekst-022', '5,3')).toBe(false);
    expect(check('tekst-018', 'Mall magab 19 - 7 = 12 tundi')).toBe(false);
    expect(check('tekst-018', 'Mall magab 11 tundi')).toBe(false);
    expect(check('tekst-024', 'Anu ja Eve')).toBe(false);
    expect(check('tekst-024', 'Katrin')).toBe(false);
    expect(check('tekst-032', 'Anti, mitte Tiit')).toBe(false);
  });

  it('judges a v4 question exactly as before, so old attempts replay to the same score', () => {
    expect(previous.get('tekst-026')!.textAnswerRules).toBeUndefined();
    expect(check('tekst-120', '19', previous)).toBe(false);
    expect(check('tekst-026', '9 - 6 : 2 - 5', previous)).toBe(false);
    expect(check('tekst-024', 'Kõige rohkem korjas Eve.', previous)).toBe(false);
    expect(check('tekst-120', 'kell 19', previous)).toBe(true);
  });

  it('is what the server credits when it replays the attempt', () => {
    const seed = [...Array(400).keys()].map((index) => index + 1).find((candidate) => generateKiurMathSession('tekstulesanded', 'Tekstülesanded', 'Lihtne', 5, candidate, v5).some((q) => q.id.startsWith('tekst-120-')))!;
    const score = (version: MathGeneratorVersion) => {
      const questions = generateKiurMathSession('tekstulesanded', 'Tekstülesanded', 'Lihtne', 5, seed, version);
      return recomputeScore({
        runnerId: 'math', learner: 'kiur', subject: 'matemaatika', topic: 'tekstulesanded', category: 'Tekstülesanded', difficulty: 'Lihtne',
        seed, generatorVersion: version, questionIds: questions.map((q) => q.id),
        questions: questions.map((q) => ({ id: q.id, question: q.question, userAnswer: q.id.startsWith('tekst-120-') ? '19' : q.correctAnswerText }))
      }).score;
    };
    expect(score(v5)).toBe(5);
    expect(score(MATH_GENERATOR_VERSION_V4)).toBe(4);
  });

  it('rewords tekst-077 and tekst-088', () => {
    expect(current.get('tekst-077')!.question).not.toContain('aeda on vaja kogu aia ümber');
    expect(current.get('tekst-088')!.question).not.toMatch(/\bvahe on\b/);
    expect(previous.get('tekst-088')!.question).toMatch(/\bvahe on\b/);
  });
});
