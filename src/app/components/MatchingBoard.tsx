'use client';

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { shuffleWithSeed as shuffle } from '@/lib/random';

// Which card is picked in each column and which pairs are done. The runner
// owns it (it is part of the saved run), so a resumed board is exact.
export type MatchingSelection = {
  boardKey: string;
  leftId: string | null;
  rightId: string | null;
  completedIds: string[];
};

// Why the selection changed: a new board, a card picked, or a pair tried.
export type MatchingChange = { kind: 'reset' } | { kind: 'select' } | { kind: 'pair'; ok: boolean };

type MatchingBoardProps<T extends { id: string }> = {
  items: T[];
  layoutSeed: number;
  selection: MatchingSelection;
  onSelectionChange: (next: MatchingSelection, change: MatchingChange) => void;
  onPair: (ok: boolean, left: T, right: T) => void;
  onBoardComplete: () => void;
  renderLeft: (item: T) => ReactNode;
  renderRight: (item: T) => ReactNode;
  className?: string;
  leftColumnLabel?: string;
  rightColumnLabel?: string;
  leftCardClassName?: string;
  rightCardClassName?: string;
  leftCardLabel?: (item: T, done: boolean) => string;
  children?: ReactNode;
};

const COMPLETION_DELAY_MS = 250;

// Two shuffled columns of the same items; the child pairs each left card
// with its right card. A finished board reports itself once, after a short
// pause so the last pair is seen turning green.
export default function MatchingBoard<T extends { id: string }>({
  items,
  layoutSeed,
  selection,
  onSelectionChange,
  onPair,
  onBoardComplete,
  renderLeft,
  renderRight,
  className = 'matching-board',
  leftColumnLabel,
  rightColumnLabel,
  leftCardClassName = 'word-card',
  rightCardClassName = 'word-card',
  leftCardLabel,
  children
}: MatchingBoardProps<T>) {
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedBoardKeyRef = useRef<string | null>(null);
  const onBoardCompleteRef = useRef(onBoardComplete);
  const onSelectionChangeRef = useRef(onSelectionChange);
  const boardKey = useMemo(() => `${layoutSeed}:${items.map((item) => item.id).join('|')}`, [layoutSeed, items]);
  const { leftId, rightId, completedIds } = selection;
  const completed = new Set(completedIds);
  const boardComplete = items.length > 0 && items.every((item) => completed.has(item.id));

  useEffect(() => {
    onBoardCompleteRef.current = onBoardComplete;
    onSelectionChangeRef.current = onSelectionChange;
  }, [onBoardComplete, onSelectionChange]);

  // A new board starts empty, unless the saved selection already belongs to it.
  useEffect(() => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    completedBoardKeyRef.current = null;
    if (selection.boardKey !== boardKey) {
      onSelectionChangeRef.current({ boardKey, leftId: null, rightId: null, completedIds: [] }, { kind: 'reset' });
    }
  }, [boardKey, selection.boardKey]);

  useEffect(() => () => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
  }, []);

  const left = useMemo(() => shuffle(items, layoutSeed * 997 + items.length * 13), [layoutSeed, items]);
  const right = useMemo(() => shuffle(items, layoutSeed * 1597 + items.length * 31), [layoutSeed, items]);

  useEffect(() => {
    if (!boardComplete || completedBoardKeyRef.current === boardKey) return;
    completedBoardKeyRef.current = boardKey;
    completionTimerRef.current = setTimeout(() => onBoardCompleteRef.current(), COMPLETION_DELAY_MS);
  }, [boardComplete, boardKey]);

  const select = (nextLeftId: string | null, nextRightId: string | null) => {
    onSelectionChange({ boardKey, leftId: nextLeftId, rightId: nextRightId, completedIds }, { kind: 'select' });
  };

  const tryMatch = (pickedLeftId: string, pickedRightId: string) => {
    const leftItem = items.find((item) => item.id === pickedLeftId);
    const rightItem = items.find((item) => item.id === pickedRightId);
    if (!leftItem || !rightItem) return;
    const ok = leftItem.id === rightItem.id;
    onPair(ok, leftItem, rightItem);
    onSelectionChange({
      boardKey,
      leftId: null,
      rightId: null,
      completedIds: ok ? [...new Set([...completedIds, leftItem.id])] : completedIds
    }, { kind: 'pair', ok });
  };

  return (
    <div className={className}>
      <div className='word-column' aria-label={leftColumnLabel}>
        {left.map((item) => {
          const isDone = completed.has(item.id);
          return (
            <button
              key={item.id}
              type='button'
              disabled={isDone}
              className={`${leftCardClassName} ${leftId === item.id ? 'word-card-selected' : ''} ${isDone ? 'word-card-correct' : ''}`}
              aria-label={leftCardLabel?.(item, isDone)}
              onClick={() => {
                if (rightId) tryMatch(item.id, rightId);
                else select(item.id, rightId);
              }}
            >
              {renderLeft(item)}
            </button>
          );
        })}
      </div>
      <div className='word-column' aria-label={rightColumnLabel}>
        {right.map((item) => {
          const isDone = completed.has(item.id);
          return (
            <button
              key={item.id}
              type='button'
              disabled={isDone}
              className={`${rightCardClassName} ${rightId === item.id ? 'word-card-selected' : ''} ${isDone ? 'word-card-correct' : ''}`}
              onClick={() => {
                if (leftId) tryMatch(leftId, item.id);
                else select(leftId, item.id);
              }}
            >
              {renderRight(item)}
            </button>
          );
        })}
      </div>
      {children}
    </div>
  );
}
