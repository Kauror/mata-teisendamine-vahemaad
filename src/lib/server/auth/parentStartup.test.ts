import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { hashSecret } from '@/lib/auth/password';
import { openDatabase } from '@/lib/db';
import { assertProductionParentAuthReady } from '@/lib/server/auth/parentStartup';

let directory: string;
let databaseFile: string;

beforeEach(() => {
  directory = fs.mkdtempSync(path.join(os.tmpdir(), 'parent-startup-'));
  databaseFile = path.join(directory, 'app.sqlite');
  openDatabase(databaseFile).close();
});

afterEach(() => {
  fs.rmSync(directory, { recursive: true, force: true });
});

describe('verified startup parent-auth gate', () => {
  it('fails startup without a parent-authentication source', () => {
    expect(() => assertProductionParentAuthReady(databaseFile, undefined)).toThrow(/Parent authentication is unavailable/);
  });

  it('starts with a valid environment hash', () => {
    expect(assertProductionParentAuthReady(databaseFile, hashSecret('environment-parent-password'))).toBe('environment');
  });

  it('starts with a valid stored hash', () => {
    const connection = openDatabase(databaseFile);
    connection.prepare('INSERT INTO parent_settings (key, value, updatedAt) VALUES (?, ?, ?)')
      .run('parent_password_hash', hashSecret('stored-parent-password'), new Date().toISOString());
    connection.close();
    expect(assertProductionParentAuthReady(databaseFile, undefined)).toBe('stored');
  });
});
