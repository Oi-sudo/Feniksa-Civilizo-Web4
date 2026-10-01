import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function TaohuayuanPage(){
  const eo=(await getLocale())==='eo';
  return <main>
    <span className="badge">{eo?'3D Persikflora Lando':'3D 桃花源 · Persikflora Lando'}</span>
    <h1>{eo?'Feniksa Civilizo · 3D Persikflora Lando':'凤凰文明 3D 桃花源'}</h1>
    <p className="lead">{eo?'La spaca tavolo plu konstruiĝas. Nun ni konservas alireblajn civilizajn enirejojn, por ke nekompletaj 3D-moduloj ne kaŭzu 404-paĝojn.':'空间层正在继续建设。当前先保留可进入的文明入口，不让尚未完成的3D模块造成404。'}</p>
    <div className="card-grid">
      <div className="card"><h2>{eo?'Urbo kaj transporto':'城市与交通'}</h2>{!eo&&<p>Urbo kaj transporto</p>}</div>
      <div className="card"><h2>{eo?'Lernejoj kaj Esperanta Universitato':'学校与世界语大学'}</h2>{!eo&&<p>Lernejoj kaj Esperanta Universitato</p>}</div>
      <div className="card"><h2>{eo?'DAD-konsilio kaj projektoj':'DAD议事与项目'}</h2>{!eo&&<p>DAD-konsilio kaj projektoj</p>}</div>
      <div className="card"><h2>{eo?'Prizorgo por maljunuloj':'长者康养'}</h2>{!eo&&<p>Prizorgo por maljunuloj</p>}</div>
      <div className="card"><h2>{eo?'Budhisma Studhalo':'佛法修学馆'}</h2>{!eo&&<p>Budhisma Studhalo</p>}</div>
      <div className="card"><h2>{eo?'Naŭ-hala Cifereca Muzeo':'九馆数字博物馆'}</h2>{!eo&&<p>Naŭ-hala Cifereca Muzeo</p>}</div>
    </div>
    <div className="hero-actions">
      <a className="button button-primary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">{eo?'Malfermi la malnovan dulingvan retejon':'打开旧双语站'}</a>
      <Link className="button button-secondary" href="/">{eo?'Reveni al la Web4-ĉefpaĝo':'返回 Web4 首页'}</Link>
    </div>
  </main>;
}
