import Link from 'next/link';
import { requireAnyRole } from '@/lib/permissions/rbac';
import { listMuseumReviewQueue } from '@/lib/museum/data';
import MuseumReviewActions from '@/components/museum/MuseumReviewActions';

export default async function MuseumReviewPage(){
 await requireAnyRole(['admin','curator','museum_reviewer']); const rows=await listMuseumReviewQueue();
 return <main>
  <span className="badge">Museum · Review</span><h1>馆藏审核队列</h1>
  <p className="lead">审核的是档案是否达到公开登记条件，不把登记名称直接升级为权威鉴定结论。</p>
  {rows.length?<div className="record-list">{rows.map(a=><article className="card" key={a.id}>
    <span className="eyebrow">{a.permanent_code} · {a.hall_zh||'主馆籍待定'}</span><h2>{a.title_zh}</h2><p>{a.title_eo}</p>
    <p>鉴定：{a.authentication_level} · 权属：{a.ownership_status} · 估值：{a.valuation_status} · 数字权利：{a.digital_rights_status}</p>
    <MuseumReviewActions id={a.id}/>
  </article>)}</div>:<section className="card"><p>目前没有等待审核的馆藏。</p></section>}
  <Link href="/admin">返回管理员 Dashboard</Link>
 </main>;
}
