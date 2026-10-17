// The lesson reader's section pager (SPEC D1): one section per screen with
// "Edasi"/"Tagasi"; the last section ends with an end-of-content marker and
// "Lugesin läbi" becomes active once that marker has been on screen. Short
// content that fits on the screen shows the marker at once, so the same rule
// covers it. A lesson that is already read is free to revisit.

export type PagerView = {
  index: number;
  count: number;
  isFirst: boolean;
  isLast: boolean;
  // "Osa 2/3"
  label: string;
};

// Clamp a (possibly stale or hand-edited) section number from the URL.
export function clampSection(raw: unknown, count: number): number {
  const value = typeof raw === 'string' ? Number.parseInt(raw, 10) : typeof raw === 'number' ? raw : Number.NaN;
  if (!Number.isFinite(value) || count <= 0) return 0;
  return Math.min(Math.max(Math.trunc(value) - 1, 0), count - 1);
}

export function pagerView(index: number, count: number): PagerView {
  const safeCount = Math.max(count, 1);
  const safeIndex = Math.min(Math.max(index, 0), safeCount - 1);
  return {
    index: safeIndex,
    count: safeCount,
    isFirst: safeIndex === 0,
    isLast: safeIndex === safeCount - 1,
    label: `Osa ${safeIndex + 1}/${safeCount}`
  };
}

// The URL parameter value for a 0-based section index (1-based, human).
export function sectionParam(index: number): string {
  return String(index + 1);
}

export type FinishState = 'hidden' | 'waiting' | 'ready' | 'done';

// What the "Lugesin läbi" control shows: nothing before the last section,
// disabled until the end marker was seen, active after that, and a done note
// once the server has recorded the lesson.
export function finishState(input: { isLast: boolean; endSeen: boolean; completed: boolean }): FinishState {
  if (input.completed) return 'done';
  if (!input.isLast) return 'hidden';
  return input.endSeen ? 'ready' : 'waiting';
}
