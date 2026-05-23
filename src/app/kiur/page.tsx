import Link from 'next/link';

export default function KiurPage() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Kiur</h1>
        <Link className='profile card profile-link' href='/kiur/matemaatika'>
          <span className='avatar' aria-hidden>📘</span>
          <strong>Matemaatika</strong>
        </Link>
        <Link className='back-link' href='/'>Tagasi avalehele</Link>
      </section>
    </main>
  );
}
