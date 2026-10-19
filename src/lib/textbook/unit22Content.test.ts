import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import { unit22 } from '@/content/textbook/loodusopetus-opik/unit22';
import { seededRng } from '@/lib/random';
import { toClientQuestion } from '@/lib/textbook/clientQuestion';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { correctResponseFor, gradeAnswer } from '@/lib/textbook/grading';
import { freezeQuestion } from '@/lib/textbook/presentation';
import type { AnswerResponse, Question, RichText } from '@/lib/textbook/types';

// Unit 22 "Loodusõnnetused" (textbook pages 82–83 only: the chapter goes on
// after p 83 and those pages were not supplied). Lesson 4's safety advice
// comes from Päästeamet, Ole valmis!, Ilmateenistus and WHO, not the
// textbook. The counts and the seeded test builds are in validator.test.ts.

// What a question endorses when answered correctly, from the simulated correct
// response (the grader accepts it): the chosen options, every item of an
// ordering or a matching, and the items of an action grouping NOT put in its
// "does not help" / "dangerous" group. The other groupings sort situations
// ("water gets into the basement" is a consequence), not advice.
const REJECTING_GROUPS = new Set(['bad', 'risky']);
function endorsed(question: Question): string[] {
  const response: AnswerResponse = correctResponseFor(question.answer);
  expect(gradeAnswer(question, response).correct, question.id).toBe(true);
  const answer = question.answer;
  switch (answer.type) {
    case 'single_choice':
      return [answer.options.find((option) => option.id === answer.correctOptionId)!.text];
    case 'multiple_selection':
      return answer.options.filter((option) => answer.correctOptionIds.includes(option.id)).map((option) => option.text);
    case 'ordering':
      return answer.items.map((item) => item.text);
    case 'matching':
      return [...answer.prompts.map((prompt) => prompt.text), ...answer.choices.map((choice) => choice.text)];
    case 'grouping':
      if (!answer.groups.some((group) => REJECTING_GROUPS.has(group.id))) return [];
      return answer.items.filter((item) => !REJECTING_GROUPS.has(answer.correctGroupByItem[item.id])).map((item) => item.text);
    case 'diagram_hotspot':
      return [];
  }
}

// Unsafe advice a correct answer must never give (the package's regression requirement).
const UNSAFE: Array<[string, RegExp]> = [
  ['go into floodwater, walk, swim or drive through it', /(lähen|mine|minna|astu|kõnni|kõnd|joos|ujud|ujum|sõit|sõida)\p{L}*\s(\p{L}+\s)*?(vette|vee sisse|veest läbi|vee alla|üleujutatud|tulvavette)/iu],
  ['go into a flooded basement', /(lähen|mine|minna|astu)\p{L}*\s(\p{L}+\s)*?keld/iu],
  ['touch or switch wet electrics or a fallen wire', /(puudut|katsu|haara|tõsta|lülita|proovi)\p{L}*\s.*(elektri|juhe|juhtme|seadme|kilp)/iu],
  ['go near a fallen wire', /(lähen|mine|minna)\p{L}*\s.*juhtme(\s|$)/iu],
  ['ignore a warning', /(^|\s)(ignoreeri|eira|kustuta)\p{L}*/iu]
];
const NEGATED = /(^|\s)(ära|ei|ega|mitte)\s/iu;

const plain = (text: RichText) => (typeof text === 'string' ? text : text.map((segment) => segment.text).join(''));

const BLOCK_TEXTS: string[] = unit22.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks.flatMap((block) => {
  switch (block.type) {
    case 'paragraph': return [plain(block.text)];
    case 'list': case 'keyFact': return block.items.map(plain);
    case 'comparison': return block.columns.flatMap((column) => column.points.map(plain));
    case 'table': return block.rows.flatMap((row) => row.map(String));
    case 'enrichment': return block.body.map(plain);
    case 'diagram': return block.caption ? [plain(block.caption)] : [];
    default: return [];
  }
})));

describe('unit 22 "Loodusõnnetused" content', () => {
  it('is in the course after Unit 21, ready, pages 82–83 with the note that the chapter goes on after p 83', () => {
    const numbers = loodusopetusOpikCourse.units.map((unit) => unit.number);
    expect(numbers).toEqual([...numbers].sort((left, right) => left - right));
    expect(loodusopetusOpikCourse.units.filter((unit) => unit.id === 'lo-opik-u22')).toHaveLength(1);
    expect(unit22).toMatchObject({ id: 'lo-opik-u22', courseId: 'loodusopetus-opik', number: 22, title: 'Loodusõnnetused', pages: { from: 82, to: 83 }, status: 'ready' });
    expect(unit22.pages?.note).toBe('Õpiku peatükk jätkub pärast lk 83; kaasa antud materjal hõlmab ainult lk 82–83. Ametlikud ohutusjuhised on märgistatud lisaallikatena.');
    const taught = new Set(unit22.lessons.filter((lesson) => lesson.required).flatMap((lesson) => lesson.objectiveIds));
    for (const objective of unit22.objectives) {
      expect(objective.required).toBe(true);
      expect(taught.has(objective.id), objective.id).toBe(true);
    }
  });

  it('uses ASCII IDs only', () => {
    const ids = [
      unit22.id,
      ...unit22.objectives.map((objective) => objective.id),
      ...unit22.lessons.flatMap((lesson) => [lesson.id, ...lesson.sections.flatMap((section) => [section.id, ...section.blocks.map((block) => block.id)])]),
      ...unit22.questions.flatMap((question) => [question.id, question.variantGroupId])
    ];
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('no correct answer sends the child into floodwater or a flooded basement, to wet electrics or a fallen wire, or tells it to ignore a warning', () => {
    let checked = 0;
    for (const question of unit22.questions) {
      for (const text of endorsed(question)) {
        checked += 1;
        if (NEGATED.test(text)) continue;
        for (const [what, pattern] of UNSAFE) expect(pattern.test(text), `${question.id} endorses "${text}" (${what})`).toBe(false);
      }
    }
    expect(checked).toBeGreaterThan(120);
    // The unsafe choices do exist, as clearly wrong options (otherwise the check above proves nothing).
    const wrong = unit22.questions.flatMap((question) => {
      const answer = question.answer;
      if (answer.type === 'single_choice') return answer.options.filter((option) => option.id !== answer.correctOptionId).map((option) => option.text);
      if (answer.type === 'multiple_selection') return answer.options.filter((option) => !answer.correctOptionIds.includes(option.id)).map((option) => option.text);
      if (answer.type === 'grouping') return answer.items.filter((item) => REJECTING_GROUPS.has(answer.correctGroupByItem[item.id])).map((item) => item.text);
      return [];
    });
    for (const [what, pattern] of [UNSAFE[0], UNSAFE[2], UNSAFE[3], UNSAFE[4]]) expect(wrong.some((text) => pattern.test(text)), what).toBe(true);
  });

  it('teaches the safe rules and the textbook\'s limits in so many words', () => {
    const text = BLOCK_TEXTS.join(' ');
    expect(text).toContain('ära mine üleujutatud tänavale ega veega täitunud keldrisse');
    expect(text).toContain('Ära lülita vees seistes elektriseadmeid sisse ega välja.');
    expect(text).toContain('Elektri väljalülitamine ning ehitustööd kuuluvad täiskasvanutele, mitte lapsele.');
    expect(text).toContain('Vahetu ohu korral on hädaabinumber 112.');
    // People cannot stop the forces of nature, but they can lower the harm (not the textbook's absolute claim).
    expect(text).toContain('Küll aga saab ohte jälgida');
    // An earthquake in Estonia is rare, not impossible (Unit 21, Osmussaar).
    expect(text).toContain('Väide „Eestis ei saa maavärinat üldse olla” ei ole õige.');
    // The 2021 floods are a historical example: no death toll is ever a test fact.
    for (const question of unit22.questions) expect(JSON.stringify(question), question.id).not.toMatch(/hukkun|surma|ohvri/iu);
  });

  it('every hotspot question has one defensible region: the two rewordings of the integration', () => {
    const stem = (id: string) => unit22.questions.find((question) => question.id === id)!.stem;
    // q009: the sunny card is also safe ordinary weather, so the stem asks for the rain.
    expect(stem('lo-opik-u22-q009')).toMatch(/sajab vihma/u);
    // q094: the fallen wire is also a place to keep away from, so the stem asks for the covered road.
    expect(stem('lo-opik-u22-q094')).toMatch(/vesi on teed katnud/u);
  });

  it('sends no key to the child: the client question of every hotspot names no region and carries no correct ID', () => {
    const hotspots = unit22.questions.filter((question) => question.answer.type === 'diagram_hotspot');
    expect(hotspots).toHaveLength(17);
    for (const question of unit22.questions) {
      const json = JSON.stringify(toClientQuestion(freezeQuestion(question, seededRng(7))));
      for (const forbidden of ['correct', 'explanation', 'variantGroupId', 'label']) expect(json, `${question.id}: ${forbidden}`).not.toContain(`"${forbidden}`);
      if (question.answer.type !== 'diagram_hotspot') continue;
      for (const region of getDiagram(question.answer.diagramId)!.regions) expect(json, question.id).not.toContain(`"${region.label}"`);
    }
  });
});
