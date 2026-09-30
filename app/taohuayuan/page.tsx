import Link from 'next/link';

export default function TaohuayuanPage(){
  return <main>
    <span className="badge">3D 桃花源 · Persikflora Lando</span>
    <h1>凤凰文明 3D 桃花源</h1>
    <p className="lead">空间层正在继续建设。当前先保留可进入的文明入口，不让尚未完成的3D模块造成404。</p>
    <div className="card-grid">
      <div className="card"><h2>城市与交通</h2><p>Urbo kaj transporto</p></div>
      <div className="card"><h2>学校与世界语大学</h2><p>Lernejoj kaj Esperanta Universitato</p></div>
      <div className="card"><h2>DAD议事与项目</h2><p>DAD-konsilio kaj projektoj</p></div>
      <div className="card"><h2>长者康养</h2><p>Prizorgo por maljunuloj</p></div>
      <div className="card"><h2>佛法修学馆</h2><p>Budhisma Studhalo</p></div>
      <div className="card"><h2>九馆数字博物馆</h2><p>Naŭ-hala Cifereca Muzeo</p></div>
    </div>
    <div className="hero-actions">
      <a className="button button-primary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">打开旧双语站</a>
      <Link className="button button-secondary" href="/">返回 Web4 首页</Link>
    </div>
  </main>;
}
