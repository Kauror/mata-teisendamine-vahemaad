import type { ScienceData, ScienceTaskType } from '@/lib/loodusopetus/types';
import type { QuestionVisual } from '@/lib/types';

// The question contract between the Kordamine builder (server, needs `db`) and
// the Kordamine screen (browser). Client-safe so the screen can import it
// instead of keeping its own copy — the copy is how a screen ends up silently
// out of step with the renderer types the server actually emits.

// Every renderer the app can put on screen. A stored mistake whose type is not
// in this list (written by a newer build, or a renderer since retired) is
// skipped rather than trusted, so the pool can always be read by any version.
export const REMEDIATION_RENDERER_TYPES = [
  'math_numeric',
  'math_multiple_choice',
  'counting_choice',
  'initial_sound',
  'word_choice',
  'word_picture_choice',
  'sprint_word_choice',
  'science_choice'
] as const;

export type RemediationRendererType = (typeof REMEDIATION_RENDERER_TYPES)[number];

export function isRemediationRendererType(value: string): value is RemediationRendererType {
  return (REMEDIATION_RENDERER_TYPES as readonly string[]).includes(value);
}

export type RemediationQuestion = {
  sessionItemId: number;
  mistakeId: number;
  rendererType: RemediationRendererType;
  promptText: string;
  promptImage?: string;
  promptEmoji?: string;
  objectLabel?: string;
  count?: number;
  targetWord?: string;
  readingText?: string;
  correctAnswerLabel: string;
  expectedUnit?: string;
  clockHour?: number;
  clockMinutes?: 0 | 15 | 30 | 45;
  // "Milline sirglõik on raadius?" with options A/B/C is unanswerable without
  // its drawing, so the drawing travels with the question.
  promptVisual?: QuestionVisual;
  promptVisualKnownDegrees?: number;
  // 'science_choice' only. Everything shown is re-read from the task dataset by
  // id at session build time, so nothing here can drift out of step with it.
  scienceTaskId?: string;
  scienceTitle?: string;
  scienceTaskType?: ScienceTaskType;
  scienceDiagram?: string;
  scienceData?: ScienceData;
  choices?: string[];
};
