import Link from 'next/link';

export default function Home() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Vali õppija</h1>
        <div className='grid'>
          <Link className='profile card profile-link' href='/kiur'>
            <span className='avatar' aria-hidden>👦</span>
            <strong>Kiur</strong>
            <span>Matemaatika ja harjutused</span>
            <span className='chip active'>Vali Kiur</span>
          </Link>
          <Link className='profile card profile-link' href='/kirsi'>
            <span className='avatar' aria-hidden>👧</span>
            <strong>Kirsi</strong>
            <span>Tegevused tulevad hiljem</span>
            <span className='chip active'>Vali Kirsi</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
