import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import EruptionProductsDiagram from '@/app/components/textbook/diagrams/unit20/EruptionProductsDiagram';
import GeysersDiagram from '@/app/components/textbook/diagrams/unit20/GeysersDiagram';
import LayersGrowthDiagram from '@/app/components/textbook/diagrams/unit20/LayersGrowthDiagram';
import MagmaLavaDiagram from '@/app/components/textbook/diagrams/unit20/MagmaLavaDiagram';
import VolcanoCutawayDiagram from '@/app/components/textbook/diagrams/unit20/VolcanoCutawayDiagram';
import VolcanoLocationsDiagram from '@/app/components/textbook/diagrams/unit20/VolcanoLocationsDiagram';
import VolcanoStatesDiagram from '@/app/components/textbook/diagrams/unit20/VolcanoStatesDiagram';

// Unit 20 "Vulkaanid": spread into DIAGRAM_COMPONENTS.
export const U20_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u20-magma-lava': MagmaLavaDiagram,
  'u20-volcano-cutaway': VolcanoCutawayDiagram,
  'u20-eruption-products': EruptionProductsDiagram,
  'u20-layers-growth': LayersGrowthDiagram,
  'u20-volcano-locations': VolcanoLocationsDiagram,
  'u20-volcano-states': VolcanoStatesDiagram,
  'u20-geysers': GeysersDiagram
};
