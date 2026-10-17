// Every textbook course the app knows. Content lives in the repo (SPEC D6);
// publication, manual unlocks and all progress live in SQLite.
//
// Adding a course = adding a module under src/content/textbook/<course-id>/
// and listing it here. `npm run content:validate` checks all of them.

import type { Learner } from '@/lib/shared/types';
import type { Course, Unit } from '@/lib/textbook/types';
import { loodusopetusOpikCourse } from '@/content/textbook/loodusopetus-opik';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';

export const TEXTBOOK_COURSES: readonly Course[] = [loodusopetusOpikCourse, textbookDemoCourse];

const BY_ID = new Map(TEXTBOOK_COURSES.map((course) => [course.id, course]));

export function getCourse(courseId: string): Course | null {
  return BY_ID.get(courseId) ?? null;
}

export function getUnit(courseId: string, unitId: string): Unit | null {
  return getCourse(courseId)?.units.find((unit) => unit.id === unitId) ?? null;
}

// Courses a child may ever see: never a preview-only course.
export function childCourses(learner: Learner): Course[] {
  return TEXTBOOK_COURSES.filter((course) => !course.previewOnly && course.learners.includes(learner));
}

// The child-route gate: null for unknown, preview-only or other learners'
// courses. Child routes and APIs must resolve courses only through this.
export function getChildCourse(learner: Learner, courseId: string): Course | null {
  const course = getCourse(courseId);
  return course && !course.previewOnly && course.learners.includes(learner) ? course : null;
}

// Courses the parent preview can open (all of them, demo included).
export function previewCourses(): Course[] {
  return [...TEXTBOOK_COURSES];
}
