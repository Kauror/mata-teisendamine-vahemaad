'use client';

import { DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u12-globe-flatmap';

// The flat map sheet, slightly tilted (a quadrilateral, not a rectangle).
const SHEET = '198,44 350,36 354,168 202,176';

// Registry regions (exactly): globe, flat-map. Left: a globe on a stand with
// pale-blue sea, invented land shapes and a meridian ring. Right: a flat
// paper map of invented land and sea. No text in the drawing: in hotspot mode
// nothing may say which is which.
export default function GlobeFlatMapDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <defs>
        <clipPath id='tb-u12-globe-clip'>
          <circle cx='96' cy='98' r='60' />
        </clipPath>
        <clipPath id='tb-u12-sheet-clip'>
          <polygon points={SHEET} />
        </clipPath>
      </defs>

      <DiagramRegion diagramId={ID} regionId='globe' props={props} hit={{ x: 14, y: 22, width: 164, height: 182 }}>
        {/* Stand: post and foot, then the meridian ring holding the ball. */}
        <path className='tb-u12-stand-line' d='M96 166 V190' />
        <ellipse className='tb-u12-stand' cx='96' cy='194' rx='36' ry='8' />
        <circle className='tb-u12-water' cx='96' cy='98' r='60' />
        <g clipPath='url(#tb-u12-globe-clip)'>
          <path className='tb-u12-land' d='M58 60 q16 -14 34 -6 q10 8 2 18 q-12 4 -10 16 q4 14 -8 22 q-12 4 -18 -8 q-8 -14 -14 -20 q2 -14 14 -22 z' />
          <path className='tb-u12-land' d='M110 70 q18 -8 30 6 q8 14 -2 26 q-8 12 -2 26 q-4 14 -16 10 q-10 -8 -8 -22 q-14 -6 -12 -24 q2 -14 10 -22 z' />
          <path className='tb-u12-land' d='M76 136 q12 -4 20 4 q2 10 -10 12 q-12 0 -10 -16 z' />
          {/* Equator and a meridian drawn as ellipses: they make it read as a ball. */}
          <ellipse className='tb-u12-graticule' cx='96' cy='98' rx='60' ry='16' />
          <ellipse className='tb-u12-graticule' cx='96' cy='98' rx='24' ry='60' />
          <circle className='tb-diagram-globe-light' cx='76' cy='76' r='26' />
          <circle className='tb-u12-globe-shade' cx='142' cy='140' r='66' />
        </g>
        <circle className='tb-u12-globe-edge' cx='96' cy='98' r='60' />
        <path className='tb-u12-stand-line' d='M96 30 A68 68 0 0 0 96 166' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='flat-map' props={props} hit={{ x: 190, y: 22, width: 166, height: 182 }}>
        <polygon className='tb-u12-sheet-shadow' points='204,50 356,42 360,174 208,182' />
        <polygon className='tb-u12-water' points={SHEET} />
        <g clipPath='url(#tb-u12-sheet-clip)'>
          <path className='tb-u12-land' d='M214 58 q22 -10 40 0 q8 14 -4 26 q-10 10 -4 28 q-6 16 -22 10 q-12 -12 -10 -30 q-12 -14 0 -34 z' />
          <path className='tb-u12-land' d='M276 54 q30 -8 54 2 q14 12 2 26 q-16 8 -14 22 q6 18 -10 26 q-18 4 -22 -14 q-4 -16 -18 -22 q-6 -24 8 -40 z' />
          <path className='tb-u12-land' d='M236 140 q14 -6 24 4 q-2 14 -14 14 q-12 -2 -10 -18 z M312 146 q14 -4 22 6 q-4 10 -16 8 q-8 -4 -6 -14 z' />
          {/* Straight grid lines and two paper folds. */}
          <path className='tb-u12-graticule' d='M190 84 L360 76 M192 128 L362 120 M248 30 L254 180 M300 30 L306 180' />
          <path className='tb-u12-fold' d='M249 40 L253 172 M301 38 L305 170' />
        </g>
        <polygon className='tb-u12-sheet-edge' points={SHEET} />
      </DiagramRegion>
    </DiagramSvg>
  );
}
