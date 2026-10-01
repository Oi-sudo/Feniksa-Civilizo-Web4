import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listAuditLogs } from '@/lib/audit/data';

export default async function AuditPage(){
  await requireRole('admin');
  const eo=(await getLocale())==='eo';
  const result=await listAuditLogs(100);
  return <main>
    <span className="badge">Audit</span>
    <h1>{eo?'Tutreteja revizia protokolo':'全站审计日志'}</h1>
    <div className="card">
      {result.rows.length?result.rows.map((r:any)=><p key={r.id}>{String(r.created_at)} · {r.action} · {r.entity_type} · {r.entity_id||''}</p>):<p>{eo?'Nun ne estas reviziaj registroj.':'暂无审计记录。'}</p>}
    </div>
  </main>;
}
