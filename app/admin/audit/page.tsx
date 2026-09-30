import { requireAdminPage } from '@/lib/permissions/rbac';
import { listAuditLogs } from '@/lib/audit/data';
export default async function AuditPage(){await requireAdminPage();const rows=await listAuditLogs({limit:100});return <main><span className="badge">Audit</span><h1>全站审计日志</h1><div className="card">{rows.map((r:any)=><p key={r.id}>{String(r.timestamp)} · {r.action} · {r.entity_type} · {r.entity_id||''}</p>)}</div></main>;}
