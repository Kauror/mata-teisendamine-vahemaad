'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { EuropeBase, EuropeCountry } from '@/app/components/textbook/diagrams/unit18/europeMap';
import { U18_COUNTRIES_VIEW } from '@/app/components/textbook/diagrams/unit18/layouts';

const ID = 'u18-europe-area';
const VIEW = U18_COUNTRIES_VIEW;

// The textbook's (p. 68) examples of large countries by area, in the data's names.
export const U18_AREA_COUNTRIES = { russia: 'Russia', ukraine: 'Ukraine', france: 'France', spain: 'Spain', sweden: 'Sweden' } as const;

// Registry regions (exactly): russia, ukraine, france, spain, sweden — the
// real generalised outlines, every other country neutral. Russia is cut by
// the frame: the map shows only part of it (it continues far into Asia).
// Tinted in lessons and feedback; in a hotspot question all five have the
// neutral land colour and only letters. Tap areas are 56 units (44 px at
// 360 px), each over its own country, and never overlap.
export default function EuropeAreaDiagram(props: DiagramProps) {
  const hotspot = props.mode === 'hotspot';
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <g className='tb-u18-shape-regions'>
        <rect className='tb-u18-sea' x='0' y='0' width='360' height='246' />
        <EuropeBase view={VIEW} exclude={Object.values(U18_AREA_COUNTRIES)} />

        <DiagramRegion diagramId={ID} regionId='sweden' props={props} hit={{ x: 108, y: 30, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_AREA_COUNTRIES.sweden} tint={5} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='ukraine' props={props} hit={{ x: 181, y: 124, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_AREA_COUNTRIES.ukraine} tint={2} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='russia' props={props} hit={{ x: 250, y: 76, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_AREA_COUNTRIES.russia} tint={1} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='spain' props={props} hit={{ x: 11, y: 186, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_AREA_COUNTRIES.spain} tint={4} hotspot={hotspot} />
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='france' props={props} hit={{ x: 40, y: 130, width: 56, height: 56 }}>
          <EuropeCountry view={VIEW} name={U18_AREA_COUNTRIES.france} tint={3} hotspot={hotspot} />
        </DiagramRegion>
      </g>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
