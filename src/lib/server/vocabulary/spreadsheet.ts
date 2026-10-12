import { inflateRawSync } from 'node:zlib';
import { IMPORT_LIMITS, type ImportCell, type ImportTable } from '@/lib/vocabulary/importPlan';

// Reads the parent's vocabulary file into plain tables of text cells. Supports
// .xlsx (the intended format), CSV and tab-separated text.
//
// No spreadsheet library: an .xlsx file is a zip of XML parts, and the app
// needs only cell values — no formulas, styles or dates. Reading it with
// node:zlib keeps the dependency tree (and its CVE surface) unchanged. The
// reader is defensive: sizes and counts are bounded before anything is
// inflated, the XML is scanned in linear time (a malformed part fails fast
// instead of backtracking), and anything unexpected is a clear error.

// A sheet that could not be read keeps its name and an error, so one broken
// helper sheet does not block importing the others.
export type SpreadsheetSheet = { name: string; rows: ImportTable; error?: string };
export type SpreadsheetFile = { format: 'xlsx' | 'csv' | 'tsv'; sheets: SpreadsheetSheet[] };

export class SpreadsheetError extends Error {}

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_UNCOMPRESSED_BYTES = 40 * 1024 * 1024;
const MAX_ZIP_ENTRIES = 2000;
const MAX_SHEETS = 50;
const BROKEN_FILE = 'Exceli fail on vigane või katkine. Salvesta see Excelis uuesti .xlsx-vormingus.';

/* -------------------------------------------------------------- zip */

type ZipEntry = { name: string; method: number; compressedSize: number; size: number; offset: number };
type ZipArchive = { buffer: Buffer; entries: Map<string, ZipEntry>; lowerCase: Map<string, ZipEntry> };

function readZip(buffer: Buffer): ZipArchive {
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
  if (count > MAX_ZIP_ENTRIES || directoryOffset + directorySize > buffer.length) throw new SpreadsheetError(BROKEN_FILE);

  const entries = new Map<string, ZipEntry>();
  const lowerCase = new Map<string, ZipEntry>();
  let cursor = directoryOffset;
  let total = 0;
  for (let index = 0; index < count; index += 1) {
    if (cursor + 46 > buffer.length || buffer.readUInt32LE(cursor) !== 0x02014b50) throw new SpreadsheetError(BROKEN_FILE);
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
    const entry = { name, method, compressedSize, size, offset };
    entries.set(name, entry);
    lowerCase.set(name.toLowerCase(), entry);
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  return { buffer, entries, lowerCase };
}

// Part names are case-insensitive in OPC, so "xl/SharedStrings.xml" is found too.
function readZipText(zip: ZipArchive, name: string): string | null {
  const entry = zip.entries.get(name) ?? zip.lowerCase.get(name.toLowerCase());
  if (!entry) return null;
  const { buffer } = zip;
  const header = entry.offset;
  if (header + 30 > buffer.length || buffer.readUInt32LE(header) !== 0x04034b50) throw new SpreadsheetError(BROKEN_FILE);
  const start = header + 30 + buffer.readUInt16LE(header + 26) + buffer.readUInt16LE(header + 28);
  const end = start + entry.compressedSize;
  if (end > buffer.length) throw new SpreadsheetError(BROKEN_FILE);
  const raw = buffer.subarray(start, end);
  try {
    let data: Buffer;
    if (entry.method === 0) data = raw;
    else if (entry.method === 8) data = inflateRawSync(raw, { maxOutputLength: Math.max(entry.size, 1) });
    else throw new SpreadsheetError('Exceli faili pakkimisviisi ei toetata.');
    return data.toString('utf8');
  } catch (error) {
    // A corrupt deflate stream or a size that does not match the data.
    if (error instanceof SpreadsheetError) throw error;
    throw new SpreadsheetError(BROKEN_FILE);
  }
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

// Excel escapes some characters in text as _xHHHH_ (e.g. _x000D_ for a
// carriage return, _x005F_ for a literal underscore).
function decodeOoxmlEscapes(value: string) {
  return value.replace(/_x([0-9A-Fa-f]{4})_/gu, (_match, hex: string) => String.fromCharCode(parseInt(hex, 16)));
}

// Drop namespace prefixes from element names ("<x:sheet>" → "<sheet>"), as
// written by the OpenXML SDK. Attribute names (r:id) are left alone.
function stripPrefixes(xml: string) {
  return xml.replace(/<(\/?)[A-Za-z_][\w.-]*:(?=[A-Za-z_])/gu, '<$1');
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&');
}

function attribute(attributes: string, name: string) {
  const match = attributes.match(new RegExp(`(?:^|\\s)${escapeRegExp(name)}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'u'));
  return match ? decodeXml(match[1] ?? match[2] ?? '') : null;
}

type XmlElement = { attributes: string; body: string | null; start: number; end: number };

const NAME_END = new Set([' ', '>', '/', '\t', '\n', '\r']);

// Every <name …>…</name> or <name …/> in order, found with indexOf only, so
// the cost is linear in the size of the XML. A start tag whose end tag is
// missing is a broken part: it throws at once instead of being re-scanned.
function elements(xml: string, name: string): XmlElement[] {
  const result: XmlElement[] = [];
  const open = `<${name}`;
  const close = `</${name}>`;
  let position = 0;
  for (;;) {
    const start = xml.indexOf(open, position);
    if (start < 0) break;
    if (!NAME_END.has(xml[start + open.length] ?? '')) { position = start + open.length; continue; }
    const tagEnd = xml.indexOf('>', start);
    if (tagEnd < 0) throw new SpreadsheetError(BROKEN_FILE);
    const attributes = xml.slice(start + open.length, tagEnd);
    if (attributes.endsWith('/')) {
      result.push({ attributes: attributes.slice(0, -1), body: null, start, end: tagEnd + 1 });
      position = tagEnd + 1;
      continue;
    }
    const closeAt = xml.indexOf(close, tagEnd);
    if (closeAt < 0) throw new SpreadsheetError(BROKEN_FILE);
    result.push({ attributes, body: xml.slice(tagEnd + 1, closeAt), start, end: closeAt + close.length });
    position = closeAt + close.length;
  }
  return result;
}

function withoutElements(xml: string, name: string) {
  let output = '';
  let position = 0;
  for (const element of elements(xml, name)) {
    output += xml.slice(position, element.start);
    position = element.end;
  }
  return output + xml.slice(position);
}

// All <t> text inside a string item, excluding phonetic (<rPh>) runs.
function stringItemText(xml: string) {
  return elements(withoutElements(xml, 'rPh'), 't').map((element) => decodeOoxmlEscapes(decodeXml(element.body ?? ''))).join('');
}

function columnIndex(reference: string) {
  const letters = reference.match(/^[A-Z]+/u)?.[0] ?? '';
  let index = 0;
  for (const letter of letters) index = index * 26 + (letter.charCodeAt(0) - 64);
  return index - 1;
}

function parseSheetXml(xml: string, sharedStrings: string[]): ImportTable {
  const rows: ImportTable = [];
  const sheetData = elements(xml, 'sheetData')[0]?.body ?? '';
  let nextRow = 0;
  for (const rowElement of elements(sheetData, 'row')) {
    const rowNumber = Number(attribute(rowElement.attributes, 'r'));
    const rowIndex = Number.isInteger(rowNumber) && rowNumber > 0 ? rowNumber - 1 : nextRow;
    nextRow = rowIndex + 1;
    const cells: ImportCell[] = [];
    let nextColumn = 0;
    let hasValue = false;
    for (const cellElement of elements(rowElement.body ?? '', 'c')) {
      const reference = attribute(cellElement.attributes, 'r');
      const column = reference ? columnIndex(reference) : nextColumn;
      nextColumn = column + 1;
      if (column < 0 || column >= IMPORT_LIMITS.maxColumns) continue;
      const type = attribute(cellElement.attributes, 't') ?? 'n';
      const body = cellElement.body ?? '';
      const valueElement = elements(body, 'v')[0];
      const value = valueElement?.body ?? undefined;
      let cell: ImportCell;
      if (type === 's') {
        const text = value === undefined ? '' : sharedStrings[Number(value)] ?? '';
        cell = { v: text, t: text ? 's' : 'empty' };
      } else if (type === 'inlineStr') {
        const text = stringItemText(elements(body, 'is')[0]?.body ?? '');
        cell = { v: text, t: text ? 's' : 'empty' };
      } else if (type === 'str') {
        const text = decodeOoxmlEscapes(decodeXml(value ?? ''));
        cell = { v: text, t: text ? 's' : 'empty' };
      } else if (type === 'b') {
        cell = value === undefined ? { v: '', t: 'empty' } : { v: value === '1' ? 'TRUE' : 'FALSE', t: 'b' };
      } else if (type === 'e') {
        cell = { v: decodeXml(value ?? ''), t: 'e' };
      } else {
        cell = value === undefined || value === '' ? { v: '', t: 'empty' } : { v: decodeXml(value), t: 'n' };
      }
      if (cell.t !== 'empty') hasValue = true;
      while (cells.length < column) cells.push({ v: '', t: 'empty' });
      cells[column] = cell;
    }
    // Empty rows (Excel writes them for row formatting) do not count against
    // any limit and are not kept beyond the last real row.
    if (!hasValue) continue;
    if (rowIndex >= IMPORT_LIMITS.maxTableRows) throw new SpreadsheetError(`Lehel on andmeid pärast rida ${IMPORT_LIMITS.maxTableRows}.`);
    while (rows.length < rowIndex) rows.push([]);
    rows[rowIndex] = cells;
  }
  return rows;
}

// Relationship targets are relative to xl/ unless absolute; "../" climbs.
function resolveTarget(target: string) {
  const parts = (target.startsWith('/') ? target.slice(1) : `xl/${target}`).split('/');
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') resolved.pop();
    else if (part && part !== '.') resolved.push(part);
  }
  return resolved.join('/');
}

export function readXlsx(buffer: Buffer): SpreadsheetSheet[] {
  const zip = readZip(buffer);
  const workbookXml = readZipText(zip, 'xl/workbook.xml');
  if (!workbookXml) throw new SpreadsheetError('Fail ei ole korrektne Exceli (.xlsx) fail.');
  const workbook = stripPrefixes(workbookXml);
  const relationships = stripPrefixes(readZipText(zip, 'xl/_rels/workbook.xml.rels') ?? '');
  const targets = new Map<string, string>();
  let sharedStringsPath = 'xl/sharedStrings.xml';
  for (const relationship of elements(relationships, 'Relationship')) {
    const id = attribute(relationship.attributes, 'Id');
    const target = attribute(relationship.attributes, 'Target');
    const type = attribute(relationship.attributes, 'Type') ?? '';
    if (!target) continue;
    if (id) targets.set(id, resolveTarget(target));
    if (type.endsWith('/sharedStrings')) sharedStringsPath = resolveTarget(target);
  }
  const sharedXml = stripPrefixes(readZipText(zip, sharedStringsPath) ?? '');
  const sharedStrings = elements(sharedXml, 'si').map((element) => stringItemText(element.body ?? ''));

  const sheets: SpreadsheetSheet[] = [];
  for (const sheet of elements(workbook, 'sheet')) {
    if (sheets.length >= MAX_SHEETS) break;
    const name = attribute(sheet.attributes, 'name') ?? `Leht ${sheets.length + 1}`;
    const relationId = attribute(sheet.attributes, 'r:id');
    const path = relationId ? targets.get(relationId) : undefined;
    try {
      const xml = path ? readZipText(zip, path) : null;
      if (xml === null) continue;
      sheets.push({ name, rows: parseSheetXml(stripPrefixes(xml), sharedStrings) });
    } catch (error) {
      if (!(error instanceof SpreadsheetError)) throw error;
      sheets.push({ name, rows: [], error: error.message });
    }
  }
  if (sheets.length === 0) throw new SpreadsheetError('Exceli failist ei leitud ühtegi lehte.');
  const readable = sheets.filter((sheet) => !sheet.error);
  if (readable.length === 0) throw new SpreadsheetError(sheets[0].error ?? BROKEN_FILE);
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
    if (rows.length > IMPORT_LIMITS.maxTableRows) throw new SpreadsheetError(`Failis on rohkem kui ${IMPORT_LIMITS.maxTableRows} rida.`);
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

// UTF-8 (with or without a byte-order mark) and UTF-16 ("Unicode text" from
// Excel) are read as is. Anything else is taken to be the Windows Baltic code
// page that Estonian Excel uses for "CSV (comma delimited)".
function decodeText(buffer: Buffer) {
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe) return new TextDecoder('utf-16le').decode(buffer.subarray(2));
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff) return new TextDecoder('utf-16be').decode(buffer.subarray(2));
  const body = buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf ? buffer.subarray(3) : buffer;
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(body);
  } catch {
    return new TextDecoder('windows-1257').decode(body);
  }
}

// The delimiter used on the most lines among the first non-empty ones, so a
// title line above the table cannot decide it.
function detectDelimiter(text: string) {
  const lines = text.split(/\r?\n/u).filter((line) => line.trim()).slice(0, 20);
  const candidates = ['\t', ';', ','] as const;
  const linesWith = new Map<string, number>(candidates.map((candidate) => [candidate, 0]));
  for (const line of lines) {
    let quoted = false;
    const seen = new Set<string>();
    for (const char of line) {
      if (char === '"') quoted = !quoted;
      else if (!quoted && linesWith.has(char)) seen.add(char);
    }
    for (const char of seen) linesWith.set(char, (linesWith.get(char) ?? 0) + 1);
  }
  let best: string = ',';
  let bestCount = 0;
  for (const candidate of candidates) {
    const count = linesWith.get(candidate) ?? 0;
    if (count > bestCount) { best = candidate; bestCount = count; }
  }
  return best;
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
