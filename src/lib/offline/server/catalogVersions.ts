import { createHash } from 'node:crypto';
import db from '@/lib/db';
import { getLearningExerciseCatalog, DAILY_EXERCISE_LIMIT } from '@/lib/learningExercises';
import { nowIso, type Learner } from '@/lib/tasks';
import {
  CATALOGUE_REFRESH_AFTER_DAYS,
  CATALOGUE_VALID_DAYS,
  GENERATOR_VERSION,
  ROTATION_ALGORITHM_VERSION,
  type CatalogueEntry,
  type OfflineCatalogue
} from '@/lib/shared/types';

// Immutable, content-hashed catalogue versions. A version only changes when the
// parent-configured pool for that child changes, so a device that keeps syncing
// an unchanged catalogue keeps the same version (and a refreshed window). The
// server validates offline attempts against the historical version their session
// started from, not the current pool.

type CatalogVersionRow = {
  version: string;
  learner: string;
  issuedAt: string;
  refreshAfter: string;
  validUntil: string;
  algorithmVersion: number;
  generatorVersion: string;
  dailyLimit: number;
  catalogueJson: string;
};

function entriesForLearner(learner: Learner): CatalogueEntry[] {
  return getLearningExerciseCatalog()
    .filter((exercise) => exercise.learnerScope.includes(learner))
    .map((exercise) => ({
      id: exercise.id,
      title: exercise.title,
      learnerScope: exercise.learnerScope,
      subject: exercise.subject,
      topic: exercise.topic,
      category: exercise.category,
      routePath: exercise.routePath,
      sortOrder: exercise.sortOrder,
      childStatus: exercise.childStatus
    }));
}

// Stable canonical string → content hash. Only fields that affect what the child
// may practise are included, sorted, so cosmetic churn does not bump the version.
function contentHash(learner: Learner, entries: CatalogueEntry[]) {
  const canonical = JSON.stringify({
    learner,
    algorithmVersion: ROTATION_ALGORITHM_VERSION,
    generatorVersion: GENERATOR_VERSION,
    dailyLimit: DAILY_EXERCISE_LIMIT,
    entries: [...entries]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((e) => ({ id: e.id, topic: e.topic, category: e.category, subject: e.subject, routePath: e.routePath, sortOrder: e.sortOrder, status: e.childStatus[learner] ?? null }))
  });
  return createHash('sha256').update(canonical).digest('hex').slice(0, 16);
}

function addDaysIso(iso: string, days: number) {
  return new Date(new Date(iso).getTime() + days * 86400000).toISOString();
}

// Current catalogue for a learner, persisting the version if new and refreshing
// the offline window on each serve.
export function getCurrentCatalogue(learner: Learner): OfflineCatalogue {
  const entries = entriesForLearner(learner);
  const version = contentHash(learner, entries);
  const now = nowIso();
  const existing = db.prepare('SELECT issuedAt FROM offline_catalog_versions WHERE learner = ? AND version = ?').get(learner, version) as { issuedAt: string } | undefined;
  const issuedAt = existing?.issuedAt ?? now;
  const refreshAfter = addDaysIso(now, CATALOGUE_REFRESH_AFTER_DAYS);
  const validUntil = addDaysIso(now, CATALOGUE_VALID_DAYS);

  db.prepare(`
    INSERT INTO offline_catalog_versions (version, learner, issuedAt, refreshAfter, validUntil, algorithmVersion, generatorVersion, dailyLimit, catalogueJson, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(learner, version) DO UPDATE SET
      refreshAfter = excluded.refreshAfter,
      validUntil = excluded.validUntil
  `).run(version, learner, issuedAt, refreshAfter, validUntil, ROTATION_ALGORITHM_VERSION, GENERATOR_VERSION, DAILY_EXERCISE_LIMIT, JSON.stringify(entries), now);

  return {
    learner,
    version,
    issuedAt,
    refreshAfter,
    validUntil,
    algorithmVersion: ROTATION_ALGORITHM_VERSION,
    generatorVersion: GENERATOR_VERSION,
    dailyLimit: DAILY_EXERCISE_LIMIT,
    entries
  };
}

export function getCatalogueByVersion(learner: Learner, version: string): OfflineCatalogue | null {
  const row = db.prepare('SELECT * FROM offline_catalog_versions WHERE learner = ? AND version = ?').get(learner, version) as CatalogVersionRow | undefined;
  if (!row) return null;
  let entries: CatalogueEntry[] = [];
  try {
    entries = JSON.parse(row.catalogueJson) as CatalogueEntry[];
  } catch {
    entries = [];
  }
  return {
    learner,
    version: row.version,
    issuedAt: row.issuedAt,
    refreshAfter: row.refreshAfter,
    validUntil: row.validUntil,
    algorithmVersion: row.algorithmVersion,
    generatorVersion: row.generatorVersion,
    dailyLimit: row.dailyLimit,
    entries
  };
}

export type CatalogueValidation =
  | { verdict: 'accept' }
  | { verdict: 'stale' }
  | { verdict: 'unknown'; reasonCode: 'catalogue_unknown' }
  | { verdict: 'removed'; reasonCode: 'exercise_removed' }
  | { verdict: 'not_permitted'; reasonCode: 'not_permitted' };

// Validate an offline attempt against the historical catalogue version its
// session started from.
export function validateAgainstCatalogue(input: {
  learner: Learner;
  version: string;
  exerciseId: string | null;
  subject: string;
  topic: string;
  category: string;
}): CatalogueValidation {
  const catalogue = getCatalogueByVersion(input.learner, input.version);
  if (!catalogue) return { verdict: 'unknown', reasonCode: 'catalogue_unknown' };

  const entry = catalogue.entries.find((e) => {
    if (input.exerciseId && e.id === input.exerciseId) return true;
    if (e.subject !== input.subject) return false;
    if (input.subject === 'matemaatika') {
      return input.learner === 'kirsi' ? e.topic === input.topic && e.category === input.category : e.topic === input.topic;
    }
    return e.topic === input.topic || e.category === input.category;
  });
  if (!entry) return { verdict: 'removed', reasonCode: 'exercise_removed' };

  const status = entry.childStatus[input.learner];
  if (status !== 'rotation' && status !== 'permanent') return { verdict: 'not_permitted', reasonCode: 'not_permitted' };

  return new Date(catalogue.validUntil).getTime() < Date.now() ? { verdict: 'stale' } : { verdict: 'accept' };
}
