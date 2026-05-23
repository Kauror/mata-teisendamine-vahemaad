import Link from 'next/link';

export default function KiurPage() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Kiuri õppimine</h1>
        <p>Vali õppeaine</p>
        <Link className='profile card profile-link' href='/kiur/matemaatika'>
          <span className='avatar' aria-hidden>📘</span>
          <strong>Matemaatika</strong>
        </Link>
        <Link className='chip' href='/'>Tagasi avalehele</Link>
      </section>
    </main>
  );
}
