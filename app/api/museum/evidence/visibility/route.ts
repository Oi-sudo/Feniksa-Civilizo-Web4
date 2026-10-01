import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

export async function POST(req:NextRequest){
 const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
 const user=await getCurrentUser();
 if(!user||!hasAnyRole(user,['admin','museum_reviewer']))return NextResponse.json({error:eo?'Publikigi aŭ kaŝi kolektan materialon bezonas permeson de administranto aŭ muzea kontrolanto.':en?'Publishing or hiding collection material requires administrator or museum reviewer permission.':'公开或隐藏馆藏资料需要管理员或馆藏审核员权限。'},{status:403});
 try{
  const b=await req.json(); const visibility=String(b.visibility||'');
  if(!['reviewer','public'].includes(visibility))return NextResponse.json({error:eo?'La publika stato estas nevalida.':en?'The public status is invalid.':'公开状态无效。'},{status:400});
  await withTransaction(async client=>{
   const r=await client.query<{asset_id:string;visibility:string;copyright_status:string;verification_status:string;submitted_for_review_by:string|null;workflow_status:string;public_status:string}>(`
     SELECT m.asset_id,m.visibility,m.copyright_status,m.verification_status,a.submitted_for_review_by::text,a.workflow_status,a.public_status
       FROM asset_media m JOIN cultural_assets a ON a.id=m.asset_id
      WHERE m.id=$1 FOR UPDATE OF m`,[b.mediaId]);
   if(!r.rowCount)throw new Error('NOT_FOUND');
   if(visibility==='public'&&!['owned','authorized','public_domain'].includes(r.rows[0].copyright_status))throw new Error('RIGHTS');
   if(visibility==='public'&&r.rows[0].submitted_for_review_by===user.id)throw new Error('SELF_PUBLISH');
   if(visibility==='public'&&(r.rows[0].workflow_status!=='published'||r.rows[0].public_status!=='published'))throw new Error('ASSET_NOT_PUBLIC');
   if(visibility==='public'&&r.rows[0].verification_status!=='reviewed')throw new Error('MATERIAL_NOT_READY');
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
  if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:eo?'La kolekta materialo ne estis trovita.':en?'The collection material was not found.':'找不到馆藏资料。'},{status:404});
  if(e instanceof Error&&e.message==='RIGHTS')return NextResponse.json({error:eo?'La kopirajta aŭ montra stato ankoraŭ ne estas klara; la materialo ne povas esti publikigita nun.':en?'The copyright or display status is not yet clear; the material cannot be published now.':'版权/展示状态尚未明确，暂不能公开。'},{status:409});
  if(e instanceof Error&&e.message==='SELF_PUBLISH')return NextResponse.json({error:eo?'Ĉi tiu kolekta materialo estis sendita de vi; alia administranto aŭ muzea kontrolanto devas konfirmi la publikigon.':en?'You submitted this collection material; another administrator or museum reviewer must confirm publication.':'这是您提交的馆藏资料，请由另一位管理员或馆藏审核员确认公开。'},{status:409});
  if(e instanceof Error&&e.message==='ASSET_NOT_PUBLIC')return NextResponse.json({error:eo?'Unue publikigu la ĉefan kolektan dosieron, poste ĝiajn bildojn, filmetojn aŭ aliajn materialojn.':en?'Publish the main collection record first, then its images, videos or other materials.':'请先将馆藏档案整理并公开，再公开其中的图片、视频或其他资料。'},{status:409});
  if(e instanceof Error&&e.message==='MATERIAL_NOT_READY')return NextResponse.json({error:eo?'Unue kompletigu la ordigon de ĉi tiu kolekta materialo, poste publikigu ĝin.':en?'Complete the organization of this collection material before publishing it.':'请先完成这份收藏资料的整理，再公开展示。'},{status:409});
  console.error(e);return NextResponse.json({error:eo?'Provizore ne eblas ĝisdatigi la publikan staton.':en?'The public status cannot be updated right now.':'暂时无法更新公开状态。'},{status:500});
 }
}
