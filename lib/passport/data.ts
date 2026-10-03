import { query } from '@/lib/db';
import { ensureVolunteerTaskSchema } from '@/lib/volunteer/ensure';
import { ensureVolunteerBudLinkSchema } from '@/lib/bud/ensure';

export type PassportOverview = {
  visibility: 'private' | 'members' | 'public';
  courses: { total: number; completed: number; active: number };
  est: { approved: number; value: number };
  bud: { approved: number; value: number; hours: number };
  projects: Array<{ id: string; title: string; role: string; status: string; joined_at: string }>;
  works: Array<{ id: string; title: string; work_type: string; url: string | null; visibility: string; status: string }>;
  volunteerTasks: Array<{ id: string; code: string; title: string; category: string; result_url: string | null; result_note: string | null; completed_at: string; review_status: string; review_note: string | null }>;
  sixYao: Array<{ stage: number; learning_status: string; practice_status: string | null }>;
  timeline: Array<{ id: string; kind: 'est' | 'bud' | 'project' | 'work' | 'volunteer'; title: string; detail: string | null; occurred_at: string }>;
};

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getPassportOverview(userId: string): Promise<PassportOverview> {
  await ensureVolunteerTaskSchema();
  await ensureVolunteerBudLinkSchema();
  const [passport, courses, est, bud, projects, works, volunteerTasks, sixYao, timeline] = await Promise.all([
    query<{ public_visibility: PassportOverview['visibility'] }>(
      `SELECT public_visibility FROM learning_passports WHERE user_id = $1`, [userId]
    ),
    query<{ total: string; completed: string; active: string }>(
      `WITH per_course AS (
          SELECT c.id,
                 c.content_status,
                 COUNT(l.id) FILTER (WHERE l.status='published') AS published_lessons,
                 COUNT(l.id) FILTER (
                   WHERE l.status='published' AND EXISTS (
                     SELECT 1 FROM learning_progress lp
                      WHERE lp.user_id=$1 AND lp.course_id=c.id AND lp.lesson_id=l.id AND lp.status='completed'
                   )
                 ) AS completed_lessons,
                 EXISTS (
                   SELECT 1 FROM learning_progress lp
                    WHERE lp.user_id=$1 AND lp.course_id=c.id AND lp.status IN ('in_progress','completed')
                 ) AS touched
            FROM courses c
            LEFT JOIN lessons l ON l.course_id=c.id
           WHERE c.publication_status='published'
           GROUP BY c.id,c.content_status
        )
        SELECT COUNT(*) FILTER (WHERE touched)::text AS total,
               COUNT(*) FILTER (
                 WHERE content_status='complete' AND published_lessons>0 AND completed_lessons=published_lessons
               )::text AS completed,
               COUNT(*) FILTER (
                 WHERE touched AND NOT (content_status='complete' AND published_lessons>0 AND completed_lessons=published_lessons)
               )::text AS active
          FROM per_course`, [userId]
    ),
    query<{ approved: string; value: string }>(
      `SELECT COUNT(*)::text AS approved, COALESCE(SUM(est_value),0)::text AS value
         FROM est_records WHERE user_id = $1 AND review_status = 'approved'`, [userId]
    ),
    query<{ approved: string; value: string; hours: string }>(
      `SELECT COUNT(*)::text AS approved, COALESCE(SUM(bud_value),0)::text AS value,
              COALESCE(SUM(COALESCE(verified_hours,hours,0)),0)::text AS hours
         FROM bud_records WHERE user_id = $1 AND review_status = 'approved'`, [userId]
    ),
    query<{ id: string; title: string; role: string; status: string; joined_at: string }>(
      `SELECT p.id, p.title, pm.participation_role AS role, p.status, pm.joined_at::text AS joined_at
         FROM project_members pm JOIN projects p ON p.id = pm.project_id
        WHERE pm.user_id = $1 AND pm.status <> 'withdrawn'
        ORDER BY pm.joined_at DESC LIMIT 8`, [userId]
    ),
    query<{ id: string; title: string; work_type: string; url: string | null; visibility: string; status: string }>(
      `SELECT id, title, work_type, url, visibility, status::text
         FROM passport_works
        WHERE user_id = $1 AND deleted_at IS NULL
        ORDER BY created_at DESC LIMIT 8`, [userId]
    ),
    query<{ id: string; code: string; title: string; category: string; result_url: string | null; result_note: string | null; completed_at: string; review_status: string; review_note: string | null }>(
      `SELECT t.id, t.code, t.title_zh AS title, t.category,
              a.result_url, a.result_note, a.completed_at::text AS completed_at,
              a.review_status, a.review_note
         FROM volunteer_task_assignments a
         JOIN volunteer_tasks t ON t.id=a.task_id
        WHERE a.user_id=$1 AND a.status='completed' AND a.completed_at IS NOT NULL
        ORDER BY a.completed_at DESC
        LIMIT 12`, [userId]
    ),
    query<{ stage: number; learning_status: string; practice_status: string | null }>(
      `SELECT yao_stage AS stage, learning_status::text, practice_status
         FROM six_yao_progress WHERE user_id = $1 ORDER BY yao_stage`, [userId]
    ),
    query<{ id: string; kind: 'est' | 'bud' | 'project' | 'work' | 'volunteer'; title: string; detail: string | null; occurred_at: string }>(
      `SELECT * FROM (
          SELECT 'est-' || id::text AS id,
                 'est'::text AS kind,
                 COALESCE(description,'EST') AS title,
                 ('EST +' || COALESCE(est_value,0)::text) AS detail,
                 created_at::text AS occurred_at
            FROM est_records
           WHERE user_id=$1 AND review_status='approved'
          UNION ALL
          SELECT 'bud-' || b.id::text AS id,
                 'bud'::text AS kind,
                 COALESCE(b.description,'BUD') AS title,
                 CASE WHEN vt.code IS NOT NULL
                      THEN ('BUD +' || COALESCE(b.bud_value,0)::text || ' · ' || vt.code)
                      ELSE ('BUD +' || COALESCE(b.bud_value,0)::text)
                 END AS detail,
                 COALESCE(b.reviewed_at,b.created_at)::text AS occurred_at
            FROM bud_records b
            LEFT JOIN volunteer_tasks vt ON vt.id=b.source_volunteer_task_id
           WHERE b.user_id=$1 AND b.review_status='approved'
          UNION ALL
          SELECT 'project-' || p.id::text AS id,
                 'project'::text AS kind,
                 p.title,
                 pm.participation_role::text AS detail,
                 pm.joined_at::text AS occurred_at
            FROM project_members pm
            JOIN projects p ON p.id=pm.project_id
           WHERE pm.user_id=$1 AND pm.status<>'withdrawn'
          UNION ALL
          SELECT 'work-' || id::text AS id,
                 'work'::text AS kind,
                 title,
                 work_type::text AS detail,
                 created_at::text AS occurred_at
            FROM passport_works
           WHERE user_id=$1 AND deleted_at IS NULL
          UNION ALL
          SELECT 'volunteer-' || t.id::text AS id,
                 'volunteer'::text AS kind,
                 t.title_zh AS title,
                 t.code || ' · ' || t.category AS detail,
                 a.completed_at::text AS occurred_at
            FROM volunteer_task_assignments a
            JOIN volunteer_tasks t ON t.id=a.task_id
           WHERE a.user_id=$1 AND a.status='completed' AND a.completed_at IS NOT NULL AND a.review_status='approved'
        ) t
        ORDER BY occurred_at DESC
        LIMIT 12`, [userId]
    )
  ]);

  const c = courses.rows[0] ?? { total: '0', completed: '0', active: '0' };
  const e = est.rows[0] ?? { approved: '0', value: '0' };
  const b = bud.rows[0] ?? { approved: '0', value: '0', hours: '0' };

  return {
    visibility: passport.rows[0]?.public_visibility ?? 'private',
    courses: { total: number(c.total), completed: number(c.completed), active: number(c.active) },
    est: { approved: number(e.approved), value: number(e.value) },
    bud: { approved: number(b.approved), value: number(b.value), hours: number(b.hours) },
    projects: projects.rows,
    works: works.rows,
    volunteerTasks: volunteerTasks.rows,
    sixYao: sixYao.rows,
    timeline: timeline.rows
  };
}
