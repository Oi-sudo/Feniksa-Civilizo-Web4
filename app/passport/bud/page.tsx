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
const statusZh:Record<string,string>={pending:'待审核',approved:'已通过',rejected:'已驳回'};
const statusEo:Record<string,string>={pending:'Atendas kontrolon',approved:'Aprobita',rejected:'Malakceptita'};
const statusEn:Record<string,string>={pending:'Pending review',approved:'Approved',rejected:'Rejected'};
const confirmationZh:Record<string,string>={pending:'待确认',confirmed:'已确认',rejected:'已驳回',not_required:'无需确认'};
const confirmationEo:Record<string,string>={pending:'Atendas konfirmon',confirmed:'Konfirmita',rejected:'Malakceptita',not_required:'Konfirmo ne bezonata'};
const confirmationEn:Record<string,string>={pending:'Pending confirmation',confirmed:'Confirmed',rejected:'Rejected',not_required:'Confirmation not required'};
const serviceEn:Record<string,string>={volunteer_service:'Volunteer service',community_support:'Community support',translation_service:'Public translation service',museum_service:'Museum service',teaching_support:'Teaching support',public_project:'Public project'};
const serviceEo:Record<string,string>={
  volunteer_service:'Volontula servo',
  community_support:'Komunuma subteno',
  translation_service:'Publika tradukservo',
  museum_service:'Muzea servo',
  teaching_support:'Instrua subteno',
  public_project:'Publika projekto'
};

export default async function BudPassportPage({searchParams}:{searchParams:Promise<{project?:string}>}){
  const [user,locale,params]=await Promise.all([getCurrentUser(),getLocale(),searchParams]);
  if(!user) redirect('/login');
  const eo=locale==='eo'; const en=locale==='en';
  const rows=await listBudRecords(user.id,params.project);
  const approved=rows.filter(x=>x.review_status==='approved');
  const total=approved.reduce((s,x)=>s+Number(x.bud_value||0),0);
  const hours=approved.reduce((s,x)=>s+Number(x.verified_hours??x.hours??0),0);

  return <main>
    <span className="badge">BUD · {eo?'Mia registro':en?'My records':'我的记录'}</span>
    <h1>{eo?'Miaj BUD-registroj':en?'My BUD records':'我的 BUD 佛光币记录'}</h1>
    {params.project&&<p className="muted">{eo?'Filtrita laŭ unu projekto.':en?'Filtered to one project.':'当前仅显示一个项目中的记录。'}</p>}
    <p className="lead">{eo?'Ĉi tie aperas kontroleblaj registroj pri vola agado, volontula servo kaj publika servo. BUD registras agojn; ĝi ne taksas personecon nek atestas religian atingon.':en?'This page shows verifiable records of vow-in-action, volunteer service and public service. BUD records actions; it does not assess personality or certify religious attainment.':'这里显示愿行、志愿服务和公共服务的可核查记录。BUD 记录行动，不评定人格，也不认证宗教修证境界。'}</p>
    <section className="stat-grid">
      <div className="stat-card"><strong>{total}</strong><span>{eo?'Konfirmita BUD':en?'Confirmed BUD':'已确认 BUD'}</span></div>
      <div className="stat-card"><strong>{hours}</strong><span>{eo?'Konfirmitaj servhoroj':en?'Confirmed service hours':'已确认服务小时'}</span></div>
      <div className="stat-card"><strong>{approved.length}</strong><span>{eo?'Aprobitaj registroj':en?'Approved records':'已审核记录'}</span></div>
    </section>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" id={`bud-record-${r.id}`} key={r.id}>
      <div className="record-top"><strong>{(eo?serviceEo:en?serviceEn:serviceZh)[r.service_type]||r.service_type}</strong><span>{(eo?statusEo:en?statusEn:statusZh)[r.review_status]||r.review_status}</span></div>
      <p>{r.description}</p>
      {r.project_title&&<p><small>{eo?'Projekto':en?'Project':'项目'}：{r.project_title}</small></p>}
      <p><strong>BUD {r.bud_value}</strong>{(r.verified_hours||r.hours)&&<> · {r.verified_hours||r.hours} {eo?'horoj':en?'hours':'小时'}</>}</p>
      <p><small>{r.rule_version} · {eo?'Projekta konfirmo':en?'Project confirmation':'项目确认'}：{(eo?confirmationEo:en?confirmationEn:confirmationZh)[r.project_confirmation_status]||r.project_confirmation_status}</small></p>
      <small>{new Date(r.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</small>
      {r.evidence_url&&<p><a href={r.evidence_url} target="_blank" rel="noreferrer">{eo?'Vidi pruvon →':en?'View evidence →':'查看证据 →'}</a></p>}
    </article>)}</div>:<section className="card"><h2>{eo?'Ankoraŭ neniu BUD-registro':en?'No BUD records yet':'还没有 BUD 记录'}</h2><p>{eo?'Post partopreno en registrita volontula servo aŭ publika projekto kaj fina aprobo, la registro aperos ĉi tie.':en?'After participating in registered volunteer service or a public project and receiving final approval, the record will appear here.':'参加经登记的志愿服务或公共项目并完成审核后，记录会出现在这里。'}</p></section>}
    <div className="hero-actions"><Link className="button button-primary" href="/projects">{eo?'Vidi publikajn projektojn':en?'View public projects':'查看公共项目'}</Link><Link className="button button-secondary" href="/passport">{eo?'Reveni al la lernopasporto':en?'Back to learning passport':'返回学习护照'}</Link></div>
    <p className="muted">{eo?'BUD ne estas aĉetebla aŭ vendebla, ne estas kvanta mezuro de merito kaj ne aŭtomate donas regrajton.':en?'BUD cannot be bought or sold, is not a quantitative measure of merit, and does not automatically grant governance rights.':'BUD 不可买卖，不等于功德定量，也不自动产生治理权。'}</p>
  </main>;
}
