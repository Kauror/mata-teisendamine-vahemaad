export const ENGLISH_PROGRESS_KEY = 'kiur-english-progress-v1';

export type EnglishProgress = {
  completedPacks: string[];
  packResults: Record<string, { bestStars: number; bestTimeSeconds?: number; bestAccuracy?: number; completedAt?: string }>;
  sprintBestScore: number;
  wordStats: Record<string, { timesSeen: number; timesCorrect: number; timesWrong: number; lastSeenAt?: string; mastered?: boolean }>;
};

export const DEFAULT_ENGLISH_PROGRESS: EnglishProgress = { completedPacks: [], packResults: {}, sprintBestScore: 0, wordStats: {} };

export function loadEnglishProgress(): EnglishProgress {
  if (typeof window === 'undefined') return DEFAULT_ENGLISH_PROGRESS;
  try { return { ...DEFAULT_ENGLISH_PROGRESS, ...JSON.parse(localStorage.getItem(ENGLISH_PROGRESS_KEY) || '{}') }; } catch { return DEFAULT_ENGLISH_PROGRESS; }
}

export function saveEnglishProgress(progress: EnglishProgress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ENGLISH_PROGRESS_KEY, JSON.stringify(progress));
}
