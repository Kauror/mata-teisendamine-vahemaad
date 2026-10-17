'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { meridianPath, parallelPath, project, sideHalfPath } from '@/app/components/textbook/diagrams/unit11/globeProjection';
import { ESTONIA, MERIDIANS_GLOBE, OTHER_MERIDIAN, PLAIN_MERIDIAN } from '@/app/components/textbook/diagrams/unit11/layouts';

const ID = 'u11-meridians-estonia';
const G = MERIDIANS_GLOBE;
const EESTI = project(G, ESTONIA.latitude, ESTONIA.longitude);

// Registry regions (exactly): other-meridian, prime-meridian, estonia,
// west-hemisphere, east-hemisphere. A direction-and-position schematic, not a
// map: the globe seen straight at the equator with the prime meridian in the
// middle (orthographic projection, globeProjection.ts). The red prime meridian
// runs straight from pole to pole; the 45° W meridian (the marked "other" one)
// and the 45° E meridian curve to meet it at both poles; a lighter equator
// crosses the middle. The visible western and eastern halves have different
// pale tints (a hemisphere is really bounded by the prime meridian and the
// 180° meridian behind the globe; the front face only shows which side is
// which); each hemisphere region is a marked patch in its half. Estonia is a dot at its real position, 58.6° N 25° E: north of the
// equator, east of the prime meridian. No land or borders are drawn.
export default function MeridiansEstoniaDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      {/* The tints are background, so a region's tap area (and its reveal highlight) lies above them. */}
      <g aria-hidden='true'>
        <path className='tb-diagram-tint-a' d={sideHalfPath(G, 'west')} />
        <path className='tb-diagram-tint-b' d={sideHalfPath(G, 'east')} />
      </g>
      <DiagramRegion diagramId={ID} regionId='west-hemisphere' props={props} hit={{ x: 122, y: 88, width: 62, height: 62 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='east-hemisphere' props={props} hit={{ x: 198, y: 88, width: 62, height: 62 }}>
        {null}
      </DiagramRegion>
      <g aria-hidden='true' pointerEvents='none'>
        <circle className='tb-diagram-earth-edge' cx={G.cx} cy={G.cy} r={G.r} />
        <path className='tb-diagram-grid-line tb-diagram-grid-faint' d={parallelPath(G, 0)} />
        <path className='tb-diagram-grid-line tb-diagram-grid-faint' d={meridianPath(G, PLAIN_MERIDIAN)} />
      </g>

      <DiagramRegion diagramId={ID} regionId='other-meridian' props={props} hit={{ x: 87, y: 179, width: 62, height: 62 }}>
        <path className='tb-diagram-grid-line' d={meridianPath(G, OTHER_MERIDIAN)} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='prime-meridian' props={props} hit={{ x: 159, y: 185, width: 62, height: 62 }}>
        <path className='tb-diagram-key-line' d={meridianPath(G, 0)} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='estonia' props={props} hit={{ x: 196, y: 18, width: 62, height: 62 }}>
        <circle className='tb-diagram-estonia' cx={EESTI.x.toFixed(1)} cy={EESTI.y.toFixed(1)} r='6' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
