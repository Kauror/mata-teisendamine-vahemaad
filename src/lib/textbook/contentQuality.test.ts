import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import type { Question } from '@/lib/textbook/types';

// Proofreading guards for the Loodusõpetus textbook units (review 2026-11-20):
// typos the child saw, keys given away by the form of the options, and a few
// questions whose key was wrong or ambiguous.

const units = loodusopetusOpikCourse.units.filter((unit) => unit.status === 'ready');
const questions = units.flatMap((unit) => unit.questions);
const byId = new Map(questions.map((question) => [question.id, question]));

function textsOf(value: unknown, out: string[] = []): string[] {
  if (typeof value === 'string') out.push(value);
  else if (Array.isArray(value)) value.forEach((item) => textsOf(item, out));
  else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      if (key === 'id' || key.endsWith('Id') || key.endsWith('Ids') || key === 'url' || key === 'src') continue;
      textsOf(item, out);
    }
  }
  return out;
}

function choice(id: string) {
  const question = byId.get(id);
  if (!question || question.answer.type !== 'single_choice') throw new Error(`${id} is not a single-choice question`);
  return question.answer;
}

const firstWord = (text: string) => text.trim().split(/\s+/)[0].toLocaleLowerCase('et').replace(/[,.!?]+$/, '');

describe('textbook proofreading', () => {
  it('shows the child no broken diacritics or tripled letters', () => {
    const odd = /([õäöü])(?!\1)[õäöü]|([a-zõäöü])\2\2/iu;
    const offenders = units.flatMap((unit) => textsOf(unit).filter((text) => odd.test(text) && !/tööülesan/iu.test(text)));
    expect(offenders).toEqual([]);
  });

  it('has none of the Unit 17 typos left', () => {
    const all = textsOf(units).join('\n');
    for (const typo of ['Jäärjesta', 'jõüab', 'ölda', 'mööõda', 'tänavaaadress', 'pangavarenguid', 'maanteetee']) {
      expect(all).not.toContain(typo);
    }
  });

  it('never gives the key away by being the only option with a different first word', () => {
    const leaks = questions.filter((question) => {
      if (question.answer.type !== 'single_choice') return false;
      const { options, correctOptionId } = question.answer;
      const key = options.find((option) => option.id === correctOptionId)!;
      const others = options.filter((option) => option.id !== correctOptionId).map((option) => firstWord(option.text));
      return others.length >= 2 && new Set(others).size === 1 && firstWord(key.text) !== others[0];
    });
    expect(leaks.map((question: Question) => question.id)).toEqual([]);
  });

  it('answers Unit 22 «Miks» questions in one form: every option starts with «Sest»', () => {
    const unit22 = units.find((unit) => unit.number === 22)!;
    const why = unit22.questions.filter((question) => question.stem.startsWith('Miks') && question.answer.type === 'single_choice');
    const mixed = why.filter((question) => {
      if (question.answer.type !== 'single_choice') return false;
      const starts = new Set(question.answer.options.map((option) => firstWord(option.text) === 'sest'));
      return starts.size > 1;
    });
    expect(mixed.map((question) => question.id)).toEqual([]);
  });

  it('has a single correct pair in Unit 13 q044 (1 cm – 3 km is not 1 : 300 000 any more)', () => {
    const question = byId.get('lo-opik-u13-q044');
    expect(question?.answer.type).toBe('multiple_selection');
    const texts = textsOf(question?.answer);
    expect(texts).toContain('1 cm – 3 km');
    expect(texts).not.toContain('1 : 300 000');
  });

  it('does not claim that a borehole reaches below the crust (Unit 19 q016)', () => {
    const texts = textsOf(byId.get('lo-opik-u19-q016')?.answer);
    expect(texts.join(' ')).not.toMatch(/maakoore alt/u);
  });

  it('orders the Osmussaare earthquake by cause and effect only (Unit 21 q063)', () => {
    const question = byId.get('lo-opik-u21-q063');
    if (question?.answer.type !== 'ordering') throw new Error('q063 is not an ordering');
    const ordered = question.answer.correctOrder.map((id) => question.answer.type === 'ordering' && question.answer.items.find((item) => item.id === id)?.text);
    expect(ordered[0]).toMatch(/pinge/u);
    expect(ordered[1]).toMatch(/nihe/u);
    expect(ordered[3]).toMatch(/Tallinna/u);
    expect(textsOf(question.answer).join(' ')).not.toMatch(/kahjustusi/u);
  });

  it('keeps the Unit 17 border question grammatical', () => {
    const answer = choice('lo-opik-u17-q071');
    const key = answer.options.find((option) => option.id === answer.correctOptionId)!;
    expect(key.text).toBe('Sest joon näitab, kus lõpeb ühe riigi ala ja algab teise oma.');
  });

  it('bumped the content version of every corrected unit', () => {
    for (const unit of units) expect(unit.contentVersion, `Unit ${unit.number}`).toBe('2026-11-20.1');
  });
});
