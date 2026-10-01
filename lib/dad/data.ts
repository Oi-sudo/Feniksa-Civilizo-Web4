import { query } from '@/lib/db';

export type PublicProposal={
  id:string;short_code:string|null;title:string;problem_statement:string;proposed_solution:string;
  budget_requested:string;currency:string;public_value:string|null;risk_description:string|null;
  status:string;created_at:string;updated_at:string;final_outcome:string|null;decision_finalized_at:string|null;
};
export type ProposalDecision={
  id:string;decision_rule:string;eligible_count:number;participation_count:number;approve_count:number;reject_count:number;
  abstain_count:number;revise_count:number;decision_vote_count:number;approvals_required:number;outcome:string;finalized_at:string;
};
export type ProposalStatusEvent={id:string;from_status:string|null;to_status:string;note:string|null;created_at:string};
export type ProposalProject={id:string;title:string;status:string;updated_at:string};

export const publicStatuses=['approved','rejected','executing','completed','terminated','archived'] as const;

export type PublicProposalStatus=(typeof publicStatuses)[number];

export async function getPublicProposals(status?:string){
  const selected=publicStatuses.includes(status as PublicProposalStatus)?status:null;
  const p=await query<PublicProposal>(`SELECT id,short_code,title,problem_statement,proposed_solution,budget_requested::text,currency,
      public_value,risk_description,status::text,created_at::text,updated_at::text,final_outcome,decision_finalized_at::text
    FROM proposals
    WHERE status::text = ANY($1::text[])
      AND ($2::text IS NULL OR status::text=$2)
    ORDER BY COALESCE(decision_finalized_at,updated_at,created_at) DESC, created_at DESC`,[publicStatuses,selected]);
  return p.rows;
}


export type PublicDecisionRecord=ProposalDecision&{
  proposal_id:string;proposal_title:string;proposal_short_code:string|null;proposal_status:string;proposal_updated_at:string;
};

export const publicDecisionOutcomes=['approved','rejected','revision','no_quorum'] as const;
export type PublicDecisionOutcome=(typeof publicDecisionOutcomes)[number];

export async function getPublicDecisions(outcome?:string){
  const selected=publicDecisionOutcomes.includes(outcome as PublicDecisionOutcome)?outcome:null;
  const d=await query<PublicDecisionRecord>(`SELECT d.id,d.proposal_id,d.decision_rule,d.eligible_count,d.participation_count,d.approve_count,
      d.reject_count,d.abstain_count,d.revise_count,d.decision_vote_count,d.approvals_required,d.outcome,d.finalized_at::text,
      p.title AS proposal_title,p.short_code AS proposal_short_code,p.status::text AS proposal_status,p.updated_at::text AS proposal_updated_at
    FROM proposal_decisions d
    JOIN proposals p ON p.id=d.proposal_id
    WHERE p.status::text = ANY($1::text[])
      AND ($2::text IS NULL OR d.outcome=$2)
    ORDER BY d.finalized_at DESC, d.id DESC`,[publicStatuses,selected]);
  return d.rows;
}


export type PublicGovernanceTimelineEvent={
  event_key:string;event_type:string;occurred_at:string;proposal_id:string;proposal_title:string;proposal_short_code:string|null;
  project_id:string|null;project_title:string|null;from_status:string|null;to_status:string|null;outcome:string|null;note:string|null;
};

export async function getPublicGovernanceTimeline(limit=200){
  const r=await query<PublicGovernanceTimelineEvent>(`
    SELECT * FROM (
      SELECT
        'proposal-created-'||p.id::text AS event_key,
        'proposal_created'::text AS event_type,
        p.created_at::text AS occurred_at,
        p.id AS proposal_id,p.title AS proposal_title,p.short_code AS proposal_short_code,
        NULL::uuid AS project_id,NULL::text AS project_title,
        NULL::text AS from_status,p.status::text AS to_status,NULL::text AS outcome,
        NULL::text AS note
      FROM proposals p
      WHERE p.status::text = ANY($1::text[])

      UNION ALL

      SELECT
        'proposal-status-'||e.id::text,
        'proposal_status',
        e.created_at::text,
        p.id,p.title,p.short_code,
        NULL::uuid,NULL::text,
        e.from_status::text,e.to_status::text,NULL::text,e.note
      FROM proposal_status_events e
      JOIN proposals p ON p.id=e.proposal_id
      WHERE p.status::text = ANY($1::text[])

      UNION ALL

      SELECT
        'decision-'||d.id::text,
        'decision',
        d.finalized_at::text,
        p.id,p.title,p.short_code,
        NULL::uuid,NULL::text,
        NULL::text,p.status::text,d.outcome,NULL::text
      FROM proposal_decisions d
      JOIN proposals p ON p.id=d.proposal_id
      WHERE p.status::text = ANY($1::text[])

      UNION ALL

      SELECT
        'project-created-'||prj.id::text,
        'project_created',
        prj.created_at::text,
        p.id,p.title,p.short_code,
        prj.id,prj.title,
        NULL::text,prj.status::text,NULL::text,NULL::text
      FROM projects prj
      JOIN proposals p ON p.id=prj.proposal_id
      WHERE p.status::text = ANY($1::text[])
        AND prj.status IN ('approved','active','paused','completed','terminated','archived')

      UNION ALL

      SELECT
        'project-status-'||e.id::text,
        'project_status',
        e.created_at::text,
        p.id,p.title,p.short_code,
        prj.id,prj.title,
        e.from_status,e.to_status,NULL::text,e.note
      FROM project_status_events e
      JOIN projects prj ON prj.id=e.project_id
      JOIN proposals p ON p.id=prj.proposal_id
      WHERE p.status::text = ANY($1::text[])
        AND prj.status IN ('approved','active','paused','completed','terminated','archived')

      UNION ALL

      SELECT
        'milestone-completed-'||m.id::text,
        'milestone_completed',
        COALESCE(m.completed_at,m.updated_at)::text,
        p.id,p.title,p.short_code,
        prj.id,prj.title,
        NULL::text,m.status::text,NULL::text,m.title
      FROM project_milestones m
      JOIN projects prj ON prj.id=m.project_id
      JOIN proposals p ON p.id=prj.proposal_id
      WHERE p.status::text = ANY($1::text[])
        AND prj.status IN ('approved','active','paused','completed','terminated','archived')
        AND m.status='completed'
    ) timeline
    ORDER BY occurred_at DESC,event_key DESC
    LIMIT $2`,[publicStatuses,limit]);
  return r.rows;
}


export type GovernanceChainIndexItem={
  proposal_id:string;proposal_title:string;proposal_short_code:string|null;proposal_status:string;proposal_created_at:string;
  decision_id:string|null;decision_outcome:string|null;decision_finalized_at:string|null;
  project_id:string|null;project_title:string|null;project_status:string|null;project_created_at:string|null;
  milestone_id:string|null;milestone_title:string|null;milestone_status:string|null;milestone_created_at:string|null;milestone_completed_at:string|null;
};

export async function getGovernanceChainIndex(){
  const r=await query<GovernanceChainIndexItem>(`
    SELECT
      p.id AS proposal_id,p.title AS proposal_title,p.short_code AS proposal_short_code,p.status::text AS proposal_status,p.created_at::text AS proposal_created_at,
      d.id AS decision_id,d.outcome AS decision_outcome,d.finalized_at::text AS decision_finalized_at,
      prj.id AS project_id,prj.title AS project_title,prj.status::text AS project_status,prj.created_at::text AS project_created_at,
      m.id AS milestone_id,m.title AS milestone_title,m.status AS milestone_status,m.created_at::text AS milestone_created_at,m.completed_at::text AS milestone_completed_at
    FROM proposals p
    LEFT JOIN proposal_decisions d ON d.proposal_id=p.id
    LEFT JOIN projects prj ON prj.proposal_id=p.id AND prj.status IN ('approved','active','paused','completed','terminated','archived')
    LEFT JOIN project_milestones m ON m.project_id=prj.id
    WHERE p.status::text = ANY($1::text[])
    ORDER BY COALESCE(d.finalized_at,p.created_at) DESC,p.id,prj.created_at,m.created_at`,[publicStatuses]);
  return r.rows;
}

export async function getPublicProposal(id:string){
  const p=await query<PublicProposal>(`SELECT id,short_code,title,problem_statement,proposed_solution,budget_requested::text,currency,
      public_value,risk_description,status::text,created_at::text,updated_at::text,final_outcome,decision_finalized_at::text
    FROM proposals WHERE id=$1 AND status::text = ANY($2::text[]) LIMIT 1`,[id,publicStatuses]);
  if(!p.rows[0]) return null;
  const [decision,events,projects]=await Promise.all([
    query<ProposalDecision>(`SELECT id,decision_rule,eligible_count,participation_count,approve_count,reject_count,abstain_count,
        revise_count,decision_vote_count,approvals_required,outcome,finalized_at::text
      FROM proposal_decisions WHERE proposal_id=$1 LIMIT 1`,[id]),
    query<ProposalStatusEvent>(`SELECT id,from_status::text,to_status::text,note,created_at::text
      FROM proposal_status_events WHERE proposal_id=$1 ORDER BY created_at ASC`,[id]),
    query<ProposalProject>(`SELECT id,title,status,updated_at::text FROM projects WHERE proposal_id=$1 AND status IN ('approved','active','paused','completed','terminated','archived') ORDER BY updated_at DESC`,[id])
  ]);
  return {proposal:p.rows[0],decision:decision.rows[0]||null,statusEvents:events.rows,projects:projects.rows};
}
