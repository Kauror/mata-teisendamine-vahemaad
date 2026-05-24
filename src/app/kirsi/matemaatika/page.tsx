'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDateTime, formatElapsed } from '@/lib/validation';
import { isKirsiAttempt, KIRSI_CATEGORIES } from '@/lib/history';

const MODES = ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Segaülesanded'] as const;
const COUNTS = [3, 5, 10] as const;
type H = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number | null; learner?: string | null };

export default function KirsiMathPage() {
  const router = useRouter();
  const [mode, setMode] = useState<(typeof MODES)[number]>('Arvutamine 10 piires');
  const [count, setCount] = useState<number>(3);
  const [history, setHistory] = useState<H[]>([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => { fetch('/api/history').then((r) => r.json()).then((rows: H[]) => setHistory(rows.filter((h) => isKirsiAttempt(h.category, h.learner) && KIRSI_CATEGORIES.has(h.category)))).catch(() => setLoadError('Ajaloo laadimine ebaõnnestus.')); }, []);

  const deleteOne = async (id:number) => {
    if (!confirm('Kas kustutada see test ajaloost?')) return;
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    setHistory((h) => h.filter((x) => x.id !== id));
  };

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

  return (
    <main className='container'>
      <section className='card'>
        <h1>Kirsi matemaatika</h1>
        <p>Vali harjutus</p>

        <div className='grid'>
          {MODES.map((m) => (
            <button type='button' key={m} className={mode === m ? 'chip active' : 'chip'} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>

        <h3>Küsimuste arv</h3>
        <div className='row question-count-row'>
          {COUNTS.map((c) => <button type='button' key={c} className={count === c ? 'chip active' : 'chip'} onClick={() => setCount(c)}>{c}</button>)}
        </div>

        <button type='button' className='btn' onClick={() => router.push(`/test?learner=kirsi&subject=matemaatika&topic=arvutamine&category=${encodeURIComponent(mode)}&count=${count}&seed=${Date.now()}`)}>Alusta</button>

        <div className='row'>
          <Link className='back-link' href='/kirsi'>Aine valik</Link>
          <Link className='back-link' href='/'>Avalehele</Link>
        </div>
      </section>

      <section className='card'>
        <h2>Testide ajalugu</h2>{loadError && <p className='error'>{loadError}</p>}
        {history.length === 0 && <p>Ajalugu puudub.</p>}
        {Array.from(groups.entries()).map(([k, items]) => (
          <div key={k}>
            <h3>{k}</h3>
            <div className='history-list'>
              {items.slice(0,10).map((h) => (
                <article key={h.id} className='history-item'>
                  <div className='history-main'>
                    <strong>{h.category}</strong>
                    <span>Kirsi · Matemaatika</span>
                    <span>{formatDateTime(h.createdAt)} · {h.score}/{h.questionCount} · {typeof h.elapsedSeconds === 'number' && Number.isFinite(h.elapsedSeconds) ? formatElapsed(h.elapsedSeconds) : 'aeg puudub'}</span>
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
        {history.length > 10 && <Link className='back-link' href='/history'>Vaata kogu ajalugu</Link>}
      </section>
    </main>
  );
}
