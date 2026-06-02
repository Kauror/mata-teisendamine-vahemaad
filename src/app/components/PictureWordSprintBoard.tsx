'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { shuffle } from '@/lib/englishGame';
import { KirsiReadingPair } from '@/lib/kirsiReadingPairs';

type PictureWordSprintBoardProps = {
  pairs: KirsiReadingPair[];
  onPair: (ok: boolean, picture: KirsiReadingPair, word: KirsiReadingPair) => void;
  onBoardComplete: () => void;
  layoutSeed?: number;
};

export default function PictureWordSprintBoard({ pairs, onPair, onBoardComplete, layoutSeed = 1 }: PictureWordSprintBoardProps) {
  const [selectedPicture, setSelectedPicture] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedBoardKeyRef = useRef<string | null>(null);
  const onBoardCompleteRef = useRef(onBoardComplete);
  const boardKey = useMemo(() => pairs.map((pair) => pair.id).join('|'), [pairs]);

  useEffect(() => {
    onBoardCompleteRef.current = onBoardComplete;
  }, [onBoardComplete]);

  useEffect(() => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    completedBoardKeyRef.current = null;
    setSelectedPicture(null);
    setSelectedWord(null);
    setDone(new Set());
  }, [boardKey]);

  useEffect(() => () => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
  }, []);

  const left = useMemo(() => shuffle(pairs, layoutSeed * 997 + pairs.length * 13), [layoutSeed, pairs]);
  const right = useMemo(() => shuffle(pairs, layoutSeed * 1597 + pairs.length * 31), [layoutSeed, pairs]);

  useEffect(() => {
    if (pairs.length === 0 || done.size < pairs.length || completedBoardKeyRef.current === boardKey) return;
    completedBoardKeyRef.current = boardKey;
    completionTimerRef.current = setTimeout(() => onBoardCompleteRef.current(), 250);
  }, [boardKey, done.size, pairs.length]);

  const tryMatch = (pictureId: string | null, wordId: string | null) => {
    if (!pictureId || !wordId) return;
    const picture = pairs.find((pair) => pair.id === pictureId);
    const word = pairs.find((pair) => pair.id === wordId);
    if (!picture || !word) return;

    const ok = picture.id === word.id;
    onPair(ok, picture, word);
    if (ok) {
      setDone((prev) => new Set([...prev, picture.id]));
    }
    setSelectedPicture(null);
    setSelectedWord(null);
  };

  return (
    <div className='matching-board picture-word-board'>
      <div className='word-column' aria-label='Pildid'>
        {left.map((pair) => {
          const isDone = done.has(pair.id);
          return (
            <button
              key={pair.id}
              type='button'
              disabled={isDone}
              className={`word-card picture-card ${selectedPicture === pair.id ? 'word-card-selected' : ''} ${isDone ? 'word-card-correct' : ''}`}
              aria-label={`${pair.image} pilt${isDone ? ', valmis' : ''}`}
              onClick={() => {
                setSelectedPicture(pair.id);
                tryMatch(pair.id, selectedWord);
              }}
            >
              <span className='picture-card-emoji' aria-hidden>{pair.image}</span>
            </button>
          );
        })}
      </div>
      <div className='word-column' aria-label='Sõnad'>
        {right.map((pair) => {
          const isDone = done.has(pair.id);
          return (
            <button
              key={pair.id}
              type='button'
              disabled={isDone}
              className={`word-card reading-word-card ${selectedWord === pair.id ? 'word-card-selected' : ''} ${isDone ? 'word-card-correct' : ''}`}
              onClick={() => {
                setSelectedWord(pair.id);
                tryMatch(selectedPicture, pair.id);
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
