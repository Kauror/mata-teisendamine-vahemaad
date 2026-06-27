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
      </section>
    </main>
  );
}
