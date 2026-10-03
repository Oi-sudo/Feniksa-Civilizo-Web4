import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';
import { ensureVolunteerTaskSchema } from '@/lib/volunteer/ensure';

export async function POST(req:NextRequest){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:eo?'Bonvolu unue ensaluti.':en?'Please log in first.':'请先登录。'},{status:401});
  try{
    await ensureVolunteerTaskSchema();
    const b=await req.json();
    const taskId=String(b.taskId||'');
    const action=String(b.action||'');
    if(!/^[0-9a-f-]{36}$/i.test(taskId))return NextResponse.json({error:'Bad task id'},{status:400});

    const result=await withTransaction(async client=>{
      const task=await client.query<{id:string;code:string;status:string;max_claims:number}>(
        `SELECT id,code,status,max_claims FROM volunteer_tasks WHERE id=$1 FOR UPDATE`,[taskId]);
      if(!task.rowCount)throw new Error('NOT_FOUND');
      const t=task.rows[0];

      if(action==='claim'){
        if(t.status!=='open')throw new Error('NOT_OPEN');
        const count=await client.query<{n:string}>(`SELECT COUNT(*)::text AS n FROM volunteer_task_assignments WHERE task_id=$1 AND status='claimed'`,[taskId]);
        if(Number(count.rows[0].n)>=t.max_claims)throw new Error('FULL');
        await client.query(
          `INSERT INTO volunteer_task_assignments(task_id,user_id,status)
           VALUES($1,$2,'claimed')
           ON CONFLICT(task_id,user_id) DO UPDATE SET status='claimed',claimed_at=NOW(),completed_at=NULL,updated_at=NOW()`,
          [taskId,user.id]
        );
        await client.query(
          `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
           VALUES($1,'volunteer.task.claim','volunteer_task',$2,$3::jsonb)`,
          [user.id,taskId,JSON.stringify({code:t.code})]
        );
        return {status:'claimed'};
      }

      if(action==='complete'){
        const note=String(b.resultNote||'').trim().slice(0,3000);
        const url=String(b.resultUrl||'').trim().slice(0,1000);
        const a=await client.query(
          `UPDATE volunteer_task_assignments
              SET status='completed',result_note=$3,result_url=$4,completed_at=NOW(),updated_at=NOW()
            WHERE task_id=$1 AND user_id=$2 AND status='claimed'
            RETURNING task_id`,
          [taskId,user.id,note||null,url||null]
        );
        if(!a.rowCount)throw new Error('NOT_CLAIMED');
        await client.query(
          `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
           VALUES($1,'volunteer.task.complete','volunteer_task',$2,$3::jsonb)`,
          [user.id,taskId,JSON.stringify({code:t.code,resultUrl:url||null,hasNote:Boolean(note)})]
        );
        return {status:'completed'};
      }
      throw new Error('BAD_ACTION');
    });
    return NextResponse.json({ok:true,...result});
  }catch(e){
    const code=e instanceof Error?e.message:'';
    const map:Record<string,string>={
      NOT_FOUND:eo?'Tasko ne trovita.':en?'Task not found.':'任务不存在。',
      NOT_OPEN:eo?'La tasko ne estas malfermita.':en?'This task is not open.':'该任务当前未开放。',
      FULL:eo?'La tasko jam havas sufiĉajn partoprenantojn.':en?'This task already has enough participants.':'该任务目前认领人数已满。',
      NOT_CLAIMED:eo?'Unue alprenu la taskon.':en?'Claim the task first.':'请先认领任务。',
      BAD_ACTION:eo?'Nevalida ago.':en?'Invalid action.':'操作无效。'
    };
    if(map[code])return NextResponse.json({error:map[code]},{status:400});
    console.error(e);
    return NextResponse.json({error:eo?'Provizore ne eblas ĝisdatigi la taskon.':en?'The task cannot be updated right now.':'暂时无法更新任务。'},{status:500});
  }
}
