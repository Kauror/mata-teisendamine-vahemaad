import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import db from '@/lib/db';
import { createTaskTemplate, getBalance } from '@/lib/tasks';
import { closeOfflineDbForTests, offlineDb, OFFLINE_DB_NAME } from '@/lib/offline/db';
import { bootstrapRepo, catalogRepo, catalogueGrantRepo, snapshotRepo, taskTemplateRepo } from '@/lib/offline/repositories';
import { syncNow } from '@/lib/offline/syncEngine';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import { getSyncTaskAssignments, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import { parseOfflineSyncRequest } from '@/lib/server/http/requestValidation';
import type { OfflineSyncPullRequestV2, OfflineSyncPullResponseV2, OfflineSyncPushRequestV2 } from '@/lib/shared/types';

// OFF-07 end to end: the real client (syncEngine + syncApply over fake
// IndexedDB) against the real server (runSyncPullV2 over in-memory SQLite),
// in every pairing that can meet during a deploy window.

type Server = (request: OfflineSyncPullRequestV2) => OfflineSyncPullResponseV2;

const newServer: Server = (request) => runSyncPullV2(request);

// A server from before OFF-07: ignores knownCatalogues and pageSize, and
// rebuilds every section on every page with no taskAssignmentDates.
const oldServer: Server = (request) => {
  const response = runSyncPullV2({ ...request, knownCatalogues: undefined, pageSize: undefined, cursor: { ...request.cursor, catalogueVersions: {} } });
  const now = new Date().toISOString();
  const pull = { ...response.pull };
  delete pull.taskAssignmentDates;
  return {
    ...response,
    pull: {
      ...pull,
      dashboards: {
        kiur: { learner: 'kiur', balance: getBalance('kiur'), streak: 0, trophies: 0, updatedAt: now },
        kirsi: { learner: 'kirsi', balance: getBalance('kirsi'), streak: 0, trophies: 0, updatedAt: now }
      },
      taskTemplates: getSyncTaskTemplates(),
      taskAssignments: getSyncTaskAssignments()
    }
  };
};

// A client from before OFF-07 never sends knownCatalogues.
const asOldClient = (request: OfflineSyncPullRequestV2): OfflineSyncPullRequestV2 => {
  const rest = { ...request };
  delete rest.knownCatalogues;
  return rest;
};

function wire(server: Server, transform: (request: OfflineSyncPullRequestV2) => OfflineSyncPullRequestV2 = (request) => request) {
  const pulls: Array<{ request: OfflineSyncPullRequestV2; response: OfflineSyncPullResponseV2 }> = [];
  vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    if (String(input).includes('/api/offline/ping')) {
      return Response.json({ ok: true, serverTime: new Date().toISOString(), protocolVersion: 2, supportedProtocolVersions: [2], appVersion: 'test' });
    }
    const body = parseOfflineSyncRequest(JSON.parse(String(init?.body)));
    if (body.phase === 'push') return Response.json(runSyncPushV2(body as OfflineSyncPushRequestV2));
    const request = transform(body as OfflineSyncPullRequestV2);
    const response = server(request);
    pulls.push({ request, response });
    return Response.json(response);
  }));
  return pulls;
}

function seedAttempts(count: number) {
  const insert = db.prepare(`INSERT INTO attempts (createdAt, completedAt, category, difficulty, questionCount, score, elapsedSeconds, questions, learner, subject, clientAttemptId, protocolVersion, rewardSettlementStatus)
    VALUES (?, ?, 'Teisendamine', 'Lihtne', 10, 9, 60, '[]', 'kiur', 'matemaatika', ?, 2, 'eligible')`);
  db.transaction(() => {
    for (let index = 0; index < count; index += 1) insert.run('2026-07-13T10:00:00.000Z', '2026-07-13T10:00:00.000Z', `delta-${index}`);
  })();
}

async function expectBootstrapped(historyRows: number) {
  expect(await (await offlineDb()).count('history')).toBe(historyRows);
  expect(await catalogRepo.get('kiur')).toBeTruthy();
  expect(await catalogRepo.get('kirsi')).toBeTruthy();
  expect((await catalogueGrantRepo.get('kiur'))?.catalogueVersion).toBe((await catalogRepo.get('kiur'))?.version);
  expect(await snapshotRepo.get('kiur')).toBeTruthy();
  expect(await snapshotRepo.get('kirsi')).toBeTruthy();
  expect((await taskTemplateRepo.all()).map((row) => row.title)).toEqual(['Koristus']);
  expect(await bootstrapRepo.get('deviceBootstrapComplete', false)).toBe(true);
  expect(await bootstrapRepo.get('taskBootstrapComplete', false)).toBe(true);
}

const carried = (pulls: ReturnType<typeof wire>, section: keyof OfflineSyncPullResponseV2['pull']) =>
  pulls.map(({ response }) => response.pull[section] !== undefined);

beforeEach(() => {
  db.pragma('foreign_keys = OFF');
  db.exec(`
    DELETE FROM attempts;
    DELETE FROM catalogue_grants;
    DELETE FROM offline_catalog_versions;
    DELETE FROM task_templates;
  `);
  db.pragma('foreign_keys = ON');
  createTaskTemplate({ title: 'Koristus', points: 3, assignmentMode: 'both_independent', recurrenceType: 'daily', startDate: '2026-01-01' });
  seedAttempts(700);
});

afterEach(async () => {
  vi.unstubAllGlobals();
  await closeOfflineDbForTests();
  await new Promise<void>((resolve, reject) => {
    const request = indexedDB.deleteDatabase(OFFLINE_DB_NAME);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => resolve();
  });
});

describe('slim pull end to end (OFF-07)', () => {
  it('new client, new server: a three-page backfill, then a slim steady state', async () => {
    const pulls = wire(newServer);
    expect(await syncNow('manual:test')).toMatchObject({ ok: true, pulled: 700 });

    expect(pulls).toHaveLength(3);
    expect(pulls[0].request.knownCatalogues).toEqual({});
    expect(Object.keys(pulls[1].request.knownCatalogues ?? {}).sort()).toEqual(['kirsi', 'kiur']);
    expect(carried(pulls, 'catalogues')).toEqual([true, false, false]);
    expect(carried(pulls, 'catalogueGrants')).toEqual([true, false, false]);
    expect(carried(pulls, 'dashboards')).toEqual([false, false, true]);
    expect(carried(pulls, 'taskTemplates')).toEqual([false, false, true]);
    await expectBootstrapped(700);

    pulls.length = 0;
    expect(await syncNow('manual:test')).toMatchObject({ ok: true, pulled: 0 });
    expect(pulls).toHaveLength(1);
    expect(pulls[0].response.pull.catalogues).toBeUndefined();
    expect(pulls[0].response.pull.dashboards).toBeDefined();
    await expectBootstrapped(700);
  });

  it('new client, old server: full sections on every page still apply', async () => {
    const pulls = wire(oldServer);
    expect(await syncNow('manual:test')).toMatchObject({ ok: true, pulled: 700 });

    expect(carried(pulls, 'catalogues')).toEqual([true, true, true]);
    expect(carried(pulls, 'dashboards')).toEqual([true, true, true]);
    expect(carried(pulls, 'taskAssignmentDates')).toEqual([false, false, false]);
    await expectBootstrapped(700);
  });

  it('old client, new server: judged by its cursor, never stranded without a catalogue', async () => {
    const pulls = wire(newServer, asOldClient);
    expect(await syncNow('manual:test')).toMatchObject({ ok: true, pulled: 700 });

    expect(pulls.every(({ request }) => request.knownCatalogues === undefined)).toBe(true);
    expect(carried(pulls, 'catalogues')).toEqual([true, false, false]);
    expect(carried(pulls, 'dashboards')).toEqual([false, false, true]);
    await expectBootstrapped(700);

    // Steady state: the cursor names the current versions and the server's
    // grant row is fresh, so nothing is resent; once that row is near expiry it is.
    pulls.length = 0;
    await syncNow('manual:test');
    expect(pulls[0].response.pull.catalogues).toBeUndefined();
    db.prepare('UPDATE catalogue_grants SET validUntil = ?').run(new Date(Date.now() + 5 * 86_400_000).toISOString());
    pulls.length = 0;
    await syncNow('manual:test');
    expect(Object.keys(pulls[0].response.pull.catalogues ?? {}).sort()).toEqual(['kirsi', 'kiur']);
  });

  it('re-requests a catalogue the device lost even though its cursor still names it', async () => {
    const pulls = wire(newServer);
    await syncNow('manual:test');
    await (await offlineDb()).delete('catalogues', 'kirsi');

    pulls.length = 0;
    await syncNow('manual:test');
    expect(Object.keys(pulls[0].request.knownCatalogues ?? {})).toEqual(['kiur']);
    expect(Object.keys(pulls[0].response.pull.catalogues ?? {})).toEqual(['kirsi']);
    expect(await catalogRepo.get('kirsi')).toBeTruthy();
  });
});
