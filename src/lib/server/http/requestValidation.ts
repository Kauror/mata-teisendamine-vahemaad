import type {
  OfflineAttemptPayload,
  OfflineRemediationActionPayload,
  OfflineSyncRequest,
  OfflineTaskActionPayload
} from '@/lib/shared/types';
import {
  MAX_PENDING_ACTIONS_PER_SYNC,
  MAX_PENDING_ATTEMPTS_PER_SYNC,
  SUPPORTED_OFFLINE_PROTOCOL_VERSIONS
} from '@/lib/shared/types';

export const MAX_MUTATION_BODY_BYTES = 1024 * 1024;

export type PublicErrorCode =
  | 'malformed_json'
  | 'reauth_required'
  | 'body_too_large'
  | 'invalid_request'
  | 'client_upgrade_required';

export class PublicRequestError extends Error {
  constructor(
    readonly status: 400 | 401 | 413 | 422 | 426,
    readonly code: PublicErrorCode,
    message: string,
    readonly issues: string[] = []
  ) {
    super(message);
  }
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isRfcUuid(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function isRfc3339(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,9})?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return false;
  return Number.isFinite(Date.parse(value));
}

export function isDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function finiteNumber(value: unknown, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}

function integer(value: unknown, min: number, max: number) {
  return finiteNumber(value, min, max) && Number.isInteger(value);
}

function boundedString(value: unknown, min: number, max: number) {
  return typeof value === 'string' && value.length >= min && value.length <= max;
}

export function isIanaTimeZone(value: unknown): value is string {
  if (typeof value !== 'string' || value.length < 1 || value.length > 100) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export async function readJsonBody(request: Request, maxBytes = MAX_MUTATION_BODY_BYTES): Promise<unknown> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new PublicRequestError(413, 'body_too_large', 'Request body is too large.');
  }
  if (!request.body) throw new PublicRequestError(400, 'malformed_json', 'JSON body is required.');

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new PublicRequestError(413, 'body_too_large', 'Request body is too large.');
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
  } catch {
    throw new PublicRequestError(400, 'malformed_json', 'Malformed JSON.');
  }
}

export type AttemptValidationResult =
  | { ok: true; value: OfflineAttemptPayload & Record<string, unknown> }
  | { ok: false; clientAttemptId: string; reasonCode: 'invalid_request'; issues: string[] };

export function validateAttemptRecordV2(value: unknown, requestDeviceId?: string): AttemptValidationResult {
  const issues: string[] = [];
  if (!object(value)) return { ok: false, clientAttemptId: '', reasonCode: 'invalid_request', issues: ['attempt must be an object'] };
  const clientAttemptId = typeof value.clientAttemptId === 'string' ? value.clientAttemptId : '';
  if (!isRfcUuid(value.clientAttemptId)) issues.push('clientAttemptId must be an RFC UUID');
  if (!isRfcUuid(value.deviceId)) issues.push('deviceId must be an RFC UUID');
  if (requestDeviceId && value.deviceId !== requestDeviceId) issues.push('deviceId does not match request device');
  if (value.learner !== 'kiur' && value.learner !== 'kirsi') issues.push('learner is invalid');
  if (!boundedString(value.subject, 1, 64)) issues.push('subject is required');
  if (value.topic !== null && !boundedString(value.topic, 0, 128)) issues.push('topic is invalid');
  if (!boundedString(value.category, 1, 160)) issues.push('category is required');
  if (!boundedString(value.difficulty, 1, 80)) issues.push('difficulty is required');
  if (!boundedString(value.exerciseId, 1, 160)) issues.push('exerciseId is required');
  if (!boundedString(value.catalogueVersion, 8, 128)) issues.push('catalogueVersion is required');
  if (!boundedString(value.rewardPolicyVersion, 8, 128)) issues.push('rewardPolicyVersion is required');
  if (!boundedString(value.generatorVersion, 1, 80)) issues.push('generatorVersion is required');
  if (!boundedString(value.runnerVersion, 1, 80)) issues.push('runnerVersion is required');
  if (!integer(value.rotationVersion, 1, 1_000_000)) issues.push('rotationVersion is invalid');
  if (value.startedAt !== null && !isRfc3339(value.startedAt)) issues.push('startedAt must be RFC 3339');
  if (!isRfc3339(value.rawDeviceCompletedAt)) issues.push('rawDeviceCompletedAt must be RFC 3339');
  if (!isRfc3339(value.completedAt)) issues.push('completedAt must be RFC 3339');
  if (value.clientCorrectedCompletedAt !== undefined && !isRfc3339(value.clientCorrectedCompletedAt)) issues.push('clientCorrectedCompletedAt must be RFC 3339');
  if (!isIanaTimeZone(value.clientTimeZone)) issues.push('clientTimeZone must be a valid IANA time zone');
  if (!integer(value.clientUtcOffsetMinutes, -840, 840)) issues.push('clientUtcOffsetMinutes is invalid');
  if (!integer(value.questionCount, 1, 500)) issues.push('questionCount is invalid');
  if (!integer(value.score, 0, 500)) issues.push('score is invalid');
  if (!finiteNumber(value.elapsedSeconds, 0, 7 * 24 * 60 * 60)) issues.push('elapsedSeconds is invalid');
  if (!Array.isArray(value.questions) || value.questions.length < 1 || value.questions.length > 500) issues.push('questions is invalid');
  if (integer(value.questionCount, 1, 500) && Array.isArray(value.questions) && value.questions.length !== value.questionCount) {
    issues.push('questionCount does not match questions');
  }
  return issues.length > 0
    ? { ok: false, clientAttemptId, reasonCode: 'invalid_request', issues }
    : { ok: true, value: value as OfflineAttemptPayload & Record<string, unknown> };
}

export function validateTaskActionRecordV2(value: unknown, requestDeviceId?: string): value is OfflineTaskActionPayload {
  if (!object(value)) return false;
  if (!isRfcUuid(value.clientActionId) || !isRfcUuid(value.deviceId)) return false;
  if (requestDeviceId && value.deviceId !== requestDeviceId) return false;
  if (value.learner !== 'kiur' && value.learner !== 'kirsi') return false;
  if (value.actionType !== 'complete' || !isDateOnly(value.taskDate)) return false;
  if (value.templateId !== null && !integer(value.templateId, 1, Number.MAX_SAFE_INTEGER)) return false;
  if (value.completedAt !== null && !isRfc3339(value.completedAt)) return false;
  return value.snapshot == null || (
    object(value.snapshot) &&
    boundedString(value.snapshot.title, 1, 200) &&
    finiteNumber(value.snapshot.points, 0, 10_000) &&
    boundedString(value.snapshot.assignmentMode, 1, 32) &&
    typeof value.snapshot.requiresApproval === 'boolean'
  );
}

export function validateRemediationActionRecordV2(value: unknown, requestDeviceId?: string): value is OfflineRemediationActionPayload {
  return object(value) &&
    isRfcUuid(value.clientActionId) &&
    isRfcUuid(value.deviceId) &&
    (!requestDeviceId || value.deviceId === requestDeviceId) &&
    isRfcUuid(value.bundleId) &&
    isRfcUuid(value.sessionId) &&
    (value.learner === 'kiur' || value.learner === 'kirsi') &&
    isRfc3339(value.completedAt) &&
    Array.isArray(value.answers) &&
    value.answers.length > 0 &&
    value.answers.length <= 100;
}

function validateDevice(value: unknown, issues: string[]) {
  if (!object(value)) {
    issues.push('device is required');
    return null;
  }
  if (!isRfcUuid(value.deviceId)) issues.push('device.deviceId must be an RFC UUID');
  if (!boundedString(value.appVersion, 1, 80)) issues.push('device.appVersion is invalid');
  if (value.buildId !== undefined && !boundedString(value.buildId, 1, 160)) issues.push('device.buildId is invalid');
  if (!isIanaTimeZone(value.timeZone)) issues.push('device.timeZone must be a valid IANA time zone');
  if (!isRfc3339(value.clientNow)) issues.push('device.clientNow must be RFC 3339');
  if (value.lastKnownServerOffsetMs !== undefined && !finiteNumber(value.lastKnownServerOffsetMs, -86_400_000, 86_400_000)) {
    issues.push('device.lastKnownServerOffsetMs is invalid');
  }
  return typeof value.deviceId === 'string' ? value.deviceId : null;
}

export function parseOfflineSyncRequest(value: unknown): OfflineSyncRequest {
  if (!object(value)) throw new PublicRequestError(422, 'invalid_request', 'Sync request must be an object.');
  const protocolVersion = value.protocolVersion;
  if (!SUPPORTED_OFFLINE_PROTOCOL_VERSIONS.includes(protocolVersion as 1 | 2)) {
    throw new PublicRequestError(426, 'client_upgrade_required', 'Unsupported offline protocol version.');
  }
  const issues: string[] = [];
  const deviceId = validateDevice(value.device, issues);
  if (!object(value.cursor)) issues.push('cursor is required');

  if (protocolVersion === 1) {
    if (!object(value.pending) || !Array.isArray(value.pending.attempts)) issues.push('pending.attempts is required');
    const attempts = object(value.pending) && Array.isArray(value.pending.attempts) ? value.pending.attempts : [];
    const actions = object(value.pending) && Array.isArray(value.pending.taskActions) ? value.pending.taskActions : [];
    if (attempts.length > MAX_PENDING_ATTEMPTS_PER_SYNC) issues.push(`attempt batch exceeds ${MAX_PENDING_ATTEMPTS_PER_SYNC}`);
    if (actions.length > MAX_PENDING_ACTIONS_PER_SYNC) issues.push(`action batch exceeds ${MAX_PENDING_ACTIONS_PER_SYNC}`);
  } else if (value.phase === 'push') {
    if (value.pushKind !== 'attempts' && value.pushKind !== 'actions') issues.push('pushKind is invalid');
    if (!object(value.pending)) issues.push('pending is required');
    const pending = object(value.pending) ? value.pending : {};
    const attempts = Array.isArray(pending.attempts) ? pending.attempts : [];
    const tasks = Array.isArray(pending.taskActions) ? pending.taskActions : [];
    const remediation = Array.isArray(pending.remediationActions) ? pending.remediationActions : [];
    if (attempts.length > MAX_PENDING_ATTEMPTS_PER_SYNC) issues.push(`attempt batch exceeds ${MAX_PENDING_ATTEMPTS_PER_SYNC}`);
    if (tasks.length + remediation.length > MAX_PENDING_ACTIONS_PER_SYNC) issues.push(`action batch exceeds ${MAX_PENDING_ACTIONS_PER_SYNC}`);
    if (value.pushKind === 'attempts' && (tasks.length > 0 || remediation.length > 0)) issues.push('attempt push contains actions');
    if (value.pushKind === 'actions' && attempts.length > 0) issues.push('action push contains attempts');
    // Records are deliberately validated independently by the sync service so
    // one malformed record does not prevent acknowledgements for valid siblings.
  } else if (value.phase === 'pull') {
    if (value.pageSize !== undefined && !object(value.pageSize)) issues.push('pageSize is invalid');
    if (object(value.pageSize)) {
      for (const [key, size] of Object.entries(value.pageSize)) {
        if (!['attempts', 'tombstones', 'taskChanges', 'remediationChanges', 'historyBackfill'].includes(key) || !integer(size, 1, 500)) {
          issues.push(`pageSize.${key} is invalid`);
        }
      }
    }
  } else {
    issues.push('phase is invalid');
  }

  if (issues.length > 0) throw new PublicRequestError(422, 'invalid_request', 'Sync request is invalid.', issues);
  if (!deviceId) throw new PublicRequestError(422, 'invalid_request', 'Device ID is invalid.');
  return value as unknown as OfflineSyncRequest;
}

export type AttemptContract = {
  learner: 'kiur' | 'kirsi';
  exerciseId: string;
  catalogueVersion: string;
  rewardPolicyVersion: string;
  generatorVersion: string;
  runnerVersion: string;
  rotationVersion: number;
};

export function metadataMatchesContract(attempt: Record<string, unknown>, contract: AttemptContract) {
  return attempt.learner === contract.learner &&
    attempt.exerciseId === contract.exerciseId &&
    attempt.catalogueVersion === contract.catalogueVersion &&
    attempt.rewardPolicyVersion === contract.rewardPolicyVersion &&
    attempt.generatorVersion === contract.generatorVersion &&
    attempt.runnerVersion === contract.runnerVersion &&
    attempt.rotationVersion === contract.rotationVersion;
}
