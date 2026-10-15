import db from '@/lib/db';
import { hasActiveLearningExercise } from '@/lib/learningExercises';
import type { Learner } from '@/lib/tasks';
import { vocabUnitLabel, VOCAB_EXERCISE_ID } from '@/lib/vocabulary/constants';
import { displayPercent } from '@/lib/vocabulary/threshold';
import type { UnitAccessReason } from '@/lib/vocabulary/unlock';
import {
  activeWordCounts,
  activeWordIdsByUnit,
  allWords,
  listUnits,
  parseAccepted,
  progressRows,
  unitAccessFor,
  unstudiedWordIds
} from '@/lib/server/vocabulary/units';
import { activeSessionIds, weakWordCounts } from '@/lib/server/vocabulary/sessions';

// Read models for the two screens: the child's unit list and the parent's
// administration and statistics. Neither writes anything.

export type ChildUnitStatus = 'locked' | 'new' | 'studying' | 'study_done' | 'new_words' | 'testing' | 'passed';

export type ChildUnitCard = {
  id: string;
  unitNumber: number;
  title: string;
  label: string;
  wordCount: number;
  status: ChildUnitStatus;
  lockReason: UnitAccessReason | null;
  previousUnitLabel: string | null;
  testUnlocked: boolean;
  passedAt: string | null;
  activeStudySessionId: string | null;
  activeTestSessionId: string | null;
  activePracticeSessionId: string | null;
  weakCount: number;
  // Words added after the unit was studied; studied before the test reopens.
  newWordsCount: number;
};

export type ChildVocabularyHome = {
  enabled: boolean;
  units: ChildUnitCard[];
  weakTotal: number;
  activePracticeSessionId: string | null;
};

export function getChildVocabularyHome(learner: Learner): ChildVocabularyHome {
  const enabled = hasActiveLearningExercise(learner, VOCAB_EXERCISE_ID);
  if (!enabled) return { enabled, units: [], weakTotal: 0, activePracticeSessionId: null };
  const units = listUnits();
  const counts = activeWordCounts();
  const progress = progressRows(learner);
  const wordIds = activeWordIdsByUnit();
  const access = unitAccessFor(learner, units, counts, progress, wordIds);
  const sessions = activeSessionIds(learner);
  const weak = weakWordCounts(learner);
  const byNumber = new Map(units.map((unit) => [unit.unitNumber, unit]));

  // The child sees published units only; an unpublished unit does not exist
  // for them, so there is nothing confusing to explain.
  const cards: ChildUnitCard[] = units
    .filter((unit) => access.get(unit.id)?.reason !== 'unpublished')
    .map((unit) => {
      const unitAccess = access.get(unit.id)!;
      const row = progress.get(unit.id);
      const session = (mode: string) => sessions.find((item) => item.unitId === unit.id && item.mode === mode)?.id ?? null;
      const activeStudySessionId = session('study');
      const activeTestSessionId = session('test');
      let status: ChildUnitStatus;
      if (!unitAccess.accessible) status = 'locked';
      else if (row?.testPassedAt) status = 'passed';
      else if (activeTestSessionId) status = 'testing';
      else if (row?.studyCompletedAt && unstudiedWordIds(row, wordIds.get(unit.id) ?? []).length > 0) status = 'new_words';
      else if (row?.studyCompletedAt) status = 'study_done';
      else if (activeStudySessionId) status = 'studying';
      else status = 'new';
      const previous = unitAccess.previousUnitNumber === null ? null : byNumber.get(unitAccess.previousUnitNumber) ?? null;
      return {
        id: unit.id,
        unitNumber: unit.unitNumber,
        title: unit.title,
        label: vocabUnitLabel(unit),
        wordCount: counts.get(unit.id) ?? 0,
        status,
        lockReason: unitAccess.accessible ? null : unitAccess.reason,
        previousUnitLabel: previous ? vocabUnitLabel(previous) : null,
        testUnlocked: unitAccess.testUnlocked,
        passedAt: row?.testPassedAt ?? null,
        activeStudySessionId,
        activeTestSessionId,
        activePracticeSessionId: session('practice'),
        weakCount: unitAccess.accessible ? weak.get(unit.id) ?? 0 : 0,
        newWordsCount: unitAccess.accessible ? unstudiedWordIds(row, wordIds.get(unit.id) ?? []).length : 0
      };
    });

  return {
    enabled,
    units: cards,
    weakTotal: cards.reduce((total, card) => total + card.weakCount, 0),
    activePracticeSessionId: sessions.find((item) => item.unitId === null && item.mode === 'practice')?.id ?? null
  };
}

/* ------------------------------------------------------------- parent */

type RoundRow = { sessionId: string; roundNumber: number; total: number; correct: number; passed: number; completedAt: string };

export type ParentUnitSummary = {
  id: string;
  unitNumber: number;
  title: string;
  label: string;
  published: boolean;
  wordCount: number;
  retiredWordCount: number;
  contentVersion: number;
  manualUnlock: boolean;
  accessible: boolean;
  accessReason: UnitAccessReason;
  // For a locked unit: the unit whose test opens it.
  previousUnitNumber: number | null;
  // The child has passed the last unit they can see, and this hidden unit is
  // the one that would open next — publishing it is all that is missing.
  waitingForPublish: { passedUnitLabel: string } | null;
  started: boolean;
  hasHistory: boolean;
  studyInProgress: { known: number; total: number } | null;
  studyCompletedAt: string | null;
  studyFirstKnown: number | null;
  studyTotal: number | null;
  studyCompletions: number;
  testUnlocked: boolean;
  testPassedAt: string | null;
  passedScore: number | null;
  passedTotal: number | null;
  firstTest: { correct: number; total: number; percent: number } | null;
  latestTest: { correct: number; total: number; percent: number } | null;
  bestTest: { correct: number; total: number; percent: number } | null;
  fullRounds: number;
  testSessions: number;
  testPasses: number;
  weakCount: number;
};

function score(row: RoundRow | undefined) {
  return row ? { correct: row.correct, total: row.total, percent: displayPercent(row.correct, row.total) } : null;
}

export function getParentVocabularyOverview(learner: Learner) {
  const units = listUnits();
  const counts = activeWordCounts();
  const progress = progressRows(learner);
  const access = unitAccessFor(learner, units, counts, progress);
  const weak = new Map((db.prepare(`
    SELECT w.unitId, COUNT(*) AS count FROM english_vocab_word_stats s
    JOIN english_vocab_words w ON w.id = s.wordId
    WHERE s.learner = ? AND s.needsPractice = 1 AND w.retiredAt IS NULL
    GROUP BY w.unitId
  `).all(learner) as Array<{ unitId: string; count: number }>).map((row) => [row.unitId, row.count]));
  const retired = new Map((db.prepare('SELECT unitId, COUNT(*) AS count FROM english_vocab_words WHERE retiredAt IS NOT NULL GROUP BY unitId').all() as Array<{ unitId: string; count: number }>).map((row) => [row.unitId, row.count]));
  const sessionCounts = new Map((db.prepare(`
    SELECT unitId, COUNT(*) AS total, SUM(CASE WHEN mode = 'test' THEN 1 ELSE 0 END) AS tests
    FROM english_vocab_sessions WHERE learner = ? AND unitId IS NOT NULL GROUP BY unitId
  `).all(learner) as Array<{ unitId: string; total: number; tests: number }>).map((row) => [row.unitId, row]));
  const activeStudy = new Map((db.prepare(`
    SELECT unitId, stateJson FROM english_vocab_sessions WHERE learner = ? AND mode = 'study' AND status = 'active'
  `).all(learner) as Array<{ unitId: string; stateJson: string }>).map((row) => {
    try {
      const state = JSON.parse(row.stateJson) as { known: string[]; words: unknown[] };
      return [row.unitId, { known: state.known.length, total: state.words.length }];
    } catch {
      return [row.unitId, null];
    }
  }));
  const rounds = db.prepare(`
    SELECT unitId, sessionId, roundNumber, total, correct, passed, completedAt
    FROM english_vocab_test_rounds WHERE learner = ? AND kind = 'full' ORDER BY id ASC
  `).all(learner) as Array<RoundRow & { unitId: string }>;

  // The last unit the child can see, if they have passed it: the first hidden
  // unit after it (with words to publish) is what the child is waiting for.
  const visible = units.filter((unit) => access.get(unit.id)?.reason !== 'unpublished');
  const lastVisible = visible.at(-1) ?? null;
  const waitingUnitId = lastVisible && progress.get(lastVisible.id)?.testPassedAt
    ? units.find((unit) => unit.unitNumber > lastVisible.unitNumber && access.get(unit.id)?.reason === 'unpublished' && (counts.get(unit.id) ?? 0) > 0)?.id ?? null
    : null;

  const summaries: ParentUnitSummary[] = units.map((unit) => {
    const row = progress.get(unit.id);
    const unitAccess = access.get(unit.id)!;
    const unitRounds = rounds.filter((round) => round.unitId === unit.id);
    const best = [...unitRounds].sort((left, right) => (right.correct * left.total) - (left.correct * right.total) || right.correct - left.correct)[0];
    const sessions = sessionCounts.get(unit.id);
    return {
      id: unit.id,
      unitNumber: unit.unitNumber,
      title: unit.title,
      label: vocabUnitLabel(unit),
      published: Boolean(unit.published),
      wordCount: counts.get(unit.id) ?? 0,
      retiredWordCount: retired.get(unit.id) ?? 0,
      contentVersion: unit.contentVersion,
      manualUnlock: Boolean(row?.manualUnlock),
      accessible: unitAccess.accessible,
      accessReason: unitAccess.reason,
      previousUnitNumber: unitAccess.previousUnitNumber,
      waitingForPublish: unit.id === waitingUnitId && lastVisible ? { passedUnitLabel: vocabUnitLabel(lastVisible) } : null,
      started: Boolean(sessions?.total),
      hasHistory: Boolean(sessions?.total),
      studyInProgress: activeStudy.get(unit.id) ?? null,
      studyCompletedAt: row?.studyCompletedAt ?? null,
      studyFirstKnown: row?.studyFirstKnown ?? null,
      studyTotal: row?.studyTotal ?? null,
      studyCompletions: row?.studyCompletions ?? 0,
      testUnlocked: unitAccess.testUnlocked,
      testPassedAt: row?.testPassedAt ?? null,
      passedScore: row?.passedScore ?? null,
      passedTotal: row?.passedTotal ?? null,
      firstTest: score(unitRounds[0]),
      latestTest: score(unitRounds.at(-1)),
      bestTest: score(best),
      fullRounds: unitRounds.length,
      testSessions: sessions?.tests ?? 0,
      testPasses: row?.testPasses ?? 0,
      weakCount: weak.get(unit.id) ?? 0
    };
  });

  return { learner, units: summaries };
}

export type ParentWordDetail = {
  id: string;
  position: number;
  estonian: string;
  english: string;
  pronunciation: string;
  acceptedAnswers: string[];
  retired: boolean;
  revision: number;
  studyCorrect: number;
  studyWrong: number;
  testCorrect: number;
  testWrong: number;
  correctionWrong: number;
  practiceCorrect: number;
  practiceWrong: number;
  needsPractice: boolean;
  lastAttemptAt: string | null;
  recentWrongAnswers: string[];
};

export function getParentUnitWords(learner: Learner, unitId: string) {
  const words = allWords(unitId);
  const stats = new Map((db.prepare(`
    SELECT s.* FROM english_vocab_word_stats s JOIN english_vocab_words w ON w.id = s.wordId
    WHERE s.learner = ? AND w.unitId = ?
  `).all(learner, unitId) as Array<Record<string, number | string | null> & { wordId: string }>).map((row) => [row.wordId, row]));
  const wrongAnswers = new Map<string, string[]>();
  for (const row of db.prepare(`
    SELECT e.wordId, e.answer FROM english_vocab_events e JOIN english_vocab_words w ON w.id = e.wordId
    WHERE e.learner = ? AND w.unitId = ? AND e.correct = 0 AND e.answer IS NOT NULL AND e.phase <> 'study'
    ORDER BY e.id DESC
  `).all(learner, unitId) as Array<{ wordId: string; answer: string }>) {
    const list = wrongAnswers.get(row.wordId) ?? [];
    if (list.length < 3 && !list.includes(row.answer)) list.push(row.answer);
    wrongAnswers.set(row.wordId, list);
  }
  const details: ParentWordDetail[] = words.map((word) => {
    const stat = stats.get(word.id);
    const number = (key: string) => Number(stat?.[key] ?? 0);
    return {
      id: word.id,
      position: word.position,
      estonian: word.estonian,
      english: word.english,
      pronunciation: word.pronunciation,
      acceptedAnswers: parseAccepted(word.acceptedAnswersJson),
      retired: Boolean(word.retiredAt),
      revision: word.revision,
      studyCorrect: number('studyCorrect'),
      studyWrong: number('studyWrong'),
      testCorrect: number('testCorrect'),
      testWrong: number('testWrong'),
      correctionWrong: number('correctionWrong'),
      practiceCorrect: number('practiceCorrect'),
      practiceWrong: number('practiceWrong'),
      needsPractice: Boolean(stat?.needsPractice),
      lastAttemptAt: (stat?.lastAttemptAt as string | null | undefined) ?? null,
      recentWrongAnswers: wrongAnswers.get(word.id) ?? []
    };
  });
  // "Most missed" counts spelling mistakes only; study swipes are
  // self-assessment and are shown in their own column.
  const mostMissed = details
    .filter((word) => word.testWrong + word.correctionWrong + word.practiceWrong > 0)
    .sort((left, right) => (right.testWrong + right.correctionWrong + right.practiceWrong) - (left.testWrong + left.correctionWrong + left.practiceWrong))
    .slice(0, 5)
    .map((word) => ({ id: word.id, english: word.english, estonian: word.estonian, mistakes: word.testWrong + word.correctionWrong + word.practiceWrong }));
  return { words: details, mostMissed };
}
