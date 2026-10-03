import { query } from '@/lib/db';

export async function listUserProjects(userId:string){
  const r=await query<{id:string;title:string;status:string}>(
    `SELECT p.id,p.title,p.status
       FROM project_members pm JOIN projects p ON p.id=pm.project_id
      WHERE pm.user_id=$1 AND pm.status='active' AND p.status IN ('approved','active','paused')
      ORDER BY p.updated_at DESC`,[userId]);
  return r.rows;
}

export async function listManagerBudConfirmations(userId:string){
  const r=await query<{
    id:string;user_id:string;user_name:string;project_id:string;project_title:string;
    service_type:string;description:string;hours:string|null;created_at:string;
  }>(
    `SELECT b.id,b.user_id,u.display_name AS user_name,b.project_id,p.title AS project_title,
            b.service_type,b.description,b.hours::text,b.created_at::text
       FROM bud_records b
       JOIN users u ON u.id=b.user_id
       JOIN projects p ON p.id=b.project_id
      WHERE p.manager_id=$1
        AND b.review_status='pending'
        AND b.project_confirmation_status='pending'
        AND b.revoked_at IS NULL
      ORDER BY b.created_at ASC`,[userId]);
  return r.rows;
}

export async function listAdminPendingBud(){
  const r=await query<{
    id:string;user_id:string;user_name:string;project_id:string|null;project_title:string|null;
    service_type:string;description:string;hours:string|null;verified_hours:string|null;
    project_confirmation_status:string;created_at:string;source_volunteer_task_id:string|null;source_volunteer_code:string|null;
  }>(
    `SELECT b.id,b.user_id,u.display_name AS user_name,b.project_id,p.title AS project_title,
            b.service_type,b.description,b.hours::text,b.verified_hours::text,
            b.project_confirmation_status,b.created_at::text,b.source_volunteer_task_id,vt.code AS source_volunteer_code
       FROM bud_records b
       JOIN users u ON u.id=b.user_id
       LEFT JOIN projects p ON p.id=b.project_id
       LEFT JOIN volunteer_tasks vt ON vt.id=b.source_volunteer_task_id
      WHERE b.review_status='pending' AND b.revoked_at IS NULL
      ORDER BY b.created_at ASC`);
  return r.rows;
}
