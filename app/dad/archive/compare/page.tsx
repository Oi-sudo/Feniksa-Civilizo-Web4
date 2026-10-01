import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getGovernanceArchiveChangeDetails, getGovernanceArchiveSnapshot, listGovernanceArchiveSnapshots } from '@/lib/dad/data';
import PassportPrintButton from '@/components/passport/PassportPrintButton';

export default async function ArchiveComparePage({searchParams}:{searchParams:Promise<{from?:string;to?:string}>}){
  const [{from,to},locale,all]=await Promise.all([searchParams,getLocale(),listGovernanceArchiveSnapshots(120)]);
  const eo=locale==='eo'; const en=locale==='en';

  const selectedTo=to||all[0]?.snapshot_date;
  const selectedFrom=from||all[1]?.snapshot_date;
  const defaultFrom=selectedFrom&&selectedTo&&selectedFrom>selectedTo?selectedTo:selectedFrom;
  const defaultTo=selectedFrom&&selectedTo&&selectedFrom>selectedTo?selectedFrom:selectedTo;

  const [a,b,changes]=await Promise.all([
    defaultFrom?getGovernanceArchiveSnapshot(defaultFrom):Promise.resolve(null),
    defaultTo?getGovernanceArchiveSnapshot(defaultTo):Promise.resolve(null),
    defaultFrom&&defaultTo?getGovernanceArchiveChangeDetails(defaultFrom,defaultTo):Promise.resolve([])
  ]);

  const rows=[
    {key:'proposal_count',zh:'公开提案',en:'Public proposals',eo:'Publikaj proponoj'},
    {key:'decision_count',zh:'最终决定',en:'Final decisions',eo:'Finaj decidoj'},
    {key:'governance_event_count',zh:'治理事件',en:'Governance events',eo:'Regadaj eventoj'},
    {key:'project_count',zh:'公开项目',en:'Public projects',eo:'Publikaj projektoj'},
    {key:'milestone_count',zh:'里程碑',en:'Milestones',eo:'Mejloŝtonoj'}
  ] as const;

  const typeLabels:Record<string,string>=eo?
    {proposal:'Nova propono',decision:'Nova fina decido',project:'Nova publika projekto',milestone:'Nova kompletigita mejloŝtono'}:
    en?{proposal:'New proposal',decision:'New final decision',project:'New public project',milestone:'New completed milestone'}:
    {proposal:'新增提案',decision:'新增最终决定',project:'新增公开项目',milestone:'新完成里程碑'};

  const categoryOrder=['proposal','decision','project','milestone'] as const;
  const categoryStats=categoryOrder.map(type=>{
    const count=changes.filter(item=>item.record_type===type).length;
    const percent=changes.length?Math.round((count/changes.length)*1000)/10:0;
    return {type,count,percent};
  });

  const label=(r:(typeof rows)[number])=>eo?r.eo:en?r.en:r.zh;
  const sign=(n:number)=>n>0?'+'+n:String(n);
  const short=(id:string)=>id.replace(/-/g,'').slice(0,8);
  const reportDate=new Date().toLocaleDateString(eo?'eo':en?'en-US':'zh-CN');
  const reportRef=a&&b?`ARCHIVE-REPORT · ${a.snapshot_date} · ${b.snapshot_date}`:null;


  return <main>
    {a&&b&&<header className="proposal-print-header">
      <div><strong>{eo?'Feniksa DAD Regada Ŝanĝraporto':en?'Phoenix DAD Governance Change Report':'凤凰文明 DAD 治理变化报告'}</strong><span>Phoenix DAD Governance Change Report · Feniksa DAD Regada Ŝanĝraporto</span></div>
      <div><span>{eo?'Raporta dato':en?'Report date':'报告日期'}：{reportDate}</span><span>{reportRef}</span></div>
    </header>}
    <span className="badge">{eo?'DAD · Komparo de Arkivaj Momentbildoj':en?'DAD · Archive Snapshot Comparison':'DAD · 归档快照比较'}</span>
    <h1>{eo?'Komparu du regadajn momentbildojn':en?'Compare two governance snapshots':'比较两个公共治理快照'}</h1>
    <p className="lead">{eo?'La komparo montras la nombran diferencon kaj la konkretajn publikajn registrojn aldonitajn inter du konservitaj momentbildoj.':en?'The comparison shows both numerical differences and the concrete public records added between two preserved snapshots.':'本页同时显示两份已保存快照之间的数量变化，以及期间具体新增的公共治理记录。'}</p>

    <section className="card no-print">
      <form className="hero-actions" action="/dad/archive/compare" method="get">
        <label>{eo?'De':en?'From':'起始'} <select name="from" defaultValue={defaultFrom}>{all.map(s=><option key={s.id} value={s.snapshot_date}>{s.snapshot_date}</option>)}</select></label>
        <label>{eo?'Ĝis':en?'To':'结束'} <select name="to" defaultValue={defaultTo}>{all.map(s=><option key={s.id} value={s.snapshot_date}>{s.snapshot_date}</option>)}</select></label>
        <button className="button button-primary" type="submit">{eo?'Kompari':en?'Compare':'比较'}</button>
      </form>
    </section>

    {a&&b?<>
      <div className="hero-actions no-print"><PassportPrintButton label={eo?'Presi / konservi kiel PDF':en?'Print / save as PDF':'打印 / 存为 PDF'} /></div>
      <section className="project-reference-strip">
        <div><span>{eo?'Komenca momentbildo':en?'Starting snapshot':'起始快照'}</span><code>ARCHIVE-SNAPSHOT · {a.snapshot_date}</code></div>
        <div><span>{eo?'Fina momentbildo':en?'Ending snapshot':'结束快照'}</span><code>ARCHIVE-SNAPSHOT · {b.snapshot_date}</code></div>
        <div><span>{eo?'Raporta referenco':en?'Report reference':'报告引用号'}</span><code>{reportRef}</code></div>
      </section>
      <section className="card">
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
      </section>

      <section className="card">
        <div className="record-top"><div><span className="eyebrow">{eo?'KLASIFIKA RESUMO':en?'CATEGORY SUMMARY':'分类统计'}</span><h2>{eo?'Distribuo de novaj publikaj registroj':en?'Distribution of new public records':'新增公共记录分类分布'}</h2></div><strong>{changes.length}</strong></div>
        <div className="project-summary-grid">
          {categoryStats.map(stat=><div key={stat.type}><span>{typeLabels[stat.type]||stat.type}</span><strong>{stat.count}</strong><small>{stat.percent.toFixed(1)}%</small></div>)}
        </div>
        <p className="muted">{eo?'La procentoj uzas la nombron de ĉiuj novaj publikaj fontregistroj en la elektita periodo kiel denominatoron.':en?'Percentages use all new public source records in the selected period as the denominator.':'比例以所选期间全部新增公共源记录为分母计算。'}</p>
      </section>

      <section className="card">
        <div className="record-top"><div><span className="eyebrow">{eo?'ŜANĜDETALOJ':en?'CHANGE DETAILS':'变化明细'}</span><h2>{eo?'Novaj publikaj registroj en la periodo':en?'New public records in the period':'期间新增的公共治理记录'}</h2></div><strong>{changes.length}</strong></div>
        <p className="muted">{eo?'La periodo komenciĝas post la komenca momentbilda dato kaj inkluzivas la finan momentbildan daton.':en?'The period starts after the starting snapshot date and includes the ending snapshot date.':'统计区间从起始快照日期之后开始，并包含结束快照日期当天。'}</p>
        {changes.length?<div className="record-list">{changes.map(item=>{
          const idShort=short(item.id);
          const proposalShort=item.proposal_short_code||(item.proposal_id?short(item.proposal_id):null);
          const href=item.record_type==='proposal'&&item.proposal_id?'/dad/proposals/'+item.proposal_id:
            item.record_type==='decision'&&item.proposal_id?'/dad/proposals/'+item.proposal_id+'#decision-'+idShort:
            item.record_type==='project'&&item.project_id?'/projects/'+item.project_id:
            item.record_type==='milestone'&&item.project_id?'/projects/'+item.project_id+'#milestone-'+idShort:null;
          const ref=item.record_type==='proposal'?'PROPOSAL · '+(proposalShort||idShort):
            item.record_type==='decision'?'DECISION · '+idShort:
            item.record_type==='project'?'PROJECT · '+idShort:'MILESTONE · '+idShort;
          return <article className="project-subrecord" key={item.record_type+'-'+item.id}>
            <div className="record-top"><div><small>{typeLabels[item.record_type]||item.record_type}</small><h3>{item.title}</h3></div><span>{new Date(item.occurred_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</span></div>
            <p className="subrecord-ref"><code>{ref}</code></p>
            {href&&<p><Link href={href}>{eo?'Malfermi fontan dosieron →':en?'Open source dossier →':'打开来源档案 →'}</Link></p>}
          </article>;
        })}</div>:<p>{eo?'Neniu nova publika fontregistro estis trovita en ĉi tiu datintervalo.':en?'No new public source records were found in this date window.':'该日期区间内没有找到新增的公共源记录。'}</p>}
      </section>
    </>:<section className="card"><p>{eo?'Por kompari necesas almenaŭ du arkivaj momentbildoj.':en?'At least two archive snapshots are required for comparison.':'至少需要两份归档快照才能比较。'}</p></section>}

    <section className="card">
      <h2>{eo?'Interpreta limo':en?'Interpretation boundary':'解释边界'}</h2>
      <p>{eo?'Pozitiva aŭ negativa diferenco estas nur nombra ŝanĝo inter du datoj. La detaloj listigas publikajn fontregistrojn kreitajn aŭ kompletigitajn en la datintervalo; ili ne rekonstruas forigitajn aŭ private ŝanĝitajn datumojn kaj ne estas aŭtomata takso de sukceso, kvalito aŭ regada valoro.':en?'A positive or negative difference is only a numerical change between two dates. The detail list shows public source records created or completed in the date window; it does not reconstruct deleted or privately changed data and is not an automatic judgment of success, quality, or governance value.':'正数或负数只表示两个日期之间的数量变化。明细列出该日期区间内新建立或新完成的公共源记录；它不会重建已删除或私下修改的数据，也不自动代表成功、质量或治理价值。'}</p>
    </section>

    {a&&b&&<footer className="proposal-print-footer"><strong>{eo?'Arkiva noto':en?'Archive note':'归档说明'}</strong><p>{eo?'Ĉi tiu presaĵo aŭ PDF estas nurlegebla raporto derivita el du konservitaj ARCHIVE-SNAPSHOT-registroj. Ĝi resumas publikajn nombrojn kaj fontligojn sed ne anstataŭas la originajn regadajn dosierojn.':en?'This printout or PDF is a read-only report derived from two preserved ARCHIVE-SNAPSHOT records. It summarizes public counts and source links but does not replace the original governance dossiers.':'本打印件或 PDF 是由两份已保存 ARCHIVE-SNAPSHOT 记录生成的只读报告。它汇总公共数量与来源链接，但不能替代原始治理档案。'}</p></footer>}

    <div className="hero-actions no-print">
      <Link className="button button-primary" href="/dad/archive/snapshots">{eo?'Reveni al momentbildoj':en?'Back to snapshots':'返回快照历史'}</Link>
      <Link className="button button-secondary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link>
    </div>
  </main>;
}