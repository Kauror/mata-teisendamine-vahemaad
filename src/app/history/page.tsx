'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { formatDateTime, formatElapsed } from '@/lib/validation';
import { learnerLabel, scorePercent, groupAttemptsByDay } from '@/lib/history';

type H = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number | null; learner?: string | null };

export default function HistoryPage() {
  const [history, setHistory] = useState<H[]>([]);
  const [loadError, setLoadError] = useState('');
  useEffect(() => { fetch('/api/history').then((r) => r.ok ? r.json() : Promise.reject()).then(setHistory).catch(() => setLoadError('Ajaloo laadimine ebaõnnestus.')); }, []);

  const deleteOne = async (id:number) => {
    if (!confirm('Kas kustutada see test ajaloost?')) return;
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  const groups = useMemo(() => Object.fromEntries(groupAttemptsByDay(history)), [history]);

  return (
    <main className='container'>
      <section className='card'>
        <h1>Testide ajalugu</h1>
        <Link className='back-link' href='/'>Rollivalik</Link>
        {loadError && <p className='error'>{loadError}</p>}
        {history.length === 0 && <p>Ajalugu puudub.</p>}
        {Object.entries(groups).map(([day, items]) => {
          const avg = Math.round(items.reduce((sum, a) => sum + scorePercent(a.score, a.questionCount), 0) / items.length);
          return (
            <div key={day}>
              <h3>{day} — {items.length} harjutust · Keskmine tulemus {avg}%</h3>
              <div className='history-list'>
                {items.map((h) => {
                  const learner = learnerLabel(h.category, h.learner);
                  return (
                    <article key={h.id} className='history-item'>
                      <div className='history-main'>
                        <p><strong>{learner}</strong> · Matemaatika</p>
                        <p><strong>{h.category}</strong> · {h.difficulty}</p>
                        <p>{h.score}/{h.questionCount} · {typeof h.elapsedSeconds === 'number' && Number.isFinite(h.elapsedSeconds) ? formatElapsed(h.elapsedSeconds) : 'aeg puudub'}</p>
                        <p>{formatDateTime(h.createdAt)}</p>
                      </div>
                      <div className='history-actions'>
                        <Link className='chip' href={`/history/${h.id}`}>Vaata</Link>
                        <button type='button' className='danger' onClick={() => deleteOne(h.id)}>Kustuta</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
