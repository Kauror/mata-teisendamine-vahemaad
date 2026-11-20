'use client';

import { Fragment, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ClientCrossword, ClientExercise, ClientItem, ClientUnitTest } from '@/lib/unitTests/clientView';
import { cellKey, entryCells } from '@/lib/unitTests/crossword';
import { crosswordCellAnswerKey } from '@/lib/unitTests/grading';
import type { Answers, Mark } from '@/lib/unitTests/types';

// The workbook test as a sheet of exercises. The child fills it in; the
// parent sees the same sheet read-only, with marking controls next to every
// answer (`slotExtra`). Keys follow lib/unitTests/grading.ts buildSlots.

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
  slotExtra?: (slotKey: string) => ReactNode;
};

function MarkBadge({ mark }: { mark: Mark | null | undefined }) {
  if (mark === undefined) return null;
  const label = mark === 1 ? 'Õige' : mark === 0.5 ? 'Pooleldi õige' : mark === 0 ? 'Vale' : 'Hindamata';
  const symbol = mark === 1 ? '✓' : mark === 0.5 ? '½' : mark === 0 ? '✗' : '?';
  return <span className='ut-mark' data-mark={mark === null ? 'none' : String(mark)} role='img' aria-label={label}>{symbol}</span>;
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

function ChoiceItemView({ exercise, item, props }: { exercise: ClientExercise; item: ClientItem; props: SheetProps }) {
  const key = itemSlotKey(exercise.id, item.id);
  const value = item.example ? item.example[0] : props.answers[key] ?? '';
  const enabled = !item.example && canEdit(props.editable, key) && Boolean(props.onChange);
  return (
    <li className='ut-item' data-example={Boolean(item.example)}>
      <p className='ut-prompt'>{item.prompt ? <Prompt text={item.prompt} /> : null}{item.example ? <span className='ut-example-tag'>näide</span> : null}</p>
      <div className='ut-options' role='group' aria-label={item.prompt || `Ülesanne ${item.id}`}>
        {(item.options ?? []).map((option) => (
          <button key={option} type='button' className='ut-option' aria-pressed={value === option} disabled={!enabled && value !== option} onClick={() => enabled && props.onChange?.(key, value === option ? '' : option)}>
            {option}
          </button>
        ))}
      </div>
      {!item.example ? <div className='ut-slot-foot'><MarkBadge mark={props.marks?.[key]} />{props.slotExtra?.(key)}</div> : null}
    </li>
  );
}

function TextItemView({ exercise, item, props }: { exercise: ClientExercise; item: ClientItem; props: SheetProps }) {
  const fields = item.fields ?? [''];
  return (
    <li className='ut-item' data-example={Boolean(item.example)}>
      <p className='ut-prompt'><Prompt text={item.prompt} />{item.example ? <span className='ut-example-tag'>näide</span> : null}</p>
      {fields.map((field, index) => {
        const key = fieldSlotKey(exercise.id, item.id, index);
        const value = item.example ? item.example[index] ?? '' : props.answers[key] ?? '';
        const enabled = !item.example && canEdit(props.editable, key) && Boolean(props.onChange);
        const label = field || (fields.length > 1 ? `Vastus ${index + 1}` : 'Vastus');
        return (
          <div key={key} className='ut-field'>
            <label className='ut-field-row'>
              {field ? <span className='ut-field-label'>{field}</span> : <span className='sr-only'>{label}</span>}
              <input
                className='ut-input'
                value={value}
                readOnly={!enabled}
                data-locked={!enabled && !item.example ? 'true' : undefined}
                autoCapitalize='off'
                autoCorrect='off'
                autoComplete='off'
                spellCheck={false}
                maxLength={300}
                onChange={(event) => props.onChange?.(key, event.target.value)}
              />
            </label>
            {!item.example ? <div className='ut-slot-foot'><MarkBadge mark={props.marks?.[key]} />{props.slotExtra?.(key)}</div> : null}
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
  const tokens = item.tokens ?? [];
  const value = item.example ? item.example[0] : props.answers[key] ?? '';
  const enabled = !item.example && canEdit(props.editable, key) && Boolean(props.onChange);
  const used = item.example ? [] : usedTokens(tokens, value);
  const set = (indexes: number[]) => props.onChange?.(key, indexes.map((index) => tokens[index]).join(' '));
  return (
    <li className='ut-item' data-example={Boolean(item.example)}>
      {item.prompt ? <p className='ut-prompt'><Prompt text={item.prompt} /></p> : null}
      {item.example ? (
        <p className='ut-built ut-built-example'>{value}<span className='ut-example-tag'>näide</span></p>
      ) : (
        <>
          <div className='ut-built' aria-label='Sinu lause'>
            {used.length === 0 ? <span className='ut-built-empty'>Puuduta sõnu õiges järjekorras</span> : used.map((index, position) => (
              <button key={`${index}-${position}`} type='button' className='ut-token ut-token-used' disabled={!enabled} onClick={() => set(used.filter((_, i) => i !== position))}>{tokens[index]}</button>
            ))}
          </div>
          <div className='ut-tokens' role='group' aria-label='Sõnad'>
            {tokens.map((token, index) => used.includes(index) ? null : (
              <button key={`${token}-${index}`} type='button' className='ut-token' disabled={!enabled} onClick={() => set([...used, index])}>{token}</button>
            ))}
          </div>
          <div className='ut-slot-foot'><MarkBadge mark={props.marks?.[key]} />{props.slotExtra?.(key)}</div>
        </>
      )}
    </li>
  );
}

function CrosswordView({ exercise, crossword, props }: { exercise: ClientExercise; crossword: ClientCrossword; props: SheetProps }) {
  const [active, setActive] = useState<{ number: number; dir: 'across' | 'down' } | null>(null);
  const inputs = useRef(new Map<string, HTMLInputElement>());
  const byCell = useMemo(() => {
    const map = new Map<string, Array<ClientCrossword['entries'][number]>>();
    for (const entry of crossword.entries) for (const cell of entryCells(entry)) {
      const key = cellKey(cell.row, cell.col);
      map.set(key, [...(map.get(key) ?? []), entry]);
    }
    return map;
  }, [crossword]);
  const activeEntry = active ? crossword.entries.find((entry) => entry.number === active.number && entry.dir === active.dir) ?? null : null;
  const activeCells = new Set(activeEntry ? entryCells(activeEntry).map((cell) => cellKey(cell.row, cell.col)) : []);

  const focusCell = (row: number, col: number) => inputs.current.get(cellKey(row, col))?.focus();
  const pick = (row: number, col: number) => {
    const entries = byCell.get(cellKey(row, col)) ?? [];
    if (entries.length === 0) return;
    // Tapping a crossing cell again switches between its two words.
    const current = entries.find((entry) => active && entry.number === active.number && entry.dir === active.dir);
    const next = current && entries.length > 1 ? entries.find((entry) => entry !== current)! : current ?? entries[0];
    setActive({ number: next.number, dir: next.dir });
  };
  const step = (row: number, col: number, delta: number) => {
    if (!activeEntry) return;
    const cells = entryCells(activeEntry);
    const index = cells.findIndex((cell) => cell.row === row && cell.col === col);
    const target = cells[index + delta];
    if (target) focusCell(target.row, target.col);
  };

  return (
    <div className='ut-crossword'>
      <div className='ut-grid' style={{ ['--ut-cols' as string]: crossword.cols, ['--ut-rows' as string]: crossword.rows }} role='group' aria-label='Ristsõna'>
        {crossword.cells.map((cell) => {
          const key = crosswordCellAnswerKey(exercise.id, cell.row, cell.col);
          const value = props.answers[key] ?? '';
          const enabled = canEdit(props.editable, key) && Boolean(props.onChange);
          const words = byCell.get(cellKey(cell.row, cell.col)) ?? [];
          return (
            <span key={key} className='ut-cell' data-cell={cellKey(cell.row, cell.col)} data-active={activeCells.has(cellKey(cell.row, cell.col))} data-locked={!enabled ? 'true' : undefined} style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 }}>
              {cell.number !== null ? <span className='ut-cell-number' aria-hidden>{cell.number}</span> : null}
              <input
                ref={(node) => { if (node) inputs.current.set(cellKey(cell.row, cell.col), node); else inputs.current.delete(cellKey(cell.row, cell.col)); }}
                aria-label={`Ruut: ${words.map((entry) => `${entry.number} ${entry.dir === 'across' ? 'paremale' : 'alla'}`).join(', ')}`}
                value={value}
                readOnly={!enabled}
                maxLength={2}
                autoCapitalize='characters'
                autoCorrect='off'
                autoComplete='off'
                spellCheck={false}
                onFocus={() => { if (!activeCells.has(cellKey(cell.row, cell.col))) pick(cell.row, cell.col); }}
                onClick={() => pick(cell.row, cell.col)}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && !value) { event.preventDefault(); step(cell.row, cell.col, -1); }
                }}
                onChange={(event) => {
                  if (!enabled) return;
                  const letter = event.target.value.replace(value, '').slice(-1).toUpperCase().replace(/[^A-Z]/g, '') || event.target.value.slice(-1).toUpperCase().replace(/[^A-Z]/g, '');
                  props.onChange?.(key, letter);
                  if (letter) step(cell.row, cell.col, 1);
                }}
              />
            </span>
          );
        })}
      </div>
      <ol className='ut-clues'>
        {crossword.entries.map((entry) => {
          const slot = crosswordSlotKey(exercise.id, entry);
          const selected = activeEntry === entry;
          return (
            <li key={slot} className='ut-clue' data-active={selected}>
              <button type='button' className='ut-clue-button' onClick={() => { setActive({ number: entry.number, dir: entry.dir }); focusCell(entry.row, entry.col); }}>
                <strong>{entry.number} {entry.dir === 'across' ? '→' : '↓'}</strong> {entry.clue} <small>({entry.length})</small>
              </button>
              <div className='ut-slot-foot'><MarkBadge mark={props.marks?.[slot]} />{props.slotExtra?.(slot)}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function UnitTestSheet(props: SheetProps) {
  return (
    <div className='ut-sheet'>
      {props.test.exercises.map((exercise, index) => (
        <section key={exercise.id} className='ut-exercise' aria-labelledby={`ut-ex-${exercise.id}`}>
          <h2 id={`ut-ex-${exercise.id}`} className='ut-exercise-title'>
            <span className='ut-exercise-number'>{index + 1}</span>
            <span>{exercise.instruction}</span>
          </h2>
          {exercise.scene ? <p className='ut-scene'>{exercise.scene}</p> : null}
          {exercise.wordBank && exercise.type !== 'choice' ? (
            <ul className='ut-bank' aria-label='Sõnad, mida kasutada'>
              {exercise.wordBank.map((word) => <li key={word}>{word}</li>)}
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
      ))}
    </div>
  );
}

// Every answer key the child can fill in (for counting the unanswered ones).
export function sheetAnswerKeys(test: ClientUnitTest): string[] {
  const keys: string[] = [];
  for (const exercise of test.exercises) {
    if (exercise.type === 'crossword' && exercise.crossword) {
      for (const cell of exercise.crossword.cells) keys.push(crosswordCellAnswerKey(exercise.id, cell.row, cell.col));
      continue;
    }
    for (const item of exercise.items) {
      if (item.example) continue;
      if (exercise.type === 'text') (item.fields ?? ['']).forEach((_, index) => keys.push(fieldSlotKey(exercise.id, item.id, index)));
      else keys.push(itemSlotKey(exercise.id, item.id));
    }
  }
  return keys;
}
