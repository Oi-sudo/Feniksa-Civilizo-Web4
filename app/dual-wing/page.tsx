import Link from 'next/link';

export default function DualWingPage(){
  return <main>
    <span className="badge">双翼并行 · Du Flugiloj</span>
    <h1>凤凰文明双站并行架构</h1>
    <p className="lead">旧站保存已经形成的双语文明内容；新站建设可登录、可记录、可治理的 Web4 动态系统。</p>
    <div className="card-grid">
      <div className="card">
        <span className="eyebrow">左翼 · Malnova Retejo</span>
        <h2>Netlify 双语公开站</h2>
        <p>继续承担文明文献、双语页面、既有馆藏介绍和公开传播。</p>
        <a className="button button-primary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">打开旧站</a>
      </div>
      <div className="card">
        <span className="eyebrow">右翼 · Web4 Alpha</span>
        <h2>Render 动态系统</h2>
        <p>承载学习护照、EST世界语币记录、BUD佛光币记录、WFB五佛币文化资产登记、DAD、项目与审计。</p>
        <Link className="button button-secondary" href="/">进入新站</Link>
      </div>
    </div>
    <section className="card">
      <h2>三币在 0.1 Alpha 的固定定义</h2>
      <p><strong>EST 世界语币：</strong>记录世界语学习、教育、翻译与语言知识贡献。</p>
      <p><strong>BUD 佛光币：</strong>记录愿行、志愿服务与公共服务贡献。</p>
      <p><strong>WFB 五佛币：</strong>记录文化资产、数字博物馆与公共支持；未来 RWA 接口必须另行经过权属、鉴定、估值、托管与法律审查。</p>
      <p className="muted">0.1阶段三者均不提供公开交易、钱包、兑换或投资收益承诺。</p>
    </section>
  </main>;
}
