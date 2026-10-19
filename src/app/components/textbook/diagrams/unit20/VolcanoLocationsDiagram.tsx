'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u20-volcano-locations';

const SURFACE_Y = 110;
const PLATE_BOTTOM = 170;
// Where the two plates meet (a jagged seam) and where the second volcano sits.
export const U20_SEAM_X = 200;
export const U20_HOT_X = 290;

// An INVENTED cross-section, not a map: two plates in different tints meet at
// a seam (arrows: plates move); one volcano sits on the seam with magma rising
// along it; a second sits in the middle of the right plate over a hot blob deep
// below (a hot spot, like Hawaii); the middle of the left plate is quiet flat
// land. Nothing here says that every plate boundary has volcanoes. Registry
// regions (exactly): boundary (left cone), hotspot (right cone), quiet-interior
// (left, low).
export default function VolcanoLocationsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u20-vl-head' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u20-head' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u20-frame' x='0' y='0' width='360' height='240' rx='12' />
      <rect className='tb-u20-mantle' x='4' y={PLATE_BOTTOM} width='352' height='66' />
      <path className='tb-u20-plate-a' d={`M4 ${SURFACE_Y} H${U20_SEAM_X} L${U20_SEAM_X - 6} 130 L${U20_SEAM_X + 4} 150 L${U20_SEAM_X - 4} ${PLATE_BOTTOM} H4 Z`} />
      <path className='tb-u20-plate-b' d={`M${U20_SEAM_X} ${SURFACE_Y} H356 V${PLATE_BOTTOM} H${U20_SEAM_X - 4} L${U20_SEAM_X + 4} 150 L${U20_SEAM_X - 6} 130 Z`} />
      <path className='tb-u20-move' d='M112 150 H172' markerEnd='url(#tb-u20-vl-head)' />
      <path className='tb-u20-move' d='M262 150 H226' markerEnd='url(#tb-u20-vl-head)' />

      <DiagramRegion diagramId={ID} regionId='quiet-interior' props={props} hit={{ x: 14, y: 84, width: 84, height: 62 }}>
        <path className='tb-u20-tuft' d='M24 110 l3 -7 l3 7 M44 110 l3 -7 l3 7 M70 110 l3 -7 l3 7 M88 110 l3 -7 l3 7' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='boundary' props={props} hit={{ x: 168, y: 40, width: 64, height: 68 }}>
        <path className='tb-u20-magma-line' d={`M${U20_SEAM_X - 4} 200 L${U20_SEAM_X - 4} ${PLATE_BOTTOM} L${U20_SEAM_X + 4} 150 L${U20_SEAM_X - 6} 130 L${U20_SEAM_X} ${SURFACE_Y} V66`} />
        <path className='tb-u20-cone' d={`M${U20_SEAM_X - 40} ${SURFACE_Y} L${U20_SEAM_X - 6} 60 H${U20_SEAM_X + 6} L${U20_SEAM_X + 40} ${SURFACE_Y} Z`} />
        <path className='tb-u20-magma-line' d={`M${U20_SEAM_X} ${SURFACE_Y} V62`} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='hotspot' props={props} hit={{ x: 258, y: 40, width: 64, height: 68 }}>
        <ellipse className='tb-u20-plume' cx={U20_HOT_X} cy='204' rx='22' ry='13' />
        <path className='tb-u20-magma-line' d={`M${U20_HOT_X} 192 V${SURFACE_Y}`} />
        <path className='tb-u20-cone' d={`M${U20_HOT_X - 36} ${SURFACE_Y} L${U20_HOT_X - 6} 64 H${U20_HOT_X + 6} L${U20_HOT_X + 36} ${SURFACE_Y} Z`} />
        <path className='tb-u20-magma-line' d={`M${U20_HOT_X} ${SURFACE_Y} V66`} />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
