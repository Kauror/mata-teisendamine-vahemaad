import { NextRequest, NextResponse } from 'next/server';
import { IMPORT_JSON_BODY_BYTES, readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { hasParentSession } from '@/lib/parentAuth';
import { parseImportRows } from '@/lib/vocabulary/importPlan';
import { parseImportMapping, parseImportMode, parseImportTable, vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { previewImport } from '@/lib/server/vocabulary/units';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Step 2: validate every row and show what would change. Nothing is stored.
export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const jsonBody = await readJsonObjectRequest(req, IMPORT_JSON_BODY_BYTES);
  if (jsonBody instanceof NextResponse) return jsonBody;
  const body = jsonBody as Record<string, unknown>;
  try {
    const parsed = parseImportRows(parseImportTable(body.rows), parseImportMapping(body.mapping));
    return NextResponse.json(previewImport(parsed, parseImportMode(body.mode)));
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
