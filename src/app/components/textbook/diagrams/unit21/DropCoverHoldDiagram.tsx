'use client';

import type { ReactNode } from 'react';
import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-drop-cover-hold';

// Four cards in reading order (2 × 2), each 172 × 150 with the floor at y 112
// in card units. Today's advice indoors (CDC/USGS): stay inside, DROP, take
// COVER under a sturdy table, HOLD ON until the shaking stops; keep away from
// windows. Never "run outside or to the basement" (the outdated textbook p 81).
function Card({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className='tb-u21-panel' x='0' y='0' width='172' height='150' rx='10' />
      <path className='tb-u21-floor' d='M10 112 H162' />
      {children}
    </g>
  );
}

function Table() {
  return (
    <>
      <rect className='tb-u21-table' x='40' y='64' width='96' height='9' rx='2' />
      <rect className='tb-u21-table' x='46' y='73' width='6' height='39' />
      <rect className='tb-u21-table' x='124' y='73' width='6' height='39' />
    </>
  );
}

// Registry regions (exactly): drop (card 1: down on hands and knees), cover
// (card 2: under the table, an arm over the head and neck), hold (card 3:
// under the table, a hand gripping the table leg), window (card 4: a cracking
// window with falling glass — the place to keep away from).
export default function DropCoverHoldDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='320' rx='12' />

      <DiagramRegion diagramId={ID} regionId='drop' props={props} hit={{ x: 10, y: 10, width: 164, height: 120 }}>
        <Card x={6} y={6}>
          <circle className='tb-u21-head' cx='58' cy='80' r='9' />
          <path className='tb-u21-person' d='M68 88 L104 94 M74 90 L72 112 M104 94 L112 112 H130' />
        </Card>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='cover' props={props} hit={{ x: 186, y: 10, width: 164, height: 120 }}>
        <Card x={182} y={6}>
          <Table />
          <circle className='tb-u21-head' cx='74' cy='94' r='8' />
          <path className='tb-u21-person' d='M82 98 Q100 94 104 110 M66 88 Q72 78 84 86 M86 100 L84 112' />
        </Card>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='hold' props={props} hit={{ x: 10, y: 168, width: 164, height: 120 }}>
        <Card x={6} y={164}>
          <Table />
          <circle className='tb-u21-head' cx='72' cy='94' r='8' />
          <path className='tb-u21-person' d='M80 98 Q98 94 102 110 M84 98 L121 90 M64 88 Q70 78 82 86' />
          <circle className='tb-u21-hand' cx='124' cy='90' r='4' />
        </Card>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='window' props={props} hit={{ x: 186, y: 168, width: 164, height: 120 }}>
        <Card x={182} y={164}>
          <rect className='tb-u21-glass' x='48' y='22' width='76' height='76' rx='3' />
          <path className='tb-u21-window-bar' d='M86 22 V98 M48 60 H124' />
          <path className='tb-u21-glass-crack' d='M64 28 L80 46 L70 56 L92 78 M104 34 L96 50' />
          <path className='tb-u21-shard' d='M60 110 L66 101 L70 110 Z M98 110 L103 103 L108 110 Z M82 96 L86 90 L89 97 Z' />
        </Card>
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
