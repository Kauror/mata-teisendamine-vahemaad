'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '@/lib/englishGame';
import { KirsiReadingPair } from '@/lib/kirsiReadingPairs';

type PictureWordSprintBoardProps = {
  pairs: KirsiReadingPair[];
  onPair: (ok: boolean, picture: KirsiReadingPair, word: KirsiReadingPair) => void;
  onBoardComplete: () => void;
  layoutSeed?: number;
  state?: PictureWordSprintBoardState;
  onStateChange?: (state: PictureWordSprintBoardState) => void;
};

export type PictureWordSprintBoardState = {
  boardKey: string;
  selectedPictureId: string | null;
  selectedWordId: string | null;
  completedIds: string[];
};

export default function PictureWordSprintBoard({ pairs, onPair, onBoardComplete, layoutSeed = 1, state, onStateChange }: PictureWordSprintBoardProps) {
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedBoardKeyRef = useRef<string | null>(null);
  const onBoardCompleteRef = useRef(onBoardComplete);
  const boardKey = useMemo(() => `${layoutSeed}:${pairs.map((pair) => pair.id).join('|')}`, [layoutSeed, pairs]);
  const controlled = state !== undefined;
  const selectedPictureId = controlled ? state.selectedPictureId : selectedPicture;
  const selectedWordId = controlled ? state.selectedWordId : selectedWord;
  const completedIds = controlled ? state.completedIds : [...done];
  const completed = new Set(completedIds);
  const boardComplete = pairs.length > 0 && pairs.every((pair) => completed.has(pair.id));

  const updateState = (next: Omit<PictureWordSprintBoardState, 'boardKey'>) => {
    if (controlled) onStateChange?.({ boardKey, ...next });
    else {
      setSelectedPicture(next.selectedPictureId);
      setSelectedWord(next.selectedWordId);
      setDone(new Set(next.completedIds));
    }
  };

  useEffect(() => {
    onBoardCompleteRef.current = onBoardComplete;
  }, [onBoardComplete]);

  useEffect(() => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    completedBoardKeyRef.current = null;
    if (!controlled) {
      setSelectedPicture(null);
      setSelectedWord(null);
      setDone(new Set());
    } else if (state.boardKey !== boardKey) {
      onStateChange?.({ boardKey, selectedPictureId: null, selectedWordId: null, completedIds: [] });
    }
  }, [boardKey, controlled, onStateChange, state?.boardKey]);

  useEffect(() => () => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
  }, []);

  const left = useMemo(() => shuffle(pairs, layoutSeed * 997 + pairs.length * 13), [layoutSeed, pairs]);
  const right = useMemo(() => shuffle(pairs, layoutSeed * 1597 + pairs.length * 31), [layoutSeed, pairs]);

  useEffect(() => {
    if (!boardComplete || completedBoardKeyRef.current === boardKey) return;
    completedBoardKeyRef.current = boardKey;
    completionTimerRef.current = setTimeout(() => onBoardCompleteRef.current(), 250);
  }, [boardComplete, boardKey]);

  const tryMatch = (pictureId: string | null, wordId: string | null) => {
    if (!pictureId || !wordId) return;
    const picture = pairs.find((pair) => pair.id === pictureId);
    const word = pairs.find((pair) => pair.id === wordId);
    if (!picture || !word) return;

    const ok = picture.id === word.id;
    onPair(ok, picture, word);
    updateState({
      selectedPictureId: null,
      selectedWordId: null,
      completedIds: ok ? [...new Set([...completedIds, picture.id])] : completedIds
    });
  };

  return (
    <div className='matching-board picture-word-board'>
      <div className='word-column' aria-label='Pildid'>
        {left.map((pair) => {
          const isDone = completed.has(pair.id);
          return (
            <button
              key={pair.id}
              type='button'
              disabled={isDone}
              className={`word-card picture-card ${selectedPictureId === pair.id ? 'word-card-selected' : ''} ${isDone ? 'word-card-correct' : ''}`}
              aria-label={`${pair.image} pilt${isDone ? ', valmis' : ''}`}
              onClick={() => {
                if (selectedWordId) tryMatch(pair.id, selectedWordId);
                else updateState({ selectedPictureId: pair.id, selectedWordId, completedIds });
              }}
            >
              <span className='picture-card-emoji' aria-hidden>{pair.image}</span>
            </button>
          );
        })}
      </div>
      <div className='word-column' aria-label='Sõnad'>
        {right.map((pair) => {
          const isDone = completed.has(pair.id);
          return (
            <button
              key={pair.id}
              type='button'
              disabled={isDone}
              className={`word-card reading-word-card ${selectedWordId === pair.id ? 'word-card-selected' : ''} ${isDone ? 'word-card-correct' : ''}`}
              onClick={() => {
                if (selectedPictureId) tryMatch(selectedPictureId, pair.id);
                else updateState({ selectedPictureId, selectedWordId: pair.id, completedIds });
              }}
            >
              <span>{pair.word}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
