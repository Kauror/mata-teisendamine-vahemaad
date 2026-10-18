'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u15-land-water';

// One bar standing for the whole surface of the Earth, cut into 100 equal
// cells: 29 land cells on the left, 71 water cells on the right (NASA's
// rounded ~29 % / ~71 %; the textbook says "about a third"). The cells let a
// child see that the left part is clearly the smaller one.
export const U15_BAR = { x: 18, y: 55, width: 324, height: 63, cells: 100, landCells: 29 } as const;
const CELL = U15_BAR.width / U15_BAR.cells;
const SPLIT = U15_BAR.x + U15_BAR.landCells * CELL;
const GRID = Array.from({ length: U15_BAR.cells - 1 }, (_, index) => index + 1)
  .filter((index) => index !== U15_BAR.landCells)
  .map((index) => `M${(U15_BAR.x + index * CELL).toFixed(2)} ${U15_BAR.y} V${U15_BAR.y + U15_BAR.height}`)
  .join(' ');

// Registry regions (exactly): land (left, smaller), water (right, larger).
export default function LandWaterDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='land' props={props} hit={{ x: 18, y: 26, width: 94, height: 100 }}>
        <rect className='tb-u15-bar-land' x={U15_BAR.x} y={U15_BAR.y} width={SPLIT - U15_BAR.x} height={U15_BAR.height} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='water' props={props} hit={{ x: 112, y: 26, width: 230, height: 100 }}>
        <rect className='tb-u15-bar-water' x={SPLIT} y={U15_BAR.y} width={U15_BAR.x + U15_BAR.width - SPLIT} height={U15_BAR.height} />
      </DiagramRegion>
      <path className='tb-u15-bar-grid' d={GRID} aria-hidden='true' />
      <path className='tb-u15-bar-split' d={`M${SPLIT.toFixed(2)} ${U15_BAR.y - 4} V${U15_BAR.y + U15_BAR.height + 4}`} aria-hidden='true' />
      <rect className='tb-u15-bar-frame' x={U15_BAR.x} y={U15_BAR.y} width={U15_BAR.width} height={U15_BAR.height} rx='3' aria-hidden='true' />
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
