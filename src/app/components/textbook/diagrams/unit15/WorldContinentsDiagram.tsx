'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U15_WORLD_MAP } from '@/app/components/textbook/diagrams/unit15/layouts';
import { CONTINENT_PATHS, type ContinentId } from '@/app/components/textbook/diagrams/unit15/worldMap';

const ID = 'u15-world-continents';

function Continent({ id }: { id: ContinentId }) {
  return <path className={`tb-u15-continent tb-u15-continent-${id}`} d={CONTINENT_PATHS[id]} fillRule='evenodd' transform={`scale(${U15_WORLD_MAP.scale})`} />;
}

// Registry regions (exactly): the six continents of the textbook, each drawn
// from its real outline (Eurasia is ONE shape) and tappable on the outline
// itself as well as on its tap area. Tap areas never overlap; Eurasia is drawn
// last, so where its coast reaches into a neighbouring tap area (Arabia,
// Indonesia) a tap on that coast still means Eurasia. Hotspot mode draws no
// name anywhere, only the letters A–F.
export default function WorldContinentsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u15-sea' x='0' y='0' width={U15_WORLD_MAP.width} height={U15_WORLD_MAP.height} />
      <DiagramRegion diagramId={ID} regionId='antarctica' props={props} hit={{ x: 100, y: 148, width: 180, height: 56 }}>
        <Continent id='antarctica' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='africa' props={props} hit={{ x: 168, y: 70, width: 58, height: 58 }}>
        <Continent id='africa' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='south-america' props={props} hit={{ x: 86, y: 84, width: 56, height: 60 }}>
        <Continent id='south-america' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='north-america' props={props} hit={{ x: 20, y: 16, width: 96, height: 60 }}>
        <Continent id='north-america' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='australia' props={props} hit={{ x: 282, y: 92, width: 64, height: 58 }}>
        <Continent id='australia' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='eurasia' props={props} hit={{ x: 236, y: 8, width: 116, height: 60 }}>
        <Continent id='eurasia' />
      </DiagramRegion>
    </DiagramSvg>
  );
}
