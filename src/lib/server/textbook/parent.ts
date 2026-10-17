import db from '@/lib/db';
import { nowIso } from '@/lib/tasks';
import type { Learner } from '@/lib/shared/types';
import {
  PREVIEW_LEARNER,
  type ParentCourseView,
  type ParentOverviewResponse,
  type ParentUnitDetailResponse,
  type ParentUnitProgress,
  type ParentUnitView,
  type PreviewResetResponse,
  type UnitRef,
  type WeakObjective
} from '@/lib/textbook/api';
import { UNIT_STATUS_LABELS } from '@/lib/textbook/progression';
import type { Course, Unit } from '@/lib/textbook/types';
import { allCourses, findCourse, findUnit, sortedUnits, validationFor } from '@/lib/server/textbook/courses';
import { childContext, forbidden, notFound, TextbookApiError } from '@/lib/server/textbook/context';
import { courseRef } from '@/lib/server/textbook/learner';
import { attemptSummaries, loadCourseState, objectiveRef, publicationRows, unitRef, type CourseState } from '@/lib/server/textbook/progress';

// The parent's side: every course (drafts and the preview-only demo
// included) with validation, publication and each real learner's progress;
// publish/unpublish (refused with the validator's Estonian problems); manual
// unlock (opens a unit, never records a pass); and the preview reset.

type WeakRow = { unitId: string; objectiveId: string; missCount: number; lastMissedAt: string | null };

function weakObjectives(learner: Learner, course: Course): Map<string, WeakObjective[]> {
  const rows = db.prepare('SELECT unitId, objectiveId, missCount, lastMissedAt FROM textbook_objective_stats WHERE learner = ? AND courseId = ? AND missCount > 0 ORDER BY missCount DESC, lastMissedAt DESC')
    .all(learner, course.id) as WeakRow[];
  const out = new Map<string, WeakObjective[]>();
  for (const row of rows) {
    const unit = findUnit(course, row.unitId);
    const objective = unit?.objectives.find((item) => item.id === row.objectiveId);
    const list = out.get(row.unitId) ?? [];
    list.push({
      ...(objective ? objectiveRef(objective) : { objectiveId: row.objectiveId, description: row.objectiveId, required: false }),
      missCount: row.missCount,
      lastMissedAt: row.lastMissedAt ?? ''
    });
    out.set(row.unitId, list);
  }
  return out;
}

function practiceRuns(learner: Learner, courseId: string): Map<string, number> {
  const rows = db.prepare("SELECT unitId, COUNT(*) AS runs FROM textbook_practice_sessions WHERE learner = ? AND courseId = ? AND status = 'completed' GROUP BY unitId").all(learner, courseId) as Array<{ unitId: string; runs: number }>;
  return new Map(rows.map((row) => [row.unitId, row.runs]));
}

type LearnerData = { learner: Learner; state: CourseState; weak: Map<string, WeakObjective[]>; runs: Map<string, number> };

function learnerData(course: Course): LearnerData[] {
  return course.previewOnly ? [] : course.learners.map((learner) => ({
    learner,
    state: loadCourseState(childContext(learner), course),
    weak: weakObjectives(learner, course),
    runs: practiceRuns(learner, course.id)
  }));
}

function unitView(course: Course, unit: Unit, data: LearnerData[], publication: ReturnType<typeof publicationRows>): ParentUnitView {
  const validation = validationFor(unit, course);
  const row = publication.get(unit.id);
  const progress: ParentUnitProgress[] = data.map(({ learner, state, weak, runs }) => {
    const unitState = state.byId.get(unit.id)!;
    const completed = new Set(unitState.completedLessonIds);
    return {
      learner,
      status: unitState.gates.status,
      statusLabel: UNIT_STATUS_LABELS[unitState.gates.status],
      lessonsCompleted: unitState.requiredLessonIds.filter((id) => completed.has(id)).length,
      lessonsRequired: unitState.requiredLessonIds.length,
      practiceCompleted: unitState.facts.practiceCompleted,
      practiceRuns: runs.get(unit.id) ?? 0,
      attempts: attemptSummaries(unitState),
      passedAt: unitState.progress?.firstPassedAt ?? null,
      weakObjectives: weak.get(unit.id) ?? []
    };
  });
  return {
    ...unitRef(unit),
    pages: unit.pages ?? null,
    contentStatus: unit.status,
    contentVersion: unit.contentVersion,
    published: row?.published === 1,
    publishedAt: row?.published === 1 ? row.publishedAt : null,
    manualUnlock: data.some(({ state }) => state.byId.get(unit.id)?.manualUnlock),
    validation: { publishable: validation.publishable, errors: validation.errors, warnings: validation.warnings, stats: validation.stats },
    progress
  };
}

function waitingForPublish(course: Course, data: LearnerData[], publication: ReturnType<typeof publicationRows>): UnitRef | null {
  if (data.length === 0) return null;
  const units = sortedUnits(course);
  const published = units.filter((unit) => unit.status === 'ready' && publication.get(unit.id)?.published === 1);
  if (published.length === 0) return null;
  const allPassed = data.every(({ state }) => published.every((unit) => state.byId.get(unit.id)?.facts.testPassed));
  if (!allPassed) return null;
  const last = published.at(-1)!.number;
  const next = units.find((unit) => unit.number > last && publication.get(unit.id)?.published !== 1);
  return next ? unitRef(next) : null;
}

function courseView(course: Course): ParentCourseView {
  const data = learnerData(course);
  const publication = publicationRows(course.id);
  return {
    ...courseRef(course),
    learners: [...course.learners],
    settings: { ...course.settings, levelDistribution: { ...course.settings.levelDistribution } },
    units: sortedUnits(course).map((unit) => unitView(course, unit, data, publication)),
    waitingForPublish: waitingForPublish(course, data, publication)
  };
}

export function getParentOverview(): ParentOverviewResponse {
  return { courses: allCourses().map(courseView) };
}

function resolve(courseId: string, unitId: string) {
  const course = findCourse(courseId);
  if (!course) throw notFound('Kursust ei leitud.');
  const unit = findUnit(course, unitId);
  if (!unit) throw notFound('Õppetükki ei leitud.');
  return { course, unit };
}

function parentUnitView(course: Course, unit: Unit): ParentUnitView {
  return unitView(course, unit, learnerData(course), publicationRows(course.id));
}

// Full content including the answer keys: parent only.
export function getParentUnitDetail(courseId: string, unitId: string): ParentUnitDetailResponse {
  const { course, unit } = resolve(courseId, unitId);
  const copy = JSON.parse(JSON.stringify(unit)) as Unit;
  return { course: courseRef(course), unit: parentUnitView(course, unit), objectives: copy.objectives, lessons: copy.lessons, questions: copy.questions };
}

// Publish or unpublish. Publishing runs the validator: any error refuses it
// with the Estonian problems. A preview-only course is never published.
// Unpublishing hides the unit again but never deletes progress or passes.
export function setPublished(courseId: string, unitId: string, published: boolean): { unit: ParentUnitView } {
  return db.transaction(() => {
    const { course, unit } = resolve(courseId, unitId);
    if (course.previewOnly) throw forbidden('Näidiskursust ei saa lastele avaldada.');
    if (published) {
      const validation = validationFor(unit, course);
      if (!validation.publishable || validation.errors.length > 0) {
        throw new TextbookApiError('validation_failed', 'Õppetükki ei saa avaldada: sisu ei ole valmis.', {
          problems: validation.errors.length > 0 ? validation.errors : [{ severity: 'error', code: 'unit_draft', message: 'Õppetükk on veel mustand.' }]
        });
      }
    }
    const now = nowIso();
    db.prepare(`
      INSERT INTO textbook_unit_publication (courseId, unitId, published, publishedAt, publishedContentVersion, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(courseId, unitId) DO UPDATE SET
        published = excluded.published,
        publishedAt = CASE WHEN excluded.published = 1 THEN COALESCE(CASE WHEN textbook_unit_publication.published = 1 THEN textbook_unit_publication.publishedAt END, excluded.publishedAt) ELSE textbook_unit_publication.publishedAt END,
        publishedContentVersion = CASE WHEN excluded.published = 1 THEN excluded.publishedContentVersion ELSE textbook_unit_publication.publishedContentVersion END,
        updatedAt = excluded.updatedAt
    `).run(courseId, unitId, published ? 1 : 0, published ? now : null, published ? unit.contentVersion : null, now);
    return { unit: parentUnitView(course, unit) };
  }).immediate();
}

// Opens a unit early for the course's learners (or one of them). It is only
// an access override: no pass, no completion, no reward.
export function setManualUnlock(courseId: string, unitId: string, unlocked: boolean, learner?: Learner): { unit: ParentUnitView } {
  return db.transaction(() => {
    const { course, unit } = resolve(courseId, unitId);
    if (course.previewOnly) throw forbidden('Näidiskursusel ei ole lapsi.');
    const learners = learner ? [learner] : course.learners;
    if (learners.some((item) => !course.learners.includes(item))) throw forbidden('See laps ei kasuta seda kursust.');
    const now = nowIso();
    const statement = db.prepare(`
      INSERT INTO textbook_manual_unlocks (learner, courseId, unitId, unlocked, updatedAt) VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(learner, courseId, unitId) DO UPDATE SET unlocked = excluded.unlocked, updatedAt = excluded.updatedAt
    `);
    for (const item of learners) statement.run(item, courseId, unitId, unlocked ? 1 : 0, now);
    return { unit: parentUnitView(course, unit) };
  }).immediate();
}

const PREVIEW_TABLES = [
  'textbook_test_rounds',
  'textbook_test_sessions',
  'textbook_practice_sessions',
  'textbook_lesson_reads',
  'textbook_unit_progress',
  'textbook_objective_stats',
  'textbook_manual_unlocks'
] as const;

// "Lähtesta eelvaade": deletes the preview learner's rows only — every
// statement is bound to learner = 'preview'.
export function resetPreview(courseId?: string): PreviewResetResponse {
  if (courseId !== undefined && !findCourse(courseId)) throw notFound('Kursust ei leitud.');
  return db.transaction(() => {
    const where = courseId === undefined ? 'learner = ?' : 'learner = ? AND courseId = ?';
    const args = courseId === undefined ? [PREVIEW_LEARNER] : [PREVIEW_LEARNER, courseId];
    const count = (table: string) => (db.prepare(`SELECT COUNT(*) AS count FROM ${table} WHERE ${where}`).get(...args) as { count: number }).count;
    const sessionsRemoved = count('textbook_test_sessions') + count('textbook_practice_sessions');
    for (const table of PREVIEW_TABLES) db.prepare(`DELETE FROM ${table} WHERE ${where}`).run(...args);
    return { reset: true as const, sessionsRemoved };
  }).immediate();
}
