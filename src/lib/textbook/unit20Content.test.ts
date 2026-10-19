import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import { unit20 } from '@/content/textbook/loodusopetus-opik/unit20';
import { seededRng } from '@/lib/random';
import { toClientQuestion } from '@/lib/textbook/clientQuestion';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { correctResponseFor, gradeAnswer } from '@/lib/textbook/grading';
import { freezeQuestion } from '@/lib/textbook/presentation';
import type { AnswerResponse, Question, RichText } from '@/lib/textbook/types';

// Unit 20 "Vulkaanid" (textbook pages 74–77): the owner's package content,
// with the package's science clarifications (USGS/NPS) in the lesson text: not
// every volcano is on a plate boundary, "active" does not mean erupting now,
// eruptions cannot always be foretold, a geyser throws water and steam, not
// lava, volcanic ash is not wood ash and fresh lava is not soil. The counts and
// the seeded test builds are in validator.test.ts.

const TRUE_FALSE = 'Õige/Vale';
const isTrueFalse = (question: Question) => question.answer.type === 'single_choice' && question.answer.options.map((option) => option.text).join('/') === TRUE_FALSE;
const statement = (question: Question) => question.stem.replace(/^Õige või vale:\s*/u, '');

// What a question endorses when answered correctly, from the simulated correct
// response (the grader accepts it): the chosen options, a true/false statement
// marked "Õige", and every item of an ordering, matching or grouping.
function endorsed(question: Question): string[] {
  const response: AnswerResponse = correctResponseFor(question.answer);
  expect(gradeAnswer(question, response).correct, question.id).toBe(true);
  const answer = question.answer;
  switch (answer.type) {
    case 'single_choice': {
      const chosen = answer.options.find((option) => option.id === answer.correctOptionId)!.text;
      if (!isTrueFalse(question)) return [chosen];
      return chosen === 'Õige' ? [statement(question)] : [];
    }
    case 'multiple_selection':
      return answer.options.filter((option) => answer.correctOptionIds.includes(option.id)).map((option) => option.text);
    case 'ordering':
      return answer.items.map((item) => item.text);
    case 'matching':
      return [...answer.prompts.map((prompt) => prompt.text), ...answer.choices.map((choice) => choice.text)];
    case 'grouping':
      return answer.items.map((item) => item.text);
    case 'diagram_hotspot':
      return [];
  }
}

// What a question rejects: its wrong options and a true/false statement marked "Vale".
function rejected(question: Question): string[] {
  const answer = question.answer;
  if (answer.type === 'single_choice') {
    if (isTrueFalse(question)) return answer.correctOptionId === answer.options.find((option) => option.text === 'Vale')!.id ? [statement(question)] : [];
    return answer.options.filter((option) => option.id !== answer.correctOptionId).map((option) => option.text);
  }
  if (answer.type === 'multiple_selection') return answer.options.filter((option) => !answer.correctOptionIds.includes(option.id)).map((option) => option.text);
  return [];
}

// Misconceptions a correct answer must never state (checked clause by clause, so
// "geiser paiskab vett, vulkaanis võib väljuda laava" is fine).
const WRONG_SCIENCE: Array<[string, RegExp]> = [
  ['every volcano is on a plate boundary', /(iga|kõik)\p{L}*\s[^,;]*vulkaan[^,;]*laama\p{L}*\s?piiri/iu],
  ['an active volcano always erupts right now', /aktiivne[^,;]*(alati|peab)[^,;]*purska/iu],
  ['every eruption can be foretold exactly', /(iga|alati)[^,;]*(purse|purske)[^,;]*(ennust|ette teada|kellaaja)|(ennust|ette teada)[^,;]*(iga|alati)[^,;]*purse/iu],
  ['a geyser erupts lava or magma', /geis\p{L}*[^,;]*(laava|magma|sulakivim|sulanud kivim)/iu],
  ['the whole mantle is liquid magma', /kogu[^,;]*vahevöö[^,;]*(vedel|magma)/iu],
  ['every hot spring is a geyser', /(iga|igast)[^,;]*kuumaveeallika[^,;]*geis/iu],
  ['fresh lava is soil at once', /(värske|kuum)[^,;]*laava[^,;]*(muld|külva)|muld[^,;]*laavast[^,;]*ilma/iu],
  ['a quiet volcano is surely extinct', /kindlasti kustunud/iu]
];
const NEGATED = /(^|\s)(ära|ei|ega|mitte|pole)\s/iu;
const clauses = (text: string) => text.split(/[,;]\s*/u);

const plain = (text: RichText) => (typeof text === 'string' ? text : text.map((segment) => segment.text).join(''));

const BLOCK_TEXTS: string[] = unit20.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks.flatMap((block) => {
  switch (block.type) {
    case 'paragraph': return [plain(block.text)];
    case 'list': case 'keyFact': return block.items.map(plain);
    case 'definition': return [plain(block.definition)];
    case 'comparison': return block.columns.flatMap((column) => column.points.map(plain));
    case 'table': return block.rows.flatMap((row) => row.map(String));
    default: return [];
  }
})));

describe('unit 20 "Vulkaanid" content', () => {
  it('is in the course between Units 19 and 21, ready, with the five required lessons covering all eight objectives', () => {
    const numbers = loodusopetusOpikCourse.units.map((unit) => unit.number);
    expect(numbers).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
    expect(loodusopetusOpikCourse.units.filter((unit) => unit.id === 'lo-opik-u20')).toEqual([unit20]);
    expect(unit20).toMatchObject({ id: 'lo-opik-u20', courseId: 'loodusopetus-opik', number: 20, title: 'Vulkaanid', pages: { from: 74, to: 77 }, status: 'ready' });
    expect(unit20.lessons.map((lesson) => [lesson.title, lesson.required])).toEqual([
      ['Magma muutub laavaks', true], ['Vulkaani osad ja purske jäljed', true], ['Kus vulkaanid asuvad?', true], ['Inimene ja vulkaan', true], ['Kuumaveeallikad ja geisrid', true]
    ]);
    const taught = new Set(unit20.lessons.flatMap((lesson) => lesson.objectiveIds));
    expect(unit20.objectives).toHaveLength(8);
    for (const objective of unit20.objectives) {
      expect(objective.required).toBe(true);
      expect(taught.has(objective.id), objective.id).toBe(true);
    }
  });

  it('uses ASCII IDs only', () => {
    const ids = [
      unit20.id,
      ...unit20.objectives.map((objective) => objective.id),
      ...unit20.lessons.flatMap((lesson) => [lesson.id, ...lesson.sections.flatMap((section) => [section.id, ...section.blocks.map((block) => block.id)])]),
      ...unit20.questions.flatMap((question) => [question.id, question.variantGroupId])
    ];
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('no correct answer states a misconception (every plate boundary, active = erupting, exact forecasts, lava geysers, liquid mantle, instant soil)', () => {
    let checked = 0;
    for (const question of unit20.questions) {
      for (const text of endorsed(question)) {
        for (const clause of clauses(text)) {
          checked += 1;
          if (NEGATED.test(clause)) continue;
          for (const [what, pattern] of WRONG_SCIENCE) expect(pattern.test(clause), `${question.id} endorses "${text}" (${what})`).toBe(false);
        }
      }
    }
    expect(checked).toBeGreaterThan(200);
    // The misconceptions do exist, as wrong options or false statements (otherwise the check above proves nothing).
    const wrong = unit20.questions.flatMap(rejected);
    for (const [what, pattern] of WRONG_SCIENCE) expect(wrong.some((text) => pattern.test(text)), what).toBe(true);
  });

  it('teaches the clarifications in the lesson text itself, not only in links', () => {
    const text = BLOCK_TEXTS.join(' ');
    expect(text).toContain('Kõik vulkaanid ei ole laamade piiridel.');
    expect(text).toContain('Hawaii');
    expect(text).toContain('ei tähenda alati, et laava parajasti voolaks');
    expect(text).toContain('ei ole võimalik ette teada');
    expect(text).toContain('Vulkaaniline tuhk ei ole põletatud puidu tuhk');
    expect(text).toContain('Viljakas muld ei teki kuumast värskest laavast kohe.');
    expect(text).toContain('Geiser ei purska laavat.');
    expect(text).toContain('Kogu Maa sisemus ei ole siiski vedel');
    // The textbook's "Stokkuri" caption is corrected to the geyser's real name.
    expect(text).toContain('Strokkuri');
    expect(JSON.stringify(unit20)).not.toContain('Stokkur');
  });

  it('keeps the integration fixes: q068 and q084 have one defensible answer, q072 has its own stem', () => {
    const byId = new Map(unit20.questions.map((question) => [question.id, question]));
    const options = (id: string) => {
      const answer = byId.get(id)!.answer;
      return answer.type === 'single_choice' ? answer.options.map((option) => option.text) : [];
    };
    // Spring temperatures are a real monitoring signal, so they cannot be a wrong answer.
    expect(options('lo-opik-u20-q084').join(' ')).not.toMatch(/allika/iu);
    expect(options('lo-opik-u20-q068')).toContain('Et praegu ei voola vulkaanist laavat');
    const stems = unit20.questions.map((question) => question.stem.toLowerCase());
    expect(new Set(stems).size).toBe(stems.length);
  });

  it('sends no key to the child: the client question of every hotspot names no region and carries no correct ID', () => {
    const hotspots = unit20.questions.filter((question) => question.answer.type === 'diagram_hotspot');
    expect(hotspots).toHaveLength(19);
    for (const question of unit20.questions) {
      const json = JSON.stringify(toClientQuestion(freezeQuestion(question, seededRng(7))));
      for (const forbidden of ['correct', 'explanation', 'variantGroupId', 'label']) expect(json, `${question.id}: ${forbidden}`).not.toContain(`"${forbidden}`);
      if (question.answer.type !== 'diagram_hotspot') continue;
      for (const region of getDiagram(question.answer.diagramId)!.regions) expect(json, question.id).not.toContain(`"${region.label}"`);
    }
  });
});
