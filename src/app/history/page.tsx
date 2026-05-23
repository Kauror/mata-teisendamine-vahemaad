'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatDateTime, formatElapsed } from '@/lib/validation';

type H = { id:number; createdAt:string; category:string; difficulty:string; questionCount:number; score:number; elapsedSeconds:number | null };

export default function HistoryPage() {
  const [history, setHistory] = useState<H[]>([]);
  useEffect(() => { fetch('/api/history').then((r) => r.json()).then(setHistory); }, []);

  const deleteOne = async (id:number) => {
    if (!confirm('Kas kustutada see test ajaloost?')) return;
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    setHistory((h) => h.filter((x) => x.id !== id));
  };

  return <main className='container'><section className='card'><h1>Testide ajalugu</h1><Link className='chip' href='/kiur/matemaatika'>Tagasi Pikkuste teisendamise juurde</Link><ul>{history.map((h)=><li key={h.id}><Link href={`/history/${h.id}`}>{formatDateTime(h.createdAt)} • {h.category} • {h.difficulty} • {h.score}/{h.questionCount} • {typeof h.elapsedSeconds === 'number' && Number.isFinite(h.elapsedSeconds) ? formatElapsed(h.elapsedSeconds) : 'aeg puudub'}</Link> <button type='button' className='danger' onClick={()=>deleteOne(h.id)}>Kustuta</button></li>)}</ul></section></main>;
}
