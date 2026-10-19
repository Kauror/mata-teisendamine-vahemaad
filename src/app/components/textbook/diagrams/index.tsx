'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { UNIT10_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit10Components';

export type { DiagramMode, DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';

type UnitDiagramProps = DiagramProps & { diagramId: string };
type ComponentMap = Record<string, ComponentType<DiagramProps>>;

function Missing() {
  return <p className='tb-diagram-missing'>Joonist ei saa näidata.</p>;
}

function Loading() {
  return <div className='tb-diagram-loading' aria-busy='true' />;
}

// One component per unit that draws the picture its `diagramId` names.
function fromMap(map: ComponentMap) {
  return function UnitDiagram({ diagramId, ...props }: UnitDiagramProps) {
    const Component = map[diagramId];
    return Component ? <Component {...props} /> : <Missing />;
  };
}

const Unit10 = fromMap(UNIT10_DIAGRAM_COMPONENTS);

// Units 11 onwards each go in their own chunk, keyed by the ID prefix ("u15-…"):
// the world and Europe maps alone are tens of kilobytes, and a page only ever
// shows one unit. Still rendered on the server, so the lesson HTML has them.
const LAZY_UNITS: Record<string, ComponentType<UnitDiagramProps>> = {
  u11: dynamic(() => import('@/app/components/textbook/diagrams/unit11').then((m) => fromMap(m.UNIT11_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u12: dynamic(() => import('@/app/components/textbook/diagrams/unit12').then((m) => fromMap(m.UNIT12_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u13: dynamic(() => import('@/app/components/textbook/diagrams/unit13').then((m) => fromMap(m.UNIT13_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u14: dynamic(() => import('@/app/components/textbook/diagrams/unit14').then((m) => fromMap(m.U14_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u15: dynamic(() => import('@/app/components/textbook/diagrams/unit15').then((m) => fromMap(m.U15_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u16: dynamic(() => import('@/app/components/textbook/diagrams/unit16').then((m) => fromMap(m.U16_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u17: dynamic(() => import('@/app/components/textbook/diagrams/unit17').then((m) => fromMap(m.U17_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u18: dynamic(() => import('@/app/components/textbook/diagrams/unit18').then((m) => fromMap(m.U18_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u19: dynamic(() => import('@/app/components/textbook/diagrams/unit19').then((m) => fromMap(m.U19_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u20: dynamic(() => import('@/app/components/textbook/diagrams/unit20').then((m) => fromMap(m.U20_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u21: dynamic(() => import('@/app/components/textbook/diagrams/unit21').then((m) => fromMap(m.U21_DIAGRAM_COMPONENTS)), { loading: Loading }),
  u22: dynamic(() => import('@/app/components/textbook/diagrams/unit22').then((m) => fromMap(m.U22_DIAGRAM_COMPONENTS)), { loading: Loading })
};

function unitFor(diagramId: string) {
  return diagramId in UNIT10_DIAGRAM_COMPONENTS ? Unit10 : LAZY_UNITS[diagramId.split('-')[0]];
}

// For the test that every registered picture has a way to be drawn.
export function hasDiagramView(diagramId: string) {
  return Boolean(unitFor(diagramId));
}

// The registry ID's prefix chooses the unit; the validator refuses content
// naming an ID that is not registered.
export function DiagramView({ diagramId, ...props }: UnitDiagramProps) {
  const definition = getDiagram(diagramId);
  const Unit = unitFor(diagramId);
  if (!Unit || !definition) return <Missing />;
  return (
    <div className='tb-diagram' data-mode={props.mode}>
      <Unit diagramId={diagramId} {...props} />
    </div>
  );
}
