import db from '@/lib/db';
import { nowIso } from '@/lib/tasks';
import type {
  CourseOverviewResponse,
  CourseRef,
  LessonContentResponse,
  ReadingCompleteResponse,
  UnitDetailResponse,
  UnitNextStep,
  UnitSummary
} from '@/lib/textbook/api';
import { UNIT_STATUS_LABELS } from '@/lib/textbook/progression';
import type { Course } from '@/lib/textbook/types';
import { courseForScope, findCourse } from '@/lib/server/textbook/courses';
import { forbidden, notFound, TextbookApiError, type TextbookContext } from '@/lib/server/textbook/context';
import {
  allVisiblePassed,
  attemptSummaries,
  bestScore,
  loadCourseState,
  missedObjectivesOfLastFail,
  nextOpenUnit,
  objectiveRef,
  unitRef,
  type CourseState,
  type UnitState
} from '@/lib/server/textbook/progress';

// Course overview, unit detail, lesson reading and the reading gate. Shared
// by the child and the preview scope; the context decides which learner's rows
// are read and which units count as published.

export function courseRef(course: Course): CourseRef {
  return { courseId: course.id, title: course.title, previewOnly: course.previewOnly };
}

export function resolveCourse(context: TextbookContext, courseId: string): Course {
  const course = courseForScope(context.scope, context.learner, courseId);
  if (course) return course;
  // A course that exists but is not this learner's (the demo for a child) is
  // forbidden; an unknown one is simply not found.
  if (findCourse(courseId)) throw forbidden('See kursus ei ole sulle avatud.');
  throw notFound('Kursust ei leitud.');
}

// The unit as this learner may see it: published (child) or ready (preview),
// and open. A direct URL or API call for anything else is refused here.
export function resolveUnitState(context: TextbookContext, courseId: string, unitId: string): { courseState: CourseState; state: UnitState } {
  const course = resolveCourse(context, courseId);
  const courseState = loadCourseState(context, course);
  const state = courseState.byId.get(unitId);
  if (!state) throw notFound('Õppetükki ei leitud.');
  if (!state.published) throw forbidden('See õppetükk ei ole veel avatud.');
  if (!state.access.accessible) throw new TextbookApiError('locked', 'See õppetükk on veel lukus.');
  return { courseState, state };
}

export function unitSummary(state: UnitState): UnitSummary {
  const completed = new Set(state.completedLessonIds);
  return {
    ...unitRef(state.unit),
    pages: state.unit.pages ?? null,
    status: state.gates.status,
    statusLabel: UNIT_STATUS_LABELS[state.gates.status],
    lessonsCompleted: state.requiredLessonIds.filter((id) => completed.has(id)).length,
    lessonsRequired: state.requiredLessonIds.length,
    practiceCompleted: state.facts.practiceCompleted,
    testPassed: state.facts.testPassed,
    bestScore: bestScore(state)
  };
}

export function buildCourseOverview(context: TextbookContext, courseState: CourseState): CourseOverviewResponse {
  const visible = courseState.units.filter((state) => state.published);
  const current = visible.find((state) => state.access.accessible && !state.facts.testPassed) ?? null;
  return {
    scope: context.scope,
    course: courseRef(courseState.course),
    units: visible.map(unitSummary),
    currentUnitId: current?.unit.id ?? null,
    allUnitsPassed: allVisiblePassed(courseState)
  };
}

export function getCourseOverview(context: TextbookContext, courseId: string): CourseOverviewResponse {
  const course = resolveCourse(context, courseId);
  return buildCourseOverview(context, loadCourseState(context, course));
}

function nextStepFor(state: UnitState): { nextStep: UnitNextStep; nextLessonId: string | null } {
  const completed = new Set(state.completedLessonIds);
  const firstUnread = state.unit.lessons
    .filter((lesson) => lesson.required && !completed.has(lesson.id))
    .sort((left, right) => left.order - right.order)[0];
  if (state.activeTestSessionId) return { nextStep: 'resume_test', nextLessonId: null };
  if (state.facts.testPassed) return { nextStep: 'done', nextLessonId: null };
  if (!state.gates.readingComplete) return { nextStep: 'read', nextLessonId: firstUnread?.id ?? null };
  if (state.gates.retakePracticePending) {
    return { nextStep: state.activePracticeMode === 'targeted' ? 'resume_practice' : 'retake_practice', nextLessonId: null };
  }
  if (!state.facts.practiceCompleted) return { nextStep: state.activePracticeSessionId ? 'resume_practice' : 'practice', nextLessonId: null };
  return { nextStep: 'test', nextLessonId: null };
}

export function getUnitDetail(context: TextbookContext, courseId: string, unitId: string): UnitDetailResponse {
  const { courseState, state } = resolveUnitState(context, courseId, unitId);
  const completed = new Set(state.completedLessonIds);
  const { nextStep, nextLessonId } = nextStepFor(state);
  return {
    scope: context.scope,
    course: courseRef(courseState.course),
    unit: { ...unitSummary(state), contentVersion: state.unit.contentVersion },
    lessons: [...state.unit.lessons].sort((left, right) => left.order - right.order).map((lesson) => ({
      lessonId: lesson.id,
      title: lesson.title,
      order: lesson.order,
      required: lesson.required,
      completed: completed.has(lesson.id),
      sectionCount: lesson.sections.length
    })),
    objectives: state.unit.objectives.map(objectiveRef),
    gates: {
      readingComplete: state.gates.readingComplete,
      practiceUnlocked: state.gates.practiceUnlocked,
      testUnlocked: state.gates.testUnlocked,
      retakePracticePending: state.gates.retakePracticePending
    },
    activePracticeSessionId: state.activePracticeSessionId,
    activeTestSessionId: state.activeTestSessionId,
    attempts: attemptSummaries(state),
    missedObjectives: missedObjectivesOfLastFail(state),
    nextStep,
    nextLessonId,
    nextUnit: nextOpenUnit(courseState, unitId)
  };
}

export function getLesson(context: TextbookContext, courseId: string, unitId: string, lessonId: string): LessonContentResponse {
  const { state } = resolveUnitState(context, courseId, unitId);
  const lessons = [...state.unit.lessons].sort((left, right) => left.order - right.order);
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index < 0) throw notFound('Õppetundi ei leitud.');
  const lesson = lessons[index];
  const objectiveIds = new Set(lesson.objectiveIds);
  return {
    scope: context.scope,
    unitId: state.unit.id,
    contentVersion: state.unit.contentVersion,
    lesson: {
      lessonId: lesson.id,
      title: lesson.title,
      order: lesson.order,
      required: lesson.required,
      sections: JSON.parse(JSON.stringify(lesson.sections)) as LessonContentResponse['lesson']['sections']
    },
    objectives: state.unit.objectives.filter((objective) => objectiveIds.has(objective.id)).map(objectiveRef),
    completed: state.completedLessonIds.includes(lesson.id),
    previousLessonId: lessons[index - 1]?.id ?? null,
    nextLessonId: lessons[index + 1]?.id ?? null
  };
}

// "Lugesin läbi". Idempotent by nature (an upsert), so a retried request or a
// second tab changes nothing but the count of re-reads.
export function completeLesson(context: TextbookContext, courseId: string, unitId: string, lessonId: string): ReadingCompleteResponse {
  return db.transaction(() => {
    const { state } = resolveUnitState(context, courseId, unitId);
    const lesson = state.unit.lessons.find((item) => item.id === lessonId);
    if (!lesson) throw notFound('Õppetundi ei leitud.');
    const now = nowIso();
    db.prepare(`
      INSERT INTO textbook_lesson_reads (learner, courseId, unitId, lessonId, contentVersion, firstCompletedAt, lastCompletedAt, completions)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
      ON CONFLICT(learner, courseId, unitId, lessonId) DO UPDATE SET
        lastCompletedAt = excluded.lastCompletedAt, contentVersion = excluded.contentVersion, completions = completions + 1
    `).run(context.learner, courseId, unitId, lessonId, state.unit.contentVersion, now, now);
    const after = resolveUnitState(context, courseId, unitId).state;
    return {
      lessonId,
      completed: true as const,
      readingComplete: after.gates.readingComplete,
      practiceUnlocked: after.gates.practiceUnlocked,
      unitStatus: after.gates.status
    };
  }).immediate();
}
