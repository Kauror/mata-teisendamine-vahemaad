import { createHash } from 'node:crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { POST } from '@/app/api/school-feed/route';
import { GET as childGET } from '@/app/api/school/route';
import { childSchoolTasks, parentSchoolOverview, parseSchoolFeed } from '@/lib/schoolFeed';

const TOKEN = 'minu-feed-token-0123456789abcdef';
const TODAY = '2026-11-23';

const FEED = {
  version: 1,
  generatedAt: '2026-11-21T09:00:00+02:00',
  children: {
    kiur: [
      { date: '2026-11-21', subject: 'Matemaatika', type: 'Kontrolltöö', kind: 'test', text: 'vana' },
      { date: '2026-11-24', subject: 'Eesti keel', type: 'Kontrolltöö', kind: 'test', text: 'Poolitamine' }
    ],
    kirsi: [{ date: '2026-11-25', subject: 'Muusikaõpetus', type: 'Ülesanne', kind: 'homework', text: 'Laul' }]
  },
  parent: {
    recent: [{ child: 'kiur', date: '2026-11-20', kind: 'grade', subject: 'Matemaatika', value: '5', text: '' }],
    events: [{ date: '2026-11-26', time: '08:30', title: 'Õppekäik' }]
  }
};

function post(body: unknown, headers: Record<string, string> = {}) {
  return POST(new NextRequest('http://192.168.1.133:3000/api/school-feed', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${TOKEN}`, ...headers },
    body: JSON.stringify(body)
  }));
}

beforeAll(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(`${TODAY}T09:00:00.000Z`));
  vi.stubEnv('SCHOOL_FEED_TOKEN_SHA256', createHash('sha256').update(TOKEN).digest('hex'));
});
afterAll(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});
beforeEach(() => {
  db.prepare("DELETE FROM parent_settings WHERE key = 'school_feed'").run();
});

describe('POST /api/school-feed', () => {
  it('stores the snapshot with the right token and each child reads only their own coming tasks', async () => {
    const res = await post(FEED);
    expect(res.status).toBe(200);
    expect(childSchoolTasks('kiur').tasks.map((t) => t.subject)).toEqual(['Eesti keel']);
    const kirsi = await childGET(new NextRequest('http://x/api/school?learner=kirsi'));
    expect((await kirsi.json()).tasks).toEqual([FEED.children.kirsi[0]]);
    const parent = parentSchoolOverview();
    expect(parent.connected && parent.recent[0].value).toBe('5');
    expect(parent.connected && parent.events[0].title).toBe('Õppekäik');
  });

  it('refuses a wrong token, a request through the tunnel and a switched-off feed', async () => {
    expect((await post(FEED, { authorization: 'Bearer wrong-token-0123456789abcdef' })).status).toBe(401);
    expect((await post(FEED, { 'cf-connecting-ip': '1.2.3.4' })).status).toBe(404);
    vi.stubEnv('SCHOOL_FEED_TOKEN_SHA256', '');
    expect((await post(FEED)).status).toBe(503);
    vi.stubEnv('SCHOOL_FEED_TOKEN_SHA256', createHash('sha256').update(TOKEN).digest('hex'));
    expect(childSchoolTasks('kiur').tasks).toEqual([]);
  });

  it('rejects an unknown shape and drops malformed rows', async () => {
    expect((await post({ version: 2 })).status).toBe(400);
    const parsed = parseSchoolFeed({ ...FEED, children: { kiur: [{ date: 'homme', subject: 'x' }, 'junk'], kirsi: [] } });
    expect(parsed?.children.kiur).toEqual([]);
  });
});
