import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';
import { listEstRecords } from '@/lib/contributions/data';

const activityZh:Record<string,string>={
  course_completion:'课程完成',
  translation:'翻译',
  proofreading:'校对',
  teaching:'教学',
  knowledge_contribution:'知识贡献'
};
const activityEo:Record<string,string>={
  course_completion:'Kursfino',
  translation:'Tradukado',
  proofreading:'Provlegado',
  teaching:'Instruado',
  knowledge_contribution:'Scia kontribuo'
};

export default async function EstPassportPage(){
  const [user,locale]=await Promise.all([getCurrentUser(),getLocale()]);
  if(!user) redirect('/login');
  const eo=locale==='eo';
  const rows=await listEstRecords(user.id);
  const approved=rows.filter(x=>x.review_status==='approved');
  const total=approved.reduce((s,x)=>s+Number(x.est_value||0),0);

  return <main>
    <span className="badge">EST · {eo?'Mia registro':'我的记录'}</span>
    <h1>{eo?'Miaj EST-registroj':'我的 EST 世界语币记录'}</h1>
    <p className="lead">{eo?'Ĉi tie aperas viaj registroj pri Esperanto-lernado, tradukado, instruado, provlegado kaj sciaj kontribuoj. Nur aprobitaj registroj estas inkluzivitaj en la supra sumo.':'这里显示您的世界语学习、翻译、教学、校对和知识贡献记录。只有审核通过的记录计入上方总值。'}</p>
    <section className="stat-grid">
      <div className="stat-card"><strong>{total}</strong><span>{eo?'Konfirmita EST':'已确认 EST'}</span></div>
      <div className="stat-card"><strong>{approved.length}</strong><span>{eo?'Aprobitaj registroj':'已审核记录'}</span></div>
      <div className="stat-card"><strong>{rows.length}</strong><span>{eo?'Ĉiuj registroj':'全部记录'}</span></div>
    </section>
    {rows.length? <div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <div className="record-top"><strong>{(eo?activityEo:activityZh)[r.activity_type]||r.activity_type}</strong><span>{r.review_status}</span></div>
      <p>{r.description}</p>
      {r.course_title&&<p><small>{eo?'Kurso':'课程'}：{r.course_title}</small></p>}
      {r.project_title&&<p><small>{eo?'Projekto':'项目'}：{r.project_title}</small></p>}
      <p><strong>EST {r.est_value}</strong> · {r.rule_version}</p>
      <small>{new Date(r.created_at).toLocaleDateString(eo?'eo':'zh-CN')}</small>
      {r.evidence_url&&<p><a href={r.evidence_url} target="_blank" rel="noreferrer">{eo?'Vidi pruvon →':'查看证据 →'}</a></p>}
    </article>)}</div>:<section className="card"><h2>{eo?'Ankoraŭ neniu EST-registro':'还没有 EST 记录'}</h2><p>{eo?'Post kurskompletigo aŭ aprobita Esperanto-kontribuo, la registro aperos ĉi tie.':'完成课程或产生经审核的世界语贡献后，记录会出现在这里。'}</p></section>}
    <div className="hero-actions"><Link className="button button-primary" href="/courses">{eo?'Eniri la kursojn':'进入课程'}</Link><Link className="button button-secondary" href="/passport">{eo?'Reveni al la lernopasporto':'返回学习护照'}</Link></div>
    <p className="muted">{eo?'EST estas netradablebla registro pri lernado kaj sciaj kontribuoj; ĝi ne reprezentas investvaloron nek regrajton.':'EST 是非交易学习与知识贡献记录，不代表投资价值或治理权。'}</p>
  </main>;
}
