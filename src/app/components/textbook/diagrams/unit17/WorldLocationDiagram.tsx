'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { CONTINENT_PATHS, OCEANIA_ISLANDS } from '@/app/components/textbook/diagrams/unit17/geometry';
import { WORLD_ESTONIA, WORLD_MAP, mapTransform, toPicture } from '@/app/components/textbook/diagrams/unit17/layouts';

const ID = 'u17-world-location';
const MAP = mapTransform(WORLD_MAP);
const ESTONIA_DOT = toPicture(WORLD_MAP, WORLD_ESTONIA);

// Registry regions (exactly): eurasia, africa, north-america, south-america,
// australia, antarctica — the textbook's SIX continents (Europe is a world
// region of Eurasia, not a continent). Equirectangular Natural Earth outlines
// at half scale. Eurasia is drawn first and the small continents last, so a
// tap on a small continent's own outline always picks it. In lessons Eurasia
// is tinted and a red dot marks Estonia (not to scale); in a hotspot question
// every continent looks alike and there is no dot. Oceania's islands are
// neutral background, not a seventh continent.
export default function WorldLocationDiagram(props: DiagramProps) {
  const land = (id: string) => (
    <g transform={MAP}>
      <path className={props.mode === 'lesson' && id === 'eurasia' ? 'tb-u17-land tb-u17-land-estonia' : 'tb-u17-land'} d={CONTINENT_PATHS[id]} />
    </g>
  );
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u17-sea' x='0' y='0' width='360' height='180' rx='8' />
      <g transform={MAP} aria-hidden='true' pointerEvents='none'>
        <path className='tb-u17-land' d={OCEANIA_ISLANDS} />
      </g>
      <DiagramRegion diagramId={ID} regionId='eurasia' props={props} hit={{ x: 220, y: 10, width: 120, height: 56 }}>
        {land('eurasia')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='antarctica' props={props} hit={{ x: 40, y: 124, width: 240, height: 56 }}>
        {land('antarctica')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='north-america' props={props} hit={{ x: 30, y: 10, width: 120, height: 56 }}>
        {land('north-america')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='south-america' props={props} hit={{ x: 98, y: 68, width: 56, height: 56 }}>
        {land('south-america')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='africa' props={props} hit={{ x: 163, y: 68, width: 56, height: 56 }}>
        {land('africa')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='australia' props={props} hit={{ x: 285, y: 92, width: 56, height: 56 }}>
        {land('australia')}
      </DiagramRegion>
      {props.mode !== 'hotspot' ? (
        <circle className='tb-u17-estonia-dot' cx={ESTONIA_DOT.x} cy={ESTONIA_DOT.y} r='4' aria-hidden='true' pointerEvents='none' />
      ) : null}
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
