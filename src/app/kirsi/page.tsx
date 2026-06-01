import Link from 'next/link';
import DailyTasksPanel from '@/app/components/DailyTasksPanel';

const SUBJECTS = [
  { id: 'matemaatika', name: 'Matemaatika', icon: '🧮', href: '/kirsi/matemaatika', accent: 'blue' }
] as const;

export default function KirsiPage() {
  return (
    <main className='container subject-flow-page'>
      <section className='subject-flow-shell'>
        <Link className='subject-back-button' href='/'>← Esilehele</Link>

        <div className='child-header'>
          <span className='child-avatar' aria-hidden>👧</span>
          <h1 className='page-title'>Kirsi</h1>
        </div>

        <DailyTasksPanel learner='kirsi' />

        <div className='subject-grid subject-grid-single'>
          {SUBJECTS.map((subject) => (
            <Link key={subject.id} className='subject-card' data-accent={subject.accent} href={subject.href}>
              <span className='subject-icon' aria-hidden>{subject.icon}</span>
              <strong className='subject-name'>{subject.name}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
