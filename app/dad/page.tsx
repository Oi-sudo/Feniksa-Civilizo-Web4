import Link from 'next/link';

export default function DadPage(){
  return <main>
    <span className="badge">DAD</span>
    <h1>DAD 议事厅</h1>
    <p className="lead">提案、讨论、表决与项目执行的公共入口。</p>
    <div className="card">
      <p>治理结构、表决数据表与项目执行迁移已经进入Alpha数据库。完整交互页面将在CI稳定后继续接入。</p>
      <Link href="/projects">查看项目入口</Link>
    </div>
  </main>;
}
