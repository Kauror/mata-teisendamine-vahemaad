import fs from 'node:fs';
import path from 'node:path';
import {
  EMPTY_SCHOOL_TIMETABLE,
  parseSchoolTimetable,
  type SchoolTimetableData
} from '@/lib/schoolTimetable';

// The children's timetable is private and stays out of the public repository.
// Production reads it from SCHOOL_TIMETABLE_FILE (default
// /data/school-timetable.json, on the data volume next to the database; the
// deploy places it there). Development and tests fall back to the fictional
// src/lib/schoolTimetable.example.json. A missing or invalid file in production
// shows no timetable rather than someone else's: the error is logged once.

const EXAMPLE_FILE = path.join(process.cwd(), 'src', 'lib', 'schoolTimetable.example.json');

export function schoolTimetableFile() {
  const configured = process.env.SCHOOL_TIMETABLE_FILE?.trim();
  if (configured) return path.resolve(configured);
  return process.env.NODE_ENV === 'production' ? '/data/school-timetable.json' : EXAMPLE_FILE;
}

let cache: { file: string; mtimeMs: number; data: SchoolTimetableData } | null = null;
let lastError: string | null = null;

export function loadSchoolTimetable(): SchoolTimetableData {
  const file = schoolTimetableFile();
  try {
    const stat = fs.statSync(file);
    if (cache && cache.file === file && cache.mtimeMs === stat.mtimeMs) return cache.data;
    const data = parseSchoolTimetable(JSON.parse(fs.readFileSync(file, 'utf8')));
    cache = { file, mtimeMs: stat.mtimeMs, data };
    lastError = null;
    return data;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // The path is configuration, not private data; the contents never reach the log.
    if (message !== lastError) console.error(`School timetable unavailable (${file}): ${message.slice(0, 200)}`);
    lastError = message;
    cache = null;
    return EMPTY_SCHOOL_TIMETABLE;
  }
}

export function resetSchoolTimetableCacheForTests() {
  cache = null;
  lastError = null;
}
