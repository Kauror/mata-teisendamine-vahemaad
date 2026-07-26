import { describe, expect, it } from 'vitest';
import { exerciseKeyForAttempt } from '@/lib/learningPoints';

// exerciseKey buckets the daily reward decay and keys mistake_pool rows, so an
// attempt must always land in the bucket its catalogue entry names. Anything
// that falls through to the generic tail gets a bucket that still works but
// lies about which subject it belongs to.
describe('exerciseKeyForAttempt', () => {
  it('matches the catalogue id for every fixed exercise', () => {
    expect(exerciseKeyForAttempt('kiur', 'Loodusõpetus', 'segaharjutus')).toBe('kiur.science.loodusopetus');
    expect(exerciseKeyForAttempt('kiur', 'Inglise keel - sprint', 'sprint')).toBe('kiur.english.sprint');
    expect(exerciseKeyForAttempt('kiur', 'Lugemine - loe ja vasta', 'loe-ja-vasta')).toBe('kiur.reading.loe-ja-vasta');
    expect(exerciseKeyForAttempt('kirsi', 'Lugemine - pilt ja sõna', 'pilt-ja-sona')).toBe('kirsi.reading.pilt-ja-sona');
    expect(exerciseKeyForAttempt('kirsi', 'Lugemine - esimene häälik', 'esimene-haalik')).toBe('kirsi.reading.esimene-haalik');
    expect(exerciseKeyForAttempt('kirsi', 'Loendamine', 'loendamine')).toBe('kirsi.math.counting-20');
  });

  it('keeps remediation in its own bucket regardless of what it revised', () => {
    expect(exerciseKeyForAttempt('kiur', 'Kordamine', 'kordamine')).toBe('kiur.remediation.mixed');
    expect(exerciseKeyForAttempt('kirsi', 'Kordamine', 'kordamine')).toBe('kirsi.remediation.mixed');
  });

  it('keeps Kiur maths topics split per topic and category', () => {
    expect(exerciseKeyForAttempt('kiur', 'Segaharjutus', 'ring-ja-ringjoon')).toBe('kiur.math.ring.segaharjutus');
    expect(exerciseKeyForAttempt('kiur', 'Segaharjutus', 'mootuhikud-pikkused')).toBe('kiur.math.mootuhikud.segaharjutus');
    expect(exerciseKeyForAttempt('kiur', 'Tekstülesanded', 'tekstulesanded')).toBe('kiur.math.tekstulesanded');
  });
});
