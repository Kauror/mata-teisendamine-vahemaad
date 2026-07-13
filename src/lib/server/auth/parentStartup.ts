import { assertParentAuthReady } from '@/lib/auth/parentState';
import { openDatabase } from '@/lib/db';

export function assertProductionParentAuthReady(databaseFile: string, environmentHash = process.env.PARENT_PASSWORD_HASH) {
  const connection = openDatabase(databaseFile);
  try {
    return assertParentAuthReady(connection, environmentHash);
  } finally {
    connection.close();
  }
}
