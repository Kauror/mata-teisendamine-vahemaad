import { NextResponse } from 'next/server';
import { PublicRequestError, readJsonBody } from '@/lib/server/http/requestValidation';

// Ordinary forms and child actions send a few hundred bytes; 64 KiB leaves
// room for a kontrolltöö answer sheet or a Kordamine batch of 100 answers.
export const DEFAULT_JSON_BODY_BYTES = 64 * 1024;
// Parent imports (kontrolltöö files, vocabulary tables) carry whole files.
export const IMPORT_JSON_BODY_BYTES = 1024 * 1024;

const PUBLIC_MESSAGES: Record<string, string> = {
  malformed_json: 'Päringu sisu ei sobi.',
  body_too_large: 'Päring on liiga suur.',
  invalid_request: 'Päringu sisu ei sobi.'
};

export function publicRequestErrorResponse(error: PublicRequestError) {
  return NextResponse.json(
    { code: error.code, message: PUBLIC_MESSAGES[error.code] ?? 'Päringu sisu ei sobi.' },
    { status: error.status }
  );
}

// Reads a bounded JSON object body. A malformed, oversized or non-object body
// becomes a 400/413 response instead of an exception the route would turn into
// a 500 (or a misleading 409). Usage:
//   const jsonBody = await readJsonObjectRequest(req);
//   if (jsonBody instanceof NextResponse) return jsonBody;
export async function readJsonObjectRequest(
  request: Request,
  maxBytes = DEFAULT_JSON_BODY_BYTES
): Promise<Record<string, unknown> | NextResponse> {
  try {
    const value = await readJsonBody(request, maxBytes);
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return publicRequestErrorResponse(new PublicRequestError(400, 'invalid_request', 'JSON body must be an object.'));
    }
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof PublicRequestError) return publicRequestErrorResponse(error);
    throw error;
  }
}
