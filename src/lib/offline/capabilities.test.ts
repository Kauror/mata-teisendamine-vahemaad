import { describe, expect, it } from 'vitest';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { OFFLINE_CAPABILITY_MANIFEST, validateOfflineCapabilityManifest } from '@/lib/offline/capabilities';

describe('offline capability manifest', () => {
  it('maps every offline runner to a cached route and includes the static result shell', () => {
    expect(validateOfflineCapabilityManifest()).toEqual([]);
    expect(OFFLINE_CAPABILITY_MANIFEST.shellRoutes).toContain('/tulemus');
    expect(OFFLINE_CAPABILITY_MANIFEST.runners.every((runner) => runner.offlineStart)).toBe(true);
  });

  it('keeps fixed science when catalogue hydration supplies no rotating cards', () => {
    const cards = childExerciseCards('kiur', []);
    expect(cards.map((card) => card.id)).toContain('kiur.science.loodusopetus');
    expect(childExerciseCards('kirsi', []).map((card) => card.id)).not.toContain('kiur.science.loodusopetus');
  });
});
