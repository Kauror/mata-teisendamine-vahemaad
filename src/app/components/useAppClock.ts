'use client';

import { useEffect, useState } from 'react';
import { appClock, type AppClock } from '@/lib/schoolTimetable';

// The family's clock, refreshed every half minute. Null until mounted: the
// server renders without a time, so "now" never causes a hydration mismatch.
export function useAppClock(intervalMs = 30_000): AppClock | null {
  const [clock, setClock] = useState<AppClock | null>(null);

  useEffect(() => {
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
