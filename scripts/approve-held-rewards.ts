import { configuredDatabaseFile, getDatabase } from '../src/lib/db';

// Releases attempts that are sitting in the parent's "Ülevaatust ootavad tähed"
// list, one by one, through exactly the code path the "Kinnita tähed" button
// uses (approveHeldRewardAttempt): the stars settle once, the change is emitted
// to the devices, and the daily leaderboard for that completion day is refreshed.
//
// It exists for holds the app itself caused. The catalogue grant used to be
// written once and never refreshed while the catalogue window kept rolling
// forward, so after CATALOGUE_VALID_DAYS every attempt from an unchanged
// exercise pool was held as `completion_after_grant`. Approving each one by hand
// is the only way back for work that was already done, and there can be dozens.
//
// Dry run first — it prints exactly what would be approved and changes nothing:
//   MATHS_GAME_DB_FILE=/data/maths-game.sqlite \
//     npx tsx scripts/approve-held-rewards.ts --reason=completion_after_grant
//
// Then apply, narrowing with --learner= / --reason= / --date= so a genuine hold
// (clock drift, an exercise the parent removed) is never swept up by accident:
//   APPROVE_HELD_CONFIRM=APPROVE_HELD_REWARDS MATHS_GAME_DB_FILE=... \
//     npx tsx scripts/approve-held-rewards.ts --reason=completion_after_grant --apply
async function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes('--apply');
  const value = (name: string) => argv.find((arg) => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=') || null;
  const learner = value('learner');
  const reason = value('reason');
  const date = value('date');
  if (learner && learner !== 'kiur' && learner !== 'kirsi') {
    console.error('Usage: approve-held-rewards [--learner=kiur|kirsi] [--reason=CODE] [--date=YYYY-MM-DD] [--apply]');
    process.exitCode = 2;
    return;
  }

  const databaseFile = configuredDatabaseFile();
  // Share the application's lazy database proxy, so the listing, the projection
  // writes and the leaderboard refresh all run on one SQLite connection.
  process.env.DATABASE_STARTUP_VERIFIED = '1';
  const connection = getDatabase();
  try {
    const { approveHeldRewardAttempt, listHeldRewardAttempts } = await import('../src/lib/server/rewards/projection');
    const held = listHeldRewardAttempts().filter((row) =>
      (!learner || row.learner === learner) &&
      (!reason || row.reviewReasonCode === reason) &&
      (!date || row.completionDate === date));

    if (!apply) {
      process.stdout.write(`${JSON.stringify({ mode: 'dry_run', databaseFile, filters: { learner, reason, date }, count: held.length, held }, null, 2)}\n`);
      return;
    }
    if (process.env.APPROVE_HELD_CONFIRM !== 'APPROVE_HELD_REWARDS') {
      throw new Error('Apply is gated. Set APPROVE_HELD_CONFIRM=APPROVE_HELD_REWARDS after reviewing the dry run.');
    }

    // Deliberately one transaction per attempt rather than one for all of them:
    // approveHeldRewardAttempt is idempotent, so a failure part-way leaves the
    // already-approved attempts settled and the command can simply be re-run.
    const approved: Array<{ id: number; learner: string; awardedAmount: number | null }> = [];
    for (const row of held) {
      const applied = approveHeldRewardAttempt(row.id);
      approved.push({ id: row.id, learner: row.learner, awardedAmount: applied?.rewardForTrigger?.awardedAmount ?? null });
    }
    process.stdout.write(`${JSON.stringify({ mode: 'apply', databaseFile, count: approved.length, approved }, null, 2)}\n`);
  } finally {
    connection.close();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
