import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';

export async function POST(req:NextRequest){
 const user=await getCurrentUser();
 if(!user||!hasAnyRole(user,['admin','museum_reviewer']))return NextResponse.json({error:'公开或隐藏馆藏资料需要管理员或馆藏审核员权限。'},{status:403});
 try{
  const b=await req.json(); const visibility=String(b.visibility||'');
  if(!['reviewer','public'].includes(visibility))return NextResponse.json({error:'公开状态无效。'},{status:400});
  await withTransaction(async client=>{
   const r=await client.query<{asset_id:string;visibility:string;copyright_status:string}>(`
     SELECT asset_id,visibility,copyright_status FROM asset_media WHERE id=$1 FOR UPDATE`,[b.mediaId]);
   if(!r.rowCount)throw new Error('NOT_FOUND');
   if(visibility==='public'&&!['owned','authorized','public_domain'].includes(r.rows[0].copyright_status))throw new Error('RIGHTS');
   await client.query(`UPDATE asset_media SET visibility=$2,published_at=CASE WHEN $2='public' THEN NOW() ELSE NULL END,
      published_by=CASE WHEN $2='public' THEN $3::uuid ELSE NULL END WHERE id=$1`,[b.mediaId,visibility,user.id]);
   const eventType=visibility==='public'?'evidence_published':'evidence_hidden';
   await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note,snapshot)
     VALUES($1,$2,$3,$4,$5::jsonb)`,[r.rows[0].asset_id,eventType,user.id,visibility==='public'?'Collection material made public':'Collection material hidden from public',JSON.stringify({mediaId:b.mediaId,from:r.rows[0].visibility,to:visibility})]);
   await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
     VALUES($1,$2,'asset_media',$3,$4::jsonb)`,[user.id,visibility==='public'?'museum.material_publish':'museum.material_hide',b.mediaId,JSON.stringify({visibility})]);
  });
  return NextResponse.json({ok:true});
 }catch(e){
  if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:'找不到馆藏资料。'},{status:404});
  if(e instanceof Error&&e.message==='RIGHTS')return NextResponse.json({error:'版权/展示状态尚未明确，暂不能公开。'},{status:409});
  console.error(e);return NextResponse.json({error:'暂时无法更新公开状态。'},{status:500});
 }
}
