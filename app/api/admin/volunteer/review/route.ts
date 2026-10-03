import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { hasRole } from '@/lib/permissions/rbac';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';
import { ensureVolunteerTaskSchema } from '@/lib/volunteer/ensure';

export async function POST(req:NextRequest){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser();
  if(!user||!hasRole(user,'admin'))return NextResponse.json({error:eo?'Administranta permeso estas bezonata.':en?'Administrator permission is required.':'需要管理员权限。'},{status:403});
  try{
    await ensureVolunteerTaskSchema();
    const body=await req.json();
    const id=String(body.id||'');
    const action=String(body.action||'');
    const note=String(body.note||'').trim().slice(0,2000);
    if(!/^[0-9a-f-]{36}$/i.test(id)||!['approve','reject'].includes(action))return NextResponse.json({error:eo?'Nevalida peto.':en?'Invalid request.':'请求无效。'},{status:400});

    const result=await withTransaction(async client=>{
      const r=await client.query<{task_id:string;user_id:string;code:string}>(
        `SELECT a.task_id,a.user_id,t.code
           FROM volunteer_task_assignments a
           JOIN volunteer_tasks t ON t.id=a.task_id
          WHERE a.task_id=$1 AND a.status='completed' AND a.review_status='pending'
          FOR UPDATE`,[id]);
      if(!r.rowCount)throw new Error('NOT_FOUND');
      const row=r.rows[0];

      if(action==='approve'){
        await client.query(
          `UPDATE volunteer_task_assignments
              SET review_status='approved',reviewed_by=$2,reviewed_at=NOW(),review_note=$3,updated_at=NOW()
            WHERE task_id=$1 AND user_id=$4`,
          [id,user.id,note||null,row.user_id]
        );
        await client.query(
          `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
           VALUES($1,'volunteer.task.review.approve','volunteer_task',$2,$3::jsonb)`,
          [user.id,id,JSON.stringify({code:row.code,participantId:row.user_id,note:note||null})]
        );
        return 'approved';
      }

      await client.query(
        `UPDATE volunteer_task_assignments
            SET status='claimed',review_status='rejected',reviewed_by=$2,reviewed_at=NOW(),review_note=$3,updated_at=NOW()
          WHERE task_id=$1 AND user_id=$4`,
        [id,user.id,note||null,row.user_id]
      );
      await client.query(
        `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
         VALUES($1,'volunteer.task.review.reject','volunteer_task',$2,$3::jsonb)`,
        [user.id,id,JSON.stringify({code:row.code,participantId:row.user_id,note:note||null})]
      );
      return 'rejected';
    });

    return NextResponse.json({ok:true,status:result,message:result==='approved'
      ?(eo?'La volontula rezulto estas konfirmita.':en?'Volunteer result confirmed.':'志愿成果已确认。')
      :(eo?'La rezulto estas resendita por korekto.':en?'The result has been returned for correction.':'成果已退回修改。')});
  }catch(e){
    if(e instanceof Error&&e.message==='NOT_FOUND')return NextResponse.json({error:eo?'Atendanta rezulto ne trovita.':en?'Pending result not found.':'找不到待审核成果。'},{status:404});
    console.error(e);return NextResponse.json({error:eo?'Provizore ne eblas kontroli la rezulton.':en?'The result cannot be reviewed right now.':'暂时无法审核成果。'},{status:500});
  }
}
