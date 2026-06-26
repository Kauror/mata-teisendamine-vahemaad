// Types for Kiur's "Loodusõpetus" (science) mixed-practice tasks. The data lives
// in src/data/kiurLoodusopetusTasks.json (a .txt-sourced JSON) and is loaded and
// typed in ./tasks.ts. Fields mirror the source file exactly so nothing is lost.

export type ScienceTaskType =
  | 'visual_choice'
  | 'reading_choice'
  | 'sort'
  | 'match'
  | 'data_evidence';

export type ScienceDifficulty = 'easy' | 'medium' | string;

export type ScienceChoice = {
  id: string;
  text: string;
};

type ScienceTaskBase = {
  id: string;
  subject: 'loodusopetus';
  targetLearner: 'kiur';
  gradeBand: string;
  topic: string;
  difficulty: ScienceDifficulty;
  title: string;
  prompt: string;
  explanation: string;
  interactiveIdea?: string;
  tags: string[];
};

export type VisualChoiceTask = ScienceTaskBase & {
  type: 'visual_choice';
  diagram: string;
  diagramExplanation: string;
  choices: ScienceChoice[];
  correctAnswer: string;
  correctAnswerText: string;
};

export type ReadingChoiceTask = ScienceTaskBase & {
  type: 'reading_choice';
  text: string;
  choices: ScienceChoice[];
  correctAnswer: string;
  correctAnswerText: string;
};

export type SortTask = ScienceTaskBase & {
  type: 'sort';
  groups: string[];
  items: string[];
  correctGroups: Record<string, string[]>;
};

export type MatchTask = ScienceTaskBase & {
  type: 'match';
  terms: string[];
  definitions: string[];
  correctMatches: Record<string, string>;
};

// A flexible evidence payload: most tasks carry a `table`, a few instead carry a
// short `example`/`setup` text, a `diagram` sketch, or label/value `cards`.
export type ScienceData = {
  table?: string[][];
  example?: string;
  setup?: string;
  diagram?: string;
  cards?: string[][];
};

export type DataEvidenceTask = ScienceTaskBase & {
  type: 'data_evidence';
  data: ScienceData;
  choices: ScienceChoice[];
  correctAnswer: string;
  correctAnswerText: string;
  // A small number of data tasks also include a top-level diagram sketch.
  diagram?: string;
  diagramExplanation?: string;
};

export type ScienceTask =
  | VisualChoiceTask
  | ReadingChoiceTask
  | SortTask
  | MatchTask
  | DataEvidenceTask;

// Tasks that are answered by picking one of several labelled choices.
export type ChoiceScienceTask = VisualChoiceTask | ReadingChoiceTask | DataEvidenceTask;

export function isChoiceTask(task: ScienceTask): task is ChoiceScienceTask {
  return task.type === 'visual_choice' || task.type === 'reading_choice' || task.type === 'data_evidence';
}

export type ScienceMetadata = {
  title: string;
  language: string;
  subject: { id: string; name: string; emoji: string };
  targetLearner: string;
  gradeBand: string;
  exerciseCount: number;
  exerciseMix: Record<ScienceTaskType, number>;
  recommendedSessionSizes: number[];
  [key: string]: unknown;
};

export type ScienceDataset = {
  metadata: ScienceMetadata;
  tasks: ScienceTask[];
};
