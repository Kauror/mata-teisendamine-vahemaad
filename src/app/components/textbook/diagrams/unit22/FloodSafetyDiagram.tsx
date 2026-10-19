'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { House } from '@/app/components/textbook/diagrams/unit22/shapes';

const ID = 'u22-flood-safety';

// Safe and dangerous places in a flood (Päästeamet, Ole valmis!, WHO: keep
// out of floodwater, keep away from fallen wires, go to higher dry ground).
// Four cards, all the same colour, so no tint marks the safe ones. Registry
// regions (exactly): high-ground (top left: a high hill, water only at its
// foot), dry-shelter (top right: a building on dry ground), floodwater
// (bottom left: a road running under moving water, a half-sunk sign post),
// power-line (bottom right: a wire hanging from its pole into a puddle, a
// spark). The hill is clearly higher than the building, so "the dry higher
// place" has one answer.
export default function FloodSafetyDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u22-fs-blue' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u22-head-blue' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u22-frame' x='0' y='0' width='360' height='300' rx='12' />

      <DiagramRegion diagramId={ID} regionId='high-ground' props={props} hit={{ x: 6, y: 6, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='4' y='4' width='174' height='144' rx='10' />
        <path className='tb-u22-grass' d='M10 110 Q91 18 172 110 Z' />
        <path className='tb-u22-trunk-line' d='M91 64 V50' />
        <circle className='tb-u22-crown' cx='91' cy='44' r='9' />
        <rect className='tb-u22-flood-water' x='8' y='100' width='166' height='12' />
        <path className='tb-u22-wave' d='M12 103 q6 -3 12 0 t12 0 t12 0 M134 103 q6 -3 12 0 t12 0 t12 0' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='dry-shelter' props={props} hit={{ x: 184, y: 6, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='182' y='4' width='174' height='144' rx='10' />
        <rect className='tb-u22-ground' x='186' y='98' width='166' height='12' rx='3' />
        <House x={236} y={52} w={74} h={46} roof={22} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='floodwater' props={props} hit={{ x: 6, y: 154, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='4' y='152' width='174' height='144' rx='10' />
        <rect className='tb-u22-road' x='8' y='222' width='166' height='26' />
        <path className='tb-u22-road-mark' d='M12 235 h12 M34 235 h12 M140 235 h12 M162 235 h10' />
        <path className='tb-u22-post' d='M114 194 V246' />
        <rect className='tb-u22-sign' x='103' y='184' width='22' height='14' rx='2' />
        <path className='tb-u22-flood-water' d='M42 214 Q90 206 138 214 V258 H42 Z' />
        <path className='tb-u22-flow' d='M56 236 H100' markerEnd='url(#tb-u22-fs-blue)' />
        <path className='tb-u22-wave' d='M48 216 q6 -3 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='power-line' props={props} hit={{ x: 184, y: 154, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='182' y='152' width='174' height='144' rx='10' />
        <rect className='tb-u22-ground' x='186' y='252' width='166' height='8' rx='3' />
        <path className='tb-u22-pole' d='M236 254 V178 M224 184 H248 M330 254 V178 M318 184 H342' />
        <path className='tb-u22-wire' d='M318 184 Q304 192 292 194 M246 184 Q266 198 270 248' />
        <ellipse className='tb-u22-puddle' cx='278' cy='252' rx='28' ry='6' />
        <path className='tb-u22-spark' d='M270 238 l3 6 l6 -2 l-3 6 l6 3 l-7 1 l1 7 l-5 -5 l-5 5 l1 -7 l-7 -1 l6 -3 l-3 -6 l6 2 Z' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
