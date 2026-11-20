import type { CrosswordEntry } from './types';

// Crossword geometry. A file either places every word itself (the workbook's
// own layout, as row/col/dir) or none, in which case the words are laid out
// here deterministically. Either way the result is checked: crossing words
// must agree on the shared letter.

export type PlacedEntry = {
  number: number;
  dir: 'across' | 'down';
  row: number;
  col: number;
  length: number;
  clue: string;
  answer: string;
  points: number;
};

export type CrosswordLayout = {
  rows: number;
  cols: number;
  entries: PlacedEntry[];
  // Every letter cell, with the number printed in it (if a word starts there).
  cells: Array<{ row: number; col: number; number: number | null }>;
};

export const cellKey = (row: number, col: number) => `${row},${col}`;

export function entryCells(entry: { row: number; col: number; dir: 'across' | 'down'; length: number }) {
  return Array.from({ length: entry.length }, (_, i) => ({
    row: entry.row + (entry.dir === 'down' ? i : 0),
    col: entry.col + (entry.dir === 'across' ? i : 0)
  }));
}

export const entryKey = (entry: { number: number; dir: 'across' | 'down' }) => `${entry.number}${entry.dir === 'across' ? 'a' : 'd'}`;

type Grid = Map<string, string>;

function canPlace(grid: Grid, answer: string, row: number, col: number, dir: 'across' | 'down') {
  const dr = dir === 'down' ? 1 : 0;
  const dc = dir === 'across' ? 1 : 0;
  // The cells just before and after the word must be empty.
  if (grid.has(cellKey(row - dr, col - dc)) || grid.has(cellKey(row + dr * answer.length, col + dc * answer.length))) return false;
  let crossings = 0;
  for (let i = 0; i < answer.length; i += 1) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = grid.get(cellKey(r, c));
    if (existing) {
      if (existing !== answer[i]) return false;
      crossings += 1;
      continue;
    }
    // A new letter must not touch a neighbour side-on, or it would spell a
    // word nobody asked for.
    if (grid.has(cellKey(r + dc, c + dr)) || grid.has(cellKey(r - dc, c - dr))) return false;
  }
  return crossings;
}

function autoPlace(entries: CrosswordEntry[]) {
  const grid: Grid = new Map();
  const placed: Array<{ entry: CrosswordEntry; row: number; col: number; dir: 'across' | 'down' }> = [];
  const put = (entry: CrosswordEntry, row: number, col: number, dir: 'across' | 'down') => {
    for (const cell of entryCells({ row, col, dir, length: entry.answer.length })) grid.set(cellKey(cell.row, cell.col), entry.answer[cell.row - row + cell.col - col]);
    placed.push({ entry, row, col, dir });
  };
  // Longest words first give the most crossings; ties keep the file's order.
  const order = entries.map((entry, index) => ({ entry, index })).sort((a, b) => b.entry.answer.length - a.entry.answer.length || a.index - b.index);
  for (const { entry } of order) {
    if (placed.length === 0) {
      put(entry, 0, 0, 'across');
      continue;
    }
    let best: { row: number; col: number; dir: 'across' | 'down'; score: number } | null = null;
    for (const other of placed) {
      const dir = other.dir === 'across' ? 'down' : 'across';
      for (let i = 0; i < other.entry.answer.length; i += 1) {
        for (let j = 0; j < entry.answer.length; j += 1) {
          if (other.entry.answer[i] !== entry.answer[j]) continue;
          const crossRow = other.row + (other.dir === 'down' ? i : 0);
          const crossCol = other.col + (other.dir === 'across' ? i : 0);
          const row = crossRow - (dir === 'down' ? j : 0);
          const col = crossCol - (dir === 'across' ? j : 0);
          const crossings = canPlace(grid, entry.answer, row, col, dir);
          if (crossings === false || crossings === 0) continue;
          const score = crossings * 100 - Math.abs(row) - Math.abs(col);
          if (!best || score > best.score) best = { row, col, dir, score };
        }
      }
    }
    if (best) {
      put(entry, best.row, best.col, best.dir);
      continue;
    }
    // No crossing found: a separate word two rows below everything else.
    const bottom = Math.max(...[...grid.keys()].map((key) => Number(key.split(',')[0])));
    const left = Math.min(...[...grid.keys()].map((key) => Number(key.split(',')[1])));
    put(entry, bottom + 2, left, 'across');
  }
  return placed;
}

// Layouts are recomputed for every read and save of a test; the entries of a
// parsed content object never change, so each array is laid out once.
const layoutCache = new WeakMap<CrosswordEntry[], CrosswordLayout>();

export function layoutCrossword(entries: CrosswordEntry[]): CrosswordLayout {
  const cached = layoutCache.get(entries);
  if (cached) return cached;
  const layout = computeLayout(entries);
  layoutCache.set(entries, layout);
  return layout;
}

// A book layout must be a real crossword: no two different numbers in one
// start cell, and no two letters side by side unless one word runs through
// both (otherwise the grid shows a "word" nobody asked for).
export function crosswordLayoutProblems(layout: CrosswordLayout): string[] {
  const problems: string[] = [];
  const starts = new Map<string, number>();
  for (const entry of layout.entries) {
    const key = cellKey(entry.row, entry.col);
    const existing = starts.get(key);
    if (existing !== undefined && existing !== entry.number) problems.push(`Ruudus (${entry.row + 1}, ${entry.col + 1}) algavad sõnad numbritega ${existing} ja ${entry.number}.`);
    starts.set(key, entry.number);
  }
  const covered = (dir: 'across' | 'down', a: { row: number; col: number }, b: { row: number; col: number }) =>
    layout.entries.some((entry) => entry.dir === dir && [a, b].every((cell) => entryCells(entry).some((item) => item.row === cell.row && item.col === cell.col)));
  const letters = new Set(layout.cells.map((cell) => cellKey(cell.row, cell.col)));
  for (const cell of layout.cells) {
    const right = { row: cell.row, col: cell.col + 1 };
    const below = { row: cell.row + 1, col: cell.col };
    if (letters.has(cellKey(right.row, right.col)) && !covered('across', cell, right)) problems.push(`Ruudud (${cell.row + 1}, ${cell.col + 1}) ja (${right.row + 1}, ${right.col + 1}) on kõrvuti, kuid ükski sõna ei läbi neid.`);
    if (letters.has(cellKey(below.row, below.col)) && !covered('down', cell, below)) problems.push(`Ruudud (${cell.row + 1}, ${cell.col + 1}) ja (${below.row + 1}, ${below.col + 1}) on üksteise all, kuid ükski sõna ei läbi neid.`);
  }
  return problems;
}

function computeLayout(entries: CrosswordEntry[]): CrosswordLayout {
  const explicit = entries.every((entry) => entry.dir !== undefined && entry.row !== undefined && entry.col !== undefined);
  const raw = explicit
    ? entries.map((entry) => ({ entry, row: entry.row!, col: entry.col!, dir: entry.dir! }))
    : autoPlace(entries);
  const minRow = Math.min(...raw.map((item) => item.row));
  const minCol = Math.min(...raw.map((item) => item.col));
  const grid: Grid = new Map();
  const numbers = new Map<string, number>();
  const placedEntries: PlacedEntry[] = raw.map(({ entry, row, col, dir }) => ({
    number: entry.number,
    dir,
    row: row - minRow,
    col: col - minCol,
    length: entry.answer.length,
    clue: entry.clue,
    answer: entry.answer,
    points: entry.points ?? 1
  }));
  for (const entry of placedEntries) {
    entryCells(entry).forEach((cell, i) => {
      const key = cellKey(cell.row, cell.col);
      const existing = grid.get(key);
      if (existing && existing !== entry.answer[i]) {
        throw new Error(`Ristsõna sõnad ${entry.answer} ja teine sõna ei sobi kokku ruudus (${cell.row + 1}, ${cell.col + 1}).`);
      }
      grid.set(key, entry.answer[i]);
    });
    const start = cellKey(entry.row, entry.col);
    if (!numbers.has(start)) numbers.set(start, entry.number);
  }
  placedEntries.sort((a, b) => a.number - b.number || (a.dir === 'across' ? -1 : 1));
  const cells = [...grid.keys()].map((key) => {
    const [row, col] = key.split(',').map(Number);
    return { row, col, number: numbers.get(key) ?? null };
  }).sort((a, b) => a.row - b.row || a.col - b.col);
  return {
    rows: Math.max(...cells.map((cell) => cell.row)) + 1,
    cols: Math.max(...cells.map((cell) => cell.col)) + 1,
    entries: placedEntries,
    cells
  };
}
