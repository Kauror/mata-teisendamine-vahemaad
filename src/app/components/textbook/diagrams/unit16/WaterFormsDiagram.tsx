'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u16-water-forms';

// Three framed panels, 112 × 140 each, at x 6, 124 and 242. Made-up coasts,
// not real places. Exported so the test can check the shapes differ as taught.
export const U16_WATER_FORMS = {
  // Open water beside an irregular coast (land along the right edge).
  seaLand: 'M92 8 C80 30 100 50 86 72 C74 92 98 112 84 148 H118 V8 Z',
  // Two land masses that leave a narrow channel (y ≈ 64–92) between broad
  // water on the left and on the right: the channel joins the two.
  straitLandTop: 'M140 8 H220 C222 40 204 62 180 64 C156 62 138 40 140 8 Z',
  straitLandBottom: 'M140 148 C138 116 156 94 180 92 C204 94 222 116 220 148 Z',
  // Sea along the top; the water reaches deep into the land and is closed at its inner end.
  bayLand: 'M242 44 H274 C278 80 280 118 298 126 C316 118 318 80 322 44 H354 V148 H242 Z'
} as const;

// Registry regions (exactly): sea (left), strait (middle), bay (right).
export default function WaterFormsDiagram(props: DiagramProps) {
  const shapes = U16_WATER_FORMS;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='sea' props={props} hit={{ x: 6, y: 8, width: 112, height: 140 }}>
        <rect className='tb-u16-sea' x='6' y='8' width='112' height='140' />
        <path className='tb-u16-coast' d={shapes.seaLand} />
        <rect className='tb-u16-panel' x='6' y='8' width='112' height='140' rx='8' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='strait' props={props} hit={{ x: 124, y: 8, width: 112, height: 140 }}>
        <rect className='tb-u16-sea' x='124' y='8' width='112' height='140' />
        <path className='tb-u16-coast' d={shapes.straitLandTop} />
        <path className='tb-u16-coast' d={shapes.straitLandBottom} />
        <rect className='tb-u16-panel' x='124' y='8' width='112' height='140' rx='8' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='bay' props={props} hit={{ x: 242, y: 8, width: 112, height: 140 }}>
        <rect className='tb-u16-sea' x='242' y='8' width='112' height='140' />
        <path className='tb-u16-coast' d={shapes.bayLand} />
        <rect className='tb-u16-panel' x='242' y='8' width='112' height='140' rx='8' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
