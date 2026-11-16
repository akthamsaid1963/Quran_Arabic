import { NextRequest,NextResponse } from 'next/server';
export async function GET(req:NextRequest,{params}:{params:Promise<{chapter:string}>}) {
 const {chapter}=await params,id=Number(chapter);
 if(!Number.isInteger(id)||id<1||id>114) return NextResponse.json({error:'Invalid chapter.'},{status:400});
 const base=process.env.QF_API_BASE,cid=process.env.QF_CLIENT_ID,secret=process.env.QF_CLIENT_SECRET;
 if(!base||!cid||!secret) return NextResponse.json({error:'Quran Foundation API credentials are not configured.'},{status:503});
 try {
  const auth=Buffer.from(cid+':'+secret).toString('base64');
  const tr=await fetch((process.env.QF_AUTH_URL||'https://oauth2.quran.foundation')+'/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+auth,'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'client_credentials',scope:'content'}),cache:'no-store'});
  if(!tr.ok) throw new Error('Authentication failed'); const token=await tr.json();
  const url=new URL(base+'/verses/by_chapter/'+id); url.searchParams.set('language','en'); url.searchParams.set('words','true'); url.searchParams.set('word_fields','text_uthmani,text_uthmani_tajweed'); url.searchParams.set('per_page','300');
  const res=await fetch(url,{headers:{'x-auth-token':token.access_token,'x-client-id':cid},next:{revalidate:86400}});
  if(!res.ok) throw new Error('Content API failed ('+res.status+')');
  return NextResponse.json(await res.json(),{headers:{'Cache-Control':'s-maxage=86400, stale-while-revalidate=604800'}});
 } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:'Upstream error'},{status:502}); }
}
