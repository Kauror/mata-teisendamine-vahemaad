'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'demo-plant-parts';

// Registry regions (exactly): flower, leaf, stem, root. An upright flowering
// plant on a soil line: flower on top, two leaves on the stem, roots below.
// The stem is drawn first, so a tap on a leaf lands on the leaf.
export default function PlantPartsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-diagram-sky' x='0' y='0' width='260' height='216' />
      <rect className='tb-diagram-soil' x='0' y='216' width='260' height='84' />
      <path className='tb-diagram-soil-line' d='M0 216 H260' />

      <DiagramRegion diagramId={ID} regionId='stem' props={props} hit={{ x: 108, y: 90, width: 44, height: 124 }}>
        <rect className='tb-diagram-stem' x='124' y='84' width='12' height='134' rx='5' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='root' props={props} hit={{ x: 86, y: 220, width: 88, height: 72 }}>
        <g className='tb-diagram-root'>
          <path d='M130 216 L130 272' />
          <path d='M130 232 Q112 244 100 266' />
          <path d='M130 236 Q150 248 162 270' />
          <path d='M130 252 Q118 266 112 286' />
          <path d='M130 254 Q144 268 148 288' />
        </g>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='leaf' props={props} hit={{ x: 138, y: 104, width: 74, height: 50 }}>
        <g className='tb-diagram-leaf'>
          <ellipse cx='174' cy='128' rx='34' ry='14' transform='rotate(-24 174 128)' />
          <ellipse cx='92' cy='168' rx='30' ry='12' transform='rotate(24 92 168)' />
          <path className='tb-diagram-leaf-vein' d='M140 142 L204 114 M64 156 L122 180' />
        </g>
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='flower' props={props} hit={{ x: 96, y: 28, width: 68, height: 68 }}>
        <g className='tb-diagram-petals'>
          <circle cx='130' cy='45' r='13' />
          <circle cx='146' cy='57' r='13' />
          <circle cx='140' cy='76' r='13' />
          <circle cx='120' cy='76' r='13' />
          <circle cx='114' cy='57' r='13' />
        </g>
        <circle className='tb-diagram-flower-centre' cx='130' cy='62' r='10' />
      </DiagramRegion>
    </DiagramSvg>
  );
}
