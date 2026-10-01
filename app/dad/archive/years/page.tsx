import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { listGovernanceArchiveYears } from '@/lib/dad/data';

export default async function GovernanceArchiveYearsPage(){
  const [locale,years]=await Promise.all([getLocale(),listGovernanceArchiveYears()]);
  const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'DAD · Jaraj Arkivoj':en?'DAD · Yearly Archives':'DAD · 治理档案年度索引'}</span>
    <h1>{eo?'Jara indekso de regadaj arkivoj':en?'Yearly governance archive index':'治理档案年度索引'}</h1>
    <p className="lead">{eo?'Ĉiu jaro grupigas konservitajn ARCHIVE-SNAPSHOT kaj ARCHIVE-REPORT registrojn por longdaŭra kronologia serĉado.':en?'Each year groups preserved ARCHIVE-SNAPSHOT and ARCHIVE-REPORT records for long-term chronological browsing.':'按年份汇总保存的 ARCHIVE-SNAPSHOT 与 ARCHIVE-REPORT，便于长期按时间查找。'}</p>
    <section className="card">
      {years.length?<div className="record-list">{years.map(y=><article className="project-subrecord" key={y.year}>
        <div className="record-top"><div><small>GOVERNANCE-ARCHIVE · {y.year}</small><h2>{y.year} Governance Archive</h2></div><span>{y.snapshot_count+y.report_count}</span></div>
        <div className="project-summary-grid">
          <div><span>{eo?'Momentbildoj':en?'Snapshots':'快照'}</span><strong>{y.snapshot_count}</strong></div>
          <div><span>{eo?'Ŝanĝraportoj':en?'Change reports':'变化报告'}</span><strong>{y.report_count}</strong></div>
          <div><span>{eo?'Unua momentbildo':en?'First snapshot':'首份快照'}</span><strong>{y.first_snapshot_date||'—'}</strong></div>
          <div><span>{eo?'Lasta momentbildo':en?'Latest snapshot':'最近快照'}</span><strong>{y.last_snapshot_date||'—'}</strong></div>
        </div>
        <p><Link href={'/dad/archive/years/'+y.year}>{eo?'Malfermi jaran arkivon →':en?'Open yearly archive →':'打开年度档案 →'}</Link></p>
      </article>)}</div>:<p>{eo?'Ankoraŭ ne ekzistas jaraj arkivregistroj.':en?'No yearly archive records exist yet.':'目前尚无年度归档记录。'}</p>}
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link></div>
  </main>;
}