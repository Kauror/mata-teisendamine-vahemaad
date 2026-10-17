'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { hemispherePath, parallelPath } from '@/app/components/textbook/diagrams/unit11/globeProjection';
import { PARALLEL_LATITUDE, PARALLELS_GLOBE } from '@/app/components/textbook/diagrams/unit11/layouts';

const ID = 'u11-equator-parallels';
const G = PARALLELS_GLOBE;

// Registry regions (exactly): equator, north-parallel, south-parallel,
// north-hemisphere, south-hemisphere. A globe seen from a little above the
// equator plane (orthographic projection, globeProjection.ts), so the lines
// are their true front halves: the thick red equator round the widest part,
// and the 40° N and 40° S parallels as thinner arcs running the same way and
// never meeting it. The visible northern and southern halves have different
// pale tints; each hemisphere region is a marked patch in its half. Line tap
// areas lie on the right, area tap areas on the left between the lines, so
// none overlaps another.
export default function EquatorParallelsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      {/* The tints are background, so a region's tap area (and its reveal highlight) lies above them. */}
      <g aria-hidden='true'>
        <path className='tb-diagram-tint-a' d={hemispherePath(G, 'north')} />
        <path className='tb-diagram-tint-b' d={hemispherePath(G, 'south')} />
        <circle className='tb-diagram-earth-edge' cx={G.cx} cy={G.cy} r={G.r} />
      </g>
      <DiagramRegion diagramId={ID} regionId='north-hemisphere' props={props} hit={{ x: 104, y: 88, width: 56, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='south-hemisphere' props={props} hit={{ x: 104, y: 150, width: 56, height: 55 }}>
        {null}
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='north-parallel' props={props} hit={{ x: 202, y: 50, width: 56, height: 56 }}>
        <path className='tb-diagram-grid-line' d={parallelPath(G, PARALLEL_LATITUDE)} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='south-parallel' props={props} hit={{ x: 202, y: 180, width: 56, height: 56 }}>
        <path className='tb-diagram-grid-line' d={parallelPath(G, -PARALLEL_LATITUDE)} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='equator' props={props} hit={{ x: 222, y: 116, width: 56, height: 56 }}>
        <path className='tb-diagram-key-line' d={parallelPath(G, 0)} />
      </DiagramRegion>
    </DiagramSvg>
  );
}
