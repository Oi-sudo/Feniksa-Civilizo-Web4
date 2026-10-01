import Link from 'next/link';
import { hasAnyRole,requireAnyRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { getMuseumEvidenceOverview,listAdminCatalogVolumes,listAdminMuseumAssets,listMuseumHalls,listMuseumReviewQueue,type MuseumEvidenceFilter } from '@/lib/museum/data';
import MuseumReviewActions from '@/components/museum/MuseumReviewActions';

const workflowZh:Record<string,string>={draft:'草稿',review:'待整理',published:'已发布',archived:'已归档'};
const workflowEo:Record<string,string>={draft:'Malneto',review:'Por ordigo',published:'Publikigita',archived:'Arkivita'};
const workflowEn:Record<string,string>={draft:'Draft',review:'To organize',published:'Published',archived:'Archived'};
const publicZh:Record<string,string>={draft:'未公开',published:'公开',hidden:'隐藏'};
const publicEo:Record<string,string>={draft:'Ne publika',published:'Publika',hidden:'Kaŝita'};
const publicEn:Record<string,string>={draft:'Not public',published:'Public',hidden:'Hidden'};
const ownershipZh:Record<string,string>={private:'私人所有',public_institution:'公共机构所有',dad_legal_entity:'DAD/法人所有',long_term_loan:'长期借展',temporary_loan:'临时借展',digital_display_license:'数字展示授权',donation_in_process:'捐赠办理中',permanent_donation:'永久捐赠',ownership_pending:'权属待确认'};
const ownershipEo:Record<string,string>={private:'Privata posedo',public_institution:'Posedo de publika institucio',dad_legal_entity:'Posedo de DAD / jura persono',long_term_loan:'Longtempa ekspozicia prunto',temporary_loan:'Provizora ekspozicia prunto',digital_display_license:'Permeso por cifereca montrado',donation_in_process:'Donaco prilaborata',permanent_donation:'Konstanta donaco',ownership_pending:'Posedrajto atendanta konfirmon'};
const ownershipEn:Record<string,string>={private:'Private ownership',public_institution:'Public institution ownership',dad_legal_entity:'DAD / legal-entity ownership',long_term_loan:'Long-term exhibition loan',temporary_loan:'Temporary exhibition loan',digital_display_license:'Digital display license',donation_in_process:'Donation in process',permanent_donation:'Permanent donation',ownership_pending:'Ownership pending confirmation'};
const valuationZh:Record<string,string>={not_valued:'未估值',holder_aspiration:'持有人愿景值',market_reference:'市场参考',expert_opinion:'专家估值意见',auction_reference:'拍卖参考',formal_report:'正式估值报告'};
const valuationEo:Record<string,string>={not_valued:'Ne taksita',holder_aspiration:'Aspira takso de la posedanto',market_reference:'Merkata referenco',expert_opinion:'Faka taksa opinio',auction_reference:'Aŭkcia referenco',formal_report:'Formala taksa raporto'};
const valuationEn:Record<string,string>={not_valued:'Not valued',holder_aspiration:'Holder aspiration value',market_reference:'Market reference',expert_opinion:'Expert valuation opinion',auction_reference:'Auction reference',formal_report:'Formal valuation report'};
const rightsZh:Record<string,string>={pending:'授权待确认',authorized_noncommercial:'已授权非商业数字展示',authorized_commercial:'已授权商业数字展示',restricted:'受限',expired:'已失效'};
const rightsEo:Record<string,string>={pending:'Permeso atendanta konfirmon',authorized_noncommercial:'Ne-komerca cifereca montrado rajtigita',authorized_commercial:'Komerca cifereca montrado rajtigita',restricted:'Limigita',expired:'Eksvalidiĝinta'};
const rightsEn:Record<string,string>={pending:'Authorization pending',authorized_noncommercial:'Non-commercial digital display authorized',authorized_commercial:'Commercial digital display authorized',restricted:'Restricted',expired:'Expired'};

export default async function MuseumReviewPage({searchParams}:{searchParams:Promise<{evidence?:string;volume?:string;hall?:string}>}){
 const user=await requireAnyRole(['admin','curator','museum_reviewer']); const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
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
  <span className="badge">Museum · Review</span><h1>{eo?'Ordigo de muzeaj materialoj':en?'Museum material organization':'馆藏资料整理'}</h1>
  <p className="lead">{eo?'Ĉi tiu paĝo servas al ordigo de personaj kolektaĵoj, kultura memoro kaj cifereca ĝuado. La interna laborfluo servas al arkivado; ĝi ne signifas postulon pri profesia aŭtentigo.':en?'This page organizes personal collections, cultural memory and digital appreciation materials. The internal workflow serves archiving and does not imply a requirement for professional authentication.':'本页用于整理个人收藏、文化记忆与数字赏玩资料。内部资料流程只服务于归档，不代表必须进行专业鉴定。'}</p>

  <section className="home-section">
   <h2>{eo?'Superrigardo de materiala ordigo':en?'Material organization overview':'资料整理总览'}</h2>
   <div className="stats-grid">
    <article className="card"><span className="eyebrow">{eo?'Kolektaj dosieroj':en?'Collection records':'馆藏档案'}</span><strong className="stat-number">{overview.asset_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Materialaj aldonaĵoj':en?'Material attachments':'资料附件'}</span><strong className="stat-number">{overview.evidence_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Por ordigo':en?'To organize':'待整理'}</span><strong className="stat-number">{overview.unverified_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Fonto ordigita':en?'Source organized':'来源已整理'}</span><strong className="stat-number">{overview.source_confirmed_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Materialo ordigita':en?'Material organized':'资料已整理'}</span><strong className="stat-number">{overview.reviewed_count}</strong></article>
    <article className="card"><span className="eyebrow">{eo?'Kolektaĵoj kun pliaj materialoj aldoneblaj':en?'Collections that can receive more materials':'尚可补充资料的馆藏'}</span><strong className="stat-number">{overview.assets_without_evidence}</strong></article>
   </div>
   <p className="muted">{eo?`La kvanto de materialoj montras nur la nunan riĉecon de la cifereca dosiero, ne aŭtentikecon, valoron aŭ gravecon. Ankoraŭ eblas plu kompletigi materialojn por ${overview.assets_only_unverified} kolektaĵoj.`:en?`The amount of material shows only the current richness of the digital record, not authenticity, value or importance. Materials can still be added for ${overview.assets_only_unverified} collections.`:`资料多少只表示当前数字档案的丰富程度，不表示藏品真伪、价值或重要性。目前仍可继续整理附件的馆藏：${overview.assets_only_unverified} 件。`}</p>
  </section>

  <section className="home-section">
   <h2>{eo?'Kolektaĵoj por ordigo':en?'Collections to organize':'待整理馆藏'}</h2>
   {rows.length?<div className="record-list">{rows.map(a=><article className="card" key={a.id}>
    <span className="eyebrow">{a.catalog_code||a.permanent_code} · {eo?(a.hall_eo||a.hall_zh||'Ĉefa halo ankoraŭ ne fiksita'):en?(a.hall_eo||a.hall_zh||'Primary hall not yet set'):(a.hall_zh||'主馆籍待定')}</span>
    <h3>{eo?(a.title_eo||a.title_zh):en?(a.title_eo||a.title_zh):a.title_zh}</h3>{locale==='zh'&&<p>{a.title_eo}</p>}
    <p>{eo?'Kolekta registro':en?'Collection record':'收藏记录'}：{a.authentication_level} · {eo?'Posedrajto':en?'Ownership':'权属'}：{(eo?ownershipEo:en?ownershipEn:ownershipZh)[a.ownership_status]||a.ownership_status} · {eo?'Taksado':en?'Valuation':'估值'}：{(eo?valuationEo:en?valuationEn:valuationZh)[a.valuation_status]||a.valuation_status} · {eo?'Ciferecaj rajtoj':en?'Digital rights':'数字权利'}：{(eo?rightsEo:en?rightsEn:rightsZh)[a.digital_rights_status]||a.digital_rights_status}</p>
    <div className="hero-actions">
      <Link className="button button-secondary" href={`/admin/museum/${a.permanent_code}/evidence`}>{eo?'Ordigi materialojn':en?'Organize materials':'整理资料'}</Link>
      <MuseumReviewActions id={a.id} canPublish={hasAnyRole(user,['admin','museum_reviewer'])&&a.submitted_for_review_by!==user.id} publishNote={a.submitted_for_review_by===user.id?(eo?'Ĉi tiu kolektaĵo estis sendita de vi; bonvolu lasi alian administranton aŭ muzean kontrolanton konfirmi la publikigon.':en?'You submitted this collection item; another administrator or museum reviewer must confirm publication.':'这是您提交的馆藏，请由另一位管理员或馆藏审核员确认公开。'):!hasAnyRole(user,['admin','museum_reviewer'])?(eo?'Vi povas ordigi materialojn; publikan montradon konfirmas administranto aŭ muzea kontrolanto.':en?'You may organize materials; public display is confirmed by an administrator or museum reviewer.':'您可以整理资料；公开展示由管理员或馆藏审核员确认。'):undefined} locale={locale}/>
    </div>
   </article>)}</div>:<section className="card"><p>{eo?'Nuntempe ne estas kolektaĵoj atendantaj ordigon.':en?'There are currently no collections awaiting organization.':'目前没有等待整理的馆藏。'}</p></section>}
  </section>

  <section className="home-section">
   <h2>{eo?'Ĉiuj kolektaj dosieroj · materiala enirejo':en?'All collection records · material entry':'全部馆藏档案 · 资料入口'}</h2>
   <p className="muted">{eo?'Ĉi tie troviĝas la jam publikigitaj komencaj katalogoj, la unua volumo de la dua aro, la tria volumo kaj poste registritaj dosieroj. Oni povas rekte eniri unu dosieron por aldoni bildojn, filmetojn, atestilojn, ekrankopiojn pri disvastiga historio aŭ esplorajn referencojn.':en?'This includes the published initial catalogs, the first volume of the second batch, the third volume and later registered records. Open any record directly to add images, videos, certificates, publication-history screenshots or research references.':'这里包括已经公开的初编、第二批第一册、第三册及后续新登记档案。可直接进入某件档案补充图片、视频、证书、传播史截图或研究参考。'}</p>
   <h3>{eo?'Materiala stato':en?'Material status':'资料状态'}</h3>
   <nav className="filter-bar" aria-label={eo?'Filtri materialojn':en?'Filter materials':'资料筛选'}>
    <Link className={`filter-chip ${evidenceFilter==='all'?'active':''}`} href={q({evidence:'all'})}>{eo?'Ĉiuj':en?'All':'全部'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='missing'?'active':''}`} href={q({evidence:'missing'})}>{eo?'Materialoj aldoneblaj':en?'Materials can be added':'资料可续补'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='unverified'?'active':''}`} href={q({evidence:'unverified'})}>{eo?'Fontmaterialoj ordigataj':en?'Source materials being organized':'来源资料整理中'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='source_confirmed'?'active':''}`} href={q({evidence:'source_confirmed'})}>{eo?'Fonto ordigita':en?'Source organized':'来源已整理'}</Link>
    <Link className={`filter-chip ${evidenceFilter==='reviewed'?'active':''}`} href={q({evidence:'reviewed'})}>{eo?'Materialo ordigita':en?'Material organized':'资料已整理'}</Link>
   </nav>
   <h3>{eo?'Volumo':en?'Volume':'分册'}</h3>
   <nav className="filter-bar" aria-label={eo?'Filtri laŭ volumo':en?'Filter by volume':'分册筛选'}>
    <Link className={`filter-chip ${!volumeFilter?'active':''}`} href={q({volume:''})}>{eo?'Ĉiuj volumoj':en?'All volumes':'全部分册'}</Link>
    {volumes.map(v=><Link key={v.catalog_volume} className={`filter-chip ${volumeFilter===v.catalog_volume?'active':''}`} href={q({volume:v.catalog_volume})}>{v.catalog_volume} · {v.asset_count}</Link>)}
   </nav>
   <h3>{eo?'Naŭ-hala aparteno':en?'Nine-hall assignment':'九宫馆籍'}</h3>
   <nav className="filter-bar" aria-label={eo?'Filtri laŭ halo':en?'Filter by hall':'馆籍筛选'}>
    <Link className={`filter-chip ${!hallFilter?'active':''}`} href={q({hall:''})}>{eo?'Ĉiuj haloj':en?'All halls':'全部馆籍'}</Link>
    {halls.map(h=><Link key={h.code} className={`filter-chip ${hallFilter===h.code?'active':''}`} href={q({hall:h.code})}>{eo?(h.title_eo||h.title_zh):en?(h.title_eo||h.title_zh):h.title_zh}</Link>)}
   </nav>
   <p className="muted">{eo?`Nunaj kombinitaj filtriloj: materialo ${evidenceFilter==='all'?'ĉiuj':evidenceFilter==='missing'?'aldonebla':evidenceFilter==='unverified'?'ordigata':evidenceFilter==='source_confirmed'?'fonto ordigita':'ordigita'}; volumo ${volumeFilter||'ĉiuj'}; halo ${halls.find(h=>h.code===hallFilter)?.title_eo||halls.find(h=>h.code===hallFilter)?.title_zh||'ĉiuj'}. La listo estas ordigita laŭ materiala progreso por faciligi paŝan kompletigon de la ciferecaj dosieroj.`:en?`Current filters: material ${evidenceFilter==='all'?'all':evidenceFilter==='missing'?'addable':evidenceFilter==='unverified'?'being organized':evidenceFilter==='source_confirmed'?'source organized':'organized'}; volume ${volumeFilter||'all'}; hall ${halls.find(h=>h.code===hallFilter)?.title_eo||halls.find(h=>h.code===hallFilter)?.title_zh||'all'}. The list is ordered by material progress to support step-by-step completion of digital records.`:`当前组合筛选：资料 ${evidenceFilter==='all'?'全部':evidenceFilter==='missing'?'可续补':evidenceFilter==='unverified'?'整理中':evidenceFilter==='source_confirmed'?'来源已整理':'已整理'}；分册 ${volumeFilter||'全部'}；馆籍 ${halls.find(h=>h.code===hallFilter)?.title_zh||'全部'}。列表按资料整理进度排列，方便逐步完善数字档案。`}</p>
   <div className="hero-actions">
    <Link className="button button-primary" href={q({}).replace('/admin/museum','/admin/museum/worklist')}>{eo?'Krei laborliston':en?'Create worklist':'生成工作清单'}</Link>
    <a className="button button-secondary" href={q({}).replace('/admin/museum','/api/museum/worklist.csv')}>{eo?'Eksporti CSV':en?'Export CSV':'导出 CSV'}</a>
    {(evidenceFilter!=='all'||volumeFilter||hallFilter)&&<Link className="button button-secondary" href="/admin/museum">{eo?'Forigi ĉiujn filtrilojn':en?'Clear all filters':'清除全部筛选'}</Link>}
   </div>

   {assets.length?<div className="record-list">{assets.map(a=><article className="card museum-admin-row" key={a.id}>
    <div>
      <span className="eyebrow">{a.catalog_code||a.permanent_code} · {a.catalog_volume||(eo?'Aparta registro':en?'Separate record':'独立登记')}</span>
      <h3>{eo?(a.title_eo||a.title_zh):en?(a.title_eo||a.title_zh):a.title_zh}</h3>
      <p className="muted">{eo?(a.hall_eo||a.hall_zh||'Ĉefa halo ankoraŭ ne fiksita'):en?(a.hall_eo||a.hall_zh||'Primary hall not yet set'):(a.hall_zh||'主馆籍待定')} · {(eo?workflowEo:en?workflowEn:workflowZh)[a.workflow_status]||a.workflow_status} · {(eo?publicEo:en?publicEn:publicZh)[a.public_status]||a.public_status}</p>
      <p className="evidence-counts">{eo?'Materialoj entute':en?'Total materials':'资料总数'} {a.evidence_count} · {eo?'Ordigataj':en?'Being organized':'整理中'} {a.evidence_unverified} · {eo?'Fonto ordigita':en?'Source organized':'来源已整理'} {a.evidence_source_confirmed} · {eo?'Ordigita':en?'Organized':'已整理'} {a.evidence_reviewed}</p>
      {Number(a.evidence_count)===0&&<p className="weak-evidence">{eo?'Materialoj aldoneblaj: ankoraŭ neniu aldonaĵo estas ligita.':en?'Materials can be added: no attachment is linked yet.':'资料可续补：目前尚未挂接附件。'}</p>}
      {Number(a.evidence_count)>0&&Number(a.evidence_source_confirmed)===0&&Number(a.evidence_reviewed)===0&&<p className="weak-evidence">{eo?'Fontmaterialoj estas ordigataj: la ekzistantaj aldonaĵoj ankoraŭ povas ricevi pliajn fontnotojn.':en?'Source materials are being organized: existing attachments can still receive additional source notes.':'来源资料整理中：现有附件仍可继续补充来源说明。'}</p>}
    </div>
    <div className="hero-actions">
      <Link className="button button-primary" href={`/admin/museum/${a.permanent_code}/evidence`}>{eo?'Ordigi materialojn':en?'Organize materials':'整理资料'}</Link>
      {a.public_status==='published'&&<Link className="button button-secondary" href={`/museum/${a.permanent_code}`}>{eo?'Vidi publikan paĝon':en?'View public page':'查看公开页'}</Link>}
    </div>
   </article>)}</div>:<div className="card"><p>{eo?'Ankoraŭ ne estas kolektaj dosieroj.':en?'There are no collection records yet.':'尚无馆藏档案。'}</p></div>}
  </section>

  <div className="hero-actions"><Link className="button button-secondary" href="/admin">{eo?'Reveni al administra panelo':en?'Back to admin dashboard':'返回管理员 Dashboard'}</Link><Link className="button button-secondary" href="/museum">{eo?'Eniri la Ciferecan Muzeon':en?'Enter the Digital Museum':'进入数字博物馆'}</Link></div>
 </main>;
}
