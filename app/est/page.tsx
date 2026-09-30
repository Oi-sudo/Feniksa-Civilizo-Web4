import Link from 'next/link';

export default function EstPage(){
  return <main>
    <span className="badge">EST · 世界语币 · Esperanto-Kontribua Registro</span>
    <h1>EST 世界语币</h1>
    <p className="lead">记录世界语学习、教育、翻译与语言知识贡献。0.1 Alpha 中它是可审核的贡献记录，不是公开交易代币。</p>
    <div className="card-grid">
      <div className="card"><h2>学习 · Lernado</h2><p>课程完成、持续学习与受控语言训练可以留下学习记录。</p></div>
      <div className="card"><h2>翻译 · Tradukado</h2><p>经审校的世界语翻译、术语整理与教材贡献可以登记。</p></div>
      <div className="card"><h2>教学 · Instruado</h2><p>世界语教学、课程整理与学习支持可以形成贡献档案。</p></div>
      <div className="card"><h2>知识 · Scio</h2><p>研究、词汇、受控语言与文明文献贡献可以进入审核流程。</p></div>
    </div>
    <section className="card">
      <h2>0.1 边界</h2>
      <p>EST 不可交易、不能提现、不承诺升值，也不自动产生 DAD 治理权。</p>
      <p>正式数值由规则与审核决定，用户不能自行填写奖励数量。</p>
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/courses">进入世界语文明大学</Link><Link className="button button-secondary" href="/login">登录后查看个人记录</Link></div>
  </main>;
}
