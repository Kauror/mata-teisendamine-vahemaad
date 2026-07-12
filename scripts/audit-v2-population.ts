import Database from 'better-sqlite3';

// RTM3-C02 production-data audit gate.
//
// Migration 3 marked every existing protocol-v2 attempt without reward
// components as 'withheld', and migration 4 reversed every such 'withheld' row
// back to 'eligible'. That round-trip is only safe if the live database contains
// no genuine protocol-v2 attempts from earlier offline builds — an assumption the
// unit tests cannot prove. This script runs the exact audit queries from the
// finding against a COPY of the live database so an operator can confirm the v2
// population before deploying, and it fails closed on the one state that is
// definitely wrong: a held attempt that nevertheless carries awarded reward
// components (it should never have settled).
//
// Usage:
//   npm run audit:v2 -- /path/to/copy-of-live.sqlite
//   MATHS_GAME_DB_FILE=/path/to/copy.sqlite npm run audit:v2
//
// Run it against a COPY, never the live file — it opens read-only, but a copy
// keeps the audit off the production path entirely.

type SettlementRow = { protocolVersion: number; rewardSettlementStatus: string; attemptCount: number };
type AttemptRow = {
  id: number;
  clientAttemptId: string | null;
  rewardSettlementStatus: string;
  catalogueVersion: string | null;
  rewardPolicyVersion: string | null;
  componentCount: number;
};

function main() {
  const file = process.argv[2] ?? process.env.MATHS_GAME_DB_FILE;
  if (!file || file === ':memory:') {
    console.error('Usage: npm run audit:v2 -- <path-to-copy-of-live.sqlite>');
    process.exit(2);
    return;
  }

  const db = new Database(file, { readonly: true, fileMustExist: true });
  try {
    // 1. Population by protocol version and settlement status.
    const settlement = db.prepare(`
      SELECT protocolVersion, rewardSettlementStatus, COUNT(*) AS attemptCount
      FROM attempts
      GROUP BY protocolVersion, rewardSettlementStatus
      ORDER BY protocolVersion, rewardSettlementStatus
    `).all() as SettlementRow[];

    console.log('=== attempts by protocolVersion / rewardSettlementStatus ===');
    for (const row of settlement) {
      console.log(`  protocol ${row.protocolVersion} · ${row.rewardSettlementStatus.padEnd(12)} · ${row.attemptCount}`);
    }

    const v2Total = settlement.filter((r) => r.protocolVersion === 2).reduce((sum, r) => sum + r.attemptCount, 0);
    console.log(`\nTotal protocol-v2 attempts: ${v2Total}`);
    if (v2Total === 0) {
      console.log('No protocol-v2 attempts exist — migration 3/4 round-trip is a no-op. Safe to deploy.');
    }

    // 2. Per-attempt detail with canonical component counts, so a human can see
    //    exactly which v2 rows exist and how they settled.
    const perAttempt = db.prepare(`
      SELECT a.id, a.clientAttemptId, a.rewardSettlementStatus, a.catalogueVersion, a.rewardPolicyVersion,
             COUNT(c.id) AS componentCount
      FROM attempts a
      LEFT JOIN attempt_reward_components c ON c.attemptId = a.id
      WHERE a.protocolVersion = 2
      GROUP BY a.id
      ORDER BY a.id
    `).all() as AttemptRow[];

    if (perAttempt.length > 0) {
      console.log('\n=== protocol-v2 attempts (id · status · components · catalogue · policy) ===');
      for (const row of perAttempt) {
        console.log(`  #${row.id} · ${row.rewardSettlementStatus.padEnd(12)} · comps=${row.componentCount} · ${row.catalogueVersion ?? '—'} · ${row.rewardPolicyVersion ?? '—'}`);
      }
    }

    // A held attempt (withheld / needs_review) that already carries reward
    // components is the poisoned state migrations cannot repair on their own: it
    // was awarded and then reclassified. These MUST be handled explicitly before
    // release, so fail the gate if any exist.
    const poisoned = perAttempt.filter(
      (row) => (row.rewardSettlementStatus === 'withheld' || row.rewardSettlementStatus === 'needs_review') && row.componentCount > 0
    );
    if (poisoned.length > 0) {
      console.error(`\nAUDIT FAILED: ${poisoned.length} held attempt(s) carry reward components and need explicit handling:`);
      for (const row of poisoned) console.error(`  #${row.id} (${row.rewardSettlementStatus}) has ${row.componentCount} component(s)`);
      process.exit(1);
      return;
    }

    console.log('\nAudit passed: no held attempt carries reward components. Review the counts above before deploying.');
  } finally {
    db.close();
  }
}

main();
