import { configuredDatabaseFile } from '../src/lib/db';
import { prepareDatabaseForStartup } from '../src/lib/server/database/verification';

// tsx runs this as CommonJS; keep the await inside an async main().
async function main() {
  const databaseFile = configuredDatabaseFile();
  const backupDirectory = process.env.MATHS_GAME_BACKUP_DIR;
  const result = await prepareDatabaseForStartup(databaseFile, backupDirectory);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
