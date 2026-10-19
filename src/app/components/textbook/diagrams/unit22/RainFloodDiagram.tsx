'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { Cloud, Rain } from '@/app/components/textbook/diagrams/unit22/shapes';

const ID = 'u22-rain-flood';

// The road surface: a grassy slope down to a level street, which dips on the
// right. Water collects in the dip up to WATER_Y.
export const U22_STREET_Y = 186;
export const U22_DIP_Y = 220;
export const U22_WATER_Y = 200;

// Rain that cannot soak in fast enough runs off and collects in a low place
// (textbook p 83; hard city surfaces after EPA). Registry regions (exactly):
// cloud (the rain cloud, top left), runoff (blue arrows of water running
// down the surface of the slope), drain (the curb drain in the street, its
// pipe below), flooded-road (the dip on the right, the road under water, a
// car in it up to its wheels). The drain is drawn working: the flood comes
// from more water than it can take, not from a blocked drain.
export default function RainFloodDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u22-rf-blue' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u22-head-blue' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u22-frame' x='0' y='0' width='360' height='260' rx='12' />
      <path className='tb-u22-ground' d={`M0 130 Q70 128 150 ${U22_STREET_Y} V260 H0 Z`} />
      <path className='tb-u22-soil' d={`M150 ${U22_STREET_Y} H232 L258 ${U22_DIP_Y} H346 L360 210 V260 H150 Z`} />
      <path className='tb-u22-pipe-under' d={`M206 ${U22_STREET_Y + 6} V238 H360`} />

      <DiagramRegion diagramId={ID} regionId='cloud' props={props} hit={{ x: 6, y: 6, width: 140, height: 90 }}>
        <Cloud x={80} y={38} scale={1.3} dark />
        <Rain x0={54} y={58} count={6} step={12} length={28} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='runoff' props={props} hit={{ x: 6, y: 100, width: 136, height: 84 }}>
        <path className='tb-u22-flow' d='M16 124 Q78 124 136 170' markerEnd='url(#tb-u22-rf-blue)' />
        <path className='tb-u22-flow' d='M58 138 Q96 146 124 172' markerEnd='url(#tb-u22-rf-blue)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='drain' props={props} hit={{ x: 160, y: 146, width: 70, height: 66 }}>
        <path className='tb-u22-road-top' d={`M150 ${U22_STREET_Y} H194 M218 ${U22_STREET_Y} H232`} />
        <rect className='tb-u22-grate' x='194' y={U22_STREET_Y - 2} width='24' height='7' rx='2' />
        <path className='tb-u22-grate-bar' d={`M200 ${U22_STREET_Y - 2} v7 M206 ${U22_STREET_Y - 2} v7 M212 ${U22_STREET_Y - 2} v7`} />
        <path className='tb-u22-flow-thin' d={`M172 ${U22_STREET_Y - 6} Q196 ${U22_STREET_Y - 8} 204 ${U22_STREET_Y + 10}`} markerEnd='url(#tb-u22-rf-blue)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='flooded-road' props={props} hit={{ x: 236, y: 176, width: 118, height: 62 }}>
        <path className='tb-u22-road-top' d={`M232 ${U22_STREET_Y} L258 ${U22_DIP_Y} H346 L360 210`} />
        <circle className='tb-u22-wheel' cx='296' cy='212' r='6' />
        <circle className='tb-u22-wheel' cx='320' cy='212' r='6' />
        <path className='tb-u22-car' d='M284 210 V198 Q284 194 288 194 L296 184 H318 L326 194 Q332 194 332 198 V210 Z' />
        <path className='tb-u22-flood-water' d={`M243 ${U22_WATER_Y} H360 V210 L346 ${U22_DIP_Y} H258 Z`} />
        <path className='tb-u22-wave' d={`M248 ${U22_WATER_Y + 2} q6 -3 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0`} />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
