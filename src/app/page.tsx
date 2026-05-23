'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CATEGORIES,
  DIFFICULTIES,
  QUESTION_COUNTS,
  Category,
  Difficulty,
} from '@/lib/types';
import { formatDateTime, formatElapsed } from '@/lib/validation';

type HistoryItem = {
  id: number;
  createdAt: string;
  category: string;
  difficulty: string;
  questionCount: number;
  score: number;
  elapsedSeconds: number | null;
};

function safeElapsed(value: number | null | undefined) {
  const seconds = Number(value);

  if (!Number.isFinite(seconds)) {
    return 'aeg puudub';
  }

  return formatElapsed(seconds);
}

export default function Home() {
  const router = useRouter();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [category, setCategory] = useState<Category>('Segaharjutus');
  const [difficulty, setDifficulty] = useState<Difficulty>('Keskmine');
  const [count, setCount] = useState(3);

  useEffect(() => {
    fetch('/api/history')
      .then((r) => r.json())
      .then(setHistory)
      .catch(() => setHistory([]));
  }, []);

  const startTest = () => {
    const params = new URLSearchParams({
      category,
      difficulty,
      count: String(count),
      seed: String(Date.now()),
    });

    router.push(`/test?${params.toString()}`);
  };

  const clearAll = async () => {
    if (!window.confirm('Kas oled kindel, et soovid kogu ajaloo kustutada?')) {
      return;
    }

    await fetch('/api/history', { method: 'DELETE' });
    setHistory([]);
  };

  return (
    <main className="container">
      <h1>Pikkuste harjutaja</h1>
      <p>Harjuta pikkusühikuid samm-sammult!</p>

      <section className="card">
        <h3>1. Harjutuse tüüp</h3>
        <div className="grid">
          {CATEGORIES.map((c) => (
            <button
              type="button"
              key={c}
              className={category === c ? 'chip active' : 'chip'}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <h3>2. Raskus</h3>
        <div className="row">
          {DIFFICULTIES.map((d) => (
            <button
              type="button"
              key={d}
              className={difficulty === d ? 'chip active' : 'chip'}
              onClick={() => setDifficulty(d)}
            >
              {d}
            </button>
          ))}
        </div>

        <h3>3. Küsimuste arv</h3>
        <div className="row">
          {QUESTION_COUNTS.map((q) => (
            <button
              type="button"
              key={q}
              className={count === q ? 'chip active' : 'chip'}
              onClick={() => setCount(q)}
            >
              {q}
            </button>
          ))}
        </div>

        <p>
          <strong>
            {category} · {difficulty} · {count} küsimust
          </strong>
        </p>

        <button type="button" className="btn" onClick={startTest}>
          Alusta
        </button>
      </section>

      <section className="card">
        <h2>Testide ajalugu</h2>

        {history.length === 0 ? (
          <p>Ajalugu puudub.</p>
        ) : (
          <ul>
            {history.map((h) => (
              <li key={h.id}>
                <Link href={`/history/${h.id}`}>
                  {formatDateTime(h.createdAt)} • {h.category} • {h.difficulty}{' '}
                  • {h.questionCount} küsimust • {h.score}/{h.questionCount} •{' '}
                  {safeElapsed(h.elapsedSeconds)}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <button type="button" className="danger" onClick={clearAll}>
          Kustuta ajalugu
        </button>
      </section>
    </main>
  );
}
