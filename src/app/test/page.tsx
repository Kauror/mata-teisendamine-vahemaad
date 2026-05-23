'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateSession } from '@/lib/exercises/lengths';
import { formatElapsed, isAnswerCorrect, validateAnswerInput } from '@/lib/validation';

function TestPageContent() {
  const p = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const category = (p.get('category') || 'Teisendamine') as Category;
  const difficulty = (p.get('difficulty') || 'Lihtne') as Difficulty;
  const count = Number(p.get('count') || 5);
  const seed = Number(p.get('seed') || Date.now());

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [ordering, setOrdering] = useState<string[][]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = generateSession(category, difficulty, count, seed);
    setQuestions(q);
    setAnswers(Array(q.length).fill(''));
    setOrdering(Array.from({ length: q.length }, () => []));
    setIndex(0);
    setElapsed(0);
    setError('');
  }, [category, difficulty, count, seed]);

  useEffect(() => { if (!questions.length) return; const t = setInterval(() => setElapsed((v) => v + 1), 1000); return () => clearInterval(t); }, [questions.length]);

  if (!questions.length) return <main className='container'><div className='card'>Laadin küsimusi...</div></main>;
  const current = questions[index];

  const submit = async () => {
    if (current.kind === 'ordering') {
      const selected = ordering[index] || [];
      const cards = current.orderingCards || [];
      if (selected.length !== cards.length) return setError('Järjesta kõik kaardid.');
      setError('');
    } else {
      const value = answers[index] || '';
      const err = validateAnswerInput(value);
      if (err) { setError(err === 'Palun sisesta vastus.' ? 'Sisesta vastus.' : err); inputRef.current?.focus(); return; }
      setError('');
    }

    if (index < count - 1) return setIndex(index + 1);

    const results = questions.map((q, i) => {
      if (q.kind === 'ordering') {
        const cards = q.orderingCards || [];
        const correct = [...cards].sort((a, b) => q.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm).map((c) => c.id);
        const user = ordering[i] || [];
        return { ...q, userAnswer: user.join('>'), isCorrect: JSON.stringify(user) === JSON.stringify(correct) };
      }
      return { ...q, userAnswer: answers[i], isCorrect: isAnswerCorrect(answers[i], q.correctAnswer) };
    });

    const score = results.filter((r) => r.isCorrect).length;
    const createdAt = new Date().toISOString();
    const res = await fetch('/api/history', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ createdAt, category, difficulty, questionCount: count, score, elapsedSeconds: elapsed, questions: results }) });
    const body = await res.json();
    router.push(`/history/${body.id}`);
  };

  const selected = ordering[index] || [];
  const cards = current.orderingCards || [];
  const selectedSet = new Set(selected);

  return <main className='container'><div className='card'><p>{category} · {difficulty} · {count} küsimust</p><p>Küsimus {index + 1} / {count}</p><p>Aeg {formatElapsed(elapsed)}</p><div className='progress'><span style={{ width: `${((index + 1) / count) * 100}%` }} /></div><h2>{current.question}</h2>
    {current.kind === 'ordering' ? <>
      <div className='row'>{cards.filter((c) => !selectedSet.has(c.id)).map((c) => <button type='button' key={c.id} className='chip' onClick={() => setOrdering((prev) => { const n = [...prev]; n[index] = [...(n[index] || []), c.id]; return n; })}>{c.label}</button>)}</div>
      <p>Valitud järjekord:</p>
      <div className='row'>{selected.map((id, pos) => { const card = cards.find((c) => c.id === id); if (!card) return null; return <div key={id} className='chip active'>{card.label} <button type='button' onClick={() => setOrdering((prev) => { const n = [...prev]; const arr = [...(n[index] || [])]; if (pos > 0) [arr[pos - 1], arr[pos]] = [arr[pos], arr[pos - 1]]; n[index] = arr; return n; })}>←</button><button type='button' onClick={() => setOrdering((prev) => { const n = [...prev]; const arr = [...(n[index] || [])]; if (pos < arr.length - 1) [arr[pos + 1], arr[pos]] = [arr[pos], arr[pos + 1]]; n[index] = arr; return n; })}>→</button></div>; })}</div>
      <button type='button' className='danger' onClick={() => setOrdering((prev) => { const n = [...prev]; n[index] = []; return n; })}>Tühjenda valik</button>
    </> : <div className='answer'><input ref={inputRef} className={error ? 'input-error' : ''} inputMode='decimal' value={answers[index]} onChange={(e) => { const n = e.target.value; if (/^\d*([,.]\d*)?$/.test(n)) { const copy = [...answers]; copy[index] = n; setAnswers(copy); } }} placeholder='Sisesta number' /><strong>{current.expectedUnit}</strong></div>}
    {error && <p className='error'>{error}</p>}
    <button onClick={submit}>{index === count - 1 ? 'Lõpeta test' : 'Järgmine'}</button></div></main>;
}

export default function TestPage() { return <Suspense fallback={<main className='container'><div className='card'>Laadin küsimusi...</div></main>}><TestPageContent /></Suspense>; }
