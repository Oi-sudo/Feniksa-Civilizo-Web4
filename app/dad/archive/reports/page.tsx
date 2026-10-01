import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { listGovernanceArchiveReports } from '@/lib/dad/data';

export default async function ArchiveReportsPage(){
  const [locale,reports]=await Promise.all([getLocale(),listGovernanceArchiveReports()]);
  const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'DAD · Arkivitaj Ŝanĝraportoj':en?'DAD · Archived Change Reports':'DAD · 治理变化报告总目录'}</span>
    <h1>{eo?'Publika katalogo de arkivitaj regadaj ŝanĝraportoj':en?'Public catalog of archived governance change reports':'治理变化报告总目录'}</h1>
    <p className="lead">{eo?'Nur eksplicite arkivitaj komparraportoj aperas ĉi tie. Provizora foliumado de la komparpaĝo ne kreas arkivan registron.':en?'Only explicitly archived comparison reports appear here. Merely viewing the comparison page does not create an archive record.':'这里只登记明确归档过的比较报告；临时浏览比较页不会自动生成正式档案。'}</p>
    <section className="card">
      <div className="record-top"><h2>{eo?'Arkivitaj raportoj':en?'Archived reports':'已归档报告'}</h2><strong>{reports.length}</strong></div>
      {reports.length?<div className="record-list">{reports.map(r=>{
        const ref='ARCHIVE-REPORT · '+r.from_snapshot_date+' · '+r.to_snapshot_date;
        return <article className="project-subrecord" key={r.id}>
          <div className="record-top"><div><small>{ref}</small><h3>{r.from_snapshot_date} → {r.to_snapshot_date}</h3></div><span>{new Date(r.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</span></div>
          <p>{eo?'Arkivita de':en?'Archived by':'归档人'}：{r.created_by||'—'}</p>
          <p><Link href={'/dad/archive/compare?from='+r.from_snapshot_date+'&to='+r.to_snapshot_date}>{eo?'Malfermi la konservitan komparon →':en?'Open the archived comparison →':'打开已归档比较报告 →'}</Link></p>
        </article>;
      })}</div>:<p>{eo?'Ankoraŭ ne ekzistas arkivitaj ŝanĝraportoj.':en?'No governance change reports have been archived yet.':'目前尚无已归档治理变化报告。'}</p>}
    </section>
    <div className="hero-actions">
      <Link className="button button-primary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link>
      <Link className="button button-secondary" href="/dad/archive/snapshots">{eo?'Momentbilda historio':en?'Snapshot history':'快照历史'}</Link>
    </div>
  </main>;
}