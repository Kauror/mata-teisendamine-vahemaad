'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { CONTINENT_PATHS, OCEANIA_ISLANDS, europeTransform } from '@/app/components/textbook/diagrams/unit18/europeMap';
import { U18_WORLD_VIEW } from '@/app/components/textbook/diagrams/unit18/layouts';

const ID = 'u18-europe-world';
const MAP = europeTransform(U18_WORLD_VIEW);

// The conventional Europe–Asia divide in the 720 × 360 world data, north to
// south: Kara Sea – Ural mountains – Ural river – Caspian – Caucasus – Black
// Sea – Bosporus. Not an ocean and not a precise line (the textbook says the
// eastern border is a convention).
export const U18_DIVIDE = 'M500 26 L494 42 L489 45 L480 51 L478 58 L479 65 L477 72 L476 77 L470 77 L464 77.6 L463 85 L459 88 L455.4 89 L455 93 L448 95.2 L440 93.2 L432 94.6 L418.2 97.4 L418 98 L412.4 99.6';
// Everything of Eurasia west of the divide is Europe; the rest is Asia
// (Europe's polygon cut out of the whole map, even-odd).
export const U18_EUROPE_CLIP = 'M500 26 L494 42 L489 45 L480 51 L478 58 L479 65 L477 72 L476 77 L470 77 L464 77.6 L463 85 L459 88 L455.4 89 L455 93 L448 95.2 L440 93.2 L432 94.6 L418.2 97.4 L418 98 L412.4 99.6 L411.2 102.8 L414.4 108 L417 111 L417 130 L280 130 L280 4 L500 4 Z';
const WHOLE_MAP = 'M0 0 H720 V360 H0 Z';
// The continent data keeps French Guiana with France's Eurasia outline; it is
// in South America, so it is drawn as plain land and belongs to no region.
export const U18_GUIANA_BOX = 'M249 166 L259 166 L259 178 L249 178 Z';

// Registry regions (exactly): europe, asia, africa, north-america. Six
// continents (Euraasia is ONE continent; Europe and Asia are its world parts).
// Lessons and feedback tint Europe and Asia apart and draw the divide; a
// hotspot question shows every continent in the same neutral colour, no
// divide and no names — only the letters.
export default function EuropeWorldDiagram(props: DiagramProps) {
  const hotspot = props.mode === 'hotspot';
  const part = (tint: string) => (hotspot ? 'tb-u18-land tb-u18-target' : `tb-u18-land tb-u18-target ${tint}`);
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <g className='tb-u18-shape-regions'>
        <defs>
          <clipPath id='tb-u18-clip-west'><path d={U18_EUROPE_CLIP} /></clipPath>
          <clipPath id='tb-u18-clip-east'><path d={`${WHOLE_MAP} ${U18_EUROPE_CLIP} ${U18_GUIANA_BOX}`} clipRule='evenodd' /></clipPath>
          <clipPath id='tb-u18-clip-plain'><path d={U18_GUIANA_BOX} /></clipPath>
        </defs>
        <rect className='tb-u18-sea' x='0' y='0' width='360' height='160' />
        <g transform={MAP} aria-hidden='true'>
          <path className='tb-u18-land' d={CONTINENT_PATHS['south-america']} />
          <path className='tb-u18-land' d={CONTINENT_PATHS.australia} />
          <path className='tb-u18-land' d={CONTINENT_PATHS.antarctica} />
          <path className='tb-u18-land' d={OCEANIA_ISLANDS} />
          <path className='tb-u18-land' d={CONTINENT_PATHS.eurasia} clipPath='url(#tb-u18-clip-plain)' />
        </g>

        <DiagramRegion diagramId={ID} regionId='north-america' props={props} hit={{ x: 42, y: 24, width: 56, height: 56 }}>
          <g transform={MAP}><path className='tb-u18-land tb-u18-target' d={CONTINENT_PATHS['north-america']} /></g>
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='africa' props={props} hit={{ x: 172, y: 69, width: 56, height: 56 }}>
          <g transform={MAP}><path className='tb-u18-land tb-u18-target' d={CONTINENT_PATHS.africa} /></g>
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='asia' props={props} hit={{ x: 252, y: 26, width: 56, height: 56 }}>
          <g transform={MAP}><path className={part('tb-u18-asia')} d={CONTINENT_PATHS.eurasia} clipPath='url(#tb-u18-clip-east)' /></g>
        </DiagramRegion>
        <DiagramRegion diagramId={ID} regionId='europe' props={props} hit={{ x: 167, y: 6, width: 56, height: 56 }}>
          <g transform={MAP}><path className={part('tb-u18-europe')} d={CONTINENT_PATHS.eurasia} clipPath='url(#tb-u18-clip-west)' /></g>
        </DiagramRegion>

        {hotspot ? null : (
          <g transform={MAP} aria-hidden='true'>
            <path className='tb-u18-divide' d={U18_DIVIDE} />
          </g>
        )}
      </g>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
