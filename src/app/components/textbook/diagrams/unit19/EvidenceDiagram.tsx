'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u19-evidence';

// Registry regions (exactly): borehole (top card), waves (middle card),
// volcano (bottom card). Each card is one way of learning about the inside
// of the Earth; the picture is on the left, the label or marker on the right.
// The borehole stops in the upper rock layers (no hole reaches far down), and
// the volcano brings up molten rock from below the crust — never core matter.
export default function EvidenceDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='borehole' props={props} hit={{ x: 8, y: 8, width: 344, height: 76 }}>
        <rect className='tb-u19-card' x='6' y='6' width='348' height='80' rx='10' />
        <rect className='tb-u19-stratum-a' x='16' y='28' width='134' height='18' />
        <rect className='tb-u19-stratum-b' x='16' y='46' width='134' height='18' />
        <rect className='tb-u19-stratum-c' x='16' y='64' width='134' height='16' />
        <path className='tb-u19-rig' d='M60 28 L72 10 L84 28 M64 22 H80 M67 16 H77' />
        <rect className='tb-u19-hole' x='70' y='28' width='4' height='38' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='waves' props={props} hit={{ x: 8, y: 94, width: 344, height: 76 }}>
        <rect className='tb-u19-card' x='6' y='92' width='348' height='80' rx='10' />
        <rect className='tb-u19-stratum-b' x='16' y='108' width='134' height='58' />
        <path className='tb-u19-quake-wave' d='M48 152 A12 12 0 0 1 72 152 M36 152 A24 24 0 0 1 84 152 M24 152 A36 36 0 0 1 96 152' />
        <path className='tb-u19-quake' d='M60 145 L62.5 150 L68 150.5 L63.5 154 L65 159.5 L60 156.5 L55 159.5 L56.5 154 L52 150.5 L57.5 150 Z' />
        <rect className='tb-u19-seismograph' x='110' y='94' width='34' height='14' rx='2' />
        <path className='tb-u19-trace' d='M113 101 h5 l2 -4 l3 8 l3 -8 l3 8 l2 -4 h7' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='volcano' props={props} hit={{ x: 8, y: 180, width: 344, height: 76 }}>
        <rect className='tb-u19-card' x='6' y='178' width='348' height='80' rx='10' />
        <rect className='tb-u19-stratum-b' x='16' y='244' width='134' height='10' />
        <path className='tb-u19-cone' d='M24 246 L70 198 L86 198 L132 246 Z' />
        <path className='tb-u19-magma' d='M78 252 V200' />
        <path className='tb-u19-lava' d='M70 198 C72 188 84 186 86 198 Z' />
        <path className='tb-u19-lava-flow' d='M85 200 C92 208 96 216 98 222' />
        <ellipse className='tb-u19-lava' cx='78' cy='250' rx='18' ry='4' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
