import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import { TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { publishable, validateCourse, validateUnit } from '@/lib/textbook/validator';
import type { Course, Unit } from '@/lib/textbook/types';

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

  it('Units 10 and 11 are ready and publishable without warnings; units 12–22 stay metadata-only drafts', () => {
    const result = validateCourse(loodusopetusOpikCourse, { imageExists: () => true });
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
    expect(result.units.map((unit) => unit.unitNumber)).toEqual([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]);
    const [unit10, unit11, ...drafts] = result.units;
    expect(unit10.errors).toEqual([]);
    expect(unit10.warnings).toEqual([]);
    expect(unit10.publishable).toBe(true);
    expect(unit10.buildability?.ok).toBe(true);
    expect(unit10.stats).toMatchObject({
      lessons: 4, requiredLessons: 4, sections: 12, blocks: 37, objectives: 6, requiredObjectives: 6,
      questions: 54, practiceQuestions: 54, testQuestions: 54, testVariantGroups: 39,
      testLevels: { factual: 19, understanding: 20, application: 15 }
    });
    expect(Object.values(unit10.stats.answerTypes).every((count) => count > 0)).toBe(true);
    // Unit 11 in detail: src/lib/textbook/unit11Content.test.ts.
    expect(unit11).toMatchObject({ unitNumber: 11, errors: [], warnings: [], publishable: true });
    for (const unit of drafts) {
      expect(unit.publishable).toBe(false);
      expect(codes(unit.errors)).toEqual(['unit_draft', 'unit_no_content']);
      expect(unit.errors[0].message).toMatch(/mustand/u);
    }
    for (const unit of loodusopetusOpikCourse.units.slice(2)) {
      expect(unit.status).toBe('draft');
      expect(unit.lessons).toEqual([]);
      expect(unit.questions).toEqual([]);
      expect(unit.objectives).toEqual([]);
    }
    expect(loodusopetusOpikCourse.settings).toMatchObject({ testLength: 20, passNumerator: 95, passDenominator: 100, levelDistribution: { factual: 8, understanding: 7, application: 5 } });
    expect(loodusopetusOpikCourse.learners).toEqual(['kiur']);
  });

  it('Unit 10 is not publishable when its photo file is missing', () => {
    const unit10 = loodusopetusOpikCourse.units[0];
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
