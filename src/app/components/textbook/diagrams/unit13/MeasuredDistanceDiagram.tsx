'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import {
  MAP_CM, MEASURED_END, MEASURED_MAP_CM, MEASURED_PANEL_BAR, MEASURED_RATIO, MEASURED_START, kmPerMapCm, ratioText, verbalText
} from '@/app/components/textbook/diagrams/unit13/geometry';

const ID = 'u13-measured-distance';
const Y = MEASURED_START.y;
const BAR = MEASURED_PANEL_BAR;
// The map-centimetre ticks along the segment (here: start, middle, end).
const TICKS = Array.from({ length: MEASURED_MAP_CM + 1 }, (_, index) => MEASURED_START.x + index * MAP_CM);

// Registry regions (exactly): start, end, segment, scale. The textbook's
// worked example on two invented points: the straight segment between them is
// marked "kaardil: 2 cm" and split by a tick into two map centimetres, each
// exactly as long as the 0 … 30 km bar in the scale panel below, which also
// shows 1 : 3 000 000 and 1 cm – 30 km. The worked result 2 × 30 km = 60 km is
// a lesson note (hidden in hotspot questions). The numbers come from the
// geometry constants; the drawn line is not a real 2 cm on the screen.
export default function MeasuredDistanceDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='segment' props={props} hit={{ x: 98, y: 72, width: 184, height: 76 }}>
        <line className='tb-u13-line' x1={MEASURED_START.x} y1={Y} x2={MEASURED_END.x} y2={Y} />
        {TICKS.slice(1, -1).map((x) => <line key={x} className='tb-u13-thin' x1={x} y1={Y - 8} x2={x} y2={Y + 8} />)}
        {TICKS.slice(0, -1).map((x) => (
          <text key={x} className='tb-u13-tick-label' x={x + MAP_CM / 2} y={Y + 20} textAnchor='middle' fontSize='12'>1 cm</text>
        ))}
        <text className='tb-u13-value' x={(MEASURED_START.x + MEASURED_END.x) / 2} y={Y - 14} textAnchor='middle' fontSize='15'>{`kaardil: ${MEASURED_MAP_CM} cm`}</text>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='start' props={props} hit={{ x: 26, y: 64, width: 68, height: 88 }}>
        <circle className='tb-u13-place' cx={MEASURED_START.x} cy={Y} r='7' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='end' props={props} hit={{ x: 286, y: 64, width: 68, height: 88 }}>
        <circle className='tb-u13-place' cx={MEASURED_END.x} cy={Y} r='7' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='scale' props={props} hit={{ x: 20, y: 176, width: 340, height: 66 }}>
        <rect className='tb-diagram-panel' x='20' y='176' width='340' height='66' rx='10' />
        <text className='tb-u13-value' x='36' y='202' fontSize='15'>{ratioText(MEASURED_RATIO)}</text>
        <text className='tb-u13-value' x='232' y='202' fontSize='13'>{verbalText(MEASURED_RATIO)}</text>
        <rect className='tb-u13-ink' x={BAR.x0} y={BAR.y} width={BAR.x1 - BAR.x0} height={BAR.height} />
        <path className='tb-u13-thin' d={`M${BAR.x0} ${BAR.y - 3} V${BAR.y + BAR.height + 3} M${BAR.x1} ${BAR.y - 3} V${BAR.y + BAR.height + 3}`} />
        <text className='tb-u13-tick-label' x={BAR.x0} y='236' textAnchor='middle' fontSize='12'>0</text>
        <text className='tb-u13-tick-label' x={BAR.x1} y='236' textAnchor='middle' fontSize='12'>{`${kmPerMapCm(MEASURED_RATIO)} km`}</text>
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
