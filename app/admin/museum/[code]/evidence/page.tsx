import Link from 'next/link'; import { notFound } from 'next/navigation';
import { requireAnyRole } from '@/lib/permissions/rbac';
import { getMuseumAssetForEvidence,getAssetDossier } from '@/lib/museum/data';
import EvidenceLinkForm from '@/components/museum/EvidenceLinkForm';
import EvidenceReviewActions from '@/components/museum/EvidenceReviewActions';

export default async function EvidenceAdminPage({params}:{params:Promise<{code:string}>}){
 await requireAnyRole(['admin','curator','museum_reviewer']);
 const {code}=await params; const asset=await getMuseumAssetForEvidence(code); if(!asset)notFound();
 const d=await getAssetDossier(asset.id);
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
  <div className="hero-actions"><Link className="button button-secondary" href={`/museum/${asset.permanent_code}`}>查看公开档案</Link><Link className="button button-secondary" href="/admin/museum">返回馆藏审核</Link></div>
 </main>;
}
