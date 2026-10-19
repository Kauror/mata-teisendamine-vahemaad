'use client';

import { DiagramNotes, DiagramRegion, DiagramSvg, type DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

const ID = 'u20-eruption-products';

const GROUND_Y = 200;
const ROCKS = [{ x: 252, y: 58 }, { x: 318, y: 62 }, { x: 264, y: 98 }, { x: 314, y: 100 }] as const;

// What an eruption can throw out (p 75): a grey ash cloud of fine rock and
// glass grains (not smoke: no fire anywhere, the grains drawn as dots), rock
// lumps flying out on dashed paths, and lava flowing down the slope. Registry
// regions (exactly): ash (above the top), rocks (upper right), lava (right
// slope, lower right).
export default function EruptionProductsDiagram(props: DiagramProps) {
  return (
    <DiagramSvg diagramId={ID} mode={props.mode} description={props.description}>
      <rect className='tb-u20-frame' x='0' y='0' width='360' height='250' rx='12' />
      <rect className='tb-u20-ground' x='4' y={GROUND_Y} width='352' height='46' />
      <path className='tb-u20-cone' d='M84 200 L160 112 Q172 120 184 112 L260 200 Z' />
      <path className='tb-u20-surface' d={`M4 ${GROUND_Y} H356`} />

      <DiagramRegion diagramId={ID} regionId='ash' props={props} hit={{ x: 116, y: 6, width: 112, height: 62 }}>
        <path className='tb-u20-ash' d='M164 114 C162 98 160 84 156 68 L188 68 C184 84 182 98 180 114 Z' />
        <path className='tb-u20-ash' d='M134 60 C118 56 120 34 138 34 C136 16 160 8 172 18 C182 6 208 10 210 26 C228 26 230 50 214 56 C206 68 184 70 172 62 C160 70 140 68 134 60 Z' />
        <circle className='tb-u20-grain' cx='150' cy='46' r='1.6' />
        <circle className='tb-u20-grain' cx='166' cy='30' r='1.6' />
        <circle className='tb-u20-grain' cx='194' cy='40' r='1.6' />
        <circle className='tb-u20-grain' cx='182' cy='54' r='1.6' />
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='rocks' props={props} hit={{ x: 236, y: 44, width: 100, height: 66 }}>
        <path className='tb-u20-path' d='M184 112 Q214 40 246 54 M184 112 Q260 20 312 58 M184 112 Q230 70 258 94 M184 112 Q270 60 308 96' />
        {ROCKS.map((rock) => (
          <path key={`${rock.x}-${rock.y}`} className='tb-u20-lump' d={`M${rock.x - 7} ${rock.y} L${rock.x - 3} ${rock.y - 6} L${rock.x + 5} ${rock.y - 5} L${rock.x + 7} ${rock.y + 2} L${rock.x + 1} ${rock.y + 7} L${rock.x - 5} ${rock.y + 5} Z`} />
        ))}
      </DiagramRegion>

      <DiagramRegion diagramId={ID} regionId='lava' props={props} hit={{ x: 224, y: 136, width: 96, height: 62 }}>
        <path className='tb-u20-lava' d='M178 116 C196 134 214 156 230 176 C242 190 270 196 330 197 V202 H246 C230 194 216 178 204 162 C192 146 180 130 172 120 Z' />
      </DiagramRegion>
      <DiagramNotes diagramId={ID} mode={props.mode} />
    </DiagramSvg>
  );
}
