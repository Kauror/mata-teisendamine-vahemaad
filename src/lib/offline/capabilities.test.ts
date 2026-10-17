import { describe, expect, it } from 'vitest';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { OFFLINE_CAPABILITY_MANIFEST, validateOfflineCapabilityManifest } from '@/lib/offline/capabilities';

describe('offline capability manifest', () => {
  it('maps every offline runner to a cached route and includes the static result shell', () => {
    expect(validateOfflineCapabilityManifest()).toEqual([]);
    expect(OFFLINE_CAPABILITY_MANIFEST.shellRoutes).toContain('/tulemus');
    // Remediation and the English vocabulary units are deliberately online-only
    // (both run server-authoritative sessions), so they are the runners excluded
    // from the offline-start promise (RTM-004).
    const online = OFFLINE_CAPABILITY_MANIFEST.runners.filter((runner) => !runner.offlineStart);
    expect(online.map((runner) => runner.id).sort()).toEqual(['kiur.english.vocabulary', 'remediation']);
    // Every other runner still promises offline start, and its route is cached.
    expect(OFFLINE_CAPABILITY_MANIFEST.runners.filter((runner) => !['remediation', 'kiur.english.vocabulary'].includes(runner.id)).every((runner) => runner.offlineStart)).toBe(true);
  });

  it('keeps the archived science runner in the manifest but never offers it as a card', () => {
    // Archived (FIXED_CHILD_EXERCISES): the runner route stays cached so it can
    // be reused later, but neither child gets the card offline.
    expect(OFFLINE_CAPABILITY_MANIFEST.runners.map((runner) => runner.id)).toContain('kiur.science.loodusopetus');
    expect(childExerciseCards('kiur', []).map((card) => card.id)).not.toContain('kiur.science.loodusopetus');
    expect(childExerciseCards('kirsi', []).map((card) => card.id)).not.toContain('kiur.science.loodusopetus');
  });
});
