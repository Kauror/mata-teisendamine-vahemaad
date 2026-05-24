import Link from 'next/link';

export default function KirsiPage() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Kirsi</h1>
        <Link className='profile card profile-link' href='/kirsi/matemaatika'>
          <span className='avatar' aria-hidden>📗</span>
          <strong>Matemaatika</strong>
        </Link>
      </section>
    </main>
  );
}
