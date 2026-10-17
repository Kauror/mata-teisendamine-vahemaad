'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u12-legend-town';

// An INVENTED practice town, not Tartu: no real names, no real geometry.
// Map 8–264 × 24–332; legend box 272–396.
const RIVER = 'M58 24 C76 110 40 200 70 332';
const ROAD_Y = 170;
const ROAD_X = 176;
const PARK_TREES = [[124, 228], [150, 300], [214, 236], [244, 300], [132, 312], [250, 222], [118, 268], [236, 266]];
const LEGEND_ROWS = [74, 110, 146, 182, 218];
const LEGEND_WORDS = ['muuseum', 'sild', 'jõgi', 'park', 'hoone'];

// The museum symbol: a small dark-red temple front with an "M" drawn as a
// line (no text node), centred on (0, 0), about 22 units wide.
function MuseumSymbol({ x, y }: { x: number; y: number }) {
  return (
    <g className='tb-u12-museum-symbol' transform={`translate(${x} ${y})`}>
      <path className='tb-u12-symbol' d='M-11 -3 L0 -11 L11 -3 Z' />
      <rect className='tb-u12-symbol' x='-9' y='-3' width='18' height='13' />
      <path className='tb-u12-symbol-mark' d='M-5 7 V0 L0 4 L5 0 V7' />
    </g>
  );
}

// The bridge as drawn on this map: a pale deck with two dark rails across water.
function BridgeShape({ x, y, length }: { x: number; y: number; length: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect className='tb-u12-bridge' x={-length / 2} y='-7' width={length} height='14' />
      {/* Rails with splayed ends, the usual map drawing of a bridge. */}
      <path className='tb-u12-bridge-rail' d={`M${-length / 2 - 4} -11 L${-length / 2} -7 H${length / 2} L${length / 2 + 4} -11 M${-length / 2 - 4} 11 L${-length / 2} 7 H${length / 2} L${length / 2 + 4} 11`} />
    </g>
  );
}

// Registry regions (exactly): river, park, building, bridge, museum, legend.
// The river and park are large, so they are drawn as the base map and get a
// compact tap area of their own; the small bridge, museum and buildings sit in
// separate, non-overlapping tap areas and are never covered by another
// region. Hotspot markers sit beside the bridge and the museum symbol so they
// do not hide what is to be found. In hotspot mode the legend keeps its
// symbols but its words become blank bars.
export default function LegendTownDiagram(props: DiagramProps) {
  const words = props.mode !== 'hotspot';
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      {/* Base map: paper, park, river and roads (not tappable by themselves). */}
      <rect className='tb-u12-paper tb-u12-map-frame' x='8' y='24' width='256' height='308' rx='8' />
      <rect className='tb-u12-park' x='104' y='210' width='156' height='118' rx='6' />
      <path className='tb-u12-park-path' d='M104 300 Q170 250 260 262' />
      {PARK_TREES.map(([x, y], index) => <circle key={index} className='tb-u12-tree' cx={x} cy={y} r='5' />)}
      <path className='tb-u12-river tb-u12-river-wide' d={RIVER} />
      <path className='tb-u12-road-casing' d={`M8 ${ROAD_Y} H264 M${ROAD_X} 24 V${ROAD_Y}`} />
      <path className='tb-u12-road' d={`M8 ${ROAD_Y} H264 M${ROAD_X} 24 V${ROAD_Y}`} />

      <DiagramRegion diagramId={ID} regionId='river' props={props} hit={{ x: 32, y: 30, width: 62, height: 96 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='park' props={props} hit={{ x: 112, y: 222, width: 140, height: 96 }}>
        {null}
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='building' props={props} hit={{ x: 96, y: 50, width: 62, height: 66 }}>
        <rect className='tb-u12-building' x='104' y='56' width='42' height='26' />
        <rect className='tb-u12-building' x='104' y='86' width='28' height='22' />
        <rect className='tb-u12-building' x='136' y='86' width='12' height='22' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='bridge' props={props} hit={{ x: 30, y: 136, width: 76, height: 62 }}>
        <BridgeShape x={57} y={ROAD_Y} length={40} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='museum' props={props} hit={{ x: 196, y: 58, width: 64, height: 62 }}>
        <rect className='tb-u12-building' x='200' y='74' width='36' height='34' />
        <MuseumSymbol x={218} y={91} />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='legend' props={props} hit={{ x: 272, y: 24, width: 124, height: 308 }}>
        <rect className='tb-u12-legend-box' x='272' y='24' width='124' height='308' rx='8' />
        <MuseumSymbol x={292} y={LEGEND_ROWS[0]} />
        <path className='tb-u12-legend-water' d={`M281 ${LEGEND_ROWS[1]} H303`} />
        <BridgeShape x={292} y={LEGEND_ROWS[1]} length={12} />
        <rect className='tb-u12-water-swatch' x='281' y={LEGEND_ROWS[2] - 8} width='22' height='16' rx='3' />
        <rect className='tb-u12-park' x='281' y={LEGEND_ROWS[3] - 8} width='22' height='16' rx='3' />
        <rect className='tb-u12-building' x='281' y={LEGEND_ROWS[4] - 8} width='22' height='16' />
        {LEGEND_ROWS.map((y, index) => words
          ? <text key={index} className='tb-u12-legend-word' x='312' y={y + 5} fontSize='13'>{LEGEND_WORDS[index]}</text>
          : <rect key={index} className='tb-u12-legend-blank' x='312' y={y - 4} width='52' height='9' rx='4' />)}
      </DiagramRegion>
    </DiagramSvg>
  );
}
