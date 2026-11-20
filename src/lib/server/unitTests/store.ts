import { createHash, randomInt, randomUUID } from 'node:crypto';
import db from '@/lib/db';
import { isoToAppDate } from '@/lib/appDate';
import { hasActiveLearningExercise } from '@/lib/learningExercises';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { nowIso, type Learner } from '@/lib/tasks';
import { ensureCurrentRewardPolicy, REWARD_ENGINE_VERSION } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2, getProjectedRewardV2 } from '@/lib/server/rewards/projection';
import { getUnit, listUnits, progressRows, unitAccessFor, type UnitRow } from '@/lib/server/vocabulary/units';
import { vocabUnitLabel, VOCAB_EXERCISE_ID, VOCAB_SUBJECT } from '@/lib/vocabulary/constants';
import { toClientUnitTest, type ClientUnitTest } from '@/lib/unitTests/clientView';
import { cellKey, entryCells, entryKey, layoutCrossword } from '@/lib/unitTests/crossword';
import { autoMarks, buildSlots, crosswordCellAnswerKey, isMark, MAX_SLOT_ANSWER_LENGTH, scoreMarks, slotAnswer, type Score } from '@/lib/unitTests/grading';
import type { AnswerSlot, Answers, Mark, Marks, UnitTestContent } from '@/lib/unitTests/types';
import { parseUnitTestContent, UnitTestContentError } from '@/lib/unitTests/validate';

// English unit tests (lisatestid): import, the child's attempt and the
// parent's review. Every write is one SQLite transaction. The content an
// attempt was started on is copied into the attempt, so re-importing a file
// never changes an answered test. See docs/english-unit-tests.md.

export const UNIT_TEST_TOPIC = 'lisatest';
export const UNIT_TEST_CATEGORY = 'Inglise keel - kontrolltöö';
export const UNIT_TEST_RUNNER_ID = 'kiur-english-unit-test';
export const UNIT_TEST_RUNNER_VERSION = 'english-unit-test-v1';
export const UNIT_TEST_GENERATOR_VERSION = 'english-unit-test-2026-11';
const MAX_COMMENT_LENGTH = 1000;

export class UnitTestNotFoundError extends Error {}
export class UnitTestForbiddenError extends Error {}
export class UnitTestConflictError extends Error {}
export class UnitTestValidationError extends Error {}
export class UnitTestStaleError extends Error {
  constructor(message: string, readonly payload: unknown) {
    super(message);
  }
}
export { UnitTestContentError };

type VariantRow = {
  unitNumber: number;
  variant: 'A' | 'B';
  title: string;
  contentJson: string;
  contentHash: string;
  active: number;
  importedAt: string;
  updatedAt: string;
};

type AttemptRow = {
  id: string;
  learner: Learner;
  unitId: string;
  unitNumber: number;
  variant: 'A' | 'B';
  contentHash: string;
  contentJson: string;
  status: 'in_progress' | 'submitted' | 'returned' | 'approved';
  answersJson: string;
  marksJson: string;
  parentComment: string | null;
  revision: number;
  submissions: number;
  earned: number | null;
  total: number | null;
  grade: number | null;
  passed: number | null;
  attemptId: number | null;
  startedAt: string;
  submittedAt: string | null;
  returnedAt: string | null;
  approvedAt: string | null;
  updatedAt: string;
};

const parseJson = <T>(value: string, fallback: T): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

function contentOf(row: { contentJson: string }) {
  return JSON.parse(row.contentJson) as UnitTestContent;
}

function safeContentOf(row: { contentJson: string }) {
  try {
    return contentOf(row);
  } catch {
    return null;
  }
}

function hashContent(content: UnitTestContent) {
  return createHash('sha256').update(JSON.stringify(content)).digest('hex').slice(0, 16);
}

function totalPoints(content: UnitTestContent) {
  return buildSlots(content).reduce((sum, slot) => sum + slot.points, 0);
}

/* ------------------------------------------------------------ content */

export type ImportResult = { unit: number; variant: 'A' | 'B'; title: string; status: 'added' | 'updated' | 'unchanged'; points: number };

// Imports one or more files at once. Every file is validated before anything
// is written: one bad file blocks the whole import, so the parent never ends
// up with half a batch.
export function importUnitTests(files: Array<{ name: string; data: unknown }>): ImportResult[] {
  if (files.length === 0) throw new UnitTestValidationError('Vali vähemalt üks fail.');
  if (files.length > 60) throw new UnitTestValidationError('Korraga saab importida kuni 60 faili.');
  const parsed: UnitTestContent[] = [];
  const problems: string[] = [];
  const seen = new Set<string>();
  for (const file of files) {
    try {
      const content = parseUnitTestContent(file.data);
      const key = `${content.unit}${content.variant}`;
      if (seen.has(key)) problems.push(`${file.name}: test ${key} on valikus mitu korda.`);
      seen.add(key);
      parsed.push(content);
    } catch (error) {
      if (error instanceof UnitTestContentError) problems.push(`${file.name}: ${error.problems.slice(0, 5).join(' ')}`);
      else throw error;
    }
  }
  if (problems.length > 0) throw new UnitTestValidationError(problems.slice(0, 10).join(' \n'));
  const now = nowIso();
  return db.transaction(() => parsed.map((content): ImportResult => {
    const hash = hashContent(content);
    const existing = db.prepare('SELECT contentHash FROM english_unit_test_variants WHERE unitNumber = ? AND variant = ?').get(content.unit, content.variant) as { contentHash: string } | undefined;
    const status = !existing ? 'added' : existing.contentHash === hash ? 'unchanged' : 'updated';
    if (status !== 'unchanged') {
      db.prepare(`
        INSERT INTO english_unit_test_variants (unitNumber, variant, title, contentJson, contentHash, active, importedAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, 1, ?, ?)
        ON CONFLICT(unitNumber, variant) DO UPDATE SET title = excluded.title, contentJson = excluded.contentJson,
          contentHash = excluded.contentHash, importedAt = excluded.importedAt, updatedAt = excluded.updatedAt
      `).run(content.unit, content.variant, content.title, JSON.stringify(content), hash, now, now);
    }
    return { unit: content.unit, variant: content.variant, title: content.title, status, points: totalPoints(content) };
  }))();
}

export type ParentVariantSummary = {
  unitNumber: number;
  variant: 'A' | 'B';
  title: string;
  active: boolean;
  points: number;
  exerciseCount: number;
  parentChecked: number;
  importedAt: string;
  vocabUnitLabel: string | null;
  attempts: number;
};

export function listVariants(): ParentVariantSummary[] {
  const units = new Map(listUnits().map((unit) => [unit.unitNumber, unit]));
  const counts = new Map((db.prepare('SELECT unitNumber, variant, COUNT(*) AS count FROM english_unit_test_attempts GROUP BY unitNumber, variant').all() as Array<{ unitNumber: number; variant: string; count: number }>)
    .map((row) => [`${row.unitNumber}${row.variant}`, row.count]));
  const rows = db.prepare('SELECT * FROM english_unit_test_variants ORDER BY unitNumber, variant').all() as VariantRow[];
  return rows.map((row) => {
    const content = contentOf(row);
    const slots = buildSlots(content);
    const unit = units.get(row.unitNumber);
    return {
      unitNumber: row.unitNumber,
      variant: row.variant,
      title: row.title,
      active: Boolean(row.active),
      points: slots.reduce((sum, slot) => sum + slot.points, 0),
      exerciseCount: content.exercises.length,
      parentChecked: slots.filter((slot) => slot.check === 'parent').length,
      importedAt: row.importedAt,
      vocabUnitLabel: unit ? vocabUnitLabel(unit) : null,
      attempts: counts.get(`${row.unitNumber}${row.variant}`) ?? 0
    };
  });
}

function variantRow(unitNumber: number, variant: string) {
  const row = db.prepare('SELECT * FROM english_unit_test_variants WHERE unitNumber = ? AND variant = ?').get(unitNumber, variant) as VariantRow | undefined;
  if (!row) throw new UnitTestNotFoundError('Kontrolltööd ei leitud.');
  return row;
}

export function setVariantActive(unitNumber: number, variant: string, active: boolean) {
  variantRow(unitNumber, variant);
  db.prepare('UPDATE english_unit_test_variants SET active = ?, updatedAt = ? WHERE unitNumber = ? AND variant = ?').run(active ? 1 : 0, nowIso(), unitNumber, variant);
}

// Started tests keep their own copy of the content, so deleting a variant
// never breaks one.
export function deleteVariant(unitNumber: number, variant: string) {
  variantRow(unitNumber, variant);
  db.prepare('DELETE FROM english_unit_test_variants WHERE unitNumber = ? AND variant = ?').run(unitNumber, variant);
}

// The parent's preview of an imported variant, answers included.
export function variantPreview(unitNumber: number, variant: string) {
  const row = variantRow(unitNumber, variant);
  const content = contentOf(row);
  return { content, test: toClientUnitTest(content), slots: buildSlots(content), active: Boolean(row.active) };
}

/* -------------------------------------------------------------- child */

export type ChildUnitTestState = 'available' | 'in_progress' | 'submitted' | 'returned' | 'passed' | 'retake';

export type ChildUnitTestStatus = {
  state: ChildUnitTestState;
  attemptId: string | null;
  grade: number | null;
};

function activeVariants(unitNumber: number) {
  return db.prepare('SELECT * FROM english_unit_test_variants WHERE unitNumber = ? AND active = 1 ORDER BY variant').all(unitNumber) as VariantRow[];
}

function latestAttempt(learner: Learner, unitId: string) {
  return db.prepare(`
    SELECT * FROM english_unit_test_attempts WHERE learner = ? AND unitId = ?
    ORDER BY CASE WHEN status = 'approved' THEN 1 ELSE 0 END, COALESCE(approvedAt, startedAt) DESC, rowid DESC LIMIT 1
  `).get(learner, unitId) as AttemptRow | undefined;
}

function hasPassed(learner: Learner, unitId: string) {
  return Boolean(db.prepare("SELECT 1 FROM english_unit_test_attempts WHERE learner = ? AND unitId = ? AND status = 'approved' AND passed = 1").get(learner, unitId));
}

// The unit-test state of every unit the child can see. A unit has no state
// (absent from the map) until its words test is passed and a variant exists.
export function childUnitTestStatuses(learner: Learner, units: UnitRow[] = listUnits()): Map<string, ChildUnitTestStatus> {
  const result = new Map<string, ChildUnitTestStatus>();
  if (!hasActiveLearningExercise(learner, VOCAB_EXERCISE_ID)) return result;
  const progress = progressRows(learner);
  const access = unitAccessFor(learner, units, undefined, progress);
  const withVariants = new Set((db.prepare('SELECT DISTINCT unitNumber FROM english_unit_test_variants WHERE active = 1').all() as Array<{ unitNumber: number }>).map((row) => row.unitNumber));
  for (const unit of units) {
    const latest = latestAttempt(learner, unit.id);
    const open = latest && latest.status !== 'approved';
    const eligible = access.get(unit.id)?.accessible && progress.get(unit.id)?.testPassedAt && withVariants.has(unit.unitNumber);
    if (!open && !latest && !eligible) continue;
    if (open) {
      result.set(unit.id, { state: latest.status as ChildUnitTestState, attemptId: latest.id, grade: null });
    } else if (latest && hasPassed(learner, unit.id)) {
      const best = db.prepare("SELECT id, grade FROM english_unit_test_attempts WHERE learner = ? AND unitId = ? AND status = 'approved' AND passed = 1 ORDER BY grade DESC, approvedAt DESC LIMIT 1").get(learner, unit.id) as { id: string; grade: number };
      result.set(unit.id, { state: 'passed', attemptId: best.id, grade: best.grade });
    } else if (eligible) {
      result.set(unit.id, { state: latest ? 'retake' : 'available', attemptId: latest?.id ?? null, grade: latest?.grade ?? null });
    }
  }
  return result;
}

// `correct` (after approval, for an answer that was not fully right): the
// expected answer, so the child learns from the graded test.
export type ChildSlotResult = { key: string; mark: Mark | null; correct?: string };

export type ChildAttemptView = {
  id: string;
  unitId: string;
  unitLabel: string;
  status: AttemptRow['status'];
  revision: number;
  test: ClientUnitTest;
  answers: Answers;
  // Keys the child may still change: everything while in progress; only the
  // wrong answers when the parent sent the test back.
  editable: string[] | 'all';
  results: ChildSlotResult[] | null;
  comment: string | null;
  score: { earned: number; total: number; grade: number; passed: boolean } | null;
  stars: number | null;
};

// The answer keys a test accepts: one per non-crossword slot, one per crossword cell.
function answerKeys(content: UnitTestContent, slots: AnswerSlot[]) {
  const keys = new Set(slots.filter((slot) => slot.kind !== 'crossword').map((slot) => slot.key));
  for (const exercise of content.exercises) {
    if (exercise.type !== 'crossword') continue;
    for (const cell of layoutCrossword(exercise.entries).cells) keys.add(crosswordCellAnswerKey(exercise.id, cell.row, cell.col));
  }
  return keys;
}

// After a return: the slots that were not fully right, as answer keys. A
// crossword cell shared with a word that was right stays locked.
function editableKeys(content: UnitTestContent, slots: AnswerSlot[], marks: Marks): string[] {
  const open = new Set<string>();
  const locked = new Set<string>();
  for (const slot of slots) {
    const wrong = marks[slot.key] !== 1;
    if (slot.kind !== 'crossword') {
      if (wrong) open.add(slot.key);
      continue;
    }
    const exercise = content.exercises.find((item) => item.id === slot.exerciseId);
    if (!exercise || exercise.type !== 'crossword') continue;
    const entry = layoutCrossword(exercise.entries).entries.find((item) => `${exercise.id}.${entryKey(item)}` === slot.key);
    if (!entry) continue;
    for (const cell of entryCells(entry)) (wrong ? open : locked).add(crosswordCellAnswerKey(exercise.id, cell.row, cell.col));
  }
  return [...open].filter((key) => !locked.has(key));
}

function unitLabelFor(row: AttemptRow) {
  const unit = getUnit(row.unitId);
  return unit ? vocabUnitLabel(unit) : `Unit ${row.unitNumber}`;
}

function childView(row: AttemptRow): ChildAttemptView {
  const content = contentOf(row);
  const slots = buildSlots(content);
  const marks = parseJson<Marks>(row.marksJson, {});
  const showMarks = row.status === 'returned' || row.status === 'approved';
  const stars = row.attemptId ? getProjectedRewardV2(row.attemptId)?.awardedAmount ?? 0 : null;
  return {
    id: row.id,
    unitId: row.unitId,
    unitLabel: unitLabelFor(row),
    status: row.status,
    revision: row.revision,
    test: toClientUnitTest(content),
    answers: parseJson<Answers>(row.answersJson, {}),
    editable: row.status === 'in_progress' ? 'all' : row.status === 'returned' ? editableKeys(content, slots, marks) : [],
    results: showMarks ? slots.map((slot) => {
      const mark = marks[slot.key] ?? null;
      const correct = row.status === 'approved' && mark !== 1 ? slot.accepted[0] : undefined;
      return correct ? { key: slot.key, mark, correct } : { key: slot.key, mark };
    }) : null,
    comment: showMarks ? row.parentComment : null,
    score: row.status === 'approved' && row.total !== null ? { earned: row.earned ?? 0, total: row.total, grade: row.grade ?? 1, passed: row.passed === 1 } : null,
    stars
  };
}

function attemptFor(learner: Learner, attemptId: string) {
  const row = db.prepare('SELECT * FROM english_unit_test_attempts WHERE id = ? AND learner = ?').get(attemptId, learner) as AttemptRow | undefined;
  if (!row) throw new UnitTestNotFoundError('Kontrolltööd ei leitud.');
  return row;
}

export function getChildAttempt(learner: Learner, attemptId: string) {
  return childView(attemptFor(learner, attemptId));
}

// Starts the unit's test (a random active variant) or returns the one that is
// already under way. The rules are checked here, not trusted from the page.
export function startOrResumeUnitTest(learner: Learner, unitId: string): ChildAttemptView {
  return db.transaction(() => {
    const unit = getUnit(unitId);
    if (!unit) throw new UnitTestNotFoundError('Õppetükki ei leitud.');
    const open = db.prepare("SELECT * FROM english_unit_test_attempts WHERE learner = ? AND unitId = ? AND status <> 'approved'").get(learner, unitId) as AttemptRow | undefined;
    if (open) return childView(open);
    if (!hasActiveLearningExercise(learner, VOCAB_EXERCISE_ID)) throw new UnitTestForbiddenError('Sõnavara ei ole praegu avatud.');
    const access = unitAccessFor(learner).get(unitId);
    if (!access?.accessible) throw new UnitTestForbiddenError('See õppetükk ei ole veel avatud.');
    if (!progressRows(learner).get(unitId)?.testPassedAt) throw new UnitTestForbiddenError('Kontrolltöö avaneb, kui sõnade test on läbitud.');
    if (hasPassed(learner, unitId)) throw new UnitTestConflictError('Selle õppetüki kontrolltöö on juba sooritatud.');
    const variants = activeVariants(unit.unitNumber);
    if (variants.length === 0) throw new UnitTestForbiddenError('Sellel õppetükil ei ole kontrolltööd.');
    // A retake prefers a variant the child has not taken yet; only when every
    // variant has been tried is the choice random again.
    const taken = new Set((db.prepare('SELECT variant FROM english_unit_test_attempts WHERE learner = ? AND unitId = ?').all(learner, unitId) as Array<{ variant: string }>).map((item) => item.variant));
    const fresh = variants.filter((item) => !taken.has(item.variant));
    const pool = fresh.length > 0 ? fresh : variants;
    const picked = pool[randomInt(pool.length)];
    const content = contentOf(picked);
    const now = nowIso();
    const id = `ut_${randomUUID()}`;
    db.prepare(`
      INSERT INTO english_unit_test_attempts (id, learner, unitId, unitNumber, variant, contentHash, contentJson, status, startedAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'in_progress', ?, ?)
    `).run(id, learner, unitId, unit.unitNumber, picked.variant, picked.contentHash, JSON.stringify(content), now, now);
    return childView(attemptFor(learner, id));
  })();
}

function cleanAnswers(input: unknown, allowed: Set<string>): Answers {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new UnitTestValidationError('Vastused on vigased.');
  const result: Answers = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!allowed.has(key)) continue;
    if (typeof value !== 'string') continue;
    // A crossword cell holds one letter.
    result[key] = key.includes('#') ? value.trim().slice(0, 1).toUpperCase() : value.slice(0, MAX_SLOT_ANSWER_LENGTH);
  }
  return result;
}

// Saves the child's answers (a draft) and, with submit, hands the test in.
// `revision` is the one the page last saw: a page that fell behind (another
// tab, a parent review in between) gets the current state back instead.
export function saveUnitTestAnswers(learner: Learner, attemptId: string, input: { revision: unknown; answers: unknown; submit: boolean }): ChildAttemptView {
  return db.transaction(() => {
    const row = attemptFor(learner, attemptId);
    if (row.status !== 'in_progress' && row.status !== 'returned') throw new UnitTestStaleError('Kontrolltöö on juba ära antud.', childView(row));
    if (input.revision !== row.revision) throw new UnitTestStaleError('Kontrolltöö on vahepeal muutunud.', childView(row));
    const content = contentOf(row);
    const slots = buildSlots(content);
    const previous = parseJson<Answers>(row.answersJson, {});
    const previousMarks = parseJson<Marks>(row.marksJson, {});
    const editable = row.status === 'in_progress' ? answerKeys(content, slots) : new Set(editableKeys(content, slots, previousMarks));
    const answers = { ...previous, ...cleanAnswers(input.answers, editable) };
    const now = nowIso();
    if (!input.submit) {
      db.prepare('UPDATE english_unit_test_attempts SET answersJson = ?, revision = revision + 1, updatedAt = ? WHERE id = ?').run(JSON.stringify(answers), now, row.id);
      return childView(attemptFor(learner, attemptId));
    }
    const fresh = autoMarks(content, answers, slots);
    // On a resubmission only the answers the child actually changed are
    // marked again; the parent's marks on everything else stand (a ✗ the
    // parent gave to an answer the app would accept stays ✗).
    const marks: Marks = row.status === 'in_progress'
      ? fresh
      : Object.fromEntries(slots.map((slot) => {
        const changed = slotAnswer(content, previous, slot) !== slotAnswer(content, answers, slot);
        return [slot.key, changed ? fresh[slot.key] : previousMarks[slot.key] ?? fresh[slot.key]];
      }));
    db.prepare(`
      UPDATE english_unit_test_attempts
      SET answersJson = ?, marksJson = ?, status = 'submitted', submissions = submissions + 1, submittedAt = ?, revision = revision + 1, updatedAt = ?
      WHERE id = ?
    `).run(JSON.stringify(answers), JSON.stringify(marks), now, now, row.id);
    return childView(attemptFor(learner, attemptId));
  })();
}

/* ------------------------------------------------------------- parent */

export type ParentReviewSummary = {
  id: string;
  learner: Learner;
  unitLabel: string;
  variant: 'A' | 'B';
  submittedAt: string;
  submissions: number;
  autoScore: Score;
};

export function listPendingReviews(): ParentReviewSummary[] {
  const rows = db.prepare("SELECT * FROM english_unit_test_attempts WHERE status = 'submitted' ORDER BY submittedAt").all() as AttemptRow[];
  return rows.flatMap((row) => {
    const content = safeContentOf(row);
    if (!content) return [];
    return [{
      id: row.id,
      learner: row.learner,
      unitLabel: unitLabelFor(row),
      variant: row.variant,
      submittedAt: row.submittedAt ?? row.updatedAt,
      submissions: row.submissions,
      autoScore: scoreMarks(buildSlots(content), parseJson<Marks>(row.marksJson, {}))
    }];
  });
}

// How many decisions wait for the parent: handed-in tests. Shown as a count on
// the home page's parent link, so it carries nothing but the number.
export function pendingReviewCount(): number {
  return (db.prepare("SELECT COUNT(*) AS count FROM english_unit_test_attempts WHERE status = 'submitted'").get() as { count: number }).count;
}

// The parent cancels a test that is not approved yet (started by mistake, or
// on content that turned out wrong). Nothing was paid for it, so the row is
// removed and the unit opens again.
export function cancelUnitTest(attemptId: string) {
  return db.transaction(() => {
    const row = db.prepare('SELECT status FROM english_unit_test_attempts WHERE id = ?').get(attemptId) as { status: AttemptRow['status'] } | undefined;
    if (!row) throw new UnitTestNotFoundError('Kontrolltööd ei leitud.');
    if (row.status === 'approved') throw new UnitTestConflictError('Kinnitatud kontrolltööd ei saa tühistada.');
    db.prepare('DELETE FROM english_unit_test_attempts WHERE id = ?').run(attemptId);
  })();
}

export type ParentReviewSlot = AnswerSlot & { answer: string; mark: Mark | null; autoMark: Mark | null };

export type ParentReview = {
  id: string;
  learner: Learner;
  unitLabel: string;
  variant: 'A' | 'B';
  title: string;
  status: AttemptRow['status'];
  revision: number;
  submissions: number;
  submittedAt: string | null;
  comment: string | null;
  test: ClientUnitTest;
  answers: Answers;
  slots: ParentReviewSlot[];
  score: Score;
  stars: number | null;
};

export function getParentReview(attemptId: string): ParentReview {
  const row = db.prepare('SELECT * FROM english_unit_test_attempts WHERE id = ?').get(attemptId) as AttemptRow | undefined;
  if (!row) throw new UnitTestNotFoundError('Kontrolltööd ei leitud.');
  const content = contentOf(row);
  const slots = buildSlots(content);
  const answers = parseJson<Answers>(row.answersJson, {});
  const marks = parseJson<Marks>(row.marksJson, {});
  const automatic = autoMarks(content, answers, slots);
  return {
    id: row.id,
    learner: row.learner,
    unitLabel: unitLabelFor(row),
    variant: row.variant,
    title: content.title,
    status: row.status,
    revision: row.revision,
    submissions: row.submissions,
    submittedAt: row.submittedAt,
    comment: row.parentComment,
    test: toClientUnitTest(content),
    answers,
    slots: slots.map((slot) => ({ ...slot, answer: slotAnswer(content, answers, slot), mark: marks[slot.key] ?? null, autoMark: automatic[slot.key] })),
    score: scoreMarks(slots, marks),
    stars: row.attemptId ? getProjectedRewardV2(row.attemptId)?.awardedAmount ?? 0 : null
  };
}

// The learning attempt an approved, passed test produces. Like the words
// test it is a protocol-v2 row settled by the canonical reward projection,
// so the parent's star settings, decay, daily cap and streaks apply. It has
// its own runner, so it does not count as a second words test that day.
function insertApprovedAttempt(row: AttemptRow, slots: ParentReviewSlot[], score: Score, now: string) {
  const clientAttemptId = `unit-test:${row.id}`;
  const existing = db.prepare('SELECT id FROM attempts WHERE clientAttemptId = ?').get(clientAttemptId) as { id: number } | undefined;
  if (existing) return existing.id;
  const questions = slots.map((slot) => ({
    id: `${row.id}:${slot.key}`,
    taskId: slot.key,
    question: slot.label,
    userAnswer: slot.answer,
    correctAnswer: 0,
    correctAnswerText: slot.accepted[0] ?? '',
    acceptedAnswers: slot.accepted,
    isCorrect: slot.mark === 1,
    kind: 'text' as const
  }));
  // The test counts on the day the child handed it in (B6), not on the day the
  // parent approves it: otherwise the approval day's daily cap could zero it
  // and its streak day would be the parent's. The projection orders attempts
  // by completion date and time over the whole history, so a back-dated
  // attempt settles in its own day like a late offline attempt does.
  const completedAt = row.submittedAt && Number.isFinite(Date.parse(row.submittedAt)) && row.submittedAt <= now ? row.submittedAt : now;
  const completionDate = isoToAppDate(completedAt) ?? completedAt.slice(0, 10);
  const permitted = hasActiveLearningExercise(row.learner, VOCAB_EXERCISE_ID);
  const policy = ensureCurrentRewardPolicy();
  const elapsed = Math.max(0, Math.round((Date.parse(row.submittedAt ?? now) - Date.parse(row.startedAt)) / 1000));
  const result = db.prepare(`
    INSERT INTO attempts (
      createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId,
      clientAttemptId, deviceId, startedAt, completedAt, rawDeviceCompletedAt, syncedAt,
      catalogueVersion, clientCorrectedCompletedAt, effectiveCompletedAt, completionDate, clockStatus, clockSkewMs,
      rewardPolicyVersion, rewardEngineVersion, generatorVersion, runnerId, runnerVersion,
      rotationVersion, runnerSeed, questionIdsJson, protocolVersion, rewardSettlementStatus, reviewReasonCode
    ) VALUES (?, ?, 'Tavaline', ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, ?, NULL, ?, ?, ?, 'ok', 0, ?, ?, ?, ?, ?, 1, ?, ?, 2, ?, ?)
  `).run(
    now, UNIT_TEST_CATEGORY, Math.round(score.total), Math.round(score.earned), Math.min(elapsed, 4 * 3600), JSON.stringify(questions),
    row.learner, VOCAB_SUBJECT, UNIT_TEST_TOPIC, VOCAB_EXERCISE_ID,
    clientAttemptId, row.startedAt, completedAt, completedAt, now,
    completedAt, completedAt, completionDate,
    policy.version, REWARD_ENGINE_VERSION, UNIT_TEST_GENERATOR_VERSION, UNIT_TEST_RUNNER_ID, UNIT_TEST_RUNNER_VERSION,
    `${row.unitNumber}${row.variant}`, JSON.stringify(slots.map((slot) => slot.key)),
    permitted ? 'eligible' : 'withheld', permitted ? null : 'not_permitted'
  );
  const attemptId = Number(result.lastInsertRowid);
  if (permitted) {
    applyRewardProjectionV2(row.learner, attemptId);
    recordDailyLeaderboard(completionDate);
  }
  return attemptId;
}

function cleanMarks(input: unknown, slots: AnswerSlot[]): Marks {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new UnitTestValidationError('Hinded on vigased.');
  const raw = input as Record<string, unknown>;
  const marks: Marks = {};
  for (const slot of slots) {
    const value = raw[slot.key];
    if (value === null || value === undefined) marks[slot.key] = null;
    else if (isMark(value)) marks[slot.key] = value;
    else throw new UnitTestValidationError('Hinne peab olema 0, ½ või 1.');
  }
  return marks;
}

// The parent's decision on a handed-in test: save marks only, approve it
// (final: grade, and stars if passed), or send it back so the child fixes the
// answers that were not right.
export function reviewUnitTest(attemptId: string, input: { revision?: unknown; marks?: unknown; comment?: unknown; decision?: unknown }): ParentReview {
  return db.transaction(() => {
    const row = db.prepare('SELECT * FROM english_unit_test_attempts WHERE id = ?').get(attemptId) as AttemptRow | undefined;
    if (!row) throw new UnitTestNotFoundError('Kontrolltööd ei leitud.');
    if (row.status !== 'submitted') throw new UnitTestStaleError('Seda kontrolltööd ei saa praegu hinnata.', getParentReview(attemptId));
    if (input.revision !== row.revision) throw new UnitTestStaleError('Kontrolltöö on vahepeal muutunud.', getParentReview(attemptId));
    const decision = input.decision;
    if (decision !== 'save' && decision !== 'approve' && decision !== 'return') throw new UnitTestValidationError('Vale otsus.');
    const content = contentOf(row);
    const slots = buildSlots(content);
    const marks = cleanMarks(input.marks, slots);
    const comment = typeof input.comment === 'string' ? input.comment.trim().slice(0, MAX_COMMENT_LENGTH) : '';
    const score = scoreMarks(slots, marks);
    const now = nowIso();
    if (decision === 'approve' && score.unmarked > 0) throw new UnitTestValidationError('Hinda enne kinnitamist kõik vastused.');
    if (decision === 'return' && !slots.some((slot) => marks[slot.key] !== 1)) throw new UnitTestValidationError('Kõik vastused on õiged, parandada pole midagi.');

    if (decision === 'save') {
      db.prepare('UPDATE english_unit_test_attempts SET marksJson = ?, parentComment = ?, revision = revision + 1, updatedAt = ? WHERE id = ?')
        .run(JSON.stringify(marks), comment || null, now, row.id);
    } else if (decision === 'return') {
      db.prepare(`
        UPDATE english_unit_test_attempts
        SET marksJson = ?, parentComment = ?, status = 'returned', returnedAt = ?, revision = revision + 1, updatedAt = ?
        WHERE id = ?
      `).run(JSON.stringify(marks), comment || null, now, now, row.id);
    } else {
      const answers = parseJson<Answers>(row.answersJson, {});
      const detailed: ParentReviewSlot[] = slots.map((slot) => ({ ...slot, answer: slotAnswer(content, answers, slot), mark: marks[slot.key] ?? null, autoMark: null }));
      const learningAttempt = score.passed ? insertApprovedAttempt(row, detailed, score, now) : null;
      db.prepare(`
        UPDATE english_unit_test_attempts
        SET marksJson = ?, parentComment = ?, status = 'approved', approvedAt = ?, earned = ?, total = ?, grade = ?, passed = ?, attemptId = ?,
            revision = revision + 1, updatedAt = ?
        WHERE id = ?
      `).run(JSON.stringify(marks), comment || null, now, score.earned, score.total, score.grade, score.passed ? 1 : 0, learningAttempt, now, row.id);
    }
    return getParentReview(attemptId);
  })();
}

// Approved tests, newest first, for the parent's history list.
export function listRecentApproved(limit = 20) {
  const rows = db.prepare("SELECT * FROM english_unit_test_attempts WHERE status = 'approved' ORDER BY approvedAt DESC LIMIT ?").all(limit) as AttemptRow[];
  return rows.map((row) => ({
    id: row.id,
    learner: row.learner,
    unitLabel: unitLabelFor(row),
    variant: row.variant,
    approvedAt: row.approvedAt,
    grade: row.grade,
    passed: row.passed === 1,
    earned: row.earned,
    total: row.total
  }));
}

export const unitTestCellKey = cellKey;
