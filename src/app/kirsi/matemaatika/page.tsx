'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MODES = ['Arvutamine 10 piires', 'Arvutamine 20 piires', 'Suurem või väiksem kuni 100', 'Segaülesanded'] as const;
const COUNTS = [3, 5, 10] as const;

export default function KirsiMathPage() {
  const router = useRouter();
  const [mode, setMode] = useState<(typeof MODES)[number]>('Arvutamine 10 piires');
  const [count, setCount] = useState<number>(3);

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
        <div className='row'>
          {COUNTS.map((c) => <button type='button' key={c} className={count === c ? 'chip active' : 'chip'} onClick={() => setCount(c)}>{c}</button>)}
        </div>

        <button type='button' className='btn' onClick={() => router.push(`/test?learner=kirsi&subject=matemaatika&topic=arvutamine&category=${encodeURIComponent(mode)}&count=${count}&seed=${Date.now()}`)}>Alusta</button>

        <div className='row'>
          <Link className='chip' href='/kirsi'>Tagasi Kirsi juurde</Link>
          <Link className='chip' href='/'>Tagasi avalehele</Link>
        </div>
      </section>
    </main>
  );
}
