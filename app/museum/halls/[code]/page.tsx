import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getHallByCode,listPublishedAssetsByHall } from '@/lib/museum/data';

const hallIntro:Record<string,{zh:string;eo:string;en:string}> = {
  NW_TECH:{zh:'展示世界科技、工业、博览会、材料科学、陨石与现代文明相关档案。',eo:'Montras arkivojn pri scienco, teknologio, industrio, ekspozicioj, materialoj, meteoritoj kaj moderna civilizo.',en:'Shows archives related to science, technology, industry, expositions, materials science, meteorites and modern civilization.'},
  N_WEB4:{zh:'展示凤凰网络、Web4、数字治理、AI/SI 与新型文明基础设施。',eo:'Montras Feniksan Reton, Web4, ciferecan regadon, AI/SI kaj novajn civilizajn infrastrukturojn.',en:'Shows Phoenix Network, Web4, digital governance, AI/SI and new forms of civilization infrastructure.'},
  NE_BUD:{zh:'展示佛教经典、造像、法器与修学相关文化档案。',eo:'Montras budhismajn sutrojn, bildojn, ritajn objektojn kaj stud-praktikajn kulturajn arkivojn.',en:'Shows Buddhist sutras, images, ritual objects and cultural archives related to study and practice.'},
  W_GIFTS:{zh:'展示礼物、纪念物、收藏品及其来历与关系档案。',eo:'Montras donacojn, memoraĵojn, kolektaĵojn kaj iliajn devenajn registrojn.',en:'Shows gifts, memorial objects, collections and records of their origins and relationships.'},
  C_DHARMA:{zh:'作为中央佛堂的数字档案与公共供奉入口。',eo:'Funkcias kiel cifereca arkivo kaj publika ofera enirejo de la Centra Budha Halo.',en:'Serves as the digital archive and public offering entry of the Central Buddha Hall.'},
  E_WISDOM:{zh:'展示东方思想、哲学、艺术、工艺与智慧文明资料。',eo:'Montras orientajn penson, filozofion, arton, metiojn kaj materialojn de saĝeca civilizo.',en:'Shows Eastern thought, philosophy, art, crafts and materials of wisdom civilization.'},
  SW_MUSEUM:{zh:'研究博物馆方法、资料整理、编目、数字保存与文明记忆。',eo:'Esploras muzeajn metodojn, dokumentan ordigon, katalogadon, ciferecan konservadon kaj civilizan memoron.',en:'Studies museum methods, documentation, cataloging, digital preservation and civilization memory.'},
  S_PHOENIX:{zh:'展示凤凰文明自身的历史、文献、影像、项目与发展档案。',eo:'Montras historion, dokumentojn, bildojn, projektojn kaj evoluajn arkivojn de Feniksa Civilizo.',en:'Shows the history, documents, images, projects and development archives of Phoenix Civilization.'},
  SE_ESPERANTO:{zh:'展示世界语历史、教育、文学、邮品、翻译与国际交流档案。',eo:'Montras historion de Esperanto, edukadon, literaturon, filatelion, tradukadon kaj internacian interŝanĝon.',en:'Shows Esperanto history, education, literature, philately, translation and international exchange.'}
};

export default async function HallPage({params}:{params:Promise<{code:string}>}){
 const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
 const {code}=await params; const hall=await getHallByCode(code); if(!hall)notFound();
 const assets=await listPublishedAssetsByHall(hall.id);
 const intro=hallIntro[hall.code]||{zh:'凤凰文明数字博物馆九馆之一。',eo:'Unu el la naŭ haloj de la Cifereca Muzeo de Feniksa Civilizo.',en:'One of the nine halls of the Phoenix Civilization Digital Museum.'};
 return <main>
  <span className="badge">{eo?'Naŭ Haloj':en?'Nine Halls':'九馆'} · Naŭ Haloj · {hall.code}</span>
  <h1>{eo?(hall.title_eo||hall.title_zh):en?(hall.title_en||hall.title_eo||hall.title_zh):hall.title_zh}</h1>{locale==='zh'&&<p className="lead">{hall.title_eo}</p>}{locale!=='en'&&hall.title_en&&<p className="muted">{hall.title_en}</p>}
  <section className="card">
    <div className="hall-summary"><div><strong>{hall.asset_count}</strong><span>{eo?'publikaj eroj':en?'public items':'公开馆藏 · publikaj eroj'}</span></div><p>{eo?intro.eo:en?intro.en:intro.zh}{locale==='zh'&&<><br/><span className="muted">{intro.eo}</span></>}</p></div>
  </section>
  <section className="home-section">
    <h2>{eo?'Kolektaĵoj en ĉi tiu halo':en?'Collections in this hall':'本馆藏品 · Kolektaĵoj en ĉi tiu halo'}</h2>
    {assets.length?<div className="card-grid">{assets.map(a=><Link className="card" href={`/museum/${a.permanent_code}`} key={a.id}>
      <span className="eyebrow">{a.permanent_code}{a.batch_code?` · ${a.batch_code}`:''}</span>
      <h3>{eo?(a.title_eo||a.title_zh):en?(a.title_en||a.title_eo||a.title_zh):a.title_zh}</h3>{locale==='zh'&&<p>{a.title_eo}</p>}<small>{a.category||(eo?'Kategorio ne aparte indikita':en?'Category not separately listed':'未单列类别')}</small><span className="card-link">{eo?'Vidi la dosieron →':en?'View record →':'查看一物一档 →'}</span>
    </Link>)}</div>:<div className="card"><p>{eo?'Nun ne estas publikaj eroj en ĉi tiu halo; la enhavo povas kreski laŭ la ordigo de kolektaj materialoj kaj kultura memoro.':en?'There are currently no public items in this hall; the content can grow as collection materials and cultural memory are organized.':'本馆当前没有公开条目；后续可随收藏资料与文化记忆的整理继续丰富。'}</p></div>}
  </section>
  <section className="card"><h2>{eo?'Principo de la ĉefa halo':en?'Primary hall principle':'主馆籍原则'}</h2><p>{eo?'Ĉiu kolektaĵo havas nur unu ĉefan halon por eviti duoblan nombradon. Rilataj prezentoj povas transiri inter haloj, sed la ĉefa dosiero restas en unu halo.':en?'Each collection item has only one primary hall to avoid double counting. Related displays may cross halls, but the main record remains in one hall.':'每件藏品只设一个主馆籍，避免九馆重复计数；关联展示可以跨馆，但主档案仍只归一馆。'}</p><p className="muted">{eo?'La halo celas personajn kolektaĵojn, kulturan memoron kaj ciferecan ĝuadon; la dokumentaro povas daŭre pliriĉiĝi dum lernado kaj ordigo.':en?'This hall focuses on personal collections, cultural memory and digital appreciation; documentation can continue to grow through learning and organization.':'本馆以个人收藏、文化记忆与数字赏玩为定位，资料可随学习与整理继续丰富。'}</p></section>
  <div className="hero-actions"><Link className="button button-primary" href="/museum">{eo?'Reveni al la naŭ haloj':en?'Back to the nine halls':'返回九馆总览'}</Link><Link className="button button-secondary" href="/museum/about">{eo?'Pri kolektoj kaj cifereca ĝuado':en?'About collections and digital appreciation':'收藏与赏玩说明'}</Link><Link className="button button-secondary" href="/wfb/intake">{eo?'Registri novan kolektaĵon':en?'Register a new collection item':'登记新藏品'}</Link></div>
 </main>;
}
