'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORIES, DIFFICULTIES, QUESTION_COUNTS, Category, Difficulty } from '@/lib/types';
import { formatDateTime, formatElapsed } from '@/lib/validation';
import { isKirsiAttempt } from '@/lib/history';

type H = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number; learner?: string | null };

export default function MatemaatikaPage() {
  const router = useRouter();
  const [history, setHistory] = useState<H[]>([]);
  const [category, setCategory] = useState<Category>('Segaharjutus');
  const [difficulty, setDifficulty] = useState<Difficulty>('Lihtne');
  const [count, setCount] = useState(3);
  const [filter, setFilter] = useState('Kõik');
  const [loadError, setLoadError] = useState('');

  useEffect(() => { fetch('/api/history').then((r) => r.json()).then((rows: H[]) => setHistory(rows.filter((h) => !isKirsiAttempt(h.category, h.learner)))).catch(() => setLoadError('Ajaloo laadimine ebaõnnestus.')); }, []);

  const groups = useMemo(() => {
    const map = new Map<string, H[]>();
    const now = new Date();
    const today = now.toDateString();
    const y = new Date(now);
    y.setDate(now.getDate() - 1);
    const yesterday = y.toDateString();

    history.forEach((h) => {
      const d = new Date(h.createdAt);
      const key = d.toDateString() === today ? 'Täna' : d.toDateString() === yesterday ? 'Eile' : d.toLocaleDateString('et-EE');
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(h);
    });

    return map;
  }, [history]);

  const keys = ['Kõik', ...Array.from(groups.keys())];

  const deleteOne = async (id:number) => {
    if (!confirm('Kas kustutada see test ajaloost?')) return;
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  return (
    <main className='container'>
      <section className='card'>
        <h1>Matemaatika</h1>
        <h2>Pikkuste teisendamine</h2>
        <p>Harjuta millimeetreid, sentimeetreid, detsimeetreid, meetreid ja kilomeetreid.</p>

        <h3>1. Harjutuse tüüp</h3>
        <div className='grid'>{CATEGORIES.map((c) => <button type='button' key={c} className={category===c?'chip active':'chip'} onClick={()=>setCategory(c)}>{c}</button>)}</div>
        <h3>2. Raskus</h3>
        <div className='row'>{DIFFICULTIES.map((d) => <button type='button' key={d} className={difficulty===d?'chip active':'chip'} onClick={()=>setDifficulty(d)}>{d}</button>)}</div>
        <h3>3. Küsimuste arv</h3>
        <div className='row'>{QUESTION_COUNTS.map((q) => <button type='button' key={q} className={count===q?'chip active':'chip'} onClick={()=>setCount(q)}>{q}</button>)}</div>

        <button type='button' className='btn' onClick={() => router.push(`/test?learner=kiur&subject=matemaatika&topic=pikkused&category=${encodeURIComponent(category)}&difficulty=${difficulty}&count=${count}&seed=${Date.now()}`)}>Alusta</button>
        <div className='row'>
          <Link className='back-link' href='/kiur'>Aine valik</Link>
          <Link className='back-link' href='/'>Avalehele</Link>
        </div>
      </section>

      <section className='card'>
        <h2>Testide ajalugu</h2>{loadError && <p className='error'>{loadError}</p>}
        {history.length === 0 && <p>Ajalugu puudub.</p>}
        {history.length > 0 && <div className='row'>{keys.map((k)=><button type='button' key={k} className={filter===k?'chip active':'chip'} onClick={()=>setFilter(k)}>{k}</button>)}</div>}
        {Array.from(groups.entries()).filter(([k]) => filter==='Kõik' || filter===k).map(([k, items]) => (
          <div key={k}>
            <h3>{k}</h3>
            <div className='history-list'>
              {items.map((h) => (
                <article key={h.id} className='history-item'>
                  <div className='history-main'>
                    <strong>{h.category}</strong>
                    <span>Kiur · Matemaatika</span>
                    <span>{formatDateTime(h.createdAt)} · {h.score}/{h.questionCount} · {Number.isFinite(h.elapsedSeconds) ? formatElapsed(h.elapsedSeconds) : 'aeg puudub'}</span>
                  </div>
                  <div className='history-actions'>
                    <Link className='chip' href={`/history/${h.id}`}>Vaata</Link>
                    <button type='button' className='danger' onClick={() => deleteOne(h.id)}>Kustuta</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
