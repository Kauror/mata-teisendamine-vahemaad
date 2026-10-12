import { createHash, randomBytes } from 'node:crypto';
import db from '@/lib/db';
import { nowIso, type Learner } from '@/lib/tasks';
import { computeUnitAccess, type UnitAccess } from '@/lib/vocabulary/unlock';
import {
  IMPORT_LIMITS,
  planImport,
  stripInvisible,
  wordKey,
  type ExistingUnit,
  type ImportMode,
  type ImportPlan,
  type ParsedImport,
  type WordValues
} from '@/lib/vocabulary/importPlan';
import type { VocabWordSnapshot } from '@/lib/vocabulary/types';

// Storage of textbook units and their words, plus the parent's controls over
// them. Every multi-row change runs in one transaction.

export class VocabNotFoundError extends Error {}
export class VocabConflictError extends Error {}
export class VocabValidationError extends Error {}

export type UnitRow = {
  id: string;
  unitNumber: number;
  title: string;
  published: number;
  contentVersion: number;
  createdAt: string;
  updatedAt: string;
};

export type WordRow = {
  id: string;
  unitId: string;
  position: number;
  estonian: string;
  english: string;
  pronunciation: string;
  acceptedAnswersJson: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  retiredAt: string | null;
};

export type ProgressRow = {
  learner: Learner;
  unitId: string;
  manualUnlock: number;
  manualUnlockUpdatedAt: string | null;
  studyCompletedAt: string | null;
  studyFirstKnown: number | null;
  studyTotal: number | null;
  studyCompletions: number;
  testPassedAt: string | null;
  passedScore: number | null;
  passedTotal: number | null;
  passedRound: number | null;
  passedSessionId: string | null;
  passedAttemptId: number | null;
  testPasses: number;
  studiedWordIdsJson: string | null;
  updatedAt: string;
};

function newId(prefix: string) {
  return `${prefix}_${randomBytes(8).toString('hex')}`;
}

export function parseAccepted(json: string): string[] {
  try {
    const parsed = JSON.parse(json) as unknown;
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : [];
  } catch {
    return [];
  }
}

export function toSnapshot(row: WordRow): VocabWordSnapshot {
  return { id: row.id, estonian: row.estonian, english: row.english, pronunciation: row.pronunciation, acceptedAnswers: parseAccepted(row.acceptedAnswersJson) };
}

export function listUnits(): UnitRow[] {
  return db.prepare('SELECT * FROM english_vocab_units ORDER BY unitNumber ASC').all() as UnitRow[];
}

export function getUnit(unitId: string): UnitRow | null {
  return (db.prepare('SELECT * FROM english_vocab_units WHERE id = ?').get(unitId) as UnitRow | undefined) ?? null;
}

export function activeWords(unitId: string): WordRow[] {
  return db.prepare('SELECT * FROM english_vocab_words WHERE unitId = ? AND retiredAt IS NULL ORDER BY position ASC, createdAt ASC').all(unitId) as WordRow[];
}

export function allWords(unitId: string): WordRow[] {
  return db.prepare('SELECT * FROM english_vocab_words WHERE unitId = ? ORDER BY retiredAt IS NOT NULL, position ASC, createdAt ASC').all(unitId) as WordRow[];
}

export function activeWordCounts(): Map<string, number> {
  const rows = db.prepare('SELECT unitId, COUNT(*) AS count FROM english_vocab_words WHERE retiredAt IS NULL GROUP BY unitId').all() as Array<{ unitId: string; count: number }>;
  return new Map(rows.map((row) => [row.unitId, row.count]));
}

export function progressRows(learner: Learner): Map<string, ProgressRow> {
  const rows = db.prepare('SELECT * FROM english_vocab_progress WHERE learner = ?').all(learner) as ProgressRow[];
  return new Map(rows.map((row) => [row.unitId, row]));
}

export function ensureProgressRow(learner: Learner, unitId: string) {
  db.prepare(`
    INSERT INTO english_vocab_progress (learner, unitId, updatedAt) VALUES (?, ?, ?)
    ON CONFLICT(learner, unitId) DO NOTHING
  `).run(learner, unitId, nowIso());
}

export function activeWordIdsByUnit(): Map<string, string[]> {
  const rows = db.prepare('SELECT unitId, id FROM english_vocab_words WHERE retiredAt IS NULL').all() as Array<{ unitId: string; id: string }>;
  const byUnit = new Map<string, string[]>();
  for (const row of rows) byUnit.set(row.unitId, [...(byUnit.get(row.unitId) ?? []), row.id]);
  return byUnit;
}

export function studiedWordIds(row: ProgressRow | undefined): Set<string> {
  return new Set(row?.studiedWordIdsJson ? parseAccepted(row.studiedWordIdsJson) : []);
}

// Words of the unit the child has not studied yet. Only matters while the
// unit's test has not been passed: then those words are studied before the
// test opens again (a passed unit stays fully open).
export function unstudiedWordIds(row: ProgressRow | undefined, activeIds: readonly string[]): string[] {
  if (!row?.studyCompletedAt || row.testPassedAt) return [];
  const studied = studiedWordIds(row);
  return activeIds.filter((id) => !studied.has(id));
}

// Access for every unit, from current data. A unit without words is treated as
// unpublished for the child: there is nothing in it to study.
export function unitAccessFor(learner: Learner, units = listUnits(), counts = activeWordCounts(), progress = progressRows(learner), wordIds = activeWordIdsByUnit()): Map<string, UnitAccess> {
  return computeUnitAccess(units.map((unit) => {
    const row = progress.get(unit.id);
    return {
      id: unit.id,
      unitNumber: unit.unitNumber,
      published: Boolean(unit.published) && (counts.get(unit.id) ?? 0) > 0,
      manualUnlock: Boolean(row?.manualUnlock),
      studyCompleted: Boolean(row?.studyCompletedAt) && unstudiedWordIds(row, wordIds.get(unit.id) ?? []).length === 0,
      testPassed: Boolean(row?.testPassedAt)
    };
  }));
}

function unitHasHistory(unitId: string) {
  return Boolean(db.prepare('SELECT 1 FROM english_vocab_sessions WHERE unitId = ? LIMIT 1').get(unitId));
}

function wordsWithHistory(unitId: string): Set<string> {
  const rows = db.prepare(`
    SELECT DISTINCT e.wordId FROM english_vocab_events e
    JOIN english_vocab_words w ON w.id = e.wordId
    WHERE w.unitId = ?
  `).all(unitId) as Array<{ wordId: string }>;
  return new Set(rows.map((row) => row.wordId));
}

function bumpContentVersion(unitId: string, now: string) {
  db.prepare('UPDATE english_vocab_units SET contentVersion = contentVersion + 1, updatedAt = ? WHERE id = ?').run(now, unitId);
}

function recordRevision(word: { id: string; revision: number } & WordValues, changeKind: string, source: string, now: string) {
  db.prepare(`
    INSERT INTO english_vocab_word_revisions (wordId, revision, changeKind, source, estonian, english, pronunciation, acceptedAnswersJson, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(word.id, word.revision, changeKind, source, word.estonian, word.english, word.pronunciation, JSON.stringify(word.acceptedAnswers), now);
}

/* ------------------------------------------------------------ units */

function cleanTitle(value: unknown, unitNumber: number) {
  const title = typeof value === 'string' ? value.normalize('NFC').replace(/\s+/gu, ' ').trim() : '';
  if (title.length > IMPORT_LIMITS.maxTitleLength) throw new VocabValidationError(`Pealkiri võib olla kuni ${IMPORT_LIMITS.maxTitleLength} märki.`);
  return title || `Unit ${unitNumber}`;
}

function cleanUnitNumber(value: unknown) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < IMPORT_LIMITS.minUnitNumber || number > IMPORT_LIMITS.maxUnitNumber) {
    throw new VocabValidationError(`Õppetüki number peab olema 1–${IMPORT_LIMITS.maxUnitNumber}.`);
  }
  return number;
}

export function createUnit(input: { unitNumber: unknown; title: unknown }): UnitRow {
  const unitNumber = cleanUnitNumber(input.unitNumber);
  const title = cleanTitle(input.title, unitNumber);
  const now = nowIso();
  const id = newId('u');
  try {
    db.prepare(`
      INSERT INTO english_vocab_units (id, unitNumber, title, published, contentVersion, createdAt, updatedAt)
      VALUES (?, ?, ?, 0, 1, ?, ?)
    `).run(id, unitNumber, title, now, now);
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE')) throw new VocabConflictError(`Unit ${unitNumber} on juba olemas.`);
    throw error;
  }
  return getUnit(id)!;
}

export function updateUnit(unitId: string, input: { unitNumber?: unknown; title?: unknown; published?: unknown }): UnitRow {
  return db.transaction(() => {
    const unit = getUnit(unitId);
    if (!unit) throw new VocabNotFoundError('Õppetükki ei leitud.');
    const now = nowIso();
    let unitNumber = unit.unitNumber;
    if (input.unitNumber !== undefined) {
      unitNumber = cleanUnitNumber(input.unitNumber);
      // Renumbering moves a unit in the progression. Allowed only before the
      // child has used it, so no progress ever changes meaning.
      if (unitNumber !== unit.unitNumber && unitHasHistory(unitId)) {
        throw new VocabConflictError('Numbrit ei saa muuta, sest laps on seda õppetükki juba kasutanud. Muuta saab pealkirja.');
      }
    }
    const title = input.title !== undefined ? cleanTitle(input.title, unitNumber) : unit.title;
    let published = unit.published;
    if (input.published !== undefined) {
      if (typeof input.published !== 'boolean') throw new VocabValidationError('Avaldamise väärtus on vigane.');
      if (input.published && activeWords(unitId).length === 0) throw new VocabValidationError('Tühja õppetükki ei saa avaldada.');
      published = input.published ? 1 : 0;
    }
    try {
      db.prepare('UPDATE english_vocab_units SET unitNumber = ?, title = ?, published = ?, updatedAt = ? WHERE id = ?').run(unitNumber, title, published, now, unitId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('UNIQUE')) throw new VocabConflictError(`Unit ${unitNumber} on juba olemas.`);
      throw error;
    }
    return getUnit(unitId)!;
  })();
}

export function deleteUnit(unitId: string) {
  db.transaction(() => {
    const unit = getUnit(unitId);
    if (!unit) throw new VocabNotFoundError('Õppetükki ei leitud.');
    // A progress row that only records the parent's manual-unlock switch is
    // not use by the child and does not block deleting the unit.
    const progress = db.prepare(`
      SELECT 1 FROM english_vocab_progress
      WHERE unitId = ? AND (studyCompletedAt IS NOT NULL OR testPassedAt IS NOT NULL OR studyCompletions > 0 OR testPasses > 0)
      LIMIT 1
    `).get(unitId);
    if (unitHasHistory(unitId) || progress) {
      throw new VocabConflictError('Seda õppetükki on juba kasutatud. Kustutamise asemel peida see (eemalda avaldamine).');
    }
    db.prepare('DELETE FROM english_vocab_progress WHERE unitId = ?').run(unitId);
    db.prepare('DELETE FROM english_vocab_word_revisions WHERE wordId IN (SELECT id FROM english_vocab_words WHERE unitId = ?)').run(unitId);
    db.prepare('DELETE FROM english_vocab_words WHERE unitId = ?').run(unitId);
    db.prepare('DELETE FROM english_vocab_units WHERE id = ?').run(unitId);
  })();
}

export function setManualUnlock(learner: Learner, unitId: string, unlocked: boolean) {
  if (typeof unlocked !== 'boolean') throw new VocabValidationError('Avamise väärtus on vigane.');
  db.transaction(() => {
    if (!getUnit(unitId)) throw new VocabNotFoundError('Õppetükki ei leitud.');
    ensureProgressRow(learner, unitId);
    const now = nowIso();
    db.prepare('UPDATE english_vocab_progress SET manualUnlock = ?, manualUnlockUpdatedAt = ?, updatedAt = ? WHERE learner = ? AND unitId = ?')
      .run(unlocked ? 1 : 0, now, now, learner, unitId);
  })();
}

// The parent's unit edit as one change: either every field (manual unlock
// included) is saved, or none is.
export function patchUnit(learner: Learner, unitId: string, input: { unitNumber?: unknown; title?: unknown; published?: unknown; manualUnlock?: unknown }) {
  return db.transaction(() => {
    if (input.manualUnlock !== undefined) {
      if (typeof input.manualUnlock !== 'boolean') throw new VocabValidationError('Avamise väärtus on vigane.');
      setManualUnlock(learner, unitId, input.manualUnlock);
    }
    if (input.unitNumber !== undefined || input.title !== undefined || input.published !== undefined) {
      updateUnit(unitId, { unitNumber: input.unitNumber, title: input.title, published: input.published });
    }
    const unit = getUnit(unitId);
    if (!unit) throw new VocabNotFoundError('Õppetükki ei leitud.');
    return unit;
  })();
}

/* ------------------------------------------------------------ words */

// One unit never holds the same Estonian/English pair twice among its active
// words: the child could not tell them apart, and an import could only ever
// continue one of them.
function assertNoDuplicate(unitId: string, values: Pick<WordValues, 'estonian' | 'english'>, exceptWordId: string | null) {
  const key = wordKey(values.estonian, values.english);
  const clash = (db.prepare('SELECT id, estonian, english FROM english_vocab_words WHERE unitId = ? AND retiredAt IS NULL').all(unitId) as Array<{ id: string; estonian: string; english: string }>)
    .find((word) => word.id !== exceptWordId && wordKey(word.estonian, word.english) === key);
  if (clash) throw new VocabConflictError(`„${clash.estonian} — ${clash.english}“ on selles õppetükis juba olemas.`);
}

function cleanWordValues(input: Partial<Record<keyof WordValues, unknown>>): WordValues {
  const text = (value: unknown, label: string, max: number, required: boolean) => {
    const clean = typeof value === 'string' ? stripInvisible(value.normalize('NFC')).replace(/\s+/gu, ' ').trim() : '';
    if (required && !clean) throw new VocabValidationError(`${label} puudub.`);
    if (clean.length > max) throw new VocabValidationError(`${label} on pikem kui ${max} märki.`);
    return clean;
  };
  const estonian = text(input.estonian, 'Eestikeelne sõna', IMPORT_LIMITS.maxWordLength, true);
  const english = text(input.english, 'Ingliskeelne sõna', IMPORT_LIMITS.maxWordLength, true);
  const pronunciation = typeof input.pronunciation === 'string' ? stripInvisible(input.pronunciation.normalize('NFC')).trim() : '';
  if (pronunciation.length > IMPORT_LIMITS.maxPronunciationLength) throw new VocabValidationError('Hääldus on liiga pikk.');
  const rawAccepted = Array.isArray(input.acceptedAnswers) ? input.acceptedAnswers : [];
  if (rawAccepted.length > IMPORT_LIMITS.maxAcceptedAnswers) throw new VocabValidationError('Liiga palju vastuvõetavaid vastuseid.');
  const acceptedAnswers: string[] = [];
  for (const value of rawAccepted) {
    const clean = text(value, 'Vastuvõetav vastus', IMPORT_LIMITS.maxWordLength, false);
    if (clean && clean.toLocaleLowerCase('en') !== english.toLocaleLowerCase('en') && !acceptedAnswers.includes(clean)) acceptedAnswers.push(clean);
  }
  return { estonian, english, pronunciation, acceptedAnswers };
}

export function addWord(unitId: string, input: Partial<Record<keyof WordValues, unknown>>): WordRow {
  const values = cleanWordValues(input);
  return db.transaction(() => {
    if (!getUnit(unitId)) throw new VocabNotFoundError('Õppetükki ei leitud.');
    assertNoDuplicate(unitId, values, null);
    const now = nowIso();
    const position = ((db.prepare('SELECT MAX(position) AS position FROM english_vocab_words WHERE unitId = ?').get(unitId) as { position: number | null }).position ?? 0) + 1;
    const id = newId('w');
    db.prepare(`
      INSERT INTO english_vocab_words (id, unitId, position, estonian, english, pronunciation, acceptedAnswersJson, revision, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `).run(id, unitId, position, values.estonian, values.english, values.pronunciation, JSON.stringify(values.acceptedAnswers), now, now);
    recordRevision({ id, revision: 1, ...values }, 'created', 'parent', now);
    bumpContentVersion(unitId, now);
    return db.prepare('SELECT * FROM english_vocab_words WHERE id = ?').get(id) as WordRow;
  })();
}

// Editing keeps the word's id, so a corrected spelling keeps its statistics.
// History stays truthful because every event stored the expected answer of its
// time, and running sessions keep grading against their own copy.
export function editWord(wordId: string, input: Partial<Record<keyof WordValues, unknown>>): WordRow {
  const values = cleanWordValues(input);
  return db.transaction(() => {
    const word = db.prepare('SELECT * FROM english_vocab_words WHERE id = ?').get(wordId) as WordRow | undefined;
    if (!word) throw new VocabNotFoundError('Sõna ei leitud.');
    if (!word.retiredAt) assertNoDuplicate(word.unitId, values, word.id);
    const now = nowIso();
    const revision = word.revision + 1;
    db.prepare(`
      UPDATE english_vocab_words SET estonian = ?, english = ?, pronunciation = ?, acceptedAnswersJson = ?, revision = ?, updatedAt = ? WHERE id = ?
    `).run(values.estonian, values.english, values.pronunciation, JSON.stringify(values.acceptedAnswers), revision, now, wordId);
    recordRevision({ id: wordId, revision, ...values }, 'edited', 'parent', now);
    bumpContentVersion(word.unitId, now);
    return db.prepare('SELECT * FROM english_vocab_words WHERE id = ?').get(wordId) as WordRow;
  })();
}

export function setWordRetired(wordId: string, retired: boolean) {
  db.transaction(() => {
    const word = db.prepare('SELECT * FROM english_vocab_words WHERE id = ?').get(wordId) as WordRow | undefined;
    if (!word) throw new VocabNotFoundError('Sõna ei leitud.');
    if (Boolean(word.retiredAt) === retired) return;
    if (!retired) assertNoDuplicate(word.unitId, word, word.id);
    const now = nowIso();
    const revision = word.revision + 1;
    db.prepare('UPDATE english_vocab_words SET retiredAt = ?, revision = ?, updatedAt = ? WHERE id = ?').run(retired ? now : null, revision, now, wordId);
    recordRevision({ id: wordId, revision, estonian: word.estonian, english: word.english, pronunciation: word.pronunciation, acceptedAnswers: parseAccepted(word.acceptedAnswersJson) }, retired ? 'retired' : 'restored', 'parent', now);
    bumpContentVersion(word.unitId, now);
    if (retired && activeWords(word.unitId).length === 0) {
      db.prepare('UPDATE english_vocab_units SET published = 0, updatedAt = ? WHERE id = ?').run(now, word.unitId);
    }
  })();
}

/* ----------------------------------------------------------- import */

export function existingUnitsForImport(): ExistingUnit[] {
  return listUnits().map((unit) => {
    const history = wordsWithHistory(unit.id);
    return {
      id: unit.id,
      unitNumber: unit.unitNumber,
      title: unit.title,
      words: allWords(unit.id).map((word) => ({
        id: word.id,
        estonian: word.estonian,
        english: word.english,
        pronunciation: word.pronunciation,
        acceptedAnswers: parseAccepted(word.acceptedAnswersJson),
        position: word.position,
        retired: Boolean(word.retiredAt),
        hasHistory: history.has(word.id)
      }))
    };
  });
}

// The parent confirms a specific preview. Its hash travels back with the
// confirmation, and the import is refused if the stored units changed in
// between (a second tab, a child's first session creating history, …).
export function importPlanHash(plan: ImportPlan) {
  const stable = plan.units.map((unit) => ({ n: unit.unitNumber, id: unit.unitId, title: unit.title, changes: unit.changes }));
  return createHash('sha256').update(JSON.stringify({ mode: plan.mode, stable })).digest('hex');
}

export function previewImport(parsed: ParsedImport, mode: ImportMode) {
  const plan = planImport(parsed, existingUnitsForImport(), mode);
  return { plan, planHash: importPlanHash(plan) };
}

export function commitImport(parsed: ParsedImport, mode: ImportMode, expectedHash: string, fileName: string | null) {
  return db.transaction(() => {
    const plan = planImport(parsed, existingUnitsForImport(), mode);
    const planHash = importPlanHash(plan);
    if (!plan.canCommit) throw new VocabValidationError('Importi ei saa teha, sest failis on vigu.');
    if (planHash !== expectedHash) throw new VocabConflictError('Andmed muutusid vahepeal. Kontrolli eelvaadet uuesti.');
    const now = nowIso();
    for (const unit of plan.units) {
      let unitId = unit.unitId;
      if (!unitId) {
        unitId = newId('u');
        db.prepare(`
          INSERT INTO english_vocab_units (id, unitNumber, title, published, contentVersion, createdAt, updatedAt)
          VALUES (?, ?, ?, 0, 1, ?, ?)
        `).run(unitId, unit.unitNumber, unit.title, now, now);
      } else if (unit.titleChanged) {
        db.prepare('UPDATE english_vocab_units SET title = ?, updatedAt = ? WHERE id = ?').run(unit.title, now, unitId);
      }
      let changed = false;
      for (const change of unit.changes) {
        // A word that stays where it is changes nothing — re-importing the same
        // file must not even bump the unit's content version.
        if (change.kind === 'unchanged' || (change.kind === 'kept' && !change.moved)) continue;
        if (change.kind === 'new') {
          const id = newId('w');
          db.prepare(`
            INSERT INTO english_vocab_words (id, unitId, position, estonian, english, pronunciation, acceptedAnswersJson, revision, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
          `).run(id, unitId, change.position, change.values.estonian, change.values.english, change.values.pronunciation, JSON.stringify(change.values.acceptedAnswers), now, now);
          recordRevision({ id, revision: 1, ...change.values }, 'created', 'import', now);
        } else if (change.kind === 'updated' || change.kind === 'restored') {
          const current = db.prepare('SELECT revision FROM english_vocab_words WHERE id = ?').get(change.wordId) as { revision: number };
          const revision = current.revision + 1;
          db.prepare(`
            UPDATE english_vocab_words SET position = ?, estonian = ?, english = ?, pronunciation = ?, acceptedAnswersJson = ?, revision = ?, retiredAt = NULL, updatedAt = ? WHERE id = ?
          `).run(change.position, change.values.estonian, change.values.english, change.values.pronunciation, JSON.stringify(change.values.acceptedAnswers), revision, now, change.wordId);
          recordRevision({ id: change.wordId, revision, ...change.values }, change.kind === 'restored' ? 'restored' : 'edited', 'import', now);
        } else if (change.kind === 'kept') {
          db.prepare('UPDATE english_vocab_words SET position = ? WHERE id = ?').run(change.position, change.wordId);
        } else if (change.kind === 'retired') {
          const word = db.prepare('SELECT * FROM english_vocab_words WHERE id = ?').get(change.wordId) as WordRow;
          const revision = word.revision + 1;
          db.prepare('UPDATE english_vocab_words SET retiredAt = ?, revision = ?, updatedAt = ? WHERE id = ?').run(now, revision, now, change.wordId);
          recordRevision({ id: word.id, revision, estonian: word.estonian, english: word.english, pronunciation: word.pronunciation, acceptedAnswers: parseAccepted(word.acceptedAnswersJson) }, 'retired', 'import', now);
        }
        changed = true;
      }
      if (changed && unit.unitId) bumpContentVersion(unitId, now);
    }
    db.prepare('INSERT INTO english_vocab_imports (fileName, mode, planHash, summaryJson, createdAt) VALUES (?, ?, ?, ?, ?)')
      .run(fileName ? fileName.slice(0, 200) : null, mode, planHash, JSON.stringify(plan.totals), now);
    return plan;
  })();
}
