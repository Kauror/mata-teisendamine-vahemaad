'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-tsunami-warnings';

// Registry regions (exactly), one card each, left to right:
// strong-shaking (a house by the sea with shake marks), water-change (the sea
// has pulled far back from its usual line, the dashed one), sea-roar (sound
// arcs over the waves). Any ONE of these is enough to head for high ground at
// once; the lesson text says so, the picture never suggests waiting for all.
export default function TsunamiWarningsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u21-tw-blue' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u21-head-blue' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='236' rx='12' />

      <DiagramRegion diagramId={ID} regionId='strong-shaking' props={props} hit={{ x: 10, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='6' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-water' d='M6 156 H40 V176 H6 Z' />
        <path className='tb-u21-shore' d='M36 150 H118 V176 H40 Z' />
        <path className='tb-u21-wall' d='M48 106 H92 V150 H48 Z' />
        <path className='tb-u21-roof' d='M42 108 L70 84 L98 108 Z' />
        <rect className='tb-u21-door' x='64' y='128' width='12' height='22' />
        <path className='tb-u21-shake' d='M30 92 L36 98 L30 104 L36 110 L30 116 M110 92 L104 98 L110 104 L104 110 L110 116' />
        <path className='tb-u21-crack' d='M62 150 L66 158 L60 166 L66 176' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='water-change' props={props} hit={{ x: 128, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='124' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-sand' d='M124 176 L236 112 V176 Z' />
        <path className='tb-u21-wet-sand' d='M145 164 L187 140' />
        <path className='tb-u21-water' d='M124 164 H145 L124 176 Z' />
        <path className='tb-u21-old-level' d='M124 140 H187' />
        <path className='tb-u21-flow' d='M184 128 L148 150' markerEnd='url(#tb-u21-tw-blue)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='sea-roar' props={props} hit={{ x: 246, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='242' y='28' width='112' height='202' rx='10' />
        <rect className='tb-u21-water' x='242' y='136' width='112' height='40' />
        <path className='tb-u21-wave-line' d='M246 142 Q256 136 266 142 T286 142 T306 142 T326 142 T346 142 M246 158 Q256 152 266 158 T286 158 T306 158 T326 158 T346 158' />
        <path className='tb-u21-sound' d='M282 118 Q298 104 314 118 M272 108 Q298 84 324 108 M262 98 Q298 64 334 98' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
