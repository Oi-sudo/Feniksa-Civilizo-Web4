import { query, withTransaction } from '@/lib/db';

export type CourseProgressSummary = {
  total_lessons: number;
  started_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  next_lesson_number: number | null;
};

export async function getCourseProgress(userId: string, courseId: string): Promise<CourseProgressSummary> {
  const result = await query<CourseProgressSummary>(`
    WITH published AS (
      SELECT id, lesson_number FROM lessons WHERE course_id=$2 AND status='published'
    ), progress AS (
      SELECT lesson_id, status FROM learning_progress WHERE user_id=$1 AND course_id=$2
    )
    SELECT
      COUNT(p.id)::int AS total_lessons,
      COUNT(pr.lesson_id) FILTER (WHERE pr.status IN ('in_progress','completed'))::int AS started_lessons,
      COUNT(pr.lesson_id) FILTER (WHERE pr.status='completed')::int AS completed_lessons,
      CASE WHEN COUNT(p.id)=0 THEN 0
           ELSE ROUND((COUNT(pr.lesson_id) FILTER (WHERE pr.status='completed')::numeric / COUNT(p.id)::numeric) * 100, 2)
      END AS progress_percent,
      MIN(p.lesson_number) FILTER (WHERE COALESCE(pr.status::text,'not_started') <> 'completed')::int AS next_lesson_number
    FROM published p
    LEFT JOIN progress pr ON pr.lesson_id=p.id`, [userId, courseId]);
  return result.rows[0] ?? { total_lessons:0, started_lessons:0, completed_lessons:0, progress_percent:0, next_lesson_number:null };
}

export async function startCourse(userId: string, courseId: string) {
  return withTransaction(async client => {
    const first = await client.query<{id:string; lesson_number:number}>(`SELECT id, lesson_number FROM lessons WHERE course_id=$1 AND status='published' ORDER BY lesson_number LIMIT 1`, [courseId]);
    if (!first.rows[0]) throw new Error('NO_PUBLISHED_LESSON');
    await client.query(`INSERT INTO learning_progress (user_id,course_id,lesson_id,status,progress_percent,started_at)
      VALUES ($1,$2,$3,'in_progress',0,NOW())
      ON CONFLICT (user_id,course_id,lesson_id) DO UPDATE SET
        status=CASE WHEN learning_progress.status='completed' THEN 'completed'::learning_status ELSE 'in_progress'::learning_status END,
        started_at=COALESCE(learning_progress.started_at,NOW()), updated_at=NOW()`, [userId,courseId,first.rows[0].id]);
    return first.rows[0].lesson_number;
  });
}

export async function markLessonComplete(userId: string, courseId: string, lessonId: string) {
  return withTransaction(async client => {
    await client.query(`INSERT INTO learning_progress (user_id,course_id,lesson_id,status,progress_percent,started_at,completed_at)
      VALUES ($1,$2,$3,'completed',100,NOW(),NOW())
      ON CONFLICT (user_id,course_id,lesson_id) DO UPDATE SET status='completed',progress_percent=100,
        started_at=COALESCE(learning_progress.started_at,NOW()),completed_at=NOW(),updated_at=NOW()`, [userId,courseId,lessonId]);

    const next = await client.query<{lesson_number:number}>(`SELECT l.lesson_number
      FROM lessons l
      LEFT JOIN learning_progress p ON p.lesson_id=l.id AND p.user_id=$1 AND p.course_id=$2
      WHERE l.course_id=$2 AND l.status='published' AND COALESCE(p.status::text,'not_started') <> 'completed'
      ORDER BY l.lesson_number LIMIT 1`, [userId,courseId]);
    return next.rows[0]?.lesson_number ?? null;
  });
}
