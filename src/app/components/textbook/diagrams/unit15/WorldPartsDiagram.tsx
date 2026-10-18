'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U15_WORLD_MAP } from '@/app/components/textbook/diagrams/unit15/layouts';
import { CONTINENT_ORDER, CONTINENT_PATHS, OCEANIA_ISLANDS_PATH } from '@/app/components/textbook/diagrams/unit15/worldMap';

const ID = 'u15-world-parts';

// Registry regions (exactly): america, europe, asia, africa,
// australia-oceania, antarctica. The land is one neutral colour (plus the
// Oceania islands) and NOT split into world parts: there is no single natural
// line between Europe and Asia, and country outlines would draw a wrong one,
// so the world parts are marked areas, not painted shapes. A short dashed
// pointer ties the America area to both American continents.
export default function WorldPartsDiagram(props: DiagramProps) {
  const scale = `scale(${U15_WORLD_MAP.scale})`;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u15-sea' x='0' y='0' width={U15_WORLD_MAP.width} height={U15_WORLD_MAP.height} />
      <g className='tb-u15-world-land' aria-hidden='true'>
        {CONTINENT_ORDER.map((id) => <path key={id} className='tb-u15-neutral-land' d={CONTINENT_PATHS[id]} fillRule='evenodd' transform={scale} />)}
        <path className='tb-u15-neutral-land' d={OCEANIA_ISLANDS_PATH} fillRule='evenodd' transform={scale} />
      </g>
      <DiagramRegion diagramId={ID} regionId='antarctica' props={props} hit={{ x: 100, y: 148, width: 180, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='america' props={props} hit={{ x: 30, y: 50, width: 90, height: 72 }}>
        <path className='tb-u15-pointer' d='M86 80 L66 54 M86 80 L108 104' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='europe' props={props} hit={{ x: 160, y: 14, width: 60, height: 58 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='asia' props={props} hit={{ x: 224, y: 14, width: 128, height: 66 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='africa' props={props} hit={{ x: 164, y: 76, width: 58, height: 58 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='australia-oceania' props={props} hit={{ x: 282, y: 92, width: 74, height: 58 }}>
        {null}
      </DiagramRegion>
    </DiagramSvg>
  );
}
