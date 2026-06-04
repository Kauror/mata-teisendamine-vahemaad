'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchBestKirsiReadingSprintScore } from '@/lib/kirsiReadingHistory';

export default function KirsiReadingPage() {
  const [best, setBest] = useState(0);
  const [activeExerciseIds, setActiveExerciseIds] = useState<string[]>([]);

  useEffect(() => {
    void fetchBestKirsiReadingSprintScore()
      .then(setBest)
      .catch(() => setBest(0));
  }, []);

  useEffect(() => {
    void fetch('/api/learning-exercises/active?learner=kirsi')
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((body) => setActiveExerciseIds(Array.isArray(body.exerciseIds) ? body.exerciseIds : []))
      .catch(() => setActiveExerciseIds([]));
  }, []);

  const piltJaSonaActive = activeExerciseIds.includes('kirsi.reading.pilt-ja-sona');
  const esimeneHaalikActive = activeExerciseIds.includes('kirsi.reading.esimene-haalik');

  return (
    <main className='container english-page reading-page'>
      <section className='practice-shell english-shell'>
        <Link className='practice-back-button' href='/kirsi'>← Aine valik</Link>
        <header className='subject-header'>
          <div className='subject-emoji'>📖</div>
          <h1>Lugemine</h1>
        </header>
        <div className='english-mode-grid reading-mode-grid'>
          {piltJaSonaActive ? <Link href='/kirsi/lugemine/pilt-ja-sona' className='english-mode-card'>
            <span className='english-mode-icon' aria-hidden>🖼️</span>
            <strong>Pilt ja sõna</strong>
            <span>Ühenda pilt õige sõnaga. Parim: {best}</span>
          </Link> : null}
          {esimeneHaalikActive ? <Link href='/kirsi/lugemine/esimene-haalik' className='english-mode-card'>
            <span className='english-mode-icon' aria-hidden>🔤</span>
            <strong>Esimene häälik</strong>
            <span>Vaata pilti ja märgi sõna esimene täht.</span>
          </Link> : null}
          {!piltJaSonaActive && !esimeneHaalikActive ? <p className='recent-empty'>Harjutusi ei ole praegu aktiivne.</p> : null}
        </div>
        <Link className='setup-history-link' href='/history'>📄 Vaata ajalugu</Link>
      </section>
    </main>
  );
}
