import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getVisibleProject } from '@/lib/projects/data';
import TaohuayuanZoneNav from '@/components/taohuayuan/ZoneNav';
import PassportPrintButton from '@/components/passport/PassportPrintButton';

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
const outputZh:Record<string,string>={draft:'草稿',review:'审核中',published:'已发布',archived:'已归档'};
const outputEo:Record<string,string>={draft:'Malneto',review:'Kontrolata',published:'Publikigita',archived:'Arkivita'};
const outputEn:Record<string,string>={draft:'Draft',review:'In review',published:'Published',archived:'Archived'};
const budgetEventZh:Record<string,string>={initial_budget:'初始预算',budget_change:'预算变更',expense_record:'支出记录',adjustment:'调整'};
const budgetEventEo:Record<string,string>={initial_budget:'Komenca buĝeto',budget_change:'Buĝeta ŝanĝo',expense_record:'Elspeza registro',adjustment:'Ĝustigo'};
const budgetEventEn:Record<string,string>={initial_budget:'Initial budget',budget_change:'Budget change',expense_record:'Expense record',adjustment:'Adjustment'};
const budgetStatusZh:Record<string,string>={pending:'待处理',approved:'已批准',rejected:'已驳回',recorded:'已记录'};
const budgetStatusEo:Record<string,string>={pending:'Atendanta',approved:'Aprobita',rejected:'Malakceptita',recorded:'Registrita'};
const budgetStatusEn:Record<string,string>={pending:'Pending',approved:'Approved',rejected:'Rejected',recorded:'Recorded'};

export default async function ProjectDetailPage({params}:{params:Promise<{id:string}>}){
 const [{id},locale]=await Promise.all([params,getLocale()]);
 const d=await getVisibleProject(id);
 if(!d) notFound();
 const eo=locale==='eo'; const en=locale==='en'; const p=d.project;
 const status=(eo?statusEo:en?statusEn:statusZh)[p.status]||p.status;
 const risk=(eo?riskEo:en?riskEn:riskZh)[p.risk_level]||p.risk_level;
 const shortProjectRef=id.replace(/-/g,'').slice(0,8);
 const projectRef=`PROJECT · ${shortProjectRef}`;
 const projectLocator=`project-${shortProjectRef}`;
 const archiveDate=new Date().toLocaleDateString(eo?'eo':en?'en-US':'zh-CN');
 const citationDate=(value:string)=>new Date(value).toISOString().slice(0,10);
 const projectCitation=`Phoenix Project Dossier · PROJECT · ${shortProjectRef} · ${citationDate(p.updated_at)}`;
 const milestoneCompleted=d.milestones.filter(x=>x.status==='completed').length;
 const outputsPublished=d.outputs.filter(x=>x.status==='published').length;
 const openRisks=d.risks.filter(x=>x.status==='open'||x.status==='mitigating').length;
 const approvedBudget=Number(p.approved_budget||0);
 const spent=Number(p.spent||0);
 const budgetUsed=approvedBudget>0?Math.max(0,Math.min(999,(spent/approvedBudget)*100)):null;
 const startMs=p.start_date?new Date(p.start_date+'T00:00:00').getTime():null;
 const endMs=p.target_end_date?new Date(p.target_end_date+'T00:00:00').getTime():null;
 const now=Date.now();
 const scheduleProgress=startMs!==null&&endMs!==null&&endMs>startMs?Math.max(0,Math.min(100,((now-startMs)/(endMs-startMs))*100)):null;
 const scheduleState=startMs===null||endMs===null?(eo?'Neniu plena tempofenestro':en?'No complete time window':'缺少完整时间窗'):now<startMs?(eo?'Ankoraŭ ne komencita':en?'Not started yet':'尚未到开始日期'):now>endMs?(eo?'Trans la cela findato':en?'Past target end date':'已超过目标结束日期'):(eo?'En la planita tempofenestro':en?'Within planned time window':'处于计划时间窗内');
 return <main id={projectLocator}>
  <span className="badge">DAD · Projects</span>
  <header className="project-print-header">
   <div><strong>{eo?'Feniksa Projekta Dosiero':en?'Phoenix Project Dossier':'凤凰文明项目档案'}</strong><span>Phoenix Project Dossier · Feniksa Projekta Dosiero</span></div>
   <div><span>{eo?'Projekto':en?'Project':'项目'}：{p.title}</span><span>{eo?'Stato':en?'Status':'状态'}：{status}</span><span>{eo?'Arkiva dato':en?'Archive date':'归档日期'}：{archiveDate}</span><span>{projectRef}</span></div>
  </header>
  <h1>{p.title}</h1>
  {p.description&&<p className="lead">{p.description}</p>}
  <section className="project-reference-strip">
   <div><span>{eo?'Projekta referenco':en?'Project reference':'项目引用号'}</span><code>{projectRef}</code></div>
   <div><span>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</span><a href={`#${projectLocator}`}>#{projectLocator}</a></div>
   <div className="project-citation"><span>{eo?'Citformo':en?'Citation format':'引用格式'}</span><code>{projectCitation}</code></div>
  </section>
  <div className="hero-actions no-print"><PassportPrintButton label={eo?'Presi / konservi kiel PDF':en?'Print / save as PDF':'打印 / 存为 PDF'} /></div>

  <section className="project-summary-grid">
   <div><span>{eo?'Stato':en?'Status':'状态'}</span><strong>{status}</strong></div>
   <div><span>{eo?'Risko':en?'Risk':'风险'}</span><strong>{risk}</strong></div>
   <div><span>{eo?'Aprobita buĝeto':en?'Approved budget':'批准预算'}</span><strong>{p.approved_budget} {p.currency}</strong></div>
   <div><span>{eo?'Elspezita':en?'Spent':'已支出'}</span><strong>{p.spent} {p.currency}</strong></div>
  </section>

  <section className="card">
   <h2>{eo?'Buĝeta kaj tempa travidebleco':en?'Budget and timeline transparency':'预算与时间透明度'}</h2>
   <div className="project-progress-grid">
    <div>
     <span>{eo?'Buĝeta uzado':en?'Budget used':'预算使用比例'}</span>
     <strong>{budgetUsed===null?'—':budgetUsed.toFixed(1)+'%'}</strong>
     <small>{spent} / {approvedBudget} {p.currency}</small>
    </div>
    <div>
     <span>{eo?'Tempa pozicio':en?'Timeline position':'时间进度'}</span>
     <strong>{scheduleProgress===null?'—':scheduleProgress.toFixed(1)+'%'}</strong>
     <small>{scheduleState}</small>
    </div>
   </div>
   <p className="muted">{eo?'La du procentoj estas nur aritmetikaj referencoj bazitaj sur registritaj buĝeto, elspezo kaj datoj. Ili ne estas projekta poentaro kaj ne aŭtomate aprobas aŭ blokas elspezojn.':en?'These percentages are arithmetic references based only on recorded budget, spending and dates. They are not project scores and do not automatically approve or block spending.':'这两个百分比只是根据已登记预算、支出与日期计算出的算术参考，不是项目评分，也不会自动批准或阻止任何支出。'}</p>
  </section>

  <section className="card">
   <h2>{eo?'Plenuma resumo':en?'Execution summary':'执行摘要'}</h2>
   <div className="project-summary-grid">
    <div><span>{eo?'Mejloŝtonoj kompletigitaj':en?'Milestones completed':'已完成里程碑'}</span><strong>{milestoneCompleted}/{d.milestones.length}</strong></div>
    <div><span>{eo?'Publikigitaj rezultoj':en?'Published outputs':'已发布成果'}</span><strong>{outputsPublished}/{d.outputs.length}</strong></div>
    <div><span>{eo?'Aktivaj riskoj':en?'Active risks':'当前风险'}</span><strong>{openRisks}</strong></div>
    <div><span>{eo?'Lasta ĝisdatigo':en?'Last updated':'最近更新'}</span><strong>{new Date(p.updated_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></div>
   </div>
   <p className="muted">{eo?'Ĉi tiuj estas plenumaj nombroj por rapida legado, ne poentaro de la projekto.':en?'These are execution counts for quick reading, not a score for the project.':'这些只是用于快速阅读的执行记录数量，不是对项目的评分。'}</p>
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
   {d.milestones.length?<div className="record-list">{d.milestones.map(m=>{const short=m.id.replace(/-/g,'').slice(0,8);const ref='MILESTONE · '+short;const anchor='milestone-'+short;const citation='Phoenix Project Dossier · MILESTONE · '+short+' · '+citationDate(m.updated_at);return <article id={anchor} key={m.id} className="project-subrecord">
    <div className="record-top"><strong>{m.title}</strong><span>{(eo?milestoneEo:en?milestoneEn:milestoneZh)[m.status]||m.status}</span></div>
    {m.description&&<p>{m.description}</p>}
    <small>{eo?'Limdato':en?'Due':'到期'}：{m.due_date||'—'} · {eo?'Ĝisdatigita':en?'Updated':'最近更新'}：{new Date(m.updated_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}{m.completed_at?' · '+(eo?'Kompletigita':en?'Completed':'完成')+' '+new Date(m.completed_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN'):''}</small>
   <p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a><span className="citation-format">{eo?'Citformo':en?'Citation format':'引用格式'}：{citation}</span></p></article>})}</div>:<p>{eo?'Ankoraŭ neniu mejloŝtono registrita.':en?'No milestones recorded yet.':'尚未登记里程碑。'}</p>}
  </section>

  <section className="card">
   <h2>{eo?'Rezultoj':en?'Outputs':'成果'}</h2>
   {d.outputs.length?<div className="record-list">{d.outputs.map(o=>{const short=o.id.replace(/-/g,'').slice(0,8);const ref='OUTPUT · '+short;const anchor='output-'+short;const citation='Phoenix Project Dossier · OUTPUT · '+short+' · '+citationDate(o.created_at);return <article id={anchor} key={o.id} className="project-subrecord">
    <div className="record-top"><strong>{o.title}</strong><span>{(eo?outputEo:en?outputEn:outputZh)[o.status]||o.status}</span></div>
    {o.description&&<p>{o.description}</p>}
    <small>{eo?'Kreita':en?'Created':'创建'}：{new Date(o.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</small>
    {o.url&&<p><a href={o.url} target="_blank" rel="noreferrer">{eo?'Malfermi rezulton →':en?'Open output →':'打开成果 →'}</a></p>}
   <p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a><span className="citation-format">{eo?'Citformo':en?'Citation format':'引用格式'}：{citation}</span></p></article>})}</div>:<p>{eo?'Ankoraŭ neniu rezulto registrita.':en?'No outputs recorded yet.':'尚未登记成果。'}</p>}
  </section>

  <section className="card">
   <h2>{eo?'Historio de projekta stato':en?'Project status history':'项目状态历史'}</h2>
   {d.statusEvents.length?<div className="project-audit-list">{d.statusEvents.map(e=>{const short=e.id.replace(/-/g,'').slice(0,8);const ref='STATUS · '+short;const anchor='status-event-'+short;const citation='Phoenix Project Dossier · STATUS · '+short+' · '+citationDate(e.created_at);return <article id={anchor} className="project-audit-item" key={e.id}>
    <div className="timeline-date">{new Date(e.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</div>
    <div>
     <strong>{e.from_status?((eo?statusEo:en?statusEn:statusZh)[e.from_status]||e.from_status)+' → ':''}{(eo?statusEo:en?statusEn:statusZh)[e.to_status]||e.to_status}</strong>
     {e.note&&<p>{e.note}</p>}
     {e.actor_name&&<small>{eo?'Aganto':en?'Actor':'操作人'}：{e.actor_name}</small>}
     <p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a><span className="citation-format">{eo?'Citformo':en?'Citation format':'引用格式'}：{citation}</span></p>
    </div>
   </article>})}</div>:<p>{eo?'Ankoraŭ neniu projekta statŝanĝa evento registrita.':en?'No project status-change events recorded yet.':'尚未登记项目状态变更事件。'}</p>}
  </section>

  <section className="card">
   <h2>{eo?'Historio de buĝetaj eventoj':en?'Budget event history':'预算事件历史'}</h2>
   {d.budgetEvents.length?<div className="project-audit-list">{d.budgetEvents.map(e=>{const short=e.id.replace(/-/g,'').slice(0,8);const ref='BUDGET · '+short;const anchor='budget-event-'+short;const citation='Phoenix Project Dossier · BUDGET · '+short+' · '+citationDate(e.created_at);return <article id={anchor} className="project-audit-item" key={e.id}>
    <div className="timeline-date">{new Date(e.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</div>
    <div>
     <div className="record-top"><strong>{(eo?budgetEventEo:en?budgetEventEn:budgetEventZh)[e.event_type]||e.event_type} · {e.amount} {e.currency}</strong><span>{(eo?budgetStatusEo:en?budgetStatusEn:budgetStatusZh)[e.status]||e.status}</span></div>
     {e.note&&<p>{e.note}</p>}
     {(e.requested_by_name||e.approved_by_name)&&<small>{e.requested_by_name&&(eo?'Petanto':en?'Requested by':'申请人')+'：'+e.requested_by_name}{e.requested_by_name&&e.approved_by_name?' · ':''}{e.approved_by_name&&(eo?'Aprobinto':en?'Approved by':'批准人')+'：'+e.approved_by_name}</small>}
     <p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a></p>
    </div>
   </article>})}</div>:<p>{eo?'Ankoraŭ neniu buĝeta evento registrita.':en?'No budget events recorded yet.':'尚未登记预算事件。'}</p>}
  </section>

  <section className="card">
   <h2>{eo?'Riskoj':en?'Risks':'风险记录'}</h2>
   {d.risks.length?<div className="record-list">{d.risks.map(r=>{const short=r.id.replace(/-/g,'').slice(0,8);const ref='RISK · '+short;const anchor='risk-'+short;const citation='Phoenix Project Dossier · RISK · '+short+' · '+citationDate(r.updated_at);return <article id={anchor} key={r.id} className="project-subrecord">
    <div className="record-top"><strong>{(eo?riskEo:en?riskEn:riskZh)[r.risk_level]||r.risk_level}</strong><span>{(eo?riskStatusEo:en?riskStatusEn:riskStatusZh)[r.status]||r.status}</span></div>
    <p>{r.description}</p>{r.mitigation&&<p><strong>{eo?'Mildigo':en?'Mitigation':'缓解措施'}：</strong>{r.mitigation}</p>}<small>{eo?'Kreita':en?'Created':'创建'}：{new Date(r.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')} · {eo?'Ĝisdatigita':en?'Updated':'最近更新'}：{new Date(r.updated_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}{r.resolved_at?' · '+(eo?'Solvita':en?'Resolved':'解决')+' '+new Date(r.resolved_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN'):''}</small>
   <p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a></p></article>})}</div>:<p>{eo?'Ankoraŭ neniu risko registrita.':en?'No risks recorded yet.':'尚未登记风险。'}</p>}
  </section>

  <footer className="project-print-footer"><strong>{eo?'Arkiva noto':en?'Archive note':'归档说明'}</strong><p>{eo?'Ĉi tiu presaĵo aŭ PDF estas nurlegebla momentbildo de la nuna projekta dosiero. Ĝi ne estas financa aprobo, paginstrukcio aŭ projekta poentaro, kaj ĝi ne anstataŭas la fontajn registrejojn.':en?'This printout or PDF is a read-only snapshot of the current project dossier. It is not a financial approval, payment instruction or project score, and it does not replace source records.':'本打印件或 PDF 是当前项目档案的只读快照，不是财务批准、付款指令或项目评分，也不能替代原始记录。'}</p></footer>

  <TaohuayuanZoneNav locale={locale} current="projects" />
  <div className="hero-actions"><Link className="button button-primary" href="/projects">{eo?'Reveni al projekta registro':en?'Back to project register':'返回项目总台账'}</Link><Link className="button button-secondary" href="/projects/bud-confirmations">{eo?'BUD-serva konfirmo':en?'BUD service confirmation':'BUD 服务确认'}</Link></div>
 </main>;
}