import { describe, expect, it } from 'vitest';
import { formatVersionDate, isVersionString, resolveAppVersion } from '../../scripts/app-version.mjs';

describe('formatVersionDate', () => {
  it('renders a commit timestamp as a dotted calendar version', () => {
    expect(formatVersionDate('2026-07-26T09:38:19+03:00')).toBe('2026.07.26');
  });

  it('pads single-digit months and days', () => {
    expect(formatVersionDate('2026-01-05T12:00:00Z')).toBe('2026.01.05');
  });

  // A commit made at 23:30 UTC is already "tomorrow" for the family, and the
  // rest of the app reckons days the same way (src/lib/appDate.ts).
  it('uses the Tallinn calendar day, not UTC', () => {
    expect(formatVersionDate('2026-07-25T22:30:00Z')).toBe('2026.07.26');
  });

  it('returns null for an unparseable timestamp', () => {
    expect(formatVersionDate('not-a-date')).toBeNull();
  });
});

describe('isVersionString', () => {
  it('accepts the dotted calendar form', () => {
    expect(isVersionString('2026.07.26')).toBe(true);
  });

  it('rejects semver and unpadded dates', () => {
    expect(isVersionString('0.9.3')).toBe(false);
    expect(isVersionString('2026.7.26')).toBe(false);
  });
});

describe('resolveAppVersion', () => {
  it('prefers an explicitly passed APP_VERSION (the Docker build-arg path)', () => {
    expect(resolveAppVersion({ env: { APP_VERSION: '2026.07.20' }, gitIso: '2026-07-26T09:00:00Z' })).toBe('2026.07.20');
  });

  it('rejects a malformed APP_VERSION rather than shipping it', () => {
    expect(() => resolveAppVersion({ env: { APP_VERSION: '0.9.3' }, gitIso: null })).toThrow(/2026\.07\.26/);
  });

  it('falls back to the last commit date', () => {
    expect(resolveAppVersion({ env: {}, gitIso: '2026-07-26T09:38:19+03:00' })).toBe('2026.07.26');
  });

  it('fails when neither source is available', () => {
    expect(() => resolveAppVersion({ env: {}, gitIso: null })).toThrow(/APP_VERSION is not set/);
  });
});
