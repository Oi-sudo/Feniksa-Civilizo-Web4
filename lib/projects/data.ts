import { query } from '@/lib/db';

export type ProjectListItem={
  id:string; title:string; description:string|null; status:string; risk_level:string;
  approved_budget:string; spent:string; currency:string; start_date:string|null;
  target_end_date:string|null; updated_at:string; manager_name:string|null;
};

export type ProjectDetail=ProjectListItem & {
  actual_end_date:string|null; completed_summary:string|null; terminated_reason:string|null;
  proposal_id:string|null; proposal_title:string|null; proposal_short_code:string|null;
  proposal_outcome:string|null; proposal_decision_finalized_at:string|null; proposal_decision_id:string|null;
};

export type ProjectMilestone={id:string;title:string;description:string|null;due_date:string|null;status:string;completed_at:string|null;updated_at:string};
export type ProjectOutput={id:string;output_type:string;title:string;url:string|null;status:string;description:string|null;created_at:string};
export type ProjectRisk={id:string;risk_level:string;description:string;mitigation:string|null;status:string;created_at:string;resolved_at:string|null;updated_at:string};
export type ProjectStatusEvent={id:string;from_status:string|null;to_status:string;note:string|null;created_at:string;actor_name:string|null};
export type ProjectBudgetEvent={id:string;event_type:string;amount:string;currency:string;note:string|null;status:string;created_at:string;resolved_at:string|null;requested_by_name:string|null;approved_by_name:string|null};
export type ProjectContributionSummary={est_count:number;est_value:string;bud_count:number;bud_value:string;bud_hours:string};

export async function listVisibleProjects(limit=50){
  const r=await query<ProjectListItem>(`SELECT p.id,p.title,p.description,p.status,p.risk_level::text,
      p.approved_budget::text,p.spent::text,p.currency,p.start_date::text,p.target_end_date::text,p.updated_at::text,
      u.display_name AS manager_name
    FROM projects p
    LEFT JOIN users u ON u.id=p.manager_id
    WHERE p.status IN ('approved','active','paused','completed','terminated','archived')
    ORDER BY CASE p.status WHEN 'active' THEN 1 WHEN 'approved' THEN 2 WHEN 'paused' THEN 3 WHEN 'completed' THEN 4 WHEN 'terminated' THEN 5 ELSE 6 END,
             p.updated_at DESC
    LIMIT $1`,[limit]);
  return r.rows;
}

export async function getVisibleProject(id:string){
  const p=await query<ProjectDetail>(`SELECT p.id,p.title,p.description,p.status,p.risk_level::text,
      p.approved_budget::text,p.spent::text,p.currency,p.start_date::text,p.target_end_date::text,p.actual_end_date::text,
      p.completed_summary,p.terminated_reason,p.updated_at::text,u.display_name AS manager_name,
      p.proposal_id,pr.title AS proposal_title,pr.short_code AS proposal_short_code,
      pr.final_outcome AS proposal_outcome,pr.decision_finalized_at::text AS proposal_decision_finalized_at,pd.id AS proposal_decision_id
    FROM projects p LEFT JOIN users u ON u.id=p.manager_id LEFT JOIN proposals pr ON pr.id=p.proposal_id LEFT JOIN proposal_decisions pd ON pd.proposal_id=pr.id
    WHERE p.id=$1 AND p.status IN ('approved','active','paused','completed','terminated','archived') LIMIT 1`,[id]);
  if(!p.rows[0]) return null;
  const [milestones,outputs,risks,statusEvents,budgetEvents,contributions]=await Promise.all([
    query<ProjectMilestone>(`SELECT id,title,description,due_date::text,status,completed_at::text,updated_at::text FROM project_milestones WHERE project_id=$1 ORDER BY due_date ASC NULLS LAST,title`,[id]),
    query<ProjectOutput>(`SELECT id,output_type,title,url,status::text,description,created_at::text FROM project_outputs WHERE project_id=$1 ORDER BY created_at DESC`,[id]),
    query<ProjectRisk>(`SELECT id,risk_level::text,description,mitigation,status,created_at::text,resolved_at::text,updated_at::text FROM project_risks WHERE project_id=$1 ORDER BY CASE risk_level WHEN 'red' THEN 1 WHEN 'orange' THEN 2 WHEN 'yellow' THEN 3 ELSE 4 END,created_at DESC`,[id]),
    query<ProjectStatusEvent>(`SELECT e.id,e.from_status,e.to_status,e.note,e.created_at::text,u.display_name AS actor_name FROM project_status_events e LEFT JOIN users u ON u.id=e.actor_id WHERE e.project_id=$1 ORDER BY e.created_at DESC`,[id]),
    query<ProjectBudgetEvent>(`SELECT e.id,e.event_type,e.amount::text,e.currency,e.note,e.status,e.created_at::text,e.resolved_at::text,ur.display_name AS requested_by_name,ua.display_name AS approved_by_name FROM project_budget_events e LEFT JOIN users ur ON ur.id=e.requested_by LEFT JOIN users ua ON ua.id=e.approved_by WHERE e.project_id=$1 ORDER BY e.created_at DESC`,[id]),
    query<ProjectContributionSummary>(`SELECT
      (SELECT COUNT(*)::int FROM est_records WHERE project_id=$1 AND review_status='approved' AND revoked_at IS NULL) AS est_count,
      COALESCE((SELECT SUM(est_value) FROM est_records WHERE project_id=$1 AND review_status='approved' AND revoked_at IS NULL),0)::text AS est_value,
      (SELECT COUNT(*)::int FROM bud_records WHERE project_id=$1 AND review_status='approved' AND revoked_at IS NULL) AS bud_count,
      COALESCE((SELECT SUM(bud_value) FROM bud_records WHERE project_id=$1 AND review_status='approved' AND revoked_at IS NULL),0)::text AS bud_value,
      COALESCE((SELECT SUM(hours) FROM bud_records WHERE project_id=$1 AND review_status='approved' AND revoked_at IS NULL),0)::text AS bud_hours`,[id])
  ]);
  return {project:p.rows[0],milestones:milestones.rows,outputs:outputs.rows,risks:risks.rows,statusEvents:statusEvents.rows,budgetEvents:budgetEvents.rows,contributions:contributions.rows[0]};
}
