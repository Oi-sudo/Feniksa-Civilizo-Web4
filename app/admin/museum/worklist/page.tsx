import Link from 'next/link';
import { requireAnyRole } from '@/lib/permissions/rbac';
import { listAdminMuseumAssets,listMuseumHalls,type MuseumEvidenceFilter } from '@/lib/museum/data';

export default async function MuseumWorklistPage({searchParams}:{searchParams:Promise<{evidence?:string;volume?:string;hall?:string}>}){
 await requireAnyRole(['admin','curator','museum_reviewer']);
 const p=await searchParams;
 const allowed=new Set<MuseumEvidenceFilter>(['all','missing','unverified','source_confirmed','reviewed']);
 const evidence=allowed.has((p.evidence||'all') as MuseumEvidenceFilter)?(p.evidence||'all') as MuseumEvidenceFilter:'all';
 const volume=(p.volume||'').trim()||null; const hall=(p.hall||'').trim()||null;
 const [assets,halls]=await Promise.all([listAdminMuseumAssets(500,evidence,volume,hall),listMuseumHalls()]);
 const hallName=halls.find(h=>h.code===hall)?.title_zh||'全部馆籍';
 const s=new URLSearchParams(); if(evidence!=='all')s.set('evidence',evidence); if(volume)s.set('volume',volume); if(hall)s.set('hall',hall);
 const qs=s.toString();
 return <main className="museum-worklist">
  <span className="badge">Museum · Worklist</span><h1>馆藏资料整理清单</h1>
  <p className="lead">当前条件：资料 {evidence}；分册 {volume||'全部'}；馆籍 {hallName}。共 {assets.length} 件。</p>
  <p className="muted">本清单用于逐步整理个人收藏、文化记忆与数字赏玩资料，不是鉴定结果或价值排序。</p>
  <div className="hero-actions no-print">
   <Link className="button button-secondary" href={qs?`/admin/museum?${qs}`:'/admin/museum'}>返回筛选页</Link>
   <a className="button button-primary" href={`/api/museum/worklist.csv${qs?'?'+qs:''}`}>导出 CSV</a>
   <button className="button button-secondary" onClick={undefined}>可用浏览器打印此页</button>
  </div>
  <table className="worklist-table">
   <thead><tr><th>编号</th><th>藏品</th><th>馆籍</th><th>资料总数</th><th>待整理</th><th>来源已整理</th><th>资料已整理</th><th>下一步</th></tr></thead>
   <tbody>{assets.map(a=><tr key={a.id}>
    <td>{a.catalog_code||a.permanent_code}</td><td>{a.title_zh}</td><td>{a.hall_zh||'待定'}</td>
    <td>{a.evidence_count}</td><td>{a.evidence_unverified}</td><td>{a.evidence_source_confirmed}</td><td>{a.evidence_reviewed}</td>
    <td>{Number(a.evidence_count)===0?'资料可续补':Number(a.evidence_unverified)>0?'继续整理来源资料':Number(a.evidence_source_confirmed)>0?'继续整理馆藏资料':'资料已整理'}</td>
   </tr>)}</tbody>
  </table>
 </main>;
}
