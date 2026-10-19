'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { setPeekOptOut, useParentPresent, usePeekMode } from '@/app/components/usePeekMode';

// One bar across the top of every child-facing page whenever a parent session
// exists on this browser (rendered once, in the root layout). Peeking is
// read-only for the child's data; "Vaata nagu laps" lifts that too. Peeking is
// silent by design, so the bar is what stops it from being a surprise, the way
// back to testing the page as the child sees it, and the way back to the
// parent area.
//
// Not shown in the parent area itself or on the family password page; the
// parent's textbook preview has its own banner.
export default function PeekModeBanner() {
  const parentPresent = useParentPresent();
  const peeking = usePeekMode();
  const pathname = usePathname() ?? '';

  if (!parentPresent) return null;
  if (pathname === '/vanem' || pathname.startsWith('/vanem/') || pathname === '/access') return null;

  return (
    <div className={peeking ? 'peek-banner' : 'peek-banner peek-banner-off'} role='status'>
      <span aria-hidden>{peeking ? '👀' : '🧒'}</span>
      {/* Short enough for one line on a phone; the full sentence is read out. */}
      <span className='peek-banner-text'>
        {peeking ? 'Vaatlusrežiim' : 'Nagu laps'}
        <span className='sr-only'>{peeking ? ': vanem vaatab, lapse andmeid ei muudeta.' : ': tegevused salvestatakse lapse andmetesse.'}</span>
      </span>
      <button type='button' aria-label={peeking ? 'Vaata nagu laps' : 'Tagasi vaatlusesse'} onClick={() => setPeekOptOut(peeking)}>
        {peeking ? 'Nagu laps' : 'Vaatlusesse'}
      </button>
      <Link className='peek-banner-parent' href='/vanem'>Vanema ala</Link>
    </div>
  );
}
