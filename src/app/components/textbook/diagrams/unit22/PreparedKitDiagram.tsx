'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { U22_KIT_CARDS, U22_KIT_HEIGHT, U22_KIT_WIDTH } from '@/app/components/textbook/diagrams/unit22/layouts';

const ID = 'u22-prepared-kit';

// Supplies a family keeps ready (Päästeamet, Ole valmis!). Registry regions
// (exactly), one card each: water (bottles of drinking water, top left),
// flashlight (a torch and its beam, top centre), radio (a radio with antenna
// and a battery, top right), phone (a phone whose screen shows a full
// battery, bottom left), warning (a paper notice with a warning triangle and
// lines of text drawn as shapes, bottom right). Teaching material only, never
// something to collect or buy in the game.
function Panel({ id }: { id: keyof typeof U22_KIT_CARDS }) {
  const card = U22_KIT_CARDS[id];
  return <rect className='tb-u22-panel' x={card.x} y={card.y} width={U22_KIT_WIDTH} height={U22_KIT_HEIGHT} rx='10' />;
}

export default function PreparedKitDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u22-frame' x='0' y='0' width='360' height='280' rx='12' />

      <DiagramRegion diagramId={ID} regionId='water' props={props} hit={{ x: 6, y: 6, width: 108, height: 128 }}>
        <Panel id='water' />
        <rect className='tb-u22-cap' x='54' y='30' width='12' height='8' rx='2' />
        <rect className='tb-u22-bottle' x='56' y='37' width='8' height='8' />
        <rect className='tb-u22-bottle' x='44' y='44' width='32' height='50' rx='8' />
        <rect className='tb-u22-bottle-band' x='44' y='62' width='32' height='12' />
        <rect className='tb-u22-cap' x='87' y='50' width='10' height='7' rx='2' />
        <rect className='tb-u22-bottle' x='82' y='56' width='20' height='38' rx='6' />
        <rect className='tb-u22-bottle-band' x='82' y='68' width='20' height='9' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='flashlight' props={props} hit={{ x: 126, y: 6, width: 108, height: 128 }}>
        <Panel id='flashlight' />
        <path className='tb-u22-beam' d='M204 54 L232 40 V96 L204 82 Z' />
        <rect className='tb-u22-lamp-body' x='146' y='60' width='46' height='16' rx='4' />
        <path className='tb-u22-lamp-head' d='M190 56 L204 50 V86 L190 80 Z' />
        <rect className='tb-u22-lamp-button' x='160' y='55' width='9' height='5' rx='1' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='radio' props={props} hit={{ x: 246, y: 6, width: 108, height: 128 }}>
        <Panel id='radio' />
        <path className='tb-u22-antenna' d='M330 50 L344 26' />
        <rect className='tb-u22-radio' x='264' y='50' width='76' height='44' rx='6' />
        <circle className='tb-u22-speaker' cx='284' cy='72' r='12' />
        <path className='tb-u22-speaker-line' d='M276 68 H292 M276 76 H292' />
        <circle className='tb-u22-knob' cx='324' cy='64' r='5' />
        <rect className='tb-u22-dial' x='312' y='76' width='22' height='8' rx='2' />
        <rect className='tb-u22-battery' x='290' y='30' width='20' height='11' rx='2' />
        <rect className='tb-u22-battery' x='310' y='33' width='3' height='5' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='phone' props={props} hit={{ x: 66, y: 146, width: 108, height: 128 }}>
        <Panel id='phone' />
        <rect className='tb-u22-phone' x='100' y='166' width='40' height='68' rx='7' />
        <rect className='tb-u22-screen' x='104' y='174' width='32' height='50' rx='2' />
        <rect className='tb-u22-battery-outline' x='112' y='186' width='16' height='30' rx='2' />
        <rect className='tb-u22-battery-outline' x='117' y='182' width='6' height='4' />
        <path className='tb-u22-battery-full' d='M115 190 h10 v7 h-10 Z M115 199 h10 v7 h-10 Z M115 208 h10 v6 h-10 Z' />
        <circle className='tb-u22-home' cx='120' cy='229' r='2.5' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='warning' props={props} hit={{ x: 186, y: 146, width: 108, height: 128 }}>
        <Panel id='warning' />
        <rect className='tb-u22-paper' x='210' y='164' width='60' height='72' rx='4' />
        <path className='tb-u22-warn' d='M240 172 L259 204 H221 Z' />
        <rect className='tb-u22-warn-mark' x='238.5' y='182' width='3' height='13' rx='1' />
        <circle className='tb-u22-warn-mark' cx='240' cy='199' r='2' />
        <path className='tb-u22-text-line' d='M218 214 H262 M218 222 H256 M218 230 H260' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
