import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { listManagerBudConfirmations } from '@/lib/bud/data';
import BudActionButton from '@/components/bud/BudActionButton';

export default async function ProjectBudConfirmationsPage(){
  const user=await requireSignedIn();
  const rows=await listManagerBudConfirmations(user.id);
  return <main>
    <span className="badge">Projects · BUD</span><h1>项目服务确认</h1>
    <p className="lead">项目负责人只确认“服务事实是否发生”，不能决定 BUD 数值。自己的服务记录不能由自己确认。</p>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <h2>{r.user_name} · {r.project_title}</h2><p>{r.description}</p><p>{r.service_type} · {r.hours??'事件制'} 小时</p>
      {r.user_id===user.id?<p className="muted">这是您自己的记录，不能自行确认；需由管理员处理。</p>:<div className="hero-actions"><BudActionButton id={r.id} action="confirm" label="确认服务事实"/><BudActionButton id={r.id} action="reject" label="驳回"/></div>}
    </article>)}</div>:<section className="card"><p>目前没有等待您确认的项目服务记录。</p></section>}
    <Link href="/projects">返回项目执行</Link>
  </main>;
}
