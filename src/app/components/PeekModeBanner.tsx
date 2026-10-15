'use client';

import { setPeekOptOut, useParentPresent, usePeekMode } from '@/app/components/usePeekMode';

// Visible on a child's screen whenever a parent session exists on this browser.
// Peeking is read-only for the child's data; "Vaata nagu laps" lifts that too.
// Peeking is silent by design, so the banner is what stops it from being a
// surprise — and it is the way back for testing the page as the child sees it.
export default function PeekModeBanner() {
  const parentPresent = useParentPresent();
  const peeking = usePeekMode();

  if (!parentPresent) return null;

  return (
    <div className={peeking ? 'peek-banner' : 'peek-banner peek-banner-off'} role='status'>
      <span aria-hidden>{peeking ? '👀' : '🧒'}</span>
      <span className='peek-banner-text'>
        {peeking
          ? 'Vanema vaatlusrežiim — teated jäävad lapsele alles ja lapse andmeid ei muudeta.'
          : 'Vaatad nagu laps — teated märgitakse nähtuks ja tegevused salvestatakse.'}
      </span>
      <button type='button' onClick={() => setPeekOptOut(peeking)}>
        {peeking ? 'Vaata nagu laps' : 'Tagasi vaatlusesse'}
      </button>
    </div>
  );
}
