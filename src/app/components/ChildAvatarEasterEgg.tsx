'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { Learner } from '@/lib/shared/types';

const TAPS_TO_OPEN = 5;
// Below this, nothing is shown at all — the first two taps have to feel like
// nothing happened, or it stops being a secret.
const TAPS_BEFORE_HINT = 2;
// A pause longer than this and the child was not really tapping; start over.
const TAP_WINDOW_MS = 2500;

// Tapping the avatar five times opens the hidden "Paarid" minigame.
export default function ChildAvatarEasterEgg({
  learner,
  name,
  avatar
}: {
  learner: Learner;
  name: string;
  avatar: string;
}) {
  const router = useRouter();
  const [taps, setTaps] = useState(0);
  const resetTimer = useRef<number | null>(null);

  useEffect(() => () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
  }, []);

  const tap = () => {
    const next = taps + 1;
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);

    if (next >= TAPS_TO_OPEN) {
      setTaps(0);
      router.push(`/${learner}/paarid`);
      return;
    }

    setTaps(next);
    resetTimer.current = window.setTimeout(() => setTaps(0), TAP_WINDOW_MS);
  };

  const remaining = TAPS_TO_OPEN - taps;

  return (
    <>
      <button type='button' className='child-home-avatar' onClick={tap} aria-label={name}>
        <span aria-hidden>{avatar}</span>
      </button>
      <div className='child-home-name'>
        <h1>{name}</h1>
        {taps >= TAPS_BEFORE_HINT ? <p className='child-home-egg-hint' aria-hidden>Veel {remaining}</p> : null}
      </div>
    </>
  );
}
