import Link from 'next/link';
import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { query } from '@/lib/db';
import { ensureVolunteerTaskSchema } from '@/lib/volunteer/ensure';
import VolunteerReviewAction from '@/components/volunteer/VolunteerReviewAction';

type Row={task_id:string;code:string;title_zh:string;title_eo:string|null;title_en:string|null;category:string;result_url:string|null;result_note:string|null;completed_at:string;user_name:string};

export default async function AdminVolunteerPage(){
  await requireRole('admin'); await ensureVolunteerTaskSchema();
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const r=await query<Row>(`
    SELECT a.task_id,t.code,t.title_zh,t.title_eo,t.title_en,t.category,a.result_url,a.result_note,
           a.completed_at::text,u.display_name AS user_name
      FROM volunteer_task_assignments a
      JOIN volunteer_tasks t ON t.id=a.task_id
      JOIN users u ON u.id=a.user_id
     WHERE a.status='completed' AND a.review_status='pending'
     ORDER BY a.completed_at ASC
  `);
  const title=(x:Row)=>eo?(x.title_eo||x.title_zh):en?(x.title_en||x.title_zh):x.title_zh;
  return <main>
    <span className="badge">Admin · Volunteer</span>
    <h1>{eo?'Kontrolo de volontulaj rezultoj':en?'Volunteer result review':'志愿任务成果审核'}</h1>
    <p className="lead">{eo?'Partoprenanto unue sendas rezulton; administranto poste konfirmas aŭ resendas ĝin. Nur konfirmita servo eniras la formalan pasportan tempolinion.':en?'Participants submit results first; an administrator then confirms or returns them. Only confirmed service enters the formal passport timeline.':'志愿者先提交成果，管理员再确认或退回。只有确认后的服务才进入正式学习护照时间线。'}</p>
    {r.rows.length?<div className="record-list">{r.rows.map(x=><article className="card" key={x.task_id}>
      <div className="record-top"><strong>{title(x)}</strong><span>{x.code}</span></div>
      <p>{eo?'Partoprenanto':en?'Participant':'参与者'}：{x.user_name}</p>
      <p>{eo?'Kategorio':en?'Category':'类别'}：{x.category}</p>
      <p>{eo?'Sendita je':en?'Submitted at':'提交时间'}：{new Date(x.completed_at).toLocaleString(eo?'eo':en?'en-US':'zh-CN')}</p>
      {x.result_note&&<p>{eo?'Rezulta noto':en?'Result note':'成果说明'}：{x.result_note}</p>}
      {x.result_url&&<p><a href={x.result_url} target="_blank" rel="noreferrer">{eo?'Malfermi rezulton →':en?'Open result →':'打开成果链接 →'}</a></p>}
      <div className="hero-actions">
        <VolunteerReviewAction id={x.task_id} action="approve" label={eo?'Konfirmi':en?'Confirm':'确认通过'} eo={eo} en={en}/>
        <VolunteerReviewAction id={x.task_id} action="reject" label={eo?'Resendi':en?'Return':'退回修改'} eo={eo} en={en}/>
      </div>
    </article>)}</div>:<section className="card"><p>{eo?'Nun ne estas rezultoj por kontrolo.':en?'There are no volunteer results awaiting review.':'目前没有待审核的志愿成果。'}</p></section>}
    <Link href="/admin">{eo?'Reveni al administra panelo':en?'Back to admin dashboard':'返回管理员 Dashboard'}</Link>
  </main>;
}
