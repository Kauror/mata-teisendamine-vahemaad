import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { parseSchoolFeed, saveSchoolFeed, SCHOOL_FEED_MAX_BYTES, schoolFeedEnabled, schoolFeedTokenMatches } from '@/lib/schoolFeed';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Minu (the parent's dashboard on the same server) pushes school news here.
// Server to server: no family session, no browser Origin — a bearer token
// instead (its SHA-256 is SCHOOL_FEED_TOKEN_SHA256). Home network only: a
// request that came through the Cloudflare tunnel carries cf-* headers and is
// refused even with the right token.
export async function POST(req: NextRequest) {
  if (req.headers.get('cf-connecting-ip') || req.headers.get('cf-ray')) {
    return NextResponse.json({ code: 'not_found' }, { status: 404 });
  }
  if (!schoolFeedEnabled()) return NextResponse.json({ code: 'feed_off' }, { status: 503 });
  if (!schoolFeedTokenMatches(req.headers.get('authorization'))) {
    return NextResponse.json({ code: 'unauthorized' }, { status: 401 });
  }
  const body = await readJsonObjectRequest(req, SCHOOL_FEED_MAX_BYTES);
  if (body instanceof NextResponse) return body;
  const feed = parseSchoolFeed(body);
  if (!feed) return NextResponse.json({ code: 'invalid_request' }, { status: 400 });
  saveSchoolFeed(feed);
  return NextResponse.json({ ok: true, kiur: feed.children.kiur.length, kirsi: feed.children.kirsi.length });
}
