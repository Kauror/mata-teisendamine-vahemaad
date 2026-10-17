// Practice ("Harjuta") as a pure, JSON-serialisable state machine over a
// frozen pool of practice-eligible questions (SPEC A3, D2).
//
// Rules:
//  - A run must satisfy a set of objectives: in 'normal' mode every required
//    objective of the unit; in 'targeted' mode (after a failed test) only the
//    objectives missed in that test.
//  - Only a CORRECT answer satisfies, and only the question's PRIMARY
//    objective. Related objectives never count.
//  - The planned queue covers every objective at least once and is topped up
//    round-robin to `practiceTarget` (normal) — targeted runs plan one question
//    per objective.
//  - After a wrong answer on an unsatisfied objective, if no later question on
//    it is already queued, one correction question is scheduled
//    CORRECTION_GAP positions later. It prefers, in order: an unseen question
//    from a different variant group, an unseen one from the same group, an
//    already seen one from a different group, any other question; least
//    asked / longest ago first. The question just answered is used again only
//    if the objective has no other question.
//  - A question never comes twice in a row (unless the whole pool holds a
//    single question): if it would, the next entry is swapped forward or a
//    spacer question is inserted.
//  - When an objective becomes satisfied its pending corrections are dropped;
//    planned questions stay.
//  - Complete ⇔ every objective satisfied AND the queue is empty.
//
// Termination: each answer removes one queue entry and a wrong answer adds at
// most one (correction) plus at most one spacer, and corrections exist only
// for unsatisfied objectives. So whenever the learner answers correctly from
// some point on, the run completes within (queue length + 2) answers; the
// queue is never empty while the run is incomplete (a safety net re-plans
// unsatisfied objectives), so there is always a next question. Property
// tests in practiceScheduler.test.ts check both.

import { seededRng, shuffleWithRng } from '@/lib/random';
import { TextbookRuleError } from '@/lib/textbook/errors';
import { gradeAnswer } from '@/lib/textbook/grading';
import { freezeQuestionWithSeed, type FrozenQuestion } from '@/lib/textbook/presentation';
import { seedFromString } from '@/lib/textbook/scoring';
import type { AnswerResponse, CourseSettings, Question, Unit } from '@/lib/textbook/types';

export const CORRECTION_GAP = 2;

export type PracticeMode = 'normal' | 'targeted';

export type PracticeQueueEntry = {
  questionId: string;
  objectiveId: string;
  reason: 'planned' | 'correction' | 'spacer';
};

export type PracticeAnswerRecord = {
  sequence: number;
  questionId: string;
  objectiveId: string;
  variantGroupId: string;
  correct: boolean;
  response: unknown;
};

export type PracticeState = {
  kind: 'practice';
  version: 1;
  mode: PracticeMode;
  courseId: string;
  unitId: string;
  contentVersion: string;
  seed: number;
  // Objectives this run must satisfy.
  objectiveIds: string[];
  // Objectives asked for (targeted) that had no practice question at all.
  skippedObjectiveIds: string[];
  // The frozen practice-eligible pool, with stored display order.
  pool: FrozenQuestion[];
  // queue[0] is the question on screen.
  queue: PracticeQueueEntry[];
  satisfiedObjectiveIds: string[];
  answers: PracticeAnswerRecord[];
  askCounts: Record<string, number>;
  lastAskedAt: Record<string, number>;
  completed: boolean;
};

export type PracticeFeedback = {
  questionId: string;
  correct: boolean;
  correctResponse: AnswerResponse;
  explanation: string;
  // Only after a wrong answer, when the question has one.
  misconception: string | null;
  objectiveId: string;
  objectiveSatisfied: boolean;
  newlySatisfied: boolean;
  correctionScheduled: boolean;
};

export type PracticeProgress = {
  answeredCount: number;
  correctCount: number;
  satisfiedCount: number;
  objectiveCount: number;
  remainingCount: number;
  completed: boolean;
};

export type CreatePracticeInput = {
  courseId: string;
  unit: Pick<Unit, 'id' | 'contentVersion' | 'objectives' | 'questions'>;
  settings: Pick<CourseSettings, 'practiceTarget'>;
  seed: number;
  mode?: PracticeMode;
  // Targeted mode: the objectives missed in the failed test.
  objectiveIds?: readonly string[];
  // Prefer not to plan these (e.g. the failed test's questions).
  avoidQuestionIds?: readonly string[];
};

function frozenById(state: Pick<PracticeState, 'pool'>, id: string): FrozenQuestion {
  const frozen = state.pool.find((item) => item.question.id === id);
  if (!frozen) throw new TextbookRuleError('invalid_state', 'Harjutuse küsimus puudub.');
  return frozen;
}

function practicePool(questions: readonly Question[]): Question[] {
  const seen = new Set<string>();
  return questions.filter((question) => {
    if (!question.eligibility.practice || seen.has(question.id)) return false;
    seen.add(question.id);
    return true;
  });
}

export function createPracticeState(input: CreatePracticeInput): PracticeState {
  const mode = input.mode ?? 'normal';
  const seed = input.seed >>> 0;
  const rng = seededRng(seed);
  const questions = practicePool(input.unit.questions);
  if (questions.length === 0) throw new TextbookRuleError('empty_pool', 'Selles õppetükis ei ole harjutusküsimusi.');
  const pool = questions.map((question) => freezeQuestionWithSeed(question, seedFromString(`${seed}:${question.id}`)));

  const wanted = mode === 'targeted'
    ? [...new Set(input.objectiveIds ?? [])]
    : input.unit.objectives.filter((objective) => objective.required).map((objective) => objective.id);
  const byObjective = new Map<string, Question[]>();
  for (const question of questions) {
    const list = byObjective.get(question.primaryObjectiveId) ?? [];
    list.push(question);
    byObjective.set(question.primaryObjectiveId, list);
  }
  const objectiveIds = wanted.filter((id) => (byObjective.get(id)?.length ?? 0) > 0);
  const skippedObjectiveIds = wanted.filter((id) => !objectiveIds.includes(id));
  if (mode === 'normal' && skippedObjectiveIds.length > 0) {
    throw new TextbookRuleError('empty_pool', 'Mõne õpieesmärgi jaoks ei ole harjutusküsimusi.');
  }

  const avoid = new Set(input.avoidQuestionIds ?? []);
  // Per objective: questions ordered by preference (not avoided first, then a
  // seeded shuffle).
  const ordered = new Map(objectiveIds.map((id) => {
    const shuffled = shuffleWithRng(rng, byObjective.get(id) ?? []);
    return [id, [...shuffled.filter((question) => !avoid.has(question.id)), ...shuffled.filter((question) => avoid.has(question.id))]];
  }));

  const planned: Question[] = [];
  const usedIds = new Set<string>();
  const usedGroups = new Set<string>();
  const takeFor = (objectiveId: string) => {
    const list = (ordered.get(objectiveId) ?? []).filter((question) => !usedIds.has(question.id));
    const pick = list.find((question) => !usedGroups.has(question.variantGroupId)) ?? list[0];
    if (!pick) return false;
    planned.push(pick);
    usedIds.add(pick.id);
    usedGroups.add(pick.variantGroupId);
    return true;
  };
  for (const id of objectiveIds) takeFor(id);
  if (mode === 'normal') {
    const target = Math.max(input.settings.practiceTarget, objectiveIds.length);
    const rotation = shuffleWithRng(rng, objectiveIds);
    let progressed = true;
    while (planned.length < target && progressed) {
      progressed = false;
      for (const id of rotation) {
        if (planned.length >= target) break;
        if (takeFor(id)) progressed = true;
      }
    }
  }

  const queue = spreadGroups(shuffleWithRng(rng, planned)).map<PracticeQueueEntry>((question) => ({
    questionId: question.id,
    objectiveId: question.primaryObjectiveId,
    reason: 'planned'
  }));

  return {
    kind: 'practice',
    version: 1,
    mode,
    courseId: input.courseId,
    unitId: input.unit.id,
    contentVersion: input.unit.contentVersion,
    seed,
    objectiveIds,
    skippedObjectiveIds,
    pool,
    queue,
    satisfiedObjectiveIds: [],
    answers: [],
    askCounts: {},
    lastAskedAt: {},
    completed: queue.length === 0
  };
}

// Reorder so that neighbours differ in variant group where possible (stable
// greedy pass).
function spreadGroups(questions: Question[]): Question[] {
  const rest = [...questions];
  const out: Question[] = [];
  while (rest.length > 0) {
    const previous = out[out.length - 1];
    const index = rest.findIndex((question) => !previous || question.variantGroupId !== previous.variantGroupId);
    out.push(rest.splice(index === -1 ? 0 : index, 1)[0]);
  }
  return out;
}

export function currentPracticeQuestion(state: PracticeState): FrozenQuestion | null {
  if (state.completed || state.queue.length === 0) return null;
  return frozenById(state, state.queue[0].questionId);
}

export function practiceProgress(state: PracticeState): PracticeProgress {
  return {
    answeredCount: state.answers.length,
    correctCount: state.answers.filter((answer) => answer.correct).length,
    satisfiedCount: state.satisfiedObjectiveIds.length,
    objectiveCount: state.objectiveIds.length,
    remainingCount: state.queue.length,
    completed: state.completed
  };
}

export function unresolvedObjectiveIds(state: PracticeState): string[] {
  return state.objectiveIds.filter((id) => !state.satisfiedObjectiveIds.includes(id));
}

// The best correction question for an objective after `justAnsweredId`.
function pickCorrection(state: PracticeState, objectiveId: string, justAnsweredId: string, queue: PracticeQueueEntry[]): FrozenQuestion | null {
  const justAnswered = frozenById(state, justAnsweredId).question;
  const all = state.pool.filter((item) => item.question.primaryObjectiveId === objectiveId);
  const others = all.filter((item) => item.question.id !== justAnsweredId);
  const candidates = others.length > 0 ? others : all;
  if (candidates.length === 0) return null;
  const pending = new Set(queue.map((entry) => entry.questionId));
  const tieRng = seededRng((state.seed + (state.answers.length + 1) * 7919) >>> 0);
  const tie = new Map(candidates.map((item) => [item.question.id, tieRng()]));
  const rank = (item: FrozenQuestion) => {
    const id = item.question.id;
    const seen = (state.askCounts[id] ?? 0) > 0 ? 1 : 0;
    const sameGroup = item.question.variantGroupId === justAnswered.variantGroupId ? 1 : 0;
    return [pending.has(id) ? 1 : 0, seen, sameGroup, state.askCounts[id] ?? 0, state.lastAskedAt[id] ?? -1, tie.get(id) ?? 0];
  };
  return [...candidates].sort((left, right) => {
    const a = rank(left);
    const b = rank(right);
    for (let index = 0; index < a.length; index++) if (a[index] !== b[index]) return a[index] - b[index];
    return 0;
  })[0];
}

function insertAt(queue: PracticeQueueEntry[], position: number, entry: PracticeQueueEntry) {
  const next = [...queue];
  let index = Math.min(Math.max(position, 0), next.length);
  // Never next to the same question.
  while (index < next.length && (next[index]?.questionId === entry.questionId || next[index - 1]?.questionId === entry.questionId)) index += 1;
  next.splice(index, 0, entry);
  return next;
}

// Answer the question on screen. Throws TextbookRuleError when the run is
// complete or `questionId` is not the current question (a stale tab).
export function recordPracticeAnswer(state: PracticeState, questionId: string, response: unknown): { state: PracticeState; feedback: PracticeFeedback } {
  if (state.completed) throw new TextbookRuleError('practice_completed', 'Harjutus on juba lõpetatud.');
  const current = state.queue[0];
  if (!current) throw new TextbookRuleError('invalid_state', 'Harjutuse järjekord on tühi.');
  if (current.questionId !== questionId) throw new TextbookRuleError('not_current_question', 'See küsimus ei ole praegu ekraanil.');

  const frozen = frozenById(state, questionId);
  const question = frozen.question;
  const grade = gradeAnswer(question, response);
  const sequence = state.answers.length;
  const objectiveId = question.primaryObjectiveId;
  const tracked = state.objectiveIds.includes(objectiveId);
  const wasSatisfied = state.satisfiedObjectiveIds.includes(objectiveId);

  let queue = state.queue.slice(1);
  let satisfied = state.satisfiedObjectiveIds;
  let correctionScheduled = false;
  const answers = [...state.answers, { sequence, questionId, objectiveId, variantGroupId: question.variantGroupId, correct: grade.correct, response }];
  const askCounts = { ...state.askCounts, [questionId]: (state.askCounts[questionId] ?? 0) + 1 };
  const lastAskedAt = { ...state.lastAskedAt, [questionId]: sequence };
  const working: PracticeState = { ...state, answers, askCounts, lastAskedAt };

  if (grade.correct && tracked && !wasSatisfied) {
    satisfied = [...satisfied, objectiveId];
    queue = queue.filter((entry) => !(entry.reason === 'correction' && entry.objectiveId === objectiveId));
  } else if (!grade.correct && tracked && !wasSatisfied && !queue.some((entry) => entry.objectiveId === objectiveId)) {
    const correction = pickCorrection(working, objectiveId, questionId, queue);
    if (correction) {
      queue = insertAt(queue, CORRECTION_GAP, { questionId: correction.question.id, objectiveId, reason: 'correction' });
    }
  }
  // What the child is told: this topic comes back later. True whether the
  // question was added just now or was already planned for the objective.
  correctionScheduled = !grade.correct && tracked && !wasSatisfied && queue.some((entry) => entry.objectiveId === objectiveId);

  // Safety net: an unsatisfied objective always has a queued question.
  for (const id of state.objectiveIds) {
    if (satisfied.includes(id) || queue.some((entry) => entry.objectiveId === id)) continue;
    const correction = pickCorrection(working, id, questionId, queue);
    if (correction) queue = insertAt(queue, queue.length, { questionId: correction.question.id, objectiveId: id, reason: 'correction' });
  }

  // Never the same question twice in a row.
  if (queue[0]?.questionId === questionId) {
    const swapIndex = queue.findIndex((entry) => entry.questionId !== questionId);
    if (swapIndex > 0) {
      const next = [...queue];
      [next[0], next[swapIndex]] = [next[swapIndex], next[0]];
      queue = next;
    } else {
      const spacer = [...state.pool]
        .filter((item) => item.question.id !== questionId)
        .sort((left, right) => (askCounts[left.question.id] ?? 0) - (askCounts[right.question.id] ?? 0) || (lastAskedAt[left.question.id] ?? -1) - (lastAskedAt[right.question.id] ?? -1))[0];
      if (spacer) queue = [{ questionId: spacer.question.id, objectiveId: spacer.question.primaryObjectiveId, reason: 'spacer' }, ...queue];
    }
  }

  const allSatisfied = state.objectiveIds.every((id) => satisfied.includes(id));
  const completed = allSatisfied && queue.length === 0;
  const nowSatisfied = satisfied.includes(objectiveId);
  return {
    state: { ...working, queue, satisfiedObjectiveIds: satisfied, completed },
    feedback: {
      questionId,
      correct: grade.correct,
      correctResponse: grade.correctResponse,
      explanation: question.explanation,
      misconception: !grade.correct && question.misconception ? question.misconception : null,
      objectiveId,
      objectiveSatisfied: nowSatisfied,
      newlySatisfied: nowSatisfied && !wasSatisfied,
      correctionScheduled
    }
  };
}

// Validate a stored state (from JSON) before resuming it.
export function parsePracticeState(raw: unknown): PracticeState {
  const state = (typeof raw === 'string' ? JSON.parse(raw) : raw) as Partial<PracticeState> | null;
  const ok = state !== null && typeof state === 'object'
    && state.kind === 'practice' && state.version === 1
    && Array.isArray(state.pool) && Array.isArray(state.queue) && Array.isArray(state.objectiveIds)
    && Array.isArray(state.satisfiedObjectiveIds) && Array.isArray(state.answers)
    && typeof state.askCounts === 'object' && typeof state.lastAskedAt === 'object' && typeof state.completed === 'boolean';
  if (!ok) throw new TextbookRuleError('invalid_state', 'Harjutuse olek on vigane.');
  const ids = new Set(state.pool!.map((item) => item.question.id));
  if (!state.queue!.every((entry) => ids.has(entry.questionId))) throw new TextbookRuleError('invalid_state', 'Harjutuse olek on vigane.');
  return state as PracticeState;
}
