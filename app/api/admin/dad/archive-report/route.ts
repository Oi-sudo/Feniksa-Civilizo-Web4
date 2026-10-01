import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { archiveGovernanceChangeReport } from '@/lib/dad/data';
import { query } from '@/lib/db';

export async function POST(req:NextRequest){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser();
  if(!user||!hasRole(user,'admin')) return NextResponse.json({error:eo?'Administranta permeso estas bezonata.':en?'Administrator permission is required.':'需要管理员权限。'},{status:403});
  try{
    const body=await req.json();
    if(!body.from||!body.to) return NextResponse.json({error:eo?'Du momentbildaj datoj estas bezonataj.':en?'Two snapshot dates are required.':'需要两个快照日期。'},{status:400});
    const report=await archiveGovernanceChangeReport(String(body.from),String(body.to),user.id);
    if(!report) return NextResponse.json({error:eo?'La raporto jam estas arkivita aŭ la datoj estas identaj.':en?'The report is already archived or the dates are identical.':'该报告已归档，或两个日期相同。'},{status:409});
    await query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
      VALUES($1,'dad.archive_report.create','governance_archive_report',$2,$3::jsonb)`,
      [user.id,report.id,JSON.stringify(report)]);
    return NextResponse.json({ok:true,report});
  }catch(e){
    console.error(e);
    return NextResponse.json({error:eo?'Ne eblas arkivi la raporton nun.':en?'The report cannot be archived right now.':'暂时无法归档该报告。'},{status:500});
  }
}
