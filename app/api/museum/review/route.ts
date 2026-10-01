import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

export async function POST(req:NextRequest){
 const eo=(await getLocale())==='eo';
 const user=await getCurrentUser(); if(!user||!hasAnyRole(user,['admin','curator','museum_reviewer']))return NextResponse.json({error:eo?'Permeso por administri muzeajn materialojn estas bezonata.':'需要馆藏资料管理权限。'},{status:403});
 try{
  const b=await req.json(); if(!['approve','changes'].includes(b.action))return NextResponse.json({error:eo?'La ago estas nevalida.':'操作无效。'},{status:400});
  const message=await withTransaction(async client=>{
    const r=await client.query<{id:string;submitted_for_review_by:string|null}>(`SELECT id,submitted_for_review_by::text FROM cultural_assets WHERE id=$1 AND workflow_status='review' FOR UPDATE`,[b.id]);
    if(!r.rowCount)throw new Error('NOT_FOUND');
    if(b.action==='approve'){
      if(!hasAnyRole(user,['admin','museum_reviewer']))throw new Error('PUBLISH_PERMISSION');
      if(r.rows[0].submitted_for_review_by===user.id)throw new Error('SELF_PUBLISH');
      await client.query(`UPDATE cultural_assets SET workflow_status='published',public_status='published',reviewed_at=NOW(),reviewed_by=$1,published_at=NOW(),published_by=$1,review_note='Alpha collection archive publication' WHERE id=$2`,[user.id,b.id]);
      await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note) VALUES($1,'approved',$2,'Collection archive ready for public display')`,[b.id,user.id]);
      await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note) VALUES($1,'published',$2,'Published in WFB collection archive')`,[b.id,user.id]);
      await client.query(`INSERT INTO asset_versions(asset_id,version_number,changed_by,change_summary,snapshot)
        SELECT id,'0.1',$1,'Initial WFB collection archive snapshot',jsonb_build_object(
          'permanent_code',permanent_code,'title_zh',title_zh,'title_eo',title_eo,'authentication_level',authentication_level,
          'ownership_status',ownership_status,'valuation_status',valuation_status,'digital_rights_status',digital_rights_status,'public_status','published')
        FROM cultural_assets WHERE id=$2 ON CONFLICT(asset_id,version_number) DO NOTHING`,[user.id,b.id]);
      return eo?'La dosiero estas ordigita kaj publikigita en la Cifereca Muzeo.':'资料已整理并进入公开数字博物馆。';
    } else {
      await client.query(`UPDATE cultural_assets SET workflow_status='changes_requested',reviewed_at=NOW(),reviewed_by=$1,review_note='Changes requested' WHERE id=$2`,[user.id,b.id]);
      await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note) VALUES($1,'changes_requested',$2,'Changes requested')`,[b.id,user.id]);
      return eo?'La dosiero estas resendita por plua ordigo.':'已返回继续整理。';
    }
  });
  await withTransaction(async client=>{await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value) VALUES($1,$2,'cultural_asset',$3,$4::jsonb)`,
    [user.id,`museum.${b.action}`,b.id,JSON.stringify({action:b.action})]);});
  return NextResponse.json({ok:true,message});
 }catch(e){
  if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:eo?'La kolektaĵo atendanta ordigon ne estis trovita.':'找不到待整理馆藏。'},{status:404});
  if(e instanceof Error&&e.message==='PUBLISH_PERMISSION')return NextResponse.json({error:eo?'Publika montrado bezonas permeson de administranto aŭ muzea kontrolanto.':'公开展示需要管理员或馆藏审核员权限。'},{status:403});
  if(e instanceof Error&&e.message==='SELF_PUBLISH')return NextResponse.json({error:eo?'La sendinto ne povas mem konfirmi publikan montradon; alia administranto aŭ muzea kontrolanto devas ĝin trakti.':'提交者不能自行完成公开展示确认，请由另一位管理员或馆藏审核员处理。'},{status:409});
  console.error(e);return NextResponse.json({error:eo?'Provizore ne eblas kompletigi la ordigon de la kolekta dosiero.':'暂时无法完成馆藏资料整理。'},{status:500});
 }
}
