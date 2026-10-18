'use client';

import { useId, useState } from 'react';
import SchoolTimetable from '@/app/components/SchoolTimetable';
import { useAppClock } from '@/app/components/useAppClock';
import type { Learner } from '@/lib/shared/types';
import {
  firstLessonStart,
  formatClock,
  isSchoolDate,
  nextSchoolDate,
  schoolEndsAt,
  WEEKDAY_NAMES,
  weekdayOf,
  type AppClock
} from '@/lib/schoolTimetable';

// "esmaspäev 8.15": the school day this block is about, shown while it is
// folded away, so a closed block still answers "when do I go".
function foldedSummary(learner: Learner, clock: AppClock): string | null {
  const end = schoolEndsAt(learner, clock.weekday);
  const day = isSchoolDate(clock.date) && end !== null && clock.minutes < end ? clock.date : nextSchoolDate(clock.date);
  if (!day) return null;
  const start = firstLessonStart(learner, weekdayOf(day));
  return start === null ? null : `${WEEKDAY_NAMES[weekdayOf(day)]} ${formatClock(start)}`;
}

// The timetable on the child's own page: open by itself on a school day,
// folded on a day off. The same tabs (Täna / Homme / Nädal) as the
// timetable page; the data is static, so it works offline.
export default function ChildTimetableSection({ learner }: { learner: Learner }) {
  const clock = useAppClock();
  const [chosen, setChosen] = useState<boolean | null>(null);
  const bodyId = useId();

  if (!clock) return null;
  const open = chosen ?? isSchoolDate(clock.date);
  const summary = open ? null : foldedSummary(learner, clock);

  return (
    <section className='child-timetable' data-open={open} aria-label='Tunniplaan'>
      <button type='button' className='child-timetable-head' aria-expanded={open} aria-controls={bodyId} onClick={() => setChosen(!open)}>
        <span aria-hidden>📅</span>
        <span className='child-timetable-title'>Tunniplaan</span>
        {summary && <span className='child-timetable-sum'>{summary}</span>}
        <span className='child-timetable-caret' aria-hidden>▾</span>
      </button>
      <div id={bodyId} className='child-timetable-body' hidden={!open}>
        {open && <SchoolTimetable learner={learner} />}
      </div>
    </section>
  );
}
