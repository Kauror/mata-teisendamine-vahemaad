import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as purchase } from '@/app/api/store/purchase/route';
import { POST as gift } from '@/app/api/store/gift/route';
import { POST as complete } from '@/app/api/tasks/complete/route';
import { POST as remediation } from '@/app/api/remediation/[sessionId]/route';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';

// SEC-05: a failed child action shows the domain's Estonian message, never an
// internal error text (TypeError, SQLite, contract errors).

const post = (path: string, body: string) => new NextRequest(`https://example.test${path}`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body
});

async function message(response: Response) {
  return ((await response.json()) as { message?: string }).message ?? '';
}

describe('child action error messages', () => {
  it('does not echo a TypeError for a null body', async () => {
    for (const response of [
      await purchase(post('/api/store/purchase', 'null')),
      await gift(post('/api/store/gift', 'null')),
      await complete(post('/api/tasks/complete', 'null'))
    ]) {
      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(await message(response)).not.toMatch(/Cannot read|properties|null/);
    }
  });

  it('keeps the Estonian domain message', async () => {
    const response = await purchase(post('/api/store/purchase', JSON.stringify({ learner: 'kiur', itemId: 987654 })));
    expect(response.status).toBe(409);
    expect(await message(response)).toBe('Poe eset ei leitud.');
  });

  it('hides internal contract errors behind the fallback', async () => {
    const response = await remediation(post('/api/remediation/1', JSON.stringify({ learner: 'kiur', answers: [] })), { params: Promise.resolve({ sessionId: '1' }) });
    expect(response.status).toBe(400);
    expect(await message(response)).toMatch(/^[A-ZÕÄÖÜa-zõäöü ,.]+$/);
  });

  it('passes only plain domain errors', () => {
    expect(publicErrorMessage(new Error('Tähti ei ole piisavalt.'), 'x')).toBe('Tähti ei ole piisavalt.');
    expect(publicErrorMessage(new TypeError("Cannot read properties of null (reading 'learner')"), 'Ostu ei saanud teha.')).toBe('Ostu ei saanud teha.');
    expect(publicErrorMessage(Object.assign(new RangeError('SQLITE_CONSTRAINT'), { code: 'SQLITE_CONSTRAINT' }), 'Viga.')).toBe('Viga.');
    expect(publicErrorMessage('boom', 'Viga.')).toBe('Viga.');
  });
});
