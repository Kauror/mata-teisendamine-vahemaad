'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoodusopetusSetupPage() {
  const router = useRouter();

  const start = () => {
    router.push(`/kiur/loodusopetus/test?count=10&seed=${Date.now()}`);
  };

  return (
    <main className='test-page'>
      <section className='test-shell science-setup-shell'>
        <Link className='practice-back-button' href='/kiur'>← Aine valik</Link>

        <section className='question-card science-setup-card'>
          <h1 className='question-text'>🔬 Loodusõpetus</h1>

          <button type='button' className='next-button science-start-button' onClick={start}>▶ Alusta harjutust</button>
        </section>

        {/* Kiur's textbook course (online only). This page is Kiur's, so Kirsi never sees it. */}
        <Link className='tb-entry-card' href='/kiur/loodusopetus/opik'>
          <span className='tb-entry-icon' aria-hidden>📖</span>
          <span className='tb-entry-copy'>
            <strong>Õpiku õppetükid</strong>
            <small>Loe, harjuta ja tee test. Vajab internetiühendust.</small>
          </span>
          <span className='tb-entry-arrow' aria-hidden>→</span>
        </Link>
      </section>
    </main>
  );
}
