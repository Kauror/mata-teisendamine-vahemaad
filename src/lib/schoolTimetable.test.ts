import { beforeAll, describe, expect, it } from 'vitest';
import example from '@/lib/schoolTimetable.example.json';
import {
  appClock,
  clubsLeftToday,
  defaultTab,
  hasMoreToday,
  homeStatus,
  isKnownSubject,
  isSchoolDate,
  nextDayHeading,
  nextSchoolDate,
  nextTabLabel,
  nowState,
  EMPTY_SCHOOL_TIMETABLE,
  parseSchoolTimetable,
  schoolBells,
  schoolTimetableData,
  scheduleFor,
  schoolEndsAt,
  schoolStartHint,
  serializeSchoolTimetable,
  setSchoolTimetableData,
  showSchoolCard,
  weekdayOf,
  type AppClock
} from '@/lib/schoolTimetable';

// The fictional example timetable (the real one is private and not in the
// repository). Bells 8.00, 8.55, 9.50, 10.50, 11.45, 12.40, 45 minutes each.
beforeAll(() => {
  setSchoolTimetableData(parseSchoolTimetable(example));
});

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
    for (const child of Object.values(schoolTimetableData().children)) {
      expect(child.days).toHaveLength(5);
      for (const day of child.days) {
        expect(day.lessons.length).toBeLessThanOrEqual(schoolBells().length);
        for (const name of day.lessons) if (name) expect(isKnownSubject(name), name).toBe(true);
      }
    }
  });

  it('ends school when the sheet says it does', () => {
    expect([0, 1, 2, 3, 4].map((day) => schoolEndsAt('kiur', day))).toEqual([750, 805, 750, 695, 805]);
    expect([0, 1, 2, 3, 4].map((day) => schoolEndsAt('kirsi', day))).toEqual([750, 695, 750, 695, 750]);
    expect(scheduleFor('kirsi', 0)[0]).toMatchObject({ kind: 'lesson', name: 'Eesti keel', start: 535, number: 2 });
  });

  it('round-trips through the file format and rejects a broken file', () => {
    const data = parseSchoolTimetable(example);
    expect(parseSchoolTimetable(serializeSchoolTimetable(data))).toEqual(data);
    expect(data.children.kiur.days[1].clubs[0]).toEqual({ name: 'Male', start: 17 * 60 + 30, end: 19 * 60, icon: '♟️' });
    expect(() => parseSchoolTimetable({ ...example, version: 2 })).toThrow(/version/);
    const badSubject = structuredClone(example) as { children: { kiur: { days: Array<{ lessons: Array<string | null> }> } } };
    badSubject.children.kiur.days[0].lessons[1] = 'Alkeemia';
    expect(() => parseSchoolTimetable(badSubject)).toThrow(/unknown subject/);
    const badTime = structuredClone(example) as { bells: string[][] };
    badTime.bells[0] = ['8.00', '08:45'];
    expect(() => parseSchoolTimetable(badTime)).toThrow(/bells\[0\]\[0\]/);
  });

  it('shows nothing, rather than failing, without a timetable', () => {
    setSchoolTimetableData(EMPTY_SCHOOL_TIMETABLE);
    try {
      expect(scheduleFor('kiur', 2)).toEqual([]);
      expect(nowState('kiur', wed(10, 20))).toEqual({ kind: 'home' });
      expect(homeStatus('kiur', wed(10, 20))).toBeNull();
      expect(homeStatus('kirsi', wed(21))).toBeNull();
    } finally {
      setSchoolTimetableData(parseSchoolTimetable(example));
    }
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
    expect(state).toMatchObject({ kind: 'lesson', item: { name: 'Matemaatika', number: 3 }, minutesLeft: 15 });
  });

  it('calls the gap between lessons a break', () => {
    expect(nowState('kiur', wed(10, 40)).kind).toBe('break');
  });

  it('is home before the first lesson and after the last one', () => {
    expect(nowState('kirsi', wed(8, 30)).kind).toBe('home');
    expect(nowState('kirsi', wed(15)).kind).toBe('home');
  });

  it('keeps a child at school for a club that starts right after the bell', () => {
    expect(nowState('kiur', wed(12, 35)).kind).toBe('break');
    expect(nowState('kiur', wed(13, 30))).toMatchObject({ kind: 'club', item: { name: 'Kokandus' } });
  });

  it('is home in the long gap before an evening club, then at the club', () => {
    const tuesday = (hours: number): AppClock => ({ date: '2026-10-13', weekday: 1, minutes: hours * 60 });
    expect(nowState('kiur', tuesday(16)).kind).toBe('home');
    expect(nowState('kiur', tuesday(18))).toMatchObject({ kind: 'club', item: { name: 'Male' } });
  });

  it('is home on a holiday even at lesson time', () => {
    expect(nowState('kiur', { date: '2026-10-28', weekday: 2, minutes: 620 }).kind).toBe('home');
  });
});

describe('the timetable page', () => {
  it('shows today until the last lesson, then the next school day', () => {
    expect(defaultTab('kiur', wed(12, 29))).toBe('today');
    expect(defaultTab('kiur', wed(12, 30))).toBe('next');
    expect(defaultTab('kiur', { date: '2026-10-17', weekday: 5, minutes: 600 })).toBe('next');
  });

  it('keeps today\'s evening club in sight after switching to tomorrow', () => {
    const tuesday = (hours: number, minutes = 0): AppClock => ({ date: '2026-10-13', weekday: 1, minutes: hours * 60 + minutes });
    expect(clubsLeftToday('kiur', tuesday(15)).map((club) => club.name)).toEqual(['Male']);
    expect(clubsLeftToday('kiur', tuesday(19))).toEqual([]);
    expect(hasMoreToday('kiur', tuesday(18, 59))).toBe(true);
    expect(hasMoreToday('kiur', tuesday(19))).toBe(false);
  });
});

describe('the home card and its "Kool algab" line', () => {
  const at = (date: string, hours: number, minutes = 0): AppClock => ({ date, weekday: weekdayOf(date), minutes: hours * 60 + minutes });

  it('says when school starts tomorrow once the day is over, per child (Wed 21:00)', () => {
    const clock = wed(21);
    expect(showSchoolCard(clock)).toBe(true);
    expect(schoolStartHint('kiur', clock)).toEqual({ when: 'tomorrow', minutes: 8 * 60 });
    expect(schoolStartHint('kirsi', clock)).toEqual({ when: 'tomorrow', minutes: 8 * 60 + 55 });
  });

  it('says when school starts today in the morning (Thu 07:45)', () => {
    const clock: AppClock = { date: '2026-10-15', weekday: 3, minutes: 7 * 60 + 45 };
    expect(showSchoolCard(clock)).toBe(true);
    expect(schoolStartHint('kiur', clock)).toEqual({ when: 'today', minutes: 8 * 60 });
    expect(schoolStartHint('kirsi', clock)).toEqual({ when: 'today', minutes: 8 * 60 + 55 });
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
    expect(schoolStartHint('kiur', evening)).toEqual({ when: 'tomorrow', minutes: 8 * 60 + 55 });
    expect(schoolStartHint('kirsi', evening)).toEqual({ when: 'tomorrow', minutes: 8 * 60 + 55 });
  });

  it('appears on the last evening of a holiday, not inside it', () => {
    const lastEvening = at('2026-11-01', 18, 30);
    expect(showSchoolCard(lastEvening)).toBe(true);
    expect(schoolStartHint('kirsi', lastEvening)).toEqual({ when: 'tomorrow', minutes: 8 * 60 + 55 });
    for (const clock of [at('2026-10-28', 10), at('2026-10-28', 19)]) {
      expect(showSchoolCard(clock)).toBe(false);
      expect(schoolStartHint('kiur', clock)).toBeNull();
    }
  });

  it('gives no hint while a child is at an evening club (Kiur, Tue 18:30)', () => {
    const clock: AppClock = { date: '2026-10-13', weekday: 1, minutes: 18 * 60 + 30 };
    expect(nowState('kiur', clock).kind).toBe('club');
    expect(schoolStartHint('kiur', clock)).toBeNull();
    // Kirsi's day ended at 11.35 and Wednesday is a school day.
    expect(schoolStartHint('kirsi', clock)).toEqual({ when: 'tomorrow', minutes: 8 * 60 + 55 });
  });

  it('gives no hint while lessons are on or in the gap before an evening club', () => {
    expect(schoolStartHint('kiur', wed(10, 20))).toBeNull();
    expect(schoolStartHint('kiur', { date: '2026-10-13', weekday: 1, minutes: 16 * 60 })).toBeNull();
  });
});

describe('the status chip on the home page', () => {
  const at = (date: string, hours: number, minutes = 0): AppClock => ({ date, weekday: weekdayOf(date), minutes: hours * 60 + minutes });

  it('says how long a child is at school, through breaks too', () => {
    expect(homeStatus('kiur', wed(10, 20))).toEqual({ kind: 'school', icon: '🏫', text: 'koolis kuni 12.30' });
    expect(homeStatus('kiur', wed(10, 40))?.text).toBe('koolis kuni 12.30');
    expect(homeStatus('kirsi', wed(10, 20))?.text).toBe('koolis kuni 12.30');
  });

  it('shows a club from an hour before it starts until it ends, not earlier', () => {
    const tuesday = (hours: number, minutes = 0) => at('2026-10-13', hours, minutes);
    expect(homeStatus('kiur', tuesday(16, 29))).toBeNull();
    expect(homeStatus('kiur', tuesday(16, 30))).toEqual({ kind: 'club', icon: '♟️', text: 'Male 17.30' });
    expect(homeStatus('kiur', tuesday(18))?.text).toBe('Male 17.30');
  });

  it('moves from school to a club that starts right after the bell', () => {
    // Kiur, Wednesday: school until 12.30, Kokandus at 12.45.
    expect(homeStatus('kiur', wed(12, 20))?.kind).toBe('school');
    expect(homeStatus('kiur', wed(12, 35))).toEqual({ kind: 'club', icon: '🍳', text: 'Kokandus 12.45' });
  });

  it('says when school starts in the morning and from 18.00 the evening before', () => {
    expect(homeStatus('kirsi', at('2026-10-15', 7, 45))).toEqual({ kind: 'start', icon: '🎒', text: 'kool algab 8.55' });
    // Wednesday afternoon, both days over: too early for tomorrow's start.
    expect(homeStatus('kirsi', wed(16))).toBeNull();
    expect(homeStatus('kiur', wed(21))?.text).toBe('kool algab 8.00');
    expect(homeStatus('kirsi', wed(21))?.text).toBe('kool algab 8.55');
    expect(homeStatus('kiur', at('2026-10-18', 18, 30))?.text).toBe('kool algab 8.55');
  });

  it('shows nothing on a Saturday or inside a holiday', () => {
    expect(homeStatus('kiur', at('2026-10-17', 11))).toBeNull();
    expect(homeStatus('kiur', at('2026-10-28', 10))).toBeNull();
  });
});
