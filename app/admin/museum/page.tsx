import Link from 'next/link';
import { hasAnyRole,requireAnyRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { getMuseumEvidenceOverview,listAdminCatalogVolumes,listAdminMuseumAssets,listMuseumHalls,listMuseumReviewQueue,type MuseumEvidenceFilter } from '@/lib/museum/data';
import MuseumReviewActions from '@/components/museum/MuseumReviewActions';

export default async function MuseumReviewPage({searchParams}:{searchParams:Promise<{evidence?:string;volume?:string;hall?:string}>}){
 const user=await requireAnyRole(['admin','curator','museum_reviewer']); const locale=await getLocale(); const eo=locale==='eo';
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
  <span className="badge">Museum · Review</span><h1>{eo?'Ordigo de muzeaj materialoj':'馆藏资料整理'}</h1>
  <p className="lead">{eo?'Ĉi tiu paĝo servas al ordigo de personaj kolektaĵoj, kultura memoro kaj cifereca ĝuado. La interna laborfluo servas al arkivado; ĝi ne signifas postulon pri profesia aŭtentigo.':'本页用于整理个人收藏、文化记忆与数字赏玩资料。内部资料流程只服务于归档，不代表必须进行专业鉴定。'}</p>

  <section className="home-section">
   <h2>{eo?'Superrigardo de materiala ordigo':'资料整理总览'}</h2>
   <div className="stats-grid">
    <article className="card"><span className="eyebrow">{eo?'Kolektaj dosieroj':'馆藏档案'}</span><strong className="stat-number">{overview.asset_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Materialaj aldonaĵoj':'资料附件'}</span><strong className="stat-number">{overview.evidence_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Por ordigo':'待整理'}</span><strong className="stat-number">{overview.unverified_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Fonto ordigita':'来源已整理'}</span><strong className="stat-number">{overview.source_confirmed_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Materialo ordigita':'资料已整理'}</span><strong className="stat-number">{overview.reviewed_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Kolektaĵoj kun pliaj materialoj aldoneblaj':'尚可补充资料的馆藏'}</span><strong className="stat-number">{overview.assets_without_evidence}</strong></article>
   </div>
   <p className="muted">{eo?`La kvanto de materialoj montras nur la nunan riĉecon de la cifereca dosiero, ne aŭtentikecon, valoron aŭ gravecon. Ankoraŭ eblas plu kompletigi materialojn por ${overview.assets_only_unverified} kolektaĵoj.`:`资料多少只表示当前数字档案的丰富程度，不表示藏品真伪、价值或重要性。目前仍可继续整理附件的馆藏：${overview.assets_only_unverified} 件。`}</p>
  </section>

  <section className="home-section">
   <h2>{eo?'Kolektaĵoj por ordigo':'待整理馆藏'}</h2>
   {rows.length?<div className="record-list">{rows.map(a=><article className="card" key={a.id}>
    <span className="eyebrow">{a.catalog_code||a.permanent_code} · {eo?(a.hall_eo||a.hall_zh||'Ĉefa halo ankoraŭ ne fiksita'):(a.hall_zh||'主馆籍待定')}</span>
    <h3>{eo?(a.title_eo||a.title_zh):a.title_zh}</h3>{!eo&&<p>{a.title_eo}</p>}
    <p>{eo?'Kolekta registro':'收藏记录'}：{a.authentication_level} · {eo?'Posedrajto':'权属'}：{a.ownership_status} · {eo?'Taksado':'估值'}：{a.valuation_status} · {eo?'Ciferecaj rajtoj':'数字权利'}：{a.digital_rights_status}</p>
    <div className="hero-actions">
      <Link className="button button-secondary" href={`/admin/museum/${a.permanent_code}/evidence`}>{eo?'Ordigi materialojn':'整理资料'}</Link>
      <MuseumReviewActions id={a.id} canPublish={hasAnyRole(user,['admin','museum_reviewer'])&&a.submitted_for_review_by!==user.id} publishNote={a.submitted_for_review_by===user.id?(eo?'Ĉi tiu kolektaĵo estis sendita de vi; bonvolu lasi alian administranton aŭ muzean kontrolanton konfirmi la publikigon.':'这是您提交的馆藏，请由另一位管理员或馆藏审核员确认公开。'):!hasAnyRole(user,['admin','museum_reviewer'])?(eo?'Vi povas ordigi materialojn; publikan montradon konfirmas administranto aŭ muzea kontrolanto.':'您可以整理资料；公开展示由管理员或馆藏审核员确认。'):undefined} locale={locale}/>
    </div>
   </article>)}</div>:<section className="card"><p>{eo?'Nuntempe ne estas kolektaĵoj atendantaj ordigon.':'目前没有等待整理的馆藏。'}</p></section>}
  </section>

  <section className="home-section">
   <h2>{eo?'Ĉiuj kolektaj dosieroj · materiala enirejo':'全部馆藏档案 · 资料入口'}</h2>
   <p className="muted">{eo?'Ĉi tie troviĝas la jam publikigitaj komencaj katalogoj, la unua volumo de la dua aro, la tria volumo kaj poste registritaj dosieroj. Oni povas rekte eniri unu dosieron por aldoni bildojn, filmetojn, atestilojn, ekrankopiojn pri disvastiga historio aŭ esplorajn referencojn.':'这里包括已经公开的初编、第二批第一册、第三册及后续新登记档案。可直接进入某件档案补充图片、视频、证书、传播史截图或研究参考。'}</p>
   <h3>{eo?'Materiala stato':'资料状态'}</h3>
   <nav className="filter-bar" aria-label={eo?'Filtri materialojn':'资料筛选'}>
    <Link className={`filter-chip ${evidenceFilter==='all'?'active':''}`} href={q({evidence:'all'})}>{eo?'Ĉiuj':'全部'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='missing'?'active':''}`} href={q({evidence:'missing'})}>{eo?'Materialoj aldoneblaj':'资料可续补'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='unverified'?'active':''}`} href={q({evidence:'unverified'})}>{eo?'Fontmaterialoj ordigataj':'来源资料整理中'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='source_confirmed'?'active':''}`} href={q({evidence:'source_confirmed'})}>{eo?'Fonto ordigita':'来源已整理'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='reviewed'?'active':''}`} href={q({evidence:'reviewed'})}>{eo?'Materialo ordigita':'资料已整理'}</Link>
   </nav>
   <h3>{eo?'Volumo':'分册'}</h3>
   <nav className="filter-bar" aria-label={eo?'Filtri laŭ volumo':'分册筛选'}>
    <Link className={`filter-chip ${!volumeFilter?'active':''}`} href={q({volume:''})}>{eo?'Ĉiuj volumoj':'全部分册'}</Link>
    {volumes.map(v=><Link key={v.catalog_volume} className={`filter-chip ${volumeFilter===v.catalog_volume?'active':''}`} href={q({volume:v.catalog_volume})}>{v.catalog_volume} · {v.asset_count}</Link>)}
   </nav>
   <h3>{eo?'Naŭ-hala aparteno':'九宫馆籍'}</h3>
   <nav className="filter-bar" aria-label={eo?'Filtri laŭ halo':'馆籍筛选'}>
    <Link className={`filter-chip ${!hallFilter?'active':''}`} href={q({hall:''})}>{eo?'Ĉiuj haloj':'全部馆籍'}</Link>
    {halls.map(h=><Link key={h.code} className={`filter-chip ${hallFilter===h.code?'active':''}`} href={q({hall:h.code})}>{eo?(h.title_eo||h.title_zh):h.title_zh}</Link>)}
   </nav>
   <p className="muted">当前组合筛选：资料 {evidenceFilter==='all'?'全部':evidenceFilter==='missing'?'可续补':evidenceFilter==='unverified'?'整理中':evidenceFilter==='source_confirmed'?'来源已整理':'已整理'}；分册 {volumeFilter||'全部'}；馆籍 {halls.find(h=>h.code===hallFilter)?.title_zh||'全部'}。列表按资料整理进度排列，方便逐步完善数字档案。</p>
   <div className="hero-actions">
    <Link className="button button-primary" href={q({}).replace('/admin/museum','/admin/museum/worklist')}>{eo?'Krei laborliston':'生成工作清单'}</Link>
    <a className="button button-secondary" href={q({}).replace('/admin/museum','/api/museum/worklist.csv')}>{eo?'Eksporti CSV':'导出 CSV'}</a>
    {(evidenceFilter!=='all'||volumeFilter||hallFilter)&&<Link className="button button-secondary" href="/admin/museum">{eo?'Forigi ĉiujn filtrilojn':'清除全部筛选'}</Link>}
   </div>

   {assets.length?<div className="record-list">{assets.map(a=><article className="card museum-admin-row" key={a.id}>
    <div>
      <span className="eyebrow">{a.catalog_code||a.permanent_code} · {a.catalog_volume||(eo?'Aparta registro':'独立登记')}</span>
      <h3>{eo?(a.title_eo||a.title_zh):a.title_zh}</h3>
      <p className="muted">{eo?(a.hall_eo||a.hall_zh||'Ĉefa halo ankoraŭ ne fiksita'):(a.hall_zh||'主馆籍待定')} · {a.workflow_status} · {a.public_status}</p>
      <p className="evidence-counts">{eo?'Materialoj entute':'资料总数'} {a.evidence_count} · {eo?'Ordigataj':'整理中'} {a.evidence_unverified} · {eo?'Fonto ordigita':'来源已整理'} {a.evidence_source_confirmed} · {eo?'Ordigita':'已整理'} {a.evidence_reviewed}</p>
      {Number(a.evidence_count)===0&&<p className="weak-evidence">{eo?'Materialoj aldoneblaj: ankoraŭ neniu aldonaĵo estas ligita.':'资料可续补：目前尚未挂接附件。'}</p>}
      {Number(a.evidence_count)>0&&Number(a.evidence_source_confirmed)===0&&Number(a.evidence_reviewed)===0&&<p className="weak-evidence">{eo?'Fontmaterialoj estas ordigataj: la ekzistantaj aldonaĵoj ankoraŭ povas ricevi pliajn fontnotojn.':'来源资料整理中：现有附件仍可继续补充来源说明。'}</p>}
    </div>
    <div className="hero-actions">
      <Link className="button button-primary" href={`/admin/museum/${a.permanent_code}/evidence`}>{eo?'Ordigi materialojn':'整理资料'}</Link>
      {a.public_status==='published'&&<Link className="button button-secondary" href={`/museum/${a.permanent_code}`}>{eo?'Vidi publikan paĝon':'查看公开页'}</Link>}
    </div>
   </article>)}</div>:<div className="card"><p>{eo?'Ankoraŭ ne estas kolektaj dosieroj.':'尚无馆藏档案。'}</p></div>}
  </section>

  <div className="hero-actions"><Link className="button button-secondary" href="/admin">{eo?'Reveni al administra panelo':'返回管理员 Dashboard'}</Link><Link className="button button-secondary" href="/museum">{eo?'Eniri la Ciferecan Muzeon':'进入数字博物馆'}</Link></div>
 </main>;
}
