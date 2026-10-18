'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { LABEL_LINE_HEIGHT } from '@/app/components/textbook/diagrams/diagramLayout';
import { U15_BOX_WORD_SIZE, U15_LINK_ARROWS, U15_LINK_BOXES, U15_LINK_LEGEND, U15_LINK_PANELS, type U15Box } from '@/app/components/textbook/diagrams/unit15/layouts';

const ID = 'u15-continent-worldpart-links';

// The first baseline of a box's words, so that all its lines sit centred in the box.
export function boxFirstBaseline(box: U15Box): number {
  return box.y + box.height / 2 - ((box.words.length - 1) * U15_BOX_WORD_SIZE * LABEL_LINE_HEIGHT) / 2 + U15_BOX_WORD_SIZE * 0.35;
}

function Box({ box, words }: { box: U15Box; words: boolean }) {
  const centre = box.x + box.width / 2;
  return (
    <g>
      <rect className={`tb-u15-box tb-u15-box-${box.kind}`} x={box.x} y={box.y} width={box.width} height={box.height} rx='8' />
      {words ? (
        <text className='tb-u15-box-text' x={centre} y={boxFirstBaseline(box)} textAnchor='middle' fontSize={U15_BOX_WORD_SIZE}>
          {box.words.map((word, index) => <tspan key={index} x={centre} dy={index === 0 ? undefined : `${LABEL_LINE_HEIGHT}em`}>{word}</tspan>)}
        </text>
      ) : null}
    </g>
  );
}

function Panel({ side, words }: { side: string; words: boolean }) {
  const panel = U15_LINK_PANELS[side];
  return (
    <>
      <rect className='tb-u15-link-panel' x={panel.x} y={panel.y} width={panel.width} height={panel.height} rx='10' />
      {U15_LINK_ARROWS[side].map((arrow, index) => (
        <path key={index} className='tb-u15-arrow' d={`M${arrow.from[0]} ${arrow.from[1]} L${arrow.to[0]} ${arrow.to[1]}`} markerEnd='url(#tb-u15-arrowhead)' />
      ))}
      {U15_LINK_BOXES[side].map((box, index) => <Box key={index} box={box} words={words} />)}
    </>
  );
}

// Registry regions (exactly): eurasia (left: one continent, two world
// parts), america (right: two continents, one world part). Not a map and not
// borders: boxes and arrows. The legend (which box is a continent, which a
// world part) is the same for both sides and drawn in every mode; the names
// in the boxes only in lessons and feedback. In a hotspot question the shape
// of each scheme is the task.
export default function ContinentWorldPartLinksDiagram(props: DiagramProps) {
  const words = props.mode !== 'hotspot';
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u15-arrowhead' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='7' markerHeight='7' orient='auto'>
          <path className='tb-u15-arrowhead' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <g className='tb-u15-link-legend' aria-hidden='true'>
        {U15_LINK_LEGEND.map((item) => (
          <g key={item.kind}>
            <rect className={`tb-u15-box tb-u15-box-${item.kind}`} x={item.swatch.x} y={item.swatch.y} width={item.swatch.width} height={item.swatch.height} rx='4' />
            <text className='tb-u15-legend-text' x={item.label.x} y={item.label.y} textAnchor={item.label.anchor} fontSize={item.label.fontSize}>{item.text}</text>
          </g>
        ))}
      </g>
      <DiagramRegion diagramId={ID} regionId='eurasia' props={props} hit={{ x: 4, y: 32, width: 174, height: 214 }}>
        <Panel side='eurasia' words={words} />
      </DiagramRegion>
      <DiagramRegion diagramId={ID} regionId='america' props={props} hit={{ x: 182, y: 32, width: 174, height: 214 }}>
        <Panel side='america' words={words} />
      </DiagramRegion>
    </DiagramSvg>
  );
}
