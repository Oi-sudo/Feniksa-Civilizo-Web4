import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { listCatalogVolumes } from '@/lib/museum/data';

export default async function CatalogsPage(){
 const eo=(await getLocale())==='eo';
 const volumes=await listCatalogVolumes();
 return <main>
  <span className="badge">Museum Catalogs · ${eo?'Katalogoj':'登记册'}</span>
  <h1>{eo?'Katalogoj de la Cifereca Muzeo de Feniksa Civilizo':'凤凰文明数字博物馆分册登记'}</h1>
  <p className="lead">{eo?'Ĉi tie la jam fiksitaj volumoj montras personajn kolektaĵojn, kulturan memoron kaj ciferecan ĝuadon. La registritaj nomoj konservas kolektan, dokumentan kaj disvastigan memoron; novaj materialoj povas esti aldonataj poste por lernado kaj ĝuado.':'这里按已经冻结的书册编号展示个人收藏、文化记忆与数字赏玩档案。书册登记名保存收藏、文献与传播史；不同资料可以继续补充，重在存录、学习与欣赏。'}</p>
  {volumes.length?<div className="card-grid">{volumes.map(v=><Link className="card" href={`/museum/catalogs/${encodeURIComponent(v.catalog_volume)}`} key={v.catalog_volume}>
    <span className="eyebrow">CATALOG</span><h2>{v.catalog_volume}</h2><strong>{v.asset_count} {eo?'eroj':'件'}</strong><span className="card-link">{eo?'Malfermi la katalogon →':'打开登记册 →'}</span>
  </Link>)}</div>:<div className="card"><p>{eo?'Nun ne estas konektitaj katalogaj volumoj.':'暂无已接入的分册登记。'}</p></div>}
  <div className="hero-actions"><Link className="button button-secondary" href="/museum/about">{eo?'Pri kolektoj kaj cifereca ĝuado':'收藏与赏玩说明'}</Link><Link className="button button-secondary" href="/museum">{eo?'Reveni al la naŭ haloj':'返回九馆总览'}</Link></div>
 </main>;
}
