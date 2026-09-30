import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';

export default async function EstPage(){
  const u=await getCurrentUser();
  if(!u) redirect('/login');
  return <main>
    <span className="badge">EST · 0.1</span>
    <h1>EST 学习与知识贡献</h1>
    <p className="lead">EST只记录世界语、教育与知识贡献；不可交易，不代表投资价值，也不产生治理权。</p>
    <div className="card"><p>当前Alpha分支已保留EST数据库结构与审核流程数据表。交互式申报表将在完整运行版合并后接回。</p></div>
  </main>;
}
