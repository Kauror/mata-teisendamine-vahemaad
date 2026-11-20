import { NextResponse } from 'next/server';
import {
  UnitTestConflictError,
  UnitTestContentError,
  UnitTestForbiddenError,
  UnitTestNotFoundError,
  UnitTestStaleError,
  UnitTestValidationError
} from '@/lib/server/unitTests/store';

// One mapping from the unit-test errors to HTTP for every route: a locked
// test is 403, a page that fell behind 409 with the current state.
export function unitTestErrorResponse(error: unknown) {
  if (error instanceof UnitTestStaleError) return NextResponse.json({ code: 'stale', message: error.message, state: error.payload }, { status: 409 });
  if (error instanceof UnitTestForbiddenError) return NextResponse.json({ code: 'forbidden', message: error.message }, { status: 403 });
  if (error instanceof UnitTestNotFoundError) return NextResponse.json({ code: 'not_found', message: error.message }, { status: 404 });
  if (error instanceof UnitTestConflictError) return NextResponse.json({ code: 'conflict', message: error.message }, { status: 409 });
  if (error instanceof UnitTestValidationError || error instanceof UnitTestContentError) {
    return NextResponse.json({ code: 'invalid', message: error.message }, { status: 400 });
  }
  console.error('Unit test request failed', error);
  return NextResponse.json({ code: 'server_error', message: 'Midagi läks valesti. Proovi uuesti.' }, { status: 500 });
}

export const validAttemptId = (id: string) => /^ut_[0-9a-f-]{36}$/u.test(id);
