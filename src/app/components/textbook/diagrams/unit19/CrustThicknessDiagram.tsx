'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U19_CRUST_COLUMNS, U19_CRUST_KM, U19_CRUST_SURFACE_Y, U19_CRUST_UNITS_PER_KM } from '@/app/components/textbook/diagrams/unit19/layouts';

const ID = 'u19-crust-thickness';
const BAR_WIDTH = 56;
const SURFACE = U19_CRUST_SURFACE_Y;

// A bar hanging down from the surface, its length proportional to the km
// figure (7 : 40 : 80), the same on every screen.
function Bar({ column }: { column: keyof typeof U19_CRUST_KM }) {
  const x = U19_CRUST_COLUMNS[column] - BAR_WIDTH / 2;
  return <rect className={`tb-u19-bar tb-u19-bar-${column}`} x={x} y={SURFACE} width={BAR_WIDTH} height={U19_CRUST_KM[column] * U19_CRUST_UNITS_PER_KM} rx='3' />;
}

// Registry regions (exactly): oceanic (left), continental (middle), mountain
// (right). Above each bar what lies on top of that crust: sea, flat land, a
// mountain. The km figures are lesson notes (hidden in hotspot questions,
// where they would give the answer); the bar lengths stay.
export default function CrustThicknessDiagram(props: DiagramProps) {
  const ocean = U19_CRUST_COLUMNS.oceanic;
  const land = U19_CRUST_COLUMNS.continental;
  const peak = U19_CRUST_COLUMNS.mountain;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='oceanic' props={props} hit={{ x: 8, y: 12, width: 106, height: 250 }}>
        <rect className='tb-u19-water' x={ocean - 48} y={SURFACE - 22} width='96' height='22' />
        <path className='tb-u19-wave' d={`M${ocean - 40} ${SURFACE - 14} q8 -6 16 0 t16 0 t16 0 t16 0 t16 0`} />
        <Bar column='oceanic' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='continental' props={props} hit={{ x: 127, y: 12, width: 106, height: 250 }}>
        <rect className='tb-u19-ground' x={land - 48} y={SURFACE - 10} width='96' height='10' />
        <path className='tb-u19-tree' d={`M${land - 20} ${SURFACE - 10} l7 -18 l7 18 Z M${land + 12} ${SURFACE - 10} l6 -14 l6 14 Z`} />
        <Bar column='continental' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='mountain' props={props} hit={{ x: 246, y: 12, width: 106, height: 250 }}>
        <path className='tb-u19-peak' d={`M${peak - 48} ${SURFACE} L${peak - 6} ${SURFACE - 30} L${peak + 4} ${SURFACE - 22} L${peak + 48} ${SURFACE} Z`} />
        <path className='tb-u19-snow' d={`M${peak - 14} ${SURFACE - 24} L${peak - 6} ${SURFACE - 30} L${peak + 2} ${SURFACE - 24} Z`} />
        <Bar column='mountain' />
      </DiagramRegion>
      <line className='tb-u19-surface' x1='4' y1={SURFACE} x2='356' y2={SURFACE} />
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
