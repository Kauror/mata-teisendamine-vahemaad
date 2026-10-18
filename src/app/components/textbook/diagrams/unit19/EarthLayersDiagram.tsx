'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U19_EARTH, U19_EARTH_ROWS } from '@/app/components/textbook/diagrams/unit19/layouts';

const ID = 'u19-earth-layers';
const { cx, cy } = U19_EARTH;

// A point on a layer at `radius`, `degrees` clockwise from "east".
function at(radius: number, degrees: number) {
  const angle = (degrees * Math.PI) / 180;
  return { x: Math.round((cx + radius * Math.cos(angle)) * 10) / 10, y: Math.round((cy + radius * Math.sin(angle)) * 10) / 10 };
}

// Leader lines from each layer to its row on the right (drawn in every mode:
// they say which letter points at which layer, never what the layer is called).
const LEADERS = [
  { from: at(102, -55), row: 0 },
  { from: at(78, -15), row: 1 },
  { from: at(40, 20), row: 2 },
  { from: at(8, 45), row: 3 }
];
const rowY = (row: number) => U19_EARTH_ROWS.top[row] + U19_EARTH_ROWS.height / 2;

// Registry regions (exactly): crust, mantle, outer-core, inner-core — from
// the outside in. Each layer is a full disk drawn over the previous one, so
// the visible ring of each disk is that layer and tapping it picks the layer.
// The crust ring is far too thin to tap, so every layer also owns a 58-unit
// row on the right (the hit areas), where its marker sits.
export default function EarthLayersDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <DiagramRegion diagramId={ID} regionId='crust' props={props} hit={{ x: 222, y: 34, width: 134, height: 58 }}>
        <circle className='tb-u19-layer tb-u19-crust' cx={cx} cy={cy} r={U19_EARTH.crust} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='mantle' props={props} hit={{ x: 222, y: 96, width: 134, height: 58 }}>
        <circle className='tb-u19-layer tb-u19-mantle' cx={cx} cy={cy} r={U19_EARTH.mantle} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='outer-core' props={props} hit={{ x: 222, y: 158, width: 134, height: 58 }}>
        <circle className='tb-u19-layer tb-u19-outer-core' cx={cx} cy={cy} r={U19_EARTH.outerCore} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='inner-core' props={props} hit={{ x: 222, y: 220, width: 134, height: 58 }}>
        <circle className='tb-u19-layer tb-u19-inner-core' cx={cx} cy={cy} r={U19_EARTH.innerCore} />
      </DiagramRegion>
      <g className='tb-u19-leaders' aria-hidden='true'>
        {LEADERS.map(({ from, row }) => (
          <g key={row}>
            <path className='tb-u19-leader' d={`M${from.x} ${from.y} L${U19_EARTH_ROWS.x - 8} ${rowY(row)} H${U19_EARTH_ROWS.x + 4}`} />
            <circle className='tb-u19-leader-dot' cx={from.x} cy={from.y} r='3' />
          </g>
        ))}
      </g>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
