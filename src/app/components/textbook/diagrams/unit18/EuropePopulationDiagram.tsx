'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { EuropeBase, EuropeCountry } from '@/app/components/textbook/diagrams/unit18/europeMap';
import { U18_COUNTRIES_VIEW } from '@/app/components/textbook/diagrams/unit18/layouts';

const ID = 'u18-europe-population';
const VIEW = U18_COUNTRIES_VIEW;

// The textbook's (pp. 68–69) examples of large countries by population, in the data's names.
export const U18_POPULATION_COUNTRIES = { russia: 'Russia', germany: 'Germany', uk: 'United Kingdom', france: 'France', italy: 'Italy' } as const;

// Registry regions (exactly): russia, germany, uk, france, italy — same map
// and crop as the area map. A location map, not population figures (the
// textbook's numbers date with time). The four western neighbours are close
// together, so their 56-unit tap areas are offset around them (UK up-left,
// Germany right, France down-left, Italy below) and never overlap; France is
// drawn last so that its own outline wins where Germany's area reaches over
// the border.
export default function EuropePopulationDiagram(props: DiagramProps) {
  const hotspot = props.mode === 'hotspot';
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <g className='tb-u18-shape-regions'>
        <rect className='tb-u18-sea' x='0' y='0' width='360' height='246' />
        <EuropeBase view={VIEW} exclude={Object.values(U18_POPULATION_COUNTRIES)} />

        <DiagramRegion diagramId={ID} regionId='russia' props={props} hit={{ x: 250, y: 76, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_POPULATION_COUNTRIES.russia} tint={1} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='uk' props={props} hit={{ x: 8, y: 89, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_POPULATION_COUNTRIES.uk} tint={4} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='germany' props={props} hit={{ x: 84, y: 108, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_POPULATION_COUNTRIES.germany} tint={5} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='italy' props={props} hit={{ x: 92, y: 164, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_POPULATION_COUNTRIES.italy} tint={2} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='france' props={props} hit={{ x: 28, y: 146, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_POPULATION_COUNTRIES.france} tint={3} hotspot={hotspot} />
        </DiagramRegion>
      </g>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
