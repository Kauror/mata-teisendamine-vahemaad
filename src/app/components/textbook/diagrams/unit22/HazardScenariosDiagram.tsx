'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { Cloud, House, Rain } from '@/app/components/textbook/diagrams/unit22/shapes';

const ID = 'u22-hazard-scenarios';

// Ordinary weather next to a natural disaster, four cards on a 2 × 2 grid.
// Registry regions (exactly): mild-rain (top left: a light cloud, a few thin
// drops, grass and a flower), flood (top right: heavy rain, a house in water
// up to its windows), sunny (bottom left: sun over a hill), storm-damage
// (bottom right: wind and a broken tree on a roof, no water, so it is not
// read as the flood). Both ordinary cards look calm and both disasters show
// damage, so the cards differ by what happens, not by colour alone.
export default function HazardScenariosDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u22-frame' x='0' y='0' width='360' height='300' rx='12' />

      <DiagramRegion diagramId={ID} regionId='mild-rain' props={props} hit={{ x: 6, y: 6, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='4' y='4' width='174' height='144' rx='10' />
        <Cloud x={104} y={34} scale={0.9} />
        <Rain x0={86} y={54} count={4} step={13} length={10} className='tb-u22-drizzle' />
        <rect className='tb-u22-grass' x='10' y='88' width='162' height='22' rx='6' />
        <path className='tb-u22-stem' d='M150 88 V74 M40 88 V78' />
        <circle className='tb-u22-flower' cx='150' cy='71' r='5' />
        <circle className='tb-u22-flower' cx='40' cy='76' r='4' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='flood' props={props} hit={{ x: 184, y: 6, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='182' y='4' width='174' height='144' rx='10' />
        <Cloud x={300} y={26} scale={0.9} dark />
        <Rain x0={278} y={42} count={6} step={9} length={16} />
        <House x={214} y={58} w={56} h={44} roof={18} />
        <path className='tb-u22-trunk-line' d='M330 104 V72' />
        <circle className='tb-u22-crown' cx='330' cy='64' r='13' />
        <rect className='tb-u22-flood-water' x='186' y='78' width='166' height='32' />
        <path className='tb-u22-wave' d='M190 82 q8 -4 16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0 t16 0' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='sunny' props={props} hit={{ x: 6, y: 154, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='4' y='152' width='174' height='144' rx='10' />
        <circle className='tb-u22-sun' cx='91' cy='190' r='16' />
        <path className='tb-u22-ray' d='M91 164 V158 M91 216 V222 M65 190 H59 M117 190 H123 M73 172 L68 167 M109 172 L114 167 M73 208 L68 213 M109 208 L114 213' />
        <path className='tb-u22-grass' d='M10 258 Q91 222 172 258 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='storm-damage' props={props} hit={{ x: 184, y: 154, width: 170, height: 140 }}>
        <rect className='tb-u22-panel' x='182' y='152' width='174' height='144' rx='10' />
        <Cloud x={254} y={178} scale={0.8} dark />
        <path className='tb-u22-wind' d='M190 200 q18 -6 36 0 t30 0 M196 214 q16 -6 32 0 t26 0 M300 176 q14 -5 28 0' />
        <rect className='tb-u22-grass' x='186' y='252' width='166' height='8' rx='3' />
        <House x={286} y={214} w={58} h={40} roof={16} />
        <path className='tb-u22-trunk-line' d='M240 254 V236' />
        <path className='tb-u22-trunk-line' d='M242 236 L296 206' />
        <ellipse className='tb-u22-crown' cx='306' cy='200' rx='18' ry='11' transform='rotate(-28 306 200)' />
        <path className='tb-u22-break' d='M236 236 l4 -6 l4 6 l4 -5' />
        <rect className='tb-u22-tile' x='334' y='186' width='9' height='5' transform='rotate(25 338 188)' />
        <rect className='tb-u22-tile' x='344' y='174' width='8' height='5' transform='rotate(-20 348 176)' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
