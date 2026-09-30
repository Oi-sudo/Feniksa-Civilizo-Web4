import Link from 'next/link';
import { requireRole } from '@/lib/permissions/rbac';
import { listAdminPendingBud } from '@/lib/bud/data';
import BudActionButton from '@/components/bud/BudActionButton';

export default async function AdminBudPage(){
  await requireRole('admin'); const rows=await listAdminPendingBud();
  return <main>
    <span className="badge">Admin · BUD</span><h1>BUD 审核队列</h1>
    <p className="lead">管理员审核事实与服务量；BUD 值由服务器按 BUD-0.1 规则计算，不由用户或审核者手填。</p>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <h2>{r.user_name}</h2><p>{r.description}</p><p>{r.service_type} · 申报小时 {r.hours??'—'} · 项目 {r.project_title??'无'}</p>
      <p>项目确认：<strong>{r.project_confirmation_status}</strong></p>
      {(r.project_confirmation_status==='confirmed'||r.project_confirmation_status==='not_required')?
        <BudActionButton id={r.id} action="approve" label="审核通过并计算 BUD" verifiedHours={r.hours?Number(r.hours):null}/>:
        <p className="muted">项目服务尚未确认，不能批准。</p>}
    </article>)}</div>:<section className="card"><p>目前没有待审核 BUD 记录。</p></section>}
    <Link href="/admin">返回管理员 Dashboard</Link>
  </main>;
}
