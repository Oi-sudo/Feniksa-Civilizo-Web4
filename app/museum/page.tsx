import Link from 'next/link';
import { getLocale,getMessages } from '@/lib/i18n';
import { listMuseumHallsWithCounts,listPublishedAssets } from '@/lib/museum/data';

export default async function MuseumPage(){
 const [locale,m]=await Promise.all([getLocale(),getMessages()]);
 const eo=locale==='eo'; const en=locale==='en';
 const [halls,assets]=await Promise.all([listMuseumHallsWithCounts(),listPublishedAssets()]);
 return <main>
  <span className="badge">{m.museum_badge}</span><h1>{m.museum_title}</h1><p className="lead">{m.museum_intro}</p>
  <section className="card"><h2>{m.museum_nine_halls}</h2><p>{m.museum_main_hall_rule}</p><p>{m.museum_integrity_note}</p>
    <p><strong>{eo?'Pozicio de ĝuado:':en?'Display positioning:':'赏玩定位：'}</strong>{eo?' La muzeo celas personajn kolektaĵojn, kulturan memoron, civilizan lernadon kaj ciferecan ĝuadon. La registritaj nomoj estas konservataj laŭ ekzistantaj kolektaj registroj; profesia aŭtentigo ne estas antaŭkondiĉo por lernado kaj kultura montrado.':en?' The museum focuses on personal collections, cultural memory, civilization learning and digital appreciation. Registered names are preserved according to existing collection records; professional authentication is not a prerequisite for learning or cultural display.':'本馆以个人收藏、文化记忆、文明学习与数字赏玩为主。馆藏名称依据现有收藏记录保存，重在文化阅读与资料存录，不以专业鉴定作为学习展示的前提。'}</p>
  </section>
  <div className="card-grid">{halls.map((h,i)=><Link className="card hall-card" href={`/museum/halls/${h.code}`} key={h.id}>
    <div className="record-top"><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><strong>{h.asset_count} {eo?'eroj':en?'items':'件'}</strong></div>
    <h2>{eo?(h.title_eo||h.title_zh):en?(h.title_en||h.title_eo||h.title_zh):h.title_zh}</h2>{locale==='zh'&&<p>{h.title_eo}</p>}{locale!=='en'&&h.title_en&&<small>{h.title_en}</small>}<span className="card-link">{eo?'Eniri la halon →':en?'Enter hall →':'进入本馆 →'}</span>
  </Link>)}</div>
  <section className="home-section"><h2>{eo?'Publikaj kolektaĵoj':en?'Public collections':'公开馆藏 · Publikaj kolektaĵoj'}</h2>
    {assets.length?<div className="card-grid">{assets.map(a=><Link className="card" href={`/museum/${a.permanent_code}`} key={a.id}><span className="eyebrow">{a.permanent_code} · {eo?(a.hall_eo||a.hall_zh||''):en?(a.hall_en||a.hall_eo||a.hall_zh||''):(a.hall_zh||'')}</span><h3>{eo?(a.title_eo||a.title_zh):en?(a.title_en||a.title_eo||a.title_zh):a.title_zh}</h3>{locale==='zh'&&<p>{a.title_eo}</p>}<small>{eo?'Persona kolekto · Kultura memoro · Cifereca ĝuado':en?'Personal collection · Cultural memory · Digital appreciation':'个人收藏 · 文化记忆 · 数字赏玩'}</small><span className="card-link">{eo?'Vidi la dosieron →':en?'View record →':'查看一物一档 →'}</span></Link>)}</div>:<div className="card"><p>{eo?'Nun ne estas publikaj kolektaĵoj.':en?'There are currently no public collections.':'暂无公开馆藏。'}</p></div>}
  </section>
  <div className="hero-actions"><Link className="button button-primary" href="/museum/about">{eo?'Pri kolektoj kaj cifereca ĝuado':en?'About collections and digital appreciation':'收藏与赏玩说明'}</Link><Link className="button button-primary" href="/museum/catalogs">{eo?'Vidi la katalogojn':en?'View catalogs':'查看分册登记册'}</Link><Link className="button button-primary" href="/wfb">{eo?'Pri WFB':en?'About WFB':'WFB 五佛币登记说明'}</Link><Link className="button button-secondary" href="/wfb/intake">{eo?'Registri novan kolektaĵon':en?'Register a new collection item':'登记新藏品'}</Link><a className="button button-secondary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">{eo?'Malnova dulingva muzeo':en?'Old bilingual museum':'旧站双语馆藏内容'}</a></div>
 </main>;
}
