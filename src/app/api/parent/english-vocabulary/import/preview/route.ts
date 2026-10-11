import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { parseImportRows } from '@/lib/vocabulary/importPlan';
import { parseImportMapping, parseImportMode, parseImportTable, vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { previewImport } from '@/lib/server/vocabulary/units';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Step 2: validate every row and show what would change. Nothing is stored.
export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  try {
    const parsed = parseImportRows(parseImportTable(body.rows), parseImportMapping(body.mapping));
    return NextResponse.json(previewImport(parsed, parseImportMode(body.mode)));
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
