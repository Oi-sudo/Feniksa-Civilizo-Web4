import { query } from '@/lib/db';

export type PublicProposal={
  id:string;short_code:string|null;title:string;problem_statement:string;proposed_solution:string;
  budget_requested:string;currency:string;public_value:string|null;risk_description:string|null;
  status:string;created_at:string;updated_at:string;final_outcome:string|null;decision_finalized_at:string|null;
};
export type ProposalDecision={
  decision_rule:string;eligible_count:number;participation_count:number;approve_count:number;reject_count:number;
  abstain_count:number;revise_count:number;decision_vote_count:number;approvals_required:number;outcome:string;finalized_at:string;
};
export type ProposalStatusEvent={id:string;from_status:string|null;to_status:string;note:string|null;created_at:string};
export type ProposalProject={id:string;title:string;status:string;updated_at:string};

const publicStatuses=['approved','rejected','executing','completed','terminated','archived'];

export async function getPublicProposal(id:string){
  const p=await query<PublicProposal>(`SELECT id,short_code,title,problem_statement,proposed_solution,budget_requested::text,currency,
      public_value,risk_description,status::text,created_at::text,updated_at::text,final_outcome,decision_finalized_at::text
    FROM proposals WHERE id=$1 AND status::text = ANY($2::text[]) LIMIT 1`,[id,publicStatuses]);
  if(!p.rows[0]) return null;
  const [decision,events,projects]=await Promise.all([
    query<ProposalDecision>(`SELECT decision_rule,eligible_count,participation_count,approve_count,reject_count,abstain_count,
        revise_count,decision_vote_count,approvals_required,outcome,finalized_at::text
      FROM proposal_decisions WHERE proposal_id=$1 LIMIT 1`,[id]),
    query<ProposalStatusEvent>(`SELECT id,from_status::text,to_status::text,note,created_at::text
      FROM proposal_status_events WHERE proposal_id=$1 ORDER BY created_at ASC`,[id]),
    query<ProposalProject>(`SELECT id,title,status,updated_at::text FROM projects WHERE proposal_id=$1 AND status IN ('approved','active','paused','completed','terminated','archived') ORDER BY updated_at DESC`,[id])
  ]);
  return {proposal:p.rows[0],decision:decision.rows[0]||null,statusEvents:events.rows,projects:projects.rows};
}
