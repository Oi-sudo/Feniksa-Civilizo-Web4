import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

const copy={
 zh:{badge:'3D 桃花源 · 佛法修学',title:'佛法修学区',lead:'这里作为经典学习、受控世界语佛经翻译、六爻修习阅读与数字馆藏之间的公共学习入口。它服务学习与文化传播，不认证个人修证果位。',cards:[['经典学习','进入已经登记并逐步发布的课程与双语教材。'],['受控翻译','把术语一致、版本可追踪和逐段对照作为佛经翻译的基本方法。'],['佛法馆藏','把经书、佛像、法器和相关文化资料作为学习与数字赏玩档案保存。']],rule:'修学原则',ruleText:'经典、术语、注释与个人体会应分层呈现；课程完成只是学习记录，不等于宗教果位、人格等级或治理权。',courses:'进入课程',museum:'进入数字博物馆',back:'返回3D桃花源'},
 eo:{badge:'3D Persikflora Lando · Budhisma studado',title:'Budhisma studzono',lead:'Ĉi tiu zono estas publika lerna enirejo inter sutra studado, kontrolita Esperanta tradukado de budhismaj tekstoj, ses-linia praktika legado kaj ciferecaj kolektoj. Ĝi servas lernadon kaj kulturan disvastigon, ne atestas personan religian atingon.',cards:[['Sutra studado','Eniri jam registritajn kaj iom post iom publikigitajn kursojn kaj dulingvajn lernomaterialojn.'],['Kontrolita tradukado','Uzi terminologian konsekvencon, version-spureblon kaj aline-post-alinean komparon kiel bazan metodon.'],['Budhismaj kolektoj','Konservi sutrojn, budhajn bildojn, ritajn objektojn kaj rilatajn kulturajn materialojn kiel lernajn kaj ciferecajn ĝuajn dosierojn.']],rule:'Principo de studado',ruleText:'Sutroj, terminoj, komentoj kaj personaj spertoj devas esti prezentataj laŭ apartaj tavoloj. Kurskompletigo estas lernoregistro, ne religia atingo, persona rango aŭ regrajto.',courses:'Eniri kursojn',museum:'Eniri la Ciferecan Muzeon',back:'Reveni al 3D Persikflora Lando'},
 en:{badge:'3D Peach Blossom Land · Buddhist Study',title:'Buddhist Study District',lead:'This district is a public learning entry point connecting sutra study, controlled Esperanto translation of Buddhist texts, six-line practice reading and digital collections. It serves learning and cultural transmission; it does not certify personal religious attainment.',cards:[['Sutra study','Enter registered courses and bilingual learning materials as they are progressively published.'],['Controlled translation','Use terminological consistency, version traceability and paragraph-by-paragraph comparison as the basic translation method.'],['Buddhist collections','Preserve sutras, Buddha images, ritual objects and related cultural materials as learning and digital-appreciation records.']],rule:'Study principle',ruleText:'Sutras, terminology, commentary and personal experience should be presented in separate layers. Course completion is a learning record, not religious attainment, personal rank or governance rights.',courses:'Enter courses',museum:'Enter the Digital Museum',back:'Back to 3D Peach Blossom Land'}
};

export default async function BuddhistStudyPage(){
 const locale=await getLocale(); const t=locale==='eo'?copy.eo:locale==='en'?copy.en:copy.zh;
 return <main><span className="badge">{t.badge}</span><h1>{t.title}</h1><p className="lead">{t.lead}</p>
  <div className="card-grid">{t.cards.map(([h,p])=><section className="card" key={h}><h2>{h}</h2><p>{p}</p></section>)}</div>
  <section className="card home-section"><h2>{t.rule}</h2><p>{t.ruleText}</p></section>
  <div className="hero-actions"><Link className="button button-primary" href="/courses">{t.courses}</Link><Link className="button button-secondary" href="/museum">{t.museum}</Link><Link className="button button-secondary" href="/taohuayuan">{t.back}</Link></div>
 </main>;
}
