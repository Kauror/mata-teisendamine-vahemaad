'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u14-political-elements';

// One made-up land mass in the sea; the border runs from coast to coast.
const LAND = 'M28 40 C110 20 250 22 332 42 C348 110 344 190 324 236 C232 254 118 252 34 234 C18 170 20 104 28 40 Z';
const BORDER = 'M182 27 C170 86 196 128 178 176 C168 206 190 226 182 248';
// Everything left of the border (clipped to the land): the left country.
const LEFT_OF_BORDER = 'M0 0 L182 0 L182 27 C170 86 196 128 178 176 C168 206 190 226 182 248 L182 270 L0 270 Z';

// A five-pointed star centred at (cx, cy).
function star(cx: number, cy: number, outer: number, inner: number) {
  const points: string[] = [];
  for (let index = 0; index < 10; index += 1) {
    const radius = index % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (index * Math.PI) / 5;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(1)},${(cy + radius * Math.sin(angle)).toFixed(1)}`);
  }
  return points.join(' ');
}

// Registry regions (exactly): country, border, capital, city. Two fictional
// countries (no real border is drawn), told apart by a pale tint. The border
// is a dark DASHED line, unlike a river (solid blue). The capital is a red
// star in the left country away from the border; the other town a small dot
// in the right country — different shapes, so a town is not mistaken for a
// capital. The country area itself is the region `country` (its lower left).
export default function PoliticalElementsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u14-political-land'><path d={LAND} /></clipPath>
      </defs>
      <rect className='tb-u14-sea' x='0' y='0' width='360' height='270' rx='12' />
      <path className='tb-u14-country-base' d={LAND} />
      <path className='tb-u14-country-right' d={LAND} />
      <path className='tb-u14-country-left' d={LEFT_OF_BORDER} clipPath='url(#tb-u14-political-land)' />
      <path className='tb-u14-coast' d={LAND} />

      <DiagramRegion diagramId={ID} regionId='country' props={props} hit={{ x: 44, y: 150, width: 94, height: 70 }}>
        {null}
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='border' props={props} hit={{ x: 150, y: 40, width: 60, height: 196 }}>
        <path className='tb-u14-border' d={BORDER} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='capital' props={props} hit={{ x: 66, y: 62, width: 68, height: 68 }}>
        <polygon className='tb-u14-capital' points={star(92, 92, 17, 7)} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='city' props={props} hit={{ x: 228, y: 66, width: 68, height: 68 }}>
        <circle className='tb-u14-city' cx='256' cy='96' r='7' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
