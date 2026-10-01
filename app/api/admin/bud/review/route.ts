import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';

export async function POST(req:NextRequest){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser(); if(!user||!hasRole(user,'admin'))return NextResponse.json({error:eo?'Administranta permeso estas bezonata.':en?'Administrator permission is required.':'需要管理员权限。'},{status:403});
  try{
    const body=await req.json();
    if(body.action!=='approve')return NextResponse.json({error:eo?'La ago estas nevalida.':en?'The action is invalid.':'操作无效。'},{status:400});
    const result=await withTransaction(async client=>{
      const r=await client.query<{service_type:string;hours:string|null;project_confirmation_status:string}>(
        `SELECT service_type,hours::text,project_confirmation_status FROM bud_records
          WHERE id=$1 AND review_status='pending' AND revoked_at IS NULL FOR UPDATE`,[body.id]);
      if(!r.rowCount)throw new Error('NOT_FOUND');
      const rec=r.rows[0];
      if(!['confirmed','not_required'].includes(rec.project_confirmation_status))throw new Error('PROJECT_PENDING');

      const rule=await client.query<{unit_type:string;value_per_unit:string;rule_version:string}>(
        `SELECT unit_type,value_per_unit::text,rule_version FROM bud_rules
          WHERE service_type=$1 AND effective_from<=NOW() AND (effective_to IS NULL OR effective_to>NOW())
          ORDER BY effective_from DESC LIMIT 1`,[rec.service_type]);
      if(!rule.rowCount)throw new Error('NO_RULE');

      let verifiedHours:number|null=null; let units=1;
      if(rule.rows[0].unit_type==='hour'){
        verifiedHours=body.verifiedHours==null?Number(rec.hours):Number(body.verifiedHours);
        if(!Number.isFinite(verifiedHours)||verifiedHours<=0||verifiedHours>1000)throw new Error('BAD_HOURS');
        units=verifiedHours;
      }
      const budValue=Number(rule.rows[0].value_per_unit)*units;
      await client.query(
        `UPDATE bud_records SET verified_hours=$1,bud_value=$2,rule_version=$3,review_status='approved',reviewer_id=$4,reviewed_at=NOW()
          WHERE id=$5`,[verifiedHours,budValue,rule.rows[0].rule_version,user.id,body.id]);
      await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value) VALUES($1,'bud.approve','bud_record',$2,$3::jsonb)`,
        [user.id,body.id,JSON.stringify({budValue,verifiedHours,ruleVersion:rule.rows[0].rule_version})]);
      return {budValue,verifiedHours};
    });
    return NextResponse.json({ok:true,message:eo?`Revizio finita: BUD +${result.budValue}`:en?`Review completed: BUD +${result.budValue}`:`审核完成：BUD +${result.budValue}`,...result});
  }catch(e){
    const map:Record<string,[string,number]>={
      NOT_FOUND:[eo?'La atendanta revizia registro ne estis trovita.':en?'The record awaiting review was not found.':'找不到待审核记录。',404],PROJECT_PENDING:[eo?'La projekta servo ankoraŭ ne estas konfirmita.':en?'The project service has not yet been confirmed.':'项目服务尚未确认。',409],
      NO_RULE:[eo?'Nuntempe ne ekzistas aplikebla BUD-regulo.':en?'There is currently no applicable BUD rule.':'当前没有适用的 BUD 规则。',409],BAD_HOURS:[eo?'La konfirmitaj servhoroj estas nevalidaj.':en?'The verified service hours are invalid.':'确认服务小时无效。',400]
    };
    if(e instanceof Error&&map[e.message]){const [error,status]=map[e.message];return NextResponse.json({error},{status});}
    console.error(e);return NextResponse.json({error:eo?'Provizore ne eblas revizii BUD.':en?'BUD cannot be reviewed right now.':'暂时无法审核 BUD。'},{status:500});
  }
}
