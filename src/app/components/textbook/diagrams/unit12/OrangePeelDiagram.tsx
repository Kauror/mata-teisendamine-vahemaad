'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u12-orange-peel';

// The peel, spread out: five segments of different length and width, torn
// apart around (262, 110). Wedge-shaped gaps open between them and two pieces
// have slid further away, so the peel cannot cover the flat table as one
// smooth sheet. Deliberately irregular, NOT a neat circle. Each segment: centre
// angle (degrees, 0 = right), half width (degrees), length, shift outwards.
const CENTRE = { x: 262, y: 110 };
const SEGMENTS = [
  { angle: -100, half: 24, length: 68, shift: 4 },
  { angle: -28, half: 26, length: 62, shift: 12 },
  { angle: 40, half: 21, length: 58, shift: 3 },
  { angle: 112, half: 25, length: 60, shift: 7 },
  { angle: 182, half: 22, length: 64, shift: 16 }
];

function segmentPath({ angle, half, length, shift }: (typeof SEGMENTS)[number]) {
  const rad = (degrees: number) => (degrees * Math.PI) / 180;
  const ox = CENTRE.x + shift * Math.cos(rad(angle));
  const oy = CENTRE.y + shift * Math.sin(rad(angle));
  // Polar outline: inner tip, left edge, ragged torn outer edge, right edge.
  const outline: Array<[number, number]> = [
    [6, angle], [length * 0.45, angle - half], [length * 0.85, angle - half * 1.05], [length, angle - half * 0.6],
    [length * 0.9, angle - half * 0.2], [length * 1.02, angle + half * 0.25], [length * 0.93, angle + half * 0.65],
    [length * 0.84, angle + half], [length * 0.5, angle + half * 0.95]
  ];
  return `M${outline.map(([r, a]) => `${(ox + r * Math.cos(rad(a))).toFixed(1)} ${(oy + r * Math.sin(rad(a))).toFixed(1)}`).join(' L')} Z`;
}

const PIECES = SEGMENTS.map(segmentPath);

// Registry regions (exactly): orange, peel-pieces. Left: an intact orange.
// Right: its peel spread out on a pale table in separate torn pieces.
export default function OrangePeelDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='orange' props={props} hit={{ x: 14, y: 34, width: 150, height: 150 }}>
        <ellipse className='tb-u12-table-shadow' cx='90' cy='176' rx='50' ry='6' />
        <circle className='tb-u12-orange' cx='88' cy='112' r='58' />
        <circle className='tb-u12-orange-light' cx='68' cy='90' r='20' />
        <path className='tb-u12-orange-dots' d='M60 130 h1 M74 146 h1 M104 140 h1 M120 118 h1 M112 84 h1 M92 70 h1 M50 108 h1 M88 158 h1 M128 100 h1' />
        <path className='tb-u12-stem' d='M88 56 V48' />
        <path className='tb-u12-leaf' d='M90 50 q14 -12 26 -6 q-10 12 -26 6 z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='peel-pieces' props={props} hit={{ x: 176, y: 34, width: 178, height: 150 }}>
        <rect className='tb-u12-table' x='176' y='34' width='178' height='150' rx='10' />
        <path className='tb-u12-table-grain' d='M184 64 h160 M184 104 q80 -6 160 0 M184 150 h160' />
        {PIECES.map((d, index) => (
          <g key={index}>
            {/* The white pith shows along the torn edges. */}
            <path className='tb-u12-pith' d={d} />
            <path className='tb-u12-peel' d={d} />
          </g>
        ))}
        <circle className='tb-u12-stem-dot' cx='254' cy='68' r='3' />
      </DiagramRegion>
    </DiagramSvg>
  );
}
