import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getPublicProposal } from '@/lib/dad/data';
import PassportPrintButton from '@/components/passport/PassportPrintButton';

const statusZh:Record<string,string>={approved:'已批准',rejected:'已否决',executing:'执行中',completed:'已完成',terminated:'已终止',archived:'已归档'};
const statusEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',executing:'Plenumata',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita'};
const statusEn:Record<string,string>={approved:'Approved',rejected:'Rejected',executing:'Executing',completed:'Completed',terminated:'Terminated',archived:'Archived'};
const outcomeZh:Record<string,string>={approved:'通过',rejected:'否决',revision:'退回修订',no_quorum:'未达到法定参与门槛'};
const outcomeEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',revision:'Reiru al revizio',no_quorum:'Neniu kvorumo'};
const outcomeEn:Record<string,string>={approved:'Approved',rejected:'Rejected',revision:'Return for revision',no_quorum:'No quorum'};

export default async function ProposalPage({params}:{params:Promise<{id:string}>}){
 const [{id},locale]=await Promise.all([params,getLocale()]);
 const d=await getPublicProposal(id); if(!d) notFound();
 const eo=locale==='eo'; const en=locale==='en'; const p=d.proposal;
 const short=(p.short_code||p.id.replace(/-/g,'').slice(0,8));
 const ref='PROPOSAL · '+short;
 const anchor='proposal-'+short;
 const status=(eo?statusEo:en?statusEn:statusZh)[p.status]||p.status;
 const archiveDate=new Date().toLocaleDateString(eo?'eo':en?'en-US':'zh-CN');
 const citation='Phoenix DAD Proposal Dossier · PROPOSAL · '+short+' · '+new Date(p.updated_at).toISOString().slice(0,10);
 return <main id={anchor}>
  <header className="proposal-print-header">
   <div><strong>{eo?'Feniksa DAD-Propona Dosiero':en?'Phoenix DAD Proposal Dossier':'凤凰文明 DAD 提案档案'}</strong><span>Phoenix DAD Proposal Dossier · Feniksa DAD-Propona Dosiero</span></div>
   <div><span>{eo?'Arkiva dato':en?'Archive date':'归档日期'}：{archiveDate}</span><span>{ref}</span></div>
  </header>
  <span className="badge">DAD · Proposal</span>
  <h1>{p.title}</h1>
  <section className="project-reference-strip">
   <div><span>{eo?'Propona referenco':en?'Proposal reference':'提案引用号'}</span><code>{ref}</code></div>
   <div><span>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</span><a href={'#'+anchor}>#{anchor}</a></div>
   <div className="project-citation"><span>{eo?'Citformo':en?'Citation format':'引用格式'}</span><code>{citation}</code></div>
  </section>
  <div className="hero-actions no-print"><PassportPrintButton label={eo?'Presi / konservi kiel PDF':en?'Print / save as PDF':'打印 / 存为 PDF'} /></div>
  <section className="project-summary-grid">
   <div><span>{eo?'Stato':en?'Status':'状态'}</span><strong>{status}</strong></div>
   <div><span>{eo?'Petita buĝeto':en?'Requested budget':'申请预算'}</span><strong>{p.budget_requested} {p.currency}</strong></div>
   <div><span>{eo?'Kreita':en?'Created':'创建'}</span><strong>{new Date(p.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></div>
   <div><span>{eo?'Ĝisdatigita':en?'Updated':'最近更新'}</span><strong>{new Date(p.updated_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></div>
  </section>
  <section className="card"><h2>{eo?'Problemo':en?'Problem statement':'问题陈述'}</h2><p>{p.problem_statement}</p></section>
  <section className="card"><h2>{eo?'Proponita solvo':en?'Proposed solution':'建议方案'}</h2><p>{p.proposed_solution}</p></section>
  {p.public_value&&<section className="card"><h2>{eo?'Publika valoro':en?'Public value':'公共价值'}</h2><p>{p.public_value}</p></section>}
  {p.risk_description&&<section className="card"><h2>{eo?'Riskopriskribo':en?'Risk description':'风险说明'}</h2><p>{p.risk_description}</p></section>}
  <section className="card">
   <h2>{eo?'Fina decido':en?'Final decision':'最终决定'}</h2>
   {d.decision?<div className="project-summary-grid">
    <div><span>{eo?'Rezulto':en?'Outcome':'结果'}</span><strong>{(eo?outcomeEo:en?outcomeEn:outcomeZh)[d.decision.outcome]||d.decision.outcome}</strong></div>
    <div><span>{eo?'Partopreno':en?'Participation':'参与人数'}</span><strong>{d.decision.participation_count}/{d.decision.eligible_count}</strong></div>
    <div><span>{eo?'Por / kontraŭ':en?'Approve / reject':'赞成 / 反对'}</span><strong>{d.decision.approve_count} / {d.decision.reject_count}</strong></div>
    <div><span>{eo?'Reviziu / sindetenu':en?'Revise / abstain':'修订 / 弃权'}</span><strong>{d.decision.revise_count} / {d.decision.abstain_count}</strong></div>
   </div>:<p>{eo?'Neniu fina decida momentbildo estas registrita.':en?'No final decision snapshot is recorded.':'尚未登记最终决定快照。'}</p>}
   <p className="muted">{eo?'La paĝo montras nur agregitajn decidajn nombrojn; ĝi ne publikigas individuajn voĉojn.':en?'This page shows aggregated decision counts only; it does not publish individual votes.':'本页只显示汇总决定数据，不公开个人逐票信息。'}</p>
  </section>
  <section className="card"><h2>{eo?'Plenumaj projektoj':en?'Resulting projects':'执行项目'}</h2>
   {d.projects.length?<div className="record-list">{d.projects.map(pr=><article className="project-subrecord" key={pr.id}><div className="record-top"><strong>{pr.title}</strong><span>{(eo?statusEo:en?statusEn:statusZh)[pr.status]||pr.status}</span></div><small>{eo?'Ĝisdatigita':en?'Updated':'最近更新'}：{new Date(pr.updated_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</small><p><Link href={'/projects/'+pr.id}>{eo?'Vidi projektan dosieron →':en?'View project dossier →':'查看项目档案 →'}</Link></p></article>)}</div>:<p>{eo?'Neniu publika projekta registro estas ligita al ĉi tiu propono.':en?'No public project record is linked to this proposal.':'当前没有与此提案关联的公开项目记录。'}</p>}
  </section>

  <section className="card"><h2>{eo?'Historio de stato':en?'Status history':'状态历史'}</h2>
   {d.statusEvents.length?<div className="project-audit-list">{d.statusEvents.map(e=><article className="project-audit-item" key={e.id}><div className="timeline-date">{new Date(e.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</div><div><strong>{e.from_status?((eo?statusEo:en?statusEn:statusZh)[e.from_status]||e.from_status)+' → ':''}{(eo?statusEo:en?statusEn:statusZh)[e.to_status]||e.to_status}</strong>{e.note&&<p>{e.note}</p>}</div></article>)}</div>:<p>{eo?'Neniu statokazaĵo registrita.':en?'No status events recorded.':'尚未登记状态事件。'}</p>}
  </section>
  <footer className="proposal-print-footer"><strong>{eo?'Arkiva noto':en?'Archive note':'归档说明'}</strong><p>{eo?'Ĉi tiu presaĵo aŭ PDF estas nurlegebla momentbildo de publika DAD-propona dosiero. Ĝi ne publikigas individuajn voĉojn, ne estas financa aprobo kaj ne anstataŭas la fontajn registrejojn.':en?'This printout or PDF is a read-only snapshot of a public DAD proposal dossier. It does not publish individual votes, is not a financial approval, and does not replace source records.':'本打印件或 PDF 是公开 DAD 提案档案的只读快照，不公开个人逐票信息，不构成财务批准，也不能替代原始记录。'}</p></footer>
  <div className="hero-actions no-print"><Link className="button button-primary" href="/dad">{eo?'Reveni al DAD-Konsilio':en?'Back to DAD Council':'返回 DAD 议事厅'}</Link><Link className="button button-secondary" href="/projects">{eo?'Vidi projektojn':en?'View projects':'查看项目'}</Link></div>
 </main>;
}