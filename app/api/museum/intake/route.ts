import { NextRequest,NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getCurrentUser } from '@/lib/auth/session';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

export async function POST(req:NextRequest){
 const eo=(await getLocale())==='eo';
 const user=await getCurrentUser(); if(!user)return NextResponse.json({error:eo?'Bonvolu unue ensaluti.':'请先登录。'},{status:401});
 try{
  const b=await req.json(); const title=String(b.titleZh||'').trim();
  if(title.length<2||title.length>200)return NextResponse.json({error:eo?'Bonvolu enigi validan registran nomon por la kolektaĵo.':'请填写有效的藏品登记名称。'},{status:400});
  if(!b.hallId)return NextResponse.json({error:eo?'Bonvolu elekti ĉefan halon.':'请选择主馆籍。'},{status:400});
  const permanentCode=`FC-WFB-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${randomBytes(3).toString('hex').toUpperCase()}`;
  await withTransaction(async client=>{
    const hall=await client.query(`SELECT 1 FROM museum_halls WHERE id=$1`,[b.hallId]); if(!hall.rowCount)throw new Error('BAD_HALL');
    const r=await client.query<{id:string}>(`INSERT INTO cultural_assets(
      permanent_code,batch_code,title_zh,title_eo,title_en,primary_hall_id,category,material,period_description,dimensions,weight,provenance,
      ownership_status,authentication_level,valuation_status,digital_rights_status,public_status,workflow_status,
      submitted_for_review_at,submitted_for_review_by)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'ownership_pending','E','not_valued','pending','draft','review',NOW(),$13) RETURNING id`,
      [permanentCode,b.batchCode||null,title,b.titleEo||null,b.titleEn||null,b.hallId,b.category||null,b.material||null,b.periodDescription||null,b.dimensions||null,b.weight||null,b.provenance||null,user.id]);
    if(b.evidenceUrl){
      await client.query(`INSERT INTO asset_media(asset_id,media_type,file_url,caption,is_primary,copyright_status) VALUES($1,'document',$2,'登记时提交的原始证据链接',false,'unknown')`,[r.rows[0].id,String(b.evidenceUrl)]);
    }
    await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note,snapshot) VALUES($1,'created',$2,'WFB 0.1 intake',$3::jsonb)`,
      [r.rows[0].id,user.id,JSON.stringify({permanentCode,titleZh:title})]);
    await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note) VALUES($1,'submitted',$2,'Submitted for museum review')`,[r.rows[0].id,user.id]);
    await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value) VALUES($1,'museum.intake','cultural_asset',$2,$3::jsonb)`,
      [user.id,r.rows[0].id,JSON.stringify({permanentCode,titleZh:title})]);
  });
  return NextResponse.json({ok:true,permanentCode});
 }catch(e){
  if(e instanceof Error&&e.message==='BAD_HALL')return NextResponse.json({error:eo?'La elektita ĉefa halo estas nevalida.':'主馆籍无效。'},{status:400});
  console.error(e);return NextResponse.json({error:eo?'Provizore ne eblas krei la kolektan dosieron.':'暂时无法建立馆藏档案。'},{status:500});
 }
}
