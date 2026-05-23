'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category, Difficulty, GeneratedQuestion } from '@/lib/types';
import { generateLengthExercises } from '@/lib/exercises/lengths';
import {
  formatElapsed,
  isAnswerCorrect,
  validateAnswerInput,
} from '@/lib/validation';

function TestPageContent() {
  const params = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const category = (params.get('category') || 'Teisendamine') as Category;
  const difficulty = (params.get('difficulty') || 'Lihtne') as Difficulty;
  const count = Number(params.get('count') || 5);

  const seedParam = params.get('seed');
  const [fallbackSeed] = useState(() => Date.now());
  const seed = Number(seedParam ?? fallbackSeed);

  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const generatedQuestions = generateLengthExercises(
      category,
      difficulty,
      count,
      seed
    );

    setQuestions(generatedQuestions);
    setAnswers(Array(generatedQuestions.length).fill(''));
    setIndex(0);
    setElapsed(0);
    setError('');
  }, [category, difficulty, count, seed]);

  useEffect(() => {
    if (!questions.length) return;

    const timer = setInterval(() => {
      setElapsed((value) => value + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [questions.length]);

  if (!questions.length) {
    return (
      <main className="container">
        <div className="card">Laadin küsimusi...</div>
      </main>
    );
  }

  const current = questions[index];
  const questionTotal = questions.length;
  const progress = ((index + 1) / questionTotal) * 100;

  const updateAnswer = (value: string) => {
    if (/^\d*([,.]\d*)?$/.test(value)) {
      const copy = [...answers];
      copy[index] = value;
      setAnswers(copy);

      if (error) {
        setError('');
      }

      return;
    }

    setError('Sisesta ainult number.');
    inputRef.current?.focus();
  };

  const submit = async () => {
    const value = answers[index] || '';
    const validationError = validateAnswerInput(value);

    if (validationError) {
      setError(
        validationError === 'Palun sisesta vastus.'
          ? 'Sisesta vastus.'
          : validationError
      );
      inputRef.current?.focus();
      return;
    }

    setError('');

    if (index < questionTotal - 1) {
      setIndex(index + 1);
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }

    const results = questions.map((question, questionIndex) => ({
      ...question,
      userAnswer: answers[questionIndex],
      isCorrect: isAnswerCorrect(
        answers[questionIndex],
        question.correctAnswer
      ),
    }));

    const score = results.filter((result) => result.isCorrect).length;
    const createdAt = new Date().toISOString();

    const response = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        createdAt,
        category,
        difficulty,
        questionCount: questionTotal,
        score,
        elapsedSeconds: elapsed,
        questions: results,
      }),
    });

    const body = await response.json();
    router.push(`/history/${body.id}`);
  };

  return (
    <main className="container">
      <div className="card">
        <p>
          {category} · {difficulty} · {questionTotal} küsimust
        </p>

        <p>
          Küsimus {index + 1} / {questionTotal}
        </p>

        <p>Aeg {formatElapsed(elapsed)}</p>

        <div className="progress">
          <span style={{ width: `${progress}%` }} />
        </div>

        <h2>{current.question}</h2>

        <div className="answer">
          <input
            ref={inputRef}
            className={error ? 'input-error' : ''}
            inputMode="decimal"
            value={answers[index] || ''}
            onChange={(event) => updateAnswer(event.target.value)}
            placeholder="Sisesta number"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'answer-error' : undefined}
          />

          <strong>{current.expectedUnit}</strong>
        </div>

        {error && (
          <p id="answer-error" className="error">
            {error}
          </p>
        )}

        <button type="button" onClick={submit}>
          {index === questionTotal - 1 ? 'Lõpeta test' : 'Järgmine'}
        </button>
      </div>
    </main>
  );
}

export default function TestPage() {
  return (
    <Suspense
      fallback={
        <main className="container">
          <div className="card">Laadin küsimusi...</div>
        </main>
      }
    >
      <TestPageContent />
    </Suspense>
  );
}