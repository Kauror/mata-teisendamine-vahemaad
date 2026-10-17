// The API CONTRACT between the textbook server (phase 2a) and the UI
// (phase 2b): route paths, request and response shapes, and the one helper
// that turns a frozen question into what the browser may see. Types only plus
// pure helpers — no database, no React, safe to import on both sides.
//
// Conventions (mirroring the English vocabulary sessions):
//  - Every mutating request carries `actionId` (client-minted, matches
//    ACTION_ID_PATTERN). Repeating the last action returns the stored result
//    without applying it again.
//  - Session actions also carry `revision` (the last revision the client saw).
//    A request based on an older revision is refused with code 'stale' and the
//    current session view in `session`, so another tab cannot double-apply.
//  - The server is the only authority: it grades, decides gates and unlocks,
//    and never sends an unrevealed answer key (see toClientQuestion).
//  - Child routes serve only courses with a real learner and `previewOnly:
//    false`, and only published units. Preview routes require parent auth, use
//    the isolated learner PREVIEW_LEARNER, treat every unit whose content
//    status is 'ready' as published, and switch off every real-world side
//    effect (rewards, attempts, streaks, unlocks, history) on the server.
//  - Online only: no offline queue, no precache for these routes.

import type { Learner } from '@/lib/shared/types';
import { getDiagram, type DiagramLookup } from '@/lib/textbook/diagramRegistry';
import type { PracticeMode, PracticeProgress } from '@/lib/textbook/practiceScheduler';
import type { FrozenQuestion } from '@/lib/textbook/presentation';
import type { UnitStatusCode } from '@/lib/textbook/progression';
import type {
  AnswerItem,
  AnswerResponse,
  CourseSettings,
  LearningObjective,
  Lesson,
  LessonSection,
  PageRange,
  Question,
  QuestionContext,
  UnitContentStatus
} from '@/lib/textbook/types';
import type { UnitStats, ValidationIssue } from '@/lib/textbook/validator';

/* ---------------------------------------------------------------- learners */

// The isolated parent-preview learner. Never a real child: no stars, shop,
// streaks, competitions, history or real unlocks are ever written for it.
export const PREVIEW_LEARNER = 'preview' as const;
export type TextbookLearner = Learner | typeof PREVIEW_LEARNER;
export type TextbookScope = 'child' | 'preview';

export const ACTION_ID_PATTERN = /^[A-Za-z0-9_-]{8,80}$/u;

/* ------------------------------------------------------------------ routes */

function enc(value: string) {
  return encodeURIComponent(value);
}

// API routes a learner (child or preview) uses. Same request/response types in
// both scopes; only the prefix and the server-side learner differ.
function learnerRoutes(base: string) {
  const unit = (courseId: string, unitId: string) => `${base}/courses/${enc(courseId)}/units/${enc(unitId)}`;
  return {
    // GET → CourseOverviewResponse
    courseOverview: (courseId: string) => `${base}/courses/${enc(courseId)}`,
    // GET → UnitDetailResponse
    unitDetail: unit,
    // GET → LessonContentResponse
    lesson: (courseId: string, unitId: string, lessonId: string) => `${unit(courseId, unitId)}/lessons/${enc(lessonId)}`,
    // POST ReadingCompleteRequest → ReadingCompleteResponse
    lessonComplete: (courseId: string, unitId: string, lessonId: string) => `${unit(courseId, unitId)}/lessons/${enc(lessonId)}/complete`,
    // POST PracticeStartRequest → PracticeSessionView (starts or resumes)
    practiceStart: (courseId: string, unitId: string) => `${unit(courseId, unitId)}/practice`,
    // POST TestStartRequest → TestSessionView (starts or resumes)
    testStart: (courseId: string, unitId: string) => `${unit(courseId, unitId)}/test`,
    // GET → PracticeSessionView
    practiceSession: (sessionId: string) => `${base}/practice/${enc(sessionId)}`,
    // POST PracticeAnswerRequest → PracticeAnswerResponse
    practiceAnswer: (sessionId: string) => `${base}/practice/${enc(sessionId)}/answer`,
    // GET → TestSessionView
    testSession: (sessionId: string) => `${base}/test/${enc(sessionId)}`,
    // POST TestAnswerRequest → TestAnswerResponse (no feedback)
    testAnswer: (sessionId: string) => `${base}/test/${enc(sessionId)}/answer`,
    // POST TestSubmitRequest → TestSubmitResponse
    testSubmit: (sessionId: string) => `${base}/test/${enc(sessionId)}/submit`
  };
}

export const CHILD_API_BASE = '/api/textbook';
export const PREVIEW_API_BASE = '/api/parent/textbook/preview';
export const PARENT_API_BASE = '/api/parent/textbook';

export const TEXTBOOK_API = {
  child: learnerRoutes(CHILD_API_BASE),
  preview: learnerRoutes(PREVIEW_API_BASE),
  parent: {
    // GET → ParentOverviewResponse
    overview: PARENT_API_BASE,
    // GET → ParentUnitDetailResponse (with answer keys: parent only)
    unit: (courseId: string, unitId: string) => `${PARENT_API_BASE}/courses/${enc(courseId)}/units/${enc(unitId)}`,
    // POST PublishRequest → ParentUnitResponse | 422 validation_failed
    publish: (courseId: string, unitId: string) => `${PARENT_API_BASE}/courses/${enc(courseId)}/units/${enc(unitId)}/publish`,
    // POST ManualUnlockRequest → ParentUnitResponse
    unlock: (courseId: string, unitId: string) => `${PARENT_API_BASE}/courses/${enc(courseId)}/units/${enc(unitId)}/unlock`,
    // POST PreviewStartRequest → CourseOverviewResponse (preview scope)
    previewStart: `${PREVIEW_API_BASE}/start`,
    // POST PreviewResetRequest → PreviewResetResponse
    previewReset: `${PREVIEW_API_BASE}/reset`
  }
} as const;

export function learnerApi(scope: TextbookScope) {
  return scope === 'child' ? TEXTBOOK_API.child : TEXTBOOK_API.preview;
}

// Next.js route-file patterns the server implements (app/api/...).
export const TEXTBOOK_ROUTE_PATTERNS = {
  child: [
    '/api/textbook/courses/[courseId]',
    '/api/textbook/courses/[courseId]/units/[unitId]',
    '/api/textbook/courses/[courseId]/units/[unitId]/lessons/[lessonId]',
    '/api/textbook/courses/[courseId]/units/[unitId]/lessons/[lessonId]/complete',
    '/api/textbook/courses/[courseId]/units/[unitId]/practice',
    '/api/textbook/courses/[courseId]/units/[unitId]/test',
    '/api/textbook/practice/[sessionId]',
    '/api/textbook/practice/[sessionId]/answer',
    '/api/textbook/test/[sessionId]',
    '/api/textbook/test/[sessionId]/answer',
    '/api/textbook/test/[sessionId]/submit'
  ],
  parent: [
    '/api/parent/textbook',
    '/api/parent/textbook/courses/[courseId]/units/[unitId]',
    '/api/parent/textbook/courses/[courseId]/units/[unitId]/publish',
    '/api/parent/textbook/courses/[courseId]/units/[unitId]/unlock',
    '/api/parent/textbook/preview/start',
    '/api/parent/textbook/preview/reset',
    // …plus every child pattern above under /api/parent/textbook/preview
    '/api/parent/textbook/preview/courses/[courseId]',
    '/api/parent/textbook/preview/practice/[sessionId]',
    '/api/parent/textbook/preview/test/[sessionId]'
  ]
} as const;

// Child pages (course loodusopetus-opik is the one Kiur sees).
export const TEXTBOOK_PAGES = {
  childCourse: '/kiur/loodusopetus/opik',
  childUnit: (unitId: string) => `/kiur/loodusopetus/opik/${enc(unitId)}`,
  childLesson: (unitId: string, lessonId: string) => `/kiur/loodusopetus/opik/${enc(unitId)}/lugemine/${enc(lessonId)}`,
  childPractice: (unitId: string) => `/kiur/loodusopetus/opik/${enc(unitId)}/harjuta`,
  childTest: (unitId: string) => `/kiur/loodusopetus/opik/${enc(unitId)}/test`,
  // Parent preview of any course (incl. the demo).
  previewCourse: (courseId: string) => `/vanem/oppetukid/eelvaade/${enc(courseId)}`,
  previewUnit: (courseId: string, unitId: string) => `/vanem/oppetukid/eelvaade/${enc(courseId)}/${enc(unitId)}`
} as const;

/* ----------------------------------------------------------------- shared */

export type ActionRequest = { actionId: string };
export type SessionActionRequest = ActionRequest & { revision: number };

export type ObjectiveRef = { objectiveId: string; description: string; required: boolean };
export type UnitRef = { unitId: string; number: number; title: string };
export type CourseRef = { courseId: string; title: string; previewOnly: boolean };

export type TextbookErrorCode =
  | 'unauthorized' // 401: parent auth missing (parent + preview routes)
  | 'forbidden' // 403: course/unit not available to this learner (incl. demo via child routes)
  | 'not_found' // 404
  | 'locked' // 403: unit locked
  | 'gate_reading' // 403: required lessons not read yet
  | 'gate_practice' // 403: practice not completed
  | 'gate_retake_practice' // 403: targeted practice after a failed test not done
  | 'stale' // 409: revision behind; `session` carries the current view
  | 'already_submitted' // 409
  | 'invalid_request' // 400: malformed body, bad actionId/revision
  | 'invalid_response' // 400: answer does not fit the question
  | 'incomplete_response' // 400
  | 'not_current_question' // 409: practice answer for a question not on screen
  | 'not_all_answered' // 422: submit before every question has an answer
  | 'validation_failed' // 422: publish refused; `problems` lists why
  | 'offline'; // client-side only: shown when the request could not be sent

export type TextbookErrorResponse = {
  code: TextbookErrorCode;
  // Estonian, ready to show.
  message: string;
  problems?: ValidationIssue[];
  session?: PracticeSessionView | TestSessionView;
};

export const TEXTBOOK_ERROR_STATUS: Record<TextbookErrorCode, number> = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  locked: 403,
  gate_reading: 403,
  gate_practice: 403,
  gate_retake_practice: 403,
  stale: 409,
  already_submitted: 409,
  invalid_request: 400,
  invalid_response: 400,
  incomplete_response: 400,
  not_current_question: 409,
  not_all_answered: 422,
  validation_failed: 422,
  offline: 503
};

/* ------------------------------------------------------- client questions */

export type ClientHotspotRegion = { id: string; marker: string; position: string };

// What the browser sees of an answer: items in the stored display order, no key.
export type ClientAnswerView =
  | { type: 'single_choice'; options: AnswerItem[] }
  | { type: 'multiple_selection'; options: AnswerItem[] }
  | { type: 'matching'; prompts: AnswerItem[]; choices: AnswerItem[] }
  | { type: 'grouping'; groups: AnswerItem[]; items: AnswerItem[] }
  | { type: 'ordering'; items: AnswerItem[]; firstLabel?: string; lastLabel?: string }
  // Region labels are the answer, so only neutral markers/positions are sent.
  | { type: 'diagram_hotspot'; diagramId: string; regions: ClientHotspotRegion[] };

// A question without its key, explanation, misconception, objectives,
// variant group or level.
export type ClientQuestion = {
  id: string;
  stem: string;
  context?: QuestionContext;
  answer: ClientAnswerView;
};

function inOrder(items: readonly AnswerItem[], order: readonly string[] | undefined): AnswerItem[] {
  const copy = items.map((item) => ({ id: item.id, text: item.text }));
  if (!order) return copy;
  const byId = new Map(copy.map((item) => [item.id, item]));
  const ordered = order.map((id) => byId.get(id)).filter((item): item is AnswerItem => Boolean(item));
  // Anything the order missed (never expected) goes last, so nothing vanishes.
  return [...ordered, ...copy.filter((item) => !order.includes(item.id))];
}

export function toClientQuestion(frozen: FrozenQuestion, diagrams: DiagramLookup = getDiagram): ClientQuestion {
  const { question, order } = frozen;
  const answer = question.answer;
  let view: ClientAnswerView;
  switch (answer.type) {
    case 'single_choice':
    case 'multiple_selection':
      view = { type: answer.type, options: inOrder(answer.options, order.options) };
      break;
    case 'matching':
      view = { type: 'matching', prompts: inOrder(answer.prompts, order.prompts), choices: inOrder(answer.choices, order.choices) };
      break;
    case 'grouping':
      view = { type: 'grouping', groups: inOrder(answer.groups, order.groups), items: inOrder(answer.items, order.items) };
      break;
    case 'ordering':
      view = {
        type: 'ordering',
        items: inOrder(answer.items, order.items),
        ...(answer.firstLabel ? { firstLabel: answer.firstLabel } : {}),
        ...(answer.lastLabel ? { lastLabel: answer.lastLabel } : {})
      };
      break;
    case 'diagram_hotspot': {
      const diagram = diagrams(answer.diagramId);
      const ids = order.regions ?? answer.regionIds ?? diagram?.regions.map((region) => region.id) ?? [];
      view = {
        type: 'diagram_hotspot',
        diagramId: answer.diagramId,
        regions: ids.map((id) => {
          const region = diagram?.regions.find((item) => item.id === id);
          return { id, marker: region?.marker ?? '?', position: region?.position ?? '' };
        })
      };
      break;
    }
  }
  return {
    id: question.id,
    stem: question.stem,
    ...(question.context ? { context: JSON.parse(JSON.stringify(question.context)) as QuestionContext } : {}),
    answer: view
  };
}

/* ------------------------------------------------------------ child views */

export type UnitSummary = UnitRef & {
  pages: PageRange | null;
  status: UnitStatusCode;
  // Estonian label of `status` (UNIT_STATUS_LABELS).
  statusLabel: string;
  lessonsCompleted: number;
  lessonsRequired: number;
  practiceCompleted: boolean;
  testPassed: boolean;
  bestScore: { correct: number; total: number } | null;
};

// GET courseOverview. Child scope: only published units (locked ones included
// as 'locked'); preview scope: every 'ready' unit.
export type CourseOverviewResponse = {
  scope: TextbookScope;
  course: CourseRef;
  units: UnitSummary[];
  // The unit the child should work on next (first not passed and accessible).
  currentUnitId: string | null;
  // Every visible unit passed. Unpublished units are never mentioned.
  allUnitsPassed: boolean;
};

export type LessonSummary = {
  lessonId: string;
  title: string;
  order: number;
  required: boolean;
  completed: boolean;
  sectionCount: number;
};

export type TestAttemptSummary = {
  attemptNumber: number;
  sessionId: string;
  submittedAt: string;
  correct: number;
  total: number;
  passed: boolean;
  contentVersion: string;
};

export type UnitNextStep = 'read' | 'practice' | 'retake_practice' | 'test' | 'resume_practice' | 'resume_test' | 'done';

// GET unitDetail.
export type UnitDetailResponse = {
  scope: TextbookScope;
  course: CourseRef;
  unit: UnitSummary & { contentVersion: string };
  lessons: LessonSummary[];
  objectives: ObjectiveRef[];
  gates: { readingComplete: boolean; practiceUnlocked: boolean; testUnlocked: boolean; retakePracticePending: boolean };
  activePracticeSessionId: string | null;
  activeTestSessionId: string | null;
  attempts: TestAttemptSummary[];
  // From the most recent failed test (empty otherwise): what to revise.
  missedObjectives: ObjectiveRef[];
  nextStep: UnitNextStep;
  // For nextStep 'read': the first unread required lesson.
  nextLessonId: string | null;
  nextUnit: UnitRef | null;
};

// GET lesson. Blocks are declarative data (render them, never as HTML).
export type LessonContentResponse = {
  scope: TextbookScope;
  unitId: string;
  contentVersion: string;
  lesson: { lessonId: string; title: string; order: number; required: boolean; sections: LessonSection[] };
  objectives: ObjectiveRef[];
  completed: boolean;
  previousLessonId: string | null;
  nextLessonId: string | null;
};

export type ReadingCompleteRequest = ActionRequest;
export type ReadingCompleteResponse = {
  lessonId: string;
  completed: true;
  // All required lessons read.
  readingComplete: boolean;
  practiceUnlocked: boolean;
  unitStatus: UnitStatusCode;
};

/* --------------------------------------------------------------- practice */

// The server picks the mode: 'targeted' when a failed test requires it,
// otherwise 'normal'. An active run of the unit is resumed.
export type PracticeStartRequest = ActionRequest;

export type PracticeFeedbackView = {
  // The answered question again, so the feedback survives a refresh.
  question: ClientQuestion;
  response: AnswerResponse;
  correct: boolean;
  correctResponse: AnswerResponse;
  explanation: string;
  misconception: string | null;
  objective: ObjectiveRef;
  objectiveSatisfied: boolean;
  correctionScheduled: boolean;
};

export type PracticeSessionView = {
  scope: TextbookScope;
  sessionId: string;
  revision: number;
  courseId: string;
  unitId: string;
  mode: PracticeMode;
  status: 'active' | 'completed';
  progress: PracticeProgress;
  // The question on screen; null once completed.
  question: ClientQuestion | null;
  // Increments with every answer (keys the UI's question component).
  sequence: number;
  // Feedback for the most recent answer (null before the first one).
  lastFeedback: PracticeFeedbackView | null;
  // Objectives this run covers (targeted: the missed ones).
  objectives: ObjectiveRef[];
  testUnlocked: boolean;
};

export type PracticeAnswerRequest = SessionActionRequest & { questionId: string; response: AnswerResponse };
export type PracticeAnswerResponse = { session: PracticeSessionView; feedback: PracticeFeedbackView };

/* ------------------------------------------------------------------- test */

export type TestStartRequest = ActionRequest;

export type TestQuestionReview = {
  questionId: string;
  correct: boolean;
  response: AnswerResponse;
  correctResponse: AnswerResponse;
  explanation: string;
  objective: ObjectiveRef;
};

export type RewardView = { awardedAmount: number; balanceAfter: number; held: boolean };

export type TestResultView = {
  correct: number;
  total: number;
  requiredCorrect: number;
  passed: boolean;
  // Display only, rounded down.
  percent: number;
  missedObjectives: ObjectiveRef[];
  // Revealed only after submit.
  review: TestQuestionReview[];
  // Failed and the course requires targeted practice before the next test.
  retakePracticeRequired: boolean;
  // True only for the unit's first pass.
  firstPass: boolean;
  nextUnit: UnitRef | null;
  // True only when this very pass opened nextUnit.
  nextUnitOpened: boolean;
  allUnitsPassed: boolean;
  // Always null in preview, and when no stars were awarded.
  reward: RewardView | null;
};

// The test never carries keys before submit: `questions` are ClientQuestions.
export type TestSessionView = {
  scope: TextbookScope;
  sessionId: string;
  revision: number;
  courseId: string;
  unitId: string;
  status: 'active' | 'submitted';
  total: number;
  requiredCorrect: number;
  questions: ClientQuestion[];
  // Saved answers (the learner's own), by question id.
  answers: Record<string, AnswerResponse>;
  answeredCount: number;
  // Only when submitted.
  result: TestResultView | null;
};

// Save or replace one answer; no grading, no feedback.
export type TestAnswerRequest = SessionActionRequest & { questionId: string; response: AnswerResponse };
export type TestAnswerResponse = { session: TestSessionView };

export type TestSubmitRequest = SessionActionRequest;
export type TestSubmitResponse = { session: TestSessionView; result: TestResultView };

/* ----------------------------------------------------------------- parent */

export type WeakObjective = ObjectiveRef & { missCount: number; lastMissedAt: string };

export type ParentUnitProgress = {
  learner: Learner;
  status: UnitStatusCode;
  statusLabel: string;
  lessonsCompleted: number;
  lessonsRequired: number;
  practiceCompleted: boolean;
  practiceRuns: number;
  attempts: TestAttemptSummary[];
  passedAt: string | null;
  weakObjectives: WeakObjective[];
};

export type ParentUnitView = UnitRef & {
  pages: PageRange | null;
  contentStatus: UnitContentStatus;
  contentVersion: string;
  published: boolean;
  publishedAt: string | null;
  manualUnlock: boolean;
  validation: { publishable: boolean; errors: ValidationIssue[]; warnings: ValidationIssue[]; stats: UnitStats };
  // Per real learner of the course; empty for a preview-only course.
  progress: ParentUnitProgress[];
};

export type ParentCourseView = CourseRef & {
  learners: Learner[];
  settings: CourseSettings;
  units: ParentUnitView[];
  // The unpublished unit the child is waiting for, if every published one is passed.
  waitingForPublish: UnitRef | null;
};

// GET parent.overview: every course incl. drafts and the preview-only demo.
export type ParentOverviewResponse = { courses: ParentCourseView[] };

// GET parent.unit: full content incl. answer keys, for the parent to inspect.
export type ParentUnitDetailResponse = {
  course: CourseRef;
  unit: ParentUnitView;
  objectives: LearningObjective[];
  lessons: Lesson[];
  questions: Question[];
};

export type PublishRequest = ActionRequest & { published: boolean };
export type ManualUnlockRequest = ActionRequest & { unlocked: boolean };
export type ParentUnitResponse = { unit: ParentUnitView };

export type PreviewStartRequest = ActionRequest & { courseId: string };
// Resets ONLY the preview learner's progress and sessions (all courses, or one).
export type PreviewResetRequest = ActionRequest & { courseId?: string };
export type PreviewResetResponse = { reset: true; sessionsRemoved: number };
