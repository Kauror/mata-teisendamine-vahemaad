'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateSession } from '@/lib/exercises/lengths';
import { formatElapsed, isAnswerCorrect, validateAnswerInput } from '@/lib/validation';

const HINTS = [
  '1 cm = 10 mm',
  '10 mm = 1 cm',
  '1 dm = 10 cm',
  '10 cm = 1 dm',
  '1 m = 100 cm',
  '100 cm = 1 m',
  '1 km = 1000 m',
  '1000 m = 1 km'
];

function ShapeVisual({ question }: { question: GeneratedQuestion }) {
  if (question.category !== 'Ümbermõõt') return null;
  if (question.question.includes('Ruudu')) {
    return (
      <svg width='140' height='140' aria-label='Ruudu joonis'>
        <rect x='20' y='20' width='100' height='100' fill='#eef3ff' stroke='#4865ff' />
      </svg>
    );
  }
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

  const category = (params.get('category') || 'Teisendamine') as Category;
  const difficulty = (params.get('difficulty') || 'Lihtne') as Difficulty;
  const count = Number(params.get('count') || 5);
  const seed = Number(params.get('seed') || Date.now());

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [orderingAnswers, setOrderingAnswers] = useState<string[][]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const generated = generateSession(category, difficulty, count, seed);
    setQuestions(generated);
    setAnswers(Array(generated.length).fill(''));
    setOrderingAnswers(Array.from({ length: generated.length }, () => []));
    setIndex(0);
    setElapsed(0);
    setError('');
    setShowHint(false);
    setIsSaving(false);
  }, [category, difficulty, count, seed]);

  useEffect(() => {
    if (!questions.length) return;
    const timer = setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => clearInterval(timer);
  }, [questions.length]);

  useEffect(() => {
    setError('');
    setShowHint(false);
  }, [index]);

  const current = questions[index];
  const cards = current?.orderingCards ?? [];
  const selected = orderingAnswers[index] ?? [];
  const selectedSet = new Set(selected);

  if (!current) {
    return <main className='container'><div className='card'>Laadin küsimusi...</div></main>;
  }

  const finalizeResults = () => {
    return questions.map((question, i) => {
      if (question.kind === 'ordering') {
        const orderedIds = [...(question.orderingCards ?? [])]
          .sort((a, b) => (question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm))
          .map((c) => c.id);
        const userOrder = orderingAnswers[i] ?? [];
        return {
          ...question,
          userAnswer: userOrder.join(' > '),
          isCorrect: JSON.stringify(userOrder) === JSON.stringify(orderedIds),
          correctAnswer: 0
        };
      }

      return {
        ...question,
        userAnswer: answers[i],
        isCorrect: isAnswerCorrect(answers[i], question.correctAnswer)
      };
    });
  };

  const handleSubmit = async () => {
    if (isSaving) return;

    if (current.kind === 'ordering') {
      if (selected.length !== cards.length) {
        setError('Vali kõik kaardid õigesse järjekorda.');
        return;
      }
    } else {
      const err = validateAnswerInput(answers[index] ?? '');
      if (err) {
        setError(err === 'Palun sisesta vastus.' ? 'Sisesta vastus.' : err);
        inputRef.current?.focus();
        return;
      }
    }

    setError('');

    if (index < count - 1) {
      setIndex((v) => v + 1);
      return;
    }

    setIsSaving(true);
    const results = finalizeResults();
    const score = results.filter((r) => r.isCorrect).length;

    try {
      const res = await fetch('/api/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          createdAt: new Date().toISOString(),
          category,
          difficulty,
          questionCount: count,
          score,
          elapsedSeconds: elapsed,
          questions: results
        })
      });
      const body = await res.json();
      router.push(`/history/${body.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className='container'>
      <div className='card'>
        <div className='row'>
          <p>{category} · {difficulty} · {count} küsimust</p>
          <button
            type='button'
            className='danger'
            onClick={() => {
              if (confirm('Kas soovid harjutuse lõpetada? Tulemusi ei salvestata.')) router.push('/');
            }}
          >
            Lõpeta
          </button>
        </div>

        <p>Küsimus {index + 1} / {count}</p>
        <p>Aeg {formatElapsed(elapsed)}</p>
        <div className='progress'><span style={{ width: `${((index + 1) / count) * 100}%` }} /></div>
        <h2>{current.question}</h2>

        <ShapeVisual question={current} />

        {current.category === 'Teisendamine' && (
          <>
            <button type='button' className='chip' onClick={() => setShowHint((v) => !v)}>
              {showHint ? 'Peida vihje' : 'Näita vihjet'}
            </button>
            {showHint && <p>{HINTS.join(' · ')}</p>}
          </>
        )}

        {current.kind === 'ordering' ? (
          <>
            <p>Sinu järjestus</p>
            <div className='row'>
              {cards.filter((c) => !selectedSet.has(c.id)).map((c) => (
                <button
                  type='button'
                  key={c.id}
                  className='chip'
                  onClick={() => {
                    setOrderingAnswers((prev) => {
                      const next = [...prev];
                      next[index] = [...(next[index] ?? []), c.id];
                      return next;
                    });
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className='row'>
              {selected.map((id, pos) => {
                const card = cards.find((c) => c.id === id);
                if (!card) return null;

                return (
                  <div key={id} className='chip active'>
                    {card.label}
                    <button
                      type='button'
                      onClick={() => {
                        setOrderingAnswers((prev) => {
                          const next = [...prev];
                          const arr = [...(next[index] ?? [])];
                          if (pos > 0) [arr[pos - 1], arr[pos]] = [arr[pos], arr[pos - 1]];
                          next[index] = arr;
                          return next;
                        });
                      }}
                    >
                      ←
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setOrderingAnswers((prev) => {
                          const next = [...prev];
                          const arr = [...(next[index] ?? [])];
                          if (pos < arr.length - 1) [arr[pos + 1], arr[pos]] = [arr[pos], arr[pos + 1]];
                          next[index] = arr;
                          return next;
                        });
                      }}
                    >
                      →
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setOrderingAnswers((prev) => {
                          const next = [...prev];
                          next[index] = (next[index] ?? []).filter((x) => x !== id);
                          return next;
                        });
                      }}
                    >
                      Eemalda
                    </button>
                  </div>
                );
              })}
            </div>

            <button
              type='button'
              className='danger'
              onClick={() => {
                setOrderingAnswers((prev) => {
                  const next = [...prev];
                  next[index] = [];
                  return next;
                });
              }}
            >
              Tühjenda valik
            </button>
          </>
        ) : (
          <div className='answer'>
            <input
              ref={inputRef}
              aria-label='Vastus'
              aria-describedby={error ? 'vastuse-viga' : undefined}
              className={error ? 'input-error' : ''}
              inputMode='decimal'
              value={answers[index] ?? ''}
              onChange={(e) => {
                const next = e.target.value;
                if (/^\d*([,.]\d*)?$/.test(next)) {
                  const copy = [...answers];
                  copy[index] = next;
                  setAnswers(copy);
                }
              }}
              placeholder='Sisesta number'
            />
            <strong>{current.expectedUnit}</strong>
          </div>
        )}

        {error && <p id='vastuse-viga' className='error'>{error}</p>}
        <button type='button' onClick={handleSubmit} disabled={isSaving}>
          {isSaving ? 'Salvestan...' : index === count - 1 ? 'Lõpeta test' : 'Järgmine'}
        </button>
      </div>
    </main>
  );
}

export default function TestPage() {
  return <Suspense fallback={<main className='container'><div className='card'>Laadin küsimusi...</div></main>}><TestPageContent /></Suspense>;
}
