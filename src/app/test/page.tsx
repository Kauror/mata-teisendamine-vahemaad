'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateLengthExercises } from '@/lib/exercises/lengths';
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
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const q = generateLengthExercises(category, difficulty, count, seed);
    setQuestions(q);
    setAnswers(Array(q.length).fill(''));
    setIndex(0);
    setElapsed(0);
    setError('');
  }, [category, difficulty, count, seed]);

  useEffect(() => {
    if (!questions.length) return;
    const t = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(t);
  }, [questions.length]);

  if (!questions.length) return <main className='container'><div className='card'>Laadin küsimusi...</div></main>;
  const current = questions[index];

  const submit = async () => {
    const value = answers[index] || '';
    const err = validateAnswerInput(value);
    if (err) {
      setError(err === 'Palun sisesta vastus.' ? 'Sisesta vastus.' : err);
      inputRef.current?.focus();
      return;
    }
    setError('');
    if (index < count - 1) {
      setIndex(index + 1);
      inputRef.current?.focus();
      return;
    }

    const results = questions.map((q, i) => ({ ...q, userAnswer: answers[i], isCorrect: isAnswerCorrect(answers[i], q.correctAnswer) }));
    const score = results.filter((r) => r.isCorrect).length;
    const createdAt = new Date().toISOString();

    const res = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ createdAt, category, difficulty, questionCount: count, score, elapsedSeconds: elapsed, questions: results })
    });
    const body = await res.json();
    router.push(`/history/${body.id}`);
  };

  const progress = ((index + 1) / count) * 100;

  return <main className='container'><div className='card'><p>{category} · {difficulty} · {count} küsimust</p><p>Küsimus {index + 1} / {count}</p><p>Aeg {formatElapsed(elapsed)}</p><div className='progress'><span style={{ width: `${progress}%` }} /></div><h2>{current.question}</h2><div className='answer'><input ref={inputRef} className={error ? 'input-error' : ''} inputMode='decimal' value={answers[index]} onChange={(e) => { const n = e.target.value; if (/^\d*([,.]\d*)?$/.test(n)) { const copy = [...answers]; copy[index] = n; setAnswers(copy); } }} placeholder='Sisesta number' /><strong>{current.expectedUnit}</strong></div>{error && <p className='error'>{error}</p>}<button onClick={submit}>{index === count - 1 ? 'Lõpeta test' : 'Järgmine'}</button></div></main>;
}

export default function TestPage() {
  return <Suspense fallback={<main className='container'><div className='card'>Laadin küsimusi...</div></main>}><TestPageContent /></Suspense>;
}
