'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u14-physical-features';

// The coastline of the fictional land (sea to its right, x ≈ 272–282).
const LAND = 'M0 0 H268 C262 40 284 70 272 100 C262 130 286 160 274 190 C266 220 282 240 276 260 H0 Z';

// Registry regions (exactly): mountains, river, lake, island. A made-up
// landscape, not a real place: three snow-capped peaks top left; one river
// that starts at the foot of the mountains and winds into the sea (it never
// touches the lake); an inland lake bottom left; and an island well out in
// the sea, water on every side (not a peninsula). Only natural features: no
// borders, towns or names.
export default function PhysicalFeaturesDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u14-sea' x='0' y='0' width='360' height='260' rx='12' />
      <path className='tb-u14-land' d={LAND} />

      <DiagramRegion diagramId={ID} regionId='mountains' props={props} hit={{ x: 12, y: 30, width: 152, height: 80 }}>
        <path className='tb-u14-mountain' d='M18 104 L48 52 L78 104 Z M54 104 L90 38 L126 104 Z M100 104 L130 60 L160 104 Z' />
        <path className='tb-u14-snow' d='M41 64 L48 52 L55 64 Z M82 52 L90 38 L98 52 Z M123 70 L130 60 L137 70 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='river' props={props} hit={{ x: 166, y: 116, width: 64, height: 64 }}>
        <path className='tb-u14-river' d='M148 104 C186 112 158 138 198 148 S244 176 280 184' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='lake' props={props} hit={{ x: 26, y: 164, width: 100, height: 64 }}>
        <ellipse className='tb-u14-water' cx='76' cy='196' rx='44' ry='24' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='island' props={props} hit={{ x: 292, y: 88, width: 62, height: 86 }}>
        <path className='tb-u14-land' d='M304 118 C306 100 334 96 342 112 C350 128 340 150 322 152 C304 152 300 134 304 118 Z' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
