import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { query } from '@/lib/db';
import VolunteerTaskActions from '@/components/volunteer/VolunteerTaskActions';

type TaskRow={
  id:string; code:string; title_zh:string; title_eo:string|null; title_en:string|null;
  description_zh:string; description_eo:string|null; description_en:string|null;
  category:string; difficulty:string; max_claims:number; claimed_count:number;
  assignment_status:string|null;
};

export default async function VolunteerTasksPage(){
  const user=await requireSignedIn();
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const r=await query<TaskRow>(
    `SELECT t.id,t.code,t.title_zh,t.title_eo,t.title_en,t.description_zh,t.description_eo,t.description_en,
            t.category,t.difficulty,t.max_claims,
            COUNT(a2.user_id) FILTER (WHERE a2.status='claimed')::int AS claimed_count,
            a.status AS assignment_status
       FROM volunteer_tasks t
       LEFT JOIN volunteer_task_assignments a ON a.task_id=t.id AND a.user_id=$1
       LEFT JOIN volunteer_task_assignments a2 ON a2.task_id=t.id
      WHERE t.status='open'
      GROUP BY t.id,a.status
      ORDER BY t.created_at ASC`,
    [user.id]
  );
  const title=(x:TaskRow)=>eo?(x.title_eo||x.title_zh):en?(x.title_en||x.title_zh):x.title_zh;
  const desc=(x:TaskRow)=>eo?(x.description_eo||x.description_zh):en?(x.description_en||x.description_zh):x.description_zh;
  const label=(zh:string,eoText:string,enText:string)=>eo?eoText:en?enText:zh;

  return <main>
    <span className="badge">WEB4 0.2 · TASK CENTER</span>
    <h1>{label('志愿者任务中心','Volontula Taskocentro','Volunteer Task Center')}</h1>
    <p className="lead">{label(
      '从一个小任务开始。认领并不代表治理权或报酬承诺；完成后的成果记录可作为学习与服务经历的一部分。',
      'Komencu per unu malgranda tasko. Alpreno ne signifas regrajton aŭ promeson de pago; finita rezulto povas fariĝi parto de via lern- kaj servohistorio.',
      'Start with one small task. Claiming does not grant governance authority or promise payment; completed work can become part of your learning and service record.'
    )}</p>

    <div className="volunteer-task-list">
      {r.rows.map(task=><article className="volunteer-task-card" key={task.id}>
        <div className="volunteer-task-head">
          <div><h2>{title(task)}</h2><p>{desc(task)}</p></div>
          <span className="volunteer-task-code">{task.code}</span>
        </div>
        <div className="volunteer-task-meta">
          <span>{label('类别','Kategorio','Category')}: {task.category}</span>
          <span>{label('难度','Nivelo','Level')}: {task.difficulty}</span>
          <span>{label('认领','Alprenoj','Claims')}: {task.claimed_count}/{task.max_claims}</span>
        </div>
        <VolunteerTaskActions locale={locale} taskId={task.id} assignmentStatus={task.assignment_status}/>
      </article>)}
    </div>

    <div className="hero-actions">
      <Link className="button button-secondary" href="/join/volunteer">{label('返回志愿登记','Reiri al volontula registro','Back to volunteer profile')}</Link>
      <Link className="button button-secondary" href="/join">{label('返回加入我们','Reiri al Aliĝu','Back to Join')}</Link>
    </div>
  </main>;
}
