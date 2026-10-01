import Link from 'next/link';

export default function MuseumAboutPage(){
 return <main>
  <span className="badge">Collection · Memory · Enjoyment</span>
  <h1>收藏、文化记忆与数字赏玩说明</h1>
  <p className="lead">凤凰文明数字博物馆首先是一座学习、欣赏、保存记忆的数字文化空间。</p>

  <section className="card">
   <h2>中文说明</h2>
   <p>本馆以个人收藏、文化记忆、文明学习与数字赏玩为主要定位。馆藏名称、年代、材质、来源及相关说明，依据现有收藏记录、照片、视频、旧文献与个人存录整理保存。</p>
   <p>这些资料用于文化阅读、学习、欣赏与长期数字保存，不要求以专业鉴定作为公开展示的前提，也不作为市场估值、投资建议或交易证明。</p>
   <p><strong>存录求真，不强定论。</strong>以后如有新的资料、研究意见或专业报告，可以继续补充，并保留版本记录。</p>
  </section>

  <section className="card">
   <h2>Esperanta klarigo</h2>
   <p>La Cifereca Muzeo de Feniksa Civilizo estas antaŭ ĉio spaco por persona kolektado, kultura memoro, civiliza lernado kaj cifereca ĝuado de kolektaĵoj.</p>
   <p>Nomoj, periodoj, materialoj, devenaj notoj kaj aliaj priskriboj estas konservataj laŭ ekzistantaj kolektaj registroj, fotoj, filmetoj, malnovaj dokumentoj kaj personaj arkivoj. Profesia aŭtentigo ne estas antaŭkondiĉo por kultura montrado kaj lernado.</p>
   <p>La enhavo ne estas merkata takso, investa konsilo aŭ komerca atesto. Novaj fontoj kaj esploraj opinioj povas esti aldonataj poste kun konservita versiohistorio.</p>
  </section>

  <section className="card">
   <h2>English note</h2>
   <p>The Phoenix Civilization Digital Museum is primarily a space for personal collections, cultural memory, learning and digital enjoyment.</p>
   <p>Names, periods, materials, provenance notes and related descriptions are preserved from existing collection records, photographs, videos, older documents and personal archives. Professional authentication is not a prerequisite for cultural display or learning.</p>
   <p>The material is not a market valuation, investment recommendation or transaction certificate. New sources and research opinions may be added later while preserving version history.</p>
  </section>

  <section className="card">
   <h2>一物一档的意义</h2>
   <p>“一物一档”不是给藏品排等级，而是让每件收藏都有自己的编号、故事、图片、视频、来源记忆、相关文献和后续补充空间。资料越丰富，学习者越容易理解它所承载的文化关系。</p>
  </section>

  <div className="hero-actions">
   <Link className="button button-primary" href="/museum">进入数字博物馆</Link>
   <Link className="button button-secondary" href="/museum/catalogs">查看分册登记</Link>
   <Link className="button button-secondary" href="/wfb">WFB 说明</Link>
  </div>
 </main>;
}
