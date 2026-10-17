import { describe, expect, it } from 'vitest';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { seededRng } from '@/lib/random';
import { fixtureQuestion, fixtureUnit, randomPool, settings } from '@/lib/textbook/testFixtures';
import {
  buildTestSnapshot,
  canBuildTest,
  historyFromSnapshots,
  retakeDiversity,
  TestBuildError,
  type TestSnapshot
} from '@/lib/textbook/testSelection';
import { COGNITIVE_LEVELS, type CourseSettings, type Question, type Unit } from '@/lib/textbook/types';

const course = textbookDemoCourse;

function assertStrict(snapshot: TestSnapshot, unit: Unit, config: CourseSettings) {
  const questions = snapshot.questions.map((frozen) => frozen.question);
  expect(questions).toHaveLength(config.testLength);
  expect(new Set(questions.map((question) => question.id)).size).toBe(config.testLength);
  expect(new Set(questions.map((question) => question.variantGroupId)).size).toBe(config.testLength);
  expect(questions.every((question) => question.eligibility.test)).toBe(true);
  for (const level of COGNITIVE_LEVELS) {
    expect(questions.filter((question) => question.cognitiveLevel === level)).toHaveLength(config.levelDistribution[level]);
  }
  const primaries = new Set(questions.map((question) => question.primaryObjectiveId));
  for (const objective of unit.objectives.filter((item) => item.required)) expect(primaries.has(objective.id)).toBe(true);
  expect(snapshot.relaxations).toEqual([]);
}

describe('buildTestSnapshot on the demo units', () => {
  for (const unit of course.units) {
    it(`${unit.id}: 20 unique questions and groups, 8/7/5, every required objective`, () => {
      for (let seed = 1; seed <= 40; seed++) {
        assertStrict(buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed }), unit, course.settings);
      }
    });
  }

  it('is deterministic for the same seed and history, different for another seed', () => {
    const unit = course.units[0];
    const a = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed: 7 });
    const b = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed: 7 });
    const c = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed: 8 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(JSON.stringify(a.questions.map((frozen) => [frozen.question.id, frozen.order]))).not.toBe(JSON.stringify(c.questions.map((frozen) => [frozen.question.id, frozen.order])));
    expect(a.requiredCorrect).toBe(19);
    expect(a.contentVersion).toBe(unit.contentVersion);
  });

  it('stores an explicit option order per question; ordering never starts solved', () => {
    for (const unit of course.units) {
      for (let seed = 1; seed <= 30; seed++) {
        const snapshot = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed });
        for (const frozen of snapshot.questions) {
          const answer = frozen.question.answer;
          if (answer.type === 'single_choice' || answer.type === 'multiple_selection') expect([...frozen.order.options!].sort()).toEqual(answer.options.map((item) => item.id).sort());
          if (answer.type === 'ordering') expect(frozen.order.items).not.toEqual(answer.correctOrder);
          if (answer.type === 'diagram_hotspot') expect(answer.regionIds?.length).toBeGreaterThan(1);
        }
      }
    }
  });

  it('dedupes variant groups that hold several questions', () => {
    const unit = course.units[0];
    const multiGroups = Object.entries(unit.questions.reduce<Record<string, number>>((acc, question) => {
      if (question.eligibility.test) acc[question.variantGroupId] = (acc[question.variantGroupId] ?? 0) + 1;
      return acc;
    }, {})).filter(([, count]) => count > 1).map(([id]) => id);
    expect(multiGroups.length).toBeGreaterThan(0);
    for (let seed = 1; seed <= 50; seed++) {
      const ids = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed }).questions.map((frozen) => frozen.question.variantGroupId);
      for (const groupId of multiGroups) expect(ids.filter((id) => id === groupId).length).toBeLessThanOrEqual(1);
    }
  });

  it('prefers groups not used in earlier attempts (as few repeats as the level quotas allow)', () => {
    for (const unit of course.units) {
      const first = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed: 3 });
      const second = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed: 4, history: historyFromSnapshots([first]) });
      assertStrict(second, unit, course.settings);
      // Lower bound: per level, the quota minus the fresh groups of that level.
      const used = new Set(first.questions.map((frozen) => frozen.question.variantGroupId));
      const levelOf = new Map(unit.questions.filter((question) => question.eligibility.test).map((question) => [question.variantGroupId, question.cognitiveLevel]));
      const bound = COGNITIVE_LEVELS.reduce((sum, level) => {
        const fresh = [...levelOf].filter(([groupId, groupLevel]) => groupLevel === level && !used.has(groupId)).length;
        return sum + Math.max(0, course.settings.levelDistribution[level] - fresh);
      }, 0);
      expect(second.reusedVariantGroupIds.length).toBe(bound);
      expect(second.reusedVariantGroupIds.length).toBeLessThan(course.settings.testLength / 2);
    }
  });

  it('does not share objects with the content (a frozen copy)', () => {
    const unit = structuredClone(course.units[0]);
    const snapshot = buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed: 11 });
    const before = JSON.stringify(snapshot);
    for (const question of unit.questions) {
      question.stem = 'MUUDETUD';
      if (question.answer.type === 'single_choice') question.answer.correctOptionId = 'muudetud';
    }
    expect(JSON.stringify(snapshot)).toBe(before);
  });
});

describe('adversarial pools', () => {
  it('level trap: a group usable for two levels is moved by an augmenting path', () => {
    const config = settings({ testLength: 2, levelDistribution: { factual: 1, understanding: 0, application: 1 } });
    // X can be factual or application, Y only factual. Greedy X→factual fails.
    const unit = fixtureUnit([
      fixtureQuestion({ id: 'x-f', objective: 'o1', group: 'x', level: 'factual' }),
      fixtureQuestion({ id: 'x-a', objective: 'o1', group: 'x', level: 'application' }),
      fixtureQuestion({ id: 'y-f', objective: 'o1', group: 'y', level: 'factual' })
    ], ['o1']);
    expect(canBuildTest(unit, config).ok).toBe(true);
    for (let seed = 0; seed < 50; seed++) {
      const ids = buildTestSnapshot({ courseId: 'c1', unit, settings: config, seed }).questions.map((frozen) => frozen.question.id).sort();
      expect(ids).toEqual(['x-a', 'y-f']);
    }
  });

  it('coverage trap: a shared group must go to the objective that has no other group', () => {
    const config = settings({ testLength: 3, levelDistribution: { factual: 3, understanding: 0, application: 0 } });
    const unit = fixtureUnit([
      fixtureQuestion({ id: 'g1-a', objective: 'a', group: 'g1' }),
      fixtureQuestion({ id: 'g1-b', objective: 'b', group: 'g1' }),
      fixtureQuestion({ id: 'g2-a', objective: 'a', group: 'g2' }),
      fixtureQuestion({ id: 'g3-c', objective: 'c', group: 'g3' }),
      fixtureQuestion({ id: 'g4-a', objective: 'a', group: 'g4' })
    ], ['a', 'b', 'c']);
    for (let seed = 0; seed < 50; seed++) {
      const snapshot = buildTestSnapshot({ courseId: 'c1', unit, settings: config, seed });
      expect(snapshot.relaxations).toEqual([]);
      expect(snapshot.questions.map((frozen) => frozen.question.id)).toContain('g1-b');
    }
  });

  it('impossible coverage is proven and the build falls back without breaking uniqueness', () => {
    const config = settings({ testLength: 4, levelDistribution: { factual: 4, understanding: 0, application: 0 } });
    // a, b and c all live only in groups g1 and g2.
    const unit = fixtureUnit([
      fixtureQuestion({ id: 'q1', objective: 'a', group: 'g1' }),
      fixtureQuestion({ id: 'q2', objective: 'b', group: 'g1' }),
      fixtureQuestion({ id: 'q3', objective: 'c', group: 'g2' }),
      fixtureQuestion({ id: 'q4', objective: 'a', group: 'g2' }),
      fixtureQuestion({ id: 'q5', objective: 'z', group: 'g3' }),
      fixtureQuestion({ id: 'q6', objective: 'z', group: 'g4' })
    ], ['a', 'b', 'c']);
    const check = canBuildTest(unit, config);
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.reason).toBe('objective_coverage');
    const snapshot = buildTestSnapshot({ courseId: 'c1', unit, settings: config, seed: 1 });
    expect(snapshot.relaxations).toContain('objective_coverage');
    expect(new Set(snapshot.questions.map((frozen) => frozen.question.variantGroupId)).size).toBe(4);
  });

  it('too few application groups → level_quota, relaxed test still has 20 distinct groups', () => {
    const questions: Question[] = [];
    for (let index = 0; index < 22; index++) questions.push(fixtureQuestion({ id: `f${index}`, objective: `o${index % 3}`, level: index < 12 ? 'factual' : 'understanding' }));
    for (let index = 0; index < 3; index++) questions.push(fixtureQuestion({ id: `a${index}`, objective: 'o0', level: 'application' }));
    const unit = fixtureUnit(questions, ['o0', 'o1', 'o2']);
    const check = canBuildTest(unit, settings());
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.reason).toBe('level_quota');
    const snapshot = buildTestSnapshot({ courseId: 'c1', unit, settings: settings(), seed: 5 });
    expect(snapshot.relaxations).toEqual(['level_quota']);
    expect(snapshot.levelCounts.application).toBe(3);
    expect(new Set(snapshot.questions.map((frozen) => frozen.question.variantGroupId)).size).toBe(20);
  });

  it('fewer distinct groups than the test length: no test at all', () => {
    const questions = Array.from({ length: 30 }, (_, index) => fixtureQuestion({ id: `q${index}`, objective: 'o1', group: `g${index % 15}` }));
    const unit = fixtureUnit(questions, ['o1']);
    const check = canBuildTest(unit, settings());
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.reason).toBe('too_few_groups');
    expect(() => buildTestSnapshot({ courseId: 'c1', unit, settings: settings(), seed: 1 })).toThrow(TestBuildError);
  });

  it('ignores practice-only questions and duplicate IDs', () => {
    const questions = Array.from({ length: 25 }, (_, index) => fixtureQuestion({ id: `q${index}`, objective: 'o1', test: index < 19 }));
    const unit = fixtureUnit([...questions, ...questions.slice(0, 5)], ['o1']);
    const check = canBuildTest(unit, settings({ levelDistribution: { factual: 20, understanding: 0, application: 0 } }));
    expect(check.ok).toBe(false);
    if (!check.ok) expect(check.reason).toBe('too_few_questions');
  });

  it('canBuildTest agrees with brute force on small random pools', () => {
    const config = settings({ testLength: 4, levelDistribution: { factual: 2, understanding: 1, application: 1 } });
    let feasible = 0;
    let infeasible = 0;
    for (let seed = 1; seed <= 300; seed++) {
      const rng = seededRng(seed);
      const objectives = ['a', 'b', 'c'].slice(0, 1 + Math.floor(rng() * 3));
      const pool = randomPool(rng, 4 + Math.floor(rng() * 5), objectives, { mixedLevels: true });
      const unit = fixtureUnit(pool, objectives);
      const expected = bruteForceFeasible(pool, objectives, config);
      const actual = canBuildTest(unit, config);
      expect(actual.ok, `seed ${seed}`).toBe(expected);
      if (expected) {
        feasible += 1;
        assertStrict(buildTestSnapshot({ courseId: 'c1', unit, settings: config, seed }), unit, config);
      } else infeasible += 1;
    }
    // The generator really produces both kinds.
    expect(feasible).toBeGreaterThan(30);
    expect(infeasible).toBeGreaterThan(30);
  });

  it('random larger pools: every buildable pool yields strict tests for any seed and history', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const rng = seededRng(seed * 31);
      const objectives = ['a', 'b', 'c', 'd', 'e'];
      const pool = randomPool(rng, 28 + Math.floor(rng() * 12), objectives, { mixedLevels: true });
      const unit = fixtureUnit(pool, objectives);
      const config = settings();
      if (!canBuildTest(unit, config).ok) continue;
      const first = buildTestSnapshot({ courseId: 'c1', unit, settings: config, seed });
      assertStrict(first, unit, config);
      const second = buildTestSnapshot({ courseId: 'c1', unit, settings: config, seed: seed + 1, history: historyFromSnapshots([first]) });
      assertStrict(second, unit, config);
    }
  });
});

function bruteForceFeasible(pool: Question[], objectives: string[], config: CourseSettings): boolean {
  const byGroup = new Map<string, Question[]>();
  for (const question of pool) byGroup.set(question.variantGroupId, [...(byGroup.get(question.variantGroupId) ?? []), question]);
  const groups = [...byGroup.values()];
  const n = config.testLength;
  const pick = (start: number, chosen: Question[]): boolean => {
    if (chosen.length === n) {
      const levelsOk = COGNITIVE_LEVELS.every((level) => chosen.filter((question) => question.cognitiveLevel === level).length === config.levelDistribution[level]);
      const covered = new Set(chosen.map((question) => question.primaryObjectiveId));
      return levelsOk && objectives.every((objective) => covered.has(objective));
    }
    for (let index = start; index < groups.length; index++) {
      for (const question of groups[index]) {
        if (pick(index + 1, [...chosen, question])) return true;
      }
    }
    return false;
  };
  return pick(0, []);
}

describe('retakeDiversity', () => {
  it('the demo units have enough distinct groups', () => {
    for (const unit of course.units) {
      const diversity = retakeDiversity(unit, course.settings);
      expect(diversity.sufficient).toBe(true);
      expect(diversity.distinctGroups).toBeGreaterThanOrEqual(30);
      expect(diversity.recommendedGroups).toBe(30);
    }
  });

  it('a pool with exactly 20 groups is buildable but reports full overlap', () => {
    const questions = Array.from({ length: 20 }, (_, index) => fixtureQuestion({ id: `q${index}`, objective: `o${index % 2}`, level: index < 8 ? 'factual' : index < 15 ? 'understanding' : 'application' }));
    const unit = fixtureUnit(questions, ['o0', 'o1']);
    expect(canBuildTest(unit, settings()).ok).toBe(true);
    const diversity = retakeDiversity(unit, settings());
    expect(diversity.sufficient).toBe(false);
    expect(diversity.secondAttemptOverlap).toBe(20);
  });
});
