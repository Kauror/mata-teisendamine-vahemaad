import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import EuropeAreaDiagram from '@/app/components/textbook/diagrams/unit18/EuropeAreaDiagram';
import EuropeBordersDiagram from '@/app/components/textbook/diagrams/unit18/EuropeBordersDiagram';
import EuropePopulationDiagram from '@/app/components/textbook/diagrams/unit18/EuropePopulationDiagram';
import EuropeWorldDiagram from '@/app/components/textbook/diagrams/unit18/EuropeWorldDiagram';

// Unit 18 "Euroopa kaart": spread into DIAGRAM_COMPONENTS.
export const U18_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u18-europe-world': EuropeWorldDiagram,
  'u18-europe-borders': EuropeBordersDiagram,
  'u18-europe-area': EuropeAreaDiagram,
  'u18-europe-population': EuropePopulationDiagram
};
