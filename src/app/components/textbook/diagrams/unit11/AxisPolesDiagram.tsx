'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { AXIS_GLOBE, AXIS_TILT, axisPoint } from '@/app/components/textbook/diagrams/unit11/layouts';

const ID = 'u11-axis-poles';
const { cx, cy, r } = AXIS_GLOBE;
const f = (value: number) => value.toFixed(1);

const NORTH_POLE = axisPoint(r);
const SOUTH_POLE = axisPoint(-r);
const AXIS_TOP = axisPoint(r + 20);
const AXIS_BOTTOM = axisPoint(-r - 20);

// A small arc round the axis just above the north pole: its near (front) half,
// left to right, i.e. west to east — the way the Earth turns.
function rotationArc() {
  const centre = axisPoint(r + 10);
  const angle = (-AXIS_TILT * Math.PI) / 180;
  const end = (side: number) => ({ x: centre.x + side * 18 * Math.cos(angle), y: centre.y + side * 18 * Math.sin(angle) });
  const [from, to] = [end(-1), end(1)];
  return `M${f(from.x)} ${f(from.y)} A18 6 ${-AXIS_TILT} 0 0 ${f(to.x)} ${f(to.y)}`;
}

// Registry regions (exactly): north-pole, south-pole, axis. A globe with
// imaginary land, light from the upper left; a dashed axis through its centre,
// tilted 23.4° (not labelled: the number is optional enrichment), sticking out
// a little at both ends, with a dot at each pole. The axis region is drawn
// first, so the pole tap areas lie above it.
export default function AxisPolesDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u11-axis-globe-clip'>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <marker id='tb-u11-rotation-head' markerWidth='8' markerHeight='8' refX='4' refY='4' orient='auto'>
          <path d='M1 1 L7 4 L1 7 z' className='tb-diagram-rotation-head' />
        </marker>
      </defs>
      <g aria-hidden='true'>
        <circle className='tb-diagram-earth-sea' cx={cx} cy={cy} r={r} />
        <g clipPath='url(#tb-u11-axis-globe-clip)'>
          <path className='tb-diagram-earth-land' d='M96 82 C118 70 146 76 156 92 C164 106 150 116 138 118 C126 122 112 114 104 104 C96 98 90 90 96 82 Z' />
          <path className='tb-diagram-earth-land' d='M198 112 C214 104 236 112 240 128 C244 146 232 168 218 176 C206 182 198 168 200 152 C202 138 190 124 198 112 Z' />
          <path className='tb-diagram-earth-land' d='M104 208 C116 202 132 206 138 216 C142 226 130 236 118 234 C106 232 98 218 104 208 Z' />
          <circle className='tb-diagram-globe-light' cx={cx - 50} cy={cy - 50} r='24' />
          <circle className='tb-diagram-earth-shade' cx={cx + 96} cy={cy + 96} r='96' />
        </g>
        <circle className='tb-diagram-earth-edge' cx={cx} cy={cy} r={r} />
      </g>

      <DiagramRegion diagramId={ID} regionId='axis' props={props} hit={{ x: 122, y: 117, width: 56, height: 56 }}>
        <path className='tb-diagram-axis' d={`M${f(AXIS_TOP.x)} ${f(AXIS_TOP.y)} L${f(AXIS_BOTTOM.x)} ${f(AXIS_BOTTOM.y)}`} />
      </DiagramRegion>
      <path className='tb-diagram-rotation' d={rotationArc()} markerEnd='url(#tb-u11-rotation-head)' aria-hidden='true' />

      <DiagramRegion diagramId={ID} regionId='north-pole' props={props} hit={{ x: 80, y: 22, width: 62, height: 62 }}>
        <circle className='tb-diagram-pole' cx={f(NORTH_POLE.x)} cy={f(NORTH_POLE.y)} r='5' />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='south-pole' props={props} hit={{ x: 158, y: 204, width: 62, height: 62 }}>
        <circle className='tb-diagram-pole' cx={f(SOUTH_POLE.x)} cy={f(SOUTH_POLE.y)} r='5' />
      </DiagramRegion>
    </DiagramSvg>
  );
}
