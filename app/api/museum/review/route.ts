import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';

export async function POST(req:NextRequest){
 const user=await getCurrentUser(); if(!user||!hasAnyRole(user,['admin','curator','museum_reviewer']))return NextResponse.json({error:'需要馆藏资料管理权限。'},{status:403});
 try{
  const b=await req.json(); if(!['approve','changes'].includes(b.action))return NextResponse.json({error:'操作无效。'},{status:400});
  const message=await withTransaction(async client=>{
    const r=await client.query<{id:string}>(`SELECT id FROM cultural_assets WHERE id=$1 AND workflow_status='review' FOR UPDATE`,[b.id]);
    if(!r.rowCount)throw new Error('NOT_FOUND');
    if(b.action==='approve'){
      await client.query(`UPDATE cultural_assets SET workflow_status='published',public_status='published',reviewed_at=NOW(),reviewed_by=$1,published_at=NOW(),published_by=$1,review_note='Alpha collection archive publication' WHERE id=$2`,[user.id,b.id]);
      await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note) VALUES($1,'approved',$2,'Collection archive ready for public display')`,[b.id,user.id]);
      await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note) VALUES($1,'published',$2,'Published in WFB collection archive')`,[b.id,user.id]);
      await client.query(`INSERT INTO asset_versions(asset_id,version_number,changed_by,change_summary,snapshot)
        SELECT id,'0.1',$1,'Initial WFB collection archive snapshot',jsonb_build_object(
          'permanent_code',permanent_code,'title_zh',title_zh,'title_eo',title_eo,'authentication_level',authentication_level,
          'ownership_status',ownership_status,'valuation_status',valuation_status,'digital_rights_status',digital_rights_status,'public_status','published')
        FROM cultural_assets WHERE id=$2 ON CONFLICT(asset_id,version_number) DO NOTHING`,[user.id,b.id]);
      return '资料已整理并进入公开数字博物馆。';
    } else {
      await client.query(`UPDATE cultural_assets SET workflow_status='changes_requested',reviewed_at=NOW(),reviewed_by=$1,review_note='Changes requested' WHERE id=$2`,[user.id,b.id]);
      await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note) VALUES($1,'changes_requested',$2,'Changes requested')`,[b.id,user.id]);
      return '已返回继续整理。';
    }
  });
  await withTransaction(async client=>{await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value) VALUES($1,$2,'cultural_asset',$3,$4::jsonb)`,
    [user.id,`museum.${b.action}`,b.id,JSON.stringify({action:b.action})]);});
  return NextResponse.json({ok:true,message});
 }catch(e){
  if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:'找不到待整理馆藏。'},{status:404});
  console.error(e);return NextResponse.json({error:'暂时无法完成馆藏资料整理。'},{status:500});
 }
}
