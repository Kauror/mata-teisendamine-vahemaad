'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u11-globe-types';
const R = 62;
const LEFT = { x: 86, y: 84 };
const RIGHT = { x: 254, y: 84 };

// The same invented landmasses on both globes, around (0, 0) for a radius-62
// globe: a large continent in the middle, part of another at the left edge and
// an island. Not a real map.
const CONTINENT = 'M-8 -52 C6 -60 30 -56 40 -42 C50 -30 38 -19 27 -15 C35 -5 41 8 31 22 C23 36 11 49 3 57 C-5 50 -8 36 -14 24 C-22 12 -37 8 -39 -6 C-41 -20 -29 -26 -21 -30 C-25 -40 -19 -49 -8 -52 Z';
const WEST_LAND = 'M-64 6 C-54 2 -45 12 -47 25 C-49 38 -57 46 -64 52 Z';
const ISLAND = { cx: 46, cy: 32, rx: 7, ry: 4 };

function Land({ className }: { className: string }) {
  return (
    <>
      <path className={className} d={CONTINENT} />
      <path className={className} d={WEST_LAND} />
      <ellipse className={className} {...ISLAND} />
    </>
  );
}

// Registry regions (exactly): relief-globe (left), political-globe (right).
// Left: blue sea, land coloured by height — green lowland, tan higher land,
// brown mountains. Right: pale sea, the same land split into invented
// coloured areas with white borders, the way a political globe colours
// countries. No real borders and no names, so nothing pretends to be a map.
export default function GlobeTypesDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u11-globe-clip'>
          <circle cx='0' cy='0' r={R} />
        </clipPath>
        <clipPath id='tb-u11-land-clip'>
          <path d={CONTINENT} />
          <path d={WEST_LAND} />
          <ellipse {...ISLAND} />
        </clipPath>
      </defs>

      <DiagramRegion diagramId={ID} regionId='relief-globe' props={props} hit={{ x: 6, y: 6, width: 160, height: 190 }}>
        <g transform={`translate(${LEFT.x} ${LEFT.y})`}>
          <circle className='tb-diagram-earth-sea' cx='0' cy='0' r={R} />
          <g clipPath='url(#tb-u11-globe-clip)'>
            <Land className='tb-diagram-earth-land' />
            <g clipPath='url(#tb-u11-land-clip)'>
              {/* Higher land (tan) with mountains (brown) inside it. */}
              <ellipse className='tb-diagram-relief-mid' cx='12' cy='-34' rx='22' ry='10' />
              <ellipse className='tb-diagram-relief-mid' cx='16' cy='14' rx='12' ry='20' />
              <ellipse className='tb-diagram-relief-mid' cx='-58' cy='26' rx='6' ry='16' />
              <path className='tb-diagram-relief-high' d='M-2 -36 L6 -44 L12 -38 L20 -46 L28 -36 Z' />
              <path className='tb-diagram-relief-high' d='M12 8 L18 0 L24 10 L20 26 Z' />
            </g>
            <circle className='tb-diagram-globe-light' cx='-34' cy='-34' r='14' />
            <circle className='tb-diagram-earth-shade' cx='60' cy='60' r='58' />
          </g>
          <circle className='tb-diagram-earth-edge' cx='0' cy='0' r={R} />
        </g>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='political-globe' props={props} hit={{ x: 174, y: 6, width: 160, height: 190 }}>
        <g transform={`translate(${RIGHT.x} ${RIGHT.y})`}>
          <circle className='tb-diagram-pol-sea' cx='0' cy='0' r={R} />
          <g clipPath='url(#tb-u11-globe-clip)'>
            <g clipPath='url(#tb-u11-land-clip)'>
              {/* Invented areas, one colour each; neighbours never share a colour. */}
              <rect className='tb-diagram-pol-a' x='-70' y='-70' width='140' height='46' />
              <path className='tb-diagram-pol-b' d='M-70 -24 L4 -26 L-2 10 L-70 10 Z' />
              <path className='tb-diagram-pol-c' d='M4 -26 L70 -22 L70 14 L-2 10 Z' />
              <path className='tb-diagram-pol-d' d='M-70 10 L70 14 L70 70 L-70 70 Z' />
              <path className='tb-diagram-pol-a' d='M8 12 L70 14 L70 70 L14 70 Z' />
              <path className='tb-diagram-pol-c' d='M-70 30 L-50 30 L-50 70 L-70 70 Z' />
              <path className='tb-diagram-border' d='M-70 -24 L4 -26 L70 -22 M4 -26 L-2 10 M-70 10 L70 14 M8 12 L14 70 M-50 30 L-70 30' />
            </g>
            {/* Coastlines. */}
            <g className='tb-diagram-grid-line tb-diagram-grid-faint'>
              <Land className='tb-diagram-coast' />
            </g>
            <circle className='tb-diagram-globe-light' cx='-34' cy='-34' r='14' />
            <circle className='tb-diagram-earth-shade' cx='60' cy='60' r='58' />
          </g>
          <circle className='tb-diagram-earth-edge' cx='0' cy='0' r={R} />
        </g>
      </DiagramRegion>
    </DiagramSvg>
  );
}
