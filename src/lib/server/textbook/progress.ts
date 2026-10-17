import db from '@/lib/db';
import type { ObjectiveRef, TestAttemptSummary, TextbookLearner, UnitRef } from '@/lib/textbook/api';
import {
  computeTextbookAccess,
  computeUnitGates,
  textbookUnitOpenedByPassing,
  type TextbookUnitAccessInput,
  type UnitAccess,
  type UnitGates,
  type UnitProgressFacts
} from '@/lib/textbook/progression';
import type { Course, LearningObjective, Unit } from '@/lib/textbook/types';
import { sortedUnits } from '@/lib/server/textbook/courses';
import type { TextbookContext } from '@/lib/server/textbook/context';

// Reads the stored facts of one learner in one course and derives access and
// gates from them on every request (nothing derived is stored, exactly like
// the vocabulary unlock rules): publication, manual unlocks, lessons read,
// practice completions, test rounds and first passes.

export type ProgressRow = {
  learner: TextbookLearner;
  courseId: string;
  unitId: string;
  practiceCompletedAt: string | null;
  practiceRuns: number;
  firstPassedAt: string | null;
  passedSessionId: string | null;
  passedScore: number | null;
  passedTotal: number | null;
  passedContentVersion: string | null;
  passedAttemptId: number | null;
  passCount: number;
  updatedAt: string;
};

export type RoundRow = {
  id: number;
  sessionId: string;
  learner: TextbookLearner;
  courseId: string;
  unitId: string;
  attemptNumber: number;
  contentVersion: string;
  correct: number;
  total: number;
  requiredCorrect: number;
  passed: number;
  questionIdsJson: string;
  missedObjectiveIdsJson: string;
  submittedAt: string;
};

export type UnitState = {
  unit: Unit;
  published: boolean;
  publishedAt: string | null;
  manualUnlock: boolean;
  access: UnitAccess;
  completedLessonIds: string[];
  requiredLessonIds: string[];
  progress: ProgressRow | null;
  rounds: RoundRow[];
  lastRound: RoundRow | null;
  activeTestSessionId: string | null;
  activePracticeSessionId: string | null;
  activePracticeMode: 'normal' | 'targeted' | null;
  retakePracticeCompleted: boolean;
  facts: UnitProgressFacts;
  gates: UnitGates;
};

export type CourseState = {
  course: Course;
  units: UnitState[];
  byId: Map<string, UnitState>;
  accessInputs: TextbookUnitAccessInput[];
};

type PublicationRow = { unitId: string; published: number; publishedAt: string | null };

export function publicationRows(courseId: string): Map<string, PublicationRow> {
  const rows = db.prepare('SELECT unitId, published, publishedAt FROM textbook_unit_publication WHERE courseId = ?').all(courseId) as PublicationRow[];
  return new Map(rows.map((row) => [row.unitId, row]));
}

// Child scope: the parent's switch, and only for content marked 'ready' (a
// unit whose content went back to draft is hidden again; its records stay).
// Preview scope: every 'ready' unit counts as published.
export function isPublished(context: TextbookContext, unit: Unit, row: PublicationRow | undefined): boolean {
  if (unit.status !== 'ready') return false;
  return context.scope === 'preview' ? true : row?.published === 1;
}

export function loadCourseState(context: TextbookContext, course: Course): CourseState {
  const learner = context.learner;
  const publication = publicationRows(course.id);
  const unlocks = new Set((db.prepare('SELECT unitId FROM textbook_manual_unlocks WHERE learner = ? AND courseId = ? AND unlocked = 1').all(learner, course.id) as Array<{ unitId: string }>).map((row) => row.unitId));
  const reads = new Map<string, Set<string>>();
  for (const row of db.prepare('SELECT unitId, lessonId FROM textbook_lesson_reads WHERE learner = ? AND courseId = ?').all(learner, course.id) as Array<{ unitId: string; lessonId: string }>) {
    const set = reads.get(row.unitId) ?? new Set<string>();
    set.add(row.lessonId);
    reads.set(row.unitId, set);
  }
  const progress = new Map((db.prepare('SELECT * FROM textbook_unit_progress WHERE learner = ? AND courseId = ?').all(learner, course.id) as ProgressRow[]).map((row) => [row.unitId, row]));
  const rounds = new Map<string, RoundRow[]>();
  for (const row of db.prepare('SELECT * FROM textbook_test_rounds WHERE learner = ? AND courseId = ? ORDER BY id').all(learner, course.id) as RoundRow[]) {
    const list = rounds.get(row.unitId) ?? [];
    list.push(row);
    rounds.set(row.unitId, list);
  }
  const activeTests = new Map((db.prepare("SELECT unitId, id FROM textbook_test_sessions WHERE learner = ? AND courseId = ? AND status = 'active'").all(learner, course.id) as Array<{ unitId: string; id: string }>).map((row) => [row.unitId, row.id]));
  const activePractice = new Map((db.prepare("SELECT unitId, id, mode FROM textbook_practice_sessions WHERE learner = ? AND courseId = ? AND status = 'active'").all(learner, course.id) as Array<{ unitId: string; id: string; mode: 'normal' | 'targeted' }>).map((row) => [row.unitId, row]));
  const retakeDone = new Set((db.prepare("SELECT afterTestSessionId FROM textbook_practice_sessions WHERE learner = ? AND courseId = ? AND mode = 'targeted' AND status = 'completed' AND afterTestSessionId IS NOT NULL").all(learner, course.id) as Array<{ afterTestSessionId: string }>).map((row) => row.afterTestSessionId));

  const units = sortedUnits(course);
  const accessInputs: TextbookUnitAccessInput[] = units.map((unit) => ({
    id: unit.id,
    unitNumber: unit.number,
    published: isPublished(context, unit, publication.get(unit.id)),
    manualUnlock: unlocks.has(unit.id),
    testPassed: Boolean(progress.get(unit.id)?.firstPassedAt)
  }));
  const access = computeTextbookAccess(accessInputs);

  const states = units.map((unit, index): UnitState => {
    const unitProgress = progress.get(unit.id) ?? null;
    const unitRounds = rounds.get(unit.id) ?? [];
    const lastRound = unitRounds.at(-1) ?? null;
    const completed = [...(reads.get(unit.id) ?? [])];
    const requiredLessonIds = unit.lessons.filter((lesson) => lesson.required).map((lesson) => lesson.id);
    const retakePracticeCompleted = Boolean(lastRound && retakeDone.has(lastRound.sessionId));
    const unitAccess = access.get(unit.id)!;
    const facts: UnitProgressFacts = {
      accessible: unitAccess.accessible,
      requiredLessonIds,
      completedLessonIds: completed,
      practiceCompleted: Boolean(unitProgress?.practiceCompletedAt),
      activeTest: activeTests.has(unit.id),
      testPassed: Boolean(unitProgress?.firstPassedAt),
      lastTestFailed: Boolean(lastRound && lastRound.passed === 0),
      retakePracticeCompleted,
      retakePracticeRequired: course.settings.retakePracticeRequired
    };
    return {
      unit,
      published: accessInputs[index].published,
      publishedAt: publication.get(unit.id)?.publishedAt ?? null,
      manualUnlock: accessInputs[index].manualUnlock,
      access: unitAccess,
      completedLessonIds: completed,
      requiredLessonIds,
      progress: unitProgress,
      rounds: unitRounds,
      lastRound,
      activeTestSessionId: activeTests.get(unit.id) ?? null,
      activePracticeSessionId: activePractice.get(unit.id)?.id ?? null,
      activePracticeMode: activePractice.get(unit.id)?.mode ?? null,
      retakePracticeCompleted,
      facts,
      gates: computeUnitGates(facts)
    };
  });
  return { course, units: states, byId: new Map(states.map((state) => [state.unit.id, state])), accessInputs };
}

export function unitRef(unit: Pick<Unit, 'id' | 'number' | 'title'>): UnitRef {
  return { unitId: unit.id, number: unit.number, title: unit.title };
}

export function objectiveRef(objective: Pick<LearningObjective, 'id' | 'description' | 'required'>): ObjectiveRef {
  return { objectiveId: objective.id, description: objective.description, required: objective.required };
}

export function attemptSummaries(state: UnitState): TestAttemptSummary[] {
  return state.rounds.map((round) => ({
    attemptNumber: round.attemptNumber,
    sessionId: round.sessionId,
    submittedAt: round.submittedAt,
    correct: round.correct,
    total: round.total,
    passed: round.passed === 1,
    contentVersion: round.contentVersion
  }));
}

export function bestScore(state: UnitState): { correct: number; total: number } | null {
  let best: RoundRow | null = null;
  for (const round of state.rounds) {
    if (!best || round.correct * best.total > best.correct * round.total) best = round;
  }
  return best ? { correct: best.correct, total: best.total } : null;
}

// The next published unit after `unitId`, if it is open now.
export function nextOpenUnit(courseState: CourseState, unitId: string): UnitRef | null {
  const index = courseState.units.findIndex((state) => state.unit.id === unitId);
  const next = courseState.units.slice(index + 1).find((state) => state.published);
  return next && next.access.accessible ? unitRef(next.unit) : null;
}

// Did the pass recorded by `sessionId` (the unit's first pass) open the next
// unit? Replays the access rules without that pass, like vocabulary.
export function nextUnitOpenedBy(courseState: CourseState, unitId: string, sessionId: string): boolean {
  const state = courseState.byId.get(unitId);
  const next = nextOpenUnit(courseState, unitId);
  if (!state || !next || state.progress?.passedSessionId !== sessionId) return false;
  const beforePass = courseState.accessInputs.map((input) => input.id === unitId ? { ...input, testPassed: false } : input);
  return textbookUnitOpenedByPassing(beforePass, unitId) === next.unitId;
}

export function allVisiblePassed(courseState: CourseState): boolean {
  const visible = courseState.units.filter((state) => state.published);
  return visible.length > 0 && visible.every((state) => state.facts.testPassed);
}

export function parseObjectives(json: string): ObjectiveRef[] {
  try {
    const parsed = JSON.parse(json) as ObjectiveRef[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseIds(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

// Objectives missed in the most recent failed test, as that test saw them.
export function missedObjectivesOfLastFail(state: UnitState): ObjectiveRef[] {
  const round = state.lastRound;
  if (!round || round.passed === 1 || state.facts.testPassed) return [];
  const row = db.prepare('SELECT objectivesJson FROM textbook_test_sessions WHERE id = ?').get(round.sessionId) as { objectivesJson: string } | undefined;
  const refs = new Map(parseObjectives(row?.objectivesJson ?? '[]').map((ref) => [ref.objectiveId, ref]));
  const current = new Map(state.unit.objectives.map((objective) => [objective.id, objectiveRef(objective)]));
  return parseIds(round.missedObjectiveIdsJson)
    .map((id) => refs.get(id) ?? current.get(id) ?? { objectiveId: id, description: id, required: true });
}

export function ensureProgressRow(learner: TextbookLearner, courseId: string, unitId: string, now: string) {
  db.prepare(`
    INSERT INTO textbook_unit_progress (learner, courseId, unitId, updatedAt) VALUES (?, ?, ?, ?)
    ON CONFLICT(learner, courseId, unitId) DO NOTHING
  `).run(learner, courseId, unitId, now);
}
