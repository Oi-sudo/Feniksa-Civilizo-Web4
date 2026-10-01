import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

const copy={
 zh:{badge:'3D 桃花源 · 城市交通',title:'凤凰文明城市与交通',lead:'先建立可进入、可扩展的城市交通骨架：中央广场、教育区、议事区、博物馆区、康养区与佛法修学区由步行环线和公共交通线连接。',principle:'交通原则',principleText:'优先步行、公共交通与无障碍通行；未来3D场景只表现空间与服务关系，不把尚未建设的设施写成已经存在。',back:'返回3D桃花源',home:'返回Web4首页',nodes:['中央广场','世界语文明大学','DAD议事区','数字博物馆','长者康养区','佛法修学区']},
 eo:{badge:'3D Persikflora Lando · Urbo kaj transporto',title:'Urbo kaj transporto de Feniksa Civilizo',lead:'Unue ni konstruas alireblan kaj etendeblan urban transportan skeleton: centra placo, eduka zono, konsilia zono, muzea zono, prizorga zono kaj budhisma studzono estas ligitaj per piedira ringo kaj publika transporto.',principle:'Principo de transporto',principleText:'Prioritato estas piedirado, publika transporto kaj alirebleco. Estontaj 3D-scenoj montros spacajn kaj servajn rilatojn sen prezenti ankoraŭ nekonstruitajn instalaĵojn kiel jam ekzistantajn.',back:'Reveni al 3D Persikflora Lando',home:'Reveni al la Web4-ĉefpaĝo',nodes:['Centra placo','Esperanta Civiliza Universitato','DAD-konsilia zono','Cifereca Muzeo','Prizorga zono por maljunuloj','Budhisma studzono']},
 en:{badge:'3D Peach Blossom Land · City & Transport',title:'Phoenix Civilization City & Transport',lead:'We first establish an accessible, extensible urban transport skeleton: a central plaza, education district, council district, museum district, elder-care district and Buddhist study district connected by a walking loop and public transport.',principle:'Transport principle',principleText:'Priority goes to walking, public transport and accessibility. Future 3D scenes will show spatial and service relationships without presenting facilities that have not yet been built as if they already existed.',back:'Back to 3D Peach Blossom Land',home:'Back to Web4 home',nodes:['Central plaza','Esperanto Civilization University','DAD council district','Digital Museum','Elder-care district','Buddhist study district']}
};

export default async function CityPage(){
 const locale=await getLocale(); const t=locale==='eo'?copy.eo:locale==='en'?copy.en:copy.zh;
 const links=['/','/courses','/dad','/museum','/taohuayuan/eldercare','/taohuayuan/buddhist-study'];
 return <main>
  <span className="badge">{t.badge}</span><h1>{t.title}</h1><p className="lead">{t.lead}</p>
  <section className="city-route" aria-label={t.title}>
   {t.nodes.map((n,i)=><Link key={n} href={links[i]} className="city-stop"><span>{String(i+1).padStart(2,'0')}</span><strong>{n}</strong></Link>)}
  </section>
  <section className="card"><h2>{t.principle}</h2><p>{t.principleText}</p></section>
  <div className="hero-actions"><Link className="button button-primary" href="/taohuayuan">{t.back}</Link><Link className="button button-secondary" href="/">{t.home}</Link></div>
 </main>;
}
