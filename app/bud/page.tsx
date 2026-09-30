import Link from 'next/link';

export default function BudPage(){
  return <main>
    <span className="badge">BUD · 佛光币 · Vola-Agada Registro</span>
    <h1>BUD 佛光币</h1>
    <p className="lead">记录愿行、志愿服务与公共服务贡献。愿行可以留痕，但愿行不能出售。</p>
    <div className="card-grid">
      <div className="card"><h2>志愿服务 · Volontula servo</h2><p>为课程、社群、馆藏、长者与公共项目提供服务。</p></div>
      <div className="card"><h2>项目协作 · Projekta kunlaboro</h2><p>参与已登记项目、承担责任并留下可核查成果。</p></div>
      <div className="card"><h2>公共善行 · Publika bono</h2><p>面向公共利益的服务可以记录时间、说明和证据。</p></div>
      <div className="card"><h2>愿行档案 · Vola agado</h2><p>记录行动，不把数字解释为人格价值或佛法修证等级。</p></div>
    </div>
    <section className="card">
      <h2>0.1 边界</h2>
      <p>BUD 不可买卖、不能提现、不等于功德定量，不认证宗教果位，也不自动产生治理权。</p>
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/projects">查看项目执行</Link><Link className="button button-secondary" href="/login">登录后查看个人记录</Link></div>
  </main>;
}
