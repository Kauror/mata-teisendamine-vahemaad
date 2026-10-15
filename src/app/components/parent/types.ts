import type { LearningExerciseStatus, LearningExerciseSubject } from '@/lib/shared/types';

export type Learner = 'kiur' | 'kirsi';
export type AssignmentMode = 'kiur' | 'kirsi' | 'both_independent' | 'first_completer';
export type RecurrenceType = 'once' | 'daily' | 'weekdays' | 'weekends' | 'selected_weekdays';
export type StoreVisibility = 'kiur' | 'kirsi' | 'both';
export type StoreStockType = 'unlimited' | 'fixed_stock' | 'daily_stock' | 'one_time_global';

export type Template = { id: number; title: string; points: number; assignmentMode: AssignmentMode; recurrenceType: RecurrenceType; selectedWeekdaysJson: string | null; startDate: string | null; onceDate: string | null; requiresApproval: number };
export type PendingApproval = { assignmentId: number; learner: Learner; title: string; points: number; assignmentMode: AssignmentMode; completedAt: string | null; date: string };
export type HeldReward = { id: number; learner: Learner; completionDate: string | null; score: number; questionCount: number; exerciseId: string | null; status: 'withheld' | 'needs_review'; reviewReasonCode: string | null };
export type OfflineTaskReview = { clientActionId: string; learner: Learner; taskDate: string; title: string; points: number; completedAt: string | null; reasonCode: string | null };
export type ParentHistoryAttempt = { id: number; createdAt: string; learner: Learner | null; category: string; score: number; questionCount: number };
export type StreakFreezeState = { held: number; maxHeld: number; price: number; canBuy: boolean; blockedReason: string | null; recentlyCovered: string[] };
export type StreakFreezes = Record<Learner, StreakFreezeState>;

export type Dashboard = {
  balances: Record<Learner, number>;
  templates: Template[];
  activeTasks: Array<{ id: number; titleSnapshot: string; pointsSnapshot: number; status: string }>;
  completedTasks: Array<{ titleSnapshot: string; pointsSnapshot: number; learner: Learner; completedAt: string }>;
  pendingApprovals: PendingApproval[];
};

export type StoreItem = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  visibility: StoreVisibility;
  stockType: StoreStockType;
  fixedStockRemaining: number | null;
  dailyStockLimit: number | null;
  dailyRemaining: number | null;
  availableFrom: string | null;
  availableUntil: string | null;
  availableWeekdaysJson: string | null;
  isActive: number;
  hiddenToday: boolean;
  boughtOnce: boolean;
};

export type StoreDashboard = {
  items: StoreItem[];
  purchases: Array<{ id: number; learner: Learner; titleSnapshot: string; priceSnapshot: number; purchasedAt: string }>;
};

// Imported, never redeclared. This screen used to carry its own copy of the
// subject union without 'loodusopetus'; because the copy was structurally its
// own type, TypeScript accepted a SUBJECT_LABELS record that was missing a
// subject, and Loodusõpetus rendered with no label, sorted to the top and had
// no filter option. Importing makes any future subject a compile error here.
export type LearningExercise = {
  id: string;
  title: string;
  learnerScope: Learner[];
  subject: LearningExerciseSubject;
  topic: string;
  category: string;
  routePath: string;
  sortOrder: number;
  childStatus: Record<Learner, LearningExerciseStatus | null>;
};

export type LearningSettings = {
  baseValue: number;
  decayStep: number;
  minimumValue: number;
  dailyCap: number;
  streakIntervalDays: number;
  streakBonusAmount: number;
  learningPointsEnabled: boolean;
  streakBonusEnabled: boolean;
};

export type RewardLearnerScope = 'both' | 'kiur' | 'kirsi';
export type RewardRule = {
  id: number;
  type: 'learning_streak';
  thresholdDays: number;
  rewardStars: number;
  learnerScope: RewardLearnerScope;
  enabled: boolean;
};

export type MonthlyStanding = {
  month: string;
  kiurTrophies: number;
  kirsiTrophies: number;
  kiurExercises: number;
  kirsiExercises: number;
  leader: Learner | 'tie';
};
export type MonthlyPrize = { prizeStars: number; standing: MonthlyStanding };

export type WeeklyChildDigest = { exercises: number; accuracyPercent: number; starsEarned: number; trophies: number; streak: number };
export type WeeklyDigest = { from: string; to: string; learners: Record<Learner, WeeklyChildDigest> };

export const LEARNERS: readonly Learner[] = ['kiur', 'kirsi'];
