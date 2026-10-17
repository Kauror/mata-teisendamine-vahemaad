import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import MapPairDiagram from '@/app/components/textbook/diagrams/unit14/MapPairDiagram';
import PhysicalFeaturesDiagram from '@/app/components/textbook/diagrams/unit14/PhysicalFeaturesDiagram';
import PoliticalElementsDiagram from '@/app/components/textbook/diagrams/unit14/PoliticalElementsDiagram';
import PopulationMapDiagram from '@/app/components/textbook/diagrams/unit14/PopulationMapDiagram';

// Unit 14 "Kaartide mitmekesisus": spread into DIAGRAM_COMPONENTS.
export const U14_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u14-physical-features': PhysicalFeaturesDiagram,
  'u14-political-elements': PoliticalElementsDiagram,
  'u14-map-pair': MapPairDiagram,
  'u14-population-map': PopulationMapDiagram
};
