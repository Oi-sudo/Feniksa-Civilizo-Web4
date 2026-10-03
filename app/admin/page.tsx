import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { getAdminDashboardCounts } from '@/lib/admin/dashboard';
import { ensureVolunteerTaskSchema } from '@/lib/volunteer/ensure';

export default async function AdminPage(){
  await requireRole('admin');
  await ensureVolunteerTaskSchema();
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const d=await getAdminDashboardCounts();
  return <main>
    <span className="badge">Admin</span>
    <h1>{eo?'Administra panelo':en?'Admin dashboard':'管理员 Dashboard'}</h1>
    <section className="stat-grid">
      <div className="stat-card"><strong>{d.pendingEst}</strong><span>{eo?'EST por kontrolo':en?'EST pending review':'EST待审'}</span></div>
      <div className="stat-card"><strong>{d.pendingBud}</strong><span>{eo?'BUD por kontrolo':en?'BUD pending review':'BUD待审'}</span></div>
      <div className="stat-card"><strong>{d.pendingMuseum}</strong><span>{eo?'Muzeaj dosieroj por ordigo':en?'Museum records to organize':'馆藏待整理'}</span></div>
      <div className="stat-card"><strong>{d.pendingVolunteer}</strong><span>{eo?'Volontulaj rezultoj por kontrolo':en?'Volunteer results pending review':'志愿成果待审'}</span></div>
      <div className="stat-card"><strong>{d.redRisks}</strong><span>{eo?'Ruĝaj riskoj':en?'Red risks':'红色风险'}</span></div>
    </section>
    <div className="hero-actions"><a className="button button-primary" href="/admin/museum">{eo?'Ordigi muzeajn materialojn':en?'Organize museum materials':'整理馆藏资料'}</a><a className="button button-secondary" href="/admin/volunteer">{eo?'Kontroli volontulajn rezultojn':en?'Review volunteer results':'审核志愿成果'}</a><a className="button button-secondary" href="/admin/bud">{eo?'Kontroli BUD':en?'Review BUD':'审核 BUD'}</a><a className="button button-secondary" href="/admin/audit">{eo?'Vidi revizian protokolon':en?'View audit log':'查看审计日志'}</a></div>
  </main>;
}
