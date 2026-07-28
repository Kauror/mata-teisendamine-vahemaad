'use client';

import { useMemo } from 'react';
import PointsConfetti from '@/app/components/PointsConfetti';
import RareCelebration from '@/app/components/RareCelebration';
import { pickCelebration } from '@/lib/celebration';

// Every place that used to render the confetti cannon renders this instead.
// Most of the time it still IS the confetti cannon — the roll happens once per
// mount, so a celebration never changes shape while the child is watching it.
export default function Celebration() {
  const chosen = useMemo(() => pickCelebration(Math.random()), []);
  if (chosen === 'konfeti') return <PointsConfetti />;
  return <RareCelebration kind={chosen} />;
}
