import { describe, expect, it } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_JSON_BODY_BYTES, readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { POST as purchase } from '@/app/api/store/purchase/route';
import { POST as gift } from '@/app/api/store/gift/route';
import { POST as freeze } from '@/app/api/store/freeze/route';
import { POST as complete } from '@/app/api/tasks/complete/route';
import { POST as remediationStart } from '@/app/api/remediation/route';

// C7: every JSON route reads a bounded body, and a malformed one is a 400, not
// a 500 or a misleading 409.

const post = (path: string, body: string) => new NextRequest(`https://example.test${path}`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body
});

describe('readJsonObjectRequest', () => {
  it('returns the parsed object', async () => {
    expect(await readJsonObjectRequest(post('/x', '{"a":1}'))).toEqual({ a: 1 });
  });

  it('turns malformed JSON into a 400', async () => {
    const result = await readJsonObjectRequest(post('/x', '{not json'));
    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(400);
    expect(await (result as NextResponse).json()).toEqual({ code: 'malformed_json', message: 'Päringu sisu ei sobi.' });
  });

  it('refuses a non-object body with 400', async () => {
    for (const body of ['null', '[1]', '"x"', '3']) {
      const result = await readJsonObjectRequest(post('/x', body));
      expect((result as NextResponse).status).toBe(400);
    }
  });

  it('refuses an oversized body with 413', async () => {
    const big = JSON.stringify({ pad: 'x'.repeat(DEFAULT_JSON_BODY_BYTES) });
    const result = await readJsonObjectRequest(post('/x', big));
    expect((result as NextResponse).status).toBe(413);
  });

  it('accepts a larger limit when the route asks for one', async () => {
    const big = JSON.stringify({ pad: 'x'.repeat(DEFAULT_JSON_BODY_BYTES) });
    expect(await readJsonObjectRequest(post('/x', big), 1024 * 1024)).toHaveProperty('pad');
  });
});

describe('child write routes with a malformed body', () => {
  it('answer 400 malformed_json', async () => {
    for (const [handler, path] of [
      [purchase, '/api/store/purchase'],
      [gift, '/api/store/gift'],
      [freeze, '/api/store/freeze'],
      [complete, '/api/tasks/complete'],
      [remediationStart, '/api/remediation']
    ] as const) {
      const response = await handler(post(path, '{"learner":'));
      expect(response.status, path).toBe(400);
      expect(((await response.json()) as { code?: string }).code, path).toBe('malformed_json');
    }
  });
});
