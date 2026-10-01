import Link from 'next/link'; import { notFound } from 'next/navigation';
import { listAssetsByCatalogVolume,listCatalogVolumes } from '@/lib/museum/data';

export default async function CatalogVolumePage({params}:{params:Promise<{volume:string}>}){
 const {volume:raw}=await params; const volume=decodeURIComponent(raw);
 const volumes=await listCatalogVolumes(); if(!volumes.some(v=>v.catalog_volume===volume))notFound();
 const assets=await listAssetsByCatalogVolume(volume);
 return <main>
  <span className="badge">Museum Catalog</span><h1>{volume}</h1>
  <p className="lead">共 {assets.length} 件。每件只设一个主馆籍；登记名称按冻结书册保留，作为个人收藏、文化记忆与数字赏玩记录。</p>
  <div className="record-list">{assets.map(a=><Link className="card catalog-row" href={`/museum/${a.permanent_code}`} key={a.id}>
    <div className="record-top"><strong>{a.catalog_code||a.permanent_code}</strong><span>{a.hall_zh||'主馆籍待定'}</span></div>
    <h2>{a.title_zh}</h2><p>{a.title_eo||'世界语展签待后续审校导入'}</p>
    <small>收藏记录 {a.authentication_level} · 权属 {a.ownership_status} · 资料状态 {a.valuation_status}</small>
  </Link>)}</div>
  <div className="hero-actions"><Link className="button button-secondary" href="/museum/catalogs">返回分册登记</Link><Link className="button button-secondary" href="/museum">返回九馆总览</Link></div>
 </main>;
}
