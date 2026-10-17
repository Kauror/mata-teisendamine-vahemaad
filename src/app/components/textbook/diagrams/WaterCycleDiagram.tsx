'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'demo-water-cycle';

// Registry regions (exactly): sun, sea, cloud, rain. Sun top-left, sea
// bottom-left with rising evaporation arrows, a cloud top-right and rain
// falling from it; a river on the land carries the water back to the sea.
export default function WaterCycleDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-wc-arrow' markerWidth='8' markerHeight='8' refX='4' refY='4' orient='auto'>
          <path d='M1 1 L7 4 L1 7 z' className='tb-diagram-arrowhead' />
        </marker>
      </defs>
      <rect className='tb-diagram-sky' x='0' y='0' width='340' height='240' />
      {/* Land and the river back to the sea (not answer regions). */}
      <path className='tb-diagram-land' d='M196 240 L196 200 Q240 178 280 176 Q314 174 340 160 L340 240 z' />
      <path className='tb-diagram-river' d='M326 176 Q290 196 252 200 Q224 204 206 214' markerEnd='url(#tb-wc-arrow)' />
      {/* Evaporation: water vapour rising from the sea towards the cloud. */}
      <g className='tb-diagram-flow' aria-hidden='true'>
        <path d='M112 180 q-6 -10 0 -20 q6 -10 0 -20 q-6 -10 0 -20' markerEnd='url(#tb-wc-arrow)' />
        <path d='M140 180 q-6 -10 0 -20 q6 -10 0 -20 q-6 -10 0 -20' markerEnd='url(#tb-wc-arrow)' />
        <path d='M168 180 q-6 -10 0 -20 q6 -10 0 -20 q-6 -10 0 -20' markerEnd='url(#tb-wc-arrow)' />
        <path d='M150 98 Q184 66 218 58' markerEnd='url(#tb-wc-arrow)' />
      </g>

      <DiagramRegion diagramId={ID} regionId='sun' props={props} hit={{ x: 18, y: 16, width: 68, height: 68 }}>
        <g className='tb-diagram-sun-rays'>
          <path d='M52 12 V20 M52 80 V88 M14 50 H22 M82 50 H90 M25 23 L31 29 M73 71 L79 77 M25 77 L31 71 M73 29 L79 23' />
        </g>
        <circle className='tb-diagram-sun' cx='52' cy='50' r='24' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='sea' props={props} hit={{ x: 0, y: 186, width: 196, height: 54 }}>
        <path className='tb-diagram-sea' d='M0 192 q16 -8 32 0 q16 8 32 0 q16 -8 32 0 q16 8 32 0 q16 -8 32 0 q16 8 36 0 L196 240 L0 240 z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='cloud' props={props} hit={{ x: 220, y: 18, width: 88, height: 62 }}>
        <g className='tb-diagram-cloud'>
          <circle cx='240' cy='58' r='18' />
          <circle cx='263' cy='44' r='22' />
          <circle cx='287' cy='58' r='18' />
          <rect x='240' y='52' width='47' height='24' />
        </g>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='rain' props={props} hit={{ x: 230, y: 84, width: 70, height: 72 }}>
        <g className='tb-diagram-rain'>
          <path d='M242 88 L236 104 M258 88 L252 104 M274 88 L268 104 M290 88 L284 104' />
          <path d='M240 114 L234 130 M256 114 L250 130 M272 114 L266 130 M288 114 L282 130' />
          <path d='M246 140 L240 156 M262 140 L256 156 M278 140 L272 156' />
        </g>
      </DiagramRegion>
    </DiagramSvg>
  );
}
