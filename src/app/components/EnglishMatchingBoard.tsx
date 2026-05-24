'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { EnglishVocabularyWord } from '@/lib/englishVocabulary';
import { shuffle } from '@/lib/englishGame';

type EnglishMatchingBoardProps = {
  words: EnglishVocabularyWord[];
  onPair: (ok: boolean, word: EnglishVocabularyWord) => void;
  onBoardComplete: () => void;
};

export default function EnglishMatchingBoard({ words, onPair, onBoardComplete }: EnglishMatchingBoardProps) {
  const [selectedEn, setSelectedEn] = useState<string | null>(null);
  const [selectedEt, setSelectedEt] = useState<string | null>(null);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [feedback, setFeedback] = useState('');
  const completionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const completedBoardKeyRef = useRef<string | null>(null);
  const onBoardCompleteRef = useRef(onBoardComplete);
  const boardKey = useMemo(() => words.map((word) => word.id).join('|'), [words]);

  useEffect(() => {
    onBoardCompleteRef.current = onBoardComplete;
  }, [onBoardComplete]);

  useEffect(() => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
    completedBoardKeyRef.current = null;
    setSelectedEn(null);
    setSelectedEt(null);
    setDone(new Set());
    setFeedback('');
  }, [boardKey]);

  useEffect(() => () => {
    if (completionTimerRef.current) clearTimeout(completionTimerRef.current);
  }, []);

  const left = useMemo(() => shuffle(words, words.length * 13), [words]);
  const right = useMemo(() => shuffle(words, words.length * 31), [words]);

  useEffect(() => {
    if (words.length === 0 || done.size < words.length || completedBoardKeyRef.current === boardKey) return;
    completedBoardKeyRef.current = boardKey;
    completionTimerRef.current = setTimeout(() => onBoardCompleteRef.current(), 250);
  }, [boardKey, done.size, words.length]);

  const tryMatch = (enId: string | null, etId: string | null) => {
    if (!enId || !etId) return;
    const en = words.find((w) => w.id === enId);
    const et = words.find((w) => w.id === etId);
    if (!en || !et) return;
    const ok = en.id === et.id;
    onPair(ok, en);
    if (ok) {
      setDone((prev) => {
        return new Set([...prev, en.id]);
      });
      setFeedback('Õige!');
    } else {
      setFeedback('Proovi uuesti');
    }
    setSelectedEn(null); setSelectedEt(null);
  };

  return <div className='matching-board'>
    <div className='word-column'>
      {left.map((w) => <button key={w.id} type='button' disabled={done.has(w.id)} className={`word-card ${selectedEn===w.id?'word-card-selected':''} ${done.has(w.id)?'word-card-correct':''}`} onClick={() => { const id = w.id; setSelectedEn(id); tryMatch(id, selectedEt); }}>{w.english}</button>)}
    </div>
    <div className='word-column'>
      {right.map((w) => <button key={w.id} type='button' disabled={done.has(w.id)} className={`word-card ${selectedEt===w.id?'word-card-selected':''} ${done.has(w.id)?'word-card-correct':''}`} onClick={() => { const id = w.id; setSelectedEt(id); tryMatch(selectedEn, id); }}>{w.estonian}</button>)}
    </div>
    <p className='matching-feedback'>{feedback}</p>
  </div>;
}
