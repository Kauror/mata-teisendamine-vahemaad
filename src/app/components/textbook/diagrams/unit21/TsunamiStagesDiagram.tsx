'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-tsunami-stages';

// Registry regions (exactly), one per panel, left to right: seafloor (the
// sudden step in the seabed pushing the water up), open-ocean (a long, LOW
// bulge on deep water — a tsunami there can pass a ship almost unnoticed),
// coast (the raised water running up onto the land as a fast flood, not a
// breaking wall). The step captions are notes: they name the answers.
export default function TsunamiStagesDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u21-ts-red' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u21-head-red' d='M0 0 L10 5 L0 10 Z' />
        </marker>
        <marker id='tb-u21-ts-blue' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u21-head-blue' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='236' rx='12' />

      <DiagramRegion diagramId={ID} regionId='seafloor' props={props} hit={{ x: 10, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='6' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-water' d='M6 74 Q30 70 52 74 Q72 62 92 74 T118 74 V160 H6 Z' />
        <path className='tb-u21-seabed' d='M6 160 H66 V146 H118 V176 H6 Z' />
        <path className='tb-u21-fault' d='M66 146 V176' />
        <path className='tb-u21-stress' d='M78 140 V110' markerEnd='url(#tb-u21-ts-red)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='open-ocean' props={props} hit={{ x: 128, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='124' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-water' d='M124 76 C146 76 160 64 180 64 C200 64 214 76 236 76 V164 H124 Z' />
        <path className='tb-u21-seabed' d='M124 164 H236 V176 H124 Z' />
        <path className='tb-u21-boat' d='M136 72 H158 L154 78 H140 Z' />
        <path className='tb-u21-flow' d='M196 96 H226' markerEnd='url(#tb-u21-ts-blue)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='coast' props={props} hit={{ x: 246, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='242' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-shore' d='M242 176 L354 96 V176 Z' />
        <path className='tb-u21-water' d='M242 122 C262 114 290 112 314 124 L242 176 Z' />
        <path className='tb-u21-old-level' d='M242 150 H278' />
        <path className='tb-u21-flow' d='M292 112 L322 100' markerEnd='url(#tb-u21-ts-blue)' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
