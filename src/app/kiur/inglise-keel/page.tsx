import Link from 'next/link';

export default function KiurEnglishPage() {
  return (
    <main className='container subject-flow-page'>
      <section className='subject-flow-shell'>
        <div className='row'>
          <Link className='subject-back-button' href='/kiur'>← Aine valik</Link>
          <Link className='back-link' href='/'>Rollivalik</Link>
        </div>

        <div className='child-header'>
          <span className='child-avatar' aria-hidden>🔤</span>
          <h1 className='page-title'>Inglise keel</h1>
          <p>Harjutused tulevad peagi.</p>
        </div>
      </section>
    </main>
  );
}
