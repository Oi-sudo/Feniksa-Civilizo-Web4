import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import TaohuayuanZoneNav from '@/components/taohuayuan/ZoneNav';

const copy={
 zh:{badge:'3D 桃花源 · 长者康养',title:'长者康养区',lead:'这是凤凰文明桃花源中的长者生活与互助入口。当前版本先定义空间、服务与隐私边界，后续再逐步连接真实课程、志愿服务与公共项目。',cards:[['生活支持','日常陪伴、数字学习、出行与公共服务信息。'],['学习不退休','长者可以继续进入世界语大学、数字博物馆和文化学习。'],['互助而非评级','服务记录可以进入BUD流程，但不把长者或志愿者按数字排名。']],note:'本页是文明原型，不提供医疗诊断、紧急医疗或护理承诺。涉及真实健康服务时，应使用合格的当地医疗与照护机构。',projects:'查看公共项目',bud:'查看BUD愿行记录',back:'返回3D桃花源'},
 eo:{badge:'3D Persikflora Lando · Prizorgo por maljunuloj',title:'Prizorga zono por maljunuloj',lead:'Ĉi tiu estas la enirejo por vivo kaj reciproka subteno de maljunuloj en la Persikflora Lando de Feniksa Civilizo. La nuna versio unue difinas spacon, servojn kaj privatecajn limojn; poste ĝi povas ligi realajn kursojn, volontulan servon kaj publikajn projektojn.',cards:[['Viva subteno','Ĉiutaga akompano, cifereca lernado, transporto kaj informoj pri publikaj servoj.'],['Lernado ne emeritiĝas','Maljunuloj povas plu eniri la Esperantan Universitaton, la Ciferecan Muzeon kaj kulturan lernadon.'],['Reciproka helpo sen rangigo','Servoregistroj povas eniri la BUD-procezon, sed homoj ne estas rangigitaj per nombroj.']],note:'Ĉi tiu paĝo estas civiliza prototipo. Ĝi ne ofertas medicinan diagnozon, urĝan kuracadon aŭ promeson pri flegservo. Por realaj sanservoj oni uzu kvalifikitajn lokajn medicinajn kaj prizorgajn instituciojn.',projects:'Vidi publikajn projektojn',bud:'Vidi BUD-volagadan registron',back:'Reveni al 3D Persikflora Lando'},
 en:{badge:'3D Peach Blossom Land · Elder Care',title:'Elder Care & Wellbeing District',lead:'This is the entry point for elder life and mutual support in Phoenix Civilization’s Peach Blossom Land. The current version first defines space, services and privacy boundaries, then can connect real courses, volunteer service and public projects over time.',cards:[['Everyday support','Companionship, digital learning, mobility and public-service information.'],['Learning does not retire','Older adults can continue into the Esperanto University, Digital Museum and cultural learning.'],['Mutual help without ranking','Service records may enter the BUD process, but people are not ranked by numbers.']],note:'This page is a civilization prototype. It does not provide medical diagnosis, emergency medical care or a promise of care services. Real health services should use qualified local medical and care providers.',projects:'View public projects',bud:'View BUD vow-and-action records',back:'Back to 3D Peach Blossom Land'}
};

export default async function EldercarePage(){
 const locale=await getLocale(); const t=locale==='eo'?copy.eo:locale==='en'?copy.en:copy.zh;
 return <main><span className="badge">{t.badge}</span><h1>{t.title}</h1><p className="lead">{t.lead}</p>
  <div className="card-grid">{t.cards.map(([h,p])=><section className="card" key={h}><h2>{h}</h2><p>{p}</p></section>)}</div>
  <section className="card home-section"><p>{t.note}</p></section>
  <TaohuayuanZoneNav locale={locale} current="elder" />
  <div className="hero-actions"><Link className="button button-primary" href="/projects">{t.projects}</Link><Link className="button button-secondary" href="/bud">{t.bud}</Link><Link className="button button-secondary" href="/taohuayuan">{t.back}</Link></div>
 </main>;
}
