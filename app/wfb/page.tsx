import Link from 'next/link';

export default function WfbPage(){
 return <main>
  <span className="badge">WFB · 五佛币 · Kvin-Budha Registro</span><h1>WFB 五佛币</h1>
  <p className="lead">0.1 Alpha 阶段，WFB 是个人收藏、文化记忆、数字博物馆与公共支持的登记层，不是公开交易代币。</p>
  <div className="card-grid">
   <div className="card"><h2>一物一档</h2><p>Unu objekto, unu dosiero</p><p>每件个人收藏或文化资料建立永久编号、主馆籍、收藏记录与可续补资料。</p></div>
   <div className="card"><h2>资料分层</h2><p>Kolekta registro · Posedo · Dosiero</p><p>收藏记录、产权、资料说明与数字展示权分别保存，用于文化存录与学习展示。</p></div>
   <div className="card"><h2>数字博物馆</h2><p>Cifereca muzeo</p><p>整理后的档案进入九馆公开目录，并保留版本历史。</p></div>
   <div className="card"><h2>公共支持</h2><p>Publika subteno</p><p>公共文化支持可以登记，但不自动变成投资、股权或收益权。</p></div>
  </div>
  <section className="card"><h2>0.1 登记链</h2><p>实物/文献 → 建立一物一档 → 收藏资料 → 主馆籍 → 资料整理 → 公开展陈 → 版本留痕。</p></section>
  <section className="card"><h2>0.1 边界</h2><p>不发行 Token，不建立钱包，不提供兑换，不承诺升值，不自动连接 NFT / RWA 市场。未来如进入 RWA，必须另行完成权属、专业鉴定、估值、托管、保险与法律审查；这些要求不作为当前数字赏玩展示的前提。</p></section>
  <div className="hero-actions"><Link className="button button-primary" href="/wfb/intake">登记收藏资料</Link><Link className="button button-secondary" href="/museum">进入数字博物馆</Link><Link className="button button-secondary" href="/museum/about">收藏与赏玩说明</Link><Link className="button button-secondary" href="/dual-wing">查看双翼架构</Link></div>
 </main>;
}
