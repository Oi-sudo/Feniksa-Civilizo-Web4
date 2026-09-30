import { query } from '@/lib/db';

export type PassportOverview = {
  visibility: 'private' | 'members' | 'public';
  courses: { total: number; completed: number; active: number };
  est: { approved: number; value: number };
  bud: { approved: number; value: number; hours: number };
  projects: Array<{ id: string; title: string; role: string; status: string }>;
  works: Array<{ id: string; title: string; work_type: string; url: string | null; visibility: string; status: string }>;
  sixYao: Array<{ stage: number; learning_status: string; practice_status: string | null }>;
};

function number(value: unknown): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function getPassportOverview(userId: string): Promise<PassportOverview> {
  const [passport, courses, est, bud, projects, works, sixYao] = await Promise.all([
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
              COALESCE(SUM(hours),0)::text AS hours
         FROM bud_records WHERE user_id = $1 AND review_status = 'approved'`, [userId]
    ),
    query<{ id: string; title: string; role: string; status: string }>(
      `SELECT p.id, p.title, pm.participation_role AS role, p.status
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
    query<{ stage: number; learning_status: string; practice_status: string | null }>(
      `SELECT yao_stage AS stage, learning_status::text, practice_status
         FROM six_yao_progress WHERE user_id = $1 ORDER BY yao_stage`, [userId]
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
    sixYao: sixYao.rows
  };
}
