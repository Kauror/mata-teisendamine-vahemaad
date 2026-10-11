import { inflateRawSync } from 'node:zlib';
import { IMPORT_LIMITS, type ImportCell, type ImportTable } from '@/lib/vocabulary/importPlan';

// Reads the parent's vocabulary file into plain tables of text cells. Supports
// .xlsx (the intended format), CSV and tab-separated text.
//
// No spreadsheet library: an .xlsx file is a zip of XML parts, and the app
// needs only cell values — no formulas, styles or dates. Reading it with
// node:zlib keeps the dependency tree (and its CVE surface) unchanged. The
// reader is defensive: sizes and counts are bounded before anything is
// inflated, and anything unexpected is a clear error, never a crash.

export type SpreadsheetSheet = { name: string; rows: ImportTable };
export type SpreadsheetFile = { format: 'xlsx' | 'csv' | 'tsv'; sheets: SpreadsheetSheet[] };

export class SpreadsheetError extends Error {}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_UNCOMPRESSED_BYTES = 40 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 2000;
const MAX_SHEETS = 50;

/* -------------------------------------------------------------- zip */

type ZipEntry = { name: string; method: number; compressedSize: number; size: number; offset: number };

function readZipEntries(buffer: Buffer): Map<string, ZipEntry> {
  // End of central directory: fixed 22 bytes plus a comment of up to 64 KiB.
  const searchFrom = Math.max(0, buffer.length - 22 - 0xffff);
  let eocd = -1;
  for (let index = buffer.length - 22; index >= searchFrom; index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) { eocd = index; break; }
  }
  if (eocd < 0) throw new SpreadsheetError('Fail ei ole korrektne Exceli (.xlsx) fail.');
  const count = buffer.readUInt16LE(eocd + 10);
  const directorySize = buffer.readUInt32LE(eocd + 12);
  const directoryOffset = buffer.readUInt32LE(eocd + 16);
  if (count === 0xffff || directoryOffset === 0xffffffff) throw new SpreadsheetError('See Exceli fail on liiga suur.');
  if (count > MAX_ZIP_ENTRIES || directoryOffset + directorySize > buffer.length) throw new SpreadsheetError('Exceli fail on vigane.');

  const entries = new Map<string, ZipEntry>();
  let cursor = directoryOffset;
  let total = 0;
  for (let index = 0; index < count; index += 1) {
    if (cursor + 46 > buffer.length || buffer.readUInt32LE(cursor) !== 0x02014b50) throw new SpreadsheetError('Exceli fail on vigane.');
    const flags = buffer.readUInt16LE(cursor + 8);
    const method = buffer.readUInt16LE(cursor + 10);
    const compressedSize = buffer.readUInt32LE(cursor + 20);
    const size = buffer.readUInt32LE(cursor + 24);
    const nameLength = buffer.readUInt16LE(cursor + 28);
    const extraLength = buffer.readUInt16LE(cursor + 30);
    const commentLength = buffer.readUInt16LE(cursor + 32);
    const offset = buffer.readUInt32LE(cursor + 42);
    const name = buffer.toString('utf8', cursor + 46, cursor + 46 + nameLength);
    if (flags & 0x1) throw new SpreadsheetError('Parooliga kaitstud Exceli faili ei saa lugeda.');
    total += size;
    if (total > MAX_UNCOMPRESSED_BYTES) throw new SpreadsheetError('Exceli fail on lahtipakituna liiga suur.');
    entries.set(name, { name, method, compressedSize, size, offset });
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}

function readZipText(buffer: Buffer, entries: Map<string, ZipEntry>, name: string): string | null {
  const entry = entries.get(name);
  if (!entry) return null;
  const header = entry.offset;
  if (header + 30 > buffer.length || buffer.readUInt32LE(header) !== 0x04034b50) throw new SpreadsheetError('Exceli fail on vigane.');
  const start = header + 30 + buffer.readUInt16LE(header + 26) + buffer.readUInt16LE(header + 28);
  const end = start + entry.compressedSize;
  if (end > buffer.length) throw new SpreadsheetError('Exceli fail on vigane.');
  const raw = buffer.subarray(start, end);
  let data: Buffer;
  if (entry.method === 0) data = raw;
  else if (entry.method === 8) data = inflateRawSync(raw, { maxOutputLength: Math.max(entry.size, 1) });
  else throw new SpreadsheetError('Exceli faili pakkimisviisi ei toetata.');
  return data.toString('utf8');
}

/* -------------------------------------------------------------- xml */

function decodeXml(value: string) {
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/giu, (match, entity: string) => {
    const lower = entity.toLowerCase();
    if (lower === 'amp') return '&';
    if (lower === 'lt') return '<';
    if (lower === 'gt') return '>';
    if (lower === 'quot') return '"';
    if (lower === 'apos') return "'";
    const code = lower.startsWith('#x') ? parseInt(lower.slice(2), 16) : parseInt(lower.slice(1), 10);
    return Number.isFinite(code) && code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : match;
  });
}

function attribute(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'u'));
  return match ? decodeXml(match[1]) : null;
}

// All <t> text inside a string item, excluding phonetic (<rPh>) runs.
function stringItemText(xml: string) {
  const withoutPhonetic = xml.replace(/<rPh\b[\s\S]*?<\/rPh>/gu, '');
  let text = '';
  for (const match of withoutPhonetic.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>|<t\b[^>]*\/>/gu)) text += decodeXml(match[1] ?? '');
  return text;
}

function columnIndex(reference: string) {
  const letters = reference.match(/^[A-Z]+/u)?.[0] ?? '';
  let index = 0;
  for (const letter of letters) index = index * 26 + (letter.charCodeAt(0) - 64);
  return index - 1;
}

function parseSheetXml(xml: string, sharedStrings: string[]): ImportTable {
  const rows: ImportTable = [];
  const data = xml.match(/<sheetData\b[^>]*>([\s\S]*)<\/sheetData>/u)?.[1] ?? '';
  let nextRow = 0;
  for (const rowMatch of data.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/gu)) {
    const rowNumber = Number(attribute(rowMatch[1], 'r'));
    const rowIndex = Number.isInteger(rowNumber) && rowNumber > 0 ? rowNumber - 1 : nextRow;
    nextRow = rowIndex + 1;
    if (rowIndex >= IMPORT_LIMITS.maxRows) throw new SpreadsheetError(`Lehel on rohkem kui ${IMPORT_LIMITS.maxRows} rida.`);
    const cells: ImportCell[] = [];
    let nextColumn = 0;
    for (const cellMatch of (rowMatch[2] ?? '').matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/gu)) {
      const reference = attribute(cellMatch[1], 'r');
      const column = reference ? columnIndex(reference) : nextColumn;
      nextColumn = column + 1;
      if (column < 0 || column >= IMPORT_LIMITS.maxColumns) continue;
      const type = attribute(cellMatch[1], 't') ?? 'n';
      const body = cellMatch[2] ?? '';
      const value = body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/u)?.[1];
      let cell: ImportCell;
      if (type === 's') {
        const text = value === undefined ? '' : sharedStrings[Number(value)] ?? '';
        cell = { v: text, t: text ? 's' : 'empty' };
      } else if (type === 'inlineStr') {
        const text = stringItemText(body.match(/<is\b[^>]*>([\s\S]*?)<\/is>/u)?.[1] ?? '');
        cell = { v: text, t: text ? 's' : 'empty' };
      } else if (type === 'str') {
        const text = decodeXml(value ?? '');
        cell = { v: text, t: text ? 's' : 'empty' };
      } else if (type === 'b') {
        cell = value === undefined ? { v: '', t: 'empty' } : { v: value === '1' ? 'TRUE' : 'FALSE', t: 'b' };
      } else if (type === 'e') {
        cell = { v: decodeXml(value ?? ''), t: 'e' };
      } else {
        cell = value === undefined || value === '' ? { v: '', t: 'empty' } : { v: decodeXml(value), t: 'n' };
      }
      while (cells.length < column) cells.push({ v: '', t: 'empty' });
      cells[column] = cell;
    }
    while (rows.length < rowIndex) rows.push([]);
    rows[rowIndex] = cells;
  }
  return rows;
}

function resolveTarget(target: string) {
  const clean = target.replace(/^\/+/u, '');
  return clean.startsWith('xl/') ? clean : `xl/${clean}`;
}

export function readXlsx(buffer: Buffer): SpreadsheetSheet[] {
  const entries = readZipEntries(buffer);
  const workbook = readZipText(buffer, entries, 'xl/workbook.xml');
  if (!workbook) throw new SpreadsheetError('Fail ei ole korrektne Exceli (.xlsx) fail.');
  const relationships = readZipText(buffer, entries, 'xl/_rels/workbook.xml.rels') ?? '';
  const targets = new Map<string, string>();
  for (const match of relationships.matchAll(/<Relationship\b([^>]*)\/?>/gu)) {
    const id = attribute(match[1], 'Id');
    const target = attribute(match[1], 'Target');
    if (id && target) targets.set(id, resolveTarget(target));
  }
  const sharedXml = readZipText(buffer, entries, 'xl/sharedStrings.xml') ?? '';
  const sharedStrings = [...sharedXml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/gu)].map((match) => stringItemText(match[1]));

  const sheets: SpreadsheetSheet[] = [];
  for (const match of workbook.matchAll(/<sheet\b([^>]*)\/?>/gu)) {
    if (sheets.length >= MAX_SHEETS) break;
    const name = attribute(match[1], 'name') ?? `Leht ${sheets.length + 1}`;
    const relationId = attribute(match[1], 'r:id');
    const path = relationId ? targets.get(relationId) : undefined;
    const xml = path ? readZipText(buffer, entries, path) : null;
    if (xml === null) continue;
    sheets.push({ name, rows: parseSheetXml(xml, sharedStrings) });
  }
  if (sheets.length === 0) throw new SpreadsheetError('Exceli failist ei leitud ühtegi lehte.');
  return sheets;
}

/* -------------------------------------------------------------- text */

function parseDelimited(text: string, delimiter: string): ImportTable {
  const rows: ImportTable = [];
  let row: ImportCell[] = [];
  let field = '';
  let quoted = false;
  const pushField = () => {
    if (row.length < IMPORT_LIMITS.maxColumns) row.push(field.length ? { v: field, t: 's' } : { v: '', t: 'empty' });
    field = '';
  };
  const pushRow = () => {
    pushField();
    rows.push(row);
    row = [];
    if (rows.length > IMPORT_LIMITS.maxRows) throw new SpreadsheetError(`Failis on rohkem kui ${IMPORT_LIMITS.maxRows} rida.`);
  };
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') { field += '"'; index += 1; } else quoted = false;
      } else field += char;
      continue;
    }
    if (char === '"' && field.length === 0) quoted = true;
    else if (char === delimiter) pushField();
    else if (char === '\n') pushRow();
    else if (char === '\r') { if (text[index + 1] !== '\n') pushRow(); }
    else field += char;
  }
  if (quoted) throw new SpreadsheetError('Failis on lõpetamata jutumärgid.');
  if (field.length > 0 || row.length > 0) pushRow();
  return rows;
}

function decodeText(buffer: Buffer) {
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  if (text.includes('�')) throw new SpreadsheetError('Tekstifail ei ole UTF-8 kodeeringus. Salvesta see Excelis kui „CSV UTF-8“.');
  return text.replace(/^\uFEFF/u, '');
}

function detectDelimiter(text: string) {
  const firstLine = text.split(/\r?\n/u).find((line) => line.trim()) ?? '';
  const counts = { '\t': 0, ';': 0, ',': 0 } as Record<string, number>;
  let quoted = false;
  for (const char of firstLine) {
    if (char === '"') quoted = !quoted;
    else if (!quoted && char in counts) counts[char] += 1;
  }
  if (counts['\t'] > 0) return '\t';
  return counts[';'] > counts[','] ? ';' : ',';
}

export function readSpreadsheet(buffer: Buffer, fileName = ''): SpreadsheetFile {
  if (buffer.length === 0) throw new SpreadsheetError('Fail on tühi.');
  if (buffer.length > MAX_UPLOAD_BYTES) throw new SpreadsheetError('Fail on suurem kui 5 MB.');
  if (buffer.length >= 4 && buffer.readUInt32LE(0) === 0x04034b50) {
    return { format: 'xlsx', sheets: readXlsx(buffer) };
  }
  if (/\.xls$/iu.test(fileName) || (buffer.length >= 8 && buffer.readUInt32BE(0) === 0xd0cf11e0)) {
    throw new SpreadsheetError('Vana .xls vormingut ei toetata. Salvesta fail Excelis .xlsx-vormingus.');
  }
  const text = decodeText(buffer);
  const delimiter = detectDelimiter(text);
  return { format: delimiter === '\t' ? 'tsv' : 'csv', sheets: [{ name: fileName || 'Tabel', rows: parseDelimited(text, delimiter) }] };
}
