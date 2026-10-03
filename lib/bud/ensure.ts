import { query } from '@/lib/db';
import { ensureVolunteerTaskSchema } from '@/lib/volunteer/ensure';

let ready:Promise<void>|null=null;

export function ensureVolunteerBudLinkSchema(){
  if(!ready) ready=(async()=>{
    await ensureVolunteerTaskSchema();
    await query(`ALTER TABLE bud_records ADD COLUMN IF NOT EXISTS source_volunteer_task_id UUID REFERENCES volunteer_tasks(id) ON DELETE SET NULL`);
    await query(`CREATE UNIQUE INDEX IF NOT EXISTS bud_records_volunteer_source_uq ON bud_records(user_id,source_volunteer_task_id) WHERE source_volunteer_task_id IS NOT NULL AND revoked_at IS NULL`);
  })().catch(error=>{ready=null;throw error});
  return ready;
}
