import Link from 'next/link';
import { listCatalogVolumes } from '@/lib/museum/data';

export default async function CatalogsPage(){
 const volumes=await listCatalogVolumes();
 return <main>
  <span className="badge">Museum Catalogs · 登记册</span>
  <h1>凤凰文明数字博物馆分册登记</h1>
  <p className="lead">这里按已经冻结的书册编号展示个人收藏、文化记忆与数字赏玩档案。书册登记名保存收藏、文献与传播史；不同资料可以继续补充，重在存录、学习与欣赏。</p>
  {volumes.length?<div className="card-grid">{volumes.map(v=><Link className="card" href={`/museum/catalogs/${encodeURIComponent(v.catalog_volume)}`} key={v.catalog_volume}>
    <span className="eyebrow">CATALOG</span><h2>{v.catalog_volume}</h2><strong>{v.asset_count} 件</strong><span className="card-link">打开登记册 →</span>
  </Link>)}</div>:<div className="card"><p>暂无已接入的分册登记。</p></div>}
  <div className="hero-actions"><Link className="button button-secondary" href="/museum">返回九馆总览</Link></div>
 </main>;
}
