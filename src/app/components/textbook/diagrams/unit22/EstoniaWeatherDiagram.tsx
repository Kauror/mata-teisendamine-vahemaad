'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { Cloud, Flake, Rain } from '@/app/components/textbook/diagrams/unit22/shapes';
import { U22_WEATHER_WIDTH, U22_WEATHER_X } from '@/app/components/textbook/diagrams/unit22/layouts';

const ID = 'u22-estonia-weather';

// The textbook's (p 83) dangerous weather in Estonia, five cards left to
// right. Registry regions (exactly): downpour (dark cloud, dense rain, a
// puddle), wind (a tree bending, wind lines, a flying branch), blizzard (snow
// driven sideways by the wind over a drift: snow AND wind), frost (a cold
// thermometer and icicles, no falling snow, so it is not the blizzard), heat
// (a blazing sun, heat waves, a hot thermometer). Every card is a different
// kind of weather; the two thermometers differ by level and colour.
function Panel({ index }: { index: number }) {
  return <rect className='tb-u22-panel' x={U22_WEATHER_X[index]} y='4' width={U22_WEATHER_WIDTH} height='212' rx='10' />;
}

export default function EstoniaWeatherDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u22-frame' x='0' y='0' width='360' height='220' rx='12' />

      <DiagramRegion diagramId={ID} regionId='downpour' props={props} hit={{ x: 5, y: 6, width: 66, height: 150 }}>
        <Panel index={0} />
        <Cloud x={38} y={58} scale={0.75} dark />
        <Rain x0={24} y={72} count={5} step={8} length={34} />
        <ellipse className='tb-u22-puddle' cx='38' cy='134' rx='26' ry='6' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='wind' props={props} hit={{ x: 76, y: 6, width: 66, height: 150 }}>
        <Panel index={1} />
        <path className='tb-u22-ground-line' d='M80 150 H138' />
        <path className='tb-u22-trunk-line' d='M100 150 Q101 120 116 98' />
        <ellipse className='tb-u22-crown' cx='122' cy='90' rx='16' ry='11' transform='rotate(32 122 90)' />
        <path className='tb-u22-wind' d='M80 64 q10 -4 20 0 t20 0 M80 116 q8 -3 16 0 t14 0' />
        <path className='tb-u22-branch' d='M124 124 l12 -6 M130 121 l2 -6' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='blizzard' props={props} hit={{ x: 147, y: 6, width: 66, height: 150 }}>
        <Panel index={2} />
        <Cloud x={180} y={56} scale={0.7} />
        <path className='tb-u22-wind' d='M150 90 q12 -4 24 0 t24 0 M150 126 q12 -4 24 0 t24 0' />
        <Flake x={164} y={80} r={5} />
        <Flake x={184} y={100} r={5} />
        <Flake x={202} y={114} r={4} />
        <Flake x={166} y={112} r={4} />
        <Flake x={198} y={80} r={4} />
        <path className='tb-u22-snowdrift' d='M150 150 Q172 132 200 140 Q209 143 212 150 Z' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='frost' props={props} hit={{ x: 218, y: 6, width: 66, height: 150 }}>
        <Panel index={3} />
        <rect className='tb-u22-eave' x='221' y='44' width='60' height='6' rx='2' />
        <path className='tb-u22-ice' d='M226 50 l3 14 l3 -14 Z M238 50 l3 22 l3 -22 Z M262 50 l3 12 l3 -12 Z M272 50 l3 18 l3 -18 Z' />
        <rect className='tb-u22-thermo' x='245' y='80' width='12' height='58' rx='6' />
        <rect className='tb-u22-thermo-cold' x='248' y='124' width='6' height='16' />
        <circle className='tb-u22-thermo-cold' cx='251' cy='140' r='9' />
        <path className='tb-u22-tick' d='M259 88 h6 M259 100 h6 M259 112 h6 M259 124 h6' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='heat' props={props} hit={{ x: 289, y: 6, width: 66, height: 150 }}>
        <Panel index={4} />
        <circle className='tb-u22-sun' cx='310' cy='68' r='13' />
        <path className='tb-u22-ray' d='M310 49 V44 M310 87 V92 M291 68 H296 M324 68 H329 M297 55 L294 52 M323 55 L326 52 M297 81 L294 84 M323 81 L326 84' />
        <path className='tb-u22-heat' d='M298 132 q5 -6 0 -12 t0 -12 M310 136 q5 -6 0 -12 t0 -12' />
        <rect className='tb-u22-thermo' x='326' y='80' width='12' height='58' rx='6' />
        <rect className='tb-u22-thermo-hot' x='329' y='86' width='6' height='54' />
        <circle className='tb-u22-thermo-hot' cx='332' cy='140' r='9' />
        <path className='tb-u22-tick' d='M340 88 h6 M340 100 h6 M340 112 h6 M340 124 h6' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
