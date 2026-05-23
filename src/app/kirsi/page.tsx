import Link from 'next/link';

export default function KirsiPage() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Kirsi tegevused</h1>
        <p>Vali õppeaine</p>
        <Link className='profile card profile-link' href='/kirsi/matemaatika'>
          <span className='avatar' aria-hidden>📗</span>
          <strong>Matemaatika</strong>
          <span className='chip active'>Alusta matemaatikat</span>
        </Link>
        <Link className='chip' href='/'>Tagasi avalehele</Link>
      </section>
    </main>
  );
}
