import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getVisibleProject } from '@/lib/projects/data';
import TaohuayuanZoneNav from '@/components/taohuayuan/ZoneNav';

const statusZh:Record<string,string>={approved:'已批准',active:'进行中',paused:'已暂停',completed:'已完成',terminated:'已终止',archived:'已归档'};
const statusEo:Record<string,string>={approved:'Aprobita',active:'Aktiva',paused:'Paŭzita',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita'};
const statusEn:Record<string,string>={approved:'Approved',active:'Active',paused:'Paused',completed:'Completed',terminated:'Terminated',archived:'Archived'};
const milestoneZh:Record<string,string>={pending:'待开始',in_progress:'进行中',completed:'已完成',blocked:'受阻',cancelled:'已取消'};
const milestoneEo:Record<string,string>={pending:'Atendanta',in_progress:'En progreso',completed:'Kompletigita',blocked:'Blokita',cancelled:'Nuligita'};
const milestoneEn:Record<string,string>={pending:'Pending',in_progress:'In progress',completed:'Completed',blocked:'Blocked',cancelled:'Cancelled'};
const riskStatusZh:Record<string,string>={open:'开放',mitigating:'缓解中',resolved:'已解决',accepted:'已接受'};
const riskStatusEo:Record<string,string>={open:'Malfermita',mitigating:'Mildigata',resolved:'Solvita',accepted:'Akceptita'};
const riskStatusEn:Record<string,string>={open:'Open',mitigating:'Mitigating',resolved:'Resolved',accepted:'Accepted'};
const riskZh:Record<string,string>={green:'绿色',yellow:'黄色',orange:'橙色',red:'红色'};
const riskEo:Record<string,string>={green:'Verda',yellow:'Flava',orange:'Oranĝa',red:'Ruĝa'};
const riskEn:Record<string,string>={green:'Green',yellow:'Yellow',orange:'Orange',red:'Red'};

export default async function ProjectDetailPage({params}:{params:Promise<{id:string}>}){
 const [{id},locale]=await Promise.all([params,getLocale()]);
 const d=await getVisibleProject(id);
 if(!d) notFound();
 const eo=locale==='eo'; const en=locale==='en'; const p=d.project;
 const status=(eo?statusEo:en?statusEn:statusZh)[p.status]||p.status;
 const risk=(eo?riskEo:en?riskEn:riskZh)[p.risk_level]||p.risk_level;
 return <main>
  <span className="badge">DAD · Projects</span>
  <h1>{p.title}</h1>
  {p.description&&<p className="lead">{p.description}</p>}

  <section className="project-summary-grid">
   <div><span>{eo?'Stato':en?'Status':'状态'}</span><strong>{status}</strong></div>
   <div><span>{eo?'Risko':en?'Risk':'风险'}</span><strong>{risk}</strong></div>
   <div><span>{eo?'Aprobita buĝeto':en?'Approved budget':'批准预算'}</span><strong>{p.approved_budget} {p.currency}</strong></div>
   <div><span>{eo?'Elspezita':en?'Spent':'已支出'}</span><strong>{p.spent} {p.currency}</strong></div>
  </section>

  <section className="card">
   <h2>{eo?'Projekta dosiero':en?'Project dossier':'项目档案'}</h2>
   <div className="dossier-grid">
    <p><span>{eo?'Respondeculo':en?'Manager':'负责人'}</span><strong>{p.manager_name||'—'}</strong></p>
    <p><span>{eo?'Komenco':en?'Start':'开始日期'}</span><strong>{p.start_date||'—'}</strong></p>
    <p><span>{eo?'Cela fino':en?'Target end':'目标结束'}</span><strong>{p.target_end_date||'—'}</strong></p>
    <p><span>{eo?'Fakta fino':en?'Actual end':'实际结束'}</span><strong>{p.actual_end_date||'—'}</strong></p>
   </div>
   {p.completed_summary&&<p><strong>{eo?'Fina resumo':en?'Completion summary':'完成总结'}：</strong>{p.completed_summary}</p>}
   {p.terminated_reason&&<p><strong>{eo?'Kialo de ĉesigo':en?'Termination reason':'终止原因'}：</strong>{p.terminated_reason}</p>}
  </section>

  <section className="card">
   <h2>{eo?'Mejloŝtonoj':en?'Milestones':'里程碑'}</h2>
   {d.milestones.length?<div className="record-list">{d.milestones.map(m=><article key={m.id} className="project-subrecord">
    <div className="record-top"><strong>{m.title}</strong><span>{(eo?milestoneEo:en?milestoneEn:milestoneZh)[m.status]||m.status}</span></div>
    {m.description&&<p>{m.description}</p>}
    <small>{eo?'Limdato':en?'Due':'到期'}：{m.due_date||'—'}{m.completed_at?' · '+(eo?'Kompletigita':en?'Completed':'完成')+' '+new Date(m.completed_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN'):''}</small>
   </article>)}</div>:<p>{eo?'Ankoraŭ neniu mejloŝtono registrita.':en?'No milestones recorded yet.':'尚未登记里程碑。'}</p>}
  </section>

  <section className="card">
   <h2>{eo?'Rezultoj':en?'Outputs':'成果'}</h2>
   {d.outputs.length?<div className="record-list">{d.outputs.map(o=><article key={o.id} className="project-subrecord">
    <div className="record-top"><strong>{o.title}</strong><span>{o.status}</span></div>
    {o.description&&<p>{o.description}</p>}
    {o.url&&<p><a href={o.url} target="_blank" rel="noreferrer">{eo?'Malfermi rezulton →':en?'Open output →':'打开成果 →'}</a></p>}
   </article>)}</div>:<p>{eo?'Ankoraŭ neniu rezulto registrita.':en?'No outputs recorded yet.':'尚未登记成果。'}</p>}
  </section>

  <section className="card">
   <h2>{eo?'Riskoj':en?'Risks':'风险记录'}</h2>
   {d.risks.length?<div className="record-list">{d.risks.map(r=><article key={r.id} className="project-subrecord">
    <div className="record-top"><strong>{(eo?riskEo:en?riskEn:riskZh)[r.risk_level]||r.risk_level}</strong><span>{(eo?riskStatusEo:en?riskStatusEn:riskStatusZh)[r.status]||r.status}</span></div>
    <p>{r.description}</p>{r.mitigation&&<p><strong>{eo?'Mildigo':en?'Mitigation':'缓解措施'}：</strong>{r.mitigation}</p>}
   </article>)}</div>:<p>{eo?'Ankoraŭ neniu risko registrita.':en?'No risks recorded yet.':'尚未登记风险。'}</p>}
  </section>

  <TaohuayuanZoneNav locale={locale} current="projects" />
  <div className="hero-actions"><Link className="button button-primary" href="/projects">{eo?'Reveni al projekta registro':en?'Back to project register':'返回项目总台账'}</Link><Link className="button button-secondary" href="/projects/bud-confirmations">{eo?'BUD-serva konfirmo':en?'BUD service confirmation':'BUD 服务确认'}</Link></div>
 </main>;
}