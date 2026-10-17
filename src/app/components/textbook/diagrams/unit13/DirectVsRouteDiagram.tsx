'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { ROUTE_FROM, ROUTE_PATH, ROUTE_TO } from '@/app/components/textbook/diagrams/unit13/geometry';

const ID = 'u13-direct-vs-route';
const CLOCK = { x: 348, y: 216, r: 20 };

// Registry regions (exactly): direct, road, clock. Two invented places on one
// level: a solid straight line between them (linnulennuline vahemaa) and a
// dashed road that bows downwards between exactly the same two points and is
// longer (geometry.ts computes and the test checks it). A separate clock at
// the bottom right stands for travel time; the picture predicts no time and
// no fixed road-to-line ratio. The tap areas cover the middle parts of the
// lines, so they never overlap near the shared endpoints.
export default function DirectVsRouteDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='road' props={props} hit={{ x: 125, y: 135, width: 150, height: 78 }}>
        <path className='tb-u13-road' d={ROUTE_PATH} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='direct' props={props} hit={{ x: 120, y: 60, width: 160, height: 60 }}>
        <line className='tb-u13-line' x1={ROUTE_FROM.x} y1={ROUTE_FROM.y} x2={ROUTE_TO.x} y2={ROUTE_TO.y} />
      </DiagramRegion>

      <circle className='tb-u13-place' cx={ROUTE_FROM.x} cy={ROUTE_FROM.y} r='8' />
      <circle className='tb-u13-place' cx={ROUTE_TO.x} cy={ROUTE_TO.y} r='8' />

      <DiagramRegion diagramId={ID} regionId='clock' props={props} hit={{ x: 312, y: 180, width: 64, height: 64 }}>
        <circle className='tb-u13-paper' cx={CLOCK.x} cy={CLOCK.y} r={CLOCK.r} />
        <path className='tb-u13-thin' d={`M${CLOCK.x} ${CLOCK.y - CLOCK.r + 3} V${CLOCK.y - CLOCK.r + 6} M${CLOCK.x + CLOCK.r - 3} ${CLOCK.y} H${CLOCK.x + CLOCK.r - 6} M${CLOCK.x} ${CLOCK.y + CLOCK.r - 3} V${CLOCK.y + CLOCK.r - 6} M${CLOCK.x - CLOCK.r + 3} ${CLOCK.y} H${CLOCK.x - CLOCK.r + 6}`} />
        <path className='tb-u13-line' d={`M${CLOCK.x} ${CLOCK.y} V${CLOCK.y - 13} M${CLOCK.x} ${CLOCK.y} L${CLOCK.x + 9} ${CLOCK.y + 5}`} />
      </DiagramRegion>
    </DiagramSvg>
  );
}
