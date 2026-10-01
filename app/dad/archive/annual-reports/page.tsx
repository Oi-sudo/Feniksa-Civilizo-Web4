import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { listGovernanceArchiveYears } from '@/lib/dad/data';

export default async function AnnualGovernanceReportsPage(){
  const [locale,years]=await Promise.all([getLocale(),listGovernanceArchiveYears()]);
  const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'DAD · Jaraj Regadaj Raportoj':en?'DAD · Annual Governance Reports':'DAD · 年度治理报告总目录'}</span>
    <h1>{eo?'Publika katalogo de jaraj regadaj raportoj':en?'Public catalog of annual governance reports':'年度治理报告总目录'}</h1>
    <p className="lead">{eo?'Ĉiu jaro havas stabilan GOVERNANCE-YEAR-referencon kaj ligon al sia presita aŭ PDF-konservebla jara raporto.':en?'Each year has a stable GOVERNANCE-YEAR reference and a link to its printable or PDF-saveable annual report.':'每个年度都有稳定的 GOVERNANCE-YEAR 引用，并可进入对应的可打印 / 保存 PDF 年度报告。'}</p>

    <section className="card">
      <div className="record-top"><h2>{eo?'Jaraj raportoj':en?'Annual reports':'年度报告'}</h2><strong>{years.length}</strong></div>
      {years.length?<div className="record-list">{years.map(y=><article className="project-subrecord" key={y.year}>
        <div className="record-top"><div><small>GOVERNANCE-YEAR · {y.year}</small><h2>{y.year} Governance Annual Summary</h2></div><span>{y.snapshot_count+y.report_count}</span></div>
        <div className="project-summary-grid">
          <div><span>{eo?'Momentbildoj':en?'Snapshots':'快照'}</span><strong>{y.snapshot_count}</strong></div>
          <div><span>{eo?'Arkivitaj ŝanĝraportoj':en?'Archived change reports':'已归档变化报告'}</span><strong>{y.report_count}</strong></div>
          <div><span>{eo?'Unua momentbildo':en?'First snapshot':'首份快照'}</span><strong>{y.first_snapshot_date||'—'}</strong></div>
          <div><span>{eo?'Lasta momentbildo':en?'Latest snapshot':'最近快照'}</span><strong>{y.last_snapshot_date||'—'}</strong></div>
        </div>
        <p><Link href={'/dad/archive/years/'+y.year+'/summary'}>{eo?'Malfermi jaran raporton →':en?'Open annual report →':'打开年度治理报告 →'}</Link></p>
      </article>)}</div>:<p>{eo?'Ankoraŭ ne ekzistas jaraj raportoj.':en?'No annual reports exist yet.':'目前尚无年度治理报告。'}</p>}
    </section>

    <section className="card">
      <h2>{eo?'Katalogprincipo':en?'Catalog principle':'目录原则'}</h2>
      <p>{eo?'La katalogo ne kreas apartan jaran datumbazon. Ĝi uzas la ekzistantajn jarajn arkivajn registrojn kaj ligas ilin al la koncerna GOVERNANCE-YEAR-raporto.':en?'The catalog does not create a separate annual database. It uses the existing yearly archive records and links them to the corresponding GOVERNANCE-YEAR report.':'本目录不另建年度数据库，而是复用现有年度归档记录，并链接到相应的 GOVERNANCE-YEAR 年度报告。'}</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-primary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link>
      <Link className="button button-secondary" href="/dad/archive/years">{eo?'Jaraj arkivoj':en?'Yearly archives':'年度档案索引'}</Link>
    </div>
  </main>;
}