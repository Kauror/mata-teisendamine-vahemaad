'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u16-land-water';

// The bar runs x 16–344 (328 units): land 16–111 (95 units ≈ 29 %), water
// 111–344 (233 units ≈ 71 %). Exported for the share test.
export const U16_BAR = { left: 16, split: 111, right: 344, top: 50, bottom: 112 } as const;

// Registry regions (exactly): land (left, shorter), water (right, longer).
// A share of the whole surface, NOT a map: it says nothing about where land
// and water lie. The rounded percentages are lesson notes, hidden in a
// hotspot question.
export default function LandWaterDiagram(props: DiagramProps) {
  const bar = U16_BAR;
  const height = bar.bottom - bar.top;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <path className='tb-u16-bracket' d={`M${bar.left} 46 V40 H${bar.right} V46`} />
      <DiagramRegion diagramId={ID} regionId='land' props={props} hit={{ x: 16, y: 44, width: 92, height: 76 }}>
        <rect className='tb-u16-land' x={bar.left} y={bar.top} width={bar.split - bar.left} height={height} rx='6' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='water' props={props} hit={{ x: 114, y: 44, width: 230, height: 76 }}>
        <rect className='tb-u16-water' x={bar.split} y={bar.top} width={bar.right - bar.split} height={height} rx='6' />
      </DiagramRegion>
      <line className='tb-u16-split' x1={bar.split} y1={bar.top - 2} x2={bar.split} y2={bar.bottom + 2} />
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
