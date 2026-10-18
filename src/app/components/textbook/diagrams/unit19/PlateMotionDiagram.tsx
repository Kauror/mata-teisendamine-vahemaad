'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u19-plate-motion';

// One rigid plate: a thin crust band on top of the rigid uppermost mantle
// (together the lithosphere) — a plate is more than the crust alone.
function Plate({ x, width }: { x: number; width: number }) {
  return (
    <>
      <rect className='tb-u19-lithosphere' x={x} y='100' width={width} height='30' />
      <rect className='tb-u19-plate-crust' x={x} y='90' width={width} height='10' />
    </>
  );
}

// Registry regions (exactly): left-plate, right-plate, boundary, mantle.
// A schematic side view of ONE kind of boundary (the plates move apart and
// molten rock rises into the gap); other boundaries collide or slide past.
// The mantle is hot, mostly solid rock that flows very slowly (the dashed
// arrows) — not a sea of magma that the plates float on like boats.
export default function PlateMotionDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u19-arrow' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u19-arrowhead' d='M0 0 L10 5 L0 10 Z' />
        </marker>
        <marker id='tb-u19-flow-arrow' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='4' markerHeight='4' orient='auto-start-reverse'>
          <path className='tb-u19-flow-head' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <DiagramRegion diagramId={ID} regionId='mantle' props={props} hit={{ x: 10, y: 150, width: 340, height: 76 }}>
        <rect className='tb-u19-mantle-block' x='10' y='130' width='340' height='102' rx='4' />
        <path className='tb-u19-flow' d='M172 222 C150 196 110 150 40 146' markerEnd='url(#tb-u19-flow-arrow)' />
        <path className='tb-u19-flow' d='M188 222 C210 196 250 150 320 146' markerEnd='url(#tb-u19-flow-arrow)' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='left-plate' props={props} hit={{ x: 10, y: 60, width: 140, height: 70 }}>
        <Plate x={10} width={166} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='right-plate' props={props} hit={{ x: 210, y: 60, width: 140, height: 70 }}>
        <Plate x={184} width={166} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='boundary' props={props} hit={{ x: 152, y: 40, width: 56, height: 100 }}>
        <path className='tb-u19-rising' d='M172 132 L180 96 L188 132 Z' />
        <line className='tb-u19-boundary' x1='180' y1='72' x2='180' y2='130' />
      </DiagramRegion>
      <g className='tb-u19-arrows' aria-hidden='true'>
        <line className='tb-u19-move' x1='140' y1='50' x2='60' y2='50' markerEnd='url(#tb-u19-arrow)' />
        <line className='tb-u19-move' x1='220' y1='50' x2='300' y2='50' markerEnd='url(#tb-u19-arrow)' />
      </g>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
