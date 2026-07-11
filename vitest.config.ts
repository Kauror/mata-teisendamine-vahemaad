import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // Each test file runs in its own fork with a fresh in-memory SQLite DB, so
    // integration tests never touch a real database file.
    env: { MATHS_GAME_DB_FILE: ':memory:' },
    // Reward/reconciliation tests build a real better-sqlite3 DB per test; keep
    // them isolated but allow the suite to run in-process.
    pool: 'forks'
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  }
});
