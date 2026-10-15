'use client';

import { useState } from 'react';
import { useAppClock } from '@/app/components/useAppClock';
import type { Learner } from '@/lib/shared/types';
import {
  formatClock,
  hasMoreToday,
  nowState,
  scheduleFor,
  schoolStartHint,
  showSchoolCard,
  type AppClock
} from '@/lib/schoolTimetable';

const CHILDREN: ReadonlyArray<{ learner: Learner; name: string; avatar: string; accent: 'blue' | 'pink' }> = [
  { learner: 'kiur', name: 'Kiur', avatar: '👦', accent: 'blue' },
  { learner: 'kirsi', name: 'Kirsi', avatar: '👧', accent: 'pink' }
];

function ChildNowRow({ learner, name, avatar, accent, clock }: { learner: Learner; name: string; avatar: string; accent: 'blue' | 'pink'; clock: AppClock }) {
  const [open, setOpen] = useState(false);
  const state = nowState(learner, clock);
  const more = hasMoreToday(learner, clock);
  const listId = `school-now-${learner}`;

  // The icon is what the eye reads; the word is always there for a screen
  // reader, and visible except on a club, where the club's name says enough.
  let icon: string;
  let word: string;
  let showWord = true;
  if (state.kind === 'lesson' && state.item.kind === 'lesson') {
    icon = '🏫';
    word = `${state.item.number}. tund`;
  } else if (state.kind === 'club') {
    icon = '🎨';
    word = 'Huviring';
    showWord = false;
  } else if (state.kind === 'break') {
    icon = '🔔';
    word = 'Vahetund';
  } else {
    icon = '🏠';
    word = 'Kodus';
  }

  const hint = state.kind === 'home' ? schoolStartHint(learner, clock) : null;
  const busy = state.kind === 'lesson' || state.kind === 'club';

  return (
    <div className='school-now-row' data-accent={accent} aria-label={name} role='group'>
      <span className='school-now-avatar' aria-hidden>{avatar}</span>
      <div className='school-now-state'>
        <span className='school-pill' data-state={state.kind}><span aria-hidden>{icon}</span><span className={showWord ? undefined : 'sr-only'}>{word}</span></span>
        {more && (
          <button type='button' className='school-now-toggle' aria-expanded={open} aria-controls={listId} onClick={() => setOpen((value) => !value)}>
            {open ? 'Peida ▴' : 'tunniplaan ▾'}
          </button>
        )}
      </div>
      {busy && (
        <div className='school-now-detail'>
          <strong className='school-now-what'>{state.item.name}</strong>
          <span className='school-now-time'>{formatClock(state.item.start)}–{formatClock(state.item.end)} · veel {state.minutesLeft} min</span>
        </div>
      )}
      {hint && (
        <div className='school-now-detail'>
          <span className='school-now-time'>Kool algab {hint.when === 'tomorrow' ? 'homme ' : ''}{formatClock(hint.minutes)}</span>
        </div>
      )}
      {more && open && (
        <ul className='school-now-list' id={listId} aria-label={`${name} täna`}>
          {scheduleFor(learner, clock.weekday).map((item) => {
            const when = clock.minutes >= item.end ? 'past' : clock.minutes >= item.start ? 'now' : 'later';
            return (
              <li key={`${item.kind}-${item.start}`} data-when={when} data-kind={item.kind} aria-current={when === 'now' ? 'time' : undefined}>
                <span>{formatClock(item.start)}–{formatClock(item.end)}</span>
                <span>{item.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Where the children are right now. On school days, and from the evening
// before one (Sunday, the last day of a holiday) to say when school starts.
export default function SchoolNowCard() {
  const clock = useAppClock();
  if (!clock || !showSchoolCard(clock)) return null;

  return (
    <section className='school-now-card' aria-label='Lapsed koolis'>
      {CHILDREN.map((child) => <ChildNowRow key={child.learner} {...child} clock={clock} />)}
    </section>
  );
}
