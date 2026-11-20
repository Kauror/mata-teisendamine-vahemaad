import Link from 'next/link';
import SchoolTimetable from '@/app/components/SchoolTimetable';
import TimetableClassName from '@/app/components/TimetableClassName';
import type { Learner } from '@/lib/shared/types';

// The child's own timetable page. The timetable comes from the API with an
// offline copy (useAppClock), so the page carries no server state and is part
// of the offline shell.
export default function ChildTimetablePage({ learner, title, avatar }: { learner: Learner; title: string; avatar: string }) {
  return (
    <main className='container child-home-page'>
      <section className='child-home-shell' data-accent={learner === 'kiur' ? 'blue' : 'pink'}>
        <Link className='child-home-back' href='/'>← Tagasi</Link>
        <header className='timetable-head'>
          <span className='child-home-avatar timetable-avatar' aria-hidden><span>{avatar}</span></span>
          <div>
            <h1>{title}</h1>
            <TimetableClassName learner={learner} />
          </div>
        </header>
        <SchoolTimetable learner={learner} />
      </section>
    </main>
  );
}
