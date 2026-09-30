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
      <div className="stat-card"><strong>{d.pendingMuseum}</strong><span>馆藏待审</span></div>
      <div className="stat-card"><strong>{d.redRisks}</strong><span>红色风险</span></div>
    </section>
  </main>;
}
