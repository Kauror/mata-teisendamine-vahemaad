import { NextResponse } from 'next/server';
import { listEnglishUnits } from '@/lib/server/englishUnits';
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(){return NextResponse.json({units:listEnglishUnits()});}
