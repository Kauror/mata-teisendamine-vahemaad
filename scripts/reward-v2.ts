import { configuredDatabaseFile, openDatabase } from '../src/lib/db';

const args = new Set(process.argv.slice(2));
const apply = args.has('--apply');
const learnerArg = process.argv.find((value) => value.startsWith('--learner='))?.split('=')[1];
const learner = learnerArg === 'kiur' || learnerArg === 'kirsi' ? learnerArg : null;
if (!learner) {
  console.error('Usage: reward-v2 --learner=kiur|kirsi [--apply]');
  process.exit(2);
}

const databaseFile = configuredDatabaseFile();
const connection = openDatabase(databaseFile);
try {
  if (!apply) {
    const rows = connection.prepare(`
      SELECT id, clientAttemptId, completionDate, effectiveCompletedAt, score, questionCount,
             rewardPolicyVersion, exerciseId, runnerId
      FROM attempts
      WHERE learner = ? AND protocolVersion = 2
      ORDER BY completionDate, effectiveCompletedAt, clientAttemptId, id
    `).all(learner);
    process.stdout.write(`${JSON.stringify({ mode: 'dry_run', databaseFile, learner, attempts: rows }, null, 2)}\n`);
    process.exit(0);
  }

  if (process.env.REWARD_V2_APPLY_CONFIRM !== 'APPLY_COMPONENT_DELTAS') {
    throw new Error('Apply is gated. Set REWARD_V2_APPLY_CONFIRM=APPLY_COMPONENT_DELTAS after reviewing a dry-run and verified backup.');
  }
  const cutover = connection.prepare('SELECT status FROM reward_cutover_state WHERE id = 1').get() as { status: string } | undefined;
  if (cutover?.status !== 'frozen' && cutover?.status !== 'v2_active') {
    throw new Error('Reward baseline is not frozen. Run the copied-database cutover rehearsal first.');
  }
  const trigger = connection.prepare(`
    SELECT id FROM attempts WHERE learner = ? AND protocolVersion = 2 ORDER BY id DESC LIMIT 1
  `).get(learner) as { id: number } | undefined;
  if (!trigger) throw new Error('No protocol-v2 attempt exists for this learner.');

  // Dynamic imports ensure the CLI never initializes the application singleton
  // before the explicit database path above has been opened and checked.
  process.env.DATABASE_STARTUP_VERIFIED = '1';
  const { applyRewardProjectionV2 } = await import('../src/lib/server/rewards/projection');
  const transaction = connection.transaction(() => applyRewardProjectionV2(learner, trigger.id));
  const result = transaction();
  connection.prepare("UPDATE reward_cutover_state SET status = 'v2_active', updatedAt = ? WHERE id = 1").run(new Date().toISOString());
  process.stdout.write(`${JSON.stringify({ mode: 'apply', databaseFile, learner, result }, null, 2)}\n`);
} finally {
  connection.close();
}
