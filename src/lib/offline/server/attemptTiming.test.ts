import { describe, expect, it } from 'vitest';
import { validateAttemptTiming } from '@/lib/offline/server/attemptTiming';

const received = '2026-07-13T12:00:00.000Z';
const grant = { issuedAt: '2026-07-01T00:00:00.000Z', validUntil: '2026-07-14T00:00:00.000Z' };
const check = (clientCorrectedCompletedAt: string, extra: Partial<Parameters<typeof validateAttemptTiming>[0]> = {}) =>
  validateAttemptTiming({ serverReceivedAt: received, rawDeviceCompletedAt: clientCorrectedCompletedAt, clientCorrectedCompletedAt, grant, ...extra });

describe('authoritative offline attempt timing', () => {
  it('accepts recent and multi-day offline work inside the configured window', () => {
    expect(check('2026-07-13T11:58:00.000Z')).toEqual({ verdict: 'accept' });
    expect(check('2026-07-03T10:00:00.000Z')).toEqual({ verdict: 'accept' });
  });
  it('holds grant-boundary and clock-drift activity for parent review', () => {
    expect(check('2026-06-30T23:00:00.000Z')).toMatchObject({ verdict: 'review', reasonCode: 'completion_before_grant' });
    expect(validateAttemptTiming({ serverReceivedAt: '2026-07-15T12:00:00.000Z', rawDeviceCompletedAt: '2026-07-14T02:00:00.000Z', clientCorrectedCompletedAt: '2026-07-14T02:00:00.000Z', grant })).toMatchObject({ verdict: 'review', reasonCode: 'completion_after_grant' });
    expect(validateAttemptTiming({ serverReceivedAt: received, rawDeviceCompletedAt: '2026-07-12T00:00:00.000Z', clientCorrectedCompletedAt: '2026-07-13T11:00:00.000Z', grant })).toMatchObject({ verdict: 'review', reasonCode: 'clock_drift' });
  });
  it('rejects impossible historical, pre-start, and future activity', () => {
    expect(check('2026-06-01T10:00:00.000Z')).toMatchObject({ verdict: 'reject', reasonCode: 'completion_too_old' });
    expect(check('2026-07-13T10:00:00.000Z', { startedAt: '2026-07-13T11:00:00.000Z' })).toMatchObject({ verdict: 'reject', reasonCode: 'completion_before_start' });
    expect(check('2026-07-13T12:03:00.000Z')).toMatchObject({ verdict: 'reject', reasonCode: 'impossible_future_timestamp' });
  });
});
