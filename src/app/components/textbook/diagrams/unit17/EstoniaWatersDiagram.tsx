'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { CONTEXT_COUNTRIES, COUNTRY_PATHS } from '@/app/components/textbook/diagrams/unit17/geometry';
import { HIIUMAA, PEIPUS, SAAREMAA, WATERS_MAP, mapTransform } from '@/app/components/textbook/diagrams/unit17/layouts';

const ID = 'u17-estonia-waters';
const MAP = mapTransform(WATERS_MAP);
const NEIGHBOURS = ['Finland', 'Sweden', 'Latvia', 'Lithuania', 'Russia', ...CONTEXT_COUNTRIES];

// Registry regions (exactly): baltic-sea, gulf-finland, gulf-riga,
// lake-peipus. The same Natural Earth outlines zoomed on Estonia, with
// schematic Saaremaa and Hiiumaa. The sea is the background, so the three sea
// regions are tap areas on open water: the Baltic Sea west of Estonia, the
// Gulf of Finland between Estonia and Finland, the Gulf of Riga between
// Estonia and Latvia. Lake Peipus is an illustrative oval on the eastern
// border, darker and outlined, so the inland lake does not look like the sea.
// Estonia (not a region here) is yellow in every mode, as the reference point.
export default function EstoniaWatersDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u17-sea' x='0' y='0' width='360' height='180' rx='8' />
      <g transform={MAP} aria-hidden='true' pointerEvents='none'>
        {NEIGHBOURS.map((name) => <path key={name} className='tb-u17-country' d={COUNTRY_PATHS[name]} />)}
        <path className='tb-u17-country tb-u17-land-estonia' d={`${COUNTRY_PATHS.Estonia} ${SAAREMAA} ${HIIUMAA}`} />
      </g>
      <DiagramRegion diagramId={ID} regionId='baltic-sea' props={props} hit={{ x: 19, y: 90, width: 84, height: 70 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='gulf-finland' props={props} hit={{ x: 143, y: 17, width: 208, height: 56 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='gulf-riga' props={props} hit={{ x: 162, y: 103, width: 57, height: 57 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='lake-peipus' props={props} hit={{ x: 257, y: 75, width: 57, height: 57 }}>
        <ellipse className='tb-u17-lake' transform={MAP} cx={PEIPUS.cx} cy={PEIPUS.cy} rx={PEIPUS.rx} ry={PEIPUS.ry} />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
