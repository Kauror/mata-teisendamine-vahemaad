import { NextResponse } from 'next/server';
import { actEnglishSession, getEnglishSession, VocabularyError } from '@/lib/server/englishUnits';
import type { VocabularyAction } from '@/lib/englishUnits';
export const dynamic='force-dynamic';
export const runtime='nodejs';
type Params={params:Promise<{id:string}>};
export async function GET(_req:Request,{params}:Params){
 try{return NextResponse.json(getEnglishSession((await params).id));}
 catch(err){return NextResponse.json({message:err instanceof Error?err.message:'Seanssi ei leitud.'},{status:err instanceof VocabularyError?err.status:400});}
}
export async function POST(req:Request,{params}:Params){
 try{
  const body=await req.json();
  if(!body || typeof body!=='object' || typeof body.revision!=='number' || !body.action || typeof body.action!=='object' ||
    !['reveal','grade','answer','next'].includes(body.action.action)) return NextResponse.json({message:'Vigane käsk.'},{status:400});
  return NextResponse.json(actEnglishSession((await params).id,body.revision,body.action as VocabularyAction));
 }catch(err){return NextResponse.json({message:err instanceof Error?err.message:'Seanssi uuendamine ebaõnnestus.'},{status:err instanceof VocabularyError?err.status:400});}
}
