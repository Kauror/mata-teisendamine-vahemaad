import { configuredDatabaseFile, getDatabase } from '../src/lib/db';

async function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has('--apply');
  const learnerArg = process.argv.find((value) => value.startsWith('--learner='))?.split('=')[1];
  const learner = learnerArg === 'kiur' || learnerArg === 'kirsi' ? learnerArg : null;
  if (!learner) {
    console.error('Usage: reward-v2 --learner=kiur|kirsi [--apply]');
    process.exitCode = 2;
    return;
  }

  const databaseFile = configuredDatabaseFile();
  // The projection module uses the application's lazy database proxy. Initialize
  // that singleton here so the cutover checks, projection writes and status update
  // all share one SQLite connection and one transaction.
  process.env.DATABASE_STARTUP_VERIFIED = '1';
  const connection = getDatabase();
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
      return;
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

    const { applyRewardProjectionV2 } = await import('../src/lib/server/rewards/projection');
    const transaction = connection.transaction(() => {
      const projection = applyRewardProjectionV2(learner, trigger.id);
      connection.prepare("UPDATE reward_cutover_state SET status = 'v2_active', updatedAt = ? WHERE id = 1").run(new Date().toISOString());
      return projection;
    });
    const result = transaction();
    process.stdout.write(`${JSON.stringify({ mode: 'apply', databaseFile, learner, result }, null, 2)}\n`);
  } finally {
    connection.close();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
