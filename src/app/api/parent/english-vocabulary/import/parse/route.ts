import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { suggestImportMapping } from '@/lib/vocabulary/importPlan';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { MAX_UPLOAD_BYTES, readSpreadsheet } from '@/lib/server/vocabulary/spreadsheet';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Step 1 of the import: read the uploaded file (raw request body) into tables
// and suggest a column mapping. Nothing is stored.
export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_UPLOAD_BYTES) return NextResponse.json({ message: 'Fail on suurem kui 5 MB.' }, { status: 413 });
  try {
    const buffer = Buffer.from(await req.arrayBuffer());
    let fileName = '';
    try {
      fileName = decodeURIComponent(req.headers.get('x-file-name') ?? '').slice(0, 200);
    } catch {
      fileName = '';
    }
    const file = readSpreadsheet(buffer, fileName);
    return NextResponse.json({
      format: file.format,
      sheets: file.sheets.map((sheet) => ({ name: sheet.name, rows: sheet.rows, error: sheet.error ?? null, suggestedMapping: suggestImportMapping(sheet.rows, sheet.name) }))
    });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
