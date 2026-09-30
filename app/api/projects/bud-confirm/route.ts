import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';

export async function POST(req:NextRequest){
  const user=await getCurrentUser(); if(!user)return NextResponse.json({error:'请先登录。'},{status:401});
  try{
    const body=await req.json(); const action=body.action;
    if(!['confirm','reject'].includes(action))return NextResponse.json({error:'操作无效。'},{status:400});
    const message=await withTransaction(async client=>{
      const r=await client.query<{user_id:string;manager_id:string|null;project_id:string}>(
        `SELECT b.user_id,p.manager_id,b.project_id FROM bud_records b JOIN projects p ON p.id=b.project_id
          WHERE b.id=$1 AND b.review_status='pending' AND b.project_confirmation_status='pending' FOR UPDATE`,[body.id]);
      if(!r.rowCount)throw new Error('NOT_FOUND');
      const row=r.rows[0];
      const admin=hasRole(user,'admin');
      if(row.manager_id!==user.id&&!admin)throw new Error('FORBIDDEN');
      if(row.user_id===user.id&&!admin)throw new Error('SELF_CONFIRM');
      const status=action==='confirm'?'confirmed':'rejected';
      await client.query(`UPDATE bud_records SET project_confirmation_status=$1,project_confirmed_by=$2,project_confirmed_at=NOW() WHERE id=$3`,
        [status,user.id,body.id]);
      await client.query(`INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value) VALUES($1,$2,'bud_record',$3,$4::jsonb)`,
        [user.id,`bud.project_${status}`,body.id,JSON.stringify({projectConfirmationStatus:status})]);
      return status==='confirmed'?'项目服务事实已确认，等待管理审核。':'该项目服务记录已驳回。';
    });
    return NextResponse.json({ok:true,message});
  }catch(e){
    if(e instanceof Error&&e.message==='SELF_CONFIRM')return NextResponse.json({error:'项目负责人不能确认自己的 BUD 服务记录。'},{status:403});
    if(e instanceof Error&&e.message==='FORBIDDEN')return NextResponse.json({error:'您没有确认该项目记录的权限。'},{status:403});
    if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:'找不到待确认记录。'},{status:404});
    console.error(e);return NextResponse.json({error:'暂时无法处理确认。'},{status:500});
  }
}
