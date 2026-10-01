import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';
import { listBudRecords } from '@/lib/contributions/data';

const serviceZh:Record<string,string>={
  volunteer_service:'志愿服务',
  community_support:'社区支持',
  translation_service:'公益翻译',
  museum_service:'博物馆服务',
  teaching_support:'教学支持',
  public_project:'公共项目'
};
const serviceEo:Record<string,string>={
  volunteer_service:'Volontula servo',
  community_support:'Komunuma subteno',
  translation_service:'Publika tradukservo',
  museum_service:'Muzea servo',
  teaching_support:'Instrua subteno',
  public_project:'Publika projekto'
};

export default async function BudPassportPage(){
  const [user,locale]=await Promise.all([getCurrentUser(),getLocale()]);
  if(!user) redirect('/login');
  const eo=locale==='eo';
  const rows=await listBudRecords(user.id);
  const approved=rows.filter(x=>x.review_status==='approved');
  const total=approved.reduce((s,x)=>s+Number(x.bud_value||0),0);
  const hours=approved.reduce((s,x)=>s+Number(x.verified_hours??x.hours??0),0);

  return <main>
    <span className="badge">BUD · {eo?'Mia registro':'我的记录'}</span>
    <h1>{eo?'Miaj BUD-registroj':'我的 BUD 佛光币记录'}</h1>
    <p className="lead">{eo?'Ĉi tie aperas kontroleblaj registroj pri vola agado, volontula servo kaj publika servo. BUD registras agojn; ĝi ne taksas personecon nek atestas religian atingon.':'这里显示愿行、志愿服务和公共服务的可核查记录。BUD 记录行动，不评定人格，也不认证宗教修证境界。'}</p>
    <section className="stat-grid">
      <div className="stat-card"><strong>{total}</strong><span>{eo?'Konfirmita BUD':'已确认 BUD'}</span></div>
      <div className="stat-card"><strong>{hours}</strong><span>{eo?'Konfirmitaj servhoroj':'已确认服务小时'}</span></div>
      <div className="stat-card"><strong>{approved.length}</strong><span>{eo?'Aprobitaj registroj':'已审核记录'}</span></div>
    </section>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <div className="record-top"><strong>{(eo?serviceEo:serviceZh)[r.service_type]||r.service_type}</strong><span>{r.review_status}</span></div>
      <p>{r.description}</p>
      {r.project_title&&<p><small>{eo?'Projekto':'项目'}：{r.project_title}</small></p>}
      <p><strong>BUD {r.bud_value}</strong>{(r.verified_hours||r.hours)&&<> · {r.verified_hours||r.hours} {eo?'horoj':'小时'}</>}</p>
      <p><small>{r.rule_version} · {eo?'Projekta konfirmo':'项目确认'}：{r.project_confirmation_status}</small></p>
      <small>{new Date(r.created_at).toLocaleDateString(eo?'eo':'zh-CN')}</small>
      {r.evidence_url&&<p><a href={r.evidence_url} target="_blank" rel="noreferrer">{eo?'Vidi pruvon →':'查看证据 →'}</a></p>}
    </article>)}</div>:<section className="card"><h2>{eo?'Ankoraŭ neniu BUD-registro':'还没有 BUD 记录'}</h2><p>{eo?'Post partopreno en registrita volontula servo aŭ publika projekto kaj fina aprobo, la registro aperos ĉi tie.':'参加经登记的志愿服务或公共项目并完成审核后，记录会出现在这里。'}</p></section>}
    <div className="hero-actions"><Link className="button button-primary" href="/projects">{eo?'Vidi publikajn projektojn':'查看公共项目'}</Link><Link className="button button-secondary" href="/passport">{eo?'Reveni al la lernopasporto':'返回学习护照'}</Link></div>
    <p className="muted">{eo?'BUD ne estas aĉetebla aŭ vendebla, ne estas kvanta mezuro de merito kaj ne aŭtomate donas regrajton.':'BUD 不可买卖，不等于功德定量，也不自动产生治理权。'}</p>
  </main>;
}
