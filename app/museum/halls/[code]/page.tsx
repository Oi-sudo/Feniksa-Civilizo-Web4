import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getHallByCode,listPublishedAssetsByHall } from '@/lib/museum/data';

const hallIntro:Record<string,{zh:string;eo:string}> = {
  NW_TECH:{zh:'展示世界科技、工业、博览会、材料科学、陨石与现代文明相关档案。',eo:'Montras arkivojn pri scienco, teknologio, industrio, ekspozicioj, materialoj, meteoritoj kaj moderna civilizo.'},
  N_WEB4:{zh:'展示凤凰网络、Web4、数字治理、AI/SI 与新型文明基础设施。',eo:'Montras Feniksan Reton, Web4, ciferecan regadon, AI/SI kaj novajn civilizajn infrastrukturojn.'},
  NE_BUD:{zh:'展示佛教经典、造像、法器与修学相关文化档案。',eo:'Montras budhismajn sutrojn, bildojn, ritajn objektojn kaj stud-praktikajn kulturajn arkivojn.'},
  W_GIFTS:{zh:'展示礼物、纪念物、收藏品及其来历与关系档案。',eo:'Montras donacojn, memoraĵojn, kolektaĵojn kaj iliajn devenajn registrojn.'},
  C_DHARMA:{zh:'作为中央佛堂的数字档案与公共供奉入口。',eo:'Funkcias kiel cifereca arkivo kaj publika ofera enirejo de la Centra Budha Halo.'},
  E_WISDOM:{zh:'展示东方思想、哲学、艺术、工艺与智慧文明资料。',eo:'Montras orientajn penson, filozofion, arton, metiojn kaj materialojn de saĝeca civilizo.'},
  SW_MUSEUM:{zh:'研究博物馆方法、资料整理、编目、数字保存与文明记忆。',eo:'Esploras muzeajn metodojn, dokumentan ordigon, katalogadon, ciferecan konservadon kaj civilizan memoron.'},
  S_PHOENIX:{zh:'展示凤凰文明自身的历史、文献、影像、项目与发展档案。',eo:'Montras historion, dokumentojn, bildojn, projektojn kaj evoluajn arkivojn de Feniksa Civilizo.'},
  SE_ESPERANTO:{zh:'展示世界语历史、教育、文学、邮品、翻译与国际交流档案。',eo:'Montras historion de Esperanto, edukadon, literaturon, filatelion, tradukadon kaj internacian interŝanĝon.'}
};

export default async function HallPage({params}:{params:Promise<{code:string}>}){
 const {code}=await params; const hall=await getHallByCode(code); if(!hall)notFound();
 const assets=await listPublishedAssetsByHall(hall.id);
 const intro=hallIntro[hall.code]||{zh:'凤凰文明数字博物馆九馆之一。',eo:'Unu el la naŭ haloj de la Cifereca Muzeo de Feniksa Civilizo.'};
 return <main>
  <span className="badge">九馆 · Naŭ Haloj · {hall.code}</span>
  <h1>{hall.title_zh}</h1><p className="lead">{hall.title_eo}</p>{hall.title_en&&<p className="muted">{hall.title_en}</p>}
  <section className="card">
    <div className="hall-summary"><div><strong>{hall.asset_count}</strong><span>公开馆藏 · publikaj eroj</span></div><p>{intro.zh}<br/><span className="muted">{intro.eo}</span></p></div>
  </section>
  <section className="home-section">
    <h2>本馆藏品 · Kolektaĵoj en ĉi tiu halo</h2>
    {assets.length?<div className="card-grid">{assets.map(a=><Link className="card" href={`/museum/${a.permanent_code}`} key={a.id}>
      <span className="eyebrow">{a.permanent_code}{a.batch_code?` · ${a.batch_code}`:''}</span>
      <h3>{a.title_zh}</h3><p>{a.title_eo}</p><small>{a.category||'待分类'} · 收藏记录 {a.authentication_level}</small><span className="card-link">查看一物一档 →</span>
    </Link>)}</div>:<div className="card"><p>本馆目前还没有公开馆藏。没有数据不等于没有实物；只表示尚未完成公开登记。</p></div>}
  </section>
  <section className="card"><h2>主馆籍原则</h2><p>每件藏品只设一个主馆籍，避免九馆重复计数；关联展示可以跨馆，但主档案仍只归一馆。</p><p className="muted">本馆以个人收藏、文化记忆与数字赏玩为定位，资料可随学习与整理继续丰富。</p></section>
  <div className="hero-actions"><Link className="button button-primary" href="/museum">返回九馆总览</Link><Link className="button button-secondary" href="/wfb/intake">登记新藏品</Link></div>
 </main>;
}
