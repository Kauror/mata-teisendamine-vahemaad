'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u16-baltic-connection';

// A double-headed arrow in the 24-unit gap below `top`: water can move both
// ways. Left of centre (inside every box's width) so the lesson note fits beside it.
const ARROW_X = 130;
function BothWays({ top }: { top: number }) {
  const x = ARROW_X;
  return (
    <g className='tb-u16-link'>
      <path className='tb-u16-link-line' d={`M${x} ${top + 6} V${top + 18}`} />
      <path className='tb-u16-link-head' d={`M${x - 6} ${top + 8} L${x} ${top + 1} L${x + 6} ${top + 8} Z M${x - 6} ${top + 16} L${x} ${top + 23} L${x + 6} ${top + 16} Z`} />
    </g>
  );
}

// Registry regions (exactly), top to bottom: baltic, straits, north-sea,
// atlantic. A topological chain, NOT a coastline map, a route or a current:
// boxes joined by two-way arrows. Box widths only hint at size (the straits
// are narrow, the ocean is the biggest); nothing is to scale. Each box is
// also its region's tap area.
export default function BalticConnectionDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='baltic' props={props} hit={{ x: 80, y: 2, width: 200, height: 56 }}>
        <rect className='tb-u16-box tb-u16-box-sea' x='80' y='2' width='200' height='56' rx='12' />
      </DiagramRegion>
      <BothWays top={58} />
      <DiagramRegion diagramId={ID} regionId='straits' props={props} hit={{ x: 100, y: 82, width: 160, height: 56 }}>
        <rect className='tb-u16-box tb-u16-box-strait' x='100' y='82' width='160' height='56' rx='12' />
      </DiagramRegion>
      <BothWays top={138} />
      <DiagramRegion diagramId={ID} regionId='north-sea' props={props} hit={{ x: 55, y: 162, width: 250, height: 56 }}>
        <rect className='tb-u16-box tb-u16-box-sea' x='55' y='162' width='250' height='56' rx='12' />
      </DiagramRegion>
      <BothWays top={218} />
      <DiagramRegion diagramId={ID} regionId='atlantic' props={props} hit={{ x: 15, y: 242, width: 330, height: 56 }}>
        <rect className='tb-u16-box tb-u16-box-ocean' x='15' y='242' width='330' height='56' rx='12' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
