import { describe, expect, it } from 'vitest';
import { toClientUnitTest } from './clientView';
import { layoutCrossword } from './crossword';
import { autoMarks, buildSlots, crosswordCellAnswerKey, gradeFor, normalizeSlotAnswer, scoreMarks } from './grading';
import { sampleUnitTest } from './fixture';
import { parseUnitTestContent, UnitTestContentError } from './validate';

describe('unit test content', () => {
  it('accepts a valid file and keeps only known fields', () => {
    const raw = { ...sampleUnitTest(), extra: 'x' } as Record<string, unknown>;
    const content = parseUnitTestContent(raw);
    expect(content.exercises).toHaveLength(4);
    expect('extra' in content).toBe(false);
  });

  it('refuses a choice answer that is not an option, a bad order answer and a crossword clash', () => {
    const bad = sampleUnitTest() as unknown as { exercises: Array<Record<string, unknown>> };
    (bad.exercises[0].items as Array<Record<string, unknown>>)[1].answer = 'Maybe.';
    (bad.exercises[2].items as Array<Record<string, unknown>>)[0].answers = ['Are you Finnish?'];
    (bad.exercises[3].entries as Array<Record<string, unknown>>)[1].answer = 'BUS';
    try {
      parseUnitTestContent(bad);
      throw new Error('expected a validation error');
    } catch (error) {
      expect(error).toBeInstanceOf(UnitTestContentError);
      const text = (error as UnitTestContentError).problems.join(' ');
      expect(text).toContain('ei ole valikute hulgas');
      expect(text).toContain('ei koosne täpselt antud sõnadest');
    }
  });

  it('refuses a wrong format marker', () => {
    expect(() => parseUnitTestContent({ ...sampleUnitTest(), format: 'other' })).toThrow(UnitTestContentError);
  });
});

describe('crossword layout', () => {
  it('uses the book layout and numbers the shared start cell once', () => {
    const layout = layoutCrossword([
      { number: 1, clue: 'a', answer: 'CAT', row: 2, col: 3, dir: 'across' },
      { number: 1, clue: 'b', answer: 'CAR', row: 2, col: 3, dir: 'down' }
    ]);
    expect(layout.rows).toBe(3);
    expect(layout.cols).toBe(3);
    expect(layout.cells.filter((cell) => cell.number !== null)).toEqual([{ row: 0, col: 0, number: 1 }]);
  });

  it('lays out words itself when the file gives no layout, crossing on a shared letter', () => {
    const layout = layoutCrossword([
      { number: 1, clue: 'a', answer: 'FIRST' },
      { number: 2, clue: 'b', answer: 'SECOND' },
      { number: 3, clue: 'c', answer: 'THIRD' }
    ]);
    const letters = new Map<string, number>();
    for (const entry of layout.entries) {
      for (let i = 0; i < entry.length; i += 1) {
        const key = `${entry.row + (entry.dir === 'down' ? i : 0)},${entry.col + (entry.dir === 'across' ? i : 0)}`;
        letters.set(key, (letters.get(key) ?? 0) + 1);
      }
    }
    expect([...letters.values()].some((count) => count > 1)).toBe(true);
    expect(layout.cells.length).toBe(letters.size);
  });

  it('throws when crossing words disagree', () => {
    expect(() => layoutCrossword([
      { number: 1, clue: 'a', answer: 'CAT', row: 0, col: 0, dir: 'across' },
      { number: 2, clue: 'b', answer: 'BUS', row: 0, col: 0, dir: 'down' }
    ])).toThrow();
  });
});

describe('grading', () => {
  const content = parseUnitTestContent(sampleUnitTest());
  const slots = buildSlots(content);

  it('makes one slot per scored answer and skips worked examples', () => {
    expect(slots.map((slot) => slot.key)).toEqual(['1.1', '1.2', '2.1.0', '2.1.1', '2.2.0', '3.1', '4.1a', '4.2d']);
  });

  it('forgives case, spacing, apostrophe style, commas and a closing full stop only', () => {
    expect(normalizeSlotAnswer('  No,  they AREN’T. ')).toBe(normalizeSlotAnswer("no they aren't"));
    expect(normalizeSlotAnswer('Spot')).not.toBe(normalizeSlotAnswer('spots'));
  });

  it('marks closed answers, leaves an unmatched open answer to the parent and reads crossword words from cells', () => {
    const cell = (row: number, col: number) => crosswordCellAnswerKey('4', row, col);
    const marks = autoMarks(content, {
      '1.1': "No, they aren't.",
      '1.2': "No, they aren't.",
      '2.1.0': 'SPOT',
      '2.1.1': 'laik',
      '2.2.0': 'I play football after school.',
      '3.1': 'are you Estonian',
      [cell(0, 0)]: 'C', [cell(0, 1)]: 'A', [cell(0, 2)]: 'T', [cell(1, 0)]: 'A', [cell(2, 0)]: 'P'
    }, slots);
    expect(marks).toEqual({ '1.1': 1, '1.2': 0, '2.1.0': 1, '2.1.1': 1, '2.2.0': null, '3.1': 1, '4.1a': 1, '4.2d': 0 });
  });

  it('an empty open answer is simply wrong', () => {
    expect(autoMarks(content, {}, slots)['2.2.0']).toBe(0);
  });

  it('scores half marks, counts unmarked answers and passes at exactly 75 %', () => {
    const score = scoreMarks(slots, { '1.1': 1, '1.2': 1, '2.1.0': 1, '2.1.1': 0.5, '2.2.0': null, '3.1': 1, '4.1a': 1, '4.2d': 0 });
    expect(score).toMatchObject({ earned: 5.5, total: 8, unmarked: 1 });
    expect(scoreMarks(slots, { '1.1': 1, '1.2': 1, '2.1.0': 1, '2.1.1': 1, '2.2.0': 1, '3.1': 1, '4.1a': 0, '4.2d': 0 }).passed).toBe(true);
    expect(scoreMarks(slots, { '1.1': 1, '1.2': 1, '2.1.0': 1, '2.1.1': 1, '2.2.0': 1, '3.1': 0.5, '4.1a': 0, '4.2d': 0 }).passed).toBe(false);
    expect([gradeFor(0.95), gradeFor(0.75), gradeFor(0.5), gradeFor(0.2), gradeFor(0.1)]).toEqual([5, 4, 3, 2, 1]);
  });

  it('never sends an answer to the child, except the worked example', () => {
    const client = JSON.stringify(toClientUnitTest(content));
    expect(client).not.toContain('Are you Estonian');
    expect(client).not.toContain('täpp');
    expect(client).not.toContain('CAT');
    expect(client).not.toContain('I get up at seven');
    expect(client).toContain('Yes, they are.');
  });
});
