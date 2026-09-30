import Link from 'next/link';

export default function WfbPage(){
  return <main>
    <span className="badge">WFB · 五佛币 · Kvin-Budha Registro</span>
    <h1>WFB 五佛币</h1>
    <p className="lead">0.1 Alpha 阶段，WFB 是文化资产、数字博物馆与公共支持的登记层，不是公开交易代币。</p>
    <div className="card-grid">
      <div className="card"><h2>文化资产登记</h2><p>Kulturaj aktivoj</p><p>记录一物一档、来源、证据链、产权与数字展示权。</p></div>
      <div className="card"><h2>数字博物馆</h2><p>Cifereca muzeo</p><p>连接九馆目录、馆藏版本、研究意见与展陈说明。</p></div>
      <div className="card"><h2>公共支持</h2><p>Publika subteno</p><p>记录公共文化支持，不自动等同投资、股权或收益权。</p></div>
    </div>
    <section className="card">
      <h2>0.1 边界</h2>
      <p>不发行 Token，不建立钱包，不提供兑换，不承诺升值，不自动连接 NFT / RWA 市场。</p>
      <p>未来若进入 RWA，必须另行完成权属、鉴定、估值、托管、保险与法律审查。</p>
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/museum">进入数字博物馆</Link><Link className="button button-secondary" href="/dual-wing">查看双翼架构</Link></div>
  </main>;
}
