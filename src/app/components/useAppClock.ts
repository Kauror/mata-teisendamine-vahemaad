'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  appClock,
  parseSchoolTimetable,
  schoolTimetableRevision,
  serializeSchoolTimetable,
  setSchoolTimetableData,
  subscribeSchoolTimetable,
  type AppClock
} from '@/lib/schoolTimetable';

// The timetable is private, so it is not in the bundle: it comes from
// /api/school-timetable, with a copy in localStorage so it still works offline
// (and shows at once on the next visit). Loaded once per page.
const TIMETABLE_STORAGE_KEY = 'harjutaja:school-timetable';
let timetableRequested = false;

function loadSchoolTimetableOnce() {
  if (timetableRequested || typeof window === 'undefined') return;
  timetableRequested = true;
  try {
    const stored = window.localStorage.getItem(TIMETABLE_STORAGE_KEY);
    if (stored) setSchoolTimetableData(parseSchoolTimetable(JSON.parse(stored)));
  } catch {
    // A missing or stale copy is replaced by the fetch below.
  }
  void fetch('/api/school-timetable', { credentials: 'same-origin', cache: 'no-store' })
    .then((response) => (response.ok ? response.json() : Promise.reject(new Error('timetable unavailable'))))
    .then((body: unknown) => {
      const data = parseSchoolTimetable(body);
      setSchoolTimetableData(data);
      try {
        window.localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(serializeSchoolTimetable(data)));
      } catch {
        // Storage full or blocked: the timetable still shows for this visit.
      }
    })
    .catch(() => {
      // Offline: the stored copy (if any) stays.
    });
}

// The family's clock, refreshed every half minute. Null until mounted: the
// server renders without a time, so "now" never causes a hydration mismatch.
// Every timetable view reads the clock through this hook, so it also loads the
// timetable and re-renders when it arrives.
export function useAppClock(intervalMs = 30_000): AppClock | null {
  const [clock, setClock] = useState<AppClock | null>(null);
  useSyncExternalStore(subscribeSchoolTimetable, schoolTimetableRevision, () => 0);

  useEffect(() => {
    loadSchoolTimetableOnce();
    const tick = () => setClock(appClock(new Date()));
    tick();
    const timer = window.setInterval(tick, intervalMs);
    // A phone waking from sleep should not show the lesson it fell asleep in.
    const onVisible = () => { if (document.visibilityState === 'visible') tick(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [intervalMs]);

  return clock;
}
