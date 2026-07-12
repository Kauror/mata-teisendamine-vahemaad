'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EnglishVocabularyWord } from '@/lib/englishVocabulary';
import { shuffle } from '@/lib/englishGame';

type EnglishMatchingBoardProps = {
  words: EnglishVocabularyWord[];
  onPair: (ok: boolean, word: EnglishVocabularyWord, chosenOption: EnglishVocabularyWord) => void;
  onBoardComplete: () => void;
  layoutSeed?: number;
  showFeedback?: boolean;
  state?: EnglishMatchingBoardState;
  onStateChange?: (state: EnglishMatchingBoardState) => void;
};

export type EnglishMatchingBoardState = {
  boardKey: string;
  selectedEnglishId: string | null;
  selectedEstonianId: string | null;
  completedIds: string[];
  feedback: string;
};

export default function EnglishMatchingBoard({ words, onPair, onBoardComplete, layoutSeed = 1, showFeedback = true, state, onStateChange }: EnglishMatchingBoardProps) {
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedEt, setSelectedEt] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState('');
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedBoardKeyRef = useRef<string | null>(null);
  const onBoardCompleteRef = useRef(onBoardComplete);
  const boardKey = useMemo(() => `${layoutSeed}:${words.map((word) => word.id).join('|')}`, [layoutSeed, words]);
  const controlled = state !== undefined;
  const selectedEnglishId = controlled ? state.selectedEnglishId : selectedEn;
  const selectedEstonianId = controlled ? state.selectedEstonianId : selectedEt;
  const completedIds = controlled ? state.completedIds : [...done];
  const completed = new Set(completedIds);
  const boardComplete = words.length > 0 && words.every((word) => completed.has(word.id));
  const visibleFeedback = controlled ? state.feedback : feedback;

  const updateState = (next: Omit<EnglishMatchingBoardState, 'boardKey'>) => {
    if (controlled) onStateChange?.({ boardKey, ...next });
    else {
      setSelectedEn(next.selectedEnglishId);
      setSelectedEt(next.selectedEstonianId);
      setDone(new Set(next.completedIds));
      setFeedback(next.feedback);
    }
  };

  useEffect(() => {
    onBoardCompleteRef.current = onBoardComplete;
  }, [onBoardComplete]);

  useEffect(() => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    completedBoardKeyRef.current = null;
    if (!controlled) {
      setSelectedEn(null);
      setSelectedEt(null);
      setDone(new Set());
      setFeedback('');
    } else if (state.boardKey !== boardKey) {
      onStateChange?.({ boardKey, selectedEnglishId: null, selectedEstonianId: null, completedIds: [], feedback: '' });
    }
  }, [boardKey, controlled, onStateChange, state?.boardKey]);

  useEffect(() => () => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
  }, []);

  const left = useMemo(() => shuffle(words, layoutSeed * 997 + words.length * 13), [layoutSeed, words]);
  const right = useMemo(() => shuffle(words, layoutSeed * 1597 + words.length * 31), [layoutSeed, words]);

  useEffect(() => {
    if (!boardComplete || completedBoardKeyRef.current === boardKey) return;
    completedBoardKeyRef.current = boardKey;
    completionTimerRef.current = setTimeout(() => onBoardCompleteRef.current(), 250);
  }, [boardComplete, boardKey]);

  const tryMatch = (enId: string | null, etId: string | null) => {
    if (!enId || !etId) return;
    const en = words.find((w) => w.id === enId);
    const et = words.find((w) => w.id === etId);
    if (!en || !et) return;
    const ok = en.id === et.id;
    onPair(ok, en, et);
    updateState({
      selectedEnglishId: null,
      selectedEstonianId: null,
      completedIds: ok ? [...new Set([...completedIds, en.id])] : completedIds,
      feedback: ok ? 'Õige!' : 'Proovi uuesti'
    });
  };

  return <div className='matching-board'>
    <div className='word-column'>
      {left.map((w) => <button key={w.id} type='button' disabled={completed.has(w.id)} className={`word-card ${selectedEnglishId===w.id?'word-card-selected':''} ${completed.has(w.id)?'word-card-correct':''}`} onClick={() => { const id = w.id; if (selectedEstonianId) tryMatch(id, selectedEstonianId); else updateState({ selectedEnglishId: id, selectedEstonianId, completedIds, feedback: visibleFeedback }); }}>{w.english}</button>)}
    </div>
    <div className='word-column'>
      {right.map((w) => <button key={w.id} type='button' disabled={completed.has(w.id)} className={`word-card ${selectedEstonianId===w.id?'word-card-selected':''} ${completed.has(w.id)?'word-card-correct':''}`} onClick={() => { const id = w.id; if (selectedEnglishId) tryMatch(selectedEnglishId, id); else updateState({ selectedEnglishId, selectedEstonianId: id, completedIds, feedback: visibleFeedback }); }}>{w.estonian}</button>)}
    </div>
    {showFeedback ? <p className='matching-feedback'>{visibleFeedback}</p> : null}
  </div>;
}
