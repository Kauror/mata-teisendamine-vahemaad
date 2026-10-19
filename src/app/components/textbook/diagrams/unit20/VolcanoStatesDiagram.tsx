'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U20_PANEL_WIDTH, U20_PANEL_X } from '@/app/components/textbook/diagrams/unit20/layouts';

const ID = 'u20-volcano-states';

const GROUND_Y = 170;

function Panel({ index }: { index: number }) {
  return <rect className='tb-u20-panel' x={U20_PANEL_X[index]} y='28' width={U20_PANEL_WIDTH} height='202' rx='10' />;
}

// Three INVENTED examples (p 76's simplified classes), told apart by what the
// picture shows, never by a word: 1) lava and an ash cloud coming out now;
// 2) a steep, bare young cone with dark streaks of earlier lava flows, nothing
// coming out; 3) a low, worn, rounded hill covered by forest, a lake in its old
// crater. A real volcano's state is not read off its shape (the lesson says so).
// Registry regions (exactly): erupting, dormant, extinct — one per panel.
export default function VolcanoStatesDiagram(props: DiagramProps) {
  const [first, second, third] = U20_PANEL_X;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u20-frame' x='0' y='0' width='360' height='236' rx='12' />

      <DiagramRegion diagramId={ID} regionId='erupting' props={props} hit={{ x: 10, y: 32, width: 104, height: 148 }}>
        <Panel index={0} />
        <path className='tb-u20-surface' d={`M${first + 6} ${GROUND_Y} H${first + 106}`} />
        <path className='tb-u20-ash' d={`M${first + 52} 102 L${first + 46} 76 H${first + 68} L${first + 60} 102 Z`} />
        <path className='tb-u20-ash' d={`M${first + 36} 76 C${first + 26} 72 ${first + 28} 56 ${first + 40} 56 C${first + 42} 42 ${first + 62} 40 ${first + 68} 50 C${first + 82} 46 ${first + 90} 60 ${first + 80} 70 C${first + 76} 80 ${first + 50} 82 ${first + 36} 76 Z`} />
        <path className='tb-u20-cone' d={`M${first + 18} ${GROUND_Y} L${first + 50} 104 H${first + 62} L${first + 94} ${GROUND_Y} Z`} />
        <path className='tb-u20-lava' d={`M${first + 56} 104 H${first + 63} L${first + 98} ${GROUND_Y} H${first + 84} Z`} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='dormant' props={props} hit={{ x: 128, y: 32, width: 104, height: 148 }}>
        <Panel index={1} />
        <path className='tb-u20-surface' d={`M${second + 6} ${GROUND_Y} H${second + 106}`} />
        <path className='tb-u20-cone' d={`M${second + 20} ${GROUND_Y} L${second + 50} 92 Q${second + 56} 98 ${second + 62} 92 L${second + 92} ${GROUND_Y} Z`} />
        <path className='tb-u20-old-flow' d={`M${second + 58} 98 L${second + 70} 130 L${second + 76} ${GROUND_Y - 4} M${second + 52} 100 L${second + 44} 136 L${second + 38} ${GROUND_Y - 6}`} />
        <path className='tb-u20-tuft' d={`M${second + 12} ${GROUND_Y} l3 -7 l3 7 M${second + 96} ${GROUND_Y} l3 -7 l3 7`} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='extinct' props={props} hit={{ x: 246, y: 32, width: 104, height: 148 }}>
        <Panel index={2} />
        <path className='tb-u20-surface' d={`M${third + 6} ${GROUND_Y} H${third + 106}`} />
        <path className='tb-u20-hill' d={`M${third + 8} ${GROUND_Y} C${third + 22} 134 ${third + 38} 126 ${third + 46} 126 H${third + 66} C${third + 74} 126 ${third + 90} 134 ${third + 104} ${GROUND_Y} Z`} />
        <ellipse className='tb-u20-lake' cx={third + 56} cy='127' rx='9' ry='3' />
        {[[24, 152], [40, 140], [74, 140], [90, 154], [56, 150], [32, 162], [80, 164]].map(([x, y]) => (
          <circle key={`${x}-${y}`} className='tb-u20-tree' cx={third + x} cy={y} r='5' />
        ))}
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
