import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

const TYPES=new Set(['volunteer_service','community_support','translation_service','museum_service','teaching_support','public_project']);

export async function POST(req:NextRequest){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser(); if(!user)return NextResponse.json({error:eo?'Bonvolu unue ensaluti.':en?'Please log in first.':'请先登录。'},{status:401});
  try{
    const body=await req.json();
    if(!TYPES.has(String(body.serviceType)))return NextResponse.json({error:eo?'La servotipo estas nevalida.':en?'The service type is invalid.':'服务类型无效。'},{status:400});
    const description=String(body.description||'').trim();
    if(description.length<10||description.length>2000)return NextResponse.json({error:eo?'Bonvolu enigi servopriskribon de 10–2000 signoj.':en?'Please enter a service description of 10–2000 characters.':'请填写10—2000字的服务说明。'},{status:400});
    const isEvent=body.serviceType==='public_project';
    const hours=body.hours===''||body.hours==null?null:Number(body.hours);
    if(!isEvent && (!Number.isFinite(hours)||Number(hours)<=0))return NextResponse.json({error:eo?'Bonvolu enigi validan nombron da servhoroj.':en?'Please enter a valid number of service hours.':'请填写有效的服务小时。'},{status:400});
    if(hours!=null && (!Number.isFinite(hours)||Number(hours)<0||Number(hours)>1000))return NextResponse.json({error:eo?'La nombro da servhoroj estas nevalida.':en?'The number of service hours is invalid.':'服务小时无效。'},{status:400});
    const projectId=body.projectId?String(body.projectId):null;
    const evidenceUrl=body.evidenceUrl?String(body.evidenceUrl).trim():null;

    const id=await withTransaction(async client=>{
      if(projectId){
        const m=await client.query(`SELECT 1 FROM project_members WHERE project_id=$1 AND user_id=$2 AND status='active'`,[projectId,user.id]);
        if(!m.rowCount)throw new Error('NOT_MEMBER');
      }
      const r=await client.query<{id:string}>(
        `INSERT INTO bud_records(user_id,project_id,service_type,description,hours,evidence_url,bud_value,rule_version,review_status,project_confirmation_status)
         VALUES($1,$2,$3,$4,$5,$6,0,'BUD-0.1','pending',$7) RETURNING id`,
        [user.id,projectId,body.serviceType,description,hours,evidenceUrl,projectId?'pending':'not_required']);
      await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value) VALUES($1,'bud.submit','bud_record',$2,$3::jsonb)`,
        [user.id,r.rows[0].id,JSON.stringify({serviceType:body.serviceType,hours,projectId})]);
      return r.rows[0].id;
    });
    return NextResponse.json({ok:true,id,projectConfirmationRequired:Boolean(projectId)});
  }catch(e){
    if(e instanceof Error&&e.message==='NOT_MEMBER')return NextResponse.json({error:eo?'Vi ne estas aktiva membro de ĉi tiu projekto.':en?'You are not an active member of this project.':'您不是该项目的有效成员。'},{status:403});
    console.error(e); return NextResponse.json({error:eo?'Provizore ne eblas sendi la servoregistron.':en?'The service record cannot be submitted right now.':'暂时无法提交服务记录。'},{status:500});
  }
}
