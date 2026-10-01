import Link from 'next/link';
import { requireAnyRole } from '@/lib/permissions/rbac';
import { listAdminMuseumAssets,listMuseumReviewQueue } from '@/lib/museum/data';
import MuseumReviewActions from '@/components/museum/MuseumReviewActions';

export default async function MuseumReviewPage(){
 await requireAnyRole(['admin','curator','museum_reviewer']);
 const [rows,assets]=await Promise.all([listMuseumReviewQueue(),listAdminMuseumAssets()]);
 return <main>
  <span className="badge">Museum · Review</span><h1>馆藏审核与证据管理</h1>
  <p className="lead">审核档案是否达到公开登记条件；证据管理与鉴定结论分开。登记名称不会因为上传附件而自动升级为权威鉴定。</p>

  <section className="home-section">
   <h2>待审核馆藏</h2>
   {rows.length?<div className="record-list">{rows.map(a=><article className="card" key={a.id}>
    <span className="eyebrow">{a.catalog_code||a.permanent_code} · {a.hall_zh||'主馆籍待定'}</span>
    <h3>{a.title_zh}</h3><p>{a.title_eo}</p>
    <p>鉴定：{a.authentication_level} · 权属：{a.ownership_status} · 估值：{a.valuation_status} · 数字权利：{a.digital_rights_status}</p>
    <div className="hero-actions">
      <Link className="button button-secondary" href={`/admin/museum/${a.permanent_code}/evidence`}>管理证据</Link>
      <MuseumReviewActions id={a.id}/>
    </div>
   </article>)}</div>:<section className="card"><p>目前没有等待审核的馆藏。</p></section>}
  </section>

  <section className="home-section">
   <h2>全部馆藏档案 · 证据入口</h2>
   <p className="muted">这里包括已经公开的初编、第二批第一册、第三册及后续新登记档案。可直接进入某件档案补充图片、视频、证书、传播史截图或研究参考。</p>
   {assets.length?<div className="record-list">{assets.map(a=><article className="card museum-admin-row" key={a.id}>
    <div>
      <span className="eyebrow">{a.catalog_code||a.permanent_code} · {a.catalog_volume||'独立登记'}</span>
      <h3>{a.title_zh}</h3>
      <p className="muted">{a.hall_zh||'主馆籍待定'} · {a.workflow_status} · {a.public_status} · 证据附件 {a.evidence_count} 件</p>
    </div>
    <div className="hero-actions">
      <Link className="button button-primary" href={`/admin/museum/${a.permanent_code}/evidence`}>管理证据</Link>
      {a.public_status==='published'&&<Link className="button button-secondary" href={`/museum/${a.permanent_code}`}>查看公开页</Link>}
    </div>
   </article>)}</div>:<div className="card"><p>尚无馆藏档案。</p></div>}
  </section>

  <div className="hero-actions"><Link className="button button-secondary" href="/admin">返回管理员 Dashboard</Link><Link className="button button-secondary" href="/museum">进入数字博物馆</Link></div>
 </main>;
}
