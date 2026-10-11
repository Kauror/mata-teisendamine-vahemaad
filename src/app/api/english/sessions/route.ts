import { NextResponse } from 'next/server';
import { startEnglishSession, VocabularyError } from '@/lib/server/englishUnits';
import type { VocabularyMode } from '@/lib/englishUnits';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function POST(req:Request){
  try{
    const body=await req.json();
    if(typeof body?.unitId!=='string' || !['study','test','weak'].includes(body.mode)) return NextResponse.json({message:'Vigane harjutus.'},{status:400});
    return NextResponse.json(startEnglishSession(body.unitId,body.mode as VocabularyMode));
  }catch(err){return NextResponse.json({message:err instanceof Error?err.message:'Harjutus ei avanenud.'},{status:err instanceof VocabularyError?err.status:400});}
}
