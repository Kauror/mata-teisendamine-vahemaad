import { NextResponse } from 'next/server';
import { VocabRuleError } from '@/lib/vocabulary/engine';
import { IMPORT_LIMITS, type ImportCell, type ImportCellType, type ImportMapping, type ImportMode, type ImportTable } from '@/lib/vocabulary/importPlan';
import { SpreadsheetError } from '@/lib/server/vocabulary/spreadsheet';
import { VocabForbiddenError, VocabStaleError } from '@/lib/server/vocabulary/sessions';
import { VocabConflictError, VocabNotFoundError, VocabValidationError } from '@/lib/server/vocabulary/units';

// One mapping from the module's error types to HTTP, shared by every route, so
// a locked unit is always 403 and a stale tab always 409 with the fresh state.
export function vocabErrorResponse(error: unknown) {
  if (error instanceof VocabStaleError) return NextResponse.json({ code: 'stale', message: error.message, session: error.view }, { status: 409 });
  if (error instanceof VocabForbiddenError) return NextResponse.json({ code: 'forbidden', message: error.message }, { status: 403 });
  if (error instanceof VocabNotFoundError) return NextResponse.json({ code: 'not_found', message: error.message }, { status: 404 });
  if (error instanceof VocabConflictError) return NextResponse.json({ code: 'conflict', message: error.message }, { status: 409 });
  if (error instanceof VocabValidationError || error instanceof VocabRuleError || error instanceof SpreadsheetError) {
    return NextResponse.json({ code: 'invalid', message: error.message }, { status: 400 });
  }
  console.error('Vocabulary request failed', error);
  return NextResponse.json({ code: 'server_error', message: 'Midagi läks valesti. Proovi uuesti.' }, { status: 500 });
}

const CELL_TYPES: ReadonlySet<ImportCellType> = new Set(['s', 'n', 'b', 'e', 'empty']);
const MAX_CELL_LENGTH = 2000;

// The import table comes back from the browser for preview and commit, so it
// is re-validated here as untrusted input.
export function parseImportTable(value: unknown): ImportTable {
  if (!Array.isArray(value) || value.length > IMPORT_LIMITS.maxRows) throw new VocabValidationError('Tabel on vigane või liiga suur.');
  return value.map((row) => {
    if (!Array.isArray(row) || row.length > IMPORT_LIMITS.maxColumns) throw new VocabValidationError('Tabeli rida on vigane.');
    return row.map((cell): ImportCell => {
      const record = cell as { v?: unknown; t?: unknown } | null;
      const text = typeof record?.v === 'string' ? record.v : '';
      const type = CELL_TYPES.has(record?.t as ImportCellType) ? record!.t as ImportCellType : 'empty';
      if (text.length > MAX_CELL_LENGTH) throw new VocabValidationError('Tabeli lahter on liiga pikk.');
      return { v: text, t: text ? type : 'empty' };
    });
  });
}

function column(value: unknown, required: boolean): number | null {
  if (value === null || value === undefined || value === '') {
    if (required) throw new VocabValidationError('Vali kõik kohustuslikud veerud.');
    return null;
  }
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number >= IMPORT_LIMITS.maxColumns) throw new VocabValidationError('Veerg on vigane.');
  return number;
}

export function parseImportMapping(value: unknown): ImportMapping {
  const raw = (value ?? {}) as Record<string, unknown>;
  const headerRow = raw.headerRow === null || raw.headerRow === undefined || raw.headerRow === '' ? null : Number(raw.headerRow);
  if (headerRow !== null && (!Number.isInteger(headerRow) || headerRow < 0 || headerRow >= IMPORT_LIMITS.maxRows)) throw new VocabValidationError('Päiserea number on vigane.');
  return {
    headerRow,
    english: column(raw.english, true)!,
    estonian: column(raw.estonian, true)!,
    pronunciation: column(raw.pronunciation, false),
    accepted: column(raw.accepted, false),
    unit: column(raw.unit, false),
    title: column(raw.title, false),
    unitHeaderRows: raw.unitHeaderRows === true
  };
}

export function parseImportMode(value: unknown): ImportMode {
  if (value === 'merge' || value === 'replace') return value;
  throw new VocabValidationError('Impordi viis on vigane.');
}
