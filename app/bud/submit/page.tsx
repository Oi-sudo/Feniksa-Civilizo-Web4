import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { listUserProjects } from '@/lib/bud/data';
import BudSubmitForm from '@/components/bud/BudSubmitForm';

export default async function BudSubmitPage(){
  const user=await requireSignedIn();
  const projects=await listUserProjects(user.id);
  return <main>
    <span className="badge">BUD · 愿行记录</span>
    <h1>提交公共服务记录</h1>
    <p className="lead">记录真实发生的愿行、志愿服务和公共服务。提交不是自动获得 BUD；系统需要项目确认（如适用）与管理审核。</p>
    <section className="card"><BudSubmitForm projects={projects}/></section>
    <Link className="button button-secondary" href="/passport/bud">返回我的 BUD 记录</Link>
  </main>;
}
