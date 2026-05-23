'use client';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { generateLengthExercises } from '@/lib/exercises/lengths';
import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { isAnswerCorrect, validateAnswerInput, formatElapsed } from '@/lib/validation';

export default function TestPage() {
  const params = useSearchParams(); const router = useRouter();
  const category = (params.get('category') || 'Teisendamine') as Category;
  const difficulty = (params.get('difficulty') || 'Lihtne') as Difficulty;
  const count = Number(params.get('count') || 5);
  const questions = useMemo<GeneratedQuestion[]>(() => generateLengthExercises(category, difficulty, count), [category, difficulty, count]);
  const [index, setIndex] = useState(0); const [answers, setAnswers] = useState<string[]>(Array(count).fill(''));
  const [error, setError] = useState(''); const [elapsed, setElapsed] = useState(0);
  useEffect(() => { const t = setInterval(()=>setElapsed((v)=>v+1),1000); return ()=>clearInterval(t); }, []);
  const current = questions[index];
  const submitCurrent = async () => {
    const currentAnswer = answers[index] || '';
    const err = validateAnswerInput(currentAnswer);
    if (err) return setError(err);
    setError('');
    if (index < count - 1) return setIndex(index + 1);
    const results = questions.map((q, i) => ({ ...q, userAnswer: answers[i], isCorrect: isAnswerCorrect(answers[i], q.correctAnswer) }));
    const score = results.filter((x) => x.isCorrect).length;
    const createdAt = new Date().toISOString();
    const res = await fetch('/api/history', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ createdAt, category, difficulty, questionCount:count, score, elapsedSeconds:elapsed, questions:results }) });
    const body = await res.json();
    router.push(`/history/${body.id}`);
  };
  return <main className="container"><div className="card"><p>Küsimus {index+1} / {count}</p><p>Aeg: {formatElapsed(elapsed)}</p><h2>{current.question}</h2>
    <div className="answer"><input inputMode="decimal" value={answers[index]} onChange={(e)=>{const next=e.target.value; if (/^\d*([,.]\d*)?$/.test(next)) {const copy=[...answers]; copy[index]=next; setAnswers(copy);} }} placeholder="Sisesta arv"/> <span>{current.expectedUnit}</span></div>
    {error && <p className="error">{error}</p>}
    <button onClick={submitCurrent}>{index===count-1?'Lõpeta test':'Järgmine'}</button></div></main>;
}
