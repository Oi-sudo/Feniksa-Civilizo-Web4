import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasAnyRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

export async function POST(req:NextRequest){
 const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
 const user=await getCurrentUser();
 if(!user||!hasAnyRole(user,['admin','curator','museum_reviewer']))return NextResponse.json({error:eo?'Muzea administra permeso estas bezonata.':en?'Museum administration permission is required.':'需要馆藏管理权限。'},{status:403});
 try{
  const b=await req.json(); const nextStatus=String(b.nextStatus||'');
  if(!['source_confirmed','reviewed'].includes(nextStatus))return NextResponse.json({error:eo?'La cela stato estas nevalida.':en?'The target status is invalid.':'目标状态无效。'},{status:400});
  if(nextStatus==='reviewed'&&!hasAnyRole(user,['admin','museum_reviewer']))return NextResponse.json({error:eo?'Formala revizio bezonas permeson de muzea kontrolanto aŭ administranto.':en?'Formal review requires museum reviewer or administrator permission.':'正式审阅需要馆藏审核员或管理员权限。'},{status:403});
  await withTransaction(async client=>{
   const r=await client.query<{asset_id:string;verification_status:string}>(`SELECT asset_id,verification_status FROM asset_media WHERE id=$1 FOR UPDATE`,[b.mediaId]);
   if(!r.rowCount)throw new Error('NOT_FOUND');
   const current=r.rows[0].verification_status;
   if(nextStatus==='source_confirmed'&&current!=='unverified')throw new Error('BAD_TRANSITION');
   if(nextStatus==='reviewed'&&current!=='source_confirmed')throw new Error('BAD_TRANSITION');
   if(nextStatus==='source_confirmed'){
    await client.query(`UPDATE asset_media SET verification_status='source_confirmed',source_confirmed_at=NOW(),source_confirmed_by=$2 WHERE id=$1`,[b.mediaId,user.id]);
   }else{
    await client.query(`UPDATE asset_media SET verification_status='reviewed',reviewed_at=NOW(),reviewed_by=$2 WHERE id=$1`,[b.mediaId,user.id]);
   }
   await client.query(`INSERT INTO asset_media_review_events(media_id,asset_id,from_status,to_status,actor_id,note)
     VALUES($1,$2,$3,$4,$5,$6)`,[b.mediaId,r.rows[0].asset_id,current,nextStatus,user.id,nextStatus==='source_confirmed'?'Evidence source confirmed':'Evidence archivally reviewed']);
   await client.query(`INSERT INTO asset_review_events(asset_id,event_type,actor_id,note,snapshot)
     VALUES($1,$2,$3,$4,$5::jsonb)`,[
       r.rows[0].asset_id,nextStatus==='source_confirmed'?'evidence_source_confirmed':'evidence_reviewed',user.id,
       nextStatus==='source_confirmed'?'Evidence source confirmed':'Evidence archivally reviewed',
       JSON.stringify({mediaId:b.mediaId,fromStatus:current,toStatus:nextStatus})
     ]);
   await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
     VALUES($1,$2,'asset_media',$3,$4::jsonb)`,[
       user.id,nextStatus==='source_confirmed'?'museum.evidence_source_confirm':'museum.evidence_review',b.mediaId,
       JSON.stringify({fromStatus:current,toStatus:nextStatus})
     ]);
  });
  return NextResponse.json({ok:true});
 }catch(e){
  if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:eo?'La kolekta materialo ne estis trovita.':en?'The collection material was not found.':'找不到证据附件。'},{status:404});
  if(e instanceof Error&&e.message==='BAD_TRANSITION')return NextResponse.json({error:eo?'La paŝoj devas sekvi la ordon: por ordigo → fonto ordigita → materialo ordigita.':en?'The steps must follow this order: to organize → source organized → material organized.':'必须按“未核 → 来源已确认 → 已审阅”的次序操作。'},{status:409});
  console.error(e);return NextResponse.json({error:eo?'Provizore ne eblas ĝisdatigi la staton de la kolekta materialo.':en?'The collection material status cannot be updated right now.':'暂时无法更新证据状态。'},{status:500});
 }
}
