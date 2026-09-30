import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

export default async function BudPage(){
  const u=await getCurrentUser();
  if(!u) redirect('/login');
  return <main>
    <span className="badge">BUD · 0.1</span>
    <h1>BUD 愿行与公共服务</h1>
    <p className="lead">愿行可以留痕，但愿行不能出售；BUD不代表佛法修证等级，也不产生治理权。</p>
    <div className="card"><p>当前Alpha分支已保留BUD数据库结构与审核流程数据表。交互式申报表将在完整运行版合并后接回。</p></div>
  </main>;
}
