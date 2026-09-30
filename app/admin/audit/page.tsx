import { requireRole } from '@/lib/permissions/rbac';
import { listAuditLogs } from '@/lib/audit/data';

export default async function AuditPage(){
  await requireRole('admin');
  const result=await listAuditLogs(100);
  return <main>
    <span className="badge">Audit</span>
    <h1>全站审计日志</h1>
    <div className="card">
      {result.rows.length?result.rows.map((r:any)=><p key={r.id}>{String(r.created_at)} · {r.action} · {r.entity_type} · {r.entity_id||''}</p>):<p>暂无审计记录。</p>}
    </div>
  </main>;
}
