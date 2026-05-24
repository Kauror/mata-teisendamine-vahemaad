'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDateTime, formatElapsed } from '@/lib/validation';

type H = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number | null };

export default function HistoryPage() {
  const [history, setHistory] = useState<H[]>([]);
  const [loadError, setLoadError] = useState('');
  useEffect(() => { fetch('/api/history').then((r) => r.json()).then(setHistory).catch(() => setLoadError('Ajaloo laadimine ebaõnnestus.')); }, []);

  const deleteOne = async (id:number) => {
    if (!confirm('Kas kustutada see test ajaloost?')) return;
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  return (
    <main className='container'>
      <section className='card'>
        <h1>Testide ajalugu</h1>
        <Link className='back-link' href='/'>Tagasi avalehele</Link>
        {loadError && <p className='error'>{loadError}</p>}
        {history.length === 0 && <p>Ajalugu puudub.</p>}
        <div className='history-list'>
          {history.map((h) => {
            const learner = ['Arvutamine 10 piires','Arvutamine 20 piires','Suurem või väiksem kuni 100','Segaülesanded'].includes(h.category) ? 'Kirsi' : 'Kiur';
            return (
            <article key={h.id} className='history-item'>
              <p><strong>{learner}</strong> · Matemaatika</p>
              <p><strong>{h.category}</strong> · {h.difficulty}</p>
              <p>{h.score}/{h.questionCount} · {typeof h.elapsedSeconds === 'number' && Number.isFinite(h.elapsedSeconds) ? formatElapsed(h.elapsedSeconds) : 'aeg puudub'}</p>
              <p>{formatDateTime(h.createdAt)}</p>
              <div className='row'>
                <Link className='chip' href={`/history/${h.id}`}>Vaata</Link>
                <button type='button' className='danger' onClick={() => deleteOne(h.id)}>Kustuta</button>
              </div>
            </article>
          );})}
        </div>
      </section>
    </main>
  );
}
