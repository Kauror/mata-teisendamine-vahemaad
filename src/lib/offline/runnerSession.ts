import { getStorageHealth } from '@/lib/offline/db';
import { runnerSessionRepo } from '@/lib/offline/repositories';
import type { RunnerSessionV3 } from '@/lib/offline/records';
import { GENERATOR_VERSION, ROTATION_ALGORITHM_VERSION, type Learner } from '@/lib/shared/types';

export const RUNNER_SESSION_SCHEMA_VERSION = 3 as const;

export type RunnerStorageFailure = {
  code: 'storage_unavailable' | 'quota_exceeded' | 'storage_blocked' | 'session_missing';
  message: string;
  recoverable: boolean;
};

export class RunnerStorageError extends Error {
  readonly failure: RunnerStorageFailure;

  constructor(failure: RunnerStorageFailure, cause?: unknown) {
    super(failure.message, { cause });
    this.name = 'RunnerStorageError';
    this.failure = failure;
  }
}

export function runnerStorageFailure(error: unknown): RunnerStorageFailure {
  if (error instanceof RunnerStorageError) return error.failure;
  const health = getStorageHealth();
  if (health.state === 'quota_exceeded') {
    return { code: 'quota_exceeded', message: 'Seadme salvestusruum on täis. Harjutus on peatatud, et vastused ei kaoks.', recoverable: true };
  }
  if (health.state === 'blocked' || health.state === 'versionchange') {
    return { code: 'storage_blocked', message: 'Sulge teised äpi aknad ja proovi uuesti.', recoverable: true };
  }
  return { code: 'storage_unavailable', message: 'Harjutust ei saa praegu turvaliselt seadmesse salvestada.', recoverable: true };
}

export function isRunId(value: string | null | undefined): value is string {
  return Boolean(value && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value));
}

export function createRunId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes);
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((part) => part.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

// Returns the existing strict v4 UUID, or writes a newly-minted run id into the
// current URL before question generation. This makes reloads choose the same
// IndexedDB session instead of accidentally creating another run.
export function ensureRunIdInCurrentUrl(parameter = 'run'): string {
  if (typeof window === 'undefined') return createRunId();
  const url = new URL(window.location.href);
  const existing = url.searchParams.get(parameter);
  if (isRunId(existing)) return existing;
  const runId = createRunId();
  url.searchParams.set(parameter, runId);
  window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  return runId;
}

export type CreateRunnerSessionInput<
  Question = unknown,
  Answer = unknown,
  RunnerState = unknown,
  Feedback = unknown
> = {
  runId?: string;
  learner: Learner | null;
  runnerId: string;
  exerciseId: string | null;
  subject: string | null;
  topic: string;
  category: string;
  seed?: number | string | null;
  questions: Question[];
  optionOrder?: unknown;
  answers?: Answer[];
  currentIndex?: number;
  currentPhase?: string;
  feedback?: Feedback | null;
  hints?: unknown;
  runnerState: RunnerState;
  catalogueVersion?: string | null;
  rewardPolicyVersion?: string | null;
  generatorVersion?: string;
  runnerVersion: string;
  rotationVersion?: number | null;
  buildId?: string;
  startedAt?: string;
};

export function makeRunnerSession<
  Question = unknown,
  Answer = unknown,
  RunnerState = unknown,
  Feedback = unknown
>(input: CreateRunnerSessionInput<Question, Answer, RunnerState, Feedback>): RunnerSessionV3<Question, Answer, RunnerState, Feedback> {
  const runId = input.runId ?? createRunId();
  if (!isRunId(runId)) throw new Error('Runner runId must be an RFC 4122 version 4 UUID.');
  const now = input.startedAt ?? new Date().toISOString();
  return {
    schemaVersion: RUNNER_SESSION_SCHEMA_VERSION,
    sessionId: runId,
    runId,
    status: 'active',
    learner: input.learner,
    runnerId: input.runnerId,
    exerciseId: input.exerciseId,
    subject: input.subject,
    topic: input.topic,
    category: input.category,
    seed: input.seed ?? null,
    questions: input.questions,
    optionOrder: input.optionOrder ?? null,
    answers: input.answers ?? [],
    currentIndex: input.currentIndex ?? 0,
    currentPhase: input.currentPhase ?? 'question',
    feedback: input.feedback ?? null,
    hints: input.hints ?? null,
    runnerState: input.runnerState,
    activeElapsedMs: 0,
    startedAt: now,
    lastActiveAt: now,
    updatedAt: now,
    catalogueVersion: input.catalogueVersion ?? null,
    rewardPolicyVersion: input.rewardPolicyVersion ?? null,
    generatorVersion: input.generatorVersion ?? GENERATOR_VERSION,
    runnerVersion: input.runnerVersion,
    rotationVersion: input.rotationVersion ?? ROTATION_ALGORITHM_VERSION,
    buildId: input.buildId ?? process.env.NEXT_PUBLIC_APP_BUILD_ID ?? 'development',
    storageRevision: 1
  };
}

export async function createRunnerSession<
  Question = unknown,
  Answer = unknown,
  RunnerState = unknown,
  Feedback = unknown
>(input: CreateRunnerSessionInput<Question, Answer, RunnerState, Feedback>): Promise<RunnerSessionV3<Question, Answer, RunnerState, Feedback>> {
  const runId = input.runId ?? createRunId();
  if (!isRunId(runId)) throw new Error('Runner runId must be an RFC 4122 version 4 UUID.');
  const existing = await loadRunnerSession<Question, Answer, RunnerState, Feedback>(runId);
  if (existing) return existing;
  const session = makeRunnerSession({ ...input, runId });
  try {
    await runnerSessionRepo.put(session);
    return session;
  } catch (error) {
    throw new RunnerStorageError(runnerStorageFailure(error), error);
  }
}

export async function loadRunnerSession<
  Question = unknown,
  Answer = unknown,
  RunnerState = unknown,
  Feedback = unknown
>(runId: string): Promise<RunnerSessionV3<Question, Answer, RunnerState, Feedback> | undefined> {
  if (!isRunId(runId)) return undefined;
  return runnerSessionRepo.get(runId) as Promise<RunnerSessionV3<Question, Answer, RunnerState, Feedback> | undefined>;
}

export async function saveRunnerSession<Session extends RunnerSessionV3>(session: Session): Promise<Session> {
  try {
    const updated = { ...session, storageRevision: session.storageRevision + 1, updatedAt: new Date().toISOString() } as Session;
    await runnerSessionRepo.put(updated);
    return updated;
  } catch (error) {
    throw new RunnerStorageError(runnerStorageFailure(error), error);
  }
}

export async function patchRunnerSession<Session extends RunnerSessionV3>(runId: string, patch: Partial<Session>): Promise<Session> {
  try {
    return await runnerSessionRepo.patch<Session>(runId, patch);
  } catch (error) {
    const missing = error instanceof Error && error.message.includes('was not found');
    throw new RunnerStorageError(missing
      ? { code: 'session_missing', message: 'Salvestatud harjutust ei leitud.', recoverable: false }
      : runnerStorageFailure(error), error);
  }
}

function elapsedSince(lastActiveAt: string | null, now: Date): number {
  if (!lastActiveAt) return 0;
  return Math.max(0, now.getTime() - new Date(lastActiveAt).getTime());
}

export async function checkpointRunnerSession<Session extends RunnerSessionV3>(runId: string, patch: Partial<Session> = {}, now = new Date()): Promise<Session> {
  const session = await loadRunnerSession(runId) as Session | undefined;
  if (!session) throw new RunnerStorageError({ code: 'session_missing', message: 'Salvestatud harjutust ei leitud.', recoverable: false });
  const extraActiveMs = session.status === 'active' ? elapsedSince(session.lastActiveAt, now) : 0;
  return patchRunnerSession<Session>(runId, {
    ...patch,
    activeElapsedMs: session.activeElapsedMs + extraActiveMs,
    lastActiveAt: session.status === 'active' ? now.toISOString() : session.lastActiveAt
  } as Partial<Session>);
}

export async function pauseRunnerSession<Session extends RunnerSessionV3>(runId: string, patch: Partial<Session> = {}, now = new Date()): Promise<Session> {
  const session = await loadRunnerSession(runId) as Session | undefined;
  if (!session) throw new RunnerStorageError({ code: 'session_missing', message: 'Salvestatud harjutust ei leitud.', recoverable: false });
  const extraActiveMs = session.status === 'active' ? elapsedSince(session.lastActiveAt, now) : 0;
  return patchRunnerSession<Session>(runId, {
    ...patch,
    status: 'paused',
    activeElapsedMs: session.activeElapsedMs + extraActiveMs,
    lastActiveAt: null
  } as Partial<Session>);
}

export async function resumeRunnerSession<Session extends RunnerSessionV3>(runId: string, now = new Date()): Promise<Session> {
  return patchRunnerSession<Session>(runId, { status: 'active', lastActiveAt: now.toISOString() } as Partial<Session>);
}

export async function beginRunnerFinalization<Session extends RunnerSessionV3>(runId: string, patch: Partial<Session> = {}, now = new Date()): Promise<Session> {
  await pauseRunnerSession<Session>(runId, patch, now);
  return patchRunnerSession<Session>(runId, { status: 'finalizing' } as Partial<Session>);
}

export async function hasActiveRunnerSessions(): Promise<boolean> {
  return (await runnerSessionRepo.active()).length > 0;
}
