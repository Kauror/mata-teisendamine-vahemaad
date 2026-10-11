import { describe, expect, it } from 'vitest';
import { readSpreadsheet, SpreadsheetError } from '@/lib/server/vocabulary/spreadsheet';
import { buildXlsx, buildZip } from '@/lib/server/vocabulary/testZip';
import {
  parseImportRows,
  planImport,
  suggestImportMapping,
  type ExistingUnit,
  type ImportMapping,
  type ImportTable
} from '@/lib/vocabulary/importPlan';

const COLUMN_MAPPING: ImportMapping = { headerRow: 0, unit: 0, estonian: 1, english: 2, pronunciation: 3, accepted: 4, title: null, unitHeaderRows: false };

function table(rows: Array<Array<string | null>>): ImportTable {
  return rows.map((row) => row.map((value) => value === null || value === '' ? { v: '', t: 'empty' as const } : { v: value, t: 's' as const }));
}

describe('spreadsheet reader', () => {
  it('reads shared strings, inline strings, numbers and gaps from a real .xlsx zip', () => {
    const buffer = buildXlsx([{ name: 'Sõnad', rows: [['unit', 'estonian', 'english', 'pronunciation'], [7, 'kass', 'cat', '/kæt/'], [7, 'koer', null, '/dɒɡ/']] }]);
    const file = readSpreadsheet(buffer, 'sonad.xlsx');
    expect(file.format).toBe('xlsx');
    expect(file.sheets[0].name).toBe('Sõnad');
    expect(file.sheets[0].rows[1]).toEqual([{ v: '7', t: 'n' }, { v: 'kass', t: 's' }, { v: 'cat', t: 's' }, { v: '/kæt/', t: 's' }]);
    expect(file.sheets[0].rows[2][2]).toEqual({ v: '', t: 'empty' });

    const inline = readSpreadsheet(buildXlsx([{ name: 'A', rows: [['tänu & rõõm', "[ʌn'du:]"]] }], { inline: true }));
    expect(inline.sheets[0].rows[0].map((cell) => cell.v)).toEqual(['tänu & rõõm', "[ʌn'du:]"]);
  });

  it('reads every sheet and stored (uncompressed) entries', () => {
    const buffer = buildXlsx([{ name: 'Units 3-20', rows: [['a']] }, { name: 'Unit 3', rows: [['b']] }]);
    expect(readSpreadsheet(buffer).sheets.map((sheet) => sheet.name)).toEqual(['Units 3-20', 'Unit 3']);
    const stored = buildZip({
      'xl/workbook.xml': '<workbook><sheets><sheet name="S" r:id="rId1"/></sheets></workbook>',
      'xl/_rels/workbook.xml.rels': '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/></Relationships>',
      'xl/worksheets/sheet1.xml': '<worksheet><sheetData><row r="2"><c r="B2" t="inlineStr"><is><t>x</t></is></c></row></sheetData></worksheet>'
    }, { store: true });
    expect(readSpreadsheet(stored).sheets[0].rows).toEqual([[], [{ v: '', t: 'empty' }, { v: 'x', t: 's' }]]);
  });

  it('reads UTF-8 CSV with a BOM, quoted commas and IPA, and tab-separated text', () => {
    const csv = Buffer.from('\uFEFF' + 'English,Pronunciation,Estonian\nextra,[\'ekstrə],"lisa-, ülearune"\r\n"say ""hi""",,ütle\n', 'utf8');
    const file = readSpreadsheet(csv, 'words.csv');
    expect(file.format).toBe('csv');
    expect(file.sheets[0].rows[1].map((cell) => cell.v)).toEqual(['extra', "['ekstrə]", 'lisa-, ülearune']);
    expect(file.sheets[0].rows[2][0].v).toBe('say "hi"');
    const tsv = readSpreadsheet(Buffer.from('unit\testonian\tenglish\n7\tkass\tcat', 'utf8'));
    expect(tsv.format).toBe('tsv');
    expect(tsv.sheets[0].rows[1].map((cell) => cell.v)).toEqual(['7', 'kass', 'cat']);
  });

  it('rejects broken, legacy and oversized files with a clear message', () => {
    expect(() => readSpreadsheet(Buffer.from('PK\u0003\u0004garbage'))).toThrow(SpreadsheetError);
    expect(() => readSpreadsheet(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]), 'old.xls')).toThrow(/xls/u);
    expect(() => readSpreadsheet(Buffer.alloc(0))).toThrow(SpreadsheetError);
    expect(() => readSpreadsheet(Buffer.alloc(6 * 1024 * 1024, 65))).toThrow(/5 MB/u);
    expect(() => readSpreadsheet(Buffer.from([0x61, 0xff, 0xfe, 0x62]))).toThrow(/UTF-8/u);
  });
});

describe('import validation', () => {
  it('validates required fields, units, types, lengths and duplicates without silently skipping', () => {
    const parsed = parseImportRows([
      ...table([
        ['unit', 'estonian', 'english', 'pronunciation', 'accepted'],
        ['7', 'kass', 'cat', '/kæt/', ''],
        ['', '', '', '', ''],
        ['7', '', 'dog', '', ''],
        ['7', 'maja', '', '', ''],
        ['x', 'puu', 'tree', '', ''],
        ['1000', 'puu', 'tree', '', ''],
        ['7', 'kass', 'Cat', '', ''],
        ['7', 'pikk', 'a'.repeat(201), '', ''],
        ['7', 'ema', 'mum', '', '["mom", 5]']
      ]),
      [{ v: '7', t: 'n' }, { v: '42', t: 'n' }, { v: 'number', t: 's' }],
      [{ v: '7', t: 'n' }, { v: 'vale', t: 's' }, { v: '#N/A', t: 'e' }]
    ], COLUMN_MAPPING);
    const errors = parsed.issues.filter((issue) => issue.severity === 'error');
    expect(parsed.rows.map((row) => row.english)).toEqual(['cat']);
    expect(parsed.emptyRows).toBe(1);
    expect(errors.map((issue) => issue.row)).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12]);
    expect(errors.find((issue) => issue.row === 8)?.message).toMatch(/real 2/u);
    expect(errors.find((issue) => issue.row === 11)?.message).toMatch(/arv/u);
    expect(errors.find((issue) => issue.row === 12)?.message).toMatch(/Exceli viga/u);
  });

  it('preserves accents, IPA, punctuation and multiword expressions exactly', () => {
    const parsed = parseImportRows(table([
      ['unit', 'estonian', 'english', 'pronunciation', 'accepted'],
      ['Unit 3', 'Nagu näiteks? Missugune siis?', 'Like what?', '', ''],
      ['3', 'lahti siduma, lahti tegema', 'undo', "[ʌn'du:]", ''],
      ['3', 'ema', 'mum', '/mʌm/', 'mom; mummy | Mum']
    ]), COLUMN_MAPPING);
    expect(parsed.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(parsed.rows[0]).toMatchObject({ unitNumber: 3, estonian: 'Nagu näiteks? Missugune siis?', english: 'Like what?' });
    expect(parsed.rows[1].pronunciation).toBe("[ʌn'du:]");
    // The duplicate of the main answer ("Mum" = "mum") is dropped.
    expect(parsed.rows[2].acceptedAnswers).toEqual(['mom', 'mummy']);
  });

  it('reads the textbook layout: a title row, a header row and "UNIT n | Title" section rows', () => {
    const rows = table([
      ['ENGLISH–ESTONIAN VOCABULARY  |  UNITS 3–20', null, null],
      ['680 vocabulary entries', null, null],
      ['English', 'Pronunciation', 'Estonian'],
      ['UNIT 3  |   Thank you', null, null],
      ['friendly', "['frendli]", 'sõbralik'],
      ['good deed', null, 'heategu'],
      ['UNIT 4  |   Zoo', null, null],
      ['at / in the zoo', null, 'loomaaias'],
      ['lunch', '[lʌntʃ]', 'keskpäevaeine,']
    ]);
    const mapping = suggestImportMapping(rows);
    expect(mapping).toMatchObject({ headerRow: 2, english: 0, pronunciation: 1, estonian: 2, unit: null, unitHeaderRows: true });
    const parsed = parseImportRows(rows, mapping);
    expect(parsed.issues.filter((issue) => issue.severity === 'error')).toEqual([]);
    expect(parsed.unitTitles).toEqual({ 3: 'Thank you', 4: 'Zoo' });
    expect(parsed.sectionRows).toBe(2);
    expect(parsed.rows.map((row) => [row.unitNumber, row.english, row.pronunciation])).toEqual([
      [3, 'friendly', "['frendli]"],
      [3, 'good deed', ''],
      [4, 'at / in the zoo', ''],
      [4, 'lunch', '[lʌntʃ]']
    ]);
    const warnings = parsed.issues.filter((issue) => issue.severity === 'warning').map((issue) => issue.row);
    expect(warnings).toEqual([8, 9]);
  });

  it('rejects data rows that come before the first unit, and invalid accepted-answer structures', () => {
    const parsed = parseImportRows(table([
      ['English', 'Estonian', 'Accepted'],
      ['cat', 'kass', ''],
      ['UNIT 3', null, null],
      ['dog', 'koer', '["dogs"']
    ]), { headerRow: 0, english: 0, estonian: 1, accepted: 2, pronunciation: null, unit: null, title: null, unitHeaderRows: true });
    expect(parsed.rows).toEqual([]);
    expect(parsed.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.row)).toEqual([2, 4]);
  });

  it('warns when one Estonian prompt has two different answers in a unit', () => {
    const parsed = parseImportRows(table([
      ['unit', 'estonian', 'english', 'pronunciation', 'accepted'],
      ['1', 'Tere!', 'Hello.', '', ''],
      ['1', 'Tere!', 'Hi.', '', '']
    ]), COLUMN_MAPPING);
    expect(parsed.rows).toHaveLength(2);
    expect(parsed.issues).toEqual([expect.objectContaining({ severity: 'warning', row: 3 })]);
  });
});

describe('import planning and safe edits', () => {
  const existing: ExistingUnit[] = [{
    id: 'u7',
    unitNumber: 7,
    title: 'My day',
    words: [
      { id: 'w-cat', estonian: 'kass', english: 'cat', pronunciation: '', acceptedAnswers: [], position: 1, retired: false, hasHistory: true },
      { id: 'w-dog', estonian: 'koer', english: 'dog', pronunciation: '/dɒɡ/', acceptedAnswers: [], position: 2, retired: false, hasHistory: true },
      { id: 'w-old', estonian: 'maja', english: 'hause', pronunciation: '', acceptedAnswers: [], position: 3, retired: false, hasHistory: true },
      { id: 'w-gone', estonian: 'puu', english: 'tree', pronunciation: '', acceptedAnswers: [], position: 4, retired: true, hasHistory: false }
    ]
  }];
  const rows = table([
    ['unit', 'estonian', 'english', 'pronunciation', 'accepted'],
    ['7', 'kass', 'cat', '/kæt/', ''],
    ['7', 'koer', 'dog', '/dɒɡ/', ''],
    ['7', 'maja', 'house', '/haʊs/', ''],
    ['7', 'puu', 'tree', '', ''],
    ['8', 'kool', 'school', '', '']
  ]);

  it('keeps ids for matching words, adds a corrected spelling as new and never retires in merge mode', () => {
    const plan = planImport(parseImportRows(rows, COLUMN_MAPPING), existing, 'merge');
    const unit7 = plan.units.find((unit) => unit.unitNumber === 7)!;
    expect(unit7.changes.map((change) => change.kind)).toEqual(['updated', 'unchanged', 'new', 'restored', 'kept']);
    expect(unit7.changes[0]).toMatchObject({ kind: 'updated', wordId: 'w-cat', hasHistory: true });
    expect(unit7.changes[4]).toMatchObject({ kind: 'kept', wordId: 'w-old', position: 5 });
    expect(plan.units.find((unit) => unit.unitNumber === 8)).toMatchObject({ unitId: null, title: 'Unit 8' });
    expect(plan.canCommit).toBe(true);
    expect(plan.totals).toMatchObject({ units: 2, newUnits: 1, new: 2, retired: 0 });
  });

  it('retires missing words in replace mode and warns that their history is kept', () => {
    const plan = planImport(parseImportRows(rows, COLUMN_MAPPING), existing, 'replace');
    const unit7 = plan.units.find((unit) => unit.unitNumber === 7)!;
    expect(unit7.changes.at(-1)).toMatchObject({ kind: 'retired', wordId: 'w-old', hasHistory: true });
    expect(plan.issues.some((issue) => issue.severity === 'warning' && /ajalugu/u.test(issue.message))).toBe(true);
  });

  it('refuses to commit anything when a single row is invalid', () => {
    const plan = planImport(parseImportRows(table([
      ['unit', 'estonian', 'english', 'pronunciation', 'accepted'],
      ['7', 'kass', 'cat', '', ''],
      ['7', '', 'dog', '', '']
    ]), COLUMN_MAPPING), existing, 'merge');
    expect(plan.canCommit).toBe(false);
  });
});
