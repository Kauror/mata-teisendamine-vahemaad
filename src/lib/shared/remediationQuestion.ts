import type { ScienceData, ScienceTaskType } from '@/lib/loodusopetus/types';
import { normalizeMathAnswer } from '@/lib/shared/answerVerification';
import { remediationAnswerMatches } from '@/lib/shared/remediationAnswer';
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
  'science_choice',
  'math_text_answer'
] as const;

export type RemediationRendererType = (typeof REMEDIATION_RENDERER_TYPES)[number];

export function isRemediationRendererType(value: string): value is RemediationRendererType {
  return (REMEDIATION_RENDERER_TYPES as readonly string[]).includes(value);
}

// Answered by typing rather than by tapping one of a listed set of options, so
// there are no choices to build and no distractors to mix in.
export function isTypedAnswerRenderer(type: RemediationRendererType) {
  return type === 'math_numeric' || type === 'math_text_answer';
}

// The one place an answer is judged, so the screen's instant feedback and the
// score the server saves can never disagree.
//
// Typed maths answers are judged exactly as the runner judges them, unit words
// and all ("3 meetrit" = "3 m"), so revising a text problem is not stricter than
// getting it right first time. Everything else is a tap on a listed option,
// where the forgiving text comparison is enough.
export function isRemediationAnswerCorrect(question: RemediationQuestion, answer: unknown) {
  const accepted = question.acceptedAnswerLabels?.length ? question.acceptedAnswerLabels : [question.correctAnswerLabel];
  const matches = question.rendererType === 'math_text_answer'
    ? (label: string) => normalizeMathAnswer(answer) === normalizeMathAnswer(label)
    : (label: string) => remediationAnswerMatches(answer, label);
  return accepted.some(matches);
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
  // Some questions have several right answers ("Vali sobiv ühik vihiku laiuse
  // mõõtmiseks" accepts mm, cm and dm). correctAnswerLabel stays the one shown
  // as "the" answer; any of these is accepted. Absent means only that one is.
  acceptedAnswerLabels?: string[];
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
