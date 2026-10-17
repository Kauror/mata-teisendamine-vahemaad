'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u10-lunar-eclipse';

// Geometry (diagram units). Sizes and distances are NOT to scale; only the
// order Sun – Earth – Moon and the shadow are. The Sun is drawn larger than the
// Earth, so the Earth's full shadow (umbra) narrows behind it, as in reality.
const SUN = { x: 55, y: 118, r: 38 };
const EARTH = { x: 190, y: 118, r: 26 };
const MOON = { x: 320, y: 118, r: 12 };
// Where the umbra's edges meet (similar triangles), and its half-width at x.
const APEX_X = EARTH.x + (EARTH.r * (EARTH.x - SUN.x)) / (SUN.r - EARTH.r);
const umbraHalf = (x: number) => (EARTH.r * (APEX_X - x)) / (APEX_X - EARTH.x);
const UMBRA_END = 380;
const UMBRA = `M${EARTH.x} ${EARTH.y - EARTH.r} L${UMBRA_END} ${(EARTH.y - umbraHalf(UMBRA_END)).toFixed(1)} L${UMBRA_END} ${(EARTH.y + umbraHalf(UMBRA_END)).toFixed(1)} L${EARTH.x} ${EARTH.y + EARTH.r} Z`;

// Registry regions (exactly): sun, earth, moon. Left to right on one line:
// the Sun with rays and its light going right, the Earth (day side towards
// the Sun), its shadow cone, and the Moon inside that shadow (reddish, as an
// eclipsed Moon looks). The Moon casts no shadow here.
export default function LunarEclipseDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u10-light-arrow' markerWidth='8' markerHeight='8' refX='4' refY='4' orient='auto'>
          <path d='M1 1 L7 4 L1 7 z' className='tb-diagram-light-head' />
        </marker>
        <clipPath id='tb-u10-earth-clip'>
          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} />
        </clipPath>
      </defs>
      <rect className='tb-diagram-space' x='0' y='0' width='380' height='245' rx='12' />
      {/* Sunlight reaching the Earth, and the Earth's shadow behind it. */}
      <path className='tb-diagram-sunlight' d={`M${SUN.x} ${SUN.y - SUN.r} L${EARTH.x} ${EARTH.y - EARTH.r} L${EARTH.x} ${EARTH.y + EARTH.r} L${SUN.x} ${SUN.y + SUN.r} Z`} />
      <path className='tb-diagram-umbra' d={UMBRA} />
      <g aria-hidden='true'>
        <path className='tb-diagram-light-ray' d='M108 80 H150' markerEnd='url(#tb-u10-light-arrow)' />
        <path className='tb-diagram-light-ray' d='M112 118 H152' markerEnd='url(#tb-u10-light-arrow)' />
        <path className='tb-diagram-light-ray' d='M108 156 H150' markerEnd='url(#tb-u10-light-arrow)' />
      </g>

      <DiagramRegion diagramId={ID} regionId='sun' props={props} hit={{ x: 6, y: 64, width: 98, height: 150 }}>
        <g className='tb-diagram-sun-rays'>
          <path d='M55 74 V64 M55 162 V172 M11 118 H3 M99 118 H107 M25 88 L18 81 M85 148 L92 155 M25 148 L18 155 M85 88 L92 81' />
        </g>
        <circle className='tb-diagram-sun' cx={SUN.x} cy={SUN.y} r={SUN.r} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='earth' props={props} hit={{ x: 150, y: 76, width: 80, height: 138 }}>
        <circle className='tb-diagram-earth-sea' cx={EARTH.x} cy={EARTH.y} r={EARTH.r} />
        <g clipPath='url(#tb-u10-earth-clip)'>
          <path className='tb-diagram-earth-land' d='M176 98 q12 -6 20 2 q4 10 -4 16 q-2 12 6 20 q-6 8 -14 2 q-6 -12 -4 -22 q-8 -8 -4 -18 z' />
          {/* Night side, away from the Sun. */}
          <rect className='tb-diagram-earth-night' x={EARTH.x} y={EARTH.y - EARTH.r} width={EARTH.r} height={EARTH.r * 2} />
        </g>
        <circle className='tb-diagram-earth-edge' cx={EARTH.x} cy={EARTH.y} r={EARTH.r} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='moon' props={props} hit={{ x: 284, y: 86, width: 72, height: 128 }}>
        <circle className='tb-diagram-moon-eclipsed' cx={MOON.x} cy={MOON.y} r={MOON.r} />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
