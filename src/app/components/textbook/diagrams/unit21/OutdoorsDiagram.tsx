'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-outdoors';

const WINDOWS = [0, 1, 2, 3].flatMap((row) => [0, 1, 2].map((column) => ({ x: 24 + column * 22, y: 46 + row * 26 })));

// Outdoors during the shaking: stay outside, get to an open place, away from
// buildings (falling glass and facade pieces), trees and power lines. Registry
// regions (exactly): open-area (the open lawn, centre), building (the facade,
// left, with a falling piece), power-lines (poles and wires, right).
export default function OutdoorsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='220' rx='12' />
      <rect className='tb-u21-land' x='4' y='150' width='352' height='66' />

      <DiagramRegion diagramId={ID} regionId='building' props={props} hit={{ x: 8, y: 26, width: 96, height: 136 }}>
        <rect className='tb-u21-building' x='16' y='34' width='76' height='120' />
        {WINDOWS.map((window) => <rect key={`${window.x}-${window.y}`} className='tb-u21-glass' x={window.x} y={window.y} width='16' height='18' />)}
        <path className='tb-u21-fall' d='M98 86 v10 M104 92 v10' />
        <rect className='tb-u21-debris' x='96' y='108' width='10' height='7' transform='rotate(20 101 111)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='open-area' props={props} hit={{ x: 116, y: 140, width: 128, height: 70 }}>
        <ellipse className='tb-u21-lawn' cx='180' cy='178' rx='56' ry='18' />
        <path className='tb-u21-tuft' d='M140 186 l3 -6 l3 6 M210 172 l3 -6 l3 6 M172 192 l3 -6 l3 6' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='power-lines' props={props} hit={{ x: 256, y: 30, width: 100, height: 132 }}>
        <path className='tb-u21-pole' d='M276 52 V156 M340 52 V156 M264 60 H288 M328 60 H352' />
        <path className='tb-u21-wire' d='M266 60 Q308 84 350 60 M286 60 Q308 76 330 60' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
