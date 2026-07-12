import { configuredDatabaseFile } from '../src/lib/db';
import { prepareDatabaseForStartup } from '../src/lib/server/database/verification';

const databaseFile = configuredDatabaseFile();
const backupDirectory = process.env.MATHS_GAME_BACKUP_DIR;
const result = prepareDatabaseForStartup(databaseFile, backupDirectory);

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
