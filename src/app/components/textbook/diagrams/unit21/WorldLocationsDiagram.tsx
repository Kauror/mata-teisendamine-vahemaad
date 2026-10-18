'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import WORLD from '@/app/components/textbook/diagrams/data/world_continent_paths.json';

const ID = 'u21-world-locations';

// The shared Natural Earth outlines (equirectangular, 720 × 360) drawn at half
// size: one unit per degree, x = 180 + longitude, y = MAP_TOP + 90 − latitude.
const MAP_TOP = 6;
const at = (longitude: number, latitude: number) => ({ x: 180 + longitude, y: MAP_TOP + 90 - latitude });

// Illustrative points for the AREAS the lesson names — not exact faults, and no
// coastline here is a plate boundary (none is drawn).
export const U21_WORLD_POINTS = {
  japan: at(138, 36),
  iceland: at(-19, 65),
  chile: at(-71, -33),
  estonia: at(25, 58.7)
} as const;

function Point({ id }: { id: keyof typeof U21_WORLD_POINTS }) {
  const point = U21_WORLD_POINTS[id];
  return (
    <>
      <circle className='tb-u21-place-ring' cx={point.x} cy={point.y} r='8' />
      <circle className='tb-u21-place' cx={point.x} cy={point.y} r='4' />
    </>
  );
}

// Registry regions (exactly): japan (upper right), iceland (top, left of
// centre), chile (lower left), estonia (top, right of centre). Every point has
// the same symbol (a different one for the calmer Estonia would answer the
// question about it); only the letters tell them apart.
export default function WorldLocationsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='196' rx='12' />
      <rect className='tb-u21-ocean' x='0' y={MAP_TOP} width='360' height='180' />
      <g transform={`translate(0 ${MAP_TOP}) scale(0.5)`}>
        {Object.entries(WORLD.paths).map(([name, d]) => <path key={name} className='tb-u21-continent' d={d} />)}
        <path className='tb-u21-continent' d={WORLD.supplementaryPaths['oceania-islands']} />
      </g>

      <DiagramRegion diagramId={ID} regionId='japan' props={props} hit={{ x: 290, y: 32, width: 60, height: 58 }}>
        <Point id='japan' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='iceland' props={props} hit={{ x: 112, y: 4, width: 58, height: 56 }}>
        <Point id='iceland' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='chile' props={props} hit={{ x: 80, y: 100, width: 60, height: 60 }}>
        <Point id='chile' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='estonia' props={props} hit={{ x: 176, y: 8, width: 58, height: 58 }}>
        <Point id='estonia' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
