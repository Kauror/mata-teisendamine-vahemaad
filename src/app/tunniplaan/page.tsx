import Link from 'next/link';
import SchoolTimetable from '@/app/components/SchoolTimetable';
import { SCHOOL_TIMETABLE } from '@/lib/schoolTimetable';
import type { Learner } from '@/lib/shared/types';

const CHILDREN: ReadonlyArray<{ learner: Learner; name: string; avatar: string; accent: 'blue' | 'pink' }> = [
  { learner: 'kiur', name: 'Kiur', avatar: '👦', accent: 'blue' },
  { learner: 'kirsi', name: 'Kirsi', avatar: '👧', accent: 'pink' }
];

// Both children's timetables on one page, reached from the school line on a
// home card ("kool algab 9.05"). Each block is the same timetable as on the
// child's own page, with its own Täna / Homme / Nädal tabs. Static data, so
// it is part of the offline shell.
export default function BothTimetablesPage() {
  return (
    <main className='container child-home-page'>
      <div className='both-timetables'>
        <Link className='child-home-back' href='/'>← Tagasi</Link>
        <h1 className='both-timetables-title'>Tunniplaanid</h1>
        {CHILDREN.map((child) => (
          <section key={child.learner} className='child-home-shell' data-accent={child.accent} aria-labelledby={`${child.learner}-timetable-title`}>
            <header className='timetable-head'>
              <span className='child-home-avatar timetable-avatar' aria-hidden><span>{child.avatar}</span></span>
              <div>
                <h2 id={`${child.learner}-timetable-title`}>{child.name}</h2>
                <p>{SCHOOL_TIMETABLE[child.learner].className} klass</p>
              </div>
            </header>
            <SchoolTimetable learner={child.learner} />
          </section>
        ))}
      </div>
    </main>
  );
}
