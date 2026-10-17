'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { above, arcPath, bandPath, tiltAt } from '@/app/components/textbook/diagrams/curvedSurface';
import { BEACH_EYE_POINT, BEACH_HORIZON, BEACH_X, HEIGHT_SEA, TOWER_EYE_POINT, TOWER_HEIGHT, TOWER_HORIZON, TOWER_STAND, TOWER_X } from '@/app/components/textbook/diagrams/horizonGeometry';

const ID = 'u10-observer-height';

// One curved water surface (curvature hugely exaggerated, not to scale). The
// person on the beach looks to the left, the person on the tower to the
// right; each sight line just touches the water at that person's horizon.
// Positions: horizonGeometry.ts.
const WIDTH = 360;
const HEIGHT = 270;

const f = (value: number) => value.toFixed(1);

function placed(x: number, lift = 0) {
  const base = above(HEIGHT_SEA, x, lift);
  return `translate(${f(base.x)} ${f(base.y)}) rotate(${f(tiltAt(HEIGHT_SEA, x))})`;
}

// A standing person, feet at the origin, eye (head centre) at -25.
function Person() {
  return (
    <g className='tb-diagram-person'>
      <path d='M-5 0 L0 -11 L5 0 M0 -11 V-21 M-6 -17 L0 -19 L6 -17' />
      <circle className='tb-diagram-person-head' cx='0' cy='-25' r='4.5' />
    </g>
  );
}

// Registry regions (exactly): beach, tower. Left: a person standing on a sandy
// beach; right: a person on top of a tall striped tower on a rock. The tower's
// sight line reaches a horizon much farther away than the beach's.
export default function ObserverHeightDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-diagram-sky' x='0' y='0' width={WIDTH} height={HEIGHT} />
      <path className='tb-diagram-sea' d={arcPath(HEIGHT_SEA, 0, WIDTH, HEIGHT + 2)} />
      <path className='tb-diagram-sight' d={`M${f(BEACH_EYE_POINT.x)} ${f(BEACH_EYE_POINT.y)} L${f(BEACH_HORIZON.x)} ${f(BEACH_HORIZON.y)}`} />
      <path className='tb-diagram-sight tb-diagram-sight-far' d={`M${f(TOWER_EYE_POINT.x)} ${f(TOWER_EYE_POINT.y)} L${f(TOWER_HORIZON.x)} ${f(TOWER_HORIZON.y)}`} />
      <circle className='tb-diagram-horizon-dot' cx={f(BEACH_HORIZON.x)} cy={f(BEACH_HORIZON.y)} r='4' />
      <circle className='tb-diagram-horizon-dot tb-diagram-sight-far' cx={f(TOWER_HORIZON.x)} cy={f(TOWER_HORIZON.y)} r='4' />

      <DiagramRegion diagramId={ID} regionId='beach' props={props} hit={{ x: 72, y: 98, width: 90, height: 96 }}>
        <path className='tb-diagram-sand' d={bandPath(HEIGHT_SEA, 100, 158, 10)} />
        <g transform={placed(BEACH_X)}><Person /></g>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='tower' props={props} hit={{ x: 172, y: 84, width: 84, height: 112 }}>
        <path className='tb-diagram-rock' d={bandPath(HEIGHT_SEA, 182, 220, 12)} />
        <g transform={placed(TOWER_X)}>
          <path className='tb-diagram-tower' d={`M-11 0 L-6 -${TOWER_HEIGHT} L6 -${TOWER_HEIGHT} L11 0 Z`} />
          <path className='tb-diagram-tower-band' d={`M-9.5 -10 L-8.6 -18 L8.6 -18 L9.5 -10 Z M-7.8 -26 L-7.1 -32 L7.1 -32 L7.8 -26 Z`} />
          <rect className='tb-diagram-tower' x='-10' y={-TOWER_HEIGHT - 3} width='20' height='4' rx='1' />
        </g>
        <g transform={placed(TOWER_X, TOWER_STAND)}><Person /></g>
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
