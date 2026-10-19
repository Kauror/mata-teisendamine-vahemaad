'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u20-volcano-cutaway';

const GROUND_Y = 170;

// A cone volcano cut open (the textbook p 75 cutaway, redrawn): magma pocket
// under the ground, a narrow channel up to the dip at the top, a lava flow down
// the right slope and an ash cloud on a short column above the top. Registry
// regions (exactly): crater (top), conduit (inside the cone), chamber (under
// the ground), lava-flow (right slope), ash-cloud (above).
export default function VolcanoCutawayDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u20-frame' x='0' y='0' width='360' height='280' rx='12' />
      <rect className='tb-u20-ground' x='4' y={GROUND_Y} width='352' height='106' />
      <path className='tb-u20-layer' d='M4 196 C120 190 240 202 356 194 M4 222 C60 218 90 222 112 222 M250 222 C290 220 320 224 356 220' />
      <path className='tb-u20-cone' d='M60 170 L168 82 Q180 92 192 82 L300 170 Z' />
      <path className='tb-u20-cone-layer' d='M96 140 Q130 128 156 114 M206 114 Q232 128 266 142' />
      <path className='tb-u20-surface' d={`M4 ${GROUND_Y} H356`} />

      <DiagramRegion diagramId={ID} regionId='ash-cloud' props={props} hit={{ x: 176, y: 2, width: 112, height: 58 }}>
        <path className='tb-u20-ash' d='M184 70 C188 64 196 58 206 52 L216 56 C204 62 196 68 192 72 Z' />
        <path className='tb-u20-ash' d='M196 50 C186 46 186 30 200 28 C200 14 220 8 232 16 C242 6 266 10 268 24 C284 26 286 46 270 50 C260 58 236 56 228 52 C218 58 202 56 196 50 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='crater' props={props} hit={{ x: 150, y: 62, width: 60, height: 58 }}>
        <path className='tb-u20-crater' d='M164 82 Q180 100 196 82 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='conduit' props={props} hit={{ x: 152, y: 124, width: 56, height: 58 }}>
        <path className='tb-u20-magma' d='M175 232 L176 90 L184 90 L185 232 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='lava-flow' props={props} hit={{ x: 236, y: 100, width: 68, height: 62 }}>
        <path className='tb-u20-lava' d='M186 88 C210 104 238 128 262 148 C276 160 300 166 340 167 V172 H290 C266 166 246 150 228 134 C210 118 194 102 182 92 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='chamber' props={props} hit={{ x: 110, y: 220, width: 140, height: 58 }}>
        <ellipse className='tb-u20-magma' cx='180' cy='248' rx='66' ry='20' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
