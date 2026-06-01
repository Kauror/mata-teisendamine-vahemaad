import Link from 'next/link';
import DailyTasksPanel from '@/app/components/DailyTasksPanel';

const SUBJECTS = [
  { id: 'matemaatika', name: 'Matemaatika', icon: '🧮', href: '/kiur/matemaatika', accent: 'blue' },
  { id: 'inglise-keel', name: 'Inglise keel', icon: '🔤', href: '/kiur/inglise-keel', accent: 'pink' }
] as const;

export default function KiurPage() {
  return (
    <main className='container subject-flow-page'>
      <section className='subject-flow-shell'>
        <Link className='subject-back-button' href='/'>← Rollivalik</Link>

        <div className='child-header'>
          <span className='child-avatar' aria-hidden>👦</span>
          <h1 className='page-title'>Kiur</h1>
        </div>

        <DailyTasksPanel learner='kiur' />

        <div className='subject-grid'>
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
