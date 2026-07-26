'use client';

import { useMemo } from 'react';

const COLORS = ['#22c55e', '#378ADD', '#EF9F27', '#ED93B1', '#7F77DD', '#F0997B', '#16a34a'];
const PIECE_COUNT = 64;

// A one-shot confetti cannon: every piece starts in the middle of the screen and
// blasts outwards, then drops and fades. Pieces are generated on the client only
// (the popup that renders this mounts after hydration), so the random spread
// never causes a server/client mismatch.
export default function PointsConfetti() {
  const pieces = useMemo(() => {
    return Array.from({ length: PIECE_COUNT }, (_, index) => {
      const angle = (Math.PI * 2 * index) / PIECE_COUNT + (Math.random() - 0.5) * 0.35;
      const distance = 220 + Math.random() * 440;
      return {
        dx: Math.cos(angle) * distance,
        // Slightly favour the upper half so the blast reads as a burst, not a puddle.
        dy: Math.sin(angle) * distance * 0.86 - 60,
        fall: 260 + Math.random() * 380,
        rotation: (Math.random() - 0.5) * 900,
        duration: 2800 + Math.random() * 1400,
        delay: Math.random() * 180,
        color: COLORS[index % COLORS.length],
        round: Math.random() < 0.4
      };
    });
  }, []);

  return (
    <div className='points-confetti' aria-hidden>
      {pieces.map((piece, index) => (
        <span
          key={index}
          className={piece.round ? 'points-confetti-piece is-round' : 'points-confetti-piece'}
          style={{
            background: piece.color,
            ['--dx' as string]: `${Math.round(piece.dx)}px`,
            ['--dy' as string]: `${Math.round(piece.dy)}px`,
            ['--fall' as string]: `${Math.round(piece.fall)}px`,
            ['--rot' as string]: `${Math.round(piece.rotation)}deg`,
            ['--dur' as string]: `${Math.round(piece.duration)}ms`,
            ['--delay' as string]: `${Math.round(piece.delay)}ms`
          }}
        />
      ))}
    </div>
  );
}
