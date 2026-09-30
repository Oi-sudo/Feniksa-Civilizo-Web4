import Link from 'next/link';

export default function WfbPage(){
 return <main>
  <span className="badge">WFB · 五佛币 · Kvin-Budha Registro</span><h1>WFB 五佛币</h1>
  <p className="lead">0.1 Alpha 阶段，WFB 是文化资产、数字博物馆与公共支持的登记层，不是公开交易代币。</p>
  <div className="card-grid">
   <div className="card"><h2>一物一档</h2><p>Unu objekto, unu dosiero</p><p>每件文化资产建立永久编号、主馆籍、来源与证据链。</p></div>
   <div className="card"><h2>状态分层</h2><p>Aŭtentigo · Posedo · Takso</p><p>鉴定、产权、估值、数字展示权分别保存，不互相冒充。</p></div>
   <div className="card"><h2>数字博物馆</h2><p>Cifereca muzeo</p><p>审核通过的档案进入九馆公开目录，并保留版本历史。</p></div>
   <div className="card"><h2>公共支持</h2><p>Publika subteno</p><p>公共文化支持可以登记，但不自动变成投资、股权或收益权。</p></div>
  </div>
  <section className="card"><h2>0.1 登记链</h2><p>实物/文献 → 建立一物一档 → 原始证据 → 主馆籍 → 馆藏审核 → 状态分层 → 公开展陈 → 版本留痕。</p></section>
  <section className="card"><h2>0.1 边界</h2><p>不发行 Token，不建立钱包，不提供兑换，不承诺升值，不自动连接 NFT / RWA 市场。未来进入 RWA 必须另行完成权属、鉴定、估值、托管、保险与法律审查。</p></section>
  <div className="hero-actions"><Link className="button button-primary" href="/wfb/intake">登记文化资产</Link><Link className="button button-secondary" href="/museum">进入数字博物馆</Link><Link className="button button-secondary" href="/dual-wing">查看双翼架构</Link></div>
 </main>;
}
