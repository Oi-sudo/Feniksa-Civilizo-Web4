import Link from 'next/link';

const routes=[
  ['首页','/'],
  ['世界语文明大学','/courses'],
  ['3D桃花源','/taohuayuan'],
  ['数字博物馆','/museum'],
  ['DAD议事厅','/dad'],
  ['学习护照','/passport'],
  ['EST世界语币','/est'],
  ['BUD佛光币','/bud'],
  ['WFB五佛币','/wfb'],
  ['项目执行','/projects'],
  ['双翼说明','/dual-wing'],
  ['健康检查','/api/health']
];

export default function StatusPage(){
  return <main>
    <span className="badge">Alpha Route Status</span>
    <h1>凤凰文明 Web4 0.1 入口状态</h1>
    <p className="lead">这一页用于上线验收：先保证主要入口都能打开，再逐页补充完整教材、馆藏、治理与项目功能。</p>
    <div className="card-grid">
      {routes.map(([name,href])=><Link className="card" href={href} key={href}><h2>{name}</h2><p>{href}</p><span className="card-link">打开 →</span></Link>)}
    </div>
    <section className="card">
      <h2>双翼并行</h2>
      <p>旧 Netlify 双语站继续保存已经公开的文明内容；新 Render Alpha 负责动态 Web4 功能。</p>
      <a className="button button-secondary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">打开旧双语站</a>
    </section>
  </main>;
}
