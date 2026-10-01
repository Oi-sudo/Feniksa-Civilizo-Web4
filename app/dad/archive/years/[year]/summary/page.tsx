import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getGovernanceAnnualSummary } from '@/lib/dad/data';
import PassportPrintButton from '@/components/passport/PassportPrintButton';

export default async function GovernanceAnnualSummaryPage({params}:{params:Promise<{year:string}>}){
  const [{year:rawYear},locale]=await Promise.all([params,getLocale()]);
  const year=Number(rawYear);
  if(!Number.isInteger(year)||year<2000||year>3000) notFound();
  const months=await getGovernanceAnnualSummary(year);
  const eo=locale==='eo'; const en=locale==='en';
  const reportDate=new Date().toLocaleDateString(eo?'eo':en?'en-US':'zh-CN');
  const reportRef='GOVERNANCE-YEAR · '+year;


  const totals=months.reduce((a,m)=>({
    proposal_count:a.proposal_count+m.proposal_count,
    decision_count:a.decision_count+m.decision_count,
    governance_event_count:a.governance_event_count+m.governance_event_count,
    project_count:a.project_count+m.project_count,
    milestone_count:a.milestone_count+m.milestone_count,
    archived_report_count:a.archived_report_count+m.archived_report_count
  }),{proposal_count:0,decision_count:0,governance_event_count:0,project_count:0,milestone_count:0,archived_report_count:0});

  return <main>
    <header className="proposal-print-header">
      <div><strong>{eo?'Feniksa DAD Jara Regada Raporto':en?'Phoenix DAD Annual Governance Report':'凤凰文明 DAD 年度治理报告'}</strong><span>Phoenix DAD Annual Governance Report · Feniksa DAD Jara Regada Raporto</span></div>
      <div><span>{eo?'Raporta dato':en?'Report date':'报告日期'}：{reportDate}</span><span>{reportRef}</span></div>
    </header>
    <span className="badge">GOVERNANCE-YEAR · {year}</span>
    <h1>{year} Governance Annual Summary</h1>
    <p className="lead">{eo?'Jara publika resumo de monataj regadaj registroj kaj arkivitaj raportoj.':en?'Annual public summary of monthly governance records and archived reports.':'全年公共治理月度记录与已归档报告汇总。'}</p>

    <section className="project-reference-strip">
      <div><span>{eo?'Jara referenco':en?'Annual reference':'年度引用号'}</span><code>{reportRef}</code></div>
      <div><span>{eo?'Periodo':en?'Period':'统计期间'}</span><code>{year}-01-01 → {year}-12-31</code></div>
      <div><span>{eo?'Raporta dato':en?'Report date':'报告日期'}</span><code>{reportDate}</code></div>
    </section>
    <div className="hero-actions no-print"><PassportPrintButton label={eo?'Presi / konservi kiel PDF':en?'Print / save as PDF':'打印 / 存为 PDF'} /></div>

    <section className="card">
      <h2>{eo?'Jara sumo':en?'Annual totals':'年度总量'}</h2>
      <div className="project-summary-grid">
        <div><span>{eo?'Novaj proponoj':en?'New proposals':'新增提案'}</span><strong>{totals.proposal_count}</strong></div>
        <div><span>{eo?'Finaj decidoj':en?'Final decisions':'最终决定'}</span><strong>{totals.decision_count}</strong></div>
        <div><span>{eo?'Regadaj eventoj':en?'Governance events':'治理事件'}</span><strong>{totals.governance_event_count}</strong></div>
        <div><span>{eo?'Novaj projektoj':en?'New projects':'新增项目'}</span><strong>{totals.project_count}</strong></div>
        <div><span>{eo?'Kompletigitaj mejloŝtonoj':en?'Completed milestones':'完成里程碑'}</span><strong>{totals.milestone_count}</strong></div>
        <div><span>{eo?'Arkivitaj raportoj':en?'Archived reports':'已归档报告'}</span><strong>{totals.archived_report_count}</strong></div>
      </div>
    </section>

    <section className="card">
      <h2>{eo?'Monata tendenco':en?'Monthly trend':'月度变化趋势'}</h2>
      <div className="record-list">
        {months.map((m,i)=><article className="project-subrecord" key={m.month}>
          <div className="record-top"><strong>{m.month}</strong><Link className="no-print" href={'/dad/archive/years/'+year+'/'+String(i+1).padStart(2,'0')}>{eo?'Monata resumo →':en?'Monthly summary →':'月度摘要 →'}</Link></div>
          <div className="project-summary-grid">
            <div><span>{eo?'Proponoj':en?'Proposals':'提案'}</span><strong>{m.proposal_count}</strong></div>
            <div><span>{eo?'Decidoj':en?'Decisions':'决定'}</span><strong>{m.decision_count}</strong></div>
            <div><span>{eo?'Eventoj':en?'Events':'事件'}</span><strong>{m.governance_event_count}</strong></div>
            <div><span>{eo?'Projektoj':en?'Projects':'项目'}</span><strong>{m.project_count}</strong></div>
            <div><span>{eo?'Mejloŝtonoj':en?'Milestones':'里程碑'}</span><strong>{m.milestone_count}</strong></div>
            <div><span>{eo?'Raportoj':en?'Reports':'报告'}</span><strong>{m.archived_report_count}</strong></div>
          </div>
        </article>)}
      </div>
    </section>

    <section className="card">
      <h2>{eo?'Interpreta limo':en?'Interpretation boundary':'解释边界'}</h2>
      <p>{eo?'La jara resumo montras kronologiajn nombrojn kaj monatajn ŝanĝojn. Ĝi ne estas rangigo aŭ aŭtomata pritakso de regada kvalito.':en?'The annual summary shows chronological counts and monthly changes. It is not a ranking or an automatic assessment of governance quality.':'年度摘要展示时间序列数量与月度变化，不是排名，也不自动评价治理质量。'}</p>
    </section>

    <footer className="proposal-print-footer"><strong>{eo?'Arkiva noto':en?'Archive note':'归档说明'}</strong><p>{eo?'Ĉi tiu presaĵo aŭ PDF estas nurlegebla jara resumo de publikaj DAD-regadaj registroj. Ĝi resumas kronologiajn nombrojn kaj ne anstataŭas la fontajn proponojn, decidojn, eventojn, projektojn, mejloŝtonojn aŭ arkivajn raportojn.':en?'This printout or PDF is a read-only annual summary of public DAD governance records. It summarizes chronological counts and does not replace source proposals, decisions, events, projects, milestones, or archived reports.':'本打印件或 PDF 是 DAD 公共治理记录的只读年度汇总，仅汇总时间序列数量，不能替代原始提案、决定、事件、项目、里程碑或归档报告。'}</p></footer>

    <div className="hero-actions no-print">
      <Link className="button button-primary" href={'/dad/archive/years/'+year}>{eo?'Reveni al jara arkivo':en?'Back to yearly archive':'返回年度档案'}</Link>
      <Link className="button button-secondary" href="/dad/archive/years">{eo?'Ĉiuj jaroj':en?'All years':'全部年度'}</Link>
    </div>
  </main>;
}