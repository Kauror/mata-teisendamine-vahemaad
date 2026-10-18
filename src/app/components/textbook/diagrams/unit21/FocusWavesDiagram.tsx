'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-focus-waves';

// The focus lies ON the slanted fault, deep in the rock; the epicentre is the
// point on the surface straight above it (the dotted vertical). Not to scale.
const FOCUS = { x: 175, y: 190 };
const SURFACE_Y = 72;

// Registry regions (exactly): focus (centre, low), epicenter (centre, top),
// waves (the dashed rings, lower right), fault (the slanted line, lower left).
// The rings are clipped to the rock: seismic waves travel through the ground.
export default function FocusWavesDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u21-fw-ground'><rect x='4' y={SURFACE_Y} width='352' height='186' /></clipPath>
      </defs>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='260' rx='12' />
      <rect className='tb-u21-rock' x='4' y={SURFACE_Y} width='352' height='184' />
      <path className='tb-u21-layer' d='M4 118 C90 112 200 124 356 116 M4 164 C100 158 220 170 356 162 M4 212 C110 206 230 218 356 210' />
      <rect className='tb-u21-grass' x='4' y='64' width='352' height='8' />

      <DiagramRegion diagramId={ID} regionId='fault' props={props} hit={{ x: 70, y: 200, width: 70, height: 56 }}>
        <path className='tb-u21-fault' d='M110 256 L290 72' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='waves' props={props} hit={{ x: 218, y: 180, width: 80, height: 64 }}>
        <g clipPath='url(#tb-u21-fw-ground)'>
          <circle className='tb-u21-wave' cx={FOCUS.x} cy={FOCUS.y} r='26' />
          <circle className='tb-u21-wave' cx={FOCUS.x} cy={FOCUS.y} r='50' />
          <circle className='tb-u21-wave' cx={FOCUS.x} cy={FOCUS.y} r='76' />
        </g>
      </DiagramRegion>

      <path className='tb-u21-plumb' d={`M${FOCUS.x} ${FOCUS.y - 8} V${SURFACE_Y - 2}`} />

      <DiagramRegion diagramId={ID} regionId='focus' props={props} hit={{ x: 147, y: 162, width: 56, height: 56 }}>
        <circle className='tb-u21-focus' cx={FOCUS.x} cy={FOCUS.y} r='7' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='epicenter' props={props} hit={{ x: 145, y: 14, width: 60, height: 62 }}>
        <circle className='tb-u21-epicenter' cx={FOCUS.x} cy={SURFACE_Y - 4} r='6' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
