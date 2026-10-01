import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { getAdminDashboardCounts } from '@/lib/admin/dashboard';

export default async function AdminPage(){
  await requireRole('admin');
  const eo=(await getLocale())==='eo';
  const d=await getAdminDashboardCounts();
  return <main>
    <span className="badge">Admin</span>
    <h1>{eo?'Administra panelo':'管理员 Dashboard'}</h1>
    <section className="stat-grid">
      <div className="stat-card"><strong>{d.pendingEst}</strong><span>{eo?'EST por kontrolo':'EST待审'}</span></div>
      <div className="stat-card"><strong>{d.pendingBud}</strong><span>{eo?'BUD por kontrolo':'BUD待审'}</span></div>
      <div className="stat-card"><strong>{d.pendingMuseum}</strong><span>{eo?'Muzeaj dosieroj por ordigo':'馆藏待整理'}</span></div>
      <div className="stat-card"><strong>{d.redRisks}</strong><span>{eo?'Ruĝaj riskoj':'红色风险'}</span></div>
    </section>
    <div className="hero-actions"><a className="button button-primary" href="/admin/museum">{eo?'Ordigi muzeajn materialojn':'整理馆藏资料'}</a><a className="button button-secondary" href="/admin/bud">{eo?'Kontroli BUD':'审核 BUD'}</a><a className="button button-secondary" href="/admin/audit">{eo?'Vidi revizian protokolon':'查看审计日志'}</a></div>
  </main>;
}
