'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u20-magma-lava';

const GROUND_Y = 150;

// The same molten rock in two places: inside the Earth (magma: the pocket at
// the bottom and the channel up through the cone) and on the surface (lava: the
// flow down the right slope onto the ground). The colours are the same on
// purpose — the place, not the colour, gives the name. Registry regions
// (exactly): underground (bottom centre), surface (right), crust (left, low).
export default function MagmaLavaDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u20-frame' x='0' y='0' width='360' height='250' rx='12' />
      <rect className='tb-u20-ground' x='4' y={GROUND_Y} width='352' height='96' />
      <path className='tb-u20-layer' d='M4 172 C120 166 240 178 356 170 M4 196 C110 190 250 202 356 194' />
      <path className='tb-u20-cone' d='M112 150 L182 56 Q190 62 198 56 L268 150 Z' />
      <path className='tb-u20-surface' d={`M4 ${GROUND_Y} H356`} />

      <DiagramRegion diagramId={ID} regionId='crust' props={props} hit={{ x: 8, y: 160, width: 84, height: 76 }}>
        <path className='tb-u20-crack' d='M24 214 L40 204 L36 190 L52 182 M66 228 L74 212 L88 206' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='underground' props={props} hit={{ x: 130, y: 194, width: 120, height: 56 }}>
        <path className='tb-u20-magma' d='M185 210 L187 62 L193 62 L195 210 Z' />
        <ellipse className='tb-u20-magma' cx='190' cy='222' rx='56' ry='16' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='surface' props={props} hit={{ x: 262, y: 96, width: 92, height: 60 }}>
        <path className='tb-u20-lava' d='M192 60 C212 82 238 116 260 140 C280 146 320 145 352 146 V153 H254 C232 124 206 92 188 64 Z' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
