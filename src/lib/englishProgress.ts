export const ENGLISH_PROGRESS_KEY = 'kiur-english-progress-v1';

export type EnglishPackResult = {
  bestStars: number;
  bestTimeSeconds?: number;
  bestAccuracy?: number;
  completedAt?: string;
};

export type EnglishWordStat = {
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  lastSeenAt?: string;
  mastered?: boolean;
};

export type EnglishProgress = {
  completedPacks: string[];
  packResults: Record<string, EnglishPackResult>;
  sprintBestScore: number;
  wordStats: Record<string, EnglishWordStat>;
};

export const DEFAULT_ENGLISH_PROGRESS: EnglishProgress = { completedPacks: [], packResults: {}, sprintBestScore: 0, wordStats: {} };

export function loadEnglishProgress(): EnglishProgress {
  if (typeof window === 'undefined') return DEFAULT_ENGLISH_PROGRESS;
  try {
    const stored = JSON.parse(localStorage.getItem(ENGLISH_PROGRESS_KEY) || '{}') as Partial<EnglishProgress>;
    return normalizeEnglishProgress(stored);
  } catch {
    return { ...DEFAULT_ENGLISH_PROGRESS, completedPacks: [], packResults: {}, wordStats: {} };
  }
}

export function saveEnglishProgress(progress: EnglishProgress) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ENGLISH_PROGRESS_KEY, JSON.stringify(progress));
}

export function isEnglishPackUnlocked(packId: string, completedPacks: string[]) {
  const match = /^pack-(\d+)$/.exec(packId);
  if (!match) return false;
  const index = Number(match[1]);
  if (index <= 1) return true;
  return completedPacks.includes(`pack-${index - 1}`);
}

export function getEnglishPackStars(progress: EnglishProgress) {
  return Object.fromEntries(
    Object.entries(progress.packResults).map(([id, result]) => [id, result.bestStars || 0])
  ) as Record<string, number>;
}

export function saveCompletedEnglishPack(packId: string, stars: number, timeSeconds: number) {
  const progress = loadEnglishProgress();
  const previous = progress.packResults[packId];
  const next: EnglishProgress = {
    ...progress,
    completedPacks: Array.from(new Set([...progress.completedPacks, packId])),
    packResults: {
      ...progress.packResults,
      [packId]: {
        ...previous,
        bestStars: Math.max(stars, previous?.bestStars || 0),
        bestTimeSeconds: previous?.bestTimeSeconds === undefined ? timeSeconds : Math.min(timeSeconds, previous.bestTimeSeconds),
        completedAt: new Date().toISOString()
      }
    }
  };
  saveEnglishProgress(next);
  return next;
}

export function saveEnglishSprintBestScore(score: number) {
  const progress = loadEnglishProgress();
  if (score <= (progress.sprintBestScore || 0)) return progress;
  const next = { ...progress, sprintBestScore: score };
  saveEnglishProgress(next);
  return next;
}

function normalizeEnglishProgress(progress: Partial<EnglishProgress>): EnglishProgress {
  return {
    completedPacks: Array.isArray(progress.completedPacks) ? progress.completedPacks : [],
    packResults: { ...(progress.packResults || {}) },
    sprintBestScore: Number.isFinite(progress.sprintBestScore) ? Number(progress.sprintBestScore) : 0,
    wordStats: { ...(progress.wordStats || {}) }
  };
}
