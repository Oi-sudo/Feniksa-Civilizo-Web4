import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

type Tri={zh:string;eo:string;en:string};
function t(locale:string,x:Tri){return locale==='eo'?x.eo:locale==='en'?x.en:x.zh;}

const sections:{title:Tri;body:Tri[]}[]=[
  {
    title:{zh:'世界语，是这座桃花源的桥',eo:'Esperanto estas la ponto de ĉi tiu Persikflora Lando',en:'Esperanto is the bridge of this Peach Blossom Land'},
    body:[
      {zh:'凤凰文明 Web4 希望以世界语连接不同国家、年龄、专业和人生经历的人。世界语既是人与人之间的桥，也可以成为人与人工智能之间清晰、可学习、可协作的语言接口。',eo:'Feniksa Civilizo Web4 esperas ligi homojn de malsamaj landoj, aĝoj, profesioj kaj vivspertoj per Esperanto. Esperanto estas kaj ponto inter homoj kaj klara, lernebla kaj kunlaborebla lingva interfaco inter homo kaj AI.',en:'Feniksa Civilizo Web4 uses Esperanto to connect people across countries, generations, professions and life experiences. Esperanto can be both a bridge among people and a clear, learnable interface for human–AI collaboration.'},
      {zh:'我们不是要建立一个封闭团体，而是探索一种更平等、更温和、更可持续的共同学习与共同生活方式。',eo:'Ni ne celas konstrui fermitan grupon, sed esplori pli egalan, mildan kaj daŭripovan manieron kune lerni kaj vivi.',en:'The aim is not to build a closed group, but to explore a more equal, gentle and sustainable way to learn and live together.'}
    ]
  },
  {
    title:{zh:'学习、护照与传承',eo:'Lernado, pasporto kaj transdono',en:'Learning, passport and transmission'},
    body:[
      {zh:'这里有课程、学习护照、翻译与教学记录。学习不是为了考试，而是为了继续教、继续译、继续做、继续服务。一个人的知识与经验，可以成为后来者继续学习和引用的文明资料。',eo:'Ĉi tie estas kursoj, lernopasporto kaj registroj de tradukado kaj instruado. Lernado ne celas nur ekzamenojn, sed la kapablon plu instrui, traduki, fari kaj servi. La scioj kaj spertoj de unu homo povas fariĝi civilizaj materialoj por posteuloj.',en:'The site includes courses, a learning passport, and records of translation and teaching. Learning is not only for tests, but to keep teaching, translating, building and serving. A person’s knowledge and experience can become material for future learners.'},
      {zh:'我们把这称为：有传能承。',eo:'Ni nomas tion: kio estas transdonita, tio povas esti heredita.',en:'We call this: what is transmitted can be carried forward.'}
    ]
  },
  {
    title:{zh:'数字博物馆：文玩、赏玩与文明记忆',eo:'Cifereca muzeo: kultura ĝuo kaj civiliza memoro',en:'Digital museum: cultural appreciation and civilizational memory'},
    body:[
      {zh:'数字博物馆中的部分藏品以“文玩、赏玩与个人收藏资料”的方式展示。页面首先记录可见外观、尺寸、影像、收藏经历和文化欣赏意义，不把这些展示文字当作权威鉴定书，也不把它们写成市场估值证明。以后若获得新的来源资料、专家意见或正式检测结果，可以作为补充档案继续加入。',eo:'Parto de la muzeaj objektoj estas prezentata kiel kultura ĝuo kaj persona kolekta dokumentado. La paĝoj unue registras videblan aspekton, dimensiojn, bildojn, kolektan sperton kaj kulturan signifon; ili ne estas traktataj kiel aŭtoritataj aŭtentikigaj raportoj aŭ merkataj taksodokumentoj. Novaj fontoj, fakaj opinioj aŭ formalaj testoj povas esti aldonitaj poste kiel suplementa arkivo.',en:'Some museum objects are presented as cultural appreciation and personal collection records. Pages first document visible appearance, dimensions, images, collecting history and cultural significance. These descriptions are not presented as authoritative authentication reports or market valuations. New provenance, expert opinions or formal tests can be added later as supplementary records.'}
    ]
  },
  {
    title:{zh:'DAD：共同体学习自己治理自己',eo:'DAD: komunumo lernas memregadon',en:'DAD: a community learning self-governance'},
    body:[
      {zh:'DAD 正在形成从提案、公开讨论、修订、表决、决定，到项目、里程碑、审计与公共档案的连续治理链。它的重点不是争权，而是让过程有记录、决定可追溯、历史可复核。',eo:'DAD formas kontinuan regadan ĉenon de propono, publika diskuto, revizio, voĉdono kaj decido ĝis projektoj, mejloŝtonoj, aŭditado kaj publikaj arkivoj. La celo ne estas lukto por potenco, sed registrita procezo, spureblaj decidoj kaj kontrolebla historio.',en:'DAD is building a continuous governance chain from proposals, public discussion, revision and voting to decisions, projects, milestones, audits and public archives. The point is not competition for power, but traceable processes, decisions and history.'},
      {zh:'AI 可以帮助翻译、摘要、检索和整理，但公共决定仍由人作出。',eo:'AI povas helpi traduki, resumi, serĉi kaj ordigi, sed publikajn decidojn ankoraŭ faras homoj.',en:'AI may assist with translation, summarization, search and organization, but public decisions remain human.'}
    ]
  },
  {
    title:{zh:'人 · 机 · 链与三币数字记录',eo:'Homo · AI · Blokĉeno kaj tri ciferecaj registroj',en:'Human · AI · Blockchain and three digital records'},
    body:[
      {zh:'未来的数字桃花源采用“人—机—链”协作：人学习、服务并作决定；AI 帮助理解和组织知识；数字链保存经过规则确认的长期记录。',eo:'La estonta cifereca Persikflora Lando uzas kunlaboron inter homo, AI kaj blokĉeno: homoj lernas, servas kaj decidas; AI helpas kompreni kaj organizi sciojn; la cifereca ĉeno konservas longdaŭrajn registrojn konfirmitajn laŭ reguloj.',en:'The future digital Peach Blossom Land uses Human–AI–Blockchain collaboration: people learn, serve and decide; AI helps understand and organize knowledge; the digital chain preserves long-term records validated by rules.'},
      {zh:'EST 世界语币记录学习、翻译、教学与知识贡献；WFB 五佛币记录文化支持与公共文化关系；BUD 佛光币记录愿行、志愿服务与公共服务。当前 0.2 阶段，它们首先是数字记录与公共凭证：不发币、不承诺投资回报、不开放钱包交易，也不把人的价值或治理权换算成价格。',eo:'EST — Esperanto-Monero registras lernadon, tradukadon, instruadon kaj sciajn kontribuojn; WFB — Monero de la Kvin Budhoj registras kulturan subtenon kaj publikajn kulturajn rilatojn; BUD — Monero de Budha Lumo registras volan agadon, volontulan kaj publikan servon. En la nuna fazo 0.2 ili estas antaŭ ĉio ciferecaj registroj kaj publikaj atestoj: neniu komercebla emisio, neniu promeso de investa rendimento, neniu malfermita monujo aŭ komerco, kaj neniu prezigado de homa valoro aŭ regrajto.',en:'EST — Esperanto Coin records learning, translation, teaching and knowledge contribution; WFB — Five-Buddha Coin records cultural support and public cultural relationships; BUD — Buddha-Light Coin records vowed action, volunteering and public service. In the current 0.2 stage they are first of all digital records and public credentials: no token issuance, no investment-return promise, no wallet trading, and no conversion of human worth or governance rights into prices.'}
    ]
  },
  {
    title:{zh:'3D桃花源：不是逃离现实，而是先演练未来',eo:'3D Persikflora Lando: ne fuĝo, sed prova estonteco',en:'3D Peach Blossom Land: not escape, but a prototype for the future'},
    body:[
      {zh:'3D桃花源将逐步连接学校、博物馆、佛法学院、长者康养、DAD议事、志愿服务与公共文化空间。它不是声称现实城市已经建成，而是先在数字空间里设计、连接和演练未来共同体。',eo:'La 3D Persikflora Lando iom post iom ligos lernejojn, muzeojn, budhan akademion, prizorgadon por maljunuloj, DAD-konsiliĝon, volontulan servon kaj publikajn kulturajn spacojn. Ĝi ne asertas, ke reala urbo jam ekzistas; ĝi estas cifereca spaco por unue desegni, ligi kaj provi estontan komunumon.',en:'The 3D Peach Blossom Land will gradually connect schools, museums, Buddhist learning, elder care, DAD deliberation, volunteering and public cultural spaces. It does not claim that a physical city already exists; it is a digital environment for designing and testing future community life.'}
    ]
  }
];

const roles:Tri[]=[
  {zh:'世界语教学与翻译',eo:'Esperanta instruado kaj tradukado',en:'Esperanto teaching and translation'},
  {zh:'中文—世界语—英语校对',eo:'Ĉina–Esperanta–angla reviziado',en:'Chinese–Esperanto–English proofreading'},
  {zh:'佛经受控语言整理',eo:'Kontrolita lingvo por budhaj tekstoj',en:'Controlled language for Buddhist texts'},
  {zh:'数字博物馆资料整理',eo:'Cifereca muzea dokumentado',en:'Digital museum documentation'},
  {zh:'视频、音频与字幕制作',eo:'Video, sono kaj subtitoloj',en:'Video, audio and subtitles'},
  {zh:'网站测试与无障碍协助',eo:'Reteja testado kaj alirebla helpo',en:'Website testing and accessibility support'},
  {zh:'3D场景与桃花源设计',eo:'3D-sceno kaj Persikflora Land-dezajno',en:'3D scene and Peach Blossom Land design'},
  {zh:'DAD治理与公共档案整理',eo:'DAD-regado kaj publika arkivado',en:'DAD governance and public archiving'},
  {zh:'课程助教与长者数字学习支持',eo:'Kursa asistado kaj cifereca lernhelpo por maljunuloj',en:'Teaching assistance and digital learning support for elders'}
];

export default async function JoinPage(){
  const locale=await getLocale();
  return <main className="home-shell">
    <section className="home-hero">
      <div className="hero-copy">
        <span className="eyebrow">WEB4 0.2 · JOIN / ALIĜU / 加入</span>
        <h1>{t(locale,{zh:'同道共行，共建世界语者的未来桃花源',eo:'Kuniri laŭ la Sama Vojo, Kunkonstrui la Estontan Persikfloran Landon de Esperantistoj',en:'Walking the Same Path: Co-building a Future Peach Blossom Land for Esperantists'})}</h1>
        <p className="hero-subtitle">{t(locale,{zh:'这里不是只供参观的网站，而是一座正在建设中的学习大学、数字博物馆、公共议事空间与未来共同体原型。',eo:'Ĉi tio ne estas nur retejo por viziti, sed konstruata lernuniversitato, cifereca muzeo, publika konsilia spaco kaj prototipo de estonta komunumo.',en:'This is not only a site to visit, but a learning university, digital museum, public deliberation space and future-community prototype under construction.'})}</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/register">{t(locale,{zh:'成为生员',eo:'Fariĝi lernanto',en:'Become a learner'})}</Link>
          <Link className="button button-secondary" href="/dad">{t(locale,{zh:'进入 DAD 议事厅',eo:'Eniri la DAD-konsilion',en:'Enter the DAD council'})}</Link>
        </div>
        <p className="hero-caption">https://feniksa-civilizo-web4.vercel.app</p>
      </div>
    </section>

    <section className="home-section">
      <div className="section-heading"><div><span className="eyebrow">WHY JOIN</span><h2>{t(locale,{zh:'为什么现在加入？',eo:'Kial aliĝi nun?',en:'Why join now?'})}</h2></div>
      <p>{t(locale,{zh:'因为系统仍在建设中。完成后的系统只能让人参观；正在建设中的系统，才允许人真正参与。',eo:'Ĉar la sistemo ankoraŭ estas konstruata. Finita sistemo permesas ĉefe viziti; konstruata sistemo permesas vere partopreni.',en:'Because the system is still being built. A finished system can be visited; a system under construction can be shaped.'})}</p></div>
    </section>

    {sections.map((s,i)=><section className="home-section" key={i}>
      <span className="eyebrow">{String(i+1).padStart(2,'0')}</span>
      <h2>{t(locale,s.title)}</h2>
      {s.body.map((b,j)=><p key={j}>{t(locale,b)}</p>)}
    </section>)}

    <section className="home-section">
      <div className="section-heading"><div><span className="eyebrow">VOLUNTEER</span><h2>{t(locale,{zh:'我们需要哪些志愿者？',eo:'Kiajn volontulojn ni bezonas?',en:'What volunteers do we need?'})}</h2></div>
      <p>{t(locale,{zh:'每个人不需要什么都会。只要愿意做一件事，并把它做得可靠，就已经是在共建。',eo:'Neniu devas scii ĉion. Se vi volas fari unu aferon kaj fari ĝin fidinde, vi jam partoprenas la komunan konstruadon.',en:'No one needs to know everything. Doing one useful thing reliably is already a real contribution.'})}</p></div>
      <div className="entrance-grid">{roles.map((r,i)=><article className="entrance-card" key={i}><div className="entrance-topline"><span>{String(i+1).padStart(2,'0')}</span><span>VOL</span></div><h3>{t(locale,r)}</h3></article>)}</div>
    </section>

    <section className="home-section home-principles">
      <span className="eyebrow">CALL</span>
      <blockquote>{t(locale,{zh:'让世界语重新成为桥。让学习成为同行的开始。让服务成为共同体的力量。让文明有人传，也有人承。',eo:'Esperanto denove fariĝu ponto. Lernado fariĝu la komenco de kuniro. Servo fariĝu la forto de la komunumo. Civilizo havu homojn, kiuj transdonas, kaj homojn, kiuj heredas.',en:'Let Esperanto become a bridge again. Let learning begin our journey together. Let service become the strength of community. Let civilization be transmitted and carried forward.'})}</blockquote>
      <div className="hero-actions">
        <Link className="button button-primary" href="/register">{t(locale,{zh:'注册学习身份',eo:'Registri lernan identecon',en:'Register a learning identity'})}</Link>
        <Link className="button button-secondary" href="/courses">{t(locale,{zh:'先看看课程',eo:'Unue vidi kursojn',en:'Explore courses first'})}</Link>
      </div>
    </section>
  </main>;
}
