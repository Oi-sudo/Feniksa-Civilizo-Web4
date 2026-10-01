import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getGovernanceMonthlySummary, getGovernanceArchiveYear } from '@/lib/dad/data';

export default async function GovernanceMonthlySummaryPage({params}:{params:Promise<{year:string;month:string}>}){
  const [{year:rawYear,month:rawMonth},locale]=await Promise.all([params,getLocale()]);
  const year=Number(rawYear); const month=Number(rawMonth);
  if(!Number.isInteger(year)||year<2000||year>3000||!Number.isInteger(month)||month<1||month>12) notFound();
  const [summary,yearData]=await Promise.all([getGovernanceMonthlySummary(year,month),getGovernanceArchiveYear(year)]);
  const eo=locale==='eo'; const en=locale==='en';
  const prefix=year+'-'+String(month).padStart(2,'0');
  const reports=yearData.reports.filter(r=>r.created_at.startsWith(prefix));
  const label=new Intl.DateTimeFormat(eo?'eo':en?'en-US':'zh-CN',{year:'numeric',month:'long',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,1)));
  return <main>
    <span className="badge">GOVERNANCE-MONTH · {prefix}</span>
    <h1>{prefix} Governance Monthly Summary</h1>
    <p className="lead">{eo?'Publika monata resumo de novaj regadaj registroj kaj arkivitaj ŝanĝraportoj.':en?'Public monthly summary of new governance records and archived change reports.':'本月新增公共治理记录与已归档变化报告摘要。'}</p>

    <section className="card">
      <div className="record-top"><h2>{label}</h2><strong>{summary.governance_event_count}</strong></div>
      <div className="project-summary-grid">
        <div><span>{eo?'Novaj proponoj':en?'New proposals':'新增提案'}</span><strong>{summary.proposal_count}</strong></div>
        <div><span>{eo?'Finaj decidoj':en?'Final decisions':'最终决定'}</span><strong>{summary.decision_count}</strong></div>
        <div><span>{eo?'Regadaj eventoj':en?'Governance events':'治理事件'}</span><strong>{summary.governance_event_count}</strong></div>
        <div><span>{eo?'Novaj projektoj':en?'New projects':'新增项目'}</span><strong>{summary.project_count}</strong></div>
        <div><span>{eo?'Kompletigitaj mejloŝtonoj':en?'Completed milestones':'完成里程碑'}</span><strong>{summary.milestone_count}</strong></div>
        <div><span>{eo?'Arkivitaj raportoj':en?'Archived reports':'已归档报告'}</span><strong>{summary.archived_report_count}</strong></div>
      </div>
    </section>

    <section className="card">
      <h2>{eo?'Arkivitaj ŝanĝraportoj de la monato':en?'Archived change reports this month':'本月已归档治理变化报告'}</h2>
      {reports.length?<div className="record-list">{reports.map(r=><article className="project-subrecord" key={r.id}>
        <div className="record-top"><strong>ARCHIVE-REPORT · {r.from_snapshot_date} · {r.to_snapshot_date}</strong><span>{new Date(r.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</span></div>
        <p><Link href={'/dad/archive/compare?from='+r.from_snapshot_date+'&to='+r.to_snapshot_date}>{eo?'Malfermi raporton →':en?'Open report →':'打开报告 →'}</Link></p>
      </article>)}</div>:<p>{eo?'Neniu ŝanĝraporto estis arkivita en ĉi tiu monato.':en?'No change report was archived in this month.':'本月尚无已归档治理变化报告。'}</p>}
    </section>

    <section className="card">
      <h2>{eo?'Interpreta limo':en?'Interpretation boundary':'解释边界'}</h2>
      <p>{eo?'La monata resumo estas nombra kronologia indekso. Ĝi ne estas takso de sukceso, kvalito aŭ regada valoro.':en?'The monthly summary is a numerical chronological index. It is not an assessment of success, quality, or governance value.':'月度摘要只是按时间汇总的数量索引，不代表成功、质量或治理价值评价。'}</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-primary" href={'/dad/archive/years/'+year}>{eo?'Reveni al jara arkivo':en?'Back to yearly archive':'返回年度档案'}</Link>
      <Link className="button button-secondary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link>
    </div>
  </main>;
}