'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { AREA_INSET, AREA_PANEL } from '@/app/components/textbook/diagrams/unit13/geometry';

const ID = 'u13-area-detail';
const [AX, BX, CX] = AREA_PANEL.xs;
const TOP = AREA_PANEL.y;

// A five-pointed star (a symbolic capital on a very small-scale map).
function starPoints(cx: number, cy: number, outer: number, inner: number) {
  return Array.from({ length: 10 }, (_, index) => {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    return `${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`;
  }).join(' ');
}

// The dashed box that marks, on a wider view, the area the next view shows.
function Inset({ cx, cy }: { cx: number; cy: number }) {
  return <rect className='tb-u13-inset' x={cx - AREA_INSET.width / 2} y={cy - AREA_INSET.height / 2} width={AREA_INSET.width} height={AREA_INSET.height} />;
}

function Frame({ x }: { x: number }) {
  return <rect className='tb-u13-thin' x={x} y={TOP} width={AREA_PANEL.width} height={AREA_PANEL.height} rx='4' />;
}

// Registry regions (exactly): large-area, regional, neighbourhood. Three
// invented mini-maps of the same size, left to right: a very large area (two
// big land masses, one star, nothing small), one island with a few towns and
// roads, and a few streets with buildings and a park. Each wider view marks
// with a dashed box the island or town the next view enlarges (8× smaller
// area side, same proportions). No words are drawn: in hotspot questions the
// amount of detail is the clue.
export default function AreaDetailDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        {AREA_PANEL.xs.map((x) => (
          <clipPath key={x} id={`tb-u13-area-clip-${x}`}>
            <rect x={x} y={TOP} width={AREA_PANEL.width} height={AREA_PANEL.height} rx='4' />
          </clipPath>
        ))}
      </defs>

      <DiagramRegion diagramId={ID} regionId='large-area' props={props} hit={{ x: 8, y: 36, width: 112, height: 140 }}>
        <g clipPath={`url(#tb-u13-area-clip-${AX})`}>
          <rect className='tb-u13-map-sea' x={AX} y={TOP} width={AREA_PANEL.width} height={AREA_PANEL.height} />
          <path className='tb-diagram-land' d='M14 52 q20 -14 44 -4 q16 8 10 26 q-4 14 8 24 q4 16 -14 18 q-20 4 -30 -10 q-14 -6 -18 -24 q-6 -18 0 -30 z' />
          <path className='tb-diagram-land' d='M78 120 q18 -10 34 2 q10 14 4 32 q-6 18 -26 20 q-18 -2 -20 -20 q-4 -22 8 -34 z' />
          <circle className='tb-diagram-land' cx='96' cy='62' r='4' />
          <Inset cx={96} cy={62} />
          <polygon className='tb-diagram-sun' points={starPoints(40, 80, 8, 3.4)} />
        </g>
        <Frame x={AX} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='regional' props={props} hit={{ x: 134, y: 36, width: 112, height: 140 }}>
        <g clipPath={`url(#tb-u13-area-clip-${BX})`}>
          <rect className='tb-u13-map-sea' x={BX} y={TOP} width={AREA_PANEL.width} height={AREA_PANEL.height} />
          <path className='tb-diagram-land' d='M146 66 q24 -22 58 -14 q30 6 34 34 q6 26 -6 48 q-14 22 -44 20 q-30 -2 -40 -26 q-12 -30 -2 -62 z' />
          <path className='tb-u13-small-road' d='M160 78 L200 100 L222 132 M200 100 L168 142' />
          <circle className='tb-u13-place' cx='160' cy='78' r='3.5' />
          <circle className='tb-u13-place' cx='200' cy='100' r='4' />
          <circle className='tb-u13-place' cx='222' cy='132' r='3.5' />
          <circle className='tb-u13-place' cx='168' cy='142' r='3.5' />
          <Inset cx={200} cy={100} />
        </g>
        <Frame x={BX} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='neighbourhood' props={props} hit={{ x: 260, y: 36, width: 112, height: 140 }}>
        <g clipPath={`url(#tb-u13-area-clip-${CX})`}>
          <rect className='tb-diagram-land' x={CX} y={TOP} width={AREA_PANEL.width} height={AREA_PANEL.height} />
          {/* Buildings in the blocks between the streets. */}
          <rect className='tb-diagram-rock' x='266' y='42' width='20' height='14' />
          <rect className='tb-diagram-rock' x='266' y='62' width='20' height='12' />
          <rect className='tb-diagram-rock' x='298' y='42' width='12' height='32' />
          <rect className='tb-diagram-rock' x='316' y='42' width='22' height='14' />
          <rect className='tb-diagram-rock' x='348' y='42' width='18' height='32' />
          <rect className='tb-diagram-rock' x='266' y='92' width='20' height='30' />
          <rect className='tb-diagram-rock' x='298' y='92' width='40' height='12' />
          <rect className='tb-diagram-rock' x='298' y='110' width='20' height='12' />
          <rect className='tb-diagram-rock' x='348' y='92' width='18' height='12' />
          <rect className='tb-diagram-rock' x='348' y='110' width='18' height='12' />
          <rect className='tb-diagram-rock' x='266' y='140' width='20' height='30' />
          {/* The park with its trees. */}
          <circle className='tb-diagram-tree' cx='306' cy='148' r='5' />
          <circle className='tb-diagram-tree' cx='322' cy='160' r='5' />
          <circle className='tb-diagram-tree' cx='338' cy='146' r='5' />
          <circle className='tb-diagram-tree' cx='356' cy='162' r='5' />
          <path className='tb-u13-street' d='M260 83 H372 M260 131 H372 M292 36 V176 M342 36 V131' />
        </g>
        <Frame x={CX} />
      </DiagramRegion>
    </DiagramSvg>
  );
}
