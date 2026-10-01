import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

const routesZh=[
  ['首页','/'],['世界语文明大学','/courses'],['3D桃花源','/taohuayuan'],['数字博物馆','/museum'],
  ['DAD议事厅','/dad'],['学习护照','/passport'],['EST世界语币','/est'],['BUD佛光币','/bud'],
  ['WFB五佛币','/wfb'],['项目执行','/projects'],['双翼说明','/dual-wing'],['健康检查','/api/health']
];
const routesEn=[['Home','/'],['Esperanto Civilization University','/courses'],['3D Peach Blossom Land','/taohuayuan'],['Digital Museum','/museum'],['DAD Council','/dad'],['Learning Passport','/passport'],['EST record','/est'],['BUD record','/bud'],['WFB record','/wfb'],['Project execution','/projects'],['Dual-wing explanation','/dual-wing'],['Health check','/api/health']];
const routesEo=[
  ['Ĉefpaĝo','/'],['Esperanta Civiliza Universitato','/courses'],['3D Persikflora Lando','/taohuayuan'],['Cifereca Muzeo','/museum'],
  ['DAD-Konsilio','/dad'],['Lernopasporto','/passport'],['EST-registro','/est'],['BUD-registro','/bud'],
  ['WFB-registro','/wfb'],['Projekta plenumado','/projects'],['Du-flugila klarigo','/dual-wing'],['Sankontrolo','/api/health']
];

export default async function StatusPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const routes=eo?routesEo:en?routesEn:routesZh;
  return <main>
    <span className="badge">Alpha Route Status</span>
    <h1>{eo?'Feniksa Civilizo Web4 0.1 · stato de enirejoj':en?'Phoenix Civilization Web4 0.1 · entry status':'凤凰文明 Web4 0.1 入口状态'}</h1>
    <p className="lead">{eo?'Ĉi tiu paĝo servas al lanĉa kontrolo: unue certigi, ke la ĉefaj enirejoj malfermiĝas, poste paŝo post paŝo kompletigi lernomaterialojn, kolektojn, regadon kaj projektajn funkciojn.':en?'This page is for launch verification: first make sure the main entries open, then progressively complete learning materials, collections, governance and project functions.':'这一页用于上线验收：先保证主要入口都能打开，再逐页补充完整教材、馆藏、治理与项目功能。'}</p>
    <div className="card-grid">
      {routes.map(([name,href])=><Link className="card" href={href} key={href}><h2>{name}</h2><p>{href}</p><span className="card-link">{eo?'Malfermi →':en?'Open →':'打开 →'}</span></Link>)}
    </div>
    <section className="card">
      <h2>{eo?'Du flugiloj paralele':en?'Dual wings in parallel':'双翼并行'}</h2>
      <p>{eo?'La malnova dulingva retejo ĉe Netlify daŭre konservas jam publikigitan civilizan enhavon; la nova Render Alpha portas la dinamikajn Web4-funkciojn.':en?'The old bilingual Netlify site preserves already published civilization content; the new Render Alpha site carries the dynamic Web4 functions.':'旧 Netlify 双语站继续保存已经公开的文明内容；新 Render Alpha 负责动态 Web4 功能。'}</p>
      <a className="button button-secondary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">{eo?'Malfermi la malnovan dulingvan retejon':en?'Open the old bilingual site':'打开旧双语站'}</a>
    </section>
  </main>;
}
