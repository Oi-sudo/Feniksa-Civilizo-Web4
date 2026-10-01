import Link from 'next/link'; import { notFound } from 'next/navigation';
import { hasAnyRole,requireAnyRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { getMuseumAssetForEvidence,getAssetDossierAdmin,listEvidenceReviewEvents } from '@/lib/museum/data';
import EvidenceLinkForm from '@/components/museum/EvidenceLinkForm';
import EvidenceReviewActions from '@/components/museum/EvidenceReviewActions';
import EvidenceVisibilityActions from '@/components/museum/EvidenceVisibilityActions';

const evidenceZh:Record<string,string>={original:'原始收藏资料',publication_history:'传播史资料',comparison:'外部比对资料',research_reference:'研究参考'};
const evidenceEo:Record<string,string>={original:'Origina kolekta materialo',publication_history:'Materialo pri disvastiga historio',comparison:'Ekstera kompara materialo',research_reference:'Esplora referenco'};
const verifyZh:Record<string,string>={unverified:'待整理',source_confirmed:'来源已整理',reviewed:'资料已整理'};
const verifyEo:Record<string,string>={unverified:'Por ordigo',source_confirmed:'Fonto ordigita',reviewed:'Materialo ordigita'};

export default async function EvidenceAdminPage({params}:{params:Promise<{code:string}>}){
 const user=await requireAnyRole(['admin','curator','museum_reviewer']); const locale=await getLocale(); const eo=locale==='eo';
 const {code}=await params; const asset=await getMuseumAssetForEvidence(code); if(!asset)notFound();
 const [d,history]=await Promise.all([getAssetDossierAdmin(asset.id),listEvidenceReviewEvents(asset.id)]);
 return <main>
  <span className="badge">Museum Archive</span><h1>{eo?'Muzea materiala administrado':asset.title_zh}</h1>
  <p className="lead">{asset.catalog_code||asset.permanent_code} · {eo?'Administrado de kolektaj materialoj':'馆藏资料管理'}</p>
  <section className="card"><EvidenceLinkForm assetId={asset.id} locale={locale}/></section>
  <section className="home-section"><h2>{eo?'Ligitaj materialoj':'已挂接资料'}</h2>
   {d.media.length?<div className="record-list">{d.media.map(m=><article className="card" key={m.id}>
    <div className="record-top"><strong>{(eo?evidenceEo:evidenceZh)[m.evidence_role]||m.evidence_role}</strong><span>{m.visibility==='public'?(eo?'Publika montrado':'公开展示'):(eo?'Interna materialo':'内部资料')} · {(eo?verifyEo:verifyZh)[m.verification_status]||m.verification_status}</span></div>
    <p>{m.caption}</p>{m.source_note&&<p className="muted">{m.source_note}</p>}
    {m.source_confirmed_at&&<p className="muted">{eo?'Fonto ordigita':'来源整理'}：{m.source_confirmed_by_name||(eo?'muzea kunlaboranto':'馆藏人员')} · {new Date(m.source_confirmed_at).toLocaleDateString(eo?'eo':'zh-CN')}</p>}
    {m.reviewed_at&&<p className="muted">{eo?'Materialo ordigita':'资料整理'}：{m.reviewed_by_name||(eo?'kontrolanto':'审核人员')} · {new Date(m.reviewed_at).toLocaleDateString(eo?'eo':'zh-CN')}</p>}
    <div className="hero-actions"><a className="button button-secondary" href={m.file_url} target="_blank" rel="noreferrer">{eo?'Malfermi materialon →':'打开资料 →'}</a><EvidenceReviewActions mediaId={m.id} status={m.verification_status} locale={locale}/><EvidenceVisibilityActions mediaId={m.id} visibility={m.visibility} canPublish={hasAnyRole(user,['admin','museum_reviewer'])&&asset.submitted_for_review_by!==user.id&&asset.workflow_status==='published'&&asset.public_status==='published'&&m.verification_status==='reviewed'} publishNote={asset.submitted_for_review_by===user.id?(eo?'Ĉi tiu kolekta materialo estis sendita de vi; bonvolu lasi alian administranton aŭ muzean kontrolanton konfirmi la publikan montradon.':'这是您提交的馆藏资料，请由另一位管理员或馆藏审核员确认公开。'):!hasAnyRole(user,['admin','museum_reviewer'])?(eo?'Vi povas ordigi materialojn; publikan montradon konfirmas administranto aŭ muzea kontrolanto.':'您可以整理资料；公开展示由管理员或馆藏审核员确认。'):asset.workflow_status!=='published'||asset.public_status!=='published'?(eo?'Unue publikigu la ĉefan kolektan dosieron, poste la bildojn, filmetojn aŭ aliajn materialojn.':'请先将馆藏档案整理并公开，再公开其中的图片、视频或其他资料。'):m.verification_status!=='reviewed'?(eo?'Unue kompletigu la ordigon de ĉi tiu kolekta materialo, poste publikigu ĝin.':'请先完成这份收藏资料的整理，再公开展示。'):undefined} locale={locale}/></div>
   </article>)}</div>:<div className="card"><p>{eo?'Ankoraŭ neniu aldonaĵo estas ligita.':'尚未挂接附件。'}</p></div>}
  </section>
  <section className="home-section"><h2>{eo?'Tempolinio de materiala ordigo':'资料整理时间线'}</h2>
   {history.length?<div className="timeline">{history.map(e=><article className="timeline-item" key={e.id}>
    <div className="timeline-dot" aria-hidden="true"></div>
    <div className="timeline-body">
      <div className="record-top"><strong>{e.caption||e.media_type}</strong><span>{new Date(e.created_at).toLocaleString(eo?'eo':'zh-CN')}</span></div>
      <p><strong>{e.from_status?((eo?verifyEo:verifyZh)[e.from_status]||e.from_status):(eo?'Ne registrita':'未记录')}</strong> → <strong>{(eo?verifyEo:verifyZh)[e.to_status]||e.to_status}</strong></p>
      <p className="muted">{e.actor_name||(eo?'Sistemo / sen nomo':'系统/未署名')}{e.note ? ' · '+e.note : ''}</p>
    </div>
   </article>)}</div>:<div className="card"><p>{eo?'Ankoraŭ ne estas registro pri ŝanĝo de materiala stato.':'还没有资料整理状态变更记录。'}</p></div>}
   <p className="muted">{eo?'Ĉi tie estas registrata la ordiga procezo de kolektaj materialoj. La muzeo celas personajn kolektaĵojn, kulturan memoron kaj ciferecan ĝuadon; profesia aŭtentigo ne estas antaŭkondiĉo por publika montrado.':'这里记录的是馆藏资料的整理过程；本馆以个人收藏、文化记忆与数字赏玩为定位，不要求以专业鉴定作为公开展示前提。'}</p>
  </section>
  <div className="hero-actions"><Link className="button button-secondary" href={`/museum/${asset.permanent_code}`}>{eo?'Vidi publikan dosieron':'查看公开档案'}</Link><Link className="button button-secondary" href="/admin/museum">{eo?'Reveni al kolektaj materialoj':'返回馆藏资料'}</Link></div>
 </main>;
}
