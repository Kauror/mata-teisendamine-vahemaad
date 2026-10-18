'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import WORLD from '@/app/components/textbook/diagrams/data/world_continent_paths.json';

const ID = 'u19-continental-drift';
const TODAY = { x: 190, y: 96, width: 160 };
const SCALE = TODAY.width / WORLD.viewBox[2];

// A made-up outline of one big joined landmass — the idea of Pangaea, NOT a
// reconstruction of where the continents really were. The dashed lines show
// roughly where it later broke apart.
const PANGAEA = 'M52 70 C74 56 112 58 134 72 C152 84 150 108 140 124 C150 142 140 166 118 176 C96 186 66 182 50 166 C34 150 40 128 32 112 C26 94 36 80 52 70 Z';
const RIFTS = 'M88 62 C84 92 98 112 92 140 C88 158 96 172 92 182 M92 120 C110 118 128 126 146 120 M40 132 C56 140 74 138 92 140';

// Registry regions (exactly): pangaea (left), today (right). Optional reading
// (textbook p 73 "Lisa"); no question uses this picture.
export default function ContinentalDriftDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='pangaea' props={props} hit={{ x: 10, y: 52, width: 160, height: 176 }}>
        <rect className='tb-u19-ocean' x='6' y='48' width='168' height='184' rx='10' />
        <path className='tb-u19-continent' d={PANGAEA} />
        <path className='tb-u19-rift' d={RIFTS} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='today' props={props} hit={{ x: 190, y: 52, width: 160, height: 176 }}>
        <rect className='tb-u19-ocean' x='186' y='48' width='168' height='184' rx='10' />
        <g transform={`translate(${TODAY.x} ${TODAY.y}) scale(${SCALE})`}>
          {Object.entries(WORLD.paths).map(([name, d]) => <path key={name} className='tb-u19-continent' d={d} />)}
        </g>
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
