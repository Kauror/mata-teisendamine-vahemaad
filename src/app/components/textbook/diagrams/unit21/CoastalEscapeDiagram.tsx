'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-coastal-escape';

// A made-up coast in profile, not a real evacuation map: sea at the left, a
// low beach, land rising inland to a hill. Registry regions (exactly):
// high-ground (the hilltop, upper right), inland-route (the green arrow and
// the evacuation sign, centre), beach (the low sand by the water, lower left).
export default function CoastalEscapeDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u21-ce-green' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='4' markerHeight='4' orient='auto-start-reverse'>
          <path className='tb-u21-head-green' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='220' rx='12' />
      <path className='tb-u21-land' d='M4 176 L70 166 C100 154 128 148 150 146 C190 140 214 110 244 92 C274 74 304 62 356 58 V216 H4 Z' />
      <path className='tb-u21-water' d='M4 152 H96 L80 216 H4 Z' />
      <path className='tb-u21-wave-line' d='M8 156 Q18 150 28 156 T48 156 T68 156 T88 156' />

      <DiagramRegion diagramId={ID} regionId='beach' props={props} hit={{ x: 44, y: 150, width: 104, height: 64 }}>
        <path className='tb-u21-sand' d='M84 160 C106 152 130 147 154 146 L154 156 C132 157 110 162 90 172 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='high-ground' props={props} hit={{ x: 262, y: 4, width: 94, height: 70 }}>
        <rect className='tb-u21-trunk' x='336' y='40' width='4' height='18' />
        <circle className='tb-u21-tree' cx='338' cy='36' r='10' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='inland-route' props={props} hit={{ x: 160, y: 82, width: 92, height: 68 }}>
        <path className='tb-u21-route' d='M122 142 C160 138 196 118 226 98 S290 66 316 62' markerEnd='url(#tb-u21-ce-green)' />
        <path className='tb-u21-post' d='M170 140 V118' />
        <rect className='tb-u21-sign' x='157' y='104' width='26' height='15' rx='2' />
        <path className='tb-u21-sign-arrow' d='M162 115 L176 107 M170 106 L176 107 L174 113' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
