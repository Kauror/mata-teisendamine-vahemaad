'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { HEMI_LEFT, HEMI_RIGHT } from '@/app/components/textbook/diagrams/unit17/layouts';

const ID = 'u17-hemispheres';
const L = HEMI_LEFT;
const R = HEMI_RIGHT;

// Half of a disk as a closed path: the straight edge through the centre, the arc on `side`.
function half(disk: { cx: number; cy: number; r: number }, side: 'top' | 'bottom' | 'left' | 'right') {
  const { cx, cy, r } = disk;
  if (side === 'top') return `M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z`;
  if (side === 'bottom') return `M${cx - r} ${cy} A${r} ${r} 0 0 0 ${cx + r} ${cy} Z`;
  if (side === 'left') return `M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} Z`;
  return `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} Z`;
}

// Registry regions (exactly): north, south (left disk), west, east (right
// disk). Two separate schematics, never one: the EQUATOR (horizontal) splits
// the left disk into north and south, the PRIME MERIDIAN (vertical) splits the
// right one into west and east. In lessons the halves Estonia is in (north,
// east) are tinted; in a hotspot question all four halves look alike and the
// line names are hidden.
export default function HemispheresDiagram(props: DiagramProps) {
  const tint = (estonia: boolean) => (props.mode === 'lesson' && estonia ? 'tb-u17-half tb-u17-half-estonia' : 'tb-u17-half');
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='north' props={props} hit={{ x: 18, y: 33, width: 144, height: 72 }}>
        <path className={tint(true)} d={half(L, 'top')} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='south' props={props} hit={{ x: 18, y: 105, width: 144, height: 72 }}>
        <path className={tint(false)} d={half(L, 'bottom')} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='west' props={props} hit={{ x: 198, y: 33, width: 72, height: 144 }}>
        <path className={tint(false)} d={half(R, 'left')} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='east' props={props} hit={{ x: 270, y: 33, width: 72, height: 144 }}>
        <path className={tint(true)} d={half(R, 'right')} />
      </DiagramRegion>
      <g aria-hidden='true' pointerEvents='none'>
        <circle className='tb-u17-disk-edge' cx={L.cx} cy={L.cy} r={L.r} />
        <circle className='tb-u17-disk-edge' cx={R.cx} cy={R.cy} r={R.r} />
        <line className='tb-u17-dividing-line' x1={L.cx - L.r - 8} y1={L.cy} x2={L.cx + L.r + 8} y2={L.cy} />
        <line className='tb-u17-dividing-line' x1={R.cx} y1={R.cy - R.r - 6} x2={R.cx} y2={R.cy + R.r + 6} />
      </g>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
