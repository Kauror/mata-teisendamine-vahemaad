import { describe, expect, it } from 'vitest';
import {
  appClock,
  clubsLeftToday,
  defaultTab,
  hasMoreToday,
  isKnownSubject,
  isSchoolDate,
  nextDayHeading,
  nextSchoolDate,
  nextTabLabel,
  nowState,
  SCHOOL_BELLS,
  SCHOOL_TIMETABLE,
  scheduleFor,
  schoolEndsAt,
  schoolStartHint,
  showSchoolCard,
  weekdayOf,
  type AppClock
} from '@/lib/schoolTimetable';

// Wednesday 14 October 2026 is a school day.
const wed = (hours: number, minutes = 0): AppClock => ({ date: '2026-10-14', weekday: 2, minutes: hours * 60 + minutes });

describe('appClock', () => {
  it('reads the time in Tallinn, not UTC', () => {
    // 07:20 UTC is 10:20 in Tallinn in October (EEST, UTC+3).
    expect(appClock(new Date('2026-10-14T07:20:00Z'))).toEqual({ date: '2026-10-14', weekday: 2, minutes: 620 });
    // After the clocks go back (EET, UTC+2) and across midnight.
    expect(appClock(new Date('2026-11-01T22:30:00Z'))).toEqual({ date: '2026-11-02', weekday: 0, minutes: 30 });
  });
});

describe('the timetable data', () => {
  it('has five school days for each child, every lesson a known subject', () => {
    for (const child of Object.values(SCHOOL_TIMETABLE)) {
      expect(child.days).toHaveLength(5);
      for (const day of child.days) {
        expect(day.lessons.length).toBeLessThanOrEqual(SCHOOL_BELLS.length);
        for (const name of day.lessons) if (name) expect(isKnownSubject(name), name).toBe(true);
      }
    }
  });

  it('ends school when the sheet says it does', () => {
    expect([0, 1, 2, 3, 4].map((day) => schoolEndsAt('kiur', day))).toEqual([765, 825, 765, 705, 825]);
    expect([0, 1, 2, 3, 4].map((day) => schoolEndsAt('kirsi', day))).toEqual([765, 765, 765, 765, 765]);
    expect(scheduleFor('kirsi', 0)[0]).toMatchObject({ kind: 'lesson', name: 'Kehaline kasvatus', start: 545, number: 2 });
  });
});

describe('school days', () => {
  it('skips weekends, school holidays and public holidays', () => {
    expect(isSchoolDate('2026-10-14')).toBe(true);
    expect(isSchoolDate('2026-10-17')).toBe(false);
    expect(isSchoolDate('2026-10-26')).toBe(false);
    expect(isSchoolDate('2026-11-01')).toBe(false);
    expect(isSchoolDate('2026-11-02')).toBe(true);
    expect(isSchoolDate('2027-03-26')).toBe(false);
  });

  it('finds the next school day across a weekend and a holiday', () => {
    expect(nextSchoolDate('2026-10-14')).toBe('2026-10-15');
    expect(nextSchoolDate('2026-10-16')).toBe('2026-10-19');
    expect(nextSchoolDate('2026-10-23')).toBe('2026-11-02');
  });

  it('names the next day by how far away it is', () => {
    expect(nextTabLabel('2026-10-14', '2026-10-15')).toBe('Homme');
    expect(nextTabLabel('2026-10-16', '2026-10-19')).toBe('Esmasp.');
    expect(nextDayHeading('2026-10-14', '2026-10-15')).toBe('Homme · neljapäev');
    expect(nextDayHeading('2026-10-23', '2026-11-02')).toBe('Esmaspäev 2.11');
  });
});

describe('nowState', () => {
  it('shows the lesson in progress with minutes left', () => {
    const state = nowState('kiur', wed(10, 20));
    expect(state).toMatchObject({ kind: 'lesson', item: { name: 'Matemaatika', number: 3 }, minutesLeft: 25 });
  });

  it('calls the gap between lessons a break', () => {
    expect(nowState('kiur', wed(10, 50)).kind).toBe('break');
  });

  it('is home before the first lesson and after the last one', () => {
    expect(nowState('kirsi', wed(8, 30)).kind).toBe('home');
    expect(nowState('kirsi', wed(15)).kind).toBe('home');
  });

  it('keeps a child at school for a club that starts right after the bell', () => {
    expect(nowState('kiur', wed(12, 50)).kind).toBe('break');
    expect(nowState('kiur', wed(13, 30))).toMatchObject({ kind: 'club', item: { name: 'Robootika' } });
  });

  it('is home in the long gap before an evening club, then at the club', () => {
    const tuesday = (hours: number): AppClock => ({ date: '2026-10-13', weekday: 1, minutes: hours * 60 });
    expect(nowState('kiur', tuesday(16)).kind).toBe('home');
    expect(nowState('kiur', tuesday(19))).toMatchObject({ kind: 'club', item: { name: 'Judo' } });
  });

  it('is home on a holiday even at lesson time', () => {
    expect(nowState('kiur', { date: '2026-10-28', weekday: 2, minutes: 620 }).kind).toBe('home');
  });
});

describe('the timetable page', () => {
  it('shows today until the last lesson, then the next school day', () => {
    expect(defaultTab('kiur', wed(12, 44))).toBe('today');
    expect(defaultTab('kiur', wed(12, 45))).toBe('next');
    expect(defaultTab('kiur', { date: '2026-10-17', weekday: 5, minutes: 600 })).toBe('next');
  });

  it('keeps today\'s evening club in sight after switching to tomorrow', () => {
    const tuesday = (hours: number, minutes = 0): AppClock => ({ date: '2026-10-13', weekday: 1, minutes: hours * 60 + minutes });
    expect(clubsLeftToday('kiur', tuesday(15)).map((club) => club.name)).toEqual(['Judo']);
    expect(clubsLeftToday('kiur', tuesday(20))).toEqual([]);
    expect(hasMoreToday('kiur', tuesday(19, 59))).toBe(true);
    expect(hasMoreToday('kiur', tuesday(20))).toBe(false);
  });
});

describe('the home card and its "Kool algab" line', () => {
  const at = (date: string, hours: number, minutes = 0): AppClock => ({ date, weekday: weekdayOf(date), minutes: hours * 60 + minutes });

  it('says when school starts tomorrow once the day is over, per child (Wed 21:00)', () => {
    const clock = wed(21);
    expect(showSchoolCard(clock)).toBe(true);
    expect(schoolStartHint('kiur', clock)).toEqual({ when: 'tomorrow', minutes: 8 * 60 + 15 });
    expect(schoolStartHint('kirsi', clock)).toEqual({ when: 'tomorrow', minutes: 9 * 60 + 5 });
  });

  it('says when school starts today in the morning (Thu 07:45)', () => {
    const clock: AppClock = { date: '2026-10-15', weekday: 3, minutes: 7 * 60 + 45 };
    expect(showSchoolCard(clock)).toBe(true);
    expect(schoolStartHint('kiur', clock)).toEqual({ when: 'today', minutes: 8 * 60 + 15 });
    expect(schoolStartHint('kirsi', clock)).toEqual({ when: 'today', minutes: 9 * 60 + 5 });
  });

  it('says nothing about Saturday on Friday evening', () => {
    const clock: AppClock = { date: '2026-10-16', weekday: 4, minutes: 20 * 60 };
    expect(showSchoolCard(clock)).toBe(true);
    expect(schoolStartHint('kiur', clock)).toBeNull();
    expect(schoolStartHint('kirsi', clock)).toBeNull();
  });

  it('appears on Sunday from 18:00 with the Monday start', () => {
    expect(showSchoolCard(at('2026-10-18', 17, 59))).toBe(false);
    expect(schoolStartHint('kiur', at('2026-10-18', 17, 59))).toBeNull();
    const evening = at('2026-10-18', 18);
    expect(showSchoolCard(evening)).toBe(true);
    // Kiur has no first lesson on Mondays.
    expect(schoolStartHint('kiur', evening)).toEqual({ when: 'tomorrow', minutes: 9 * 60 + 5 });
    expect(schoolStartHint('kirsi', evening)).toEqual({ when: 'tomorrow', minutes: 9 * 60 + 5 });
  });

  it('appears on the last evening of a holiday, not inside it', () => {
    const lastEvening = at('2026-11-01', 18, 30);
    expect(showSchoolCard(lastEvening)).toBe(true);
    expect(schoolStartHint('kirsi', lastEvening)).toEqual({ when: 'tomorrow', minutes: 9 * 60 + 5 });
    for (const clock of [at('2026-10-28', 10), at('2026-10-28', 19)]) {
      expect(showSchoolCard(clock)).toBe(false);
      expect(schoolStartHint('kiur', clock)).toBeNull();
    }
  });

  it('gives no hint while a child is at an evening club (Kiur, Tue 19:00)', () => {
    const clock: AppClock = { date: '2026-10-13', weekday: 1, minutes: 19 * 60 };
    expect(nowState('kiur', clock).kind).toBe('club');
    expect(schoolStartHint('kiur', clock)).toBeNull();
    // Kirsi's day ended at 13.45 and Wednesday is a school day.
    expect(schoolStartHint('kirsi', clock)).toEqual({ when: 'tomorrow', minutes: 9 * 60 + 5 });
  });

  it('gives no hint while lessons are on or in the gap before an evening club', () => {
    expect(schoolStartHint('kiur', wed(10, 20))).toBeNull();
    expect(schoolStartHint('kiur', { date: '2026-10-13', weekday: 1, minutes: 16 * 60 })).toBeNull();
  });
});
