import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/offline/sync/route';
import { setSyncRouteFaultInjectorForTests } from '@/app/api/offline/sync/faultInjection';

const device = {
  deviceId: '018f47f6-9f2c-7b9a-8a2e-123456789abc',
  appVersion: 'test',
  timeZone: 'Europe/Tallinn',
  clientNow: '2026-07-13T10:00:00.000Z'
};

afterEach(() => {
  setSyncRouteFaultInjectorForTests(null);
  vi.restoreAllMocks();
});

describe('offline sync protocol retirement', () => {
  it('rejects protocol-v1 uploads with deterministic 426 response', async () => {
    const request = new NextRequest('https://example.test/api/offline/sync', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ protocolVersion: 1, pending: { attempts: [] } })
    });
    const response = await POST(request);
    expect(response.status).toBe(426);
    expect(await response.json()).toMatchObject({ code: 'client_upgrade_required' });
  });

  it('classifies malformed JSON as 400 and semantic request errors as 422', async () => {
    const malformed = await POST(new NextRequest('https://example.test/api/offline/sync', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: '{'
    }));
    expect(malformed.status).toBe(400);

    const invalid = await POST(new NextRequest('https://example.test/api/offline/sync', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ protocolVersion: 2, phase: 'invalid', device, cursor: {} })
    }));
    expect(invalid.status).toBe(422);
  });

  it('returns a generic 500 for an injected unexpected failure and logs the cause', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    setSyncRouteFaultInjectorForTests(() => { throw new Error('injected database failure'); });
    const response = await POST(new NextRequest('https://example.test/api/offline/sync', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ protocolVersion: 2, phase: 'pull', device, cursor: {} })
    }));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body).toEqual({ code: 'internal_error', message: 'Sync is temporarily unavailable.' });
    expect(JSON.stringify(body)).not.toContain('injected database failure');
    expect(log).toHaveBeenCalledWith('offline sync failed', expect.any(Error));
  });
});
