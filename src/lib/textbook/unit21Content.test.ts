import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import { unit21 } from '@/content/textbook/loodusopetus-opik/unit21';
import { seededRng } from '@/lib/random';
import { toClientQuestion } from '@/lib/textbook/api';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { correctResponseFor, gradeAnswer } from '@/lib/textbook/grading';
import { freezeQuestion } from '@/lib/textbook/presentation';
import type { AnswerResponse, Question, RichText } from '@/lib/textbook/types';

// Unit 21 "Maavärinad" (textbook pages 78–81): the owner's package content,
// whose safety advice follows today's CDC/USGS/NOAA guidance instead of the
// outdated p 81 advice ("leave the building or go to the basement while it
// shakes"). The counts and the seeded test builds are in validator.test.ts.

// What a question endorses when answered correctly, from the simulated correct
// response (the grader accepts it): the chosen options, a true/false statement
// marked "Õige", every item of an ordering or a matching, and the grouping
// items NOT put in a "dangerous" / "no" group.
function endorsed(question: Question): string[] {
  const response: AnswerResponse = correctResponseFor(question.answer);
  expect(gradeAnswer(question, response).correct, question.id).toBe(true);
  const answer = question.answer;
  switch (answer.type) {
    case 'single_choice': {
      const chosen = answer.options.find((option) => option.id === answer.correctOptionId)!.text;
      const trueFalse = answer.options.map((option) => option.text).join('/') === 'Õige/Vale';
      if (!trueFalse) return [chosen];
      return chosen === 'Õige' ? [question.stem.replace(/^Õige või vale:\s*/u, '')] : [];
    }
    case 'multiple_selection':
      return answer.options.filter((option) => answer.correctOptionIds.includes(option.id)).map((option) => option.text);
    case 'ordering':
      return answer.items.map((item) => item.text);
    case 'matching':
      return [...answer.prompts.map((prompt) => prompt.text), ...answer.choices.map((choice) => choice.text)];
    case 'grouping': {
      const rejecting = new Set(answer.groups.filter((group) => /^(unsafe|ei|no)$/u.test(group.id)).map((group) => group.id));
      return answer.items.filter((item) => !rejecting.has(answer.correctGroupByItem[item.id])).map((item) => item.text);
    }
    case 'diagram_hotspot':
      return [];
  }
}

// Unsafe advice a correct answer must never give.
const UNSAFE: Array<[string, RegExp]> = [
  ['run outside / down the stairs while it shakes', /(jooks\p{L}*|torma\p{L}*|tõtta\p{L}*)\s+(\p{L}+\s+)?(välja|õue|trepist)|õue\s+joosta|trepist\s+(alla|välja)/iu],
  ['go to the basement', /keld/iu],
  ['use the lift', /lift/iu],
  ['touch or handle a power line', /(puudut|katsu|haara|tõsta|lükka|astu)\p{L}*\s.*(juhe|juhtme|kaabel|kaabli|elektriliin|elektripost)/iu],
  ['stay by the water / walk on the seabed', /(jää|jään|ootan|seisan|kõnni|jaluta|filmi|pildista)\p{L}*\s.*(rand|ranna|vee piiri|veepiiri|vee äärde|vee juures|mere äärde|merepõhja)/iu],
  ['wait for a phone or official alert before leaving the coast', /(oota|ootan)\p{L}*\s.*(telefon|ametlik|teade)/iu]
];
const NEGATED = /(^|\s)(ära|ei|ega|mitte)\s/iu;

const plain = (text: RichText) => (typeof text === 'string' ? text : text.map((segment) => segment.text).join(''));

const BLOCK_TEXTS: string[] = unit21.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks.flatMap((block) => {
  switch (block.type) {
    case 'paragraph': return [plain(block.text)];
    case 'list': case 'keyFact': return block.items.map(plain);
    case 'comparison': return block.columns.flatMap((column) => column.points.map(plain));
    case 'table': return block.rows.flatMap((row) => row.map(String));
    case 'enrichment': return block.body.map(plain);
    default: return [];
  }
})));

describe('unit 21 "Maavärinad" content', () => {
  it('is in the course after Unit 14 (Unit 20 stays a draft), ready, with the four lessons', () => {
    const numbers = loodusopetusOpikCourse.units.map((unit) => unit.number);
    expect(numbers.filter((number) => number === 21)).toHaveLength(1);
    expect(numbers).toEqual([...numbers].sort((left, right) => left - right));
    expect(loodusopetusOpikCourse.units.find((unit) => unit.number === 20)).toMatchObject({ status: 'draft', title: 'Vulkaanid' });
    expect(unit21).toMatchObject({ id: 'lo-opik-u21', courseId: 'loodusopetus-opik', number: 21, title: 'Maavärinad', pages: { from: 78, to: 81 }, status: 'ready' });
    expect(unit21.lessons.map((lesson) => lesson.title)).toEqual([
      'Miks maa väriseb?', 'Kus maa väriseb?', 'Tsunami — ohtlik hiidlaine', 'Kuidas maavärina ajal õigesti tegutseda?'
    ]);
    const taught = new Set(unit21.lessons.filter((lesson) => lesson.required).flatMap((lesson) => lesson.objectiveIds));
    for (const objective of unit21.objectives) {
      expect(objective.required).toBe(true);
      expect(taught.has(objective.id), objective.id).toBe(true);
    }
  });

  it('uses ASCII IDs only', () => {
    const ids = [
      unit21.id,
      ...unit21.objectives.map((objective) => objective.id),
      ...unit21.lessons.flatMap((lesson) => [lesson.id, ...lesson.sections.flatMap((section) => [section.id, ...section.blocks.map((block) => block.id)])]),
      ...unit21.questions.flatMap((question) => [question.id, question.variantGroupId])
    ];
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('no correct answer advises running out or to the basement, the lift, touching a power line, staying by the water or waiting for a phone alert', () => {
    let checked = 0;
    for (const question of unit21.questions) {
      for (const text of endorsed(question)) {
        checked += 1;
        if (NEGATED.test(text)) continue;
        for (const [what, pattern] of UNSAFE) expect(pattern.test(text), `${question.id} endorses "${text}" (${what})`).toBe(false);
      }
    }
    expect(checked).toBeGreaterThan(150);
    // The unsafe choices do exist, as clearly wrong options (otherwise the check above proves nothing).
    const wrong = unit21.questions.flatMap((question) => {
      const answer = question.answer;
      if (answer.type === 'single_choice') return answer.options.filter((option) => option.id !== answer.correctOptionId).map((option) => option.text);
      if (answer.type === 'multiple_selection') return answer.options.filter((option) => !answer.correctOptionIds.includes(option.id)).map((option) => option.text);
      return [];
    });
    for (const [what, pattern] of UNSAFE.slice(0, 5)) expect(wrong.some((text) => pattern.test(text)), what).toBe(true);
  });

  it('the lessons mention running out, the basement or the lift only to warn against them or to correct the textbook', () => {
    const sentences = BLOCK_TEXTS.flatMap((text) => text.split(/(?<=[.!?])\s+/u));
    const risky = sentences.filter((sentence) => /keld|lift|jooks(?!ul)|torma/iu.test(sentence));
    expect(risky.length).toBeGreaterThan(0);
    for (const sentence of risky) expect(sentence, sentence).toMatch(/(^|\s)(ära|ei|ega|mitte)\s|õpik|ei tohiks/iu);
    // Today's rule is taught in so many words.
    expect(BLOCK_TEXTS.join(' ')).toContain('Kui oled sees, jää raputamise ajal sisse.');
    expect(BLOCK_TEXTS.join(' ')).toContain('Küki – varju – hoia kinni.');
  });

  it('teaches the science correctly: focus inside the Earth, epicentre above it, not every undersea quake makes a tsunami', () => {
    const text = BLOCK_TEXTS.join(' ');
    expect(text).toContain('Epitsenter on koht maapinnal otse kolde kohal.');
    expect(text).toContain('Mitte iga merealune maavärin ei tekita tsunamit.');
    expect(text).toContain('esimene ei pruugi olla suurim');
    // The time-bound "about 100 weak quakes a year" is never a test fact.
    for (const question of unit21.questions) expect(JSON.stringify(question.answer), question.id).not.toMatch(/\b100\b|sada\b/u);
  });

  it('sends no key to the child: the client question of every hotspot names no region and carries no correct ID', () => {
    const hotspots = unit21.questions.filter((question) => question.answer.type === 'diagram_hotspot');
    expect(hotspots).toHaveLength(31);
    for (const question of unit21.questions) {
      const json = JSON.stringify(toClientQuestion(freezeQuestion(question, seededRng(7))));
      for (const forbidden of ['correct', 'explanation', 'variantGroupId', 'label']) expect(json, `${question.id}: ${forbidden}`).not.toContain(`"${forbidden}`);
      if (question.answer.type !== 'diagram_hotspot') continue;
      for (const region of getDiagram(question.answer.diagramId)!.regions) expect(json, question.id).not.toContain(`"${region.label}"`);
    }
  });
});
