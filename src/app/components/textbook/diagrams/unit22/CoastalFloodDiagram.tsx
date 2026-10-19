'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u22-coastal-flood';

// The usual waterline and the storm-raised water surface; the low shore lies
// between them, the house stands on ground above both.
export const U22_USUAL_SEA_Y = 182;
export const U22_RAISED_SEA_Y = 164;
export const U22_HIGH_GROUND_Y = 128;

// A storm surge on a low coast (textbook p 83): wind from the sea piles the
// water up against the shore. Registry regions (exactly): sea (the sea,
// lower left), wind (three arrows over the sea pointing at the shore, upper
// left), low-shore (the low land now under the raised water, reeds and a
// fence sticking out, lower right), shore-house (a house on higher ground,
// upper right, dry). Not every wind floods every coast: the higher ground
// stays above the water.
export default function CoastalFloodDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u22-cf-grey' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u22-head-grey' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u22-frame' x='0' y='0' width='360' height='260' rx='12' />
      <path className='tb-u22-ground' d={`M0 250 Q90 246 150 ${U22_USUAL_SEA_Y} L232 176 L262 148 L280 ${U22_HIGH_GROUND_Y} H360 V260 H0 Z`} />
      <path className='tb-u22-sea' d={`M0 ${U22_RAISED_SEA_Y} H245 L232 176 L150 ${U22_USUAL_SEA_Y} Q90 246 0 250 Z`} />
      <path className='tb-u22-wave-light' d={`M6 ${U22_RAISED_SEA_Y + 3} q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} />
      <path className='tb-u22-old-level' d={`M0 ${U22_USUAL_SEA_Y} H150`} />

      <DiagramRegion diagramId={ID} regionId='wind' props={props} hit={{ x: 6, y: 44, width: 170, height: 96 }}>
        <path className='tb-u22-wind-arrow' d='M20 66 Q80 58 156 78' markerEnd='url(#tb-u22-cf-grey)' />
        <path className='tb-u22-wind-arrow' d='M12 100 Q84 92 170 112' markerEnd='url(#tb-u22-cf-grey)' />
        <path className='tb-u22-wind-arrow' d='M44 128 Q104 122 166 136' markerEnd='url(#tb-u22-cf-grey)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='sea' props={props} hit={{ x: 6, y: 186, width: 136, height: 60 }}>
        <path className='tb-u22-current' d='M60 216 q12 -6 24 0 t24 0 M84 236 q10 -5 20 0 t20 0' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='low-shore' props={props} hit={{ x: 150, y: 168, width: 92, height: 64 }}>
        <path className='tb-u22-old-ground' d={`M150 ${U22_USUAL_SEA_Y} L232 176 L245 ${U22_RAISED_SEA_Y}`} />
        <path className='tb-u22-reed' d='M168 178 l3 -18 l3 18 M180 177 l2 -14 l2 14 M196 175 l3 -17 l3 17' />
        <path className='tb-u22-fence' d='M214 176 V150 M230 175 V148 M210 156 H234' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='shore-house' props={props} hit={{ x: 258, y: 56, width: 96, height: 72 }}>
        <rect className='tb-u22-wall' x='292' y='98' width='48' height={U22_HIGH_GROUND_Y - 98} />
        <path className='tb-u22-roof' d='M286 100 L316 78 L346 100 Z' />
        <rect className='tb-u22-door' x='300' y='110' width='11' height={U22_HIGH_GROUND_Y - 110} />
        <rect className='tb-u22-window' x='320' y='106' width='12' height='10' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
