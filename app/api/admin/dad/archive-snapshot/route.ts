import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { createGovernanceArchiveSnapshot } from '@/lib/dad/data';
import { query } from '@/lib/db';

export async function POST(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser();
  if(!user||!hasRole(user,'admin')) return NextResponse.json({error:eo?'Administranta permeso estas bezonata.':en?'Administrator permission is required.':'需要管理员权限。'},{status:403});
  try{
    const snapshot=await createGovernanceArchiveSnapshot();
    if(!snapshot) return NextResponse.json({ok:false,error:eo?'Hodiaŭa arkiva momentbildo jam ekzistas.':en?'Today’s archive snapshot already exists.':'今日归档快照已经存在。'},{status:409});
    await query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
      VALUES($1,'dad.archive_snapshot.create','governance_archive_snapshot',$2,$3::jsonb)`,
      [user.id,snapshot.id,JSON.stringify(snapshot)]);
    return NextResponse.json({ok:true,snapshot});
  }catch(e){
    console.error(e);
    return NextResponse.json({error:eo?'Ne eblas krei la arkivan momentbildon nun.':en?'The archive snapshot cannot be created right now.':'暂时无法生成归档快照。'},{status:500});
  }
}
