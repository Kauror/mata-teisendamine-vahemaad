import { getChildCourse, getCourse, TEXTBOOK_COURSES } from '@/content/textbook/registry';
import type { Learner } from '@/lib/shared/types';
import { PREVIEW_LEARNER, type TextbookLearner, type TextbookScope } from '@/lib/textbook/api';
import { publishable, type UnitValidation } from '@/lib/textbook/validator';
import type { Course, Unit } from '@/lib/textbook/types';
import { textbookImageExists } from '@/lib/server/textbook/imageFiles';

// Where the server reads course content from. Production: the repo registry
// (src/content/textbook/registry.ts). Tests swap in their own courses — e.g. a
// real-learner copy of the demo, or an edited version of a unit to prove that
// running sessions keep their frozen copy.

let override: readonly Course[] | null = null;

export function setTextbookCoursesForTests(courses: readonly Course[] | null) {
  override = courses;
  validationCache = new WeakMap();
}

export function allCourses(): readonly Course[] {
  return override ?? TEXTBOOK_COURSES;
}

export function findCourse(courseId: string): Course | null {
  if (!override) return getCourse(courseId);
  return override.find((course) => course.id === courseId) ?? null;
}

// The child gate (same predicate as the registry's getChildCourse): never a
// preview-only course, never another learner's course.
export function findChildCourse(learner: Learner, courseId: string): Course | null {
  if (!override) return getChildCourse(learner, courseId);
  const course = findCourse(courseId);
  return course && !course.previewOnly && course.learners.includes(learner) ? course : null;
}

// The learner's view of a course: child scope through the child gate, preview
// scope sees every course (the demo included).
export function courseForScope(scope: TextbookScope, learner: TextbookLearner, courseId: string): Course | null {
  if (scope === 'preview') return learner === PREVIEW_LEARNER ? findCourse(courseId) : null;
  if (learner === PREVIEW_LEARNER) return null;
  return findChildCourse(learner, courseId);
}

export function findUnit(course: Course, unitId: string): Unit | null {
  return course.units.find((unit) => unit.id === unitId) ?? null;
}

export function sortedUnits(course: Course): Unit[] {
  return [...course.units].sort((left, right) => left.number - right.number);
}

// The validator is pure and content modules are static, so a validation is
// cached per unit object (an edited unit is a new object).
let validationCache = new WeakMap<Unit, UnitValidation>();

export function validationFor(unit: Unit, course: Course): UnitValidation {
  const cached = validationCache.get(unit);
  if (cached) return cached;
  const result = publishable(unit, course, { imageExists: (src) => textbookImageExists(src) });
  validationCache.set(unit, result);
  return result;
}
