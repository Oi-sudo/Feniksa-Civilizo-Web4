import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function MuseumAboutPage(){
 const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
 return <main>
  <span className="badge">Collection · Memory · Enjoyment</span>
  <h1>{eo?'Kolektaĵoj, kultura memoro kaj cifereca ĝuado':en?'Collections, cultural memory and digital appreciation':'收藏、文化记忆与数字赏玩说明'}</h1>
  <p className="lead">{eo?'La Cifereca Muzeo de Feniksa Civilizo estas antaŭ ĉio cifereca kultura spaco por lerni, ĝui kaj konservi memorojn.':en?'The Phoenix Civilization Digital Museum is first and foremost a digital cultural space for learning, appreciation and preserving memory.':'凤凰文明数字博物馆首先是一座学习、欣赏、保存记忆的数字文化空间。'}</p>

  <section className="card">
   <h2>{eo?'Esperanta klarigo':en?'English explanation':'中文说明'}</h2>
   <p>{eo?'La muzeo celas personajn kolektaĵojn, kulturan memoron, civilizan lernadon kaj ciferecan ĝuadon de kolektaĵoj. Nomoj, periodoj, materialoj, devenaj notoj kaj rilataj priskriboj estas konservataj laŭ ekzistantaj kolektaj registroj, fotoj, filmetoj, malnovaj dokumentoj kaj personaj arkivoj.':en?'The museum focuses on personal collections, cultural memory, civilization learning and digital appreciation. Names, periods, materials, provenance notes and related descriptions are preserved according to existing collection records, photos, videos, older documents and personal archives.':'本馆以个人收藏、文化记忆、文明学习与数字赏玩为主要定位。馆藏名称、年代、材质、来源及相关说明，依据现有收藏记录、照片、视频、旧文献与个人存录整理保存。'}</p>
   <p>{eo?'Tiuj materialoj servas al kultura legado, lernado, ĝuado kaj longtempa cifereca konservado. Profesia aŭtentigo ne estas antaŭkondiĉo por publika kultura montrado, kaj la enhavo ne estas merkata takso, investa konsilo aŭ komerca atesto.':en?'These materials serve cultural reading, learning, appreciation and long-term digital preservation. Professional authentication is not a prerequisite for public cultural display, and the content is not a market valuation, investment advice or transaction certificate.':'这些资料用于文化阅读、学习、欣赏与长期数字保存，不要求以专业鉴定作为公开展示的前提，也不作为市场估值、投资建议或交易证明。'}</p>
   <p><strong>{eo?'Registri por serĉi veron, ne trudi finan konkludon.':en?'Record in pursuit of truth; do not force a final conclusion.':'存录求真，不强定论。'}</strong>{eo?' Novaj fontoj, esploraj opinioj aŭ profesiaj raportoj povas esti aldonataj poste kun konservita versiohistorio.':en?' New sources, research opinions or professional reports can be added later while preserving version history.':'以后如有新的资料、研究意见或专业报告，可以继续补充，并保留版本记录。'}</p>
  </section>

  <section className="card">
   <h2>{eo?'La signifo de “unu objekto, unu dosiero”':en?'The meaning of “one object, one file”':'一物一档的意义'}</h2>
   <p>{eo?'“Unu objekto, unu dosiero” ne rangigas kolektaĵojn. Ĝi donas al ĉiu objekto propran kodon, rakonton, bildojn, filmetojn, devenan memoron, rilatajn dokumentojn kaj spacon por estontaj aldonoj. Ju pli riĉa estas la dokumentado, des pli facile lernantoj komprenas la kulturajn rilatojn de la objekto.':en?'“One object, one file” does not rank collections. It gives each object its own code, story, images, videos, provenance memory, related documents and room for future additions. The richer the documentation, the easier it is for learners to understand the cultural relationships carried by the object.':'“一物一档”不是给藏品排等级，而是让每件收藏都有自己的编号、故事、图片、视频、来源记忆、相关文献和后续补充空间。资料越丰富，学习者越容易理解它所承载的文化关系。'}</p>
  </section>

  <div className="hero-actions">
   <Link className="button button-primary" href="/museum">{eo?'Eniri la Ciferecan Muzeon':en?'Enter the Digital Museum':'进入数字博物馆'}</Link>
   <Link className="button button-secondary" href="/museum/catalogs">{eo?'Vidi la katalogojn':en?'View catalogs':'查看分册登记'}</Link>
   <Link className="button button-secondary" href="/wfb">{eo?'Pri WFB':en?'About WFB':'WFB 说明'}</Link>
  </div>
 </main>;
}
