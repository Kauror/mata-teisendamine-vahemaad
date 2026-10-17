'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u12-aerial-vs-map';

// One invented neighbourhood in panel coordinates (175 × 205), drawn twice:
// left like an aerial photo, right as a simplified map. Same river, roads,
// bridge, buildings, park and landmark in the same places — that match is the
// point of the picture. The lower-left corner (left of the river) is kept
// empty for the hotspot marker.
const W = 175;
const H = 205;
const RIVER = 'M28 0 C44 50 18 100 46 140 C60 162 70 184 72 205';
const ROAD_ACROSS = 96;
const ROAD_DOWN = 118;
const BUILDINGS = [
  { x: 64, y: 14, w: 32, h: 22 },
  { x: 64, y: 52, w: 24, h: 30 },
  { x: 134, y: 52, w: 28, h: 28 },
  { x: 82, y: 116, w: 26, h: 20 },
  { x: 82, y: 150, w: 22, h: 24 }
];
// The landmark (a distinct building), top right.
const LANDMARK = { x: 134, y: 12, w: 30, h: 28 };
const PARK = { x: 130, y: 112, w: 40, h: 86 };
const TREES = [
  [138, 122], [154, 120], [164, 136], [142, 140], [156, 156], [138, 166], [162, 176], [146, 186],
  [8, 40], [14, 62], [52, 112], [6, 120]
];

function AerialScene() {
  return (
    <>
      <rect className='tb-u12-aerial-ground' x='0' y='0' width={W} height={H} />
      <path className='tb-u12-aerial-field' d='M0 0 H22 L6 40 L0 46 Z M100 140 L124 128 L126 205 L96 205 Z M70 0 H110 L112 8 L68 10 Z' />
      {/* River with a darker bank, roads, and the bridge where they cross. */}
      <path className='tb-u12-aerial-bank' d={RIVER} />
      <path className='tb-u12-aerial-water' d={RIVER} />
      <path className='tb-u12-aerial-road' d={`M0 ${ROAD_ACROSS} H${W} M${ROAD_DOWN} 0 V${H}`} />
      <rect className='tb-u12-aerial-bridge' x='20' y={ROAD_ACROSS - 6} width='22' height='12' />
      {/* Roofs of different tones, each with a shadow and a ridge line. */}
      {BUILDINGS.map((b, index) => (
        <g key={index}>
          <rect className='tb-u12-aerial-shadow' x={b.x + 3} y={b.y + 3} width={b.w} height={b.h} />
          <rect className={`tb-u12-roof tb-u12-roof-${index % 3}`} x={b.x} y={b.y} width={b.w} height={b.h} />
          <path className='tb-u12-ridge' d={b.w >= b.h ? `M${b.x + 2} ${b.y + b.h / 2} H${b.x + b.w - 2}` : `M${b.x + b.w / 2} ${b.y + 2} V${b.y + b.h - 2}`} />
        </g>
      ))}
      <rect className='tb-u12-aerial-shadow' x={LANDMARK.x + 3} y={LANDMARK.y + 3} width={LANDMARK.w} height={LANDMARK.h} />
      <rect className='tb-u12-roof tb-u12-roof-landmark' x={LANDMARK.x} y={LANDMARK.y} width={LANDMARK.w} height={LANDMARK.h} />
      <circle className='tb-u12-landmark-dome' cx={LANDMARK.x + LANDMARK.w / 2} cy={LANDMARK.y + LANDMARK.h / 2} r='7' />
      {/* Tree crowns: the park and a few trees along the river. */}
      <rect className='tb-u12-aerial-grass' x={PARK.x} y={PARK.y} width={PARK.w} height={PARK.h} />
      {TREES.map(([x, y], index) => (
        <g key={index}>
          <circle className='tb-u12-aerial-shadow' cx={x + 2} cy={y + 2} r='7' />
          <circle className='tb-u12-crown' cx={x} cy={y} r='7' />
          <circle className='tb-u12-crown-light' cx={x - 2} cy={y - 2} r='3' />
        </g>
      ))}
    </>
  );
}

function MapScene() {
  return (
    <>
      <rect className='tb-u12-paper' x='0' y='0' width={W} height={H} />
      <rect className='tb-u12-park' x={PARK.x} y={PARK.y} width={PARK.w} height={PARK.h} />
      <path className='tb-u12-river' d={RIVER} />
      <path className='tb-u12-road-casing' d={`M0 ${ROAD_ACROSS} H${W} M${ROAD_DOWN} 0 V${H}`} />
      <path className='tb-u12-road' d={`M0 ${ROAD_ACROSS} H${W} M${ROAD_DOWN} 0 V${H}`} />
      <rect className='tb-u12-bridge' x='20' y={ROAD_ACROSS - 6} width='22' height='12' />
      {[...BUILDINGS, LANDMARK].map((b, index) => (
        <rect key={index} className='tb-u12-building' x={b.x} y={b.y} width={b.w} height={b.h} />
      ))}
      <circle className='tb-u12-symbol' cx={LANDMARK.x + LANDMARK.w / 2} cy={LANDMARK.y + LANDMARK.h / 2} r='6' />
    </>
  );
}

// Registry regions (exactly): aerial-panel, map-panel. Both panels are drawn
// illustrations: neither is a real photograph or a real place.
export default function AerialMapDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u12-panel-clip'>
          <rect x='0' y='0' width={W} height={H} rx='8' />
        </clipPath>
      </defs>
      <DiagramRegion diagramId={ID} regionId='aerial-panel' props={props} hit={{ x: 8, y: 20, width: 175, height: 205 }}>
        <g transform='translate(8 20)' clipPath='url(#tb-u12-panel-clip)'><AerialScene /></g>
        <rect className='tb-u12-panel-edge' x='8' y='20' width={W} height={H} rx='8' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='map-panel' props={props} hit={{ x: 197, y: 20, width: 175, height: 205 }}>
        <g transform='translate(197 20)' clipPath='url(#tb-u12-panel-clip)'><MapScene /></g>
        <rect className='tb-u12-panel-edge' x='197' y='20' width={W} height={H} rx='8' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
