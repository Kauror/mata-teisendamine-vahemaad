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
//   - "merge" mode never retires anything, and leaves words that are not in the
//     file where they are whenever their position is still free.
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
  // The unit for rows before any section row, e.g. from a sheet named
  // "Unit 3". Optional so older callers stay valid.
  defaultUnit?: number | null;
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
  // Which optional columns the file actually has. A column that is not in the
  // file leaves the stored value alone (a file without accepted answers must
  // not erase the ones added in the app). Optional for older callers: absent
  // means "present", the previous behaviour.
  fields?: { pronunciation: boolean; accepted: boolean };
};

export const IMPORT_LIMITS = {
  // Data rows (words, section rows and rejected rows). Empty rows and the
  // header do not count.
  maxRows: 5000,
  // Rows a table may span, empty rows included.
  maxTableRows: 20000,
  maxColumns: 30,
  maxUnits: 100,
  maxWordLength: 200,
  maxPronunciationLength: 100,
  maxTitleLength: 80,
  maxAcceptedAnswers: 10,
  minUnitNumber: 1,
  maxUnitNumber: 999
} as const;

const UNIT_WORD = /^\s*(?:unit|õppetükk|peatükk)\s*(\d+)(.*)$/iu;
const UNIT_VALUE = /^\s*(?:unit|õppetükk|peatükk)?\s*0*(\d{1,3})(?:\.0+)?\s*$/iu;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;
const MULTI_FORM = /\s\/\s|;|,|\(|\.\.\.|…/u;
// Characters that are invisible on screen but make a word impossible to type:
// soft hyphen, zero-width space/joiners, word joiner and byte-order mark.
const INVISIBLE = new RegExp(`[${[0x00ad, 0x200b, 0x200c, 0x200d, 0x2060, 0xfeff].map((code) => String.fromCharCode(code)).join('')}]`, 'gu');

function cellAt(row: ImportCell[] | undefined, index: number | null): ImportCell {
  if (index === null || !row) return { v: '', t: 'empty' };
  return row[index] ?? { v: '', t: 'empty' };
}

export function stripInvisible(value: string) {
  return value.replace(INVISIBLE, '');
}

function collapse(value: string) {
  return stripInvisible(value.normalize('NFC')).replace(/\s+/gu, ' ').trim();
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

export type UnitSection = { unitNumber: number; title: string } | { ambiguous: true; text: string };

// A row that starts a unit: "UNIT 3 | Thank you", "Unit 3: Zoo", "Unit 03",
// "Unit 3 Animals", "Unit 3 / Animals", "Unit 3 (Animals)", "Unit 7, Food".
// A range or a decimal ("UNIT 3 – 4 Review", "unit 3.5") is ambiguous and is
// reported rather than guessed.
export function parseUnitSection(value: string): UnitSection | null {
  const match = collapse(value).match(UNIT_WORD);
  if (!match) return null;
  const digits = match[1];
  const rest = match[2];
  if (/^\s*[.,]\d/u.test(rest) || /^\s*[-–—]\s*\d/u.test(rest)) return { ambiguous: true, text: collapse(value) };
  let title = rest.replace(/^\s*[|:.\-–—,/]+\s*/u, '').trim();
  if (/^\(.*\)$/u.test(title)) title = title.slice(1, -1).trim();
  return { unitNumber: Number(digits), title };
}

function validUnitNumber(value: number) {
  return Number.isInteger(value) && value >= IMPORT_LIMITS.minUnitNumber && value <= IMPORT_LIMITS.maxUnitNumber;
}

function parseAccepted(raw: string, row: number, english: string, issues: ImportIssue[]): string[] | null {
  const text = raw.trim();
  if (!text) return [];
  let entries: string[];
  // A JSON list when it looks like one — bracketed end to end, or quoted
  // ('["dogs"' is a broken list). "[the] cat" is an ordinary answer.
  if (text.startsWith('[') && (text.endsWith(']') || text.includes('"'))) {
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

// The section a row starts, if any: the first text cell of a row whose word
// columns are otherwise empty.
function sectionOf(row: ImportCell[] | undefined, mapping: ImportMapping): UnitSection | null {
  if (!row) return null;
  const english = cellAt(row, mapping.english).v.trim();
  const estonian = cellAt(row, mapping.estonian).v.trim();
  if (english && estonian) return null;
  const candidate = row.find((cell) => cell.t === 's' && cell.v.trim());
  return candidate ? parseUnitSection(candidate.v) : null;
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
  const defaultUnit = mapping.defaultUnit != null && validUnitNumber(mapping.defaultUnit) ? mapping.defaultUnit : null;
  if (mapping.unit === null && !mapping.unitHeaderRows && defaultUnit === null) {
    return { rows, unitTitles, issues: [{ row: 0, severity: 'error', message: 'Vali õppetüki veerg või luba õppetüki pealkirjaread („UNIT 3 | …“).' }], emptyRows, sectionRows };
  }
  if (table.length > IMPORT_LIMITS.maxTableRows) {
    return { rows, unitTitles, issues: [{ row: 0, severity: 'error', message: `Tabelis on rohkem kui ${IMPORT_LIMITS.maxTableRows} rida.` }], emptyRows, sectionRows };
  }

  const start = mapping.headerRow === null ? 0 : mapping.headerRow + 1;
  let sectionUnit: number | null = defaultUnit;
  const setTitle = (unitNumber: number, title: string, row: number) => {
    const clean = title.slice(0, IMPORT_LIMITS.maxTitleLength);
    if (!clean) return;
    // The first title wins, from a section row or a title column alike.
    if (unitTitles[unitNumber] && unitTitles[unitNumber] !== clean) {
      issues.push({ row, severity: 'warning', message: `Unit ${unitNumber} pealkiri on mitmel kujul; kasutatakse „${unitTitles[unitNumber]}“.` });
      return;
    }
    unitTitles[unitNumber] = clean;
  };
  const sectionStarts = new Map<number, number>();

  // A unit heading above the header row (one sheet per unit) still applies.
  if (mapping.unitHeaderRows) {
    for (let index = 0; index < start && index < table.length; index += 1) {
      const section = sectionOf(table[index], mapping);
      if (section && 'unitNumber' in section && validUnitNumber(section.unitNumber)) {
        sectionUnit = section.unitNumber;
        sectionRows += 1;
        sectionStarts.set(section.unitNumber, index + 1);
        setTitle(section.unitNumber, section.title, index + 1);
      }
    }
  }

  const seen = new Map<string, number>();
  let dataRows = 0;

  for (let index = start; index < table.length; index += 1) {
    const row = table[index];
    const rowNumber = index + 1;
    if (isEmptyRow(row)) { emptyRows += 1; continue; }
    dataRows += 1;
    if (dataRows > IMPORT_LIMITS.maxRows) {
      issues.push({ row: rowNumber, severity: 'error', message: `Failis on rohkem kui ${IMPORT_LIMITS.maxRows} andmerida.` });
      break;
    }

    if (mapping.unitHeaderRows) {
      const section = sectionOf(row, mapping);
      if (section) {
        sectionRows += 1;
        if ('ambiguous' in section) {
          issues.push({ row: rowNumber, severity: 'error', message: `Õppetüki pealkirjarida „${section.text}“ on mitmeti mõistetav. Kirjuta üks number, nt „UNIT 3 | Pealkiri“.` });
          sectionUnit = null;
          continue;
        }
        if (!validUnitNumber(section.unitNumber)) {
          issues.push({ row: rowNumber, severity: 'error', message: `Õppetüki number ${section.unitNumber} ei ole lubatud (1–${IMPORT_LIMITS.maxUnitNumber}).` });
          sectionUnit = null;
          continue;
        }
        sectionUnit = section.unitNumber;
        sectionStarts.set(section.unitNumber, rowNumber);
        setTitle(section.unitNumber, section.title, rowNumber);
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

    const english = textField(cellAt(row, mapping.english), 'Ingliskeelne sõna', rowNumber, issues);
    const estonian = textField(cellAt(row, mapping.estonian), 'Eestikeelne sõna', rowNumber, issues);
    if (english === null || estonian === null) continue;
    if (!english) { issues.push({ row: rowNumber, severity: 'error', message: 'Ingliskeelne sõna puudub.' }); continue; }
    if (!estonian) { issues.push({ row: rowNumber, severity: 'error', message: 'Eestikeelne sõna puudub.' }); continue; }

    const pronunciationCell = cellAt(row, mapping.pronunciation);
    // Kept exactly as written (brackets, IPA symbols, stress marks), apart from
    // surrounding spaces and invisible characters. Never generated.
    const pronunciation = pronunciationCell.t === 'empty' ? '' : stripInvisible(pronunciationCell.v.normalize('NFC')).trim();
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

    if (mapping.title !== null) setTitle(unitNumber, collapse(cellAt(row, mapping.title).v), rowNumber);

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
  for (const [unitNumber, row] of sectionStarts) {
    if (!unitNumbers.has(unitNumber)) issues.push({ row, severity: 'warning', message: `Unit ${unitNumber} pealkirjarea all pole ühtegi sõna; seda õppetükki ei looda.` });
  }
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

  return { rows, unitTitles, issues, emptyRows, sectionRows, fields: { pronunciation: mapping.pronunciation !== null, accepted: mapping.accepted !== null } };
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
  | { kind: 'kept'; position: number; wordId: string; moved: boolean }
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

// Several stored words can share a key (added by hand before duplicates were
// refused). The one with history is the one an import continues.
function preferHistory(words: ExistingWord[]) {
  return [...words].sort((left, right) => Number(right.hasHistory) - Number(left.hasHistory) || left.position - right.position);
}

export function planImport(parsed: ParsedImport, existingUnits: readonly ExistingUnit[], mode: ImportMode): ImportPlan {
  const issues = [...parsed.issues];
  const byNumber = new Map(existingUnits.map((unit) => [unit.unitNumber, unit]));
  const unitNumbers = [...new Set(parsed.rows.map((row) => row.unitNumber))].sort((left, right) => left - right);
  const units: PlannedUnit[] = [];

  for (const unitNumber of unitNumbers) {
    const existing = byNumber.get(unitNumber) ?? null;
    const importRows = parsed.rows.filter((row) => row.unitNumber === unitNumber);
    const active = new Map<string, ExistingWord[]>();
    const retired = new Map<string, ExistingWord[]>();
    for (const word of existing?.words ?? []) {
      const target = word.retired ? retired : active;
      const key = wordKey(word.estonian, word.english);
      target.set(key, [...(target.get(key) ?? []), word]);
    }
    const changes: PlannedWordChange[] = [];
    const matched = new Set<string>();

    importRows.forEach((row, index) => {
      const position = index + 1;
      const key = wordKey(row.estonian, row.english);
      const current = preferHistory(active.get(key) ?? [])[0];
      const old = current ? undefined : preferHistory(retired.get(key) ?? [])[0];
      const stored = current ?? old;
      const values: WordValues = {
        estonian: row.estonian,
        english: row.english,
        pronunciation: stored && parsed.fields?.pronunciation === false ? stored.pronunciation : row.pronunciation,
        acceptedAnswers: stored && parsed.fields?.accepted === false ? stored.acceptedAnswers : row.acceptedAnswers
      };
      if (current) {
        matched.add(current.id);
        const same = current.estonian === values.estonian && current.english === values.english &&
          current.pronunciation === values.pronunciation && sameList(current.acceptedAnswers, values.acceptedAnswers) && current.position === position;
        changes.push(same
          ? { kind: 'unchanged', row: row.row, position, wordId: current.id }
          : { kind: 'updated', row: row.row, position, wordId: current.id, values, hasHistory: current.hasHistory });
        return;
      }
      if (old) {
        changes.push({ kind: 'restored', row: row.row, position, wordId: old.id, values });
        return;
      }
      changes.push({ kind: 'new', row: row.row, position, values });
    });

    // Words not in the file (and duplicates of a word that is): retired in
    // replace mode, kept in merge mode — in place when their position is free.
    const leftovers = [...active.values()].flat().filter((word) => !matched.has(word.id)).sort((left, right) => left.position - right.position);
    const taken = new Set(changes.map((change) => 'position' in change ? change.position : 0));
    let nextFree = importRows.length;
    for (const word of leftovers) {
      if (mode === 'replace') {
        changes.push({ kind: 'retired', wordId: word.id, hasHistory: word.hasHistory, english: word.english });
        continue;
      }
      let position = word.position;
      if (position <= importRows.length || taken.has(position)) {
        do { nextFree += 1; } while (taken.has(nextFree));
        position = nextFree;
      }
      taken.add(position);
      changes.push({ kind: 'kept', position, wordId: word.id, moved: position !== word.position });
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
// row in the first rows, then for "UNIT n | …" section rows anywhere (also
// above the header, as in one-sheet-per-unit workbooks), and finally for a
// sheet named after a unit.
export function suggestImportMapping(table: ImportTable, sheetName = ''): ImportMapping {
  const mapping: ImportMapping = { headerRow: null, english: 0, estonian: 1, pronunciation: null, accepted: null, unit: null, title: null, unitHeaderRows: false, defaultUnit: null };
  for (let index = 0; index < Math.min(table.length, 15); index += 1) {
    const found: Partial<ImportMapping> = {};
    (table[index] ?? []).forEach((cell, column) => {
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
    mapping.unitHeaderRows = table.some((row, index) => index !== mapping.headerRow && (row ?? []).some((cell) => {
      if (cell.t !== 's') return false;
      const section = parseUnitSection(cell.v);
      return section !== null && 'unitNumber' in section;
    }));
    const fromName = parseUnitSection(sheetName);
    if (fromName && 'unitNumber' in fromName && validUnitNumber(fromName.unitNumber)) mapping.defaultUnit = fromName.unitNumber;
  }
  return mapping;
}
