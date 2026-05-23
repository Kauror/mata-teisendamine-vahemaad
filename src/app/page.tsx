import Link from 'next/link';

export default function Home() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Vali õppija</h1>
        <p>Vali, kelle harjutustega alustame.</p>

        <div className='profile-grid'>
          <Link className='profile-card' href='/kiur'>
            <span className='profile-avatar' aria-hidden>👦</span>
            <strong>Kiur</strong>
            <span>Matemaatika ja harjutused</span>
            <span className='chip active'>Vali Kiur</span>
          </Link>

          <Link className='profile-card' href='/kirsi'>
            <span className='profile-avatar' aria-hidden>👧</span>
            <strong>Kirsi</strong>
            <span>Tegevused tulevad hiljem</span>
            <span className='chip active'>Vali Kirsi</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
