import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import example from '@/lib/schoolTimetable.example.json';
import { EMPTY_SCHOOL_TIMETABLE, parseSchoolTimetable } from '@/lib/schoolTimetable';
import { loadSchoolTimetable, resetSchoolTimetableCacheForTests, schoolTimetableFile } from '@/lib/server/schoolTimetableFile';
import { GET } from '@/app/api/school-timetable/route';

// C5: the real timetable is private. It is read from a file outside the
// repository; development and tests use the fictional example.

const cleanup: string[] = [];
afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  resetSchoolTimetableCacheForTests();
  for (const target of cleanup.splice(0)) fs.rmSync(target, { recursive: true, force: true });
});

function tempFile(contents: string) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'timetable-'));
  cleanup.push(directory);
  const file = path.join(directory, 'school-timetable.json');
  fs.writeFileSync(file, contents);
  return file;
}

describe('the school timetable file', () => {
  it('reads SCHOOL_TIMETABLE_FILE', () => {
    const custom = structuredClone(example);
    custom.children.kiur.className = '9Z';
    vi.stubEnv('SCHOOL_TIMETABLE_FILE', tempFile(JSON.stringify(custom)));
    expect(loadSchoolTimetable().children.kiur.className).toBe('9Z');
  });

  it('falls back to the fictional example outside production', () => {
    vi.stubEnv('SCHOOL_TIMETABLE_FILE', '');
    vi.stubEnv('NODE_ENV', 'test');
    expect(schoolTimetableFile()).toMatch(/schoolTimetable\.example\.json$/);
    expect(loadSchoolTimetable()).toEqual(parseSchoolTimetable(example));
  });

  it('uses the data volume in production and shows nothing when the file is missing', () => {
    vi.stubEnv('SCHOOL_TIMETABLE_FILE', '');
    vi.stubEnv('NODE_ENV', 'production');
    expect(schoolTimetableFile()).toBe('/data/school-timetable.json');
    vi.stubEnv('SCHOOL_TIMETABLE_FILE', path.join(os.tmpdir(), 'no-such-dir-harjutaja', 'school-timetable.json'));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(loadSchoolTimetable()).toBe(EMPTY_SCHOOL_TIMETABLE);
    expect(log).toHaveBeenCalledTimes(1);
    loadSchoolTimetable();
    expect(log).toHaveBeenCalledTimes(1);
  });

  it('refuses an invalid file without logging its contents', () => {
    vi.stubEnv('SCHOOL_TIMETABLE_FILE', tempFile(JSON.stringify({ version: 1, bells: 'private-secret' })));
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(loadSchoolTimetable()).toBe(EMPTY_SCHOOL_TIMETABLE);
    expect(String(log.mock.calls[0][0])).not.toContain('private-secret');
  });

  it('serves the timetable from /api/school-timetable in the file format', async () => {
    vi.stubEnv('SCHOOL_TIMETABLE_FILE', tempFile(JSON.stringify(example)));
    const response = await GET();
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(parseSchoolTimetable(await response.json())).toEqual(parseSchoolTimetable(example));
  });
});

describe('the repository', () => {
  it('no longer carries the timetable as data in code', () => {
    const source = fs.readFileSync(path.join(process.cwd(), 'src', 'lib', 'schoolTimetable.ts'), 'utf8');
    // No class names, lesson rows or club entries written out as literals.
    expect(source).not.toMatch(/className: '[^']+'/);
    expect(source).not.toMatch(/lessons: \[(null|')/);
    expect(source).not.toMatch(/\{ name: '[^']+', start: /);
    expect(source).not.toMatch(/const CLUB_ICONS/);
  });
});
