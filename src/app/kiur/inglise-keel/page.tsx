import Link from 'next/link';

export default function KiurEnglishPage() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Inglise keel</h1>
        <p>Harjutused tulevad peagi.</p>
        <div className='row'>
          <Link className='back-link' href='/kiur'>Aine valik</Link>
          <Link className='back-link' href='/'>Rollivalik</Link>
        </div>
      </section>
    </main>
  );
}
