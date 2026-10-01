import Link from 'next/link';
import { requireAnyRole } from '@/lib/permissions/rbac';
import { getMuseumEvidenceOverview,listAdminCatalogVolumes,listAdminMuseumAssets,listMuseumHalls,listMuseumReviewQueue,type MuseumEvidenceFilter } from '@/lib/museum/data';
import MuseumReviewActions from '@/components/museum/MuseumReviewActions';

export default async function MuseumReviewPage({searchParams}:{searchParams:Promise<{evidence?:string;volume?:string;hall?:string}>}){
 await requireAnyRole(['admin','curator','museum_reviewer']);
 const p=await searchParams;
 const allowed=new Set<MuseumEvidenceFilter>(['all','missing','unverified','source_confirmed','reviewed']);
 const evidenceFilter=allowed.has((p.evidence||'all') as MuseumEvidenceFilter)?(p.evidence||'all') as MuseumEvidenceFilter:'all';
 const volumeFilter=(p.volume||'').trim()||null;
 const hallFilter=(p.hall||'').trim()||null;
 const [rows,assets,overview,volumes,halls]=await Promise.all([
  listMuseumReviewQueue(),listAdminMuseumAssets(200,evidenceFilter,volumeFilter,hallFilter),getMuseumEvidenceOverview(),listAdminCatalogVolumes(),listMuseumHalls()
 ]);
 const q=(next:{evidence?:string;volume?:string;hall?:string})=>{
  const s=new URLSearchParams();
  const evidence=next.evidence??evidenceFilter, volume=next.volume===undefined?(volumeFilter||''):next.volume, hall=next.hall===undefined?(hallFilter||''):next.hall;
  if(evidence&&evidence!=='all')s.set('evidence',evidence);
  if(volume)s.set('volume',volume);
  if(hall)s.set('hall',hall);
  const qs=s.toString(); return qs?`/admin/museum?${qs}`:'/admin/museum';
 };
 return <main>
  <span className="badge">Museum · Review</span><h1>馆藏资料整理</h1>
  <p className="lead">本页用于整理个人收藏、文化记忆与数字赏玩资料。内部资料流程只服务于归档，不代表必须进行专业鉴定。</p>

  <section className="home-section">
   <h2>资料整理总览</h2>
   <div className="stats-grid">
    <article className="card"><span className="eyebrow">馆藏档案</span><strong className="stat-number">{overview.asset_count}</strong></article>
    <article className="card"><span className="eyebrow">资料附件</span><strong className="stat-number">{overview.evidence_count}</strong></article>
    <article className="card"><span className="eyebrow">待整理</span><strong className="stat-number">{overview.unverified_count}</strong></article>
    <article className="card"><span className="eyebrow">来源已整理</span><strong className="stat-number">{overview.source_confirmed_count}</strong></article>
    <article className="card"><span className="eyebrow">资料已整理</span><strong className="stat-number">{overview.reviewed_count}</strong></article>
    <article className="card"><span className="eyebrow">尚可补充资料的馆藏</span><strong className="stat-number">{overview.assets_without_evidence}</strong></article>
   </div>
   <p className="muted">资料多少只表示当前数字档案的丰富程度，不表示藏品真伪、价值或重要性。目前仍可继续整理附件的馆藏：{overview.assets_only_unverified} 件。</p>
  </section>

  <section className="home-section">
   <h2>待整理馆藏</h2>
   {rows.length?<div className="record-list">{rows.map(a=><article className="card" key={a.id}>
    <span className="eyebrow">{a.catalog_code||a.permanent_code} · {a.hall_zh||'主馆籍待定'}</span>
    <h3>{a.title_zh}</h3><p>{a.title_eo}</p>
    <p>收藏记录：{a.authentication_level} · 权属：{a.ownership_status} · 估值：{a.valuation_status} · 数字权利：{a.digital_rights_status}</p>
    <div className="hero-actions">
      <Link className="button button-secondary" href={`/admin/museum/${a.permanent_code}/evidence`}>整理资料</Link>
      <MuseumReviewActions id={a.id}/>
    </div>
   </article>)}</div>:<section className="card"><p>目前没有等待审核的馆藏。</p></section>}
  </section>

  <section className="home-section">
   <h2>全部馆藏档案 · 资料入口</h2>
   <p className="muted">这里包括已经公开的初编、第二批第一册、第三册及后续新登记档案。可直接进入某件档案补充图片、视频、证书、传播史截图或研究参考。</p>
   <h3>资料状态</h3>
   <nav className="filter-bar" aria-label="资料筛选">
    <Link className={`filter-chip ${evidenceFilter==='all'?'active':''}`} href={q({evidence:'all'})}>全部</Link>
    <Link className={`filter-chip ${evidenceFilter==='missing'?'active':''}`} href={q({evidence:'missing'})}>资料可续补</Link>
    <Link className={`filter-chip ${evidenceFilter==='unverified'?'active':''}`} href={q({evidence:'unverified'})}>来源资料整理中</Link>
    <Link className={`filter-chip ${evidenceFilter==='source_confirmed'?'active':''}`} href={q({evidence:'source_confirmed'})}>来源已整理</Link>
    <Link className={`filter-chip ${evidenceFilter==='reviewed'?'active':''}`} href={q({evidence:'reviewed'})}>资料已整理</Link>
   </nav>
   <h3>分册</h3>
   <nav className="filter-bar" aria-label="分册筛选">
    <Link className={`filter-chip ${!volumeFilter?'active':''}`} href={q({volume:''})}>全部分册</Link>
    {volumes.map(v=><Link key={v.catalog_volume} className={`filter-chip ${volumeFilter===v.catalog_volume?'active':''}`} href={q({volume:v.catalog_volume})}>{v.catalog_volume} · {v.asset_count}</Link>)}
   </nav>
   <h3>九宫馆籍</h3>
   <nav className="filter-bar" aria-label="馆籍筛选">
    <Link className={`filter-chip ${!hallFilter?'active':''}`} href={q({hall:''})}>全部馆籍</Link>
    {halls.map(h=><Link key={h.code} className={`filter-chip ${hallFilter===h.code?'active':''}`} href={q({hall:h.code})}>{h.title_zh}</Link>)}
   </nav>
   <p className="muted">当前组合筛选：资料 {evidenceFilter==='all'?'全部':evidenceFilter==='missing'?'可续补':evidenceFilter==='unverified'?'整理中':evidenceFilter==='source_confirmed'?'来源已整理':'已整理'}；分册 {volumeFilter||'全部'}；馆籍 {halls.find(h=>h.code===hallFilter)?.title_zh||'全部'}。列表按资料整理进度排列，方便逐步完善数字档案。</p>
   <div className="hero-actions">
    <Link className="button button-primary" href={q({}).replace('/admin/museum','/admin/museum/worklist')}>生成工作清单</Link>
    <a className="button button-secondary" href={q({}).replace('/admin/museum','/api/museum/worklist.csv')}>导出 CSV</a>
    {(evidenceFilter!=='all'||volumeFilter||hallFilter)&&<Link className="button button-secondary" href="/admin/museum">清除全部筛选</Link>}
   </div>

   {assets.length?<div className="record-list">{assets.map(a=><article className="card museum-admin-row" key={a.id}>
    <div>
      <span className="eyebrow">{a.catalog_code||a.permanent_code} · {a.catalog_volume||'独立登记'}</span>
      <h3>{a.title_zh}</h3>
      <p className="muted">{a.hall_zh||'主馆籍待定'} · {a.workflow_status} · {a.public_status}</p>
      <p className="evidence-counts">资料总数 {a.evidence_count} · 整理中 {a.evidence_unverified} · 来源已整理 {a.evidence_source_confirmed} · 已整理 {a.evidence_reviewed}</p>
      {Number(a.evidence_count)===0&&<p className="weak-evidence">资料可续补：目前尚未挂接附件。</p>}
      {Number(a.evidence_count)>0&&Number(a.evidence_source_confirmed)===0&&Number(a.evidence_reviewed)===0&&<p className="weak-evidence">来源资料整理中：现有附件仍可继续补充来源说明。</p>}
    </div>
    <div className="hero-actions">
      <Link className="button button-primary" href={`/admin/museum/${a.permanent_code}/evidence`}>整理资料</Link>
      {a.public_status==='published'&&<Link className="button button-secondary" href={`/museum/${a.permanent_code}`}>查看公开页</Link>}
    </div>
   </article>)}</div>:<div className="card"><p>尚无馆藏档案。</p></div>}
  </section>

  <div className="hero-actions"><Link className="button button-secondary" href="/admin">返回管理员 Dashboard</Link><Link className="button button-secondary" href="/museum">进入数字博物馆</Link></div>
 </main>;
}
