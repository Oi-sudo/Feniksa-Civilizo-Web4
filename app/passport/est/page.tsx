import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listEstRecords } from '@/lib/contributions/data';

const activity:Record<string,string>={
  course_completion:'课程完成 · Kursfino',
  translation:'翻译 · Tradukado',
  proofreading:'校对 · Provlegado',
  teaching:'教学 · Instruado',
  knowledge_contribution:'知识贡献 · Scia kontribuo'
};

export default async function EstPassportPage(){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  const rows=await listEstRecords(user.id);
  const approved=rows.filter(x=>x.review_status==='approved');
  const total=approved.reduce((s,x)=>s+Number(x.est_value||0),0);

  return <main>
    <span className="badge">EST · Mia Registro</span>
    <h1>我的 EST 世界语币记录</h1>
    <p className="lead">这里显示您的世界语学习、翻译、教学、校对和知识贡献记录。只有审核通过的记录计入上方总值。</p>
    <section className="stat-grid">
      <div className="stat-card"><strong>{total}</strong><span>已确认 EST</span></div>
      <div className="stat-card"><strong>{approved.length}</strong><span>已审核记录</span></div>
      <div className="stat-card"><strong>{rows.length}</strong><span>全部记录</span></div>
    </section>
    {rows.length? <div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <div className="record-top"><strong>{activity[r.activity_type]||r.activity_type}</strong><span>{r.review_status}</span></div>
      <p>{r.description}</p>
      {r.course_title&&<p><small>课程：{r.course_title}</small></p>}
      {r.project_title&&<p><small>项目：{r.project_title}</small></p>}
      <p><strong>EST {r.est_value}</strong> · {r.rule_version}</p>
      <small>{new Date(r.created_at).toLocaleDateString('zh-CN')}</small>
      {r.evidence_url&&<p><a href={r.evidence_url} target="_blank" rel="noreferrer">查看证据 →</a></p>}
    </article>)}</div>:<section className="card"><h2>还没有 EST 记录</h2><p>完成课程或产生经审核的世界语贡献后，记录会出现在这里。</p></section>}
    <div className="hero-actions"><Link className="button button-primary" href="/courses">进入课程</Link><Link className="button button-secondary" href="/passport">返回学习护照</Link></div>
    <p className="muted">EST 是非交易学习与知识贡献记录，不代表投资价值或治理权。</p>
  </main>;
}
