import Link from 'next/link';

export default function DadPage(){
  const stages=['提出问题','公开讨论','形成提案','专业评估','正式表决','项目执行','里程碑与风险','成果与审计'];
  return <main>
    <span className="badge">DAD · 愿力自治道</span>
    <h1>DAD 议事厅</h1>
    <p className="lead">把公共意见变成可讨论、可决定、可执行、可审计的协作流程。</p>
    <div className="card-grid">
      {stages.map((s,i)=><div className="card" key={s}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h2>{s}</h2></div>)}
    </div>
    <section className="card">
      <h2>治理边界</h2>
      <p>一人一治理身份；财富不购买治理权；AI可以摘要、翻译与检索，但不能代替人决定提案是否通过，也不能自动移动资金。</p>
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/projects">查看项目执行</Link><Link className="button button-secondary" href="/login">登录进入成员功能</Link></div>
  </main>;
}
