import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getGovernanceArchiveSnapshot, listGovernanceArchiveSnapshots } from '@/lib/dad/data';

export default async function ArchiveComparePage({searchParams}:{searchParams:Promise<{from?:string;to?:string}>}){
  const [{from,to},locale,all]=await Promise.all([searchParams,getLocale(),listGovernanceArchiveSnapshots(120)]);
  const eo=locale==='eo'; const en=locale==='en';

  const defaultTo=to||all[0]?.snapshot_date;
  const defaultFrom=from||all[1]?.snapshot_date;
  const [a,b]=await Promise.all([
    defaultFrom?getGovernanceArchiveSnapshot(defaultFrom):Promise.resolve(null),
    defaultTo?getGovernanceArchiveSnapshot(defaultTo):Promise.resolve(null)
  ]);

  const rows=[
    {key:'proposal_count',zh:'公开提案',en:'Public proposals',eo:'Publikaj proponoj'},
    {key:'decision_count',zh:'最终决定',en:'Final decisions',eo:'Finaj decidoj'},
    {key:'governance_event_count',zh:'治理事件',en:'Governance events',eo:'Regadaj eventoj'},
    {key:'project_count',zh:'公开项目',en:'Public projects',eo:'Publikaj projektoj'},
    {key:'milestone_count',zh:'里程碑',en:'Milestones',eo:'Mejloŝtonoj'}
  ] as const;

  const label=(r:(typeof rows)[number])=>eo?r.eo:en?r.en:r.zh;
  const sign=(n:number)=>n>0?'+'+n:String(n);

  return <main>
    <span className="badge">{eo?'DAD · Komparo de Arkivaj Momentbildoj':en?'DAD · Archive Snapshot Comparison':'DAD · 归档快照比较'}</span>
    <h1>{eo?'Komparu du regadajn momentbildojn':en?'Compare two governance snapshots':'比较两个公共治理快照'}</h1>
    <p className="lead">{eo?'La komparo montras nur la diferencon inter du konservitaj publikaj resumoj.':en?'This comparison shows only the differences between two preserved public summaries.':'本页只比较两份已保存公共治理汇总之间的变化。'}</p>

    <section className="card">
      <form className="hero-actions" action="/dad/archive/compare" method="get">
        <label>{eo?'De':en?'From':'起始'} <select name="from" defaultValue={defaultFrom}>{all.map(s=><option key={s.id} value={s.snapshot_date}>{s.snapshot_date}</option>)}</select></label>
        <label>{eo?'Ĝis':en?'To':'结束'} <select name="to" defaultValue={defaultTo}>{all.map(s=><option key={s.id} value={s.snapshot_date}>{s.snapshot_date}</option>)}</select></label>
        <button className="button button-primary" type="submit">{eo?'Kompari':en?'Compare':'比较'}</button>
      </form>
    </section>

    {a&&b?<section className="card">
      <div className="record-top"><div><small>ARCHIVE-SNAPSHOT · {a.snapshot_date}</small><h2>{a.snapshot_date} → {b.snapshot_date}</h2></div><small>ARCHIVE-SNAPSHOT · {b.snapshot_date}</small></div>
      <div className="record-list">
        {rows.map(r=>{
          const av=Number(a[r.key]); const bv=Number(b[r.key]); const diff=bv-av;
          return <article className="project-subrecord" key={r.key}>
            <div className="record-top"><strong>{label(r)}</strong><span>{sign(diff)}</span></div>
            <div className="project-summary-grid">
              <div><span>{eo?'Komenca valoro':en?'Starting value':'起始值'}</span><strong>{av}</strong></div>
              <div><span>{eo?'Fina valoro':en?'Ending value':'结束值'}</span><strong>{bv}</strong></div>
              <div><span>{eo?'Ŝanĝo':en?'Change':'变化'}</span><strong>{sign(diff)}</strong></div>
            </div>
          </article>;
        })}
      </div>
    </section>:<section className="card"><p>{eo?'Por kompari necesas almenaŭ du arkivaj momentbildoj.':en?'At least two archive snapshots are required for comparison.':'至少需要两份归档快照才能比较。'}</p></section>}

    <section className="card">
      <h2>{eo?'Interpreta limo':en?'Interpretation boundary':'解释边界'}</h2>
      <p>{eo?'Pozitiva aŭ negativa diferenco estas nur nombra ŝanĝo inter du datoj; ĝi ne estas aŭtomata takso de sukceso, kvalito aŭ politika valoro.':en?'A positive or negative difference is only a numerical change between two dates; it is not an automatic judgment of success, quality, or governance value.':'正数或负数只表示两个日期之间的数量变化，不自动代表成功、质量或治理价值。'}</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-primary" href="/dad/archive/snapshots">{eo?'Reveni al momentbildoj':en?'Back to snapshots':'返回快照历史'}</Link>
      <Link className="button button-secondary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link>
    </div>
  </main>;
}