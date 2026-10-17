'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { arcPath, sightY, surfacePoint, tiltAt } from '@/app/components/textbook/diagrams/curvedSurface';
import { FAR_SHIP_X, NEAR_SHIP_X, SHIP_EYE, SHIP_HORIZON, SHIP_HULL_TOP, SHIP_MAST_TOP, SHIP_OBSERVER_EYE, SHIP_OBSERVER_X, SHIP_SEA } from '@/app/components/textbook/diagrams/horizonGeometry';

const ID = 'u10-ship-horizon';

// The sea surface is an arc of a circle with hugely exaggerated curvature
// (horizonGeometry.ts). Everything stands pointing away from its centre.
const WIDTH = 380;
const HEIGHT = 260;

const f = (value: number) => value.toFixed(1);

function placed(x: number) {
  const base = surfacePoint(SHIP_SEA, x);
  return `translate(${f(base.x)} ${f(base.y)}) rotate(${f(tiltAt(SHIP_SEA, x))})`;
}

// A sailing ship in local units: waterline at y = 0, up is negative y.
function ShipShape() {
  return (
    <>
      <path className='tb-diagram-hull' d={`M-26 -${SHIP_HULL_TOP} L26 -${SHIP_HULL_TOP} L18 0 L-18 0 Z`} />
      <line className='tb-diagram-mast' x1='0' y1={-SHIP_HULL_TOP} x2='0' y2={-SHIP_MAST_TOP} />
      <path className='tb-diagram-sail' d='M3 -68 L3 -24 L24 -24 Z' />
      <path className='tb-diagram-sail' d='M-3 -62 L-3 -24 L-20 -24 Z' />
      <path className='tb-diagram-flag' d={`M0 -${SHIP_MAST_TOP} L12 -${SHIP_MAST_TOP - 4} L0 -${SHIP_MAST_TOP - 8} Z`} />
    </>
  );
}

// Registry regions (exactly): observer, near-ship, far-ship. Seen from the
// side: an observer on the shore at the left, a nearer ship that is fully in
// view, and a farther ship beyond the horizon. The dashed sight line from the
// observer's eye just touches the sea; everything below it beyond that point
// (the shaded zone) is hidden by the curve, so the far ship's hull is hidden
// (drawn only as a faint dashed outline) while its mast and sail stay visible.
export default function ShipHorizonDiagram(props: DiagramProps) {
  const leftY = sightY(SHIP_EYE, SHIP_HORIZON, 0);
  const rightY = sightY(SHIP_EYE, SHIP_HORIZON, WIDTH);
  const surfaceRight = surfacePoint(SHIP_SEA, WIDTH);
  const visible = `M0 -10 L${WIDTH} -10 L${WIDTH} ${f(rightY)} L0 ${f(leftY)} Z`;
  const hidden = `M0 ${f(leftY)} L${WIDTH} ${f(rightY)} L${WIDTH} ${HEIGHT + 10} L0 ${HEIGHT + 10} Z`;
  const hiddenZone = `M${f(SHIP_HORIZON.x)} ${f(SHIP_HORIZON.y)} L${WIDTH} ${f(rightY)} L${WIDTH} ${f(surfaceRight.y)} A${SHIP_SEA.r} ${SHIP_SEA.r} 0 0 0 ${f(SHIP_HORIZON.x)} ${f(SHIP_HORIZON.y)} Z`;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u10-ship-visible'><path d={visible} /></clipPath>
        <clipPath id='tb-u10-ship-hidden'><path d={hidden} /></clipPath>
      </defs>
      <rect className='tb-diagram-sky' x='0' y='0' width={WIDTH} height={HEIGHT} />
      <path className='tb-diagram-sea' d={arcPath(SHIP_SEA, 0, WIDTH, HEIGHT + 2)} />
      {/* The shore the observer stands on. */}
      <path className='tb-diagram-sand' d={arcPath(SHIP_SEA, 0, 100, HEIGHT + 2)} />
      <path className='tb-diagram-hidden-zone' d={hiddenZone} />
      <path className='tb-diagram-sight' d={`M${f(SHIP_EYE.x)} ${f(SHIP_EYE.y)} L${WIDTH} ${f(rightY)}`} />

      <DiagramRegion diagramId={ID} regionId='observer' props={props} hit={{ x: 8, y: 134, width: 84, height: 86 }}>
        <g className='tb-diagram-person' transform={placed(SHIP_OBSERVER_X)}>
          <path d='M-5 0 L0 -12 L5 0 M0 -12 V-23 M-6 -19 L0 -22 L7 -26' />
          <circle className='tb-diagram-person-head' cx='0' cy={-SHIP_OBSERVER_EYE} r='4.5' />
        </g>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='near-ship' props={props} hit={{ x: 98, y: 80, width: 84, height: 120 }}>
        <g transform={placed(NEAR_SHIP_X)}><ShipShape /></g>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='far-ship' props={props} hit={{ x: 290, y: 104, width: 90, height: 112 }}>
        {/* What the observer sees: only the part above the sight line. */}
        <g clipPath='url(#tb-u10-ship-visible)'>
          <g transform={placed(FAR_SHIP_X)}><ShipShape /></g>
        </g>
        {/* The hidden part, as a faint outline behind the curve. */}
        <g className='tb-diagram-ghost' clipPath='url(#tb-u10-ship-hidden)'>
          <g transform={placed(FAR_SHIP_X)}>
            <path d={`M-26 -${SHIP_HULL_TOP} L26 -${SHIP_HULL_TOP} L18 0 L-18 0 Z`} />
            <line x1='0' y1={-SHIP_HULL_TOP} x2='0' y2='-40' />
            <path d='M3 -40 L3 -24 L24 -24 M-3 -40 L-3 -24 L-20 -24' />
          </g>
        </g>
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
