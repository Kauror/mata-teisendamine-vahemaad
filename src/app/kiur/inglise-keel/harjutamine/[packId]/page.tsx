'use client';
import Link from 'next/link';

export default function RemovedPackPage() {
  return <main className='container english-page'><section className='practice-shell english-shell english-result-card'>
    <h2>See harjutus ei ole enam saadaval</h2>
    <p>Kasuta inglise keeles Sprinti, kus kõik sõnad on kohe kasutusel.</p>
    <div className='row'>
      <Link className='btn' href='/kiur/inglise-keel/sprint'>Ava sprint</Link>
      <Link className='btn chip' href='/kiur/inglise-keel'>Tagasi</Link>
    </div>
  </section></main>;
}
