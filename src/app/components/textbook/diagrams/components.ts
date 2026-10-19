import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import { UNIT10_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit10Components';
import { UNIT11_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit11';
import { UNIT12_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit12';
import { UNIT13_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit13';
import { U14_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit14';
import { U15_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit15';
import { U16_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit16';
import { U17_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit17';
import { U18_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit18';
import { U19_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit19';
import { U20_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit20';
import { U21_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit21';

// Every React SVG component by registry ID (src/lib/textbook/diagramRegistry.ts),
// imported eagerly. For tests and tooling only: the app renders through
// DiagramView (./index.tsx), which loads each unit's pictures on demand so a
// textbook page does not ship every unit's maps.
export const DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  ...UNIT10_DIAGRAM_COMPONENTS,
  ...UNIT11_DIAGRAM_COMPONENTS,
  ...UNIT12_DIAGRAM_COMPONENTS,
  ...UNIT13_DIAGRAM_COMPONENTS,
  ...U14_DIAGRAM_COMPONENTS,
  ...U15_DIAGRAM_COMPONENTS,
  ...U16_DIAGRAM_COMPONENTS,
  ...U17_DIAGRAM_COMPONENTS,
  ...U18_DIAGRAM_COMPONENTS,
  ...U19_DIAGRAM_COMPONENTS,
  ...U20_DIAGRAM_COMPONENTS,
  ...U21_DIAGRAM_COMPONENTS
};
