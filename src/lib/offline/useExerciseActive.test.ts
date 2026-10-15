import { describe, expect, it, vi } from 'vitest';
import { resolveExerciseActive, type ActiveExercisesBody } from './useExerciseActive';

const match = { exerciseId: 'kiur.english.sprint', subject: 'inglise-keel', topic: 'sprint', category: 'Inglise keel - sprint' };

function respond(body: unknown, ok = true) {
  return vi.fn(async () => ({ ok, json: async () => body }) as Response);
}

describe('resolveExerciseActive (EX-14)', () => {
  it('trusts the live server when it answers', async () => {
    const permittedOffline = vi.fn(async () => true);
    const fetchImpl = respond({ exerciseIds: ['kiur.reading.loe-ja-vasta'] });
    await expect(resolveExerciseActive('kiur', match, undefined, { fetchImpl, permittedOffline })).resolves.toBe(false);
    expect(fetchImpl).toHaveBeenCalledWith('/api/learning-exercises/active?learner=kiur');
    expect(permittedOffline).not.toHaveBeenCalled();

    await expect(resolveExerciseActive('kiur', match, undefined, { fetchImpl: respond({ exerciseIds: ['kiur.english.sprint'] }), permittedOffline })).resolves.toBe(true);
  });

  it('falls back to the cached catalogue when the network fails', async () => {
    const permittedOffline = vi.fn(async () => true);
    const fetchImpl = vi.fn(async () => { throw new TypeError('Failed to fetch'); });
    await expect(resolveExerciseActive('kirsi', match, undefined, { fetchImpl, permittedOffline })).resolves.toBe(true);
    expect(permittedOffline).toHaveBeenCalledWith('kirsi', match);
  });

  it('falls back to the cached catalogue on a server error or an unreadable body', async () => {
    const permittedOffline = vi.fn(async () => true);
    await expect(resolveExerciseActive('kiur', match, undefined, { fetchImpl: respond({}, false), permittedOffline })).resolves.toBe(true);
    const unreadable = vi.fn(async () => ({ ok: true, json: async () => { throw new SyntaxError('bad json'); } }) as unknown as Response);
    await expect(resolveExerciseActive('kiur', match, undefined, { fetchImpl: unreadable, permittedOffline })).resolves.toBe(true);
    expect(permittedOffline).toHaveBeenCalledTimes(2);
  });

  it('blocks offline when the catalogue does not permit it or cannot be read', async () => {
    const fetchImpl = vi.fn(async () => { throw new TypeError('offline'); });
    await expect(resolveExerciseActive('kiur', match, undefined, { fetchImpl, permittedOffline: async () => false })).resolves.toBe(false);
    await expect(resolveExerciseActive('kiur', match, undefined, { fetchImpl, permittedOffline: async () => { throw new Error('idb'); } })).resolves.toBe(false);
  });

  it('lets a runner decide from the server answer itself', async () => {
    const body: ActiveExercisesBody = { exercises: [{ subject: 'matemaatika', topic: 'liitmine', category: 'Liitmine' }] };
    const isActive = (value: ActiveExercisesBody) => Boolean(value.exercises?.some((exercise) => exercise.topic === 'liitmine'));
    await expect(resolveExerciseActive('kirsi', { ...match, exerciseId: null }, isActive, { fetchImpl: respond(body), permittedOffline: async () => false })).resolves.toBe(true);
  });
});
