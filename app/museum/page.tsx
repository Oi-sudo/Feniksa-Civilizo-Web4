import Link from 'next/link';
import { getMessages } from '@/lib/i18n';
import { listMuseumHallsWithCounts,listPublishedAssets } from '@/lib/museum/data';

export default async function MuseumPage(){
 const m=await getMessages(); const [halls,assets]=await Promise.all([listMuseumHallsWithCounts(),listPublishedAssets()]);
 return <main>
  <span className="badge">{m.museum_badge}</span><h1>{m.museum_title}</h1><p className="lead">{m.museum_intro}</p>
  <section className="card"><h2>{m.museum_nine_halls}</h2><p>{m.museum_main_hall_rule}</p><p>{m.museum_integrity_note}</p></section>
  <div className="card-grid">{halls.map((h,i)=><Link className="card hall-card" href={`/museum/halls/${h.code}`} key={h.id}>
    <div className="record-top"><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><strong>{h.asset_count} 件</strong></div>
    <h2>{h.title_zh}</h2><p>{h.title_eo}</p><small>{h.title_en}</small><span className="card-link">进入本馆 →</span>
  </Link>)}</div>
  <section className="home-section"><h2>公开馆藏 · Publikaj kolektaĵoj</h2>
    {assets.length?<div className="card-grid">{assets.map(a=><Link className="card" href={`/museum/${a.permanent_code}`} key={a.id}><span className="eyebrow">{a.permanent_code} · {a.hall_zh||''}</span><h3>{a.title_zh}</h3><p>{a.title_eo}</p><small>鉴定 {a.authentication_level} · {a.ownership_status}</small><span className="card-link">查看一物一档 →</span></Link>)}</div>:<div className="card"><p>暂无公开馆藏。</p></div>}
  </section>
  <div className="hero-actions"><Link className="button button-primary" href="/museum/catalogs">查看分册登记册</Link><Link className="button button-primary" href="/wfb">WFB 五佛币登记说明</Link><Link className="button button-secondary" href="/wfb/intake">登记新藏品</Link><a className="button button-secondary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">旧站双语馆藏内容</a></div>
 </main>;
}
