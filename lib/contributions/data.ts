import { query } from '@/lib/db';
import { ensureVolunteerBudLinkSchema } from '@/lib/bud/ensure';

export type EstRecord={
  id:string; activity_type:string; description:string; est_value:string; rule_version:string;
  review_status:string; evidence_url:string|null; created_at:string; reviewed_at:string|null;
  course_title:string|null; project_title:string|null;
};
export type BudRecord={
  id:string; service_type:string; description:string; hours:string|null; verified_hours:string|null;
  bud_value:string; rule_version:string; review_status:string; evidence_url:string|null;
  project_confirmation_status:string; created_at:string; reviewed_at:string|null; project_title:string|null;
  source_volunteer_task_id:string|null; source_volunteer_code:string|null; source_volunteer_title:string|null;
};

export async function listEstRecords(userId:string,projectId?:string){
  const r=await query<EstRecord>(
    `SELECT e.id,e.activity_type,e.description,e.est_value::text,e.rule_version,
            e.review_status::text,e.evidence_url,e.created_at::text,e.reviewed_at::text,
            c.title_zh AS course_title,p.title AS project_title
       FROM est_records e
       LEFT JOIN courses c ON c.id=e.course_id
       LEFT JOIN projects p ON p.id=e.project_id
      WHERE e.user_id=$1 AND ($2::uuid IS NULL OR e.project_id=$2::uuid)
      ORDER BY e.created_at DESC
      LIMIT 100`,[userId,projectId||null]);
  return r.rows;
}

export async function listBudRecords(userId:string,projectId?:string){
  await ensureVolunteerBudLinkSchema();
  const r=await query<BudRecord>(
    `SELECT b.id,b.service_type,b.description,b.hours::text,b.verified_hours::text,
            b.bud_value::text,b.rule_version,b.review_status::text,b.evidence_url,
            b.project_confirmation_status,b.created_at::text,b.reviewed_at::text,
            p.title AS project_title,
            b.source_volunteer_task_id,vt.code AS source_volunteer_code,vt.title_zh AS source_volunteer_title
       FROM bud_records b
       LEFT JOIN projects p ON p.id=b.project_id
       LEFT JOIN volunteer_tasks vt ON vt.id=b.source_volunteer_task_id
      WHERE b.user_id=$1 AND ($2::uuid IS NULL OR b.project_id=$2::uuid)
      ORDER BY b.created_at DESC
      LIMIT 100`,[userId,projectId||null]);
  return r.rows;
}
