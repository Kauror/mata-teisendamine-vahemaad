'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SCIENCE_SESSION_SIZES, type ScienceSessionSize } from '@/lib/loodusopetus/tasks';

export default function LoodusopetusSetupPage() {
  const router = useRouter();
  const [count, setCount] = useState<ScienceSessionSize>(10);

  const start = () => {
    router.push(`/kiur/loodusopetus/test?count=${count}&seed=${Date.now()}`);
  };

  return (
    <main className='test-page'>
      <section className='test-shell science-setup-shell'>
        <Link className='practice-back-button' href='/kiur'>← Aine valik</Link>

        <section className='question-card science-setup-card'>
          <h1 className='question-text'>🔬 Loodusõpetus</h1>
          <p className='science-setup-subtitle'>Vali harjutuse pikkus ja alusta segaharjutust.</p>

          <ul className='science-summary' aria-label='Harjutuse ülevaade'>
            <li>140 harjutust</li>
            <li>5 tüüpi ülesandeid</li>
            <li>Pildid, lugemine, sobitamine, järjestamine ja andmed</li>
          </ul>

          <div className='science-count-block'>
            <h2 className='science-count-heading'>Mitu küsimust?</h2>
            <div className='choice-answer-grid science-count-grid'>
              {SCIENCE_SESSION_SIZES.map((size) => (
                <button
                  type='button'
                  key={size}
                  aria-pressed={count === size}
                  className={count === size ? 'choice-answer-button selected' : 'choice-answer-button'}
                  onClick={() => setCount(size)}
                >
                  {size} küsimust
                </button>
              ))}
            </div>
          </div>

          <button type='button' className='next-button science-start-button' onClick={start}>▶ Alusta harjutust</button>
        </section>
      </section>
    </main>
  );
}
