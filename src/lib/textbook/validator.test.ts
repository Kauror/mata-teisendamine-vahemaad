import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import { TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { publishable, validateCourse, validateUnit } from '@/lib/textbook/validator';
import { buildTestSnapshot, historyFromSnapshots, type TestSnapshot } from '@/lib/textbook/testSelection';
import { COGNITIVE_LEVELS, type Course, type Unit } from '@/lib/textbook/types';
import { diagramRegionIds } from '@/lib/textbook/diagramRegistry';

const demo = textbookDemoCourse;
const codes = (issues: Array<{ code: string }>) => issues.map((issue) => issue.code);

// A broken copy of demo unit 1, plus the course it is checked in.
function broken(mutate: (unit: Unit) => void) {
  const unit = structuredClone(demo.units[0]);
  mutate(unit);
  const course: Course = { ...demo, units: [unit, demo.units[1]] };
  return validateUnit(unit, course);
}

describe('shipped content', () => {
  it('the demo units are publishable without errors or warnings', () => {
    const result = validateCourse(demo);
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    for (const unit of result.units) {
      expect(unit.errors, unit.unitId).toEqual([]);
      expect(unit.warnings, unit.unitId).toEqual([]);
      expect(unit.publishable).toBe(true);
      expect(unit.buildability?.ok).toBe(true);
      expect(Object.values(unit.stats.answerTypes).every((count) => count > 0)).toBe(true);
    }
  });

  it('Units 10–14 are ready and publishable without warnings; Units 15–22 stay metadata-only drafts', () => {
    const result = validateCourse(loodusopetusOpikCourse, { imageExists: () => true });
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.units.map((unit) => unit.unitNumber)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
    const status = new Map(loodusopetusOpikCourse.units.map((unit) => [unit.id, unit.status]));
    const ready = result.units.filter((unit) => status.get(unit.unitId) === 'ready');
    const drafts = result.units.filter((unit) => status.get(unit.unitId) === 'draft');
    expect(ready.map((unit) => unit.unitNumber)).toEqual([10, 11, 12, 13, 14, 16]);
    expect(ready.length + drafts.length).toBe(result.units.length);
    // Every ready unit: no errors or warnings, publishable, tests buildable (each unit's details: its own test).
    for (const unit of ready) {
      expect(unit, unit.unitId).toMatchObject({ errors: [], warnings: [], publishable: true, buildability: { ok: true } });
      expect(Object.values(unit.stats.answerTypes).every((count) => count > 0), unit.unitId).toBe(true);
    }
    const unit10 = ready[0];
    expect(unit10.unitNumber).toBe(10);
    expect(unit10.stats).toMatchObject({
      lessons: 4, requiredLessons: 4, sections: 12, blocks: 37, objectives: 6, requiredObjectives: 6,
      questions: 54, practiceQuestions: 54, testQuestions: 54, testVariantGroups: 39,
      testLevels: { factual: 19, understanding: 20, application: 15 }
    });
    for (const unit of drafts) {
      expect(unit.publishable).toBe(false);
      expect(codes(unit.errors)).toEqual(['unit_draft', 'unit_no_content']);
      expect(unit.errors[0].message).toMatch(/mustand/u);
    }
    for (const unit of loodusopetusOpikCourse.units.filter((item) => item.status === 'draft')) {
      expect(unit.lessons).toEqual([]);
      expect(unit.questions).toEqual([]);
      expect(unit.objectives).toEqual([]);
    }
    expect(loodusopetusOpikCourse.settings).toMatchObject({ testLength: 20, passNumerator: 95, passDenominator: 100, levelDistribution: { factual: 8, understanding: 7, application: 5 } });
    expect(loodusopetusOpikCourse.learners).toEqual(['kiur']);
  });

  it('Unit 12 "Kaart": ready, publishable without warnings, all six answer types, 20-question tests buildable', () => {
    const unit12 = loodusopetusOpikCourse.units.find((unit) => unit.number === 12)!;
    expect(unit12).toMatchObject({ id: 'lo-opik-u12', status: 'ready', contentVersion: '2026-10-17.1', pages: { from: 50, to: 53 } });
    const result = validateUnit(unit12, loodusopetusOpikCourse, { imageExists: () => true });
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.publishable).toBe(true);
    expect(result.buildability?.ok).toBe(true);
    expect(result.stats).toMatchObject({
      lessons: 4, requiredLessons: 4, sections: 15, blocks: 62, objectives: 8, requiredObjectives: 8,
      questions: 94, practiceQuestions: 94, testQuestions: 94, testVariantGroups: 68,
      testLevels: { factual: 29, understanding: 29, application: 36 },
      answerTypes: { single_choice: 65, multiple_selection: 5, matching: 5, grouping: 4, ordering: 3, diagram_hotspot: 12 }
    });
    // Every hotspot answer names a region its diagram draws.
    const diagrams = new Set<string>();
    for (const question of unit12.questions) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      diagrams.add(question.answer.diagramId);
      expect(diagramRegionIds(question.answer.diagramId), question.id).toContain(question.answer.correctRegionId);
    }
    expect([...diagrams].sort()).toEqual(['u12-aerial-vs-map', 'u12-globe-flatmap', 'u12-legend-town', 'u12-orange-peel']);
    // All IDs are ASCII (the validator's ID rule).
    expect(JSON.stringify(unit12.questions.map((question) => question.id))).toMatch(/^[\x00-\x7f]*$/);
  });

  it('Unit 13 "Kaardi mõõtkava" is ready and publishable without warnings, unpublished content version 2026-10-17.1', () => {
    const unit13 = loodusopetusOpikCourse.units.find((unit) => unit.id === 'lo-opik-u13')!;
    expect(unit13).toMatchObject({ number: 13, title: 'Kaardi mõõtkava', status: 'ready', contentVersion: '2026-10-17.1', pages: { from: 54, to: 57 } });
    const result = validateUnit(unit13, loodusopetusOpikCourse);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.publishable).toBe(true);
    expect(result.buildability?.ok).toBe(true);
    expect(result.stats).toMatchObject({
      lessons: 4, requiredLessons: 4, sections: 15, blocks: 59, objectives: 8, requiredObjectives: 8,
      questions: 117, practiceQuestions: 117, testQuestions: 117, testVariantGroups: 100,
      testLevels: { factual: 31, understanding: 38, application: 48 }
    });
    expect(result.stats.answerTypes).toMatchObject({ single_choice: 85, multiple_selection: 8, matching: 6, grouping: 4, ordering: 5, diagram_hotspot: 9 });
  });

  it('Unit 14 "Kaartide mitmekesisus" is ready and publishable without warnings (owner-reviewed package counts)', () => {
    const unit14 = loodusopetusOpikCourse.units.find((unit) => unit.id === 'lo-opik-u14')!;
    expect(unit14).toMatchObject({ number: 14, status: 'ready', contentVersion: '2026-10-17.1', title: 'Kaartide mitmekesisus', pages: { from: 58, to: 59 } });
    const result = validateUnit(unit14, loodusopetusOpikCourse);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.publishable).toBe(true);
    expect(result.buildability?.ok).toBe(true);
    expect(result.stats).toMatchObject({
      lessons: 4, requiredLessons: 4, sections: 13, blocks: 50, objectives: 8, requiredObjectives: 8,
      questions: 108, practiceQuestions: 108, testQuestions: 108, testVariantGroups: 74,
      testLevels: { factual: 28, understanding: 35, application: 45 },
      answerTypes: { single_choice: 78, multiple_selection: 9, matching: 3, grouping: 4, ordering: 4, diagram_hotspot: 10 }
    });
  });

  it('Unit 14 tests: 20 questions from 20 groups, 8/7/5, all 8 objectives, for every seed and across three retakes', () => {
    const unit14 = loodusopetusOpikCourse.units.find((unit) => unit.id === 'lo-opik-u14')!;
    const settings = loodusopetusOpikCourse.settings;
    const strict = (snapshot: TestSnapshot) => {
      const questions = snapshot.questions.map((frozen) => frozen.question);
      expect(new Set(questions.map((question) => question.id)).size).toBe(20);
      expect(new Set(questions.map((question) => question.variantGroupId)).size).toBe(20);
      for (const level of COGNITIVE_LEVELS) expect(questions.filter((question) => question.cognitiveLevel === level)).toHaveLength(settings.levelDistribution[level]);
      expect(new Set(questions.map((question) => question.primaryObjectiveId)).size).toBe(8);
      expect(snapshot.relaxations).toEqual([]);
      expect(snapshot.requiredCorrect).toBe(19);
    };
    for (let seed = 1; seed <= 40; seed++) strict(buildTestSnapshot({ courseId: loodusopetusOpikCourse.id, unit: unit14, settings, seed }));
    // Three attempts in a row, each built with the earlier ones as history (as the server does).
    const attempts: TestSnapshot[] = [];
    for (const seed of [11, 12, 13]) {
      const snapshot = buildTestSnapshot({ courseId: loodusopetusOpikCourse.id, unit: unit14, settings, seed, history: historyFromSnapshots(attempts) });
      strict(snapshot);
      attempts.push(snapshot);
    }
    // 74 groups are enough for three fully different tests (the package's witness proves it); the retakes reuse none.
    expect(attempts.map((snapshot) => snapshot.reusedVariantGroupIds.length)).toEqual([0, 0, 0]);
  });

  it('Unit 16 "Maailmameri" is ready and publishable without warnings (package counts)', () => {
    const unit16 = loodusopetusOpikCourse.units.find((unit) => unit.id === 'lo-opik-u16')!;
    expect(unit16).toMatchObject({ number: 16, status: 'ready', contentVersion: '2026-10-17.2', title: 'Maailmameri', pages: { from: 64, to: 65 } });
    const result = validateUnit(unit16, loodusopetusOpikCourse);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.publishable).toBe(true);
    expect(result.buildability?.ok).toBe(true);
    expect(result.stats).toMatchObject({
      lessons: 4, requiredLessons: 4, sections: 13, blocks: 43, objectives: 7, requiredObjectives: 7,
      questions: 99, practiceQuestions: 99, testQuestions: 99, testVariantGroups: 64,
      testLevels: { factual: 29, understanding: 36, application: 34 },
      answerTypes: { single_choice: 62, multiple_selection: 7, matching: 5, grouping: 5, ordering: 4, diagram_hotspot: 16 }
    });
  });

  it('Unit 16 tests: 20 questions from 20 groups, 8/7/5, all 7 objectives, for every seed and across three retakes', () => {
    const unit16 = loodusopetusOpikCourse.units.find((unit) => unit.id === 'lo-opik-u16')!;
    const settings = loodusopetusOpikCourse.settings;
    const strict = (snapshot: TestSnapshot) => {
      const questions = snapshot.questions.map((frozen) => frozen.question);
      expect(new Set(questions.map((question) => question.id)).size).toBe(20);
      expect(new Set(questions.map((question) => question.variantGroupId)).size).toBe(20);
      for (const level of COGNITIVE_LEVELS) expect(questions.filter((question) => question.cognitiveLevel === level)).toHaveLength(settings.levelDistribution[level]);
      expect(new Set(questions.map((question) => question.primaryObjectiveId)).size).toBe(7);
      expect(snapshot.relaxations).toEqual([]);
      expect(snapshot.requiredCorrect).toBe(19);
    };
    for (let seed = 1; seed <= 40; seed++) strict(buildTestSnapshot({ courseId: loodusopetusOpikCourse.id, unit: unit16, settings, seed }));
    // Three attempts in a row, each built with the earlier ones as history (as the server does).
    const attempts: TestSnapshot[] = [];
    for (const seed of [11, 12, 13]) {
      const snapshot = buildTestSnapshot({ courseId: loodusopetusOpikCourse.id, unit: unit16, settings, seed, history: historyFromSnapshots(attempts) });
      strict(snapshot);
      attempts.push(snapshot);
    }
    // 64 groups: three fully different tests exist (the package's witness), but the
    // engine prefers unused groups only as far as the strict quotas allow, so the
    // first retake reuses none and the second at most two (it reuses 2 here).
    const reused = attempts.map((snapshot) => snapshot.reusedVariantGroupIds.length);
    expect(reused.slice(0, 2)).toEqual([0, 0]);
    expect(reused[2]).toBeLessThanOrEqual(2);
    expect(new Set(attempts.flatMap((snapshot) => snapshot.questions.map((frozen) => frozen.question.variantGroupId))).size).toBeGreaterThanOrEqual(58);
  });

  it('Unit 10 is not publishable when its photo file is missing', () => {
    const unit10 = loodusopetusOpikCourse.units.find((unit) => unit.number === 10)!;
    const result = validateUnit(unit10, loodusopetusOpikCourse, { imageExists: () => false });
    expect(codes(result.errors)).toEqual(['block_image_missing']);
    expect(result.publishable).toBe(false);
  });

  it('every registered course passes course-level checks', () => {
    for (const course of TEXTBOOK_COURSES) expect(validateCourse(course).errors).toEqual([]);
  });
});

describe('crafted bad units', () => {
  it('a draft with full content is still not publishable', () => {
    const result = broken((unit) => { unit.status = 'draft'; });
    expect(result.publishable).toBe(false);
    expect(codes(result.errors)).toEqual(['unit_draft']);
  });

  it('duplicate question IDs, in the unit and across the course', () => {
    expect(codes(broken((unit) => { unit.questions[1].id = unit.questions[0].id; }).errors)).toContain('question_duplicate');
    expect(codes(broken((unit) => { unit.questions[0].id = demo.units[1].questions[0].id; }).errors)).toContain('question_duplicate_course');
  });

  it('unknown diagrams in blocks, contexts and hotspots', () => {
    const result = broken((unit) => {
      const block = unit.lessons[1].sections[0].blocks[0];
      if (block.type === 'diagram') block.diagramId = 'no-such-diagram';
      const hotspot = unit.questions.find((question) => question.answer.type === 'diagram_hotspot')!;
      if (hotspot.answer.type === 'diagram_hotspot') hotspot.answer.diagramId = 'missing';
      unit.questions[0].context = { kind: 'diagram', diagramId: 'missing-2' };
    });
    expect(codes(result.errors).filter((code) => code === 'diagram_unknown')).toHaveLength(3);
    expect(result.errors.find((issue) => issue.code === 'diagram_unknown')!.message).toMatch(/joonisteregistris/u);
  });

  it('broken answer keys for each type', () => {
    const result = broken((unit) => {
      for (const question of unit.questions) {
        const answer = question.answer;
        if (answer.type === 'single_choice') answer.correctOptionId = 'not-an-option';
        if (answer.type === 'multiple_selection') answer.correctOptionIds = answer.options.map((option) => option.id);
        if (answer.type === 'matching') delete answer.correctPairs[answer.prompts[0].id];
        if (answer.type === 'grouping') answer.correctGroupByItem[answer.items[0].id] = 'ghost';
        if (answer.type === 'ordering') answer.correctOrder = answer.correctOrder.slice(1);
        if (answer.type === 'diagram_hotspot') answer.correctRegionId = 'ghost';
      }
    });
    const keyErrors = result.errors.filter((issue) => issue.code === 'answer_key');
    expect(keyErrors.length).toBe(demo.units[0].questions.length);
    expect(result.publishable).toBe(false);
  });

  it('duplicate option IDs and texts', () => {
    const result = broken((unit) => {
      const answer = unit.questions[0].answer;
      if (answer.type === 'single_choice') {
        answer.options[1] = { id: answer.options[0].id, text: answer.options[0].text };
      }
    });
    expect(codes(result.errors)).toEqual(expect.arrayContaining(['answer_duplicate_id', 'answer_duplicate_text']));
  });

  it('missing explanation, sources, stem and unknown objectives', () => {
    const result = broken((unit) => {
      unit.questions[0].explanation = ' ';
      unit.questions[1].sources = [];
      unit.questions[2].stem = '';
      unit.questions[3].primaryObjectiveId = 'nope';
      unit.questions[4].relatedObjectiveIds = ['ghost'];
      unit.lessons[0].objectiveIds.push('ghost-2');
    });
    expect(codes(result.errors)).toEqual(expect.arrayContaining(['question_explanation', 'source_missing', 'question_stem', 'question_objective', 'question_related_objective', 'lesson_objective']));
  });

  it('a required objective with only one practice question blocks publication (A3)', () => {
    const result = broken((unit) => {
      let kept = false;
      for (const question of unit.questions) {
        if (question.primaryObjectiveId !== 'demo-vesi-o1') continue;
        if (kept) question.eligibility = { practice: false, test: true };
        kept = true;
      }
    });
    const issue = result.errors.find((item) => item.code === 'practice_objective_coverage');
    expect(issue?.message).toMatch(/vähemalt 2/u);
    expect(result.publishable).toBe(false);
  });

  it('no buildable test blocks publication with a useful message', () => {
    const tooFew = broken((unit) => {
      unit.questions.forEach((question, index) => { if (index >= 15) question.eligibility = { practice: true, test: false }; });
    });
    expect(codes(tooFew.errors)).toContain('test_too_few_questions');
    expect(tooFew.errors.find((issue) => issue.code === 'test_too_few_questions')!.message).toMatch(/vaja on vähemalt 20/u);

    const levels = broken((unit) => {
      for (const question of unit.questions) if (question.cognitiveLevel === 'application') question.cognitiveLevel = 'factual';
    });
    expect(codes(levels.errors)).toContain('test_level_quota');
    expect(levels.errors.find((issue) => issue.code === 'test_level_quota')!.message).toMatch(/rakendamise küsimusi on 0, vaja 5/u);

    const coverage = broken((unit) => {
      for (const question of unit.questions) if (question.primaryObjectiveId === 'demo-vesi-o4') question.eligibility = { practice: true, test: false };
    });
    expect(codes(coverage.errors)).toContain('test_objective_coverage');
  });

  it('thin retake diversity is a warning only', () => {
    const pinned = broken((unit) => {
      // 33 test groups → drop 7 single-question factual groups (26 left).
      let dropped = 0;
      for (const question of unit.questions) {
        if (dropped < 7 && question.cognitiveLevel === 'factual' && question.eligibility.test && question.variantGroupId !== 'demo-vesi-g01') {
          question.eligibility = { practice: true, test: false };
          dropped += 1;
        }
      }
    });
    expect(pinned.buildability?.ok).toBe(true);
    expect(codes(pinned.warnings)).toContain('retake_diversity');
    expect(pinned.errors).toEqual([]);
    expect(pinned.publishable).toBe(true);
  });

  it('structural lesson problems', () => {
    const result = broken((unit) => {
      unit.lessons[1].order = unit.lessons[0].order;
      unit.lessons[0].sections[0].blocks.push({ id: unit.lessons[0].sections[0].blocks[0].id, type: 'paragraph', text: '' });
      unit.lessons[0].sections[1].blocks.push({ id: 'bad-table', type: 'table', headers: ['a', 'b'], rows: [['1']] });
      unit.lessons[1].sections[1].blocks.push({ id: 'bad-link', type: 'externalResource', title: 'x', intro: 'y', url: 'http://example.com', publisher: 'z', resourceType: 'article' });
      unit.lessons[1].sections.push({ id: 'empty-section', blocks: [] });
    });
    expect(codes(result.errors)).toEqual(expect.arrayContaining(['lesson_order_duplicate', 'block_duplicate', 'block_empty', 'table_shape', 'block_resource_url', 'section_empty']));
  });

  it('course-level problems: unit order, numbering, settings, preview learners', () => {
    const course: Course = {
      ...structuredClone(demo),
      learners: ['kiur'],
      settings: { ...demo.settings, levelDistribution: { factual: 8, understanding: 7, application: 4 } }
    };
    course.units = [course.units[1], course.units[0]];
    const result = validateCourse(course);
    expect(codes(result.errors)).toEqual(expect.arrayContaining(['course_preview_learners', 'settings_distribution_sum', 'unit_order']));
    expect(result.valid).toBe(false);
  });

  it('image blocks: local path, alt text, credit and size', () => {
    const withImage = (image: Record<string, unknown>, options = {}) => {
      const unit = structuredClone(demo.units[0]);
      unit.lessons[0].sections[0].blocks.push({ id: 'img-1', type: 'image', src: '/textbook-images/foto.webp', alt: 'Foto Maast kosmosest.', width: 900, height: 900, credit: 'NASA', ...image } as never);
      return validateUnit(unit, { ...demo, units: [unit, demo.units[1]] }, options);
    };
    expect(withImage({}).errors).toEqual([]);
    expect(codes(withImage({ src: 'https://example.com/foto.webp' }).errors)).toEqual(['block_image_src']);
    expect(codes(withImage({ src: '/textbook-images/../secret.webp' }).errors)).toEqual(['block_image_src']);
    expect(codes(withImage({ src: '/textbook-images/foto.gif' }).errors)).toEqual(['block_image_src']);
    expect(codes(withImage({ alt: ' ' }).errors)).toEqual(['block_image_alt']);
    expect(codes(withImage({ credit: '' }).errors)).toEqual(['block_image_credit']);
    expect(codes(withImage({ width: 0 }).errors)).toEqual(['block_image_size']);
    expect(codes(withImage({}, { imageExists: () => false }).errors)).toEqual(['block_image_missing']);
    expect(withImage({}, { imageExists: (src: string) => src === '/textbook-images/foto.webp' }).errors).toEqual([]);
  });

  it('publishable() is the parent-facing alias', () => {
    const result = publishable(demo.units[1], demo);
    expect(result).toMatchObject({ unitId: 'demo-taim', publishable: true, errors: [] });
  });
});
