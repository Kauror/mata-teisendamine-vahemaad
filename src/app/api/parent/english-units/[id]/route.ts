import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { englishWordProgress, VocabularyError } from '@/lib/server/englishUnits';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(_req:Request,{params}:{params:Promise<{id:string}>}){
 if(!await hasParentSession()) return NextResponse.json({message:'Ligipääs puudub.'},{status:401});
 try{return NextResponse.json({words:englishWordProgress((await params).id)});}
 catch(err){return NextResponse.json({message:err instanceof Error?err.message:'Viga.'},{status:err instanceof VocabularyError?err.status:400});}
}
