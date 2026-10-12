// Regression tests for the 2026-10-11 bug bash (findings #2–#34). Each test
// names the finding it guards.
import { beforeEach, describe, expect, it } from 'vitest';
import db, { openDatabase, runMigrations } from '@/lib/db';
import { updateChildLearningExerciseStatus } from '@/lib/learningExercises';
import { updateLearningPointSettings } from '@/lib/learningPoints';
import { VOCAB_EXERCISE_ID } from '@/lib/vocabulary/constants';
import { createPracticeState, prunePractice, practiceTotal, applyPracticeAction, currentPracticeWord } from '@/lib/vocabulary/engine';
import { isAnswerCorrect } from '@/lib/vocabulary/answers';
import { parseImportRows, parseUnitSection, planImport, suggestImportMapping, type ExistingUnit, type ImportTable } from '@/lib/vocabulary/importPlan';
import { parseImportTable } from '@/lib/server/vocabulary/http';
import { readSpreadsheet, SpreadsheetError } from '@/lib/server/vocabulary/spreadsheet';
import { buildXlsx, buildZip } from '@/lib/server/vocabulary/testZip';
import {
  addWord,
  commitImport,
  createUnit,
  deleteUnit,
  editWord,
  getUnit,
  patchUnit,
  previewImport,
  setManualUnlock,
  setWordRetired,
  updateUnit,
  VocabConflictError
} from '@/lib/server/vocabulary/units';
import { applySessionAction, getSessionView, startOrResumeSession, VocabForbiddenError, type SessionView } from '@/lib/server/vocabulary/sessions';
import { getChildVocabularyHome } from '@/lib/server/vocabulary/overview';

const LEARNER = 'kiur' as const;
let counter = 0;

function table(rows: Array<Array<string | null>>): ImportTable {
  return rows.map((row) => row.map((value) => value ? { v: value, t: 's' as const } : { v: '', t: 'empty' as const }));
}

function workbook(files: Record<string, string>) {
  return buildZip({
    'xl/workbook.xml': '<workbook><sheets><sheet name="S" r:id="rId1"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels': '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>',
    ...files
  });
}

function act(view: SessionView, action: Record<string, unknown>) {
  return applySessionAction(LEARNER, view.id, { actionId: `bb-${++counter}-${Date.now()}`, revision: view.revision, action });
}

function unitWithWords(unitNumber: number, count: number) {
  const unit = createUnit({ unitNumber, title: `Teema ${unitNumber}` });
  for (let index = 1; index <= count; index += 1) addWord(unit.id, { estonian: `sõna ${unitNumber}.${index}`, english: `word${unitNumber}x${index}` });
  updateUnit(unit.id, { published: true });
  return unit;
}

function englishFor(unitId: string, estonian: string) {
  return (db.prepare('SELECT english FROM english_vocab_words WHERE unitId = ? AND estonian = ?').get(unitId, estonian) as { english: string }).english;
}

function finishStudy(unitId: string) {
  let view = startOrResumeSession(LEARNER, { unitId, mode: 'study' });
  while (view.status === 'active') {
    view = act(view, { type: 'reveal' });
    view = act(view, { type: 'grade', known: true });
  }
  return view;
}

function playTest(unitId: string, wrongInFirstRound: number) {
  let view = startOrResumeSession(LEARNER, { unitId, mode: 'test' });
  let wrongLeft = wrongInFirstRound;
  while (view.status === 'active') {
    const test = view.test!;
    if (test.phase === 'full_summary' || test.phase === 'correction_summary') { view = act(view, { type: 'continue' }); continue; }
    const wrong = test.phase === 'full' && test.round === 1 && wrongLeft > 0;
    if (wrong) wrongLeft -= 1;
    view = act(view, { type: 'answer', answer: wrong ? 'xxx' : englishFor(unitId, test.prompt!.estonian) });
    view = act(view, { type: 'continue' });
  }
  return view;
}

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM english_vocab_events; DELETE FROM english_vocab_test_rounds; DELETE FROM english_vocab_word_stats;
    DELETE FROM english_vocab_sessions; DELETE FROM english_vocab_progress; DELETE FROM english_vocab_word_revisions;
    DELETE FROM english_vocab_words; DELETE FROM english_vocab_units; DELETE FROM english_vocab_imports;
    DELETE FROM attempt_reward_components; DELETE FROM reward_projection_runs; DELETE FROM study_attempt_rewards;
    DELETE FROM point_ledger; DELETE FROM attempts; DELETE FROM daily_leaderboard;
  `);
  db.pragma('foreign_keys = ON');
  updateChildLearningExerciseStatus(VOCAB_EXERCISE_ID, LEARNER, 'rotation');
  updateLearningPointSettings({ baseValue: 1, decayStep: 0.1, minimumValue: 0, dailyCap: 10, streakIntervalDays: 7, streakBonusAmount: 0, learningPointsEnabled: true, streakBonusEnabled: false });
});

describe('spreadsheet reader fixes', () => {
  it('#11 fails fast on a part with unclosed tags instead of backtracking', () => {
    const shared = `<sst>${'<si>'.repeat(40000)}</sst>`;
    const started = Date.now();
    expect(() => readSpreadsheet(workbook({ 'xl/sharedStrings.xml': shared, 'xl/worksheets/sheet1.xml': '<worksheet><sheetData/></worksheet>' }))).toThrow(SpreadsheetError);
    expect(Date.now() - started).toBeLessThan(1000);
    const cells = `<worksheet><sheetData><row r="1">${'<c r="A1">'.repeat(40000)}</row></sheetData></worksheet>`;
    const begin = Date.now();
    expect(() => readSpreadsheet(workbook({ 'xl/worksheets/sheet1.xml': cells }))).toThrow(SpreadsheetError);
    expect(Date.now() - begin).toBeLessThan(1000);
  });

  it('#13 keeps shared-string indexes after an empty <si/>, and an empty <t/> in rich text', () => {
    const file = readSpreadsheet(workbook({
      'xl/sharedStrings.xml': '<sst><si><t>a</t></si><si/><si><t>dog</t></si><si><r><t/></r><r><t>cat</t></r></si></sst>',
      'xl/worksheets/sheet1.xml': '<worksheet><sheetData><row r="1"><c r="A1" t="s"><v>1</v></c><c r="B1" t="s"><v>2</v></c><c r="C1" t="s"><v>3</v></c></row></sheetData></worksheet>'
    }));
    expect(file.sheets[0].rows[0].map((cell) => cell.v)).toEqual(['', 'dog', 'cat']);
  });

  it('#22 reads prefixed XML, single quotes, SharedStrings in any case, ../ targets and _xHHHH_ escapes', () => {
    const file = readSpreadsheet(buildZip({
      'xl/workbook.xml': "<x:workbook xmlns:x='m'><x:sheets><x:sheet name='Sõnad' r:id='rId1'/></x:sheets></x:workbook>",
      'xl/_rels/workbook.xml.rels': "<Relationships><Relationship Id='rId1' Target='../xl/worksheets/sheet1.xml'/><Relationship Id='rId2' Type='http://x/relationships/sharedStrings' Target='SharedStrings.xml'/></Relationships>",
      'xl/SharedStrings.xml': '<x:sst><x:si><x:t>line_x000D_break</x:t></x:si></x:sst>',
      'xl/worksheets/sheet1.xml': "<x:worksheet><x:sheetData><x:row r='1'><x:c r='A1' t='s'><x:v>0</x:v></x:c></x:row></x:sheetData></x:worksheet>"
    }));
    expect(file.sheets[0].name).toBe('Sõnad');
    expect(file.sheets[0].rows[0][0].v).toBe('line\rbreak');
  });

  it('#15 ignores empty formatted rows far below the data and keeps other sheets readable', () => {
    const file = readSpreadsheet(workbook({
      'xl/worksheets/sheet1.xml': '<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>cat</t></is></c></row><row r="6000" s="1" customFormat="1"/></sheetData></worksheet>'
    }));
    expect(file.sheets[0].rows).toHaveLength(1);
    const csv = ['English,Estonian', 'UNIT 1,', ...Array.from({ length: 4999 }, (_, index) => `w${index},s${index}`)].join('\n');
    const parsed = parseImportRows(readSpreadsheet(Buffer.from(csv)).sheets[0].rows, { headerRow: 0, english: 0, estonian: 1, pronunciation: null, accepted: null, unit: null, title: null, unitHeaderRows: true });
    expect(parsed.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(parsed.rows).toHaveLength(4999);
  });

  it('#18 reports a corrupt zip entry as a file problem, not a server error', () => {
    const good = buildXlsx([{ name: 'A', rows: [['x']] }]);
    const corrupt = Buffer.from(good);
    // Damage the first compressed entry's data.
    for (let index = 40; index < 60; index += 1) corrupt[index] ^= 0xff;
    expect(() => readSpreadsheet(corrupt)).toThrow(SpreadsheetError);
  });

  it('#20 picks the delimiter used on most lines, not just the first', () => {
    const file = readSpreadsheet(Buffer.from('Sõnavara\nEnglish;Estonian\ncat;kass, kassike\n'));
    expect(file.sheets[0].rows[2].map((cell) => cell.v)).toEqual(['cat', 'kass, kassike']);
  });

  it('#27 reads UTF-16 text files', () => {
    const text = '﻿English\tEstonian\ncat\tkõik';
    const buffer = Buffer.from(text, 'utf16le');
    const file = readSpreadsheet(buffer);
    expect(file.format).toBe('tsv');
    expect(file.sheets[0].rows[1].map((cell) => cell.v)).toEqual(['cat', 'kõik']);
  });
});

describe('import validation fixes', () => {
  it('#14 reads a sheet whose unit heading sits above the header, or comes from the sheet name', () => {
    const rows = table([['UNIT 3  |   Thank you', null, null], ['English', 'Pronunciation', 'Estonian'], ['friendly', "['frendli]", 'sõbralik']]);
    const mapping = suggestImportMapping(rows, 'Unit 3');
    expect(mapping).toMatchObject({ headerRow: 1, unitHeaderRows: true });
    const parsed = parseImportRows(rows, mapping);
    expect(parsed.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(parsed.rows[0]).toMatchObject({ unitNumber: 3, english: 'friendly' });
    expect(parsed.unitTitles[3]).toBe('Thank you');

    const plain = table([['English', 'Estonian'], ['cat', 'kass']]);
    const fromName = suggestImportMapping(plain, 'Unit 5');
    expect(fromName.defaultUnit).toBe(5);
    expect(parseImportRows(plain, fromName).rows[0]).toMatchObject({ unitNumber: 5 });
  });

  it('#6 finds section rows when Estonian is the first column', () => {
    const rows = table([['Estonian', 'English'], ['UNIT 2 | Pere', null], ['ema', 'mum']]);
    const parsed = parseImportRows(rows, suggestImportMapping(rows));
    expect(parsed.rows[0]).toMatchObject({ unitNumber: 2, english: 'mum' });
  });

  it('#21 recognises common heading forms and refuses ambiguous ones', () => {
    for (const [text, title] of [['Unit 3 Animals', 'Animals'], ['Unit 3 / Animals', 'Animals'], ['Unit 3 (Animals)', 'Animals'], ['Unit 7, Food', 'Food'], ['Unit 03', ''], ['UNIT 3:', '']]) {
      expect(parseUnitSection(text), text).toMatchObject({ title, unitNumber: Number(text.match(/\d+/u)![0]) });
    }
    expect(parseUnitSection('UNIT 3 – 4 Review')).toMatchObject({ ambiguous: true });
    expect(parseUnitSection('unit 3.5')).toMatchObject({ ambiguous: true });
    const parsed = parseImportRows(table([['English', 'Estonian'], ['UNIT 3 – 4 Review', null], ['cat', 'kass']]), { headerRow: 0, english: 0, estonian: 1, pronunciation: null, accepted: null, unit: null, title: null, unitHeaderRows: true });
    expect(parsed.issues.some((issue) => issue.severity === 'error' && /mitmeti/u.test(issue.message))).toBe(true);
    const tooBig = parseImportRows(table([['English', 'Estonian'], ['Unit 1000', null], ['cat', 'kass']]), { headerRow: 0, english: 0, estonian: 1, pronunciation: null, accepted: null, unit: null, title: null, unitHeaderRows: true });
    expect(tooBig.issues.some((issue) => issue.severity === 'error')).toBe(true);
  });

  it('#19 strips invisible characters from words and answers', () => {
    const zeroWidth = String.fromCharCode(0x200b);
    const softHyphen = String.fromCharCode(0x00ad);
    const parsed = parseImportRows(table([['unit', 'estonian', 'english'], ['1', `kass${zeroWidth}`, `butter${softHyphen}fly`]]), { headerRow: 0, unit: 0, estonian: 1, english: 2, pronunciation: null, accepted: null, title: null, unitHeaderRows: false });
    expect(parsed.rows[0]).toMatchObject({ estonian: 'kass', english: 'butterfly' });
    expect(isAnswerCorrect({ english: `cat${zeroWidth}`, acceptedAnswers: [] }, 'cat')).toBe(true);
  });

  it('#23 cuts overlong cells instead of refusing the whole table', () => {
    const rows = parseImportTable([[{ v: 'cat', t: 's' }, { v: 'x'.repeat(5000), t: 's' }]]);
    expect(rows[0][1].v).toHaveLength(2000);
  });

  it('#25 warns about a unit heading with no words, and about conflicting titles', () => {
    const parsed = parseImportRows(table([['English', 'Estonian', 'Title'], ['UNIT 2 | Empty', null, null], ['UNIT 3 | Zoo', null, null], ['cat', 'kass', 'Animals']]), { headerRow: 0, english: 0, estonian: 1, pronunciation: null, accepted: null, unit: null, title: 2, unitHeaderRows: true });
    expect(parsed.issues.some((issue) => issue.severity === 'warning' && /Unit 2/u.test(issue.message))).toBe(true);
    expect(parsed.issues.some((issue) => issue.severity === 'warning' && /pealkiri/u.test(issue.message))).toBe(true);
    expect(parsed.unitTitles[3]).toBe('Zoo');
  });

  it('#26 treats "[the] cat" as an answer and a broken quoted list as an error', () => {
    const mapping = { headerRow: 0, unit: 0, estonian: 1, english: 2, pronunciation: null, accepted: 3, title: null, unitHeaderRows: false };
    const good = parseImportRows(table([['u', 'e', 'en', 'a'], ['1', 'kass', 'cat', '[the] cat; the cat']]), mapping);
    expect(good.rows[0].acceptedAnswers).toEqual(['[the] cat', 'the cat']);
    const bad = parseImportRows(table([['u', 'e', 'en', 'a'], ['1', 'koer', 'dog', '["dogs"']]), mapping);
    expect(bad.issues.some((issue) => issue.severity === 'error')).toBe(true);
  });

  it('#12 continues the copy with history when a unit holds the same pair twice', () => {
    const existing: ExistingUnit[] = [{ id: 'u', unitNumber: 1, title: 'T', words: [
      { id: 'plain', estonian: 'kass', english: 'cat', pronunciation: '', acceptedAnswers: [], position: 1, retired: false, hasHistory: false },
      { id: 'history', estonian: 'kass', english: 'cat', pronunciation: '', acceptedAnswers: [], position: 2, retired: false, hasHistory: true }
    ] }];
    const parsed = parseImportRows(table([['u', 'e', 'en'], ['1', 'kass', 'cat']]), { headerRow: 0, unit: 0, estonian: 1, english: 2, pronunciation: null, accepted: null, title: null, unitHeaderRows: false });
    const replace = planImport(parsed, existing, 'replace').units[0].changes;
    expect(replace).toEqual(expect.arrayContaining([expect.objectContaining({ wordId: 'history', kind: 'updated' }), expect.objectContaining({ wordId: 'plain', kind: 'retired' })]));
  });
});

describe('storage and parent fixes', () => {
  it('#12 refuses adding, editing into or restoring a duplicate pair', () => {
    const unit = createUnit({ unitNumber: 1, title: 'T' });
    const cat = addWord(unit.id, { estonian: 'kass', english: 'cat' });
    expect(() => addWord(unit.id, { estonian: 'Kass ', english: 'CAT' })).toThrow(VocabConflictError);
    const dog = addWord(unit.id, { estonian: 'koer', english: 'dog' });
    expect(() => editWord(dog.id, { estonian: 'kass', english: 'cat' })).toThrow(VocabConflictError);
    setWordRetired(cat.id, true);
    addWord(unit.id, { estonian: 'kass', english: 'cat' });
    expect(() => setWordRetired(cat.id, false)).toThrow(VocabConflictError);
  });

  it('#17 saves a unit edit all or nothing, and a manual-unlock toggle does not block deleting an unused unit', () => {
    const first = createUnit({ unitNumber: 1, title: 'A' });
    const second = createUnit({ unitNumber: 2, title: 'B' });
    expect(() => patchUnit(LEARNER, second.id, { manualUnlock: true, unitNumber: 1 })).toThrow(VocabConflictError);
    expect(db.prepare('SELECT manualUnlock FROM english_vocab_progress WHERE unitId = ?').get(second.id)).toBeUndefined();
    setManualUnlock(LEARNER, first.id, true);
    setManualUnlock(LEARNER, first.id, false);
    deleteUnit(first.id);
    expect(getUnit(first.id)).toBeNull();
  });

  it('keeps accepted answers and pronunciation added in the app when the file has no such column', () => {
    const mapping = { headerRow: 0, unit: 0, estonian: 1, english: 2, pronunciation: null, accepted: null, title: null, unitHeaderRows: false };
    const parsed = parseImportRows(table([['u', 'e', 'en'], ['1', 'joo', 'drink, drank']]), mapping);
    commitImport(parsed, 'merge', previewImport(parsed, 'merge').planHash, null);
    const word = db.prepare('SELECT id FROM english_vocab_words').get() as { id: string };
    editWord(word.id, { estonian: 'joo', english: 'drink, drank', pronunciation: '[driŋk]', acceptedAnswers: ['drink drank'] });
    const again = previewImport(parsed, 'merge');
    expect(again.plan.units[0].changes[0].kind).toBe('unchanged');
    // A file that does carry the column still updates it.
    const withColumn = parseImportRows(table([['u', 'e', 'en', 'a'], ['1', 'joo', 'drink, drank', 'drink/drank']]), { ...mapping, accepted: 3 });
    expect(previewImport(withColumn, 'merge').plan.units[0].changes[0]).toMatchObject({ kind: 'updated', values: { acceptedAnswers: ['drink/drank'], pronunciation: '[driŋk]' } });
  });

  it('#24 re-importing a file into a unit with hand-added words changes nothing', () => {
    const rows = table([['u', 'e', 'en'], ['1', 'kass', 'cat']]);
    const mapping = { headerRow: 0, unit: 0, estonian: 1, english: 2, pronunciation: null, accepted: null, title: null, unitHeaderRows: false };
    const parsed = parseImportRows(rows, mapping);
    commitImport(parsed, 'merge', previewImport(parsed, 'merge').planHash, null);
    const unit = db.prepare('SELECT id FROM english_vocab_units').get() as { id: string };
    addWord(unit.id, { estonian: 'koer', english: 'dog' });
    const before = getUnit(unit.id)!.contentVersion;
    const again = previewImport(parsed, 'merge');
    expect(again.plan.units[0].changes.map((change) => change.kind)).toEqual(['unchanged', 'kept']);
    commitImport(parsed, 'merge', again.planHash, null);
    expect(getUnit(unit.id)!.contentVersion).toBe(before);
  });
});

describe('session rule fixes', () => {
  it('#7 counts a passed test once per unit per day; a repeat is practice', () => {
    const unit = unitWithWords(1, 2);
    finishStudy(unit.id);
    expect(playTest(unit.id, 0).test?.counted).toBe(true);
    const repeat = playTest(unit.id, 0);
    expect(repeat.test).toMatchObject({ phase: 'passed', counted: false });
    expect(repeat.reward).toBeNull();
    expect(db.prepare('SELECT COUNT(*) AS count FROM attempts').get()).toEqual({ count: 1 });
    expect(db.prepare('SELECT testPasses FROM english_vocab_progress WHERE unitId = ?').get(unit.id)).toEqual({ testPasses: 2 });
  });

  it('#8 locks a not-yet-passed test until words added later are studied, and only those words', () => {
    const unit = unitWithWords(1, 2);
    finishStudy(unit.id);
    addWord(unit.id, { estonian: 'uus', english: 'new' });
    expect(getChildVocabularyHome(LEARNER).units[0]).toMatchObject({ status: 'new_words', newWordsCount: 1, testUnlocked: false });
    expect(() => startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'test' })).toThrow(VocabForbiddenError);
    const study = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'study' });
    expect(study.study).toMatchObject({ scope: 'new', total: 1 });
    const done = finishStudy(unit.id);
    expect(done.study).toMatchObject({ scope: 'new', completed: true });
    expect(getChildVocabularyHome(LEARNER).units[0]).toMatchObject({ status: 'study_done', testUnlocked: true });
    // The first full study's record is kept.
    expect(db.prepare('SELECT studyTotal, studyCompletions FROM english_vocab_progress WHERE unitId = ?').get(unit.id)).toEqual({ studyTotal: 2, studyCompletions: 1 });

    // A passed unit stays open when words are added.
    playTest(unit.id, 0);
    addWord(unit.id, { estonian: 'veel', english: 'more' });
    expect(getChildVocabularyHome(LEARNER).units[0]).toMatchObject({ status: 'passed', testUnlocked: true });
  });

  it('#8 lets a test already under way finish after words are added', () => {
    const unit = unitWithWords(1, 1);
    finishStudy(unit.id);
    let view = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'test' });
    addWord(unit.id, { estonian: 'uus', english: 'new' });
    view = act(view, { type: 'answer', answer: 'word1x1' });
    view = act(view, { type: 'continue' });
    expect(view.status).toBe('completed');
  });

  it('#33 keeps a unit\'s weak words out of practice while its test is under way', () => {
    const unit = unitWithWords(1, 2);
    finishStudy(unit.id);
    const view = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'test' });
    expect(act(view, { type: 'answer', answer: 'wrong' }).test?.feedback?.correct).toBe(false);
    expect(getChildVocabularyHome(LEARNER).units[0].weakCount).toBe(0);
    expect(() => startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'practice' })).toThrow(/pärast testi/u);
    expect(() => startOrResumeSession(LEARNER, { unitId: null, mode: 'practice' })).toThrow(/ühtegi sõna/u);
  });

  it('#5 #6 refreshes practice: recovered and retired words drop out, a locked unit closes it', () => {
    const unit = unitWithWords(1, 3);
    finishStudy(unit.id);
    playTest(unit.id, 2);
    let practice = startOrResumeSession(LEARNER, { unitId: null, mode: 'practice' });
    expect(practice.practice?.total).toBe(2);
    const weak = db.prepare('SELECT wordId FROM english_vocab_word_stats WHERE needsPractice = 1 ORDER BY wordId').all() as Array<{ wordId: string }>;
    // One weak word gets retired by the parent; resuming drops it.
    setWordRetired(weak[0].wordId, true);
    practice = startOrResumeSession(LEARNER, { unitId: null, mode: 'practice' });
    expect(practice.practice?.total).toBe(1);
    // The unit is unpublished: the next action closes the session.
    updateUnit(unit.id, { published: false });
    practice = act(practice, { type: 'answer', answer: 'x' });
    expect(practice.status).toBe('completed');
    expect(practice.practice?.total).toBe(0);
  });

  it('#16 refuses reading a session once the exercise is hidden or the unit unpublished', () => {
    const unit = unitWithWords(1, 1);
    const view = startOrResumeSession(LEARNER, { unitId: unit.id, mode: 'study' });
    expect(getSessionView(LEARNER, view.id).id).toBe(view.id);
    updateUnit(unit.id, { published: false });
    expect(() => getSessionView(LEARNER, view.id)).toThrow(VocabForbiddenError);
    updateUnit(unit.id, { published: true });
    updateChildLearningExerciseStatus(VOCAB_EXERCISE_ID, LEARNER, 'hidden');
    expect(() => getSessionView(LEARNER, view.id)).toThrow(VocabForbiddenError);
  });
});

describe('engine and migration', () => {
  it('prunes practice without touching the word on screen', () => {
    const words = ['a', 'b', 'c'].map((id) => ({ id, estonian: id, english: `${id}${id}`, pronunciation: '', acceptedAnswers: [] }));
    let state = createPracticeState(words, 1);
    const first = currentPracticeWord(state)!;
    state = applyPracticeAction(state, { type: 'answer', answer: 'zz' }).state;
    const pruned = prunePractice(state, new Set<string>());
    expect(pruned.feedback?.wordId).toBe(first.id);
    expect(practiceTotal(pruned)).toBe(1);
    const next = applyPracticeAction(pruned, { type: 'continue' }).state;
    expect(next.completed).toBe(true);
  });

  it('migration 10 backfills the studied words from completed study sessions', () => {
    const connection = openDatabase(':memory:');
    try {
      const now = new Date().toISOString();
      connection.exec("INSERT INTO english_vocab_units (id, unitNumber, title, published, contentVersion, createdAt, updatedAt) VALUES ('u', 3, 'T', 1, 1, '" + now + "', '" + now + "')");
      for (const id of ['w1', 'w2']) connection.prepare("INSERT INTO english_vocab_words (id, unitId, position, estonian, english, createdAt, updatedAt) VALUES (?, 'u', 1, ?, ?, ?, ?)").run(id, id, id, now, now);
      connection.prepare("INSERT INTO english_vocab_sessions (id, learner, unitId, scopeKey, mode, status, stateJson, startedAt, updatedAt) VALUES ('s', 'kiur', 'u', 'u', 'study', 'completed', '{}', ?, ?)").run(now, now);
      for (const id of ['w1', 'w2']) connection.prepare("INSERT INTO english_vocab_events (sessionId, learner, unitId, wordId, phase, roundNumber, correct, expected, createdAt) VALUES ('s', 'kiur', 'u', ?, 'study', 1, 1, ?, ?)").run(id, id, now);
      connection.prepare("INSERT INTO english_vocab_progress (learner, unitId, studyCompletedAt, updatedAt) VALUES ('kiur', 'u', ?, ?)").run(now, now);
      connection.exec('ALTER TABLE english_vocab_progress DROP COLUMN studiedWordIdsJson; DELETE FROM schema_migrations WHERE id = 10;');
      runMigrations(connection);
      expect(connection.prepare('SELECT studiedWordIdsJson FROM english_vocab_progress').get()).toEqual({ studiedWordIdsJson: '["w1","w2"]' });
    } finally {
      connection.close();
    }
  });
});
