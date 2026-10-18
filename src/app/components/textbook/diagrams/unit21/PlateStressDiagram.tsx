'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u21-plate-stress';

// Registry regions (exactly): locked (left panel, the jagged contact where the
// two blocks are stuck), stored-stress (left panel, low: the red arrows
// squeezing the rock and the bent layers — the questions name the arrows),
// slip (right panel: the same crack after the sudden jump). Not to scale.
// The panel captions are notes, so a hotspot question never shows "pärast nihet".
export default function PlateStressDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <marker id='tb-u21-ps-red' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u21-head-red' d='M0 0 L10 5 L0 10 Z' />
        </marker>
        <marker id='tb-u21-ps-green' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='5' markerHeight='5' orient='auto-start-reverse'>
          <path className='tb-u21-head-green' d='M0 0 L10 5 L0 10 Z' />
        </marker>
      </defs>
      <rect className='tb-u21-frame' x='0' y='0' width='360' height='250' rx='12' />
      <rect className='tb-u21-panel' x='6' y='28' width='170' height='216' rx='10' />
      <rect className='tb-u21-panel' x='184' y='28' width='170' height='216' rx='10' />

      {/* Left: before the slip. Two blocks of layered rock meet at a crack. */}
      <rect className='tb-u21-rock' x='12' y='96' width='158' height='142' />
      <path className='tb-u21-layer' d='M12 140 C50 140 78 144 92 154 M97 154 C112 164 140 168 170 168 M12 186 C50 186 78 190 93 198 M96 198 C112 206 140 210 170 210' />
      <path className='tb-u21-ground-line' d='M12 96 H170' />

      <DiagramRegion diagramId={ID} regionId='locked' props={props} hit={{ x: 64, y: 100, width: 60, height: 60 }}>
        <path className='tb-u21-crack-locked' d='M92 96 L99 108 L88 118 L99 128 L88 138 L97 148' />
        {/* Stitches across the jagged contact: here the blocks hold each other fast. */}
        <path className='tb-u21-stitch' d='M86 106 H102 M84 118 H102 M86 130 H102 M84 140 H100' />
      </DiagramRegion>
      <path className='tb-u21-crack' d='M97 148 L93 170 L96 238' />

      <DiagramRegion diagramId={ID} regionId='stored-stress' props={props} hit={{ x: 10, y: 172, width: 100, height: 62 }}>
        <path className='tb-u21-stress' d='M18 204 H70' markerEnd='url(#tb-u21-ps-red)' />
        <path className='tb-u21-stress' d='M166 204 H120' markerEnd='url(#tb-u21-ps-red)' />
      </DiagramRegion>

      {/* Right: after the slip. The right block has jumped up along the crack. */}
      <DiagramRegion diagramId={ID} regionId='slip' props={props} hit={{ x: 190, y: 64, width: 160, height: 172 }}>
        <rect className='tb-u21-rock' x='190' y='96' width='82' height='142' />
        <rect className='tb-u21-rock' x='272' y='80' width='76' height='158' />
        <path className='tb-u21-layer' d='M190 150 H272 M272 134 H348 M190 194 H272 M272 178 H348' />
        <path className='tb-u21-ground-line' d='M190 96 H272 V80 H348' />
        <path className='tb-u21-crack' d='M272 80 V238' />
        <path className='tb-u21-slip' d='M286 206 V164' markerEnd='url(#tb-u21-ps-green)' />
        <path className='tb-u21-slip' d='M258 164 V206' markerEnd='url(#tb-u21-ps-green)' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
