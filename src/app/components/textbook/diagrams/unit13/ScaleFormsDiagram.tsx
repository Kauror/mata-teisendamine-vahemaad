'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { SCALE_BAR, SCALE_FORMS_RATIO, kmPerMapCm, ratioText, verbalText } from '@/app/components/textbook/diagrams/unit13/geometry';

const ID = 'u13-scale-forms';
const KM = kmPerMapCm(SCALE_FORMS_RATIO);
const MID = (SCALE_BAR.x0 + SCALE_BAR.x1) / 2;

function Card({ y }: { y: number }) {
  return <rect className='tb-diagram-panel' x='8' y={y} width='364' height='70' rx='10' />;
}

// Registry regions (exactly): bar, verbal, numeric. Three stacked cards with
// the same scale, 1 : 5 000 000 (1 cm on the map = 50 km in nature): a graded
// bar 0 … 50 km (one map centimetre of this picture, MAP_CM units), the
// written "1 cm – 50 km" and the ratio "1 : 5 000 000". All the written numbers
// come from SCALE_FORMS_RATIO. The forms stay visible in hotspot questions
// (recognising them is the task); only their names are hidden. The bar is not
// claimed to be 1 cm long on the screen.
export default function ScaleFormsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='bar' props={props} hit={{ x: 8, y: 6, width: 364, height: 70 }}>
        <Card y={6} />
        <rect className='tb-u13-ink' x={SCALE_BAR.x0} y={SCALE_BAR.y} width={MID - SCALE_BAR.x0} height={SCALE_BAR.height} />
        <rect className='tb-u13-paper' x={MID} y={SCALE_BAR.y} width={SCALE_BAR.x1 - MID} height={SCALE_BAR.height} />
        <path className='tb-u13-thin' d={`M${SCALE_BAR.x0} ${SCALE_BAR.y - 4} V${SCALE_BAR.y + SCALE_BAR.height + 4} M${MID} ${SCALE_BAR.y - 2} V${SCALE_BAR.y + SCALE_BAR.height + 2} M${SCALE_BAR.x1} ${SCALE_BAR.y - 4} V${SCALE_BAR.y + SCALE_BAR.height + 4}`} />
        <text className='tb-u13-tick-label' x={SCALE_BAR.x0} y='72' textAnchor='middle' fontSize='12'>0</text>
        <text className='tb-u13-tick-label' x={MID} y='72' textAnchor='middle' fontSize='12'>{KM / 2}</text>
        <text className='tb-u13-tick-label' x={SCALE_BAR.x1} y='72' textAnchor='middle' fontSize='12'>{`${KM} km`}</text>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='verbal' props={props} hit={{ x: 8, y: 84, width: 364, height: 70 }}>
        <Card y={84} />
        <text className='tb-u13-value' x='40' y='138' fontSize='22'>{verbalText(SCALE_FORMS_RATIO)}</text>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='numeric' props={props} hit={{ x: 8, y: 162, width: 364, height: 70 }}>
        <Card y={162} />
        <text className='tb-u13-value' x='40' y='216' fontSize='22'>{ratioText(SCALE_FORMS_RATIO)}</text>
      </DiagramRegion>
    </DiagramSvg>
  );
}
