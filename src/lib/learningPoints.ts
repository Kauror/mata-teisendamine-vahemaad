import db from '@/lib/db';
import { isKirsiAttempt } from '@/lib/history';
import { getBalance, Learner, nowIso, todayDateString } from '@/lib/tasks';

export type LearningPointSettings = {
  baseValue: number;
  decayStep: number;
  minimumValue: number;
  dailyCap: number;
  streakIntervalDays: number;
  streakBonusAmount: number;
  learningPointsEnabled: boolean;
  streakBonusEnabled: boolean;
};

export type StudyReward = {
  attemptId: number;
  learner: Learner;
  exerciseKey: string;
  score: number;
  questionCount: number;
  scorePercent: number;
  baseValueBeforeScore: number;
  earnedBeforeCap: number;
  awardedAmount: number;
  dailyCap: number;
  dailyLearningEarnedBefore: number;
  dailyLearningEarnedAfter: number;
  decayAttemptNumberToday: number;
  ledgerEntryId: number | null;
  streakLength: number;
  streakBonusAmount: number;
  streakBonusAwarded: boolean;
  balanceAfter: number;
  capReached: boolean;
};

type StudyRewardMetadata = {
  settings?: LearningPointSettings;
  balanceAfterAward?: number;
};

type AttemptRow = {
  id: number;
  createdAt: string;
  category: string;
  questionCount: number;
  score: number;
  learner?: string | null;
  subject?: string | null;
  topic?: string | null;
};

type LearningPointSettingsRow = Omit<LearningPointSettings, 'learningPointsEnabled' | 'streakBonusEnabled'> & {
  learningPointsEnabled: number;
  streakBonusEnabled: number;
};

const DEFAULT_SETTINGS: LearningPointSettings = {
  baseValue: 1,
  decayStep: 0.1,
  minimumValue: 0.1,
  dailyCap: 10,
  streakIntervalDays: 7,
  streakBonusAmount: 1,
  learningPointsEnabled: true,
  streakBonusEnabled: true
};

const KEY_BY_CATEGORY: Record<string, string> = {
  'Teisendamine': 'kiur.math.teisendamine',
  'Võrdlemine': 'kiur.math.vordlemine',
  'Järjestamine': 'kiur.math.jarjestamine',
  'Arvutamine': 'kiur.math.arvutamine',
  'Puuduv arv': 'kiur.math.puuduv-arv',
  'Ümbermõõt': 'kiur.math.umbermoot',
  'Tekstülesanded': 'kiur.math.tekstulesanded',
  'Segaharjutus': 'kiur.math.segaharjutus',
  'Arvutamine 10 piires': 'kirsi.math.arvutamine-10',
  'Arvutamine 20 piires': 'kirsi.math.arvutamine-20',
  'Suurem või väiksem kuni 100': 'kirsi.math.suurem-vaiksem-100',
  'Segaülesanded': 'kirsi.math.segaulesanded'
};

const KEY_BY_TOPIC: Record<string, string> = {
  'mootuhikud-pikkused': 'kiur.math.mootuhikud',
  'pikkused': 'kiur.math.mootuhikud',
  'jagamine-kahekohaline-uhekohaline': 'kiur.math.jagamine',
  'arvud-10000-piires': 'kiur.math.arvud-10000',
  'arvud-10000': 'kiur.math.arvud-10000',
  'ring-ja-ringjoon': 'kiur.math.ring',
  'mustrid': 'kiur.math.mustrid'
};

function roundTenths(value: number) {
  return Math.round(value * 10) / 10;
}

export function formatStars(value: number) {
  const rounded = roundTenths(value);
  return Number.isInteger(rounded) ? String(rounded) : rounded.toLocaleString('et-EE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function getLearningPointSettings(): LearningPointSettings {
  const row = db.prepare('SELECT * FROM learning_point_settings WHERE id = 1').get() as LearningPointSettingsRow | undefined;
  if (!row) return DEFAULT_SETTINGS;
  return {
    baseValue: row.baseValue,
    decayStep: row.decayStep,
    minimumValue: row.minimumValue,
    dailyCap: row.dailyCap,
    streakIntervalDays: row.streakIntervalDays,
    streakBonusAmount: row.streakBonusAmount,
    learningPointsEnabled: Boolean(row.learningPointsEnabled),
    streakBonusEnabled: Boolean(row.streakBonusEnabled)
  };
}

export function updateLearningPointSettings(input: LearningPointSettings) {
  const settings = {
    baseValue: Number(input.baseValue),
    decayStep: Number(input.decayStep),
    minimumValue: Number(input.minimumValue),
    dailyCap: Number(input.dailyCap),
    streakIntervalDays: Number(input.streakIntervalDays),
    streakBonusAmount: Number(input.streakBonusAmount),
    learningPointsEnabled: Boolean(input.learningPointsEnabled),
    streakBonusEnabled: Boolean(input.streakBonusEnabled)
  };
  if (settings.baseValue < 0 || settings.baseValue > 20) throw new Error('Algväärtus peab olema 0-20.');
  if (settings.decayStep < 0 || settings.decayStep > settings.baseValue) throw new Error('Vähenemine peab olema 0 kuni algväärtus.');
  if (settings.minimumValue < 0 || settings.minimumValue > settings.baseValue) throw new Error('Miinimum peab olema 0 kuni algväärtus.');
  if (settings.dailyCap < 0 || settings.dailyCap > 100) throw new Error('Päevane piir peab olema 0-100.');
  if (!Number.isInteger(settings.streakIntervalDays) || settings.streakIntervalDays < 1 || settings.streakIntervalDays > 365) throw new Error('Seeriaboonuse samm peab olema 1-365.');
  if (settings.streakBonusAmount < 0 || settings.streakBonusAmount > 100) throw new Error('Seeriaboonus peab olema 0-100.');

  db.prepare(`
    INSERT INTO learning_point_settings (id, baseValue, decayStep, minimumValue, dailyCap, streakIntervalDays, streakBonusAmount, learningPointsEnabled, streakBonusEnabled, updatedAt)
    VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      baseValue = excluded.baseValue,
      decayStep = excluded.decayStep,
      minimumValue = excluded.minimumValue,
      dailyCap = excluded.dailyCap,
      streakIntervalDays = excluded.streakIntervalDays,
      streakBonusAmount = excluded.streakBonusAmount,
      learningPointsEnabled = excluded.learningPointsEnabled,
      streakBonusEnabled = excluded.streakBonusEnabled,
      updatedAt = excluded.updatedAt
  `).run(settings.baseValue, settings.decayStep, settings.minimumValue, settings.dailyCap, settings.streakIntervalDays, settings.streakBonusAmount, settings.learningPointsEnabled ? 1 : 0, settings.streakBonusEnabled ? 1 : 0, nowIso());
}

export function exerciseKeyForAttempt(learner: Learner, category: string, topic?: string | null) {
  if (learner === 'kiur' && topic && KEY_BY_TOPIC[topic]) return KEY_BY_TOPIC[topic];
  const key = KEY_BY_CATEGORY[category];
  if (key) return key;
  return `${learner}.math.${category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'harjutus'}`;
}

function parseLearner(row: AttemptRow): Learner | null {
  if (row.learner === 'kiur' || row.learner === 'kirsi') return row.learner;
  return isKirsiAttempt(row.category, row.learner) ? 'kirsi' : 'kiur';
}

function dateOf(value: string) {
  return value.slice(0, 10);
}

function dailyLearningEarned(learner: Learner, date: string) {
  const row = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM point_ledger WHERE learner = ? AND source = 'study_exercise' AND substr(createdAt, 1, 10) = ?").get(learner, date) as { total: number } | undefined;
  return row?.total ?? 0;
}

function decayCountToday(learner: Learner, exerciseKey: string, date: string) {
  const row = db.prepare('SELECT COUNT(*) as count FROM study_attempt_rewards WHERE learner = ? AND exerciseKey = ? AND substr(createdAt, 1, 10) = ?').get(learner, exerciseKey, date) as { count: number } | undefined;
  return row?.count ?? 0;
}

function studyDates(learner: Learner) {
  const rows = db.prepare(`
    SELECT DISTINCT substr(createdAt, 1, 10) as day
    FROM attempts
    WHERE (learner = ? OR (? = 'kirsi' AND learner IS NULL AND category IN ('Arvutamine 10 piires','Arvutamine 20 piires','Suurem või väiksem kuni 100','Segaülesanded')))
      AND (subject IS NULL OR subject = 'matemaatika')
    ORDER BY day DESC
  `).all(learner, learner) as Array<{ day: string }>;
  return new Set(rows.map((row) => row.day));
}

export function getCurrentLearningStreak(learner: Learner, today = todayDateString()) {
  const dates = studyDates(learner);
  const cursor = new Date(`${today}T12:00:00Z`);
  let streak = 0;
  while (true) {
    const day = cursor.toISOString().slice(0, 10);
    if (!dates.has(day)) break;
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}

function hadStudyAttemptBeforeToday(learner: Learner, date: string, attemptId: number) {
  const row = db.prepare(`
    SELECT id FROM attempts
    WHERE id <> ? AND substr(createdAt, 1, 10) = ? AND (learner = ? OR (? = 'kirsi' AND learner IS NULL AND category IN ('Arvutamine 10 piires','Arvutamine 20 piires','Suurem või väiksem kuni 100','Segaülesanded')))
      AND (subject IS NULL OR subject = 'matemaatika')
    LIMIT 1
  `).get(attemptId, date, learner, learner);
  return Boolean(row);
}

export function awardStudyPointsForAttempt(attemptId: number): StudyReward | null {
  const existing = getStudyReward(attemptId);
  if (existing) return existing;

  const attempt = db.prepare('SELECT id, createdAt, category, questionCount, score, learner, subject, topic FROM attempts WHERE id = ?').get(attemptId) as AttemptRow | undefined;
  if (!attempt || attempt.subject === 'inglise-keel' || attempt.topic === 'sprint') return null;
  const learner = parseLearner(attempt);
  if (!learner || attempt.questionCount <= 0) return null;

  const settings = getLearningPointSettings();
  const date = dateOf(attempt.createdAt);
  const exerciseKey = exerciseKeyForAttempt(learner, attempt.category, attempt.topic);

  const tx = db.transaction(() => {
    const duplicate = getStudyReward(attemptId);
    if (duplicate) return duplicate;

    const attemptNumber = decayCountToday(learner, exerciseKey, date) + 1;
    const baseValue = settings.learningPointsEnabled ? Math.max(settings.minimumValue, settings.baseValue - settings.decayStep * (attemptNumber - 1)) : 0;
    const scorePercent = Math.max(0, Math.min(1, attempt.score / attempt.questionCount));
    const earnedBeforeCap = baseValue * scorePercent;
    const before = dailyLearningEarned(learner, date);
    const remaining = Math.max(0, settings.dailyCap - before);
    const awarded = settings.learningPointsEnabled ? Math.max(0, Math.min(earnedBeforeCap, remaining)) : 0;
    const roundedAwarded = Math.round(awarded * 100) / 100;
    const after = before + roundedAwarded;
    const createdAt = nowIso();

    let ledgerEntryId: number | null = null;
    if (roundedAwarded > 0) {
      const ledger = db.prepare(`
        INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
        VALUES (?, ?, 'study_exercise', ?, ?, ?, ?)
      `).run(learner, roundedAwarded, attemptId, `Harjutus: ${attempt.category}`, createdAt, JSON.stringify({ exerciseKey, score: attempt.score, questionCount: attempt.questionCount, scorePercent, baseValueBeforeScore: baseValue, earnedBeforeCap, awardedAmount: roundedAwarded, dailyCap: settings.dailyCap, dailyLearningEarnedBefore: before, dailyLearningEarnedAfter: after, decayAttemptNumberToday: attemptNumber }));
      ledgerEntryId = Number(ledger.lastInsertRowid);
    }

    db.prepare(`
      INSERT INTO study_attempt_rewards (attemptId, learner, exerciseKey, score, questionCount, scorePercent, baseValueBeforeScore, earnedBeforeCap, awardedAmount, dailyCap, dailyLearningEarnedBefore, dailyLearningEarnedAfter, decayAttemptNumberToday, ledgerEntryId, createdAt, metadataJson)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(attemptId, learner, exerciseKey, attempt.score, attempt.questionCount, scorePercent, baseValue, earnedBeforeCap, roundedAwarded, settings.dailyCap, before, after, attemptNumber, ledgerEntryId, createdAt, JSON.stringify({ settings }));

    const isNewStreakDay = !hadStudyAttemptBeforeToday(learner, date, attemptId);
    const streakLength = getCurrentLearningStreak(learner, date);
    let streakBonusAmount = 0;
    let streakBonusAwarded = false;

    if (isNewStreakDay && settings.streakBonusEnabled && settings.streakBonusAmount > 0 && streakLength > 0 && streakLength % settings.streakIntervalDays === 0) {
      const bonusLedger = db.prepare(`
        INSERT INTO point_ledger (learner, amount, source, sourceId, description, createdAt, metadataJson)
        VALUES (?, ?, 'streak_bonus', ?, ?, ?, ?)
      `).run(learner, settings.streakBonusAmount, attemptId, `Õpiseeria boonus: ${streakLength} päeva`, createdAt, JSON.stringify({ streakLength, streakInterval: settings.streakIntervalDays, bonusAmount: settings.streakBonusAmount, triggeringAttemptId: attemptId }));
      const bonus = db.prepare(`
        INSERT OR IGNORE INTO streak_bonus_awards (learner, streakLength, streakDate, amount, attemptId, ledgerEntryId, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(learner, streakLength, date, settings.streakBonusAmount, attemptId, bonusLedger.lastInsertRowid, createdAt);
      if (bonus.changes === 0) {
        db.prepare('DELETE FROM point_ledger WHERE id = ?').run(bonusLedger.lastInsertRowid);
      } else {
        streakBonusAmount = settings.streakBonusAmount;
        streakBonusAwarded = true;
      }
    }

    const balanceAfterAward = getBalance(learner);
    db.prepare('UPDATE study_attempt_rewards SET metadataJson = ? WHERE attemptId = ?').run(JSON.stringify({ settings, balanceAfterAward }), attemptId);

    return {
      attemptId,
      learner,
      exerciseKey,
      score: attempt.score,
      questionCount: attempt.questionCount,
      scorePercent,
      baseValueBeforeScore: baseValue,
      earnedBeforeCap,
      awardedAmount: roundedAwarded,
      dailyCap: settings.dailyCap,
      dailyLearningEarnedBefore: before,
      dailyLearningEarnedAfter: after,
      decayAttemptNumberToday: attemptNumber,
      ledgerEntryId,
      streakLength,
      streakBonusAmount,
      streakBonusAwarded,
      balanceAfter: balanceAfterAward,
      capReached: settings.learningPointsEnabled && earnedBeforeCap > roundedAwarded
    };
  });

  return tx();
}

export function getStudyReward(attemptId: number): StudyReward | null {
  const row = db.prepare(`
    SELECT r.*, COALESCE(b.amount, 0) as streakBonusAmount
    FROM study_attempt_rewards r
    LEFT JOIN streak_bonus_awards b ON b.attemptId = r.attemptId
    WHERE r.attemptId = ?
  `).get(attemptId) as (Omit<StudyReward, 'streakLength' | 'streakBonusAwarded' | 'balanceAfter' | 'capReached'> & { streakBonusAmount: number; metadataJson?: string | null }) | undefined;
  if (!row) return null;
  const learner = row.learner as Learner;
  let metadata: StudyRewardMetadata = {};
  if (typeof row.metadataJson === 'string') {
    try {
      metadata = JSON.parse(row.metadataJson) as StudyRewardMetadata;
    } catch {
      metadata = {};
    }
  }
  return {
    ...row,
    learner,
    streakLength: getCurrentLearningStreak(learner, todayDateString()),
    streakBonusAmount: row.streakBonusAmount || 0,
    streakBonusAwarded: Boolean(row.streakBonusAmount),
    balanceAfter: typeof metadata.balanceAfterAward === 'number' ? metadata.balanceAfterAward : getBalance(learner),
    capReached: row.earnedBeforeCap > row.awardedAmount
  };
}
