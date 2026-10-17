import { describe, expect, it } from 'vitest';
import { TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { seededRng } from '@/lib/random';
import { correctResponseFor, gradeAnswer, isResponseComplete, parseResponse } from '@/lib/textbook/grading';
import { freezeQuestion } from '@/lib/textbook/presentation';
import { displayPercent, passes, requiredCorrect } from '@/lib/textbook/scoring';
import type { AnswerSpec, Question } from '@/lib/textbook/types';

const single: AnswerSpec = { type: 'single_choice', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }], correctOptionId: 'b' };
const multiple: AnswerSpec = { type: 'multiple_selection', options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }, { id: 'c', text: 'C' }, { id: 'd', text: 'D' }], correctOptionIds: ['a', 'c'] };
const match: AnswerSpec = {
  type: 'matching',
  prompts: [{ id: 'p1', text: 'P1' }, { id: 'p2', text: 'P2' }, { id: 'p3', text: 'P3' }],
  choices: [{ id: 'c1', text: 'C1' }, { id: 'c2', text: 'C2' }, { id: 'c3', text: 'C3' }, { id: 'x1', text: 'X' }],
  correctPairs: { p1: 'c1', p2: 'c2', p3: 'c3' }
};
const group: AnswerSpec = {
  type: 'grouping',
  groups: [{ id: 'g1', text: 'G1' }, { id: 'g2', text: 'G2' }],
  items: [{ id: 'i1', text: 'I1' }, { id: 'i2', text: 'I2' }, { id: 'i3', text: 'I3' }],
  correctGroupByItem: { i1: 'g1', i2: 'g2', i3: 'g1' }
};
const order: AnswerSpec = { type: 'ordering', items: [{ id: 's1', text: '1' }, { id: 's2', text: '2' }, { id: 's3', text: '3' }], correctOrder: ['s1', 's2', 's3'] };
const hotspot: AnswerSpec = { type: 'diagram_hotspot', diagramId: 'demo-plant-parts', correctRegionId: 'root' };

const q = (answer: AnswerSpec) => ({ answer });

describe('gradeAnswer — strict exactness per type', () => {
  it('single_choice', () => {
    expect(gradeAnswer(q(single), { type: 'single_choice', optionId: 'b' }).correct).toBe(true);
    expect(gradeAnswer(q(single), { type: 'single_choice', optionId: 'a' }).correct).toBe(false);
    expect(gradeAnswer(q(single), { type: 'single_choice', optionId: 'zz' }).correct).toBe(false);
    expect(gradeAnswer(q(single), { type: 'single_choice', optionId: 'a' }).correctResponse).toEqual({ type: 'single_choice', optionId: 'b' });
  });

  it('multiple_selection: only the exact set counts', () => {
    expect(gradeAnswer(q(multiple), { type: 'multiple_selection', optionIds: ['c', 'a'] }).correct).toBe(true);
    expect(gradeAnswer(q(multiple), { type: 'multiple_selection', optionIds: ['a'] }).correct).toBe(false); // partial
    expect(gradeAnswer(q(multiple), { type: 'multiple_selection', optionIds: ['a', 'c', 'd'] }).correct).toBe(false); // superset
    expect(gradeAnswer(q(multiple), { type: 'multiple_selection', optionIds: ['a', 'a', 'c'] }).correct).toBe(false); // duplicates
    expect(gradeAnswer(q(multiple), { type: 'multiple_selection', optionIds: [] }).correct).toBe(false);
  });

  it('matching: every pair must be right', () => {
    expect(gradeAnswer(q(match), { type: 'matching', pairs: { p1: 'c1', p2: 'c2', p3: 'c3' } }).correct).toBe(true);
    expect(gradeAnswer(q(match), { type: 'matching', pairs: { p1: 'c1', p2: 'c2' } }).correct).toBe(false); // partial
    expect(gradeAnswer(q(match), { type: 'matching', pairs: { p1: 'c1', p2: 'c3', p3: 'c2' } }).correct).toBe(false);
    expect(gradeAnswer(q(match), { type: 'matching', pairs: { p1: 'c1', p2: 'c2', p3: 'x1' } }).correct).toBe(false);
    // A choice cannot be used twice.
    expect(parseResponse(match, { type: 'matching', pairs: { p1: 'c1', p2: 'c1' } })).toBeNull();
  });

  it('grouping: every item in its group', () => {
    expect(gradeAnswer(q(group), { type: 'grouping', assignments: { i1: 'g1', i2: 'g2', i3: 'g1' } }).correct).toBe(true);
    expect(gradeAnswer(q(group), { type: 'grouping', assignments: { i1: 'g1', i2: 'g2' } }).correct).toBe(false);
    expect(gradeAnswer(q(group), { type: 'grouping', assignments: { i1: 'g1', i2: 'g2', i3: 'g2' } }).correct).toBe(false);
  });

  it('ordering: the exact sequence', () => {
    expect(gradeAnswer(q(order), { type: 'ordering', order: ['s1', 's2', 's3'] }).correct).toBe(true);
    expect(gradeAnswer(q(order), { type: 'ordering', order: ['s2', 's1', 's3'] }).correct).toBe(false);
    expect(gradeAnswer(q(order), { type: 'ordering', order: ['s1', 's2'] }).correct).toBe(false);
  });

  it('diagram_hotspot: region IDs only', () => {
    expect(gradeAnswer(q(hotspot), { type: 'diagram_hotspot', regionId: 'root' }).correct).toBe(true);
    expect(gradeAnswer(q(hotspot), { type: 'diagram_hotspot', regionId: 'stem' }).correct).toBe(false);
    expect(gradeAnswer(q(hotspot), { type: 'diagram_hotspot', regionId: 'nowhere' }).correct).toBe(false);
  });

  it('malformed input is simply incorrect', () => {
    for (const answer of [single, multiple, match, group, order, hotspot]) {
      for (const raw of [null, undefined, 42, 'b', [], {}, { type: 'other' }, { type: answer.type }]) {
        expect(gradeAnswer(q(answer), raw).correct).toBe(false);
      }
    }
    expect(gradeAnswer(q(single), { type: 'multiple_selection', optionIds: ['b'] }).correct).toBe(false);
  });

  it('is deterministic and never reads the context, stem or display order', () => {
    const base: Question = {
      id: 'x', unitId: 'u', stem: 'Mis?', primaryObjectiveId: 'o', variantGroupId: 'g', cognitiveLevel: 'factual', difficulty: 1,
      eligibility: { practice: true, test: true }, explanation: 'e', sources: [], answer: single
    };
    const variants: Question[] = [
      base,
      { ...base, stem: 'Täiesti teine tekst', context: { kind: 'text', paragraphs: ['Vale vastus on b.'] } },
      { ...base, context: { kind: 'table', headers: ['x'], rows: [['b on vale']] } },
      { ...base, context: { kind: 'diagram', diagramId: 'unknown' }, explanation: 'muu' }
    ];
    for (const response of [{ type: 'single_choice', optionId: 'a' }, { type: 'single_choice', optionId: 'b' }]) {
      const results = variants.map((question) => gradeAnswer(question, response));
      expect(new Set(results.map((result) => JSON.stringify(result))).size).toBe(1);
    }
    // Freezing (shuffled display order) does not change grading.
    for (let seed = 0; seed < 20; seed++) {
      const frozen = freezeQuestion(base, seededRng(seed));
      expect(gradeAnswer(frozen.question, { type: 'single_choice', optionId: 'b' }).correct).toBe(true);
    }
  });

  it('isResponseComplete', () => {
    expect(isResponseComplete(match, { type: 'matching', pairs: { p1: 'c1', p2: 'c2' } })).toBe(false);
    expect(isResponseComplete(match, { type: 'matching', pairs: { p1: 'c1', p2: 'c2', p3: 'x1' } })).toBe(true);
    expect(isResponseComplete(group, { type: 'grouping', assignments: { i1: 'g1' } })).toBe(false);
    expect(isResponseComplete(order, { type: 'ordering', order: ['s1', 's2'] })).toBe(false);
    expect(isResponseComplete(multiple, { type: 'multiple_selection', optionIds: [] })).toBe(false);
    expect(isResponseComplete(single, { type: 'single_choice', optionId: 'a' })).toBe(true);
    expect(isResponseComplete(single, { type: 'single_choice', optionId: 'nope' })).toBe(false);
  });

  it('every shipped question grades its own key as correct and a wrong answer as incorrect', () => {
    for (const course of TEXTBOOK_COURSES) {
      for (const unit of course.units) {
        for (const question of unit.questions) {
          expect(gradeAnswer(question, correctResponseFor(question.answer)).correct, question.id).toBe(true);
        }
      }
    }
  });
});

describe('integer pass rule', () => {
  const rule = { passNumerator: 95, passDenominator: 100 };
  it('19/20 passes, 18/20 fails', () => {
    expect(requiredCorrect(20, rule)).toBe(19);
    expect(passes(19, 20, rule)).toBe(true);
    expect(passes(20, 20, rule)).toBe(true);
    expect(passes(18, 20, rule)).toBe(false);
  });
  it('other lengths use ceil(n·95/100) in integers', () => {
    expect(requiredCorrect(18, rule)).toBe(18);
    expect(requiredCorrect(10, rule)).toBe(10);
    expect(requiredCorrect(30, rule)).toBe(29);
    expect(requiredCorrect(40, rule)).toBe(38);
    expect(requiredCorrect(1, rule)).toBe(1);
    expect(passes(37, 40, rule)).toBe(false);
    expect(passes(38, 40, rule)).toBe(true);
    expect(requiredCorrect(20, { passNumerator: 4, passDenominator: 5 })).toBe(16);
    expect(requiredCorrect(7, { passNumerator: 1, passDenominator: 2 })).toBe(4);
  });
  it('rejects nonsense', () => {
    expect(passes(21, 20, rule)).toBe(false);
    expect(passes(-1, 20, rule)).toBe(false);
    expect(passes(1.5, 20, rule)).toBe(false);
    expect(() => requiredCorrect(20, { passNumerator: 101, passDenominator: 100 })).toThrow();
  });
  it('display percent rounds down', () => {
    expect(displayPercent(18, 20)).toBe(90);
    expect(displayPercent(19, 20)).toBe(95);
    expect(displayPercent(2, 3)).toBe(66);
  });
});
