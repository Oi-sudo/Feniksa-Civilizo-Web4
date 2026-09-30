import { requireAdminPage } from '@/lib/permissions/rbac';
import { getAdminDashboard } from '@/lib/admin/dashboard';
export default async function AdminPage(){await requireAdminPage();const d=await getAdminDashboard();return <main><span className="badge">Admin</span><h1>管理员 Dashboard</h1><div className="stat-grid"><div className="stat-card"><strong>{d.estPending}</strong><span>EST待审</span></div><div className="stat-card"><strong>{d.budPending}</strong><span>BUD待审</span></div><div className="stat-card"><strong>{d.museumPending}</strong><span>馆藏待审</span></div></div></main>;}
