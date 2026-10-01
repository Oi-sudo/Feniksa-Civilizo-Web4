import { query } from '@/lib/db';

export type PersonalProjectContext={
  project_id:string;title:string;project_status:string;participation_role:string;
  member_status:string;joined_at:string;left_at:string|null;
};
export type PersonalProjectEvent={
  id:string;kind:'membership'|'membership_end'|'est'|'bud';title:string;detail:string|null;status:string|null;occurred_at:string;
};
export type PersonalProjectSummary={est_count:number;est_value:string;bud_count:number;bud_value:string;bud_hours:string};

export async function getPersonalProjectPassport(userId:string,projectId:string){
  const context=await query<PersonalProjectContext>(`
    SELECT p.id AS project_id,p.title,p.status AS project_status,
           pm.participation_role,pm.status AS member_status,
           pm.joined_at::text,pm.left_at::text
      FROM project_members pm
      JOIN projects p ON p.id=pm.project_id
     WHERE pm.user_id=$1 AND pm.project_id=$2
     LIMIT 1`,[userId,projectId]);
  if(!context.rows[0]) return null;

  const [events,summary]=await Promise.all([
  query<PersonalProjectEvent>(`
    SELECT * FROM (
      SELECT ('membership-' || pm.project_id::text) AS id,
             'membership'::text AS kind,
             p.title AS title,
             pm.participation_role AS detail,
             pm.status AS status,
             pm.joined_at::text AS occurred_at
        FROM project_members pm
        JOIN projects p ON p.id=pm.project_id
       WHERE pm.user_id=$1 AND pm.project_id=$2
      UNION ALL
      UNION ALL
      SELECT ('membership_end-' || pm.project_id::text) AS id,
             'membership_end'::text AS kind,
             p.title AS title,
             pm.participation_role AS detail,
             pm.status AS status,
             pm.left_at::text AS occurred_at
        FROM project_members pm
        JOIN projects p ON p.id=pm.project_id
       WHERE pm.user_id=$1 AND pm.project_id=$2 AND pm.left_at IS NOT NULL
      UNION ALL
      SELECT ('est-' || e.id::text) AS id,
             'est'::text AS kind,
             e.description AS title,
             ('EST ' || e.est_value::text) AS detail,
             e.review_status::text AS status,
             e.created_at::text AS occurred_at
        FROM est_records e
       WHERE e.user_id=$1 AND e.project_id=$2 AND e.revoked_at IS NULL
      UNION ALL
      SELECT ('bud-' || b.id::text) AS id,
             'bud'::text AS kind,
             b.description AS title,
             ('BUD ' || b.bud_value::text ||
               CASE WHEN b.hours IS NOT NULL THEN ' · ' || b.hours::text || ' h' ELSE '' END) AS detail,
             b.review_status::text AS status,
             b.created_at::text AS occurred_at
        FROM bud_records b
       WHERE b.user_id=$1 AND b.project_id=$2 AND b.revoked_at IS NULL
    ) x
    ORDER BY occurred_at ASC`,[userId,projectId]),
  query<PersonalProjectSummary>(`SELECT
    (SELECT COUNT(*)::int FROM est_records WHERE user_id=$1 AND project_id=$2 AND review_status='approved' AND revoked_at IS NULL) AS est_count,
    COALESCE((SELECT SUM(est_value) FROM est_records WHERE user_id=$1 AND project_id=$2 AND review_status='approved' AND revoked_at IS NULL),0)::text AS est_value,
    (SELECT COUNT(*)::int FROM bud_records WHERE user_id=$1 AND project_id=$2 AND review_status='approved' AND revoked_at IS NULL) AS bud_count,
    COALESCE((SELECT SUM(bud_value) FROM bud_records WHERE user_id=$1 AND project_id=$2 AND review_status='approved' AND revoked_at IS NULL),0)::text AS bud_value,
    COALESCE((SELECT SUM(COALESCE(verified_hours,hours,0)) FROM bud_records WHERE user_id=$1 AND project_id=$2 AND review_status='approved' AND revoked_at IS NULL),0)::text AS bud_hours`,[userId,projectId])
  ]);

  return {context:context.rows[0],events:events.rows,summary:summary.rows[0]};
}
