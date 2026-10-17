import { describe, expect, it } from 'vitest';
import { childCourses, getChildCourse, getCourse, previewCourses, TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { seededRng } from '@/lib/random';
import { learnerApi, PREVIEW_LEARNER, TEXTBOOK_API, TEXTBOOK_PAGES, toClientQuestion } from '@/lib/textbook/api';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { freezeQuestion } from '@/lib/textbook/presentation';
import { buildTestSnapshot } from '@/lib/textbook/testSelection';

describe('toClientQuestion', () => {
  const all = textbookDemoCourse.units.flatMap((unit) => unit.questions);

  it('never leaks the key, explanation, misconception, objectives or groups', () => {
    for (const question of all) {
      const client = toClientQuestion(freezeQuestion(question, seededRng(1)));
      const json = JSON.stringify(client);
      expect(Object.keys(client).sort()).toEqual(question.context ? ['answer', 'context', 'id', 'stem'] : ['answer', 'id', 'stem']);
      for (const forbidden of ['correct', 'explanation', 'misconception', 'primaryObjectiveId', 'relatedObjectiveIds', 'variantGroupId', 'cognitiveLevel', 'sources', 'label']) {
        expect(json, `${question.id}: ${forbidden}`).not.toContain(`"${forbidden}`);
      }
      expect(json).not.toContain(question.explanation);
      if (question.answer.type === 'diagram_hotspot') {
        const labels = getDiagram(question.answer.diagramId)!.regions.map((region) => region.label);
        for (const label of labels) expect(json).not.toContain(`"${label}"`);
      }
    }
  });

  it('applies the stored display order', () => {
    const snapshot = buildTestSnapshot({ courseId: textbookDemoCourse.id, unit: textbookDemoCourse.units[0], settings: textbookDemoCourse.settings, seed: 3 });
    for (const frozen of snapshot.questions) {
      const client = toClientQuestion(frozen);
      if (client.answer.type === 'single_choice' || client.answer.type === 'multiple_selection') expect(client.answer.options.map((option) => option.id)).toEqual(frozen.order.options);
      if (client.answer.type === 'ordering') expect(client.answer.items.map((item) => item.id)).toEqual(frozen.order.items);
      if (client.answer.type === 'matching') expect(client.answer.choices.map((item) => item.id)).toEqual(frozen.order.choices);
      // Same view on every call: a refresh changes nothing.
      expect(JSON.stringify(toClientQuestion(frozen))).toBe(JSON.stringify(client));
    }
  });
});

describe('course registry', () => {
  it('the demo course is preview-only and never offered to a child', () => {
    expect(textbookDemoCourse.previewOnly).toBe(true);
    expect(textbookDemoCourse.learners).toEqual([]);
    expect(childCourses('kiur').map((course) => course.id)).toEqual(['loodusopetus-opik']);
    expect(childCourses('kirsi')).toEqual([]);
    expect(getChildCourse('kiur', 'textbook-demo')).toBeNull();
    expect(getChildCourse('kirsi', 'loodusopetus-opik')).toBeNull();
    expect(getChildCourse('kiur', 'loodusopetus-opik')?.id).toBe('loodusopetus-opik');
    expect(previewCourses().map((course) => course.id).sort()).toEqual(['loodusopetus-opik', 'textbook-demo']);
    expect(getCourse('textbook-demo')?.units).toHaveLength(2);
  });

  it('course, unit and question IDs are unique across the registry', () => {
    const units = TEXTBOOK_COURSES.flatMap((course) => course.units.map((unit) => unit.id));
    const questions = TEXTBOOK_COURSES.flatMap((course) => course.units.flatMap((unit) => unit.questions.map((question) => question.id)));
    expect(new Set(units).size).toBe(units.length);
    expect(new Set(questions).size).toBe(questions.length);
  });
});

describe('routes', () => {
  it('child and preview routes share shapes but not prefixes', () => {
    expect(TEXTBOOK_API.child.unitDetail('loodusopetus-opik', 'lo-opik-u10')).toBe('/api/textbook/courses/loodusopetus-opik/units/lo-opik-u10');
    expect(TEXTBOOK_API.preview.unitDetail('textbook-demo', 'demo-vesi')).toBe('/api/parent/textbook/preview/courses/textbook-demo/units/demo-vesi');
    expect(learnerApi('preview').testSubmit('s1')).toBe('/api/parent/textbook/preview/test/s1/submit');
    expect(learnerApi('child').practiceAnswer('s1')).toBe('/api/textbook/practice/s1/answer');
    expect(TEXTBOOK_API.parent.publish('c', 'u')).toBe('/api/parent/textbook/courses/c/units/u/publish');
    expect(TEXTBOOK_PAGES.childLesson('u', 'l')).toBe('/kiur/loodusopetus/opik/u/lugemine/l');
    expect(PREVIEW_LEARNER).toBe('preview');
  });
});
