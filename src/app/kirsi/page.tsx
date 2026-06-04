import Link from 'next/link';
import DailyTasksPanel from '@/app/components/DailyTasksPanel';
import { subjectHasActiveLearningExercises } from '@/lib/learningExercises';
import { getOpenRenderableMistakeCount, REMEDIATION_MIN_OPEN_MISTAKES } from '@/lib/remediation';

const SUBJECTS = [
  { id: 'matemaatika', name: 'Matemaatika', icon: '🧮', href: '/kirsi/matemaatika', accent: 'blue' },
  { id: 'lugemine', name: 'Lugemine', icon: '📖', href: '/kirsi/lugemine', accent: 'pink' }
] as const;

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function KirsiPage() {
  const subjects = SUBJECTS.filter((subject) => subjectHasActiveLearningExercises('kirsi', subject.id));
  const showRemediation = getOpenRenderableMistakeCount('kirsi') >= REMEDIATION_MIN_OPEN_MISTAKES;

  return (
    <main className='container subject-flow-page'>
      <section className='subject-flow-shell'>
        <Link className='subject-back-button' href='/'>← Esilehele</Link>

        <div className='child-header'>
          <span className='child-avatar' aria-hidden>👧</span>
          <h1 className='page-title'>Kirsi</h1>
        </div>

        <DailyTasksPanel learner='kirsi' />

        <div className='subject-grid'>
          {showRemediation && (
            <Link className='subject-card remediation-card' data-accent='green' href='/kirsi/kordamine'>
              <span className='subject-icon' aria-hidden>↻</span>
              <strong className='subject-name'>Kordamine</strong>
            </Link>
          )}
          {subjects.map((subject) => (
            <Link key={subject.id} className='subject-card' data-accent={subject.accent} href={subject.href}>
              <span className='subject-icon' aria-hidden>{subject.icon}</span>
              <strong className='subject-name'>{subject.name}</strong>
            </Link>
          ))}
          {subjects.length === 0 && <p className='recent-empty'>Harjutusi ei ole praegu aktiivne.</p>}
        </div>
      </section>
    </main>
  );
}
