import { describe, expect, it } from 'vitest';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import { unit11 } from '@/content/textbook/loodusopetus-opik/unit11';
import { buildTestSnapshot, historyFromSnapshots, retakeDiversity } from '@/lib/textbook/testSelection';
import { COGNITIVE_LEVELS } from '@/lib/textbook/types';
import { validateUnit } from '@/lib/textbook/validator';

// Unit 11 "Gloobus" (textbook pages 48–49): the owner's reviewed content as
// shipped, checked with the framework's own validator and test selector (the
// package's unit11_audit.py proved the same independently).

const settings = loodusopetusOpikCourse.settings;

describe('unit 11 "Gloobus" content', () => {
  it('is in the course after Unit 10, ready, and valid without warnings', () => {
    expect(loodusopetusOpikCourse.units.map((unit) => unit.id).slice(0, 2)).toEqual(['lo-opik-u10', 'lo-opik-u11']);
    expect(unit11).toMatchObject({ courseId: 'loodusopetus-opik', number: 11, title: 'Gloobus', pages: { from: 48, to: 49 }, status: 'ready' });
    const result = validateUnit(unit11, loodusopetusOpikCourse);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.publishable).toBe(true);
    expect(result.stats).toMatchObject({
      lessons: 4, requiredLessons: 4, sections: 11, blocks: 41, objectives: 7, requiredObjectives: 7,
      questions: 74, practiceQuestions: 74, testQuestions: 74, testVariantGroups: 64,
      testLevels: { factual: 27, understanding: 22, application: 25 }
    });
    expect(result.stats.answerTypes).toEqual({ single_choice: 44, multiple_selection: 6, matching: 5, grouping: 5, ordering: 2, diagram_hotspot: 12 });
  });

  it('keeps the four textbook lesson titles and links every required objective to a required lesson', () => {
    expect(unit11.lessons.map((lesson) => lesson.title)).toEqual([
      'Gloobus on Maa mudel', 'Maa telg ja poolused', 'Ekvaator, paralleelid ja meridiaanid', 'Nullmeridiaan ja Eesti asukoht'
    ]);
    const taught = new Set(unit11.lessons.filter((lesson) => lesson.required).flatMap((lesson) => lesson.objectiveIds));
    for (const objective of unit11.objectives) {
      expect(objective.required).toBe(true);
      expect(taught.has(objective.id), objective.id).toBe(true);
      const practice = unit11.questions.filter((question) => question.primaryObjectiveId === objective.id && question.eligibility.practice);
      expect(practice.length, objective.id).toBeGreaterThanOrEqual(9);
    }
  });

  it('uses ASCII IDs only', () => {
    const ids = [
      unit11.id,
      ...unit11.objectives.map((objective) => objective.id),
      ...unit11.lessons.flatMap((lesson) => [lesson.id, ...lesson.sections.flatMap((section) => [section.id, ...section.blocks.map((block) => block.id)])]),
      ...unit11.questions.flatMap((question) => [question.id, question.variantGroupId])
    ];
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('builds strict 20-question tests (8/7/5, every objective, 20 groups) and a retake with no shared variant group', () => {
    for (let seed = 1; seed <= 30; seed += 1) {
      const first = buildTestSnapshot({ courseId: 'loodusopetus-opik', unit: unit11, settings, seed });
      const second = buildTestSnapshot({ courseId: 'loodusopetus-opik', unit: unit11, settings, seed: seed + 1000, history: historyFromSnapshots([first]) });
      for (const snapshot of [first, second]) {
        const questions = snapshot.questions.map((frozen) => frozen.question);
        expect(snapshot.relaxations).toEqual([]);
        expect(new Set(questions.map((question) => question.variantGroupId)).size).toBe(20);
        for (const level of COGNITIVE_LEVELS) expect(questions.filter((question) => question.cognitiveLevel === level)).toHaveLength(settings.levelDistribution[level]);
        expect(new Set(questions.map((question) => question.primaryObjectiveId)).size).toBe(7);
      }
      expect(second.reusedVariantGroupIds, `seed ${seed}`).toEqual([]);
    }
    expect(retakeDiversity(unit11, settings)).toMatchObject({ distinctGroups: 64, secondAttemptOverlap: 0, sufficient: true });
  });
});
