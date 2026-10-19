'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { Cloud, Rain } from '@/app/components/textbook/diagrams/unit22/shapes';

const ID = 'u22-prepared-home';

// A home made ready for bad weather. Registry regions (exactly): drain (the
// downpipe at the left corner into a ground drain), roof (the roof in good
// repair), high-storage (a cut-away room on the right: things on a high
// shelf, an arrow up from the floor), kit (a packed bag on the ground right
// of the house). These lower the damage; none promises the water stays out,
// and the bag is a family's, not a child's for leaving alone.
export default function PreparedHomeDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u22-ph-up' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u22-head-green' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u22-frame' x='0' y='0' width='360' height='280' rx='12' />
      <Cloud x={308} y={34} />
      <Rain x0={292} y={52} count={4} step={12} length={30} />
      <rect className='tb-u22-ground' x='0' y='232' width='360' height='48' />
      <rect className='tb-u22-wall' x='40' y='120' width='160' height='112' />
      <rect className='tb-u22-door' x='56' y='176' width='26' height='56' />
      <rect className='tb-u22-window' x='88' y='144' width='20' height='22' />

      <DiagramRegion diagramId={ID} regionId='roof' props={props} hit={{ x: 34, y: 62, width: 172, height: 56 }}>
        <path className='tb-u22-roof' d='M28 122 L120 60 L212 122 Z' />
        <path className='tb-u22-roof-line' d='M58 108 H182 M82 92 H158 M104 77 H136' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='drain' props={props} hit={{ x: 4, y: 160, width: 56, height: 70 }}>
        <path className='tb-u22-pipe' d='M22 121 H42 M30 122 V224 Q30 231 22 231' />
        <rect className='tb-u22-grate' x='8' y='229' width='26' height='7' rx='2' />
        <path className='tb-u22-grate-bar' d='M14 229 V236 M21 229 V236 M28 229 V236' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='high-storage' props={props} hit={{ x: 112, y: 124, width: 88, height: 104 }}>
        <rect className='tb-u22-room' x='116' y='128' width='80' height='100' />
        <rect className='tb-u22-shelf' x='122' y='152' width='68' height='5' />
        <rect className='tb-u22-box' x='128' y='132' width='22' height='20' />
        <rect className='tb-u22-box-alt' x='156' y='137' width='18' height='15' />
        <path className='tb-u22-lift' d='M182 218 V166' markerEnd='url(#tb-u22-ph-up)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='kit' props={props} hit={{ x: 226, y: 184, width: 128, height: 64 }}>
        <rect className='tb-u22-bottle' x='298' y='194' width='9' height='16' rx='3' />
        <rect className='tb-u22-lamp' x='282' y='198' width='8' height='12' rx='2' />
        <path className='tb-u22-bag-handle' d='M260 208 Q281 186 302 208' />
        <rect className='tb-u22-bag' x='248' y='206' width='68' height='40' rx='8' />
        <path className='tb-u22-bag-line' d='M248 220 H316 M276 220 V228 H288 V220' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
