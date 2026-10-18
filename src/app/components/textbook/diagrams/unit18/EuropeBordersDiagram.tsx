'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { EuropeBase } from '@/app/components/textbook/diagrams/unit18/europeMap';
import { U18_BORDERS_VIEW } from '@/app/components/textbook/diagrams/unit18/layouts';

const ID = 'u18-europe-borders';

// The Ural mountains in picture units (lon 66° 68.5° N … 58° 51.6° N), drawn
// as a ridge line with small peaks. Approximate, like the whole map.
export const U18_URAL_RIDGE = 'M334.8 36 L327.6 43.2 L316.8 52.8 L311.4 64.8 L309.6 76.8 L311.4 88.8 L309.6 98.4 L307.8 108 L306 117.1';
const URAL_PEAKS = 'M326 47 l4 -7 l4 7 Z M312 60 l4 -7 l4 7 Z M306 74 l4 -7 l4 7 Z M307 88 l4 -7 l4 7 Z M304 104 l4 -7 l4 7 Z';

// Registry regions (exactly): atlantic, arctic, mediterranean, black-sea,
// caspian, ural — five waters and one mountain range on the same map of
// Europe (all countries neutral). The waters are the map's own sea; each
// region is its tap area and letter. The Ural ridge is drawn in lessons and
// feedback only: in a hotspot question the only drawn mountains would answer
// "where are the Urals?".
export default function EuropeBordersDiagram(props: DiagramProps) {
  const hotspot = props.mode === 'hotspot';
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u18-sea' x='0' y='0' width='360' height='216' />
      <EuropeBase view={U18_BORDERS_VIEW} exclude={[]} />

      <DiagramRegion diagramId={ID} regionId='atlantic' props={props} hit={{ x: 4, y: 87, width: 56, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='arctic' props={props} hit={{ x: 130, y: 0, width: 56, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='mediterranean' props={props} hit={{ x: 116, y: 160, width: 56, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='black-sea' props={props} hit={{ x: 195, y: 130, width: 56, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='caspian' props={props} hit={{ x: 256, y: 135, width: 56, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='ural' props={props} hit={{ x: 285, y: 44, width: 56, height: 56 }}>
        {hotspot ? null : (
          <g aria-hidden='true'>
            <path className='tb-u18-ridge' d={U18_URAL_RIDGE} />
            <path className='tb-u18-peak' d={URAL_PEAKS} />
          </g>
        )}
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
