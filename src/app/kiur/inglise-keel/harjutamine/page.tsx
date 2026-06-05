'use client';
import Link from 'next/link';

export default function PracticePacksPage() {
  return <main className='container english-page'><section className='practice-shell english-shell english-result-card'>
    <h2>Harjutamine on eemaldatud</h2>
    <p>Inglise keeles on nüüd kasutusel ainult Sprint, kus kõik sõnad tulevad kohe mängu.</p>
    <div className='row'>
      <Link className='btn' href='/kiur/inglise-keel/sprint'>Ava sprint</Link>
      <Link className='btn chip' href='/kiur'>Tagasi</Link>
    </div>
  </section></main>;
}
