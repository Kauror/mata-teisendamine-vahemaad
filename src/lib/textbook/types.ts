// The textbook learning framework's content model: Course → Unit → Lesson →
// Section → ContentBlock, and Unit → LearningObjective / Question. Everything
// here is plain, JSON-serialisable data with no functions, so a course is just a
// TypeScript module of declarative values that the validator
// (./validator.ts) checks before a unit can be published. There is no HTML and
// no code in content: only the block types below and diagrams registered in
// ./diagramRegistry.ts.
//
// Client-safe: no server-only imports. The answer keys live on Question, so the
// browser must only ever receive the stripped view from ./api.ts
// (`toClientQuestion`).

import type { Learner } from '@/lib/shared/types';

/* ---------------------------------------------------------------- sources */

// Where a block, objective or question comes from. `textbook` = the course
// textbook (page numbers when known); `supplementary` = another verified source
// (URL + attribution expected).
export type SourceKind = 'textbook' | 'supplementary';

export type SourceRef = {
  kind: SourceKind;
  // Textbook page (or "44–45"). Optional for supplementary sources.
  pages?: string;
  url?: string;
  attribution?: string;
  note?: string;
};

/* ------------------------------------------------------------- rich text */

// Inline text. A plain string, or segments where a segment may be emphasised
// (`strong`) or marked as a key term (`term`, rendered highlighted). Nothing
// else: no links, no HTML.
export type InlineSegment = { text: string; emphasis?: 'strong' | 'term' };
export type RichText = string | InlineSegment[];

/* ---------------------------------------------------------- content blocks */

type BlockBase = {
  // Unique within the unit. Stable: used as the React key and in validation
  // messages.
  id: string;
  source?: SourceRef;
};

export type HeadingBlock = BlockBase & { type: 'heading'; text: string; level?: 2 | 3 };
export type ParagraphBlock = BlockBase & { type: 'paragraph'; text: RichText };
export type ListBlock = BlockBase & { type: 'list'; ordered?: boolean; items: RichText[] };
export type DefinitionBlock = BlockBase & { type: 'definition'; term: string; definition: RichText };
// "Jäta meelde!" recap box. `title` defaults to "Jäta meelde!".
export type KeyFactBlock = BlockBase & { type: 'keyFact'; title?: string; items: RichText[] };
// Side-by-side comparison (e.g. two or three things and their properties).
export type ComparisonBlock = BlockBase & {
  type: 'comparison';
  title?: string;
  columns: Array<{ heading: string; points: RichText[] }>;
};
export type TableBlock = BlockBase & {
  type: 'table';
  caption?: string;
  headers: string[];
  // Every row has exactly headers.length cells.
  rows: string[][];
};
// A registered diagram (see diagramRegistry.ts). Lesson diagrams show their
// region labels; `description` overrides the registry's accessible text.
export type DiagramBlock = BlockBase & { type: 'diagram'; diagramId: string; description?: string; caption?: string };
export type CaptionBlock = BlockBase & { type: 'caption'; text: string };
export type ExternalResourceType = 'article' | 'gallery' | 'video' | 'interactive';
// Optional further reading. Rendered as a plain link; no third-party script is
// ever loaded and a resource is never required for unlocking or tested.
export type ExternalResourceBlock = BlockBase & {
  type: 'externalResource';
  title: string;
  intro: string;
  url: string;
  publisher: string;
  resourceType: ExternalResourceType;
  imageCredit?: string;
  // "Mida jälgida?" note.
  observe?: string;
  // Reserved for later (SPEC D4): renders nothing now.
  qr?: boolean;
};
// "Lisateadmine" (extra) or "Huvitav fakt" (fun_fact). Optional material:
// questions must not depend on it.
export type EnrichmentBlock = BlockBase & {
  type: 'enrichment';
  variant: 'extra' | 'fun_fact';
  title?: string;
  body: RichText[];
};

export type ContentBlock =
  | HeadingBlock
  | ParagraphBlock
  | ListBlock
  | DefinitionBlock
  | KeyFactBlock
  | ComparisonBlock
  | TableBlock
  | DiagramBlock
  | CaptionBlock
  | ExternalResourceBlock
  | EnrichmentBlock;

export type ContentBlockType = ContentBlock['type'];

export const CONTENT_BLOCK_TYPES: readonly ContentBlockType[] = [
  'heading', 'paragraph', 'list', 'definition', 'keyFact', 'comparison', 'table', 'diagram', 'caption', 'externalResource', 'enrichment'
];

/* ---------------------------------------------------------------- lessons */

// One screen of reading (SPEC D1: one section per screen with "Edasi").
export type LessonSection = { id: string; title?: string; blocks: ContentBlock[] };

export type Lesson = {
  id: string;
  title: string;
  // 1-based position within the unit; unique.
  order: number;
  // Required lessons must all be read before practice opens.
  required: boolean;
  objectiveIds: string[];
  sections: LessonSection[];
};

/* ------------------------------------------------------------- objectives */

export type LearningObjective = {
  id: string;
  // Child-readable Estonian ("Oskan nimetada …"). Shown after a failed test as
  // a concept to revise.
  description: string;
  // Required objectives must be satisfied in practice and covered by the test.
  required: boolean;
  sources: SourceRef[];
};

/* -------------------------------------------------------------- questions */

export type CognitiveLevel = 'factual' | 'understanding' | 'application';
export const COGNITIVE_LEVELS: readonly CognitiveLevel[] = ['factual', 'understanding', 'application'];

// 1 = easy, 2 = medium, 3 = harder.
export type Difficulty = 1 | 2 | 3;

// Presentation context shown above the stem. Grading NEVER reads it.
export type QuestionContext =
  | { kind: 'text'; title?: string; paragraphs: RichText[] }
  | { kind: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { kind: 'diagram'; diagramId: string; description?: string };

// An option / item / prompt / group. IDs are stable and unique within the
// question; answers are always compared by ID, never by displayed text.
export type AnswerItem = { id: string; text: string };

export type SingleChoiceAnswer = {
  type: 'single_choice';
  options: AnswerItem[];
  correctOptionId: string;
  // Keep the authored option order (e.g. "Õige"/"Vale", or numbers in order)
  // instead of shuffling.
  keepOptionOrder?: boolean;
};

export type MultipleSelectionAnswer = {
  type: 'multiple_selection';
  options: AnswerItem[];
  // At least one, never all options.
  correctOptionIds: string[];
  keepOptionOrder?: boolean;
};

// Each prompt is paired with exactly one choice; a choice is used at most once.
// `choices` may contain extra distractors.
export type MatchingAnswer = {
  type: 'matching';
  prompts: AnswerItem[];
  choices: AnswerItem[];
  correctPairs: Record<string, string>; // promptId → choiceId
};

// Every item belongs to exactly one group.
export type GroupingAnswer = {
  type: 'grouping';
  groups: AnswerItem[];
  items: AnswerItem[];
  correctGroupByItem: Record<string, string>; // itemId → groupId
};

export type OrderingAnswer = {
  type: 'ordering';
  items: AnswerItem[];
  correctOrder: string[]; // item IDs, first → last
  // What the two ends mean, e.g. "Kõige ülemine" / "Kõige alumine".
  firstLabel?: string;
  lastLabel?: string;
};

// Locate on a registered diagram. Regions are stable IDs from the registry,
// never pixel coordinates. The UI renders the diagram WITHOUT region labels
// (markers only) and also offers an accessible list of region buttons.
export type DiagramHotspotAnswer = {
  type: 'diagram_hotspot';
  diagramId: string;
  // The selectable regions, defaults to every region of the diagram.
  regionIds?: string[];
  correctRegionId: string;
};

export type AnswerSpec =
  | SingleChoiceAnswer
  | MultipleSelectionAnswer
  | MatchingAnswer
  | GroupingAnswer
  | OrderingAnswer
  | DiagramHotspotAnswer;

export type AnswerType = AnswerSpec['type'];
export const ANSWER_TYPES: readonly AnswerType[] = [
  'single_choice', 'multiple_selection', 'matching', 'grouping', 'ordering', 'diagram_hotspot'
];

export type Question = {
  id: string;
  unitId: string;
  stem: string;
  context?: QuestionContext;
  // Exactly one. Only a correct answer satisfies it (practice) and test
  // coverage is counted by it.
  primaryObjectiveId: string;
  // Reporting only.
  relatedObjectiveIds?: string[];
  // Questions too similar to appear in the same test share a group.
  variantGroupId: string;
  cognitiveLevel: CognitiveLevel;
  difficulty: Difficulty;
  eligibility: { practice: boolean; test: boolean };
  explanation: string;
  // Shown after a wrong answer when the mistake is a known misconception.
  misconception?: string;
  sources: SourceRef[];
  answer: AnswerSpec;
};

/* -------------------------------------------------------- learner answers */

// What the browser sends. Shapes per answer type; all values are IDs.
export type SingleChoiceResponse = { type: 'single_choice'; optionId: string };
export type MultipleSelectionResponse = { type: 'multiple_selection'; optionIds: string[] };
export type MatchingResponse = { type: 'matching'; pairs: Record<string, string> }; // promptId → choiceId
export type GroupingResponse = { type: 'grouping'; assignments: Record<string, string> }; // itemId → groupId
export type OrderingResponse = { type: 'ordering'; order: string[] };
export type DiagramHotspotResponse = { type: 'diagram_hotspot'; regionId: string };

export type AnswerResponse =
  | SingleChoiceResponse
  | MultipleSelectionResponse
  | MatchingResponse
  | GroupingResponse
  | OrderingResponse
  | DiagramHotspotResponse;

/* ------------------------------------------------------------ unit/course */

// Authoring status of the content in the repo. Publication (visible to the
// child) is a separate, parent-controlled flag stored in the database (SPEC
// D6); a 'draft' unit can never be published.
export type UnitContentStatus = 'draft' | 'ready';

export type PageRange = { from: number; to: number; note?: string };

export type Unit = {
  id: string;
  courseId: string;
  // Textbook unit number; units are ordered by it.
  number: number;
  title: string;
  pages?: PageRange;
  status: UnitContentStatus;
  // Bump whenever lessons, objectives or questions change. Stored with every
  // session; running sessions keep their own frozen copy.
  contentVersion: string;
  objectives: LearningObjective[];
  lessons: Lesson[];
  questions: Question[];
};

export type LevelDistribution = Record<CognitiveLevel, number>;

export type CourseSettings = {
  testLength: number;
  // Pass rule as an integer fraction: 95/100 → requiredCorrect = ceil(n·95/100).
  passNumerator: number;
  passDenominator: number;
  // Test questions per cognitive level; sums to testLength.
  levelDistribution: LevelDistribution;
  // Planned questions in a normal practice run (corrections come on top).
  practiceTarget: number;
  // After a failed test a targeted practice run is required before a new test.
  retakePracticeRequired: boolean;
};

export type CourseSubject = 'loodusopetus';

export type Course = {
  id: string;
  title: string;
  subject: CourseSubject;
  // Learners who may see the course. A preview-only course has no real learner.
  learners: Learner[];
  // Demo/preview content: never listed for a child, never served by child
  // routes, only reachable through the authenticated parent preview.
  previewOnly: boolean;
  settings: CourseSettings;
  // Ordered by unit number.
  units: Unit[];
};

export const DEFAULT_COURSE_SETTINGS: CourseSettings = {
  testLength: 20,
  passNumerator: 95,
  passDenominator: 100,
  levelDistribution: { factual: 8, understanding: 7, application: 5 },
  practiceTarget: 12,
  retakePracticeRequired: true
};

// Stable IDs: lowercase letters, digits and hyphens, starting with a letter or
// digit. Independent of titles.
export const ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/u;
