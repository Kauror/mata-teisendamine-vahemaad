import { rebuildDailyLeaderboard } from '../src/lib/leaderboard';

// RTM4-H03 maintenance step: rebuild every daily_leaderboard row from the
// attempts table using the corrected eligibility filter and re-settle every
// already-awarded month. Run once after deploying the held-attempt fix so any
// historical rows written by an earlier build (which counted held attempts) are
// repaired in place. Idempotent — safe to run more than once.
//
// Usage (against the live DB the app uses):
//   MATHS_GAME_DB_FILE=/data/maths-game.sqlite npm run leaderboard:rebuild
//
// tsx runs this as CommonJS; rebuildDailyLeaderboard is synchronous.
function main() {
  const result = rebuildDailyLeaderboard();
  process.stdout.write(`Rebuilt ${result.rebuiltDates} day(s); reconciled ${result.reconciledMonths} settled month(s).\n`);
}

main();
