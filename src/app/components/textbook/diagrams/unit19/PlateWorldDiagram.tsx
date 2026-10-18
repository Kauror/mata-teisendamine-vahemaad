'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import WORLD from '@/app/components/textbook/diagrams/data/world_continent_paths.json';
import { U19_DIAGRAM_LAYOUTS, U19_PLATE_DOT_RADIUS } from '@/app/components/textbook/diagrams/unit19/layouts';

const ID = 'u19-plate-world';
const MAP = { width: 360, height: 180 };
// The shared outlines are drawn on a 720 × 360 equirectangular grid.
const SCALE = MAP.width / WORLD.viewBox[2];

function Dot({ plate }: { plate: string }) {
  const marker = U19_DIAGRAM_LAYOUTS[ID].regions[plate].marker;
  return <circle className='tb-u19-plate-dot' cx={marker.x} cy={marker.y} r={U19_PLATE_DOT_RADIUS} />;
}

// Registry regions (exactly): pacific, north-america, south-america, eurasia,
// africa, australia, antarctica. The land is Natural Earth geography only
// (public domain, shared with the other world maps) — plate boundaries are
// NOT drawn and do not follow coastlines; each plate is one dot near its
// approximate centre. The Pacific plate is one region (its marker sits at the
// left edge; the same ocean continues at the right edge).
export default function PlateWorldDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u19-ocean' x='0' y='0' width={MAP.width} height={MAP.height} rx='6' />
      <g className='tb-u19-world' transform={`scale(${SCALE})`} aria-hidden='true'>
        {Object.entries(WORLD.paths).map(([name, d]) => <path key={name} className='tb-u19-continent' d={d} />)}
        {Object.entries(WORLD.supplementaryPaths).map(([name, d]) => <path key={name} className='tb-u19-continent' d={d} />)}
      </g>
      <DiagramRegion diagramId={ID} regionId='pacific' props={props} hit={{ x: 0, y: 72, width: 56, height: 56 }}>
        <Dot plate='pacific' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='north-america' props={props} hit={{ x: 58, y: 18, width: 56, height: 56 }}>
        <Dot plate='north-america' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='south-america' props={props} hit={{ x: 94, y: 80, width: 56, height: 56 }}>
        <Dot plate='south-america' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='eurasia' props={props} hit={{ x: 232, y: 6, width: 56, height: 56 }}>
        <Dot plate='eurasia' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='africa' props={props} hit={{ x: 172, y: 60, width: 56, height: 56 }}>
        <Dot plate='africa' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='australia' props={props} hit={{ x: 290, y: 90, width: 56, height: 56 }}>
        <Dot plate='australia' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='antarctica' props={props} hit={{ x: 180, y: 150, width: 56, height: 56 }}>
        <Dot plate='antarctica' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
