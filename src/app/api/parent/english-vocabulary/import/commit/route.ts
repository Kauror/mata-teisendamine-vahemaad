import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { parseImportRows } from '@/lib/vocabulary/importPlan';
import { parseImportMapping, parseImportMode, parseImportTable, vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { commitImport } from '@/lib/server/vocabulary/units';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Step 3: the parent confirmed the preview identified by `planHash`. The plan
// is recomputed and must match, then written in one transaction. Imported
// units are never published automatically.
export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  if (typeof body.planHash !== 'string' || !/^[0-9a-f]{64}$/u.test(body.planHash)) {
    return NextResponse.json({ message: 'Eelvaade puudub.' }, { status: 400 });
  }
  try {
    const parsed = parseImportRows(parseImportTable(body.rows), parseImportMapping(body.mapping));
    const plan = commitImport(parsed, parseImportMode(body.mode), body.planHash, typeof body.fileName === 'string' ? body.fileName : null);
    return NextResponse.json({ totals: plan.totals });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
