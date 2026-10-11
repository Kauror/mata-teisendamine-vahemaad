// Turning a spreadsheet into textbook units, as pure functions so every rule
// is unit-tested and the preview the parent approves is exactly what is
// written.
//
// Two stages:
//   1. parseImportRows: table + column mapping → validated rows. Nothing is
//      skipped silently; every rejected, empty or section row is reported.
//   2. planImport: validated rows + the units already stored → a diff per unit.
//
// Safe-edit policy (how a re-import treats words that already exist):
//   - A word is the same word when its Estonian and English text match after
//     whitespace and letter-case normalisation. It keeps its id, so its
//     statistics and history continue.
//   - Pronunciation, accepted answers, position and letter-case fixes update
//     the word in place; each change is kept as a revision.
//   - A word whose spelling changed is a different word: it is added as new.
//     In "replace" mode the old spelling is retired — hidden from new sessions,
//     but its history, statistics and any session in progress are untouched.
//   - "merge" mode never retires anything.
//   - Running sessions are unaffected either way, because every session works
//     from its own copy of the words.
//   - Any error blocks the whole import. Nothing is half-imported.

export type ImportCellType = 's' | 'n' | 'b' | 'e' | 'empty';
export type ImportCell = { v: string; t: ImportCellType };
export type ImportTable = ImportCell[][];

export type ImportMapping = {
  // 0-based index of the header row, or null when the sheet has none. Data
  // starts on the row after it.
  headerRow: number | null;
  english: number;
  estonian: number;
  pronunciation: number | null;
  accepted: number | null;
  // A column holding the unit number on every row.
  unit: number | null;
  // An optional column holding the unit title.
  title: number | null;
  // Recognise section rows such as "UNIT 3 | Thank you" that start each unit.
  unitHeaderRows: boolean;
};

export type ImportMode = 'merge' | 'replace';

export type ImportIssue = {
  // 1-based row number as the parent sees it in Excel; 0 for whole-file issues.
  row: number;
  severity: 'error' | 'warning';
  message: string;
};

export type ParsedImportRow = {
  row: number;
  unitNumber: number;
  estonian: string;
  english: string;
  pronunciation: string;
  acceptedAnswers: string[];
};

export type ParsedImport = {
  rows: ParsedImportRow[];
  unitTitles: Record<number, string>;
  issues: ImportIssue[];
  emptyRows: number;
  sectionRows: number;
};

export const IMPORT_LIMITS = {
  maxRows: 5000,
  maxColumns: 30,
  maxUnits: 100,
  maxWordLength: 200,
  maxPronunciationLength: 100,
  maxTitleLength: 80,
  maxAcceptedAnswers: 10,
  minUnitNumber: 1,
  maxUnitNumber: 999
} as const;

const UNIT_SECTION = /^\s*(?:unit|õppetükk|peatükk)\s*(\d{1,3})\s*(?:[|:.\-–—]\s*(.*?))?\s*$/iu;
const UNIT_VALUE = /^\s*(?:unit|õppetükk|peatükk)?\s*(\d{1,3})(?:\.0+)?\s*$/iu;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;
const MULTI_FORM = /\s\/\s|;|,|\(|\.\.\.|…/u;

function cellAt(row: ImportCell[] | undefined, index: number | null): ImportCell {
  if (index === null || !row) return { v: '', t: 'empty' };
  return row[index] ?? { v: '', t: 'empty' };
}

function collapse(value: string) {
  return value.normalize('NFC').replace(/\s+/gu, ' ').trim();
}

export function wordKey(estonian: string, english: string) {
  return `${collapse(estonian).toLocaleLowerCase('et')}␟${collapse(english).toLocaleLowerCase('en')}`;
}

function parseUnitValue(cell: ImportCell): number | null {
  if (cell.t === 'empty' || !cell.v.trim()) return null;
  const match = cell.v.match(UNIT_VALUE);
  if (!match) return NaN;
  return Number(match[1]);
}

export function parseUnitSection(value: string): { unitNumber: number; title: string } | null {
  const match = value.match(UNIT_SECTION);
  if (!match) return null;
  return { unitNumber: Number(match[1]), title: collapse(match[2] ?? '') };
}

function validUnitNumber(value: number) {
  return Number.isInteger(value) && value >= IMPORT_LIMITS.minUnitNumber && value <= IMPORT_LIMITS.maxUnitNumber;
}

function parseAccepted(raw: string, row: number, english: string, issues: ImportIssue[]): string[] | null {
  const text = raw.trim();
  if (!text) return [];
  let entries: string[];
  if (text.startsWith('[')) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) throw new Error('not a string array');
      entries = parsed as string[];
    } catch {
      issues.push({ row, severity: 'error', message: 'Vastuvõetavate vastuste loend on vigane. Eralda vastused semikooloni (;) või püstkriipsuga (|).' });
      return null;
    }
  } else {
    entries = text.split(/[;|]/u);
  }
  const cleaned: string[] = [];
  let hadEmpty = false;
  for (const entry of entries) {
    const value = collapse(entry);
    if (!value) { hadEmpty = true; continue; }
    if (CONTROL_CHARACTERS.test(value)) {
      issues.push({ row, severity: 'error', message: 'Vastuvõetav vastus sisaldab lubamatuid märke.' });
      return null;
    }
    if (value.length > IMPORT_LIMITS.maxWordLength) {
      issues.push({ row, severity: 'error', message: `Vastuvõetav vastus on pikem kui ${IMPORT_LIMITS.maxWordLength} märki.` });
      return null;
    }
    if (value.toLocaleLowerCase('en') === english.toLocaleLowerCase('en')) continue;
    if (cleaned.some((existing) => existing.toLocaleLowerCase('en') === value.toLocaleLowerCase('en'))) continue;
    cleaned.push(value);
  }
  if (hadEmpty) issues.push({ row, severity: 'warning', message: 'Vastuvõetavate vastuste hulgas oli tühi väärtus; see jäeti välja.' });
  if (cleaned.length > IMPORT_LIMITS.maxAcceptedAnswers) {
    issues.push({ row, severity: 'error', message: `Vastuvõetavaid vastuseid on rohkem kui ${IMPORT_LIMITS.maxAcceptedAnswers}.` });
    return null;
  }
  return cleaned;
}

function textField(cell: ImportCell, label: string, row: number, issues: ImportIssue[]): string | null {
  if (cell.t === 'e') {
    issues.push({ row, severity: 'error', message: `${label}: lahtris on Exceli viga (${cell.v || 'viga'}).` });
    return null;
  }
  if (cell.t === 'b') {
    issues.push({ row, severity: 'error', message: `${label}: lahtris on tõeväärtus, mitte tekst.` });
    return null;
  }
  if (cell.t === 'n') {
    issues.push({ row, severity: 'error', message: `${label}: lahtris on arv, mitte tekst. Vorminda lahter tekstiks.` });
    return null;
  }
  const value = collapse(cell.v);
  if (CONTROL_CHARACTERS.test(value)) {
    issues.push({ row, severity: 'error', message: `${label}: lahter sisaldab lubamatuid märke.` });
    return null;
  }
  if (value.length > IMPORT_LIMITS.maxWordLength) {
    issues.push({ row, severity: 'error', message: `${label} on pikem kui ${IMPORT_LIMITS.maxWordLength} märki.` });
    return null;
  }
  return value;
}

function isEmptyRow(row: ImportCell[] | undefined) {
  return !row || row.every((cell) => cell.t === 'empty' || !cell.v.trim());
}

export function parseImportRows(table: ImportTable, mapping: ImportMapping): ParsedImport {
  const issues: ImportIssue[] = [];
  const rows: ParsedImportRow[] = [];
  const unitTitles: Record<number, string> = {};
  let emptyRows = 0;
  let sectionRows = 0;

  const columns = [mapping.english, mapping.estonian, mapping.pronunciation, mapping.accepted, mapping.unit, mapping.title].filter((value): value is number => value !== null);
  if (columns.some((value) => !Number.isInteger(value) || value < 0 || value >= IMPORT_LIMITS.maxColumns)) {
    return { rows, unitTitles, issues: [{ row: 0, severity: 'error', message: 'Veergude valik on vigane.' }], emptyRows, sectionRows };
  }
  if (mapping.english === mapping.estonian) {
    return { rows, unitTitles, issues: [{ row: 0, severity: 'error', message: 'Eesti- ja ingliskeelne sõna peavad olema eri veergudes.' }], emptyRows, sectionRows };
  }
  if (mapping.unit === null && !mapping.unitHeaderRows) {
    return { rows, unitTitles, issues: [{ row: 0, severity: 'error', message: 'Vali õppetüki veerg või luba õppetüki pealkirjaread („UNIT 3 | …“).' }], emptyRows, sectionRows };
  }
  if (table.length > IMPORT_LIMITS.maxRows) {
    return { rows, unitTitles, issues: [{ row: 0, severity: 'error', message: `Failis on rohkem kui ${IMPORT_LIMITS.maxRows} rida.` }], emptyRows, sectionRows };
  }

  const start = mapping.headerRow === null ? 0 : mapping.headerRow + 1;
  let sectionUnit: number | null = null;
  const seen = new Map<string, number>();

  for (let index = start; index < table.length; index += 1) {
    const row = table[index];
    const rowNumber = index + 1;
    if (isEmptyRow(row)) { emptyRows += 1; continue; }

    const englishCell = cellAt(row, mapping.english);
    const estonianCell = cellAt(row, mapping.estonian);

    if (mapping.unitHeaderRows && !estonianCell.v.trim()) {
      const candidate = [englishCell, ...row].find((cell) => cell.t === 's' && cell.v.trim());
      const section = candidate ? parseUnitSection(candidate.v) : null;
      if (section) {
        sectionRows += 1;
        if (!validUnitNumber(section.unitNumber)) {
          issues.push({ row: rowNumber, severity: 'error', message: `Õppetüki number ${section.unitNumber} ei ole lubatud (1–${IMPORT_LIMITS.maxUnitNumber}).` });
          sectionUnit = null;
          continue;
        }
        sectionUnit = section.unitNumber;
        if (section.title) unitTitles[section.unitNumber] = section.title.slice(0, IMPORT_LIMITS.maxTitleLength);
        continue;
      }
    }

    let unitNumber: number | null = sectionUnit;
    if (mapping.unit !== null) {
      const parsed = parseUnitValue(cellAt(row, mapping.unit));
      if (parsed === null) {
        if (sectionUnit === null) {
          issues.push({ row: rowNumber, severity: 'error', message: 'Õppetüki number puudub.' });
          continue;
        }
      } else if (Number.isNaN(parsed) || !validUnitNumber(parsed)) {
        issues.push({ row: rowNumber, severity: 'error', message: `Õppetüki väärtus „${cellAt(row, mapping.unit).v}“ ei ole number 1–${IMPORT_LIMITS.maxUnitNumber}.` });
        continue;
      } else {
        unitNumber = parsed;
      }
    }
    if (unitNumber === null) {
      issues.push({ row: rowNumber, severity: 'error', message: 'Rida on enne esimest õppetüki pealkirja, nii et õppetükk on teadmata.' });
      continue;
    }

    const english = textField(englishCell, 'Ingliskeelne sõna', rowNumber, issues);
    const estonian = textField(estonianCell, 'Eestikeelne sõna', rowNumber, issues);
    if (english === null || estonian === null) continue;
    if (!english) { issues.push({ row: rowNumber, severity: 'error', message: 'Ingliskeelne sõna puudub.' }); continue; }
    if (!estonian) { issues.push({ row: rowNumber, severity: 'error', message: 'Eestikeelne sõna puudub.' }); continue; }

    const pronunciationCell = cellAt(row, mapping.pronunciation);
    // Kept exactly as written (brackets, IPA symbols, stress marks), apart from
    // surrounding spaces. Never generated.
    const pronunciation = pronunciationCell.t === 'empty' ? '' : pronunciationCell.v.normalize('NFC').trim();
    if (pronunciation.length > IMPORT_LIMITS.maxPronunciationLength) {
      issues.push({ row: rowNumber, severity: 'error', message: `Hääldus on pikem kui ${IMPORT_LIMITS.maxPronunciationLength} märki.` });
      continue;
    }
    if (CONTROL_CHARACTERS.test(pronunciation)) {
      issues.push({ row: rowNumber, severity: 'error', message: 'Hääldus sisaldab lubamatuid märke.' });
      continue;
    }

    const acceptedAnswers = parseAccepted(cellAt(row, mapping.accepted).v, rowNumber, english, issues);
    if (acceptedAnswers === null) continue;

    if (mapping.title !== null) {
      const title = collapse(cellAt(row, mapping.title).v);
      if (title && !unitTitles[unitNumber]) unitTitles[unitNumber] = title.slice(0, IMPORT_LIMITS.maxTitleLength);
    }

    const key = `${unitNumber}␟${wordKey(estonian, english)}`;
    const duplicateOf = seen.get(key);
    if (duplicateOf !== undefined) {
      issues.push({ row: rowNumber, severity: 'error', message: `Sama sõnapaar on Unit ${unitNumber} juures juba real ${duplicateOf}.` });
      continue;
    }
    seen.set(key, rowNumber);

    if (MULTI_FORM.test(english)) {
      issues.push({ row: rowNumber, severity: 'warning', message: `„${english}“ sisaldab mitut kuju, sulge või lünka. Testis tuleb see kirjutada täpselt nii — lisa vajadusel vastuvõetavad vastused.` });
    }
    if (/[,;]$/u.test(estonian)) {
      issues.push({ row: rowNumber, severity: 'warning', message: `Eestikeelne „${estonian}“ lõpeb komaga või semikooloniga — kontrolli, kas tekst on terve.` });
    }

    rows.push({ row: rowNumber, unitNumber, estonian, english, pronunciation, acceptedAnswers });
  }

  const unitNumbers = new Set(rows.map((row) => row.unitNumber));
  if (unitNumbers.size > IMPORT_LIMITS.maxUnits) {
    issues.push({ row: 0, severity: 'error', message: `Failis on rohkem kui ${IMPORT_LIMITS.maxUnits} õppetükki.` });
  }
  // The child sees the Estonian word and types the English one. The same
  // Estonian prompt with two different answers cannot be graded fairly.
  for (const unitNumber of unitNumbers) {
    const byPrompt = new Map<string, ParsedImportRow[]>();
    for (const row of rows.filter((item) => item.unitNumber === unitNumber)) {
      const prompt = collapse(row.estonian).toLocaleLowerCase('et');
      byPrompt.set(prompt, [...(byPrompt.get(prompt) ?? []), row]);
    }
    for (const group of byPrompt.values()) {
      if (group.length < 2) continue;
      issues.push({
        row: group[1].row,
        severity: 'warning',
        message: `Unit ${unitNumber}: „${group[0].estonian}“ on mitu korda (${group.map((item) => item.english).join(' / ')}). Testis võib vastus olla mitmeti mõistetav.`
      });
    }
  }
  if (rows.length === 0 && !issues.some((issue) => issue.severity === 'error')) {
    issues.push({ row: 0, severity: 'error', message: 'Failist ei leitud ühtegi sõna.' });
  }

  return { rows, unitTitles, issues, emptyRows, sectionRows };
}

/* --------------------------------------------------------------- diffing */

export type ExistingWord = {
  id: string;
  estonian: string;
  english: string;
  pronunciation: string;
  acceptedAnswers: string[];
  position: number;
  retired: boolean;
  hasHistory: boolean;
};

export type ExistingUnit = {
  id: string;
  unitNumber: number;
  title: string;
  words: ExistingWord[];
};

export type WordValues = {
  estonian: string;
  english: string;
  pronunciation: string;
  acceptedAnswers: string[];
};

export type PlannedWordChange =
  | { kind: 'new'; row: number; position: number; values: WordValues }
  | { kind: 'updated'; row: number; position: number; wordId: string; values: WordValues; hasHistory: boolean }
  | { kind: 'unchanged'; row: number; position: number; wordId: string }
  | { kind: 'restored'; row: number; position: number; wordId: string; values: WordValues }
  | { kind: 'kept'; position: number; wordId: string }
  | { kind: 'retired'; wordId: string; hasHistory: boolean; english: string };

export type PlannedUnitCounts = Record<PlannedWordChange['kind'], number>;

export type PlannedUnit = {
  unitNumber: number;
  unitId: string | null;
  title: string;
  titleChanged: boolean;
  changes: PlannedWordChange[];
  counts: PlannedUnitCounts;
  activeWordCount: number;
};

export type ImportPlan = {
  mode: ImportMode;
  units: PlannedUnit[];
  issues: ImportIssue[];
  canCommit: boolean;
  totals: { rows: number; units: number; newUnits: number; emptyRows: number; sectionRows: number; errors: number; warnings: number } & PlannedUnitCounts;
};

function emptyCounts(): PlannedUnitCounts {
  return { new: 0, updated: 0, unchanged: 0, restored: 0, kept: 0, retired: 0 };
}

function sameList(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

export function planImport(parsed: ParsedImport, existingUnits: readonly ExistingUnit[], mode: ImportMode): ImportPlan {
  const issues = [...parsed.issues];
  const byNumber = new Map(existingUnits.map((unit) => [unit.unitNumber, unit]));
  const unitNumbers = [...new Set(parsed.rows.map((row) => row.unitNumber))].sort((left, right) => left - right);
  const units: PlannedUnit[] = [];

  for (const unitNumber of unitNumbers) {
    const existing = byNumber.get(unitNumber) ?? null;
    const importRows = parsed.rows.filter((row) => row.unitNumber === unitNumber);
    const active = new Map<string, ExistingWord>();
    const retired = new Map<string, ExistingWord>();
    for (const word of existing?.words ?? []) {
      (word.retired ? retired : active).set(wordKey(word.estonian, word.english), word);
    }
    const changes: PlannedWordChange[] = [];
    const matched = new Set<string>();

    importRows.forEach((row, index) => {
      const position = index + 1;
      const key = wordKey(row.estonian, row.english);
      const values: WordValues = { estonian: row.estonian, english: row.english, pronunciation: row.pronunciation, acceptedAnswers: row.acceptedAnswers };
      const current = active.get(key);
      if (current) {
        matched.add(current.id);
        const same = current.estonian === values.estonian && current.english === values.english &&
          current.pronunciation === values.pronunciation && sameList(current.acceptedAnswers, values.acceptedAnswers) && current.position === position;
        changes.push(same
          ? { kind: 'unchanged', row: row.row, position, wordId: current.id }
          : { kind: 'updated', row: row.row, position, wordId: current.id, values, hasHistory: current.hasHistory });
        return;
      }
      const old = retired.get(key);
      if (old) {
        changes.push({ kind: 'restored', row: row.row, position, wordId: old.id, values });
        return;
      }
      changes.push({ kind: 'new', row: row.row, position, values });
    });

    let position = importRows.length;
    const leftovers = [...active.values()].filter((word) => !matched.has(word.id)).sort((left, right) => left.position - right.position);
    for (const word of leftovers) {
      if (mode === 'replace') {
        changes.push({ kind: 'retired', wordId: word.id, hasHistory: word.hasHistory, english: word.english });
      } else {
        position += 1;
        changes.push({ kind: 'kept', position, wordId: word.id });
      }
    }
    const withHistory = changes.filter((change) => change.kind === 'retired' && change.hasHistory).length;
    if (withHistory > 0) {
      issues.push({ row: 0, severity: 'warning', message: `Unit ${unitNumber}: ${withHistory} sõna, mida laps on juba harjutanud, peidetakse. Nende ajalugu ja statistika jäävad alles.` });
    }

    const counts = emptyCounts();
    for (const change of changes) counts[change.kind] += 1;
    const importedTitle = parsed.unitTitles[unitNumber];
    const title = importedTitle || existing?.title || `Unit ${unitNumber}`;
    units.push({
      unitNumber,
      unitId: existing?.id ?? null,
      title,
      titleChanged: Boolean(existing && importedTitle && importedTitle !== existing.title),
      changes,
      counts,
      activeWordCount: changes.filter((change) => change.kind !== 'retired').length
    });
  }

  const totals = emptyCounts();
  for (const unit of units) for (const kind of Object.keys(totals) as Array<keyof PlannedUnitCounts>) totals[kind] += unit.counts[kind];
  const errors = issues.filter((issue) => issue.severity === 'error').length;
  return {
    mode,
    units,
    issues,
    canCommit: errors === 0 && units.length > 0,
    totals: {
      ...totals,
      rows: parsed.rows.length,
      units: units.length,
      newUnits: units.filter((unit) => unit.unitId === null).length,
      emptyRows: parsed.emptyRows,
      sectionRows: parsed.sectionRows,
      errors,
      warnings: issues.length - errors
    }
  };
}

/* --------------------------------------------------- mapping suggestion */

const HEADER_PATTERNS: Array<[keyof Pick<ImportMapping, 'english' | 'estonian' | 'pronunciation' | 'accepted' | 'unit' | 'title'>, RegExp]> = [
  ['accepted', /accepted|alternative|lubatud|vastuv[õo]etav|variandid/iu],
  ['pronunciation', /pronunciation|h[äa][äa]ldus|transkriptsioon|transcription|ipa/iu],
  ['english', /^(english|inglise|ingliskeelne|eng|en)\b/iu],
  ['estonian', /^(estonian|eesti|eestikeelne|est|et)\b/iu],
  ['unit', /^(unit|[õo]ppet[üu]kk|peat[üu]kk)\b/iu],
  ['title', /^(title|pealkiri|teema)\b/iu]
];

// A best guess the parent can change in the mapping form. Looks for a header
// row in the first rows, then for "UNIT n | …" section rows.
export function suggestImportMapping(table: ImportTable): ImportMapping {
  const mapping: ImportMapping = { headerRow: null, english: 0, estonian: 1, pronunciation: null, accepted: null, unit: null, title: null, unitHeaderRows: false };
  for (let index = 0; index < Math.min(table.length, 15); index += 1) {
    const found: Partial<ImportMapping> = {};
    table[index].forEach((cell, column) => {
      const text = cell.v.trim();
      if (!text || cell.t !== 's') return;
      for (const [field, pattern] of HEADER_PATTERNS) {
        if (pattern.test(text) && found[field] === undefined) { found[field] = column; break; }
      }
    });
    if (found.english !== undefined && found.estonian !== undefined) {
      Object.assign(mapping, found, { headerRow: index });
      break;
    }
  }
  if (mapping.unit === null) {
    const start = mapping.headerRow === null ? 0 : mapping.headerRow + 1;
    mapping.unitHeaderRows = table.slice(start).some((row) => row.some((cell) => cell.t === 's' && parseUnitSection(cell.v) !== null));
  }
  return mapping;
}
