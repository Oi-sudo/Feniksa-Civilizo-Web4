import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';

const MEDIA=new Set(['image','video','document','certificate','3d_model']);
const ROLES=new Set(['original','publication_history','comparison','research_reference']);
const COPYRIGHT=new Set(['unknown','owned','authorized','public_domain']);

export async function POST(req:NextRequest){
 const user=await getCurrentUser();
 if(!user||!hasAnyRole(user,['admin','curator','museum_reviewer']))return NextResponse.json({error:'需要馆藏管理权限。'},{status:403});
 try{
  const b=await req.json();
  const mediaType=String(b.mediaType||''), evidenceRole=String(b.evidenceRole||'');
  const fileUrl=String(b.fileUrl||'').trim(), caption=String(b.caption||'').trim();
  const sourceNote=String(b.sourceNote||'').trim()||null, copyrightStatus=String(b.copyrightStatus||'unknown');
  if(!MEDIA.has(mediaType)||!ROLES.has(evidenceRole)||!COPYRIGHT.has(copyrightStatus))return NextResponse.json({error:'附件分类无效。'},{status:400});
  if(!/^https?:\/\//i.test(fileUrl))return NextResponse.json({error:'请填写有效的 http/https 链接。'},{status:400});
  if(caption.length<3||caption.length>500)return NextResponse.json({error:'说明需为 3—500 字。'},{status:400});
  await withTransaction(async client=>{
   const a=await client.query(`SELECT id FROM cultural_assets WHERE id=$1 AND deleted_at IS NULL FOR UPDATE`,[b.assetId]);
   if(!a.rowCount)throw new Error('NOT_FOUND');
   const m=await client.query<{id:string}>(`INSERT INTO asset_media(asset_id,media_type,file_url,caption,is_primary,copyright_status,evidence_role,verification_status,source_note)
     VALUES($1,$2,$3,$4,false,$5,$6,'unverified',$7) RETURNING id`,
     [b.assetId,mediaType,fileUrl,caption,copyrightStatus,evidenceRole,sourceNote]);
   await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note,snapshot)
     VALUES($1,'evidence_added',$2,'Museum evidence link added',$3::jsonb)`,
     [b.assetId,user.id,JSON.stringify({mediaId:m.rows[0].id,mediaType,evidenceRole,fileUrl})]);
   await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
     VALUES($1,'museum.evidence_add','cultural_asset',$2,$3::jsonb)`,
     [user.id,b.assetId,JSON.stringify({mediaId:m.rows[0].id,evidenceRole,mediaType})]);
  });
  return NextResponse.json({ok:true});
 }catch(e){
  if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:'找不到馆藏记录。'},{status:404});
  console.error(e);return NextResponse.json({error:'暂时无法保存证据附件。'},{status:500});
 }
}
