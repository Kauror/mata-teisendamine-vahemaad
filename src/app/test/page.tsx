'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateSession } from '@/lib/exercises/lengths';
import { generateKirsiSession } from '@/lib/exercises/kirsiMath';
import { formatElapsed, isAnswerCorrect, validateAnswerInput } from '@/lib/validation';

function ShapeVisual({ question }: { question: GeneratedQuestion }) {
  if (question.category !== 'Ümbermõõt') return null;
  if (question.question.includes('Ruudu')) {
    return (
      <svg width='140' height='140' aria-label='Ruudu joonis'>
        <rect x='20' y='20' width='100' height='100' fill='#eef3ff' stroke='#4865ff' />
      </svg>
    );
  }
  if (question.question.includes('Kolmnurga')) {
    return (
      <svg width='180' height='120' aria-label='Kolmnurga joonis'>
        <polygon points='90,18 20,105 160,105' fill='#fff4e6' stroke='#c56a00' />
      </svg>
    );
  }
  if (!question.question.includes('Ristküliku')) return null;
  return (
    <svg width='180' height='120' aria-label='Ristküliku joonis'>
      <rect x='20' y='20' width='140' height='70' fill='#e9ffe9' stroke='#2e7d32' />
    </svg>
  );
}

function TestPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const learner = params.get('learner') || '';
  const subject = params.get('subject') || '';
  const topic = params.get('topic') || '';
  const categoryParam = params.get('category') || 'Teisendamine';
  const category = categoryParam as Category;
  const difficulty = (params.get('difficulty') || 'Lihtne') as Difficulty;
  const rawCount = Number(params.get('count') || 10);
  const count = [10, 25].includes(rawCount) ? rawCount : 10;
  const seed = Number(params.get('seed') || Date.now());

  const isKirsiMath = learner === 'kirsi' && subject === 'matemaatika' && topic === 'arvutamine';
  const baseSelectionUrl = isKirsiMath ? '/kirsi/matemaatika' : learner === 'kiur' && subject === 'matemaatika' && topic === 'pikkused' ? '/kiur/matemaatika' : '/';

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [orderingAnswers, setOrderingAnswers] = useState<string[][]>([]);
  const [choiceAnswers, setChoiceAnswers] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    const generated = isKirsiMath
      ? generateKirsiSession(categoryParam as never, count, seed)
      : generateSession(category, difficulty, count, seed);
    setQuestions(generated);
    setAnswers(Array(generated.length).fill(''));
    setChoiceAnswers(Array(generated.length).fill(''));
    setOrderingAnswers(Array.from({ length: generated.length }, () => []));
    setIndex(0);
    setElapsed(0);
    setError('');
    setIsSaving(false);
    setSaveError('');
  }, [category, categoryParam, difficulty, count, seed, isKirsiMath]);

  useEffect(() => {
    if (!questions.length) return;
    const timer = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(timer);
  }, [questions.length]);

  useEffect(() => setError(''), [index]);

  const current = questions[index];
  const cards = current?.orderingCards ?? [];
  const selected = orderingAnswers[index] ?? [];
  const selectedSet = new Set(selected);
  const isChoiceQuestion = isKirsiMath && current?.kind === 'choice';

  const getCurrentAnswer = () => {
    if (current.kind === 'ordering' || isChoiceQuestion) return answers[index] ?? '';
    return inputRef.current?.value ?? answers[index] ?? '';
  };

  if (!current) return <main className='container'><div className='card'>Laadin küsimusi...</div></main>;

  const finalizeResults = () => {
    return questions.map((question, i) => {
      if (question.kind === 'ordering') {
        const orderedCards = [...(question.orderingCards ?? [])].sort((a, b) => (question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm));
        const orderedIds = orderedCards.map((c) => c.id);
        const userOrder = orderingAnswers[i] ?? [];
        const labelMap = new Map((question.orderingCards ?? []).map((c) => [c.id, c.label]));
        return {
          ...question,
          userAnswer: userOrder.map((id) => labelMap.get(id) ?? id).join(' > '),
          isCorrect: JSON.stringify(userOrder) === JSON.stringify(orderedIds),
          correctAnswer: 0
        };
      }

      if (isKirsiMath && question.kind === 'choice') {
        const answer = choiceAnswers[i] ?? '';
        const c = question.correctAnswer === -1 ? '<' : question.correctAnswer === 0 ? '=' : '>';
        return { ...question, userAnswer: answer, isCorrect: answer === c };
      }

      return { ...question, userAnswer: answers[i], isCorrect: isAnswerCorrect(answers[i], question.correctAnswer) };
    });
  };

  const handleSubmit = async () => {
    if (isSaving) return;

    if (current.kind === 'ordering') {
      if (selected.length !== cards.length) return setError('Vali kõik kaardid õigesse järjekorda.');
    } else if (isChoiceQuestion) {
      if (!choiceAnswers[index]) return setError('Vali sobiv märk.');
    } else {
      const currentAnswer = getCurrentAnswer();
      const copy = [...answers];
      copy[index] = currentAnswer;
      setAnswers(copy);
      const err = validateAnswerInput(currentAnswer);
      if (err) {
        setError(err === 'Palun sisesta vastus.' ? 'Sisesta vastus.' : err);
        inputRef.current?.focus();
        return;
      }
    }

    setError('');
    if (index < count - 1) return setIndex((v) => v + 1);

    setIsSaving(true);
    const results = finalizeResults();
    const score = results.filter((r) => r.isCorrect).length;

    try {
      const res = await fetch('/api/history', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdAt: new Date().toISOString(), category: categoryParam, difficulty: isKirsiMath ? 'Lihtne' : difficulty, questionCount: count, score, elapsedSeconds: elapsed, questions: results, learner: learner || null, subject: subject || null, topic: topic || null })
      });
      if (!res.ok) throw new Error('save-failed');
      const body = await res.json();
      router.push(`/history/${body.id}`);
    } catch {
      setSaveError('Salvestamine ebaõnnestus. Proovi uuesti.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className='container'>
      <div className='card'>
        <p>{categoryParam} · {isKirsiMath ? '' : difficulty} {count} küsimust</p>
        <p>Küsimus {index + 1} / {count}</p>
        <p>Aeg {formatElapsed(elapsed)}</p>
        <div className='progress'><span style={{ width: `${((index + 1) / count) * 100}%` }} /></div>
        <h2>{current.question}</h2>

        {!isKirsiMath && <ShapeVisual question={current} />}

        {current.kind === 'ordering' ? (
          <>
            <p>Sinu järjestus</p>
            <p>Vali kõik kaardid õigesse järjekorda.</p>
            <div className='row ordering-available'>
              {cards.filter((c) => !selectedSet.has(c.id)).map((c) => <button type='button' key={c.id} className='chip' onClick={() => setOrderingAnswers((prev) => { const next = [...prev]; next[index] = [...(next[index] ?? []), c.id]; return next; })}>{c.label}</button>)}
            </div>
            <div className='ordering-list'>
              {selected.map((id, pos) => {
                const card = cards.find((c) => c.id === id); if (!card) return null;
                return <div key={id} className='ordering-item'><strong>{pos + 1}. {card.label}</strong><div className='row'><button type='button' className='chip' onClick={() => setOrderingAnswers((prev) => { const next=[...prev]; const arr=[...(next[index]??[])]; if(pos>0)[arr[pos-1],arr[pos]]=[arr[pos],arr[pos-1]]; next[index]=arr; return next; })}>Üles</button><button type='button' className='chip' onClick={() => setOrderingAnswers((prev) => { const next=[...prev]; const arr=[...(next[index]??[])]; if(pos<arr.length-1)[arr[pos+1],arr[pos]]=[arr[pos],arr[pos+1]]; next[index]=arr; return next; })}>Alla</button><button type='button' className='chip danger' onClick={() => setOrderingAnswers((prev) => { const next=[...prev]; next[index]=(next[index]??[]).filter((x)=>x!==id); return next; })}>Eemalda</button></div></div>;
              })}
            </div>
            <button type='button' className='danger' onClick={() => setOrderingAnswers((prev) => { const next = [...prev]; next[index] = []; return next; })}>Tühjenda valik</button>
          </>
        ) : isChoiceQuestion ? (
          <div className='row'>
            {['<', '=', '>'].map((sign) => (
              <button type='button' key={sign} className={choiceAnswers[index] === sign ? 'chip active choice-btn' : 'chip choice-btn'} onClick={() => { const next = [...choiceAnswers]; next[index] = sign; setChoiceAnswers(next); }}>{sign}</button>
            ))}
          </div>
        ) : (
          <div className='answer'>
            <input ref={inputRef} aria-label='Vastus' aria-describedby={error ? 'vastuse-viga' : undefined} className={error ? 'input-error' : ''} inputMode='decimal' value={answers[index] ?? ''} onChange={(e) => { const next = e.target.value; if (/^\d*([,.]\d*)?$/.test(next)) { const copy = [...answers]; copy[index] = next; setAnswers(copy); } }} placeholder='Sisesta number' />
            {!isKirsiMath && current.expectedUnit && <strong>{current.expectedUnit}</strong>}
          </div>
        )}

        {error && <p id='vastuse-viga' className='error'>{error}</p>}
        {saveError && <p className='error'>{saveError}</p>}
        <div className='test-actions'>
          <button type='button' className='btn-stop' onClick={() => { if (confirm('Kas soovid harjutuse lõpetada? Tulemusi ei salvestata.')) router.push(baseSelectionUrl); }}>Lõpeta</button>
          <button type='button' className='btn-next' onClick={handleSubmit} disabled={isSaving}>{isSaving ? 'Salvestan...' : index === count - 1 ? 'Lõpeta test' : 'Järgmine'}</button>
        </div>
      </div>
    </main>
  );
}

export default function TestPage() {
  return <Suspense fallback={<main className='container'><div className='card'>Laadin küsimusi...</div></main>}><TestPageContent /></Suspense>;
}
