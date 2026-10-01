import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function TaohuayuanPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'3D Persikflora Lando':en?'3D Peach Blossom Land':'3D 桃花源 · Persikflora Lando'}</span>
    <h1>{eo?'Feniksa Civilizo · 3D Persikflora Lando':en?'Phoenix Civilization · 3D Peach Blossom Land':'凤凰文明 3D 桃花源'}</h1>
    <p className="lead">{eo?'La spaca tavolo plu konstruiĝas. Nun ni konservas alireblajn civilizajn enirejojn, por ke nekompletaj 3D-moduloj ne kaŭzu 404-paĝojn.':en?'The spatial layer is still under construction. For now, accessible civilization entries are preserved so unfinished 3D modules do not lead to 404 pages.':'空间层正在继续建设。当前先保留可进入的文明入口，不让尚未完成的3D模块造成404。'}</p>
    <div className="card-grid">
      <div className="card"><h2>{eo?'Urbo kaj transporto':en?'City and transport':'城市与交通'}</h2>{locale==='zh'&&<p>Urbo kaj transporto</p>}</div>
      <div className="card"><h2>{eo?'Lernejoj kaj Esperanta Universitato':en?'Schools and Esperanto University':'学校与世界语大学'}</h2>{locale==='zh'&&<p>Lernejoj kaj Esperanta Universitato</p>}</div>
      <div className="card"><h2>{eo?'DAD-konsilio kaj projektoj':en?'DAD council and projects':'DAD议事与项目'}</h2>{locale==='zh'&&<p>DAD-konsilio kaj projektoj</p>}</div>
      <div className="card"><h2>{eo?'Prizorgo por maljunuloj':en?'Elder care and wellbeing':'长者康养'}</h2>{locale==='zh'&&<p>Prizorgo por maljunuloj</p>}</div>
      <div className="card"><h2>{eo?'Budhisma Studhalo':en?'Buddhist Study Hall':'佛法修学馆'}</h2>{locale==='zh'&&<p>Budhisma Studhalo</p>}</div>
      <div className="card"><h2>{eo?'Naŭ-hala Cifereca Muzeo':en?'Nine-Hall Digital Museum':'九馆数字博物馆'}</h2>{locale==='zh'&&<p>Naŭ-hala Cifereca Muzeo</p>}</div>
    </div>
    <div className="hero-actions">
      <a className="button button-primary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">{eo?'Malfermi la malnovan dulingvan retejon':en?'Open the old bilingual site':'打开旧双语站'}</a>
      <Link className="button button-secondary" href="/">{eo?'Reveni al la Web4-ĉefpaĝo':en?'Back to Web4 home':'返回 Web4 首页'}</Link>
    </div>
  </main>;
}
