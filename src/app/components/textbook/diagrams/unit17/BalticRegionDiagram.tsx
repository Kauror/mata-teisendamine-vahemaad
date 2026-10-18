'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { CONTEXT_COUNTRIES, COUNTRY_PATHS, REGION_COUNTRY } from '@/app/components/textbook/diagrams/unit17/geometry';
import { BALTIC_MAP, HIIUMAA, SAAREMAA, mapTransform } from '@/app/components/textbook/diagrams/unit17/layouts';

const ID = 'u17-baltic-region';
const MAP = mapTransform(BALTIC_MAP);

// Registry regions (exactly): estonia, finland, sweden, latvia, russia,
// lithuania. Natural Earth 1:110m outlines cropped to the eastern Baltic
// (generalized, not legal borders), with schematic Saaremaa and Hiiumaa as
// part of Estonia, so tapping an island picks Estonia. Norway, Denmark,
// Poland and Belarus are grey context. The drawing order decides what an
// enlarged tap area loses to: Russia, Sweden and Finland first, then Estonia,
// Latvia, Lithuania, so a tap on Latvia's own outline inside Estonia's
// enlarged area picks Latvia, and Lithuania's inside Latvia's picks Lithuania.
// Estonia is yellow only in lessons; in a hotspot question all six look alike.
export default function BalticRegionDiagram(props: DiagramProps) {
  const country = (regionId: string) => {
    const className = props.mode === 'lesson' && regionId === 'estonia' ? 'tb-u17-country tb-u17-land-estonia' : 'tb-u17-country';
    return (
      <g transform={MAP}>
        <path className={className} d={COUNTRY_PATHS[REGION_COUNTRY[regionId]]} />
        {regionId === 'estonia' ? <path className={className} d={`${SAAREMAA} ${HIIUMAA}`} /> : null}
      </g>
    );
  };
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u17-sea' x='0' y='0' width='360' height='385' rx='8' />
      <g transform={MAP} aria-hidden='true' pointerEvents='none'>
        {CONTEXT_COUNTRIES.map((name) => <path key={name} className='tb-u17-context' d={COUNTRY_PATHS[name]} />)}
      </g>
      <DiagramRegion diagramId={ID} regionId='russia' props={props} hit={{ x: 295, y: 230, width: 58, height: 58 }}>
        {country('russia')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='sweden' props={props} hit={{ x: 14, y: 100, width: 58, height: 58 }}>
        {country('sweden')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='finland' props={props} hit={{ x: 209, y: 86, width: 58, height: 58 }}>
        {country('finland')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='estonia' props={props} hit={{ x: 209, y: 215, width: 58, height: 56 }}>
        {country('estonia')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='latvia' props={props} hit={{ x: 212, y: 271, width: 58, height: 56 }}>
        {country('latvia')}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='lithuania' props={props} hit={{ x: 169, y: 328, width: 58, height: 56 }}>
        {country('lithuania')}
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
