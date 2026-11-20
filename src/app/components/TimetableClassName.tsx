'use client';

import { useAppClock } from '@/app/components/useAppClock';
import { childTimetable } from '@/lib/schoolTimetable';
import type { Learner } from '@/lib/shared/types';

// "4B klass" under a timetable heading. The class is part of the private
// timetable, so it arrives with it (useAppClock loads it) and is never in the
// server-rendered HTML.
export default function TimetableClassName({ learner }: { learner: Learner }) {
  const clock = useAppClock();
  const className = clock ? childTimetable(learner).className : '';
  return <p>{className ? `${className} klass` : ' '}</p>;
}
