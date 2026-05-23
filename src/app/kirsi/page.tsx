import Link from 'next/link';

export default function KirsiPage() {
  return (
    <main className='container'>
      <section className='card'>
        <h1>Kirsi tegevused</h1>
        <p>Kirsi tegevused tulevad hiljem.</p>
        <Link className='chip' href='/'>Tagasi avalehele</Link>
      </section>
    </main>
  );
}
