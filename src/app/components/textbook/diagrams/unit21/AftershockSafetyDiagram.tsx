'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-aftershock-safety';

// After the shaking, three cards left to right. Registry regions (exactly):
// damaged-wall (left: a cracked wall that an aftershock could still bring
// down), fallen-wire (centre: a power line hanging down to the ground with a
// spark — keep away, never touch), radio (right: a battery radio for official
// messages when the power or the internet is out). The two hazards and the
// helper are drawn apart, so no hazard looks like a "safe" thing to do.
export default function AftershockSafetyDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='236' rx='12' />

      <DiagramRegion diagramId={ID} regionId='damaged-wall' props={props} hit={{ x: 10, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='6' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-floor' d='M12 176 H112' />
        <rect className='tb-u21-building' x='20' y='64' width='84' height='112' />
        <rect className='tb-u21-glass' x='76' y='80' width='18' height='22' />
        <path className='tb-u21-crack' d='M60 64 L52 88 L66 108 L54 132 L62 176' />
        <rect className='tb-u21-debris' x='26' y='166' width='12' height='8' transform='rotate(-15 32 170)' />
        <rect className='tb-u21-debris' x='84' y='168' width='10' height='7' transform='rotate(25 89 171)' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='fallen-wire' props={props} hit={{ x: 128, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='124' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-floor' d='M130 176 H230' />
        <path className='tb-u21-pole' d='M150 50 V176 M140 58 H162' />
        <path className='tb-u21-wire' d='M150 58 C186 66 204 120 212 174 Q220 177 230 172' />
        <path className='tb-u21-spark' d='M212 162 L215 169 L222 168 L217 173 L221 180 L213 176 L206 181 L208 173 L202 168 L210 169 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='radio' props={props} hit={{ x: 246, y: 32, width: 104, height: 148 }}>
        <rect className='tb-u21-panel' x='242' y='28' width='112' height='202' rx='10' />
        <path className='tb-u21-antenna' d='M266 108 L254 72' />
        <rect className='tb-u21-radio' x='256' y='108' width='70' height='50' rx='8' />
        <circle className='tb-u21-speaker' cx='278' cy='133' r='13' />
        <circle className='tb-u21-knob' cx='310' cy='122' r='5' />
        <rect className='tb-u21-battery' x='298' y='138' width='18' height='10' rx='1' />
        <rect className='tb-u21-battery' x='316' y='141' width='3' height='4' />
        <path className='tb-u21-sound' d='M332 120 Q338 128 332 136 M338 114 Q348 128 338 142' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
