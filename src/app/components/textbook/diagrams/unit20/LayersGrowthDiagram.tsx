'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U20_PANEL_WIDTH, U20_PANEL_X } from '@/app/components/textbook/diagrams/unit20/layouts';

const ID = 'u20-layers-growth';

const GROUND_Y = 170;

// The small first cone, drawn at a panel's x offset.
const cone = (x: number) => `M${x + 20} ${GROUND_Y} L${x + 50} 112 H${x + 62} L${x + 92} ${GROUND_Y} Z`;
// The lava on its right slope: hot in panel 1, the same shape solid in 2 and 3.
const flow = (x: number) => `M${x + 58} 112 H${x + 64} L${x + 96} ${GROUND_Y} H${x + 82} Z`;

function Panel({ index }: { index: number }) {
  return <rect className='tb-u20-panel' x={U20_PANEL_X[index]} y='28' width={U20_PANEL_WIDTH} height='202' rx='10' />;
}

// Three steps one after the other (p 75), the arrows give the order without
// words: 1) hot lava flows down the slope; 2) it has cooled into a dark solid
// layer; 3) the next eruption's material covers the old cone (glowing band),
// so the volcano is taller. The step numbers are notes (lessons only).
// Registry regions (exactly): fresh, cooled, new-layer — one per panel.
export default function LayersGrowthDiagram(props: DiagramProps) {
  const [first, second, third] = U20_PANEL_X;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u20-frame' x='0' y='0' width='360' height='236' rx='12' />

      <DiagramRegion diagramId={ID} regionId='fresh' props={props} hit={{ x: 10, y: 32, width: 104, height: 148 }}>
        <Panel index={0} />
        <path className='tb-u20-surface' d={`M${first + 6} ${GROUND_Y} H${first + 106}`} />
        <path className='tb-u20-cone' d={cone(first)} />
        <path className='tb-u20-lava' d={flow(first)} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='cooled' props={props} hit={{ x: 128, y: 32, width: 104, height: 148 }}>
        <Panel index={1} />
        <path className='tb-u20-surface' d={`M${second + 6} ${GROUND_Y} H${second + 106}`} />
        <path className='tb-u20-cone' d={cone(second)} />
        <path className='tb-u20-solid' d={flow(second)} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='new-layer' props={props} hit={{ x: 246, y: 32, width: 104, height: 148 }}>
        <Panel index={2} />
        <path className='tb-u20-surface' d={`M${third + 6} ${GROUND_Y} H${third + 106}`} />
        <path className='tb-u20-lava' d={`M${third + 8} ${GROUND_Y} L${third + 48} 96 H${third + 64} L${third + 106} ${GROUND_Y} Z`} />
        <path className='tb-u20-cone' d={cone(third)} />
        <path className='tb-u20-solid' d={flow(third)} />
      </DiagramRegion>

      <path className='tb-u20-step' d='M115 134 L127 140 L115 146 Z M233 134 L245 140 L233 146 Z' />
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
