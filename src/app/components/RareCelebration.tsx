'use client';

import { useMemo } from 'react';
import type { RareCelebration as RareCelebrationName } from '@/lib/celebration';

// The rare celebrations that sometimes replace the confetti cannon. Built the
// same way it is — DOM nodes driven by CSS keyframes, generated on the client
// only, so the randomness never causes a server/client mismatch.
//
// Deliberately not canvas: colour emoji rasterise unreliably there (they can
// come out almost transparent), and the parade and the star rain are emoji.

type Piece = Record<string, string | number>;

const rnd = (min: number, max: number) => min + Math.random() * (max - min);

function vars(style: Record<string, string | number>) {
  return style as React.CSSProperties;
}

// Four bursts in sequence, each its own colour family.
function useIlutulestik() {
  return useMemo(() => {
    const palettes = [
      ['#fde68a', '#fbbf24', '#fb923c', '#ffffff'],
      ['#f9a8d4', '#ec4899', '#a855f7', '#ffffff'],
      ['#a5f3fc', '#38bdf8', '#34d399', '#ffffff'],
      ['#fca5a5', '#ef4444', '#fbbf24', '#ffffff']
    ];
    const pieces: Piece[] = [];
    palettes.forEach((palette, burst) => {
      const originX = 18 + Math.random() * 64;
      const originY = 14 + Math.random() * 26;
      const delay = burst * 560;
      for (let i = 0; i < 34; i += 1) {
        const angle = (Math.PI * 2 * i) / 34 + rnd(-0.1, 0.1);
        const distance = rnd(120, 300);
        pieces.push({
          left: `${originX}%`,
          top: `${originY}%`,
          background: palette[i % palette.length],
          '--dx': `${Math.round(Math.cos(angle) * distance)}px`,
          '--dy': `${Math.round(Math.sin(angle) * distance)}px`,
          '--fall': `${Math.round(rnd(120, 260))}px`,
          '--dur': `${Math.round(rnd(1500, 2100))}ms`,
          '--delay': `${delay + Math.round(rnd(0, 90))}ms`
        });
      }
    });
    return pieces;
  }, []);
}

function useMeteoorisadu() {
  return useMemo(() => Array.from({ length: 16 }, (_, index) => ({
    top: `${rnd(-10, 46)}%`,
    left: `${rnd(-24, 62)}%`,
    '--len': `${Math.round(rnd(90, 190))}px`,
    '--tint': ['#ffffff', '#fde68a', '#a5f3fc', '#f9a8d4'][index % 4],
    '--dur': `${Math.round(rnd(700, 1150))}ms`,
    '--delay': `${index * 95}ms`
  })), []);
}

const ZOO = ['🦄', '🦊', '🐢', '🐧', '🦉', '🐸', '🦔', '🐨', '🦖'];

function useLoomaparaad() {
  return useMemo(() => ZOO.map((glyph, index) => ({
    glyph,
    top: `${rnd(48, 78)}%`,
    fontSize: `${Math.round(rnd(38, 58))}px`,
    '--dur': `${rnd(2.6, 4.2).toFixed(2)}s`,
    '--hop': `${Math.round(rnd(12, 26))}px`,
    '--hopdur': `${rnd(0.36, 0.62).toFixed(2)}s`,
    '--delay': `${index * 260}ms`
  })), []);
}

// The app's own symbols, not generic treasure.
const RAIN = ['⭐', '⭐', '⭐', '🏆', '🔥', '⭐', '🏆'];

function useTahevihm() {
  return useMemo(() => Array.from({ length: 26 }, (_, index) => ({
    glyph: RAIN[index % RAIN.length],
    left: `${rnd(2, 94)}%`,
    fontSize: `${Math.round(rnd(24, 40))}px`,
    '--spin': `${Math.round(rnd(-260, 260))}deg`,
    '--dur': `${rnd(1.5, 2.3).toFixed(2)}s`,
    '--delay': `${index * 70}ms`
  })), []);
}

function useSeebimullid() {
  return useMemo(() => Array.from({ length: 26 }, (_, index) => {
    const size = Math.round(rnd(18, 54));
    return {
      left: `${rnd(4, 92)}%`,
      width: `${size}px`,
      height: `${size}px`,
      '--drift': `${Math.round(rnd(-70, 70))}px`,
      '--dur': `${rnd(3.2, 5).toFixed(2)}s`,
      '--delay': `${index * 130}ms`
    };
  }), []);
}

const RAINBOW = ['#ef4444', '#f97316', '#fbbf24', '#22c55e', '#38bdf8', '#8b5cf6'];

export default function RareCelebration({ kind }: { kind: RareCelebrationName }) {
  const fireworks = useIlutulestik();
  const meteors = useMeteoorisadu();
  const animals = useLoomaparaad();
  const rain = useTahevihm();
  const bubbles = useSeebimullid();

  if (kind === 'ilutulestik') {
    return (
      <div className='celebration celebration-fireworks' aria-hidden>
        {fireworks.map((piece, index) => <span key={index} className='firework-spark' style={vars(piece)} />)}
      </div>
    );
  }

  if (kind === 'meteoorisadu') {
    return (
      <div className='celebration celebration-meteors' aria-hidden>
        {meteors.map((piece, index) => <span key={index} className='meteor' style={vars(piece)} />)}
      </div>
    );
  }

  if (kind === 'loomaparaad') {
    return (
      <div className='celebration celebration-parade' aria-hidden>
        {animals.map((animal, index) => (
          <span key={index} className='parade-lane' style={vars({ top: animal.top, '--dur': animal['--dur'], '--delay': animal['--delay'] })}>
            <span className='parade-animal' style={vars({ fontSize: animal.fontSize, '--hop': animal['--hop'], '--hopdur': animal['--hopdur'] })}>
              {animal.glyph as string}
            </span>
          </span>
        ))}
      </div>
    );
  }

  if (kind === 'tahevihm') {
    return (
      <div className='celebration celebration-starrain' aria-hidden>
        {rain.map((piece, index) => (
          <span key={index} className='starrain-piece' style={vars(piece)}>{piece.glyph as string}</span>
        ))}
      </div>
    );
  }

  if (kind === 'seebimullid') {
    return (
      <div className='celebration celebration-bubbles' aria-hidden>
        {bubbles.map((piece, index) => <span key={index} className='bubble' style={vars(piece)} />)}
      </div>
    );
  }

  return (
    <div className='celebration celebration-rainbow' aria-hidden>
      <svg viewBox='0 0 100 56' preserveAspectRatio='xMidYMax slice'>
        {RAINBOW.map((colour, index) => (
          <path
            key={colour}
            d={`M 4 56 A ${46 - index * 5} ${46 - index * 5} 0 0 1 96 56`}
            fill='none'
            stroke={colour}
            strokeWidth='4.4'
            strokeLinecap='round'
            style={vars({ '--delay': `${index * 160}ms` })}
          />
        ))}
      </svg>
    </div>
  );
}
