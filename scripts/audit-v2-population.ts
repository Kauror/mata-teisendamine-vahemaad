import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import Database from 'better-sqlite3';
import { openDatabase } from '../src/lib/db';
import type { DatabaseConnection } from '../src/lib/db';

// RTM4-C03 production-data audit gate.
//
// Migration 3 marked every existing protocol-v2 attempt without reward
// components as 'withheld', and migration 4 reversed every such row back to
// 'eligible'. That round-trip — and the whole held-attempt release — is only
// safe if the live database contains no genuine protocol-v2 attempts from an
// earlier offline build. The unit tests cannot prove that; this script does, on
// a copy of the live database.
//
// It fixes three problems in the first version of the gate:
//   * WAL safety: it takes the audit copy through SQLite's online backup API
//     (or accepts a copy you made after stopping the container), never a raw
//     file copy that can miss committed pages still in the WAL.
//   * Missing schema: a genuine pre-offline database has no protocolVersion
//     column or attempt_reward_components table. The script detects this and
//     applies the pending migrations to a disposable copy before querying.
//   * Hidden poison: it no longer only flags held rows with components. It fails
//     closed on ANY pre-existing protocol-v2 attempt (including the documented
//     eligible+components state migration 4 cannot repair) and reports each one,
//     plus the daily_leaderboard / monthly_competition_awards rows that would
//     need rebuilding. This rollout has no generic bypass: the live copy must
//     contain zero pre-existing protocol-v2 attempts.
//
// Usage:
//   MATHS_GAME_DB_FILE=/data/maths-game.sqlite npm run audit:v2
//   npm run audit:v2 -- /data/maths-game.sqlite
//   npm run audit:v2 -- /data/maths-game.sqlite --no-copy        (audit a copy you already made)

type Args = { source: string; noCopy: boolean };

function parseArgs(): Args | null {
  const rest = process.argv.slice(2).filter((arg) => arg !== '--');
  const flags = new Set(rest.filter((arg) => arg.startsWith('--')));
  const positional = rest.filter((arg) => !arg.startsWith('--'));
  const source = positional[0] ?? process.env.MATHS_GAME_DB_FILE;
  if (!source || source === ':memory:') return null;
  return { source, noCopy: flags.has('--no-copy') };
}

function tableExists(db: DatabaseConnection, name: string): boolean {
  return Boolean(db.prepare("SELECT 1 FROM sqlite_master WHERE type IN ('table','view') AND name = ?").get(name));
}

function columnExists(db: DatabaseConnection, table: string, column: string): boolean {
  if (!tableExists(db, table)) return false;
  const rows = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === column);
}

async function backupToDisposable(source: string): Promise<string> {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'maths-audit-'));
  const destination = path.join(directory, 'audit-copy.sqlite');
  // Online backup API: WAL-safe, produces a consistent snapshot even while the
  // application is writing to the live file.
  const src = new Database(source, { readonly: true, fileMustExist: true });
  try {
    await src.backup(destination);
  } finally {
    src.close();
  }
  return destination;
}

type AttemptRow = {
  id: number;
  clientAttemptId: string | null;
  rewardSettlementStatus: string;
  catalogueVersion: string | null;
  rewardPolicyVersion: string | null;
  deviceId: string | null;
  componentCount: number;
};

function auditMigratedCopy(db: DatabaseConnection): number {
  // After migrations the offline schema always exists, so these queries are safe.
  const settlement = db.prepare(`
    SELECT protocolVersion, rewardSettlementStatus, COUNT(*) AS attemptCount
    FROM attempts GROUP BY protocolVersion, rewardSettlementStatus ORDER BY protocolVersion, rewardSettlementStatus
  `).all() as Array<{ protocolVersion: number; rewardSettlementStatus: string; attemptCount: number }>;

  console.log('=== attempts by protocolVersion / rewardSettlementStatus ===');
  for (const row of settlement) {
    console.log(`  protocol ${row.protocolVersion} · ${row.rewardSettlementStatus.padEnd(12)} · ${row.attemptCount}`);
  }

  const v2Attempts = db.prepare(`
    SELECT a.id, a.clientAttemptId, a.rewardSettlementStatus, a.catalogueVersion, a.rewardPolicyVersion, a.deviceId,
           COUNT(c.id) AS componentCount
    FROM attempts a
    LEFT JOIN attempt_reward_components c ON c.attemptId = a.id
    WHERE a.protocolVersion = 2
    GROUP BY a.id
    ORDER BY a.id
  `).all() as AttemptRow[];

  console.log(`\nTotal protocol-v2 attempts: ${v2Attempts.length}`);

  // Also report the derived aggregates that would need rebuilding/reconciling if
  // any v2 attempts exist (RTM4-C03 item 6, RTM4-H03).
  const dailyRows = (db.prepare('SELECT COUNT(*) AS count FROM daily_leaderboard').get() as { count: number }).count;
  const awardRows = db.prepare('SELECT month, winner, prizeStars FROM monthly_competition_awards ORDER BY month').all() as Array<{ month: string; winner: string; prizeStars: number }>;
  console.log(`daily_leaderboard rows: ${dailyRows}`);
  console.log(`monthly_competition_awards rows: ${awardRows.length}`);
  for (const award of awardRows) console.log(`  ${award.month}: winner=${award.winner} prize=${award.prizeStars}`);

  if (v2Attempts.length === 0) {
    console.log('\nAudit passed: no protocol-v2 attempts exist. The migration 3/4 round-trip is a no-op and no leaderboard/monthly rebuild is required.');
    return 0;
  }

  // Per-attempt validation to guide manual reconciliation.
  console.log('\n=== protocol-v2 attempts (must be reconciled explicitly) ===');
  for (const row of v2Attempts) {
    const grant = row.catalogueVersion && row.deviceId
      ? db.prepare('SELECT 1 FROM catalogue_grants WHERE learner IS NOT NULL AND catalogueVersion = ? AND (deviceId = ? OR deviceId IS NULL)').get(row.catalogueVersion, row.deviceId)
      : undefined;
    const policyKnown = row.rewardPolicyVersion
      ? Boolean(db.prepare('SELECT 1 FROM reward_policy_versions WHERE version = ?').get(row.rewardPolicyVersion))
      : false;
    const held = row.rewardSettlementStatus === 'withheld' || row.rewardSettlementStatus === 'needs_review';
    const flags: string[] = [];
    if (held && row.componentCount > 0) flags.push('HELD_WITH_COMPONENTS');
    if (row.rewardSettlementStatus === 'eligible' && row.componentCount > 0) flags.push('ELIGIBLE_WITH_COMPONENTS');
    if (!grant) flags.push('NO_MATCHING_GRANT');
    if (!policyKnown) flags.push('UNKNOWN_POLICY');
    console.log(`  #${row.id} · ${row.rewardSettlementStatus.padEnd(12)} · comps=${row.componentCount} · ${row.catalogueVersion ?? '—'} · ${row.rewardPolicyVersion ?? '—'} · ${flags.length ? flags.join(',') : 'ok'}`);
  }

  console.error(`\nAUDIT FAILED: ${v2Attempts.length} pre-existing protocol-v2 attempt(s) found.`);
  console.error('Migration 4 cannot prove any of these are clean (an originally-unpermitted attempt can');
  console.error("remain 'eligible' with components). Reconcile each attempt and the daily_leaderboard /");
  console.error('monthly_competition_awards rows above (npm run leaderboard:rebuild). Production rollout is blocked');
  console.error('until a new audit copy reports zero pre-existing protocol-v2 attempts.');
  return 1;
}

async function main() {
  const args = parseArgs();
  if (!args) {
    console.error('Usage: npm run audit:v2 -- <path-to-live-or-copied.sqlite> [--no-copy]');
    process.exit(2);
    return;
  }

  if (!fs.existsSync(args.source)) {
    console.error(`Database file not found: ${args.source}`);
    process.exit(2);
    return;
  }

  // Report whether the ORIGINAL copy already carries the offline schema, so a
  // genuine pre-offline database is recognised rather than erroring out.
  const probe = new Database(args.source, { readonly: true, fileMustExist: true });
  const hadOfflineSchema = columnExists(probe, 'attempts', 'protocolVersion') && tableExists(probe, 'attempt_reward_components');
  probe.close();
  console.log(`Source offline schema present: ${hadOfflineSchema ? 'yes' : 'no (pre-offline database)'}`);

  // WAL-safe disposable copy (unless the operator already made a cold copy).
  const workingCopy = args.noCopy ? args.source : await backupToDisposable(args.source);
  if (!args.noCopy) console.log(`WAL-safe audit copy: ${workingCopy}`);

  // Apply pending migrations to the disposable copy so the audit queries never
  // hit a missing column/table (RTM4-C03 items 2 and 3). openDatabase is a no-op
  // on an already-migrated copy.
  const disposableForMigration = args.noCopy ? args.source : workingCopy;
  const db = openDatabase(disposableForMigration);
  let exitCode = 0;
  try {
    exitCode = auditMigratedCopy(db);
  } finally {
    db.close();
    if (!args.noCopy) fs.rmSync(path.dirname(workingCopy), { recursive: true, force: true });
  }
  process.exit(exitCode);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
