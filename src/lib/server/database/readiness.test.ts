import Database from 'better-sqlite3';
import { describe, expect, it } from 'vitest';
import { openDatabase } from '@/lib/db';
import { checkDatabaseReadiness } from '@/lib/server/database/readiness';

describe('private database readiness', () => {
  it('passes only after startup verification with all migrations and tables', () => {
    const connection = openDatabase(':memory:');
    try {
      expect(checkDatabaseReadiness(connection, true)).toBe(true);
      expect(() => checkDatabaseReadiness(connection, false)).toThrow(/Startup verification/);
    } finally { connection.close(); }
  });

  it('fails when required tables or migrations are missing', () => {
    const connection = new Database(':memory:');
    try {
      expect(() => checkDatabaseReadiness(connection, true)).toThrow(/tables/);
    } finally { connection.close(); }
  });
});
