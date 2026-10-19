import type { ComponentType } from 'react';
import type { DiagramProps } from '@/app/components/textbook/diagrams/DiagramFrame';
import CoastalFloodDiagram from '@/app/components/textbook/diagrams/unit22/CoastalFloodDiagram';
import EstoniaWeatherDiagram from '@/app/components/textbook/diagrams/unit22/EstoniaWeatherDiagram';
import FloodSafetyDiagram from '@/app/components/textbook/diagrams/unit22/FloodSafetyDiagram';
import HazardScenariosDiagram from '@/app/components/textbook/diagrams/unit22/HazardScenariosDiagram';
import PreparedHomeDiagram from '@/app/components/textbook/diagrams/unit22/PreparedHomeDiagram';
import PreparedKitDiagram from '@/app/components/textbook/diagrams/unit22/PreparedKitDiagram';
import RainFloodDiagram from '@/app/components/textbook/diagrams/unit22/RainFloodDiagram';

// Unit 22 "Loodusõnnetused": spread into DIAGRAM_COMPONENTS.
export const U22_DIAGRAM_COMPONENTS: Record<string, ComponentType<DiagramProps>> = {
  'u22-hazard-scenarios': HazardScenariosDiagram,
  'u22-prepared-home': PreparedHomeDiagram,
  'u22-estonia-weather': EstoniaWeatherDiagram,
  'u22-rain-flood': RainFloodDiagram,
  'u22-coastal-flood': CoastalFloodDiagram,
  'u22-flood-safety': FloodSafetyDiagram,
  'u22-prepared-kit': PreparedKitDiagram
};
