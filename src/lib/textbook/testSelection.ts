// Deterministic, seeded selection of a final test from a frozen question pool.
//
// Hard constraints (never relaxed):
//  - exactly `testLength` questions, all test-eligible;
//  - unique question IDs and at most ONE question per variant group.
// Soft constraints (strict mode requires them; the fallback relaxes them, in
// this order, and records what it relaxed in `relaxations`):
//  1. every required objective is the PRIMARY objective of at least one
//     question ('objective_coverage');
//  2. the cognitive-level quotas of `levelDistribution` are met exactly
//     ('level_quota').
// Preference: groups/questions not used in earlier attempts first (fewest
// earlier uses), ties broken by the seed.
//
// Algorithm (strict):
//  a. Coverage — depth-first search with backtracking that assigns each
//     required objective a distinct variant group (and a level within the
//     quota), objectives with the fewest candidate groups first. Pruned by a
//     bipartite-matching check (the remaining objectives must still be
//     matchable to unused groups) and by memoising failed states.
//  b. Fill — the remaining level slots are a capacitated bipartite matching
//     between unused groups and levels (augmenting paths, groups tried in
//     preference order, so earlier-preferred groups stay matched: the greedy
//     basis of a transversal matroid). Greedy alone fails on pools where one
//     group could fill either of two levels; the augmenting path fixes that.
//  If a coverage assignment cannot be filled, the search backtracks. The
//  search is exhaustive, so a failure is a proof that no valid test exists
//  (unless the node limit is hit, reported as 'search_limit').
//
// Fallback (relaxed), used only when the strict search fails:
//  coverage = maximum bipartite matching objectives → groups (levels ignored);
//  fill = matching against the remaining quotas, then any unused groups.
//  Fails only when there are fewer distinct test-eligible variant groups than
//  `testLength` (TestBuildError 'too_few_groups').
//
// Final order and option order come from a second RNG stream of the seed and
// are stored in the snapshot (FrozenQuestion.order).

import { seededRng, shuffleWithRng, type RNG } from '@/lib/random';
import { freezeQuestion, type FrozenQuestion } from '@/lib/textbook/presentation';
import { requiredCorrect } from '@/lib/textbook/scoring';
import {
  COGNITIVE_LEVELS,
  type CognitiveLevel,
  type CourseSettings,
  type LevelDistribution,
  type Question,
  type Unit
} from '@/lib/textbook/types';

export type SelectionHistory = {
  // Every question / variant group used in earlier attempts of this unit (a
  // value may repeat: more uses = less preferred).
  questionIds: readonly string[];
  variantGroupIds: readonly string[];
};

export type TestRelaxation = 'objective_coverage' | 'level_quota';

export type SelectionUnit = Pick<Unit, 'id' | 'contentVersion' | 'objectives' | 'questions'>;

export type TestSelectionInput = {
  courseId: string;
  unit: SelectionUnit;
  settings: CourseSettings;
  seed: number;
  history?: SelectionHistory;
};

export type TestSnapshot = {
  kind: 'test';
  version: 1;
  courseId: string;
  unitId: string;
  contentVersion: string;
  seed: number;
  testLength: number;
  requiredCorrect: number;
  passNumerator: number;
  passDenominator: number;
  // In display order, with the frozen option order of each.
  questions: FrozenQuestion[];
  levelCounts: LevelDistribution;
  coveredObjectiveIds: string[];
  uncoveredObjectiveIds: string[];
  relaxations: TestRelaxation[];
  // Questions / groups that also appeared in an earlier attempt.
  reusedQuestionIds: string[];
  reusedVariantGroupIds: string[];
};

export type TestBuildFailure = 'too_few_questions' | 'too_few_groups';

export class TestBuildError extends Error {
  constructor(readonly code: TestBuildFailure, message: string) {
    super(message);
  }
}

const SEARCH_NODE_LIMIT = 200_000;

type Candidate = { groupId: string; level: CognitiveLevel; question: Question };

type Prepared = {
  testLength: number;
  quotas: LevelDistribution;
  requiredObjectiveIds: string[];
  // Groups in preference order.
  groupOrder: string[];
  groupRank: Map<string, number>;
  // Best question of each group per level (preference order inside).
  best: Map<string, Map<CognitiveLevel, Question>>;
  // Best question of each group per (objective, level).
  bestForObjective: Map<string, Map<string, Map<CognitiveLevel, Question>>>;
  questionRankKey: Map<string, number>;
};

function emptyLevels(): LevelDistribution {
  return { factual: 0, understanding: 0, application: 0 };
}

function countUses(values: readonly string[] | undefined) {
  const counts = new Map<string, number>();
  for (const value of values ?? []) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

// Test-eligible questions, first occurrence of each ID.
export function testEligiblePool(questions: readonly Question[]): Question[] {
  const seen = new Set<string>();
  const pool: Question[] = [];
  for (const question of questions) {
    if (!question.eligibility.test || seen.has(question.id)) continue;
    seen.add(question.id);
    pool.push(question);
  }
  return pool;
}

function prepare(unit: SelectionUnit, settings: CourseSettings, rng: RNG, history: SelectionHistory | undefined): Prepared {
  const pool = testEligiblePool(unit.questions);
  const questionUses = countUses(history?.questionIds);
  const groupUses = countUses(history?.variantGroupIds);

  // Random tie-breaks drawn in a fixed (sorted) order, so the result depends
  // only on the seed and the pool, not on authoring order quirks.
  const sortedQuestionIds = pool.map((question) => question.id).sort();
  const questionTie = new Map(sortedQuestionIds.map((id) => [id, rng()]));
  const groupIds = [...new Set(pool.map((question) => question.variantGroupId))].sort();
  const groupTie = new Map(groupIds.map((id) => [id, rng()]));

  const questionRankKey = new Map(pool.map((question) => [question.id, (questionUses.get(question.id) ?? 0) + (questionTie.get(question.id) ?? 0)]));
  const groupOrder = [...groupIds].sort((left, right) => {
    const byUse = (groupUses.get(left) ?? 0) - (groupUses.get(right) ?? 0);
    return byUse !== 0 ? byUse : (groupTie.get(left) ?? 0) - (groupTie.get(right) ?? 0);
  });
  const groupRank = new Map(groupOrder.map((id, index) => [id, index]));

  const better = (left: Question, right: Question | undefined) =>
    !right || (questionRankKey.get(left.id) ?? 0) < (questionRankKey.get(right.id) ?? 0);

  const best = new Map<string, Map<CognitiveLevel, Question>>();
  const bestForObjective = new Map<string, Map<string, Map<CognitiveLevel, Question>>>();
  for (const question of pool) {
    const byLevel = best.get(question.variantGroupId) ?? new Map<CognitiveLevel, Question>();
    if (better(question, byLevel.get(question.cognitiveLevel))) byLevel.set(question.cognitiveLevel, question);
    best.set(question.variantGroupId, byLevel);

    const byGroup = bestForObjective.get(question.primaryObjectiveId) ?? new Map<string, Map<CognitiveLevel, Question>>();
    const objectiveLevels = byGroup.get(question.variantGroupId) ?? new Map<CognitiveLevel, Question>();
    if (better(question, objectiveLevels.get(question.cognitiveLevel))) objectiveLevels.set(question.cognitiveLevel, question);
    byGroup.set(question.variantGroupId, objectiveLevels);
    bestForObjective.set(question.primaryObjectiveId, byGroup);
  }

  return {
    testLength: settings.testLength,
    quotas: { ...settings.levelDistribution },
    requiredObjectiveIds: unit.objectives.filter((objective) => objective.required).map((objective) => objective.id),
    groupOrder,
    groupRank,
    best,
    bestForObjective,
    questionRankKey
  };
}

function candidatesFor(prepared: Prepared, objectiveId: string): Candidate[] {
  const byGroup = prepared.bestForObjective.get(objectiveId);
  if (!byGroup) return [];
  const list: Candidate[] = [];
  for (const [groupId, levels] of byGroup) {
    for (const [level, question] of levels) list.push({ groupId, level, question });
  }
  return list.sort((left, right) => {
    const byGroup = (prepared.groupRank.get(left.groupId) ?? 0) - (prepared.groupRank.get(right.groupId) ?? 0);
    if (byGroup !== 0) return byGroup;
    return (prepared.questionRankKey.get(left.question.id) ?? 0) - (prepared.questionRankKey.get(right.question.id) ?? 0);
  });
}

// Maximum bipartite matching (Kuhn) of `lefts` to distinct groups. Returns
// left → group for the matched lefts.
function matchToGroups(lefts: readonly string[], edges: (left: string) => readonly string[], blocked: ReadonlySet<string>) {
  const owner = new Map<string, string>(); // group → left
  const assigned = new Map<string, string>(); // left → group
  const tryLeft = (left: string, seen: Set<string>): boolean => {
    for (const group of edges(left)) {
      if (blocked.has(group) || seen.has(group)) continue;
      seen.add(group);
      const current = owner.get(group);
      if (current === undefined || tryLeft(current, seen)) {
        owner.set(group, left);
        assigned.set(left, group);
        return true;
      }
    }
    return false;
  };
  for (const left of lefts) tryLeft(left, new Set());
  return assigned;
}

// Capacitated matching of unused groups to level slots. `capacity` = slots
// still open per level. Groups are tried in preference order. Returns group →
// level for the matched groups.
function fillLevels(prepared: Prepared, used: ReadonlySet<string>, capacity: LevelDistribution) {
  const assignment = new Map<string, CognitiveLevel>();
  const holders: Record<CognitiveLevel, string[]> = { factual: [], understanding: [], application: [] };
  const needed = COGNITIVE_LEVELS.reduce((sum, level) => sum + Math.max(0, capacity[level]), 0);
  const levelsOf = (groupId: string) => {
    const levels = prepared.best.get(groupId);
    if (!levels) return [];
    return [...levels.entries()]
      .sort(([, left], [, right]) => (prepared.questionRankKey.get(left.id) ?? 0) - (prepared.questionRankKey.get(right.id) ?? 0))
      .map(([level]) => level);
  };
  const tryGroup = (groupId: string, seen: Set<CognitiveLevel>): boolean => {
    for (const level of levelsOf(groupId)) {
      if (seen.has(level)) continue;
      seen.add(level);
      if (holders[level].length < capacity[level]) {
        holders[level].push(groupId);
        assignment.set(groupId, level);
        return true;
      }
      for (const holder of [...holders[level]]) {
        if (tryGroup(holder, seen)) {
          holders[level] = holders[level].filter((id) => id !== holder);
          holders[level].push(groupId);
          assignment.set(groupId, level);
          return true;
        }
      }
    }
    return false;
  };
  for (const groupId of prepared.groupOrder) {
    if (assignment.size >= needed) break;
    if (used.has(groupId)) continue;
    tryGroup(groupId, new Set());
  }
  return { assignment, complete: assignment.size >= needed };
}

type Plan = { picks: Question[] };
type StrictOutcome = { plan: Plan | null; searchLimitHit: boolean };

function strictPlan(prepared: Prepared): StrictOutcome {
  const { quotas, testLength } = prepared;
  const quotaSum = COGNITIVE_LEVELS.reduce((sum, level) => sum + quotas[level], 0);
  if (quotaSum !== testLength || prepared.requiredObjectiveIds.length > testLength) return { plan: null, searchLimitHit: false };
  if (prepared.groupOrder.length < testLength) return { plan: null, searchLimitHit: false };

  const candidates = new Map(prepared.requiredObjectiveIds.map((id) => [id, candidatesFor(prepared, id)]));
  const objectives = [...prepared.requiredObjectiveIds].sort((left, right) => {
    const groupsOf = (id: string) => new Set((candidates.get(id) ?? []).map((candidate) => candidate.groupId)).size;
    return groupsOf(left) - groupsOf(right) || (left < right ? -1 : left > right ? 1 : 0);
  });
  const groupEdges = new Map(objectives.map((id) => [id, [...new Set((candidates.get(id) ?? []).map((candidate) => candidate.groupId))]]));

  const used = new Set<string>();
  const levels = emptyLevels();
  const picks: Question[] = [];
  const failed = new Set<string>();
  let nodes = 0;
  let limitHit = false;

  const stateKey = (index: number) => `${index}|${levels.factual},${levels.understanding},${levels.application}|${[...used].sort().join(',')}`;

  const search = (index: number): Plan | null => {
    if (++nodes > SEARCH_NODE_LIMIT) {
      limitHit = true;
      return null;
    }
    if (index === objectives.length) {
      const capacity: LevelDistribution = {
        factual: quotas.factual - levels.factual,
        understanding: quotas.understanding - levels.understanding,
        application: quotas.application - levels.application
      };
      const fill = fillLevels(prepared, used, capacity);
      if (!fill.complete) return null;
      const filled = [...fill.assignment.entries()].map(([groupId, level]) => prepared.best.get(groupId)!.get(level)!);
      return { picks: [...picks, ...filled] };
    }
    const key = stateKey(index);
    if (failed.has(key)) return null;
    // Prune: the remaining objectives must still be matchable to distinct
    // unused groups.
    const rest = objectives.slice(index);
    if (matchToGroups(rest, (id) => groupEdges.get(id) ?? [], used).size < rest.length) {
      failed.add(key);
      return null;
    }
    const objectiveId = objectives[index];
    for (const candidate of candidates.get(objectiveId) ?? []) {
      if (used.has(candidate.groupId) || levels[candidate.level] >= quotas[candidate.level]) continue;
      used.add(candidate.groupId);
      levels[candidate.level] += 1;
      picks.push(candidate.question);
      const plan = search(index + 1);
      if (plan) return plan;
      picks.pop();
      levels[candidate.level] -= 1;
      used.delete(candidate.groupId);
      if (limitHit) return null;
    }
    failed.add(key);
    return null;
  };

  const plan = search(0);
  return { plan, searchLimitHit: limitHit };
}

function relaxedPlan(prepared: Prepared): Plan {
  const { testLength, quotas } = prepared;
  const candidates = new Map(prepared.requiredObjectiveIds.map((id) => [id, candidatesFor(prepared, id)]));
  const groupEdges = (id: string) => [...new Set((candidates.get(id) ?? []).map((candidate) => candidate.groupId))];
  const objectives = prepared.requiredObjectiveIds.slice(0, testLength);
  const matched = matchToGroups(objectives, groupEdges, new Set());

  const used = new Set<string>();
  const levels = emptyLevels();
  const picks: Question[] = [];
  for (const objectiveId of objectives) {
    const groupId = matched.get(objectiveId);
    if (!groupId) continue;
    // Within the matched group, the preferred level that still has quota room.
    const options = (candidates.get(objectiveId) ?? []).filter((candidate) => candidate.groupId === groupId);
    const pick = options.find((candidate) => levels[candidate.level] < quotas[candidate.level]) ?? options[0];
    used.add(groupId);
    levels[pick.level] += 1;
    picks.push(pick.question);
  }

  const capacity: LevelDistribution = {
    factual: Math.max(0, quotas.factual - levels.factual),
    understanding: Math.max(0, quotas.understanding - levels.understanding),
    application: Math.max(0, quotas.application - levels.application)
  };
  const fill = fillLevels(prepared, used, capacity);
  for (const [groupId, level] of fill.assignment) {
    if (picks.length >= testLength) break;
    used.add(groupId);
    picks.push(prepared.best.get(groupId)!.get(level)!);
  }
  // Any remaining slots: any unused group, its preferred question.
  for (const groupId of prepared.groupOrder) {
    if (picks.length >= testLength) break;
    if (used.has(groupId)) continue;
    const options = [...(prepared.best.get(groupId)?.values() ?? [])]
      .sort((left, right) => (prepared.questionRankKey.get(left.id) ?? 0) - (prepared.questionRankKey.get(right.id) ?? 0));
    if (options.length === 0) continue;
    used.add(groupId);
    picks.push(options[0]);
  }
  return { picks };
}

export type TestSelection = {
  questions: Question[];
  relaxations: TestRelaxation[];
  levelCounts: LevelDistribution;
  coveredObjectiveIds: string[];
  uncoveredObjectiveIds: string[];
  searchLimitHit: boolean;
};

function describe(prepared: Prepared, picks: Question[], searchLimitHit: boolean): TestSelection {
  const levelCounts = emptyLevels();
  for (const question of picks) levelCounts[question.cognitiveLevel] += 1;
  const primaries = new Set(picks.map((question) => question.primaryObjectiveId));
  const coveredObjectiveIds = prepared.requiredObjectiveIds.filter((id) => primaries.has(id));
  const uncoveredObjectiveIds = prepared.requiredObjectiveIds.filter((id) => !primaries.has(id));
  const relaxations: TestRelaxation[] = [];
  if (uncoveredObjectiveIds.length > 0) relaxations.push('objective_coverage');
  if (COGNITIVE_LEVELS.some((level) => levelCounts[level] !== prepared.quotas[level])) relaxations.push('level_quota');
  return { questions: picks, relaxations, levelCounts, coveredObjectiveIds, uncoveredObjectiveIds, searchLimitHit };
}

function assertBuildable(prepared: Prepared, unit: SelectionUnit) {
  const pool = testEligiblePool(unit.questions);
  if (pool.length < prepared.testLength) {
    throw new TestBuildError('too_few_questions', `Unit ${unit.id} has ${pool.length} test-eligible questions; ${prepared.testLength} are needed.`);
  }
  if (prepared.groupOrder.length < prepared.testLength) {
    throw new TestBuildError('too_few_groups', `Unit ${unit.id} has ${prepared.groupOrder.length} test-eligible variant groups; ${prepared.testLength} are needed.`);
  }
}

// The selected questions, unordered and unfrozen. Throws TestBuildError when
// not even a relaxed test is possible.
export function selectTestQuestions(input: TestSelectionInput): TestSelection {
  const prepared = prepare(input.unit, input.settings, seededRng(input.seed >>> 0), input.history);
  assertBuildable(prepared, input.unit);
  const strict = strictPlan(prepared);
  if (strict.plan) return describe(prepared, strict.plan.picks, false);
  return describe(prepared, relaxedPlan(prepared).picks, strict.searchLimitHit);
}

const ORDER_SALT = 0x9e3779b9;

// The full frozen test: questions in display order, each with its own stored
// option order and a deep copy of its key. Deterministic for (pool, settings,
// seed, history).
export function buildTestSnapshot(input: TestSelectionInput): TestSnapshot {
  const selection = selectTestQuestions(input);
  const orderRng = seededRng((input.seed ^ ORDER_SALT) >>> 0);
  const ordered = shuffleWithRng(orderRng, selection.questions);
  const questions = ordered.map((question) => freezeQuestion(question, orderRng));
  const usedQuestions = new Set(input.history?.questionIds ?? []);
  const usedGroups = new Set(input.history?.variantGroupIds ?? []);
  return {
    kind: 'test',
    version: 1,
    courseId: input.courseId,
    unitId: input.unit.id,
    contentVersion: input.unit.contentVersion,
    seed: input.seed >>> 0,
    testLength: input.settings.testLength,
    requiredCorrect: requiredCorrect(input.settings.testLength, input.settings),
    passNumerator: input.settings.passNumerator,
    passDenominator: input.settings.passDenominator,
    questions,
    levelCounts: selection.levelCounts,
    coveredObjectiveIds: selection.coveredObjectiveIds,
    uncoveredObjectiveIds: selection.uncoveredObjectiveIds,
    relaxations: selection.relaxations,
    reusedQuestionIds: ordered.filter((question) => usedQuestions.has(question.id)).map((question) => question.id),
    reusedVariantGroupIds: ordered.filter((question) => usedGroups.has(question.variantGroupId)).map((question) => question.variantGroupId)
  };
}

// History from earlier snapshots of the same unit.
export function historyFromSnapshots(snapshots: ReadonlyArray<Pick<TestSnapshot, 'questions'>>): SelectionHistory {
  const questionIds: string[] = [];
  const variantGroupIds: string[] = [];
  for (const snapshot of snapshots) {
    for (const frozen of snapshot.questions) {
      questionIds.push(frozen.question.id);
      variantGroupIds.push(frozen.question.variantGroupId);
    }
  }
  return { questionIds, variantGroupIds };
}

/* ------------------------------------------------------------ validation */

export type TestBuildability =
  | { ok: true; levelCounts: LevelDistribution }
  | {
      ok: false;
      // Why a strict test (full coverage + exact quotas) cannot be built.
      reason: 'too_few_questions' | 'too_few_groups' | 'bad_distribution' | 'too_many_objectives' | 'objective_coverage' | 'level_quota' | 'search_limit';
      testEligibleQuestions: number;
      distinctGroups: number;
      uncoveredObjectiveIds: string[];
      levelCounts: LevelDistribution | null;
    };

// Whether at least one valid strict test exists (A2: publication fails if not).
// The search is exhaustive, so `ok: false` is a proof, except 'search_limit'.
export function canBuildTest(unit: SelectionUnit, settings: CourseSettings): TestBuildability {
  const prepared = prepare(unit, settings, seededRng(1), undefined);
  const pool = testEligiblePool(unit.questions);
  const base = { testEligibleQuestions: pool.length, distinctGroups: prepared.groupOrder.length, uncoveredObjectiveIds: [] as string[], levelCounts: null };
  const quotaSum = COGNITIVE_LEVELS.reduce((sum, level) => sum + settings.levelDistribution[level], 0);
  if (quotaSum !== settings.testLength || COGNITIVE_LEVELS.some((level) => !Number.isInteger(settings.levelDistribution[level]) || settings.levelDistribution[level] < 0)) {
    return { ok: false, reason: 'bad_distribution', ...base };
  }
  if (pool.length < settings.testLength) return { ok: false, reason: 'too_few_questions', ...base };
  if (prepared.groupOrder.length < settings.testLength) return { ok: false, reason: 'too_few_groups', ...base };
  if (prepared.requiredObjectiveIds.length > settings.testLength) return { ok: false, reason: 'too_many_objectives', ...base };
  const strict = strictPlan(prepared);
  if (strict.plan) return { ok: true, levelCounts: describe(prepared, strict.plan.picks, false).levelCounts };
  const relaxed = describe(prepared, relaxedPlan(prepared).picks, strict.searchLimitHit);
  const reason = strict.searchLimitHit ? 'search_limit' : relaxed.uncoveredObjectiveIds.length > 0 ? 'objective_coverage' : 'level_quota';
  return { ok: false, reason, ...base, uncoveredObjectiveIds: relaxed.uncoveredObjectiveIds, levelCounts: relaxed.levelCounts };
}

export type RetakeDiversity = {
  distinctGroups: number;
  testLength: number;
  // ceil(1.5 × testLength): enough groups for a clearly different retake.
  recommendedGroups: number;
  // Groups the second attempt shares with the first (built with history).
  secondAttemptOverlap: number;
  // Variant groups per required objective among test-eligible questions.
  groupsPerObjective: Record<string, number>;
  // A warning, never a blocker (A2).
  sufficient: boolean;
};

export function retakeDiversity(unit: SelectionUnit, settings: CourseSettings): RetakeDiversity {
  const pool = testEligiblePool(unit.questions);
  const distinctGroups = new Set(pool.map((question) => question.variantGroupId)).size;
  const recommendedGroups = Math.floor((settings.testLength * 3 + 1) / 2);
  const groupsPerObjective: Record<string, number> = {};
  for (const objective of unit.objectives.filter((item) => item.required)) {
    groupsPerObjective[objective.id] = new Set(pool.filter((question) => question.primaryObjectiveId === objective.id).map((question) => question.variantGroupId)).size;
  }
  let secondAttemptOverlap = settings.testLength;
  try {
    const first = buildTestSnapshot({ courseId: '', unit, settings, seed: 1 });
    const second = buildTestSnapshot({ courseId: '', unit, settings, seed: 2, history: historyFromSnapshots([first]) });
    secondAttemptOverlap = second.reusedVariantGroupIds.length;
  } catch (error) {
    if (!(error instanceof TestBuildError)) throw error;
  }
  return {
    distinctGroups,
    testLength: settings.testLength,
    recommendedGroups,
    secondAttemptOverlap,
    groupsPerObjective,
    sufficient: distinctGroups >= recommendedGroups && Object.values(groupsPerObjective).every((count) => count >= 2)
  };
}
