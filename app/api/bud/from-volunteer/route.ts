import { NextRequest,NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { withTransaction } from '@/lib/db';
import { getLocale } from '@/lib/i18n';
import { ensureVolunteerBudLinkSchema } from '@/lib/bud/ensure';

const SERVICE_MAP:Record<string,string>={
  esperanto_teaching:'teaching_support',
  translation:'translation_service',
  proofreading:'translation_service',
  buddhist_controlled_language:'translation_service',
  museum_documentation:'museum_service',
  media_subtitles:'volunteer_service',
  website_testing:'volunteer_service',
  '3d_design':'volunteer_service',
  dad_archiving:'volunteer_service',
  elder_learning_support:'community_support'
};

export async function POST(req:NextRequest){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const user=await getCurrentUser();
  if(!user)return NextResponse.json({error:eo?'Bonvolu unue ensaluti.':en?'Please log in first.':'请先登录。'},{status:401});
  try{
    await ensureVolunteerBudLinkSchema();
    const body=await req.json();
    const taskId=String(body.taskId||'');
    const hours=Number(body.hours);
    if(!/^[0-9a-f-]{36}$/i.test(taskId))return NextResponse.json({error:eo?'Nevalida tasko.':en?'Invalid task.':'任务无效。'},{status:400});
    if(!Number.isFinite(hours)||hours<=0||hours>1000)return NextResponse.json({error:eo?'Bonvolu enigi validajn servhorojn.':en?'Please enter valid service hours.':'请填写有效的服务小时。'},{status:400});

    const result=await withTransaction(async client=>{
      const r=await client.query<{code:string;title_zh:string;category:string;result_url:string|null;result_note:string|null}>(
        `SELECT t.code,t.title_zh,t.category,a.result_url,a.result_note
           FROM volunteer_task_assignments a
           JOIN volunteer_tasks t ON t.id=a.task_id
          WHERE a.task_id=$1 AND a.user_id=$2
            AND a.status='completed' AND a.review_status='approved'
          FOR UPDATE`,
        [taskId,user.id]
      );
      if(!r.rowCount)throw new Error('NOT_CONFIRMED');
      const task=r.rows[0];
      const serviceType=SERVICE_MAP[task.category]||'volunteer_service';

      const existing=await client.query(
        `SELECT id,review_status::text FROM bud_records
          WHERE user_id=$1 AND source_volunteer_task_id=$2 AND revoked_at IS NULL
          LIMIT 1`,[user.id,taskId]
      );
      if(existing.rowCount)throw new Error('ALREADY_EXISTS');

      const description=`Confirmed volunteer task ${task.code}: ${task.title_zh}${task.result_note?' · '+task.result_note:''}`.slice(0,2000);
      const b=await client.query<{id:string}>(
        `INSERT INTO bud_records(
            user_id,project_id,service_type,description,hours,evidence_url,
            bud_value,rule_version,review_status,project_confirmation_status,source_volunteer_task_id
          )
          VALUES($1,NULL,$2,$3,$4,$5,0,'BUD-0.1','pending','not_required',$6)
          RETURNING id`,
        [user.id,serviceType,description,hours,task.result_url,taskId]
      );
      await client.query(
        `INSERT INTO audit_logs(user_id,action,entity_type,entity_id,new_value)
         VALUES($1,'volunteer.bud.request','bud_record',$2,$3::jsonb)`,
        [user.id,b.rows[0].id,JSON.stringify({taskId,code:task.code,serviceType,hours})]
      );
      return {id:b.rows[0].id,serviceType};
    });

    return NextResponse.json({ok:true,...result,message:eo?'BUD-servoregistra peto estas kreita kaj atendas administran kontrolon.':en?'A BUD service-record request has been created and is awaiting administrator review.':'BUD 服务记录申请已建立，等待管理员审核。'});
  }catch(e){
    const code=e instanceof Error?e.message:'';
    if(code==='NOT_CONFIRMED')return NextResponse.json({error:eo?'Nur administrante konfirmita volontula tasko povas krei BUD-peton.':en?'Only an administrator-confirmed volunteer task can create a BUD request.':'只有管理员已确认的志愿任务才能申请 BUD 服务记录。'},{status:409});
    if(code==='ALREADY_EXISTS')return NextResponse.json({error:eo?'Por ĉi tiu tasko jam ekzistas aktiva BUD-peto.':en?'An active BUD request already exists for this task.':'这个任务已经存在一条有效的 BUD 申请，不能重复申请。'},{status:409});
    console.error(e);
    return NextResponse.json({error:eo?'Provizore ne eblas krei la BUD-peton.':en?'The BUD request cannot be created right now.':'暂时无法建立 BUD 申请。'},{status:500});
  }
}
