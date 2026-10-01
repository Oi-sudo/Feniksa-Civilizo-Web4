import Link from 'next/link'; import { notFound } from 'next/navigation';
import { requireAnyRole } from '@/lib/permissions/rbac';
import { getMuseumAssetForEvidence,getAssetDossier,listEvidenceReviewEvents } from '@/lib/museum/data';
import EvidenceLinkForm from '@/components/museum/EvidenceLinkForm';
import EvidenceReviewActions from '@/components/museum/EvidenceReviewActions';

export default async function EvidenceAdminPage({params}:{params:Promise<{code:string}>}){
 await requireAnyRole(['admin','curator','museum_reviewer']);
 const {code}=await params; const asset=await getMuseumAssetForEvidence(code); if(!asset)notFound();
 const [d,history]=await Promise.all([getAssetDossier(asset.id),listEvidenceReviewEvents(asset.id)]);
 return <main>
  <span className="badge">Museum Evidence</span><h1>{asset.title_zh}</h1>
  <p className="lead">{asset.catalog_code||asset.permanent_code} · 证据附件管理</p>
  <section className="card"><EvidenceLinkForm assetId={asset.id}/></section>
  <section className="home-section"><h2>已挂接资料</h2>
   {d.media.length?<div className="record-list">{d.media.map(m=><article className="card" key={m.id}>
    <div className="record-top"><strong>{m.evidence_role}</strong><span>{m.verification_status}</span></div>
    <p>{m.caption}</p>{m.source_note&&<p className="muted">{m.source_note}</p>}
    {m.source_confirmed_at&&<p className="muted">来源确认：{m.source_confirmed_by_name||'馆藏人员'} · {new Date(m.source_confirmed_at).toLocaleDateString('zh-CN')}</p>}
    {m.reviewed_at&&<p className="muted">档案审阅：{m.reviewed_by_name||'审核人员'} · {new Date(m.reviewed_at).toLocaleDateString('zh-CN')}</p>}
    <div className="hero-actions"><a className="button button-secondary" href={m.file_url} target="_blank" rel="noreferrer">打开资料 →</a><EvidenceReviewActions mediaId={m.id} status={m.verification_status}/></div>
   </article>)}</div>:<div className="card"><p>尚未挂接附件。</p></div>}
  </section>
  <section className="home-section"><h2>证据审核时间线</h2>
   {history.length?<div className="timeline">{history.map(e=><article className="timeline-item" key={e.id}>
    <div className="timeline-dot" aria-hidden="true"></div>
    <div className="timeline-body">
      <div className="record-top"><strong>{e.caption||e.media_type}</strong><span>{new Date(e.created_at).toLocaleString('zh-CN')}</span></div>
      <p><strong>{e.from_status||'未记录'}</strong> → <strong>{e.to_status}</strong></p>
      <p className="muted">{e.actor_name||'系统/未署名'}{e.note ? ' · '+e.note : ''}</p>
    </div>
   </article>)}</div>:<div className="card"><p>还没有证据审核状态变更记录。</p></div>}
   <p className="muted">这里记录的是证据附件的档案流程，不代表藏品真伪、年代、材质或来源已经完成专业鉴定。</p>
  </section>
  <div className="hero-actions"><Link className="button button-secondary" href={`/museum/${asset.permanent_code}`}>查看公开档案</Link><Link className="button button-secondary" href="/admin/museum">返回馆藏审核</Link></div>
 </main>;
}
