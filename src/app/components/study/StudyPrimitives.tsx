import type { ReactNode } from 'react';

const BLUE = '#3b82f6';
const BLUE_DARK = '#2563eb';
const SOFT = '#eef2ff';
const INK = '#0f172a';

export function MemoryRule({ children }: { children: ReactNode }) {
  return <p className='study-memory-rule'>{children}</p>;
}

export function CmMmRulerGraphic() {
  const left = 20;
  const right = 280;
  const ticks = Array.from({ length: 11 }, (_, index) => left + (index * (right - left)) / 10);
  return (
    <svg className='study-svg' viewBox='0 0 300 120' role='img' aria-label='1 cm jaguneb kümneks millimeetriks'>
      <rect x={left} y='40' width={right - left} height='34' rx='6' fill={SOFT} stroke={BLUE} strokeWidth='3' />
      {ticks.map((x, index) => (
        <line key={index} x1={x} y1='40' x2={x} y2={index % 10 === 0 ? 74 : 62} stroke={BLUE_DARK} strokeWidth={index % 10 === 0 ? 3 : 1.5} />
      ))}
      <text x='150' y='28' fontSize='14' fontWeight='800' fill={BLUE_DARK} textAnchor='middle'>1 cm</text>
      <text x='150' y='98' fontSize='13' fontWeight='700' fill={INK} textAnchor='middle'>10 mm</text>
    </svg>
  );
}
