import Link from 'next/link'; import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { listAssetsByCatalogVolume,listCatalogVolumes } from '@/lib/museum/data';

export default async function CatalogVolumePage({params}:{params:Promise<{volume:string}>}){
 const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
 const {volume:raw}=await params; const volume=decodeURIComponent(raw);
 const volumes=await listCatalogVolumes(); if(!volumes.some(v=>v.catalog_volume===volume))notFound();
 const assets=await listAssetsByCatalogVolume(volume);
 return <main>
  <span className="badge">Museum Catalog</span><h1>{volume}</h1>
  <p className="lead">{eo?`Entute ${assets.length} eroj. Ĉiu objekto havas nur unu ĉefan halon; la registrita nomo de la fiksita volumo estas konservata kiel noto pri persona kolekto, kultura memoro kaj cifereca ĝuado.`:en?`A total of ${assets.length} items. Each object has only one primary hall; the registered name in the fixed volume is preserved as a record of personal collecting, cultural memory and digital appreciation.`:`共 ${assets.length} 件。每件只设一个主馆籍；登记名称按冻结书册保留，作为个人收藏、文化记忆与数字赏玩记录。`}</p>
  <div className="record-list">{assets.map(a=><Link className="card catalog-row" href={`/museum/${a.permanent_code}`} key={a.id}>
    <div className="record-top"><strong>{a.catalog_code||a.permanent_code}</strong><span>{eo?(a.hall_eo||a.hall_zh||'Ĉefa halo ne aparte indikita'):en?(a.hall_eo||a.hall_zh||'Primary hall not separately listed'):(a.hall_zh||'主馆籍未单列')}</span></div>
    <h2>{eo?(a.title_eo||a.title_zh):en?(a.title_en||a.title_eo||a.title_zh):a.title_zh}</h2>{locale==='zh'&&<p>{a.title_eo||'世界语展签可继续补充'}</p>}
    <small>{eo?'Persona kolekto · Kultura memoro · Cifereca ĝuado':en?'Personal collection · Cultural memory · Digital appreciation':'个人收藏 · 文化记忆 · 数字赏玩'}</small>
  </Link>)}</div>
  <div className="hero-actions"><Link className="button button-secondary" href="/museum/catalogs">{eo?'Reveni al katalogoj':en?'Back to catalogs':'返回分册登记'}</Link><Link className="button button-secondary" href="/museum">{eo?'Reveni al la naŭ haloj':en?'Back to the nine halls':'返回九馆总览'}</Link></div>
 </main>;
}
