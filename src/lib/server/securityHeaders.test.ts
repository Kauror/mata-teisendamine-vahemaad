import { describe, expect, it } from 'vitest';
import nextConfig from '../../../next.config';

describe('production response security headers', () => {
  it('sets anti-framing, MIME, referrer, permission and transport policies', async () => {
    const rules = await nextConfig.headers!();
    const headers = new Map(rules.find((rule) => rule.source === '/:path*')?.headers.map((header) => [header.key, header.value]));
    expect(headers.get('Content-Security-Policy')).toContain("frame-ancestors 'none'");
    expect(headers.get('Content-Security-Policy')).toContain("worker-src 'self' blob:");
    expect(headers.get('Content-Security-Policy')).not.toContain("'unsafe-eval'");
    expect(headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(headers.get('Referrer-Policy')).toBeTruthy();
    expect(headers.get('Permissions-Policy')).toBeTruthy();
    expect(headers.get('Strict-Transport-Security')).toContain('max-age=31536000');
  });
});

describe('API response caching (SEC-06)', () => {
  it('marks every API response no-store, so child data and answer keys are never kept by a browser or proxy cache', async () => {
    const rules = await nextConfig.headers!();
    const api = rules.find((rule) => rule.source === '/api/:path*');
    expect(api?.headers).toContainEqual({ key: 'Cache-Control', value: 'no-store' });
  });
});
