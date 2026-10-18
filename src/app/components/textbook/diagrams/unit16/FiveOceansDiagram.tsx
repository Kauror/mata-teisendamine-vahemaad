'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import world from '@/app/components/textbook/diagrams/data/world_continent_paths.json';
import { U16_MAP, U16_MAP_SCALE, U16_PACIFIC_TWIN } from '@/app/components/textbook/diagrams/unit16/layouts';

const ID = 'u16-five-oceans';

// Every continent outline plus the representative Oceania islands, as land.
export const U16_LAND_PATHS: readonly string[] = [...Object.values(world.paths), ...Object.values(world.supplementaryPaths)];

// Registry regions (exactly): pacific, atlantic, indian, arctic, southern.
// The real Natural Earth coastlines (public domain, generalised) on an
// equirectangular world map, North up, Americas on the left. The ocean is
// ONE continuous blue surface: no ocean boundary lines (they are partly a
// matter of convention, especially around Antarctica). The Pacific shows at
// both edges of the flat map; both of its tap areas and markers belong to the
// one `pacific` region, i.e. the one button.
export default function FiveOceansDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u16-ocean' x='0' y='0' width={U16_MAP.width} height={U16_MAP.height} />
      <g className='tb-u16-map-land' transform={`scale(${U16_MAP_SCALE})`}>
        {U16_LAND_PATHS.map((d, index) => <path key={index} d={d} />)}
      </g>
      <rect className='tb-u16-map-frame' x='0.5' y='0.5' width={U16_MAP.width - 1} height={U16_MAP.height - 1} />

      <DiagramRegion diagramId={ID} regionId='pacific' props={props} hit={{ x: 8, y: 58, width: 60, height: 60 }} twin={U16_PACIFIC_TWIN}>{null}</DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='atlantic' props={props} hit={{ x: 128, y: 58, width: 56, height: 58 }}>{null}</DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='indian' props={props} hit={{ x: 226, y: 66, width: 60, height: 56 }}>{null}</DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='arctic' props={props} hit={{ x: 200, y: 0, width: 60, height: 56 }}>{null}</DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='southern' props={props} hit={{ x: 214, y: 124, width: 64, height: 56 }}>{null}</DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
