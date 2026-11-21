import { createHash, timingSafeEqual } from 'node:crypto';
import db from '@/lib/db';
import { addAppDays, todayDateString } from '@/lib/appDate';

// School news from Minu (the parent's own dashboard on the same server).
// Minu reads eKool's weekly reports and the teachers' mail and pushes one
// snapshot here (POST /api/school-feed, home network only, bearer token).
// The snapshot replaces the previous one; it lives in parent_settings like
// the family notice, so it needs no schema migration. Nothing here is ever
// written by a child or the parent — it is read-only data from Minu.

const FEED_KEY = 'school_feed';
export const SCHOOL_FEED_MAX_BYTES = 256 * 1024;

type Learner = 'kiur' | 'kirsi';

export type SchoolTask = {
  date: string; // YYYY-MM-DD, the due day
  subject: string;
  type: string; // eKool's own label, e.g. "Kontrolltöö"
  kind: 'test' | 'homework';
  text: string;
};

export type SchoolNews = {
  child: Learner | null;
  date: string;
  kind: 'grade' | 'absence' | 'note' | 'message';
  subject: string;
  value: string;
  text: string;
};

export type SchoolEvent = { date: string; time: string; title: string };

export type SchoolFeed = {
  version: 1;
  generatedAt: string;
  children: Record<Learner, SchoolTask[]>;
  parent: { recent: SchoolNews[]; events: SchoolEvent[] };
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;
const LEARNERS: Learner[] = ['kiur', 'kirsi'];

function str(value: unknown, max: number) {
  return typeof value === 'string' ? value.replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, ' ').slice(0, max) : '';
}

function list<T>(value: unknown, max: number, map: (row: Record<string, unknown>) => T | null): T[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, max).flatMap((row) => {
    if (!row || typeof row !== 'object') return [];
    const mapped = map(row as Record<string, unknown>);
    return mapped ? [mapped] : [];
  });
}

// Accepts only the known shape; anything else is dropped, never stored as-is.
export function parseSchoolFeed(input: unknown): SchoolFeed | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  if (raw.version !== 1) return null;
  const generatedAt = str(raw.generatedAt, 40);
  if (Number.isNaN(Date.parse(generatedAt))) return null;
  const children = (raw.children ?? {}) as Record<string, unknown>;
  const parent = (raw.parent ?? {}) as Record<string, unknown>;
  const task = (row: Record<string, unknown>): SchoolTask | null => {
    const date = str(row.date, 10);
    if (!DATE.test(date)) return null;
    return { date, subject: str(row.subject, 80), type: str(row.type, 60), kind: row.kind === 'test' ? 'test' : 'homework', text: str(row.text, 500) };
  };
  const kinds = new Set(['grade', 'absence', 'note', 'message']);
  return {
    version: 1,
    generatedAt,
    children: {
      kiur: list(children.kiur, 60, task),
      kirsi: list(children.kirsi, 60, task)
    },
    parent: {
      recent: list(parent.recent, 60, (row) => {
        const date = str(row.date, 10);
        if (!DATE.test(date) || !kinds.has(String(row.kind))) return null;
        const child = LEARNERS.includes(row.child as Learner) ? (row.child as Learner) : null;
        return { child, date, kind: row.kind as SchoolNews['kind'], subject: str(row.subject, 120), value: str(row.value, 20), text: str(row.text, 800) };
      }),
      events: list(parent.events, 30, (row) => {
        const date = str(row.date, 10);
        if (!DATE.test(date)) return null;
        return { date, time: str(row.time, 5), title: str(row.title, 200) };
      })
    }
  };
}

export function saveSchoolFeed(feed: SchoolFeed) {
  db.prepare(`
    INSERT INTO parent_settings (key, value, updatedAt)
    VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt
  `).run(FEED_KEY, JSON.stringify(feed), new Date().toISOString());
}

export function getSchoolFeed(): (SchoolFeed & { receivedAt: string }) | null {
  const row = db.prepare('SELECT value, updatedAt FROM parent_settings WHERE key = ?').get(FEED_KEY) as { value: string; updatedAt: string } | undefined;
  if (!row) return null;
  try {
    const feed = parseSchoolFeed(JSON.parse(row.value));
    return feed ? { ...feed, receivedAt: row.updatedAt } : null;
  } catch {
    return null;
  }
}

// A child's own coming tests and homework, from today on. The snapshot may be
// a few hours old, so past days are dropped here as well.
export function childSchoolTasks(learner: Learner, today = todayDateString()) {
  const feed = getSchoolFeed();
  if (!feed) return { tasks: [] as SchoolTask[] };
  const until = addAppDays(today, 14);
  return { tasks: feed.children[learner].filter((t) => t.date >= today && t.date <= until) };
}

export function parentSchoolOverview(today = todayDateString()) {
  const feed = getSchoolFeed();
  if (!feed) return { connected: false as const };
  return {
    connected: true as const,
    receivedAt: feed.receivedAt,
    generatedAt: feed.generatedAt,
    children: {
      kiur: feed.children.kiur.filter((t) => t.date >= today),
      kirsi: feed.children.kirsi.filter((t) => t.date >= today)
    },
    recent: feed.parent.recent,
    events: feed.parent.events.filter((e) => e.date >= today)
  };
}

// The token itself is never stored: SCHOOL_FEED_TOKEN_SHA256 holds its
// SHA-256 (hex). No setting = the feed is switched off.
export function schoolFeedTokenMatches(authorization: string | null, expectedSha256 = process.env.SCHOOL_FEED_TOKEN_SHA256 ?? '') {
  const expected = expectedSha256.trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(expected)) return false;
  const match = /^Bearer (\S{20,200})$/.exec(authorization ?? '');
  if (!match) return false;
  const got = createHash('sha256').update(match[1]).digest();
  return timingSafeEqual(got, Buffer.from(expected, 'hex'));
}

export function schoolFeedEnabled() {
  return /^[0-9a-f]{64}$/i.test((process.env.SCHOOL_FEED_TOKEN_SHA256 ?? '').trim());
}
