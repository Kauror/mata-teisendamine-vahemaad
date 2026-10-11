import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { listEnglishUnits, replaceEnglishWords, updateEnglishUnit, VocabularyError } from '@/lib/server/englishUnits';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(){
 if(!await hasParentSession()) return NextResponse.json({message:'Ligipääs puudub.'},{status:401});
 return NextResponse.json({units:listEnglishUnits(true)});
}
export async function POST(req:Request){
 if(!await hasParentSession()) return NextResponse.json({message:'Ligipääs puudub.'},{status:401});
 try{
  const body=await req.json();
  if(!body || typeof body!=='object') return NextResponse.json({message:'Vigane sisend.'},{status:400});
  if(body.action==='save') updateEnglishUnit(body);
  else if(body.action==='words' && typeof body.unitId==='string') replaceEnglishWords(body.unitId,body.words);
  else return NextResponse.json({message:'Vigane tegevus.'},{status:400});
  return NextResponse.json({units:listEnglishUnits(true)});
 }catch(err){return NextResponse.json({message:err instanceof Error?err.message:'Salvestamine ebaõnnestus.'},{status:err instanceof VocabularyError?err.status:400});}
}
