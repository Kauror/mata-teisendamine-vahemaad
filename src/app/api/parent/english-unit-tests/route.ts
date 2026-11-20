import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { unitTestErrorResponse } from '@/lib/server/unitTests/http';
import {
  deleteVariant,
  importUnitTests,
  listPendingReviews,
  listRecentApproved,
  listVariants,
  setVariantActive,
  variantPreview
} from '@/lib/server/unitTests/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const denied = () => NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });

function variantParams(unit: unknown, variant: unknown) {
  const unitNumber = Number(unit);
  if (!Number.isInteger(unitNumber) || unitNumber < 1 || unitNumber > 999 || (variant !== 'A' && variant !== 'B')) return null;
  return { unitNumber, variant };
}

// The imported variants, the tests waiting for review and the latest
// approved ones. With ?unit=&variant= : one variant's preview, answers included.
export async function GET(req: NextRequest) {
  if (!await hasParentSession()) return denied();
  try {
    const query = req.nextUrl.searchParams;
    if (query.has('unit')) {
      const target = variantParams(query.get('unit'), query.get('variant'));
      if (!target) return NextResponse.json({ message: 'Vale test.' }, { status: 400 });
      return NextResponse.json(variantPreview(target.unitNumber, target.variant));
    }
    return NextResponse.json({ variants: listVariants(), pending: listPendingReviews(), recent: listRecentApproved() });
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}

// Imports test files: { files: [{ name, data }] }, data being the parsed JSON.
export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return denied();
  const body = await req.json().catch(() => null) as { files?: unknown } | null;
  if (!body || !Array.isArray(body.files)) return NextResponse.json({ message: 'Failid puuduvad.' }, { status: 400 });
  try {
    const files = body.files.map((file, index) => {
      const record = (file ?? {}) as { name?: unknown; data?: unknown };
      return { name: typeof record.name === 'string' ? record.name.slice(0, 120) : `fail ${index + 1}`, data: record.data };
    });
    return NextResponse.json({ results: importUnitTests(files), variants: listVariants() });
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest) {
  if (!await hasParentSession()) return denied();
  const body = await req.json().catch(() => ({})) as { unitNumber?: unknown; variant?: unknown; active?: unknown };
  const target = variantParams(body.unitNumber, body.variant);
  if (!target || typeof body.active !== 'boolean') return NextResponse.json({ message: 'Vale test.' }, { status: 400 });
  try {
    setVariantActive(target.unitNumber, target.variant, body.active);
    return NextResponse.json({ variants: listVariants() });
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  if (!await hasParentSession()) return denied();
  const target = variantParams(req.nextUrl.searchParams.get('unit'), req.nextUrl.searchParams.get('variant'));
  if (!target) return NextResponse.json({ message: 'Vale test.' }, { status: 400 });
  try {
    deleteVariant(target.unitNumber, target.variant);
    return NextResponse.json({ variants: listVariants() });
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}
