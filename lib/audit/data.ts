import { query } from '@/lib/db';

export async function listAuditLogs(limit=200){
  return query(`SELECT a.id,a.audit_seq,a.action,a.entity_type,a.entity_id,a.old_value,a.new_value,a.severity,a.reason,a.prev_hash,a.event_hash,a.created_at,u.display_name actor_name
    FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.audit_seq DESC LIMIT $1`,[limit]);
}

export async function auditStats(){
  const r=await query<{total:string;critical:string;warning:string}>(`SELECT COUNT(*)::text total,
    COUNT(*) FILTER(WHERE severity='critical')::text critical,
    COUNT(*) FILTER(WHERE severity='warning')::text warning FROM audit_logs`);
  const x=r.rows[0];
  return {total:+x.total,critical:+x.critical,warning:+x.warning};
}
