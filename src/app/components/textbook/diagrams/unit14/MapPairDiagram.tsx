'use client';

import type { ReactNode } from 'react';
import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u14-map-pair';

// Both panels are 166 × 156 and draw THE SAME land (same coastline path in
// panel units), so the pair shows one fictional area twice.
const PANEL = { width: 166, height: 156 };
const LEFT = { x: 8, y: 28 };
const RIGHT = { x: 186, y: 28 };
const LAND = 'M16 22 C60 8 120 12 150 26 C158 70 152 112 140 138 C100 148 50 146 20 136 C10 100 8 60 16 22 Z';
const BORDER = 'M84 14 C76 50 94 90 80 144';
const LEFT_OF_BORDER = 'M0 0 L84 0 L84 14 C76 50 94 90 80 144 L80 156 L0 156 Z';

function Panel({ at, children }: { at: { x: number; y: number }; children: ReactNode }) {
  return (
    <g transform={`translate(${at.x} ${at.y})`}>
      <rect className='tb-u14-sea tb-u14-panel' x='0' y='0' width={PANEL.width} height={PANEL.height} rx='10' />
      {children}
    </g>
  );
}

// Registry regions (exactly): physical, political. Left: the physical view —
// green land, mountains, a river to the sea. Right: the political view of the
// same land — two tinted countries, a dashed border, a capital star and town
// dots. No caption names the kind of map in hotspot mode (the labels and the
// lesson notes would answer the question).
export default function MapPairDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u14-pair-land'><path d={LAND} /></clipPath>
      </defs>
      <DiagramRegion diagramId={ID} regionId='physical' props={props} hit={{ x: 8, y: 28, width: 166, height: 156 }}>
        <Panel at={LEFT}>
          <path className='tb-u14-land' d={LAND} />
          <path className='tb-u14-mountain' d='M30 70 L48 40 L66 70 Z M52 70 L72 32 L92 70 Z' />
          <path className='tb-u14-snow' d='M44 47 L48 40 L52 47 Z M68 40 L72 32 L76 40 Z' />
          <path className='tb-u14-river tb-u14-river-thin' d='M88 72 C104 84 92 100 116 104 S140 112 152 116' />
          <ellipse className='tb-u14-water' cx='46' cy='112' rx='16' ry='9' />
        </Panel>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='political' props={props} hit={{ x: 186, y: 28, width: 166, height: 156 }}>
        <Panel at={RIGHT}>
          <path className='tb-u14-country-base' d={LAND} />
          <path className='tb-u14-country-right' d={LAND} />
          <path className='tb-u14-country-left' d={LEFT_OF_BORDER} clipPath='url(#tb-u14-pair-land)' />
          <path className='tb-u14-coast' d={LAND} />
          <path className='tb-u14-border' d={BORDER} />
          <polygon className='tb-u14-capital' points='46,50 49,59 58,59 51,64 54,73 46,68 38,73 41,64 34,59 43,59' />
          <circle className='tb-u14-city' cx='122' cy='60' r='5' />
          <circle className='tb-u14-city' cx='112' cy='112' r='5' />
          <circle className='tb-u14-city' cx='52' cy='112' r='5' />
        </Panel>
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
