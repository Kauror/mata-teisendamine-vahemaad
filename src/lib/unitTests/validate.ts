import { normalizeSlotAnswer, sentenceWords } from './grading';
import { layoutCrossword } from './crossword';
import { UNIT_TEST_FORMAT, type CrosswordEntry, type UnitTestContent, type UnitTestExercise } from './types';

// Validates an imported unit-test file. The file comes from the parent's
// upload, so every field is checked and only known fields are copied into the
// result: nothing unexpected is stored or later rendered.

export class UnitTestContentError extends Error {
  constructor(readonly problems: string[]) {
    super(problems.join(' '));
  }
}

const MAX_TEXT = 600;
const MAX_EXERCISES = 20;
const MAX_ITEMS = 30;

type Ctx = { problems: string[] };

function text(ctx: Ctx, value: unknown, where: string, required = true): string {
  if (value === undefined || value === null) {
    if (required) ctx.problems.push(`${where}: puudub.`);
    return '';
  }
  if (typeof value !== 'string') {
    ctx.problems.push(`${where}: peab olema tekst.`);
    return '';
  }
  const trimmed = value.trim();
  if (required && !trimmed) ctx.problems.push(`${where}: on tühi.`);
  if (trimmed.length > MAX_TEXT) ctx.problems.push(`${where}: on liiga pikk.`);
  return trimmed;
}

function textList(ctx: Ctx, value: unknown, where: string, allowEmpty = false): string[] {
  if (!Array.isArray(value)) {
    ctx.problems.push(`${where}: peab olema loend.`);
    return [];
  }
  if (value.length > 40) ctx.problems.push(`${where}: on liiga pikk.`);
  const list = value.map((item, index) => text(ctx, item, `${where}[${index}]`));
  if (!allowEmpty && list.length === 0) ctx.problems.push(`${where}: on tühi.`);
  return list;
}

function points(ctx: Ctx, value: unknown, where: string): number | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > 5) {
    ctx.problems.push(`${where}: punktid peavad olema täisarv 1–5.`);
    return undefined;
  }
  return value;
}

function id(ctx: Ctx, value: unknown, where: string, seen: Set<string>): string {
  const result = text(ctx, value, `${where} id`);
  if (result && !/^[A-Za-z0-9_-]{1,12}$/.test(result)) ctx.problems.push(`${where}: id võib sisaldada ainult tähti ja numbreid.`);
  if (seen.has(result)) ctx.problems.push(`${where}: id ${result} kordub.`);
  seen.add(result);
  return result;
}

function exercise(ctx: Ctx, raw: unknown, index: number, seen: Set<string>): UnitTestExercise | null {
  const where = `Harjutus ${index + 1}`;
  if (!raw || typeof raw !== 'object') {
    ctx.problems.push(`${where}: on vigane.`);
    return null;
  }
  const record = raw as Record<string, unknown>;
  const base = {
    id: id(ctx, record.id, where, seen),
    instruction: text(ctx, record.instruction, `${where} juhend`),
    ...(record.scene !== undefined ? { scene: text(ctx, record.scene, `${where} pildi kirjeldus`) } : {}),
    ...(record.wordBank !== undefined ? { wordBank: textList(ctx, record.wordBank, `${where} sõnapank`) } : {})
  };
  const itemsOf = (): Record<string, unknown>[] => {
    if (!Array.isArray(record.items) || record.items.length === 0) {
      ctx.problems.push(`${where}: ülesanded puuduvad.`);
      return [];
    }
    if (record.items.length > MAX_ITEMS) ctx.problems.push(`${where}: liiga palju ülesandeid.`);
    return record.items.map((item) => (item && typeof item === 'object' ? item as Record<string, unknown> : {}));
  };
  const itemIds = new Set<string>();
  const example = (item: Record<string, unknown>) => (item.example === true ? { example: true as const } : {});
  const withPoints = (item: Record<string, unknown>, w: string) => {
    const value = points(ctx, item.points, w);
    return value === undefined ? {} : { points: value };
  };

  if (record.type === 'choice') {
    const items = itemsOf().map((item, i) => {
      const w = `${where} ülesanne ${i + 1}`;
      const options = item.options === undefined ? undefined : textList(ctx, item.options, `${w} valikud`);
      const answer = text(ctx, item.answer, `${w} vastus`);
      const pool = options ?? base.wordBank;
      if (!pool || pool.length < 2) ctx.problems.push(`${w}: valikud puuduvad.`);
      else if (!pool.includes(answer)) ctx.problems.push(`${w}: vastus ei ole valikute hulgas.`);
      return { id: id(ctx, item.id, w, itemIds), prompt: text(ctx, item.prompt, `${w} küsimus`, false), ...(options ? { options } : {}), answer, ...example(item), ...withPoints(item, w) };
    });
    return { ...base, type: 'choice', items };
  }
  if (record.type === 'text') {
    const items = itemsOf().map((item, i) => {
      const w = `${where} ülesanne ${i + 1}`;
      const fields = item.fields === undefined ? undefined : textList(ctx, item.fields, `${w} väljad`);
      if (fields && fields.length > 4) ctx.problems.push(`${w}: liiga palju välju.`);
      const check: 'auto' | 'parent' | null = item.check === 'auto' || item.check === 'parent' ? item.check : null;
      if (!check) ctx.problems.push(`${w}: check peab olema auto või parent.`);
      const fieldCount = fields?.length ?? 1;
      const answers = Array.isArray(item.answers) ? item.answers.map((list, f) => textList(ctx, list, `${w} vastused ${f + 1}`, true)) : [];
      if (answers.length !== fieldCount) ctx.problems.push(`${w}: igal väljal peab olema oma vastuste loend.`);
      answers.forEach((list, f) => {
        const accepted = list.filter(Boolean);
        if (check === 'auto' && accepted.length === 0) ctx.problems.push(`${w}: automaatselt kontrollitaval väljal ${f + 1} pole vastust.`);
        if (new Set(accepted.map(normalizeSlotAnswer)).size !== accepted.length) ctx.problems.push(`${w}: vastused korduvad.`);
      });
      return { id: id(ctx, item.id, w, itemIds), prompt: text(ctx, item.prompt, `${w} küsimus`), ...(fields ? { fields } : {}), answers: answers.map((list) => list.filter(Boolean)), check: check ?? 'parent', ...example(item), ...withPoints(item, w) };
    });
    return { ...base, type: 'text', items };
  }
  if (record.type === 'order') {
    const items = itemsOf().map((item, i) => {
      const w = `${where} ülesanne ${i + 1}`;
      const tokens = textList(ctx, item.tokens, `${w} sõnad`);
      if (tokens.length < 2) ctx.problems.push(`${w}: sõnu on liiga vähe.`);
      const answers = textList(ctx, item.answers, `${w} vastused`);
      const want = [...sentenceWords(tokens.join(' '))].sort().join(' ');
      for (const answer of answers) {
        if ([...sentenceWords(answer)].sort().join(' ') !== want) ctx.problems.push(`${w}: vastus „${answer}” ei koosne täpselt antud sõnadest.`);
      }
      return { id: id(ctx, item.id, w, itemIds), ...(item.prompt !== undefined ? { prompt: text(ctx, item.prompt, `${w} küsimus`, false) } : {}), tokens, answers, ...example(item), ...withPoints(item, w) };
    });
    return { ...base, type: 'order', items };
  }
  if (record.type === 'crossword') {
    if (!Array.isArray(record.entries) || record.entries.length < 2 || record.entries.length > 20) {
      ctx.problems.push(`${where}: ristsõnas peab olema 2–20 sõna.`);
      return null;
    }
    const keys = new Set<string>();
    const entries = record.entries.map((raw, i): CrosswordEntry => {
      const entry = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
      const w = `${where} sõna ${i + 1}`;
      const answer = text(ctx, entry.answer, `${w} vastus`);
      if (!/^[A-Z]{2,15}$/.test(answer)) ctx.problems.push(`${w}: vastus peab olema 2–15 suurtähte A–Z.`);
      const number = typeof entry.number === 'number' && Number.isInteger(entry.number) && entry.number > 0 && entry.number < 100 ? entry.number : 0;
      if (!number) ctx.problems.push(`${w}: number on vigane.`);
      const layout = entry.row !== undefined || entry.col !== undefined || entry.dir !== undefined;
      const dir: 'across' | 'down' | undefined = entry.dir === 'across' || entry.dir === 'down' ? entry.dir : undefined;
      const cell = (value: unknown) => (typeof value === 'number' && Number.isInteger(value) && value >= 0 && value < 30 ? value : undefined);
      const row = cell(entry.row);
      const col = cell(entry.col);
      if (layout && (row === undefined || col === undefined || !dir)) ctx.problems.push(`${w}: paigutus (row, col, dir) on vigane.`);
      const key = `${number}${dir ?? ''}`;
      if (keys.has(key)) ctx.problems.push(`${w}: number ${number} kordub.`);
      keys.add(key);
      return { number, clue: text(ctx, entry.clue, `${w} vihje`), answer, ...(layout && dir && row !== undefined && col !== undefined ? { row, col, dir } : {}), ...withPoints(entry, w) };
    });
    const placed = entries.filter((entry) => 'dir' in entry).length;
    if (placed !== 0 && placed !== entries.length) ctx.problems.push(`${where}: paigutus peab olema kas kõigil sõnadel või mitte ühelgi.`);
    if (ctx.problems.length === 0) {
      try {
        layoutCrossword(entries);
      } catch (error) {
        ctx.problems.push(`${where}: ${(error as Error).message}`);
      }
    }
    return { ...base, type: 'crossword', entries };
  }
  ctx.problems.push(`${where}: tundmatu tüüp.`);
  return null;
}

export function parseUnitTestContent(raw: unknown): UnitTestContent {
  const ctx: Ctx = { problems: [] };
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new UnitTestContentError(['Fail ei ole kontrolltöö fail.']);
  const record = raw as Record<string, unknown>;
  if (record.format !== UNIT_TEST_FORMAT) throw new UnitTestContentError([`Fail ei ole kontrolltöö fail (format peab olema ${UNIT_TEST_FORMAT}).`]);
  const unit = record.unit;
  if (typeof unit !== 'number' || !Number.isInteger(unit) || unit < 1 || unit > 999) ctx.problems.push('Õppetüki number peab olema 1–999.');
  const variant = record.variant;
  if (variant !== 'A' && variant !== 'B') ctx.problems.push('Variant peab olema A või B.');
  const title = text(ctx, record.title, 'Pealkiri');
  if (!Array.isArray(record.exercises) || record.exercises.length === 0 || record.exercises.length > MAX_EXERCISES) {
    ctx.problems.push(`Harjutusi peab olema 1–${MAX_EXERCISES}.`);
    throw new UnitTestContentError(ctx.problems);
  }
  const seen = new Set<string>();
  const exercises = record.exercises.map((item, index) => exercise(ctx, item, index, seen)).filter((item): item is UnitTestExercise => item !== null);
  const scored = exercises.some((item) => item.type === 'crossword' || item.items.some((entry) => !entry.example));
  if (!scored) ctx.problems.push('Testis pole ühtegi hinnatavat ülesannet.');
  if (ctx.problems.length > 0) throw new UnitTestContentError(ctx.problems.slice(0, 30));
  return { format: UNIT_TEST_FORMAT, unit: unit as number, variant: variant as 'A' | 'B', title, exercises };
}
