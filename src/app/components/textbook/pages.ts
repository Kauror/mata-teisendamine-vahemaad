// Page paths for one learner scope. The child scope serves Kiur's course under
// /kiur/loodusopetus/opik (TEXTBOOK_PAGES); the preview scope mirrors the same
// screens under /vanem/oppetukid/eelvaade/<courseId>/… for any course,
// including the demo. The same components render both.

import { TEXTBOOK_PAGES, type TextbookScope } from '@/lib/textbook/api';

export const CHILD_TEXTBOOK_COURSE_ID = 'loodusopetus-opik';

export type TextbookPaths = {
  course: string;
  unit: (unitId: string) => string;
  lesson: (unitId: string, lessonId: string) => string;
  practice: (unitId: string) => string;
  test: (unitId: string) => string;
  // Where "back" leads from the course page.
  home: string;
};

const enc = encodeURIComponent;

export function textbookPaths(scope: TextbookScope, courseId: string): TextbookPaths {
  if (scope === 'child') {
    return {
      course: TEXTBOOK_PAGES.childCourse,
      unit: TEXTBOOK_PAGES.childUnit,
      lesson: TEXTBOOK_PAGES.childLesson,
      practice: TEXTBOOK_PAGES.childPractice,
      test: TEXTBOOK_PAGES.childTest,
      home: '/kiur/loodusopetus'
    };
  }
  const unit = (unitId: string) => TEXTBOOK_PAGES.previewUnit(courseId, unitId);
  return {
    course: TEXTBOOK_PAGES.previewCourse(courseId),
    unit,
    // Same sub-paths as the child routes.
    lesson: (unitId, lessonId) => `${unit(unitId)}/lugemine/${enc(lessonId)}`,
    practice: (unitId) => `${unit(unitId)}/harjuta`,
    test: (unitId) => `${unit(unitId)}/test`,
    home: '/vanem/halda?tab=sisu'
  };
}
