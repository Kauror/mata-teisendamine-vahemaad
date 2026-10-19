'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u20-geysers';

const SURFACE_Y = 120;
const CHANNEL_Y = 184;
export const U20_GEYSER_X = 282;
export const U20_SPRING_X = 136;

// Water, not magma (p 77): rain soaks into the ground on the left and collects
// as cool groundwater; it seeps right along a crack over hot rock deep down and
// warms; one branch rises calmly into a pool (hot spring), the other through a
// narrow pipe where pressure builds until a column of hot water and steam
// shoots up (geyser). Nothing here is lava-coloured above the hot rock.
// Registry regions (exactly): geyser (upper right), spring (left of centre,
// on the surface), groundwater (lower left), heated-rock (bottom centre).
export default function GeysersDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u20-frame' x='0' y='0' width='360' height='250' rx='12' />
      <rect className='tb-u20-ground' x='4' y={SURFACE_Y} width='352' height='126' />
      <path className='tb-u20-layer' d='M4 150 C120 146 240 156 356 148 M4 214 C110 210 250 220 356 212' />
      <path className='tb-u20-rain' d='M28 30 l-6 14 M48 36 l-6 14 M68 30 l-6 14 M38 56 l-6 14 M58 58 l-6 14' />
      <path className='tb-u20-surface' d={`M4 ${SURFACE_Y} H356`} />
      <path className='tb-u20-hot-water' d={`M88 ${CHANNEL_Y} H${U20_GEYSER_X} M${U20_SPRING_X} ${CHANNEL_Y} V${SURFACE_Y + 2} M${U20_GEYSER_X} ${CHANNEL_Y} V${SURFACE_Y}`} />

      <DiagramRegion diagramId={ID} regionId='groundwater' props={props} hit={{ x: 10, y: 150, width: 80, height: 58 }}>
        <path className='tb-u20-seep' d='M30 126 V156 M52 126 V156 M74 126 V156' />
        <path className='tb-u20-cool-water' d={`M8 170 C40 166 70 172 92 ${CHANNEL_Y - 6} V${CHANNEL_Y + 6} C70 196 40 198 8 196 Z`} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='heated-rock' props={props} hit={{ x: 140, y: 192, width: 110, height: 56 }}>
        <path className='tb-u20-hot-rock' d='M132 246 C134 226 150 216 190 216 C230 216 248 226 252 246 Z' />
        <path className='tb-u20-heat' d='M164 212 q4 -6 0 -12 q-4 -6 0 -10 M192 212 q4 -6 0 -12 q-4 -6 0 -10 M220 212 q4 -6 0 -12 q-4 -6 0 -10' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='spring' props={props} hit={{ x: 104, y: 94, width: 64, height: 56 }}>
        <ellipse className='tb-u20-pool' cx={U20_SPRING_X} cy={SURFACE_Y} rx='24' ry='6' />
        <path className='tb-u20-wisp' d={`M${U20_SPRING_X - 8} 110 q-4 -6 0 -12 M${U20_SPRING_X + 8} 110 q4 -6 0 -12`} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='geyser' props={props} hit={{ x: 250, y: 12, width: 64, height: 96 }}>
        <path className='tb-u20-jet' d={`M${U20_GEYSER_X - 6} ${SURFACE_Y} L${U20_GEYSER_X - 10} 40 C${U20_GEYSER_X - 6} 30 ${U20_GEYSER_X + 6} 30 ${U20_GEYSER_X + 10} 40 L${U20_GEYSER_X + 6} ${SURFACE_Y} Z`} />
        <path className='tb-u20-steam' d={`M${U20_GEYSER_X - 14} 36 C${U20_GEYSER_X - 28} 34 ${U20_GEYSER_X - 26} 16 ${U20_GEYSER_X - 12} 18 C${U20_GEYSER_X - 8} 6 ${U20_GEYSER_X + 12} 6 ${U20_GEYSER_X + 14} 18 C${U20_GEYSER_X + 28} 18 ${U20_GEYSER_X + 28} 36 ${U20_GEYSER_X + 14} 36 Z`} />
        <ellipse className='tb-u20-pool' cx={U20_GEYSER_X} cy={SURFACE_Y} rx='16' ry='4' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
