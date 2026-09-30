import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listBudRecords } from '@/lib/contributions/data';

const service:Record<string,string>={
  volunteer_service:'志愿服务 · Volontula servo',
  community_support:'社区支持 · Komunuma subteno',
  translation_service:'公益翻译 · Publika tradukservo',
  museum_service:'博物馆服务 · Muzea servo',
  teaching_support:'教学支持 · Instrua subteno',
  public_project:'公共项目 · Publika projekto'
};

export default async function BudPassportPage(){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  const rows=await listBudRecords(user.id);
  const approved=rows.filter(x=>x.review_status==='approved');
  const total=approved.reduce((s,x)=>s+Number(x.bud_value||0),0);
  const hours=approved.reduce((s,x)=>s+Number(x.verified_hours??x.hours??0),0);

  return <main>
    <span className="badge">BUD · Mia Registro</span>
    <h1>我的 BUD 佛光币记录</h1>
    <p className="lead">这里显示愿行、志愿服务和公共服务的可核查记录。BUD 记录行动，不评定人格，也不认证宗教修证境界。</p>
    <section className="stat-grid">
      <div className="stat-card"><strong>{total}</strong><span>已确认 BUD</span></div>
      <div className="stat-card"><strong>{hours}</strong><span>已确认服务小时</span></div>
      <div className="stat-card"><strong>{approved.length}</strong><span>已审核记录</span></div>
    </section>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <div className="record-top"><strong>{service[r.service_type]||r.service_type}</strong><span>{r.review_status}</span></div>
      <p>{r.description}</p>
      {r.project_title&&<p><small>项目：{r.project_title}</small></p>}
      <p><strong>BUD {r.bud_value}</strong>{(r.verified_hours||r.hours)&&<> · {r.verified_hours||r.hours} 小时</>}</p>
      <p><small>{r.rule_version} · 项目确认：{r.project_confirmation_status}</small></p>
      <small>{new Date(r.created_at).toLocaleDateString('zh-CN')}</small>
      {r.evidence_url&&<p><a href={r.evidence_url} target="_blank" rel="noreferrer">查看证据 →</a></p>}
    </article>)}</div>:<section className="card"><h2>还没有 BUD 记录</h2><p>参加经登记的志愿服务或公共项目并完成审核后，记录会出现在这里。</p></section>}
    <div className="hero-actions"><Link className="button button-primary" href="/projects">查看公共项目</Link><Link className="button button-secondary" href="/passport">返回学习护照</Link></div>
    <p className="muted">BUD 不可买卖，不等于功德定量，也不自动产生治理权。</p>
  </main>;
}
