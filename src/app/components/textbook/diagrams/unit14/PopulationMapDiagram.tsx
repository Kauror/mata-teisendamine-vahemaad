'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U14_POPULATION_HEADING, U14_POPULATION_LEGEND, U14_POPULATION_LETTERS } from '@/app/components/textbook/diagrams/unit14/layout';

const ID = 'u14-population-map';

// Three made-up neighbouring regions in one frame (not real counties). Each
// has its own tint AND pattern, so the legend can be read without telling
// hues apart: A lightest + dots, C mid + diagonal lines, B darkest + cross-hatch.
const SHAPES: Record<string, string> = {
  a: 'M14 38 H120 L128 96 L116 148 L124 194 H14 Z',
  b: 'M120 38 H238 L244 92 L232 146 L242 194 H124 L116 148 L128 96 Z',
  c: 'M238 38 H346 V194 H242 L232 146 L244 92 Z'
};

function Fill({ tint, d }: { tint: string; d: string }) {
  return (
    <>
      <path className={`tb-u14-pop tb-u14-pop-${tint}`} d={d} />
      <path className='tb-u14-pop-pattern' d={d} fill={`url(#tb-u14-pattern-${tint})`} />
    </>
  );
}

// Registry regions (exactly): a (left, 4 000), b (centre, 9 000), c (right,
// 6 000) — the same fictional numbers as the lesson table and every question.
// The heading and the legend are map data and are drawn in every mode; the
// numbers on the regions and the big region letters only in lessons (in a
// hotspot question reading the legend is the task, and the markers carry the
// letters). Feedback shows "B – 9 000" on the region.
export default function PopulationMapDiagram(props: DiagramProps) {
  const lesson = props.mode === 'lesson';
  const heading = U14_POPULATION_HEADING;
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <pattern id='tb-u14-pattern-a' width='12' height='12' patternUnits='userSpaceOnUse'>
          <circle className='tb-u14-pattern-dot' cx='6' cy='6' r='1.8' />
        </pattern>
        <pattern id='tb-u14-pattern-c' width='10' height='10' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
          <line className='tb-u14-pattern-line' x1='0' y1='0' x2='0' y2='10' />
        </pattern>
        <pattern id='tb-u14-pattern-b' width='8' height='8' patternUnits='userSpaceOnUse' patternTransform='rotate(45)'>
          <path className='tb-u14-pattern-line' d='M0 0 V8 M0 0 H8' />
        </pattern>
      </defs>
      <rect className='tb-u14-frame' x='0' y='0' width='360' height='300' rx='12' />
      <text className='tb-u14-heading' x={heading.label.x} y={heading.label.y} textAnchor={heading.label.anchor} fontSize={heading.label.fontSize}>{heading.text}</text>
      <rect className='tb-u14-map-frame' x='8' y='32' width='344' height='168' rx='6' />

      <DiagramRegion diagramId={ID} regionId='a' props={props} hit={{ x: 18, y: 44, width: 92, height: 144 }}>
        <Fill tint='a' d={SHAPES.a} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='b' props={props} hit={{ x: 136, y: 44, width: 90, height: 144 }}>
        <Fill tint='b' d={SHAPES.b} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='c' props={props} hit={{ x: 252, y: 44, width: 90, height: 144 }}>
        <Fill tint='c' d={SHAPES.c} />
      </DiagramRegion>
      <path className='tb-u14-pop-edge' d='M120 38 L128 96 L116 148 L124 194 M238 38 L244 92 L232 146 L242 194' />

      {lesson ? (
        <g aria-hidden='true'>
          {Object.entries(U14_POPULATION_LETTERS).map(([regionId, label]) => (
            <text key={regionId} className={label.onShape ? 'tb-u14-letter tb-u14-letter-light' : 'tb-u14-letter'} x={label.x} y={label.y} textAnchor={label.anchor} fontSize={label.fontSize}>
              {regionId.toUpperCase()}
            </text>
          ))}
        </g>
      ) : null}

      <g className='tb-u14-legend'>
        {U14_POPULATION_LEGEND.map((item) => (
          <g key={item.regionId}>
            <rect className={`tb-u14-pop tb-u14-pop-${item.regionId}`} x={item.swatch.x} y={item.swatch.y} width={item.swatch.width} height={item.swatch.height} rx='3' />
            <rect className='tb-u14-pop-pattern' x={item.swatch.x} y={item.swatch.y} width={item.swatch.width} height={item.swatch.height} rx='3' fill={`url(#tb-u14-pattern-${item.regionId})`} />
            <text className='tb-u14-legend-text' x={item.label.x} y={item.label.y} textAnchor={item.label.anchor} fontSize={item.label.fontSize}>{item.text}</text>
          </g>
        ))}
      </g>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
