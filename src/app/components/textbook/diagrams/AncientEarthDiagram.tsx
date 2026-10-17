'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u10-ancient-earth';

// One elephant seen from the side, facing right, standing with its feet at
// (x, feetY): body, head, trunk and four legs. Original, stylised shape.
function Elephant({ x, feetY }: { x: number; feetY: number }) {
  const top = feetY - 22;
  return (
    <g className='tb-diagram-elephant'>
      <rect x={x - 3} y={feetY - 9} width='4' height='9' rx='1.5' />
      <rect x={x + 9} y={feetY - 9} width='4' height='9' rx='1.5' />
      <ellipse cx={x + 5} cy={top + 8} rx='11' ry='8' />
      <circle cx={x + 17} cy={top + 5} r='6' />
      <path d={`M${x + 21} ${top + 7} q4 6 1 12`} fill='none' />
    </g>
  );
}

// Registry regions (exactly): flat-disk, turtle, globe. Three stacked panels:
// a flat land disk floating in water (an ancient idea), a giant turtle carrying
// four elephants and a domed land disk (a myth), and the spherical Earth as
// known today. Lesson notes name which is which; hotspot mode hides them.
export default function AncientEarthDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u10-globe-clip'>
          <circle cx='180' cy='396' r='46' />
        </clipPath>
      </defs>
      <rect className='tb-diagram-panel' x='4' y='4' width='352' height='150' rx='14' />
      <rect className='tb-diagram-panel' x='4' y='164' width='352' height='150' rx='14' />
      <rect className='tb-diagram-panel' x='4' y='324' width='352' height='150' rx='14' />

      <DiagramRegion diagramId={ID} regionId='flat-disk' props={props} hit={{ x: 14, y: 30, width: 332, height: 122 }}>
        {/* The ocean around the disk, seen at an angle. */}
        <ellipse className='tb-diagram-sea' cx='180' cy='82' rx='150' ry='40' />
        <path className='tb-diagram-wave' d='M52 84 q8 -5 16 0 M290 80 q8 -5 16 0 M86 104 q8 -5 16 0 M250 106 q8 -5 16 0' />
        {/* The flat land disk: its edge (thickness) and its top. */}
        <ellipse className='tb-diagram-disk-side' cx='180' cy='84' rx='92' ry='22' />
        <ellipse className='tb-diagram-land' cx='180' cy='78' rx='92' ry='22' />
        <path className='tb-diagram-tree' d='M128 76 l7 -14 l7 14 z M214 72 l6 -12 l6 12 z M232 84 l6 -12 l6 12 z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='turtle' props={props} hit={{ x: 14, y: 190, width: 332, height: 122 }}>
        {/* The world sea the turtle swims in. */}
        <rect className='tb-diagram-sea' x='14' y='262' width='332' height='26' rx='10' />
        <path className='tb-diagram-wave' d='M40 274 q8 -5 16 0 M300 276 q8 -5 16 0' />
        {/* The giant turtle: flippers, head and the domed shell. */}
        <ellipse className='tb-diagram-turtle' cx='112' cy='268' rx='14' ry='6' />
        <ellipse className='tb-diagram-turtle' cx='248' cy='268' rx='14' ry='6' />
        <circle className='tb-diagram-turtle' cx='266' cy='258' r='10' />
        <path className='tb-diagram-turtle' d='M108 266 Q180 214 252 266 Z' />
        <path className='tb-diagram-turtle-pattern' d='M150 254 L162 242 L198 242 L210 254 M180 242 V264' />
        {/* Four elephants standing on the shell. */}
        <Elephant x={128} feetY={252} />
        <Elephant x={156} feetY={243} />
        <Elephant x={184} feetY={243} />
        <Elephant x={212} feetY={252} />
        {/* The domed land disk on the elephants' backs. */}
        <ellipse className='tb-diagram-disk-side' cx='180' cy='222' rx='84' ry='8' />
        <path className='tb-diagram-land' d='M96 220 Q180 176 264 220 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='globe' props={props} hit={{ x: 14, y: 350, width: 332, height: 122 }}>
        <circle className='tb-diagram-earth-sea' cx='180' cy='396' r='46' />
        <g clipPath='url(#tb-u10-globe-clip)'>
          <path className='tb-diagram-earth-land' d='M150 366 q14 -8 26 2 q6 10 -4 18 q-4 14 6 24 q-2 12 -14 8 q-10 -12 -8 -26 q-12 -8 -6 -26 z' />
          <path className='tb-diagram-earth-land' d='M196 360 q16 -2 22 10 q-4 8 -14 6 q-10 -4 -8 -16 z M200 412 q12 -4 16 6 q-6 10 -16 4 z' />
          {/* Light from the upper left and the shaded far side make it read as a ball. */}
          <circle className='tb-diagram-globe-light' cx='164' cy='380' r='22' />
          <circle className='tb-diagram-earth-shade' cx='222' cy='424' r='52' />
        </g>
        <circle className='tb-diagram-earth-edge' cx='180' cy='396' r='46' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
