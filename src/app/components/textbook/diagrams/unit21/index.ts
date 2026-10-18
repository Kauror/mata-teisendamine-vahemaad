import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import AftershockSafetyDiagram from '@/app/components/textbook/diagrams/unit21/AftershockSafetyDiagram';
import CoastalEscapeDiagram from '@/app/components/textbook/diagrams/unit21/CoastalEscapeDiagram';
import DropCoverHoldDiagram from '@/app/components/textbook/diagrams/unit21/DropCoverHoldDiagram';
import FocusWavesDiagram from '@/app/components/textbook/diagrams/unit21/FocusWavesDiagram';
import OutdoorsDiagram from '@/app/components/textbook/diagrams/unit21/OutdoorsDiagram';
import PlateStressDiagram from '@/app/components/textbook/diagrams/unit21/PlateStressDiagram';
import TsunamiStagesDiagram from '@/app/components/textbook/diagrams/unit21/TsunamiStagesDiagram';
import TsunamiWarningsDiagram from '@/app/components/textbook/diagrams/unit21/TsunamiWarningsDiagram';
import WorldLocationsDiagram from '@/app/components/textbook/diagrams/unit21/WorldLocationsDiagram';

// Unit 21 "Maavärinad": spread into DIAGRAM_COMPONENTS.
export const U21_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u21-plate-stress': PlateStressDiagram,
  'u21-focus-waves': FocusWavesDiagram,
  'u21-world-locations': WorldLocationsDiagram,
  'u21-tsunami-stages': TsunamiStagesDiagram,
  'u21-tsunami-warnings': TsunamiWarningsDiagram,
  'u21-coastal-escape': CoastalEscapeDiagram,
  'u21-drop-cover-hold': DropCoverHoldDiagram,
  'u21-outdoors': OutdoorsDiagram,
  'u21-aftershock-safety': AftershockSafetyDiagram
};
