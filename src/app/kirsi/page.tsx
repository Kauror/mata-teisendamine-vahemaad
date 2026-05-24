import Link from 'next/link';

const SUBJECTS = [
  { id: 'matemaatika', name: 'Matemaatika', icon: '🧮', meta: '1 harjutusala', continueLabel: 'Jätka: arvutamine', href: '/kirsi/matemaatika', accent: 'blue' }
] as const;

export default function KirsiPage() {
  return (
    <main className='container subject-flow-page'>
      <section className='subject-flow-shell'>
        <Link className='subject-back-button' href='/'>← Rollivalik</Link>

        <div className='child-header'>
          <span className='child-avatar' aria-hidden>👧</span>
          <h1 className='page-title'>Kirsi</h1>
          <p className='page-subtitle'>Vali aine, mida tahad täna harjutada.</p>
        </div>

        <div className='subject-grid subject-grid-single'>
          {SUBJECTS.map((subject) => (
            <Link key={subject.id} className='subject-card' data-accent={subject.accent} href={subject.href}>
              <span className='subject-icon' aria-hidden>{subject.icon}</span>
              <strong className='subject-name'>{subject.name}</strong>
              <span className='subject-meta'>{subject.meta}</span>
              <span className='continue-pill'>{subject.continueLabel}</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
