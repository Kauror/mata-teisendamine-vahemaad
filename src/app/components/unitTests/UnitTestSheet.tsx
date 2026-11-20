'use client';

import { Fragment, useMemo, useState, type ReactNode } from 'react';
import type { ClientCrossword, ClientExercise, ClientItem, ClientUnitTest } from '@/lib/unitTests/clientView';
import { cellKey, entryCells } from '@/lib/unitTests/crossword';
import { crosswordCellAnswerKey } from '@/lib/unitTests/grading';
import type { Answers, Mark } from '@/lib/unitTests/types';

// The workbook test as a sheet of exercises. The child fills it in; the
// parent sees the same sheet read-only, with marking controls next to every
// answer (`slotExtra`). Keys follow lib/unitTests/grading.ts buildSlots.
// Every answer slot's container carries data-slot, so a page can scroll to
// "the next empty answer" or "the next answer to fix".

export const itemSlotKey = (exerciseId: string, itemId: string) => `${exerciseId}.${itemId}`;
export const fieldSlotKey = (exerciseId: string, itemId: string, field: number) => `${exerciseId}.${itemId}.${field}`;
export const crosswordSlotKey = (exerciseId: string, entry: { number: number; dir: 'across' | 'down' }) => `${exerciseId}.${entry.number}${entry.dir === 'across' ? 'a' : 'd'}`;

export type SheetProps = {
  test: ClientUnitTest;
  answers: Answers;
  onChange?: (key: string, value: string) => void;
  // Which answer keys can be changed: 'all', or a list (after a return).
  editable: 'all' | ReadonlySet<string>;
  marks?: Record<string, Mark | null> | null;
  // After grading: the expected answer for slots that were not right.
  corrections?: Record<string, string> | null;
  // Slots not to show at all (the parent's "only what to check" view).
  hiddenSlots?: ReadonlySet<string> | null;
  slotExtra?: (slotKey: string) => ReactNode;
};

function MarkBadge({ mark }: { mark: Mark | null | undefined }) {
  if (mark === undefined) return null;
  const label = mark === 1 ? 'Õige' : mark === 0.5 ? 'Pooleldi õige' : mark === 0 ? 'Vale' : 'Hindamata';
  const symbol = mark === 1 ? '✓' : mark === 0.5 ? '½' : mark === 0 ? '✗' : '?';
  return <span className='ut-mark' data-mark={mark === null ? 'none' : String(mark)} role='img' aria-label={label}>{symbol}</span>;
}

function SlotFoot({ slot, props }: { slot: string; props: SheetProps }) {
  const correct = props.corrections?.[slot];
  return (
    <div className='ut-slot-foot'>
      <MarkBadge mark={props.marks?.[slot]} />
      {correct ? <span className='ut-correct'>Õige: <strong>{correct}</strong></span> : null}
      {props.slotExtra?.(slot)}
    </div>
  );
}

// "Some people ___ like sweets." → the gap drawn as a line.
function Prompt({ text }: { text: string }) {
  const parts = text.split(/_{3,}/);
  if (parts.length === 1) return <>{text}</>;
  return <>{parts.map((part, index) => <Fragment key={index}>{part}{index < parts.length - 1 ? <span className='ut-gap' aria-label='lünk'>____</span> : null}</Fragment>)}</>;
}

function canEdit(editable: SheetProps['editable'], key: string) {
  return editable === 'all' || editable.has(key);
}

const hidden = (props: SheetProps, key: string) => Boolean(props.hiddenSlots?.has(key));

function ChoiceItemView({ exercise, item, props }: { exercise: ClientExercise; item: ClientItem; props: SheetProps }) {
  const key = itemSlotKey(exercise.id, item.id);
  if (item.example ? props.hiddenSlots : hidden(props, key)) return null;
  const value = item.example ? item.example[0] : props.answers[key] ?? '';
  const enabled = !item.example && canEdit(props.editable, key) && Boolean(props.onChange);
  return (
    <li className='ut-item' data-example={Boolean(item.example)} data-slot={item.example ? undefined : key}>
      <p className='ut-prompt'>{item.prompt ? <Prompt text={item.prompt} /> : null}{item.example ? <span className='ut-example-tag'>näide</span> : null}</p>
      <div className='ut-options' role='group' aria-label={item.prompt || `Ülesanne ${item.id}`}>
        {(item.options ?? []).map((option, index) => (
          <button key={`${index}-${option}`} type='button' className='ut-option' aria-pressed={value === option} disabled={!enabled && value !== option} onClick={() => enabled && props.onChange?.(key, value === option ? '' : option)}>
            {option}
          </button>
        ))}
      </div>
      {!item.example ? <SlotFoot slot={key} props={props} /> : null}
    </li>
  );
}

function TextItemView({ exercise, item, props }: { exercise: ClientExercise; item: ClientItem; props: SheetProps }) {
  const fields = item.fields ?? [''];
  const keys = fields.map((_, index) => fieldSlotKey(exercise.id, item.id, index));
  if (item.example ? props.hiddenSlots : keys.every((key) => hidden(props, key))) return null;
  return (
    <li className='ut-item' data-example={Boolean(item.example)}>
      <p className='ut-prompt'><Prompt text={item.prompt} />{item.example ? <span className='ut-example-tag'>näide</span> : null}</p>
      {fields.map((field, index) => {
        const key = keys[index];
        if (!item.example && hidden(props, key)) return null;
        const value = item.example ? item.example[index] ?? '' : props.answers[key] ?? '';
        const enabled = !item.example && canEdit(props.editable, key) && Boolean(props.onChange);
        const label = field || (fields.length > 1 ? `Vastus ${index + 1}` : 'Vastus');
        return (
          <div key={key} className='ut-field' data-slot={item.example ? undefined : key}>
            <label className='ut-field-row'>
              {field ? <span className='ut-field-label'>{field}</span> : <span className='sr-only'>{label}</span>}
              <input
                className='ut-input'
                value={value}
                readOnly={!enabled}
                data-locked={!enabled && !item.example && Boolean(props.onChange) ? 'true' : undefined}
                autoCapitalize='off'
                autoCorrect='off'
                autoComplete='off'
                spellCheck={false}
                maxLength={300}
                onChange={(event) => props.onChange?.(key, event.target.value)}
              />
            </label>
            {!item.example ? <SlotFoot slot={key} props={props} /> : null}
          </div>
        );
      })}
    </li>
  );
}

// Rebuilds which tokens are used from the saved sentence: tokens can be
// several words long, so the saved text is matched token by token.
function usedTokens(tokens: string[], value: string): number[] {
  const used: number[] = [];
  let rest = value.trim();
  while (rest) {
    const index = tokens.findIndex((token, i) => !used.includes(i) && (rest === token || rest.startsWith(`${token} `)));
    if (index < 0) break;
    used.push(index);
    rest = rest.slice(tokens[index].length).trim();
  }
  return used;
}

function OrderItemView({ exercise, item, props }: { exercise: ClientExercise; item: ClientItem; props: SheetProps }) {
  const key = itemSlotKey(exercise.id, item.id);
  if (item.example ? props.hiddenSlots : hidden(props, key)) return null;
  const tokens = item.tokens ?? [];
  const value = item.example ? item.example[0] : props.answers[key] ?? '';
  const enabled = !item.example && canEdit(props.editable, key) && Boolean(props.onChange);
  const used = item.example ? [] : usedTokens(tokens, value);
  const set = (indexes: number[]) => props.onChange?.(key, indexes.map((index) => tokens[index]).join(' '));
  return (
    <li className='ut-item' data-example={Boolean(item.example)} data-slot={item.example ? undefined : key}>
      {item.prompt ? <p className='ut-prompt'><Prompt text={item.prompt} /></p> : null}
      {item.example ? (
        <p className='ut-built ut-built-example'>{value}<span className='ut-example-tag'>näide</span></p>
      ) : (
        <>
          <div className='ut-built' aria-label='Sinu lause'>
            {used.length === 0 ? <span className='ut-built-empty'>{enabled ? 'Puuduta sõnu õiges järjekorras' : '—'}</span> : used.map((index, position) => (
              <button key={`${index}-${position}`} type='button' className='ut-token ut-token-used' disabled={!enabled} onClick={() => set(used.filter((_, i) => i !== position))}>{tokens[index]}</button>
            ))}
          </div>
          {enabled ? (
            <div className='ut-tokens' role='group' aria-label='Sõnad'>
              {tokens.map((token, index) => used.includes(index) ? null : (
                <button key={`${token}-${index}`} type='button' className='ut-token' onClick={() => set([...used, index])}>{token}</button>
              ))}
            </div>
          ) : null}
          <SlotFoot slot={key} props={props} />
        </>
      )}
    </li>
  );
}

type Entry = ClientCrossword['entries'][number];

// The crossword: the grid shows the letters, typing happens in one ordinary
// text field for the chosen word. Tiny per-letter inputs were hard to hit on
// a phone, zoomed the page on iPhone and lost letters to the keyboard's
// autocorrect; a word field has none of those problems.
function CrosswordView({ exercise, crossword, props }: { exercise: ClientExercise; crossword: ClientCrossword; props: SheetProps }) {
  const editing = Boolean(props.onChange);
  const keyOf = (row: number, col: number) => crosswordCellAnswerKey(exercise.id, row, col);
  const isOpen = (entry: Entry) => entryCells(entry).some((cell) => canEdit(props.editable, keyOf(cell.row, cell.col)));
  const firstOpen = crossword.entries.find((entry) => isOpen(entry)) ?? null;
  const [active, setActive] = useState<Entry | null>(editing ? firstOpen : null);
  const [draft, setDraft] = useState<string | null>(null);
  const byCell = useMemo(() => {
    const map = new Map<string, Entry[]>();
    for (const entry of crossword.entries) for (const cell of entryCells(entry)) {
      const key = cellKey(cell.row, cell.col);
      map.set(key, [...(map.get(key) ?? []), entry]);
    }
    return map;
  }, [crossword]);
  const activeCells = new Set(active ? entryCells(active).map((cell) => cellKey(cell.row, cell.col)) : []);
  const letters = (entry: Entry) => entryCells(entry).map((cell) => props.answers[keyOf(cell.row, cell.col)] ?? '');

  const choose = (entry: Entry) => {
    setActive(entry);
    setDraft(null);
  };
  const pickCell = (row: number, col: number) => {
    const entries = (byCell.get(cellKey(row, col)) ?? []).filter((entry) => !editing || isOpen(entry));
    if (entries.length === 0) return;
    // Tapping a crossing cell of the chosen word again switches to the other word.
    const current = entries.find((entry) => entry === active);
    choose(current && entries.length > 1 ? entries.find((entry) => entry !== current)! : current ?? entries[0]);
  };

  // What the field shows: the word as typed so far, or its letters when the
  // whole word is already filled in (so it can be corrected).
  const shown = active ? draft ?? (letters(active).every(Boolean) ? letters(active).join('') : '') : '';
  const type = (raw: string) => {
    if (!active) return;
    const typed = raw.toUpperCase().replace(/[^A-Z]/g, '').slice(0, active.length);
    setDraft(typed);
    entryCells(active).forEach((cell, index) => {
      const key = keyOf(cell.row, cell.col);
      if (!canEdit(props.editable, key)) return;
      const letter = typed[index] ?? '';
      // Deleting from the end clears only this word's own letters; a letter
      // the crossing word already has stays.
      if (!letter && index >= typed.length && (byCell.get(cellKey(cell.row, cell.col)) ?? []).length > 1 && (props.answers[key] ?? '')) return;
      if ((props.answers[key] ?? '') !== letter) props.onChange?.(key, letter);
    });
  };
  const next = () => {
    if (!active) return;
    const open = crossword.entries.filter((entry) => isOpen(entry));
    const after = open[(open.indexOf(active) + 1) % open.length];
    if (after) choose(after);
  };

  return (
    <div className='ut-crossword'>
      <div className='ut-grid' style={{ ['--ut-cols' as string]: crossword.cols, ['--ut-rows' as string]: crossword.rows }} aria-hidden={editing ? 'true' : undefined}>
        {crossword.cells.map((cell) => {
          const key = keyOf(cell.row, cell.col);
          return (
            <span
              key={key}
              className='ut-cell'
              data-cell={cellKey(cell.row, cell.col)}
              data-active={activeCells.has(cellKey(cell.row, cell.col))}
              data-locked={editing && !canEdit(props.editable, key) ? 'true' : undefined}
              style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}
              onClick={() => pickCell(cell.row, cell.col)}
            >
              {cell.number !== null ? <span className='ut-cell-number'>{cell.number}</span> : null}
              <span className='ut-cell-letter'>{props.answers[key] ?? ''}</span>
            </span>
          );
        })}
      </div>
      {editing && active ? (
        <div className='ut-word-entry'>
          <label className='ut-field-row'>
            <span className='ut-field-label'>{active.number} {active.dir === 'across' ? '→' : '↓'} {active.clue} · {active.length} tähte</span>
            <input
              className='ut-input ut-word-input'
              value={shown}
              maxLength={active.length}
              autoCapitalize='characters'
              autoCorrect='off'
              autoComplete='off'
              spellCheck={false}
              enterKeyHint='next'
              onChange={(event) => type(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); next(); } }}
            />
          </label>
        </div>
      ) : null}
      <ol className='ut-clues'>
        {crossword.entries.map((entry) => {
          const slot = crosswordSlotKey(exercise.id, entry);
          if (hidden(props, slot)) return null;
          const filled = letters(entry);
          return (
            <li key={slot} className='ut-clue' data-active={active === entry} data-slot={slot}>
              <button type='button' className='ut-clue-button' disabled={editing && !isOpen(entry)} onClick={() => choose(entry)}>
                <strong>{entry.number} {entry.dir === 'across' ? '→' : '↓'}</strong> {entry.clue} <small>({entry.length})</small>
                {filled.some(Boolean) ? <span className='ut-clue-word'>{filled.map((letter) => letter || '·').join('')}</span> : null}
              </button>
              <SlotFoot slot={slot} props={props} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function UnitTestSheet(props: SheetProps) {
  const slots = useMemo(() => sheetSlots(props.test), [props.test]);
  return (
    <div className='ut-sheet'>
      {props.test.exercises.map((exercise, index) => {
        // An exercise whose every answer is hidden is not shown at all.
        if (props.hiddenSlots && slots.filter((slot) => slot.exerciseId === exercise.id).every((slot) => props.hiddenSlots!.has(slot.key))) return null;
        return (
          <section key={exercise.id} className='ut-exercise' aria-labelledby={`ut-ex-${exercise.id}`}>
            <h2 id={`ut-ex-${exercise.id}`} className='ut-exercise-title'>
              <span className='ut-exercise-number'>{index + 1}</span>
              <span>{exercise.instruction}</span>
            </h2>
            {exercise.scene ? <p className='ut-scene'>{exercise.scene}</p> : null}
            {exercise.wordBank && exercise.type !== 'choice' ? (
              <ul className='ut-bank' aria-label='Sõnad, mida kasutada'>
                {exercise.wordBank.map((word, position) => <li key={`${position}-${word}`}>{word}</li>)}
              </ul>
            ) : null}
            {exercise.type === 'crossword' && exercise.crossword ? (
              <CrosswordView exercise={exercise} crossword={exercise.crossword} props={props} />
            ) : (
              <ol className='ut-items'>
                {exercise.items.map((item) => exercise.type === 'choice'
                  ? <ChoiceItemView key={item.id} exercise={exercise} item={item} props={props} />
                  : exercise.type === 'order'
                    ? <OrderItemView key={item.id} exercise={exercise} item={item} props={props} />
                    : <TextItemView key={item.id} exercise={exercise} item={item} props={props} />)}
              </ol>
            )}
          </section>
        );
      })}
    </div>
  );
}

// Every gradable answer of the sheet, with the answer keys it is made of (a
// crossword word is made of its letter cells). Used for progress ("12 / 32
// vastatud") and for jumping to the next empty answer.
export type SheetSlot = { key: string; exerciseId: string; answerKeys: string[] };

export function sheetSlots(test: ClientUnitTest): SheetSlot[] {
  const slots: SheetSlot[] = [];
  for (const exercise of test.exercises) {
    if (exercise.type === 'crossword' && exercise.crossword) {
      for (const entry of exercise.crossword.entries) {
        slots.push({ key: crosswordSlotKey(exercise.id, entry), exerciseId: exercise.id, answerKeys: entryCells(entry).map((cell) => crosswordCellAnswerKey(exercise.id, cell.row, cell.col)) });
      }
      continue;
    }
    for (const item of exercise.items) {
      if (item.example) continue;
      if (exercise.type === 'text') {
        (item.fields ?? ['']).forEach((_, index) => {
          const key = fieldSlotKey(exercise.id, item.id, index);
          slots.push({ key, exerciseId: exercise.id, answerKeys: [key] });
        });
      } else {
        const key = itemSlotKey(exercise.id, item.id);
        slots.push({ key, exerciseId: exercise.id, answerKeys: [key] });
      }
    }
  }
  return slots;
}

// Every answer key the child can fill in.
export function sheetAnswerKeys(test: ClientUnitTest): string[] {
  return [...new Set(sheetSlots(test).flatMap((slot) => slot.answerKeys))];
}
