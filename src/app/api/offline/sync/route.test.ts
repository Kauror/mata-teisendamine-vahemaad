import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/offline/sync/route';

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
});
