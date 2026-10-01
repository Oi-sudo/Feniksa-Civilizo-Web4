import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { listGovernanceArchiveSnapshots } from '@/lib/dad/data';
import CopyCitationButton from '@/components/archive/CopyCitationButton';

export default async function ArchiveSnapshotsPage(){
  const [locale,snapshots]=await Promise.all([getLocale(),listGovernanceArchiveSnapshots()]);
  const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'DAD · Arkivaj Momentbildoj':en?'DAD · Archive Snapshots':'DAD · 归档版本快照'}</span>
    <h1>{eo?'Historio de publikaj regadaj momentbildoj':en?'Public governance snapshot history':'公共治理版本快照历史'}</h1>
    <p className="lead">{eo?'Ĉiu momento konservas la publikajn totalojn de tiu dato por posta komparo.':en?'Each snapshot preserves the public totals for that date for later comparison.':'每份快照保存该日期当时的公共治理总量，便于以后比较。'}</p>
    <section className="card">
      {snapshots.length?<div className="record-list">{snapshots.map(s=>{
        const ref='ARCHIVE-SNAPSHOT · '+s.snapshot_date;
        const anchor='archive-snapshot-'+s.snapshot_date;
        const citation='Phoenix DAD Governance Archive · ARCHIVE-SNAPSHOT · '+s.snapshot_date;
        return <article id={anchor} className="project-subrecord" key={s.id}>
          <div className="record-top"><strong>{ref}</strong><span>{new Date(s.created_at).toLocaleString(eo?'eo':en?'en-US':'zh-CN')}</span></div>
          <div className="project-summary-grid">
            <div><span>{eo?'Proponoj':en?'Proposals':'提案'}</span><strong>{s.proposal_count}</strong></div>
            <div><span>{eo?'Decidoj':en?'Decisions':'决定'}</span><strong>{s.decision_count}</strong></div>
            <div><span>{eo?'Regadaj eventoj':en?'Governance events':'治理事件'}</span><strong>{s.governance_event_count}</strong></div>
            <div><span>{eo?'Projektoj':en?'Projects':'项目'}</span><strong>{s.project_count}</strong></div>
            <div><span>{eo?'Mejloŝtonoj':en?'Milestones':'里程碑'}</span><strong>{s.milestone_count}</strong></div>
          </div>
          <p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a><span className="citation-format">{eo?'Citformo':en?'Citation format':'引用格式'}：{citation}<CopyCitationButton text={citation} label={eo?'Kopii citon':en?'Copy citation':'复制引用'} copiedLabel={eo?'Kopiita':en?'Copied':'已复制'} /></span></p>
        </article>;
      })}</div>:<p>{eo?'Ankoraŭ ne ekzistas publikaj arkivaj momentbildoj.':en?'No public archive snapshots exist yet.':'目前尚无公共归档快照。'}</p>}
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/dad/archive/compare">{eo?'Kompari momentbildojn':en?'Compare snapshots':'比较快照'}</Link><Link className="button button-secondary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link></div>
  </main>;
}