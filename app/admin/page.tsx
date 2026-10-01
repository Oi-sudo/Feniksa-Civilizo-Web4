import { requireRole } from '@/lib/permissions/rbac';
import { getAdminDashboardCounts } from '@/lib/admin/dashboard';

export default async function AdminPage(){
  await requireRole('admin');
  const d=await getAdminDashboardCounts();
  return <main>
    <span className="badge">Admin</span>
    <h1>管理员 Dashboard</h1>
    <section className="stat-grid">
      <div className="stat-card"><strong>{d.pendingEst}</strong><span>EST待审</span></div>
      <div className="stat-card"><strong>{d.pendingBud}</strong><span>BUD待审</span></div>
      <div className="stat-card"><strong>{d.pendingMuseum}</strong><span>馆藏待整理</span></div>
      <div className="stat-card"><strong>{d.redRisks}</strong><span>红色风险</span></div>
    </section>
    <div className="hero-actions"><a className="button button-primary" href="/admin/museum">整理馆藏资料</a><a className="button button-secondary" href="/admin/bud">审核 BUD</a><a className="button button-secondary" href="/admin/audit">查看审计日志</a></div>
  </main>;
}
