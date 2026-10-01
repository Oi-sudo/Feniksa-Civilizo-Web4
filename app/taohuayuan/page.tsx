import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function TaohuayuanPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'3D Persikflora Lando':en?'3D Peach Blossom Land':'3D 桃花源 · Persikflora Lando'}</span>
    <h1>{eo?'Feniksa Civilizo · 3D Persikflora Lando':en?'Phoenix Civilization · 3D Peach Blossom Land':'凤凰文明 3D 桃花源'}</h1>
    <p className="lead">{eo?'La spaca tavolo plu konstruiĝas. Nun ni konservas alireblajn civilizajn enirejojn, por ke nekompletaj 3D-moduloj ne kaŭzu 404-paĝojn.':en?'The spatial layer is still under construction. For now, accessible civilization entries are preserved so unfinished 3D modules do not lead to 404 pages.':'空间层正在继续建设。当前先保留可进入的文明入口，不让尚未完成的3D模块造成404。'}</p>
    <section className="taohuayuan-map" aria-label={eo?'Civiliza spaca navigado':en?'Civilization spatial navigation':'文明空间导航'}>
      <Link className="taohuayuan-node node-city" href="/taohuayuan/city"><span>01</span><strong>{eo?'Urbo kaj transporto':en?'City and transport':'城市与交通'}</strong><small>{eo?'Spaca vojo':en?'Spatial route':'空间路径'}</small></Link>
      <Link className="taohuayuan-node node-school" href="/courses"><span>02</span><strong>{eo?'Lernejoj kaj Esperanta Universitato':en?'Schools and Esperanto University':'学校与世界语大学'}</strong><small>{eo?'Lernado':en?'Learning':'学习'}</small></Link>
      <Link className="taohuayuan-node node-dad" href="/dad"><span>03</span><strong>{eo?'DAD-konsilio':en?'DAD council':'DAD议事区'}</strong><small>{eo?'Regado':en?'Governance':'治理'}</small></Link>
      <Link className="taohuayuan-node node-projects" href="/projects"><span>04</span><strong>{eo?'Projekta plenumzono':en?'Project execution district':'项目执行区'}</strong><small>{eo?'Ago kaj respondeco':en?'Action & responsibility':'行动与责任'}</small></Link>
      <Link className="taohuayuan-node node-elder" href="/taohuayuan/eldercare"><span>05</span><strong>{eo?'Prizorgo por maljunuloj':en?'Elder care and wellbeing':'长者康养'}</strong><small>{eo?'Reciproka subteno':en?'Mutual support':'互助'}</small></Link>
      <Link className="taohuayuan-node node-buddhist" href="/taohuayuan/buddhist-study"><span>06</span><strong>{eo?'Budhisma studzono':en?'Buddhist Study District':'佛法修学区'}</strong><small>{eo?'Sutroj kaj tradukado':en?'Sutras & translation':'经典与翻译'}</small></Link>
      <Link className="taohuayuan-node node-museum" href="/museum"><span>07</span><strong>{eo?'Naŭ-hala Cifereca Muzeo':en?'Nine-Hall Digital Museum':'九馆数字博物馆'}</strong><small>{eo?'Kultura memoro':en?'Cultural memory':'文化记忆'}</small></Link>
      <div className="taohuayuan-core" aria-hidden="true">鳳</div>
    </section>
    <section className="card home-section">
      <h2>{eo?'Unua spaca tavolo':en?'First spatial layer':'第一空间层'}</h2>
      <p>{eo?'La sep nodoj nun estas realaj enirejoj. La posta 3D-tavolo povas uzi la samajn stabilajn adresojn por konstrui stratojn, konstruaĵojn, scenojn kaj avataran navigadon sen rompi la jam funkciantan Web4-sistemon.':en?'The seven nodes are now real entry points. A later 3D layer can reuse these stable addresses to build streets, buildings, scenes and avatar navigation without breaking the working Web4 system.':'现在七个节点都是真实入口。后续真正的3D层可以继续沿用这些稳定地址建设街道、建筑、场景和人物导航，而不会破坏已经运行的Web4系统。'}</p>
    </section>
    <div className="hero-actions">
      <a className="button button-primary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">{eo?'Malfermi la malnovan dulingvan retejon':en?'Open the old bilingual site':'打开旧双语站'}</a>
      <Link className="button button-secondary" href="/">{eo?'Reveni al la Web4-ĉefpaĝo':en?'Back to Web4 home':'返回 Web4 首页'}</Link>
    </div>
  </main>;
}
