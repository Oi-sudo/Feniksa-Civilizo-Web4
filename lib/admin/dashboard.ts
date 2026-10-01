import { query } from '@/lib/db';

export type AdminDashboardCounts = {
  activeUsers: number; pendingEst: number; pendingBud: number; pendingMuseum: number;
  pendingBudgetChanges: number; redRisks: number; orangeRisks: number; activeProjects: number;
  openProposals: number; unreadNotifications: number;
};

export type DashboardRisk = {
  id: string; project_id: string; project_title: string; risk_level: string;
  description: string; status: string; created_at: string;
};

export type PendingBudgetChange = {
  id: string; project_id: string; project_title: string; amount: string; currency: string;
  note: string | null; requested_by_name: string | null; created_at: string;
};

export type RecentAudit = {
  id: string; action: string; entity_type: string; entity_id: string | null;
  actor_name: string | null; created_at: string;
};

async function scalar(sql: string, params: unknown[] = []) {
  const r = await query<{ count: string }>(sql, params);
  return Number(r.rows[0]?.count ?? 0);
}

export async function getAdminDashboardCounts(): Promise<AdminDashboardCounts> {
  const [activeUsers,pendingEst,pendingBud,pendingMuseum,pendingBudgetChanges,redRisks,orangeRisks,activeProjects,openProposals,unreadNotifications] = await Promise.all([
    scalar(`SELECT COUNT(*)::text count FROM users WHERE account_status='active' AND deleted_at IS NULL`),
    scalar(`SELECT COUNT(*)::text count FROM est_records WHERE review_status='pending' AND revoked_at IS NULL`),
    scalar(`SELECT COUNT(*)::text count FROM bud_records WHERE review_status='pending' AND revoked_at IS NULL`),
    scalar(`SELECT COUNT(*)::text count FROM cultural_assets WHERE workflow_status IN ('draft','review','changes_requested','approved') AND deleted_at IS NULL`),
    scalar(`SELECT COUNT(*)::text count FROM project_budget_events WHERE event_type='budget_change' AND status='pending'`),
    scalar(`SELECT COUNT(*)::text count FROM project_risks WHERE risk_level='red' AND status IN ('open','mitigating')`),
    scalar(`SELECT COUNT(*)::text count FROM project_risks WHERE risk_level='orange' AND status IN ('open','mitigating')`),
    scalar(`SELECT COUNT(*)::text count FROM projects WHERE status IN ('approved','active','paused')`),
    scalar(`SELECT COUNT(*)::text count FROM proposals WHERE status IN ('discussion','revision','voting','approved','executing')`),
    scalar(`SELECT COUNT(*)::text count FROM notifications WHERE read_at IS NULL`)
  ]);
  return { activeUsers,pendingEst,pendingBud,pendingMuseum,pendingBudgetChanges,redRisks,orangeRisks,activeProjects,openProposals,unreadNotifications };
}

export async function getDashboardRisks(limit = 8) {
  return query<DashboardRisk>(`SELECT r.id,r.project_id,p.title project_title,r.risk_level,r.description,r.status,r.created_at
    FROM project_risks r JOIN projects p ON p.id=r.project_id
    WHERE r.status IN ('open','mitigating') AND r.risk_level IN ('red','orange')
    ORDER BY CASE r.risk_level WHEN 'red' THEN 0 ELSE 1 END,r.created_at DESC LIMIT $1`, [limit]);
}

export async function getPendingBudgetChanges(limit = 8) {
  return query<PendingBudgetChange>(`SELECT b.id,b.project_id,p.title project_title,b.amount::text,b.currency,b.note,u.display_name requested_by_name,b.created_at
    FROM project_budget_events b JOIN projects p ON p.id=b.project_id LEFT JOIN users u ON u.id=b.requested_by
    WHERE b.event_type='budget_change' AND b.status='pending'
    ORDER BY b.created_at ASC LIMIT $1`, [limit]);
}

export async function getRecentAudit(limit = 10) {
  return query<RecentAudit>(`SELECT a.id,a.action,a.entity_type,a.entity_id,u.display_name actor_name,a.created_at
    FROM audit_logs a LEFT JOIN users u ON u.id=a.user_id
    ORDER BY a.created_at DESC LIMIT $1`, [limit]);
}

export async function getProjectOperationsOverview() {
  const [risks, budgets] = await Promise.all([
    query<DashboardRisk>(`SELECT r.id,r.project_id,p.title project_title,r.risk_level,r.description,r.status,r.created_at
      FROM project_risks r JOIN projects p ON p.id=r.project_id
      WHERE r.status IN ('open','mitigating') ORDER BY CASE r.risk_level WHEN 'red' THEN 0 WHEN 'orange' THEN 1 WHEN 'yellow' THEN 2 ELSE 3 END,r.created_at DESC LIMIT 100`),
    query<PendingBudgetChange>(`SELECT b.id,b.project_id,p.title project_title,b.amount::text,b.currency,b.note,u.display_name requested_by_name,b.created_at
      FROM project_budget_events b JOIN projects p ON p.id=b.project_id LEFT JOIN users u ON u.id=b.requested_by
      WHERE b.event_type='budget_change' AND b.status='pending' ORDER BY b.created_at ASC LIMIT 100`)
  ]);
  return { risks: risks.rows, budgets: budgets.rows };
}
