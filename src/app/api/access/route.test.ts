import { beforeEach, describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import db from '@/lib/db';
import { hashSecret } from '@/lib/auth/password';
import { POST } from '@/app/api/access/route';

beforeEach(() => {
  process.env.APP_ORIGIN = 'https://example.test';
  process.env.APP_SESSION_SECRET_CURRENT = 'access-route-test-secret-0123456789abcdef';
  process.env.APP_ACCESS_PIN_HASH = hashSecret('a longer family passphrase');
  process.env.AUTH_TRUSTED_PROXY_MODE = 'cloudflare';
  db.exec('DELETE FROM auth_login_limits');
});

function request(pin: string, userAgent = 'test-browser') {
  return new NextRequest('https://example.test/api/access', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      origin: 'https://example.test',
      'cf-connecting-ip': '203.0.113.8',
      'user-agent': userAgent
    },
    body: JSON.stringify({ pin })
  });
}

describe('family login throttling', () => {
  it('returns Retry-After after failures even when user-agent changes', async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect((await POST(request('wrong', `browser-${attempt}`))).status).toBe(401);
    }
    const blocked = await POST(request('wrong', 'another-browser'));
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get('Retry-After'))).toBeGreaterThan(0);
    expect(Number(blocked.headers.get('Retry-After'))).toBeLessThanOrEqual(1800);
  });

  it('accepts a longer credential and clears only its source bucket', async () => {
    expect((await POST(request('wrong'))).status).toBe(401);
    expect((await POST(request('a longer family passphrase'))).status).toBe(200);
    expect((db.prepare('SELECT COUNT(*) AS count FROM auth_login_limits').get() as { count: number }).count).toBe(1);
  });
});
