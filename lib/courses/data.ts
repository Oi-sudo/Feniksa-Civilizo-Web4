import { query } from '@/lib/db';
import type { Locale } from '@/lib/i18n';

export type CourseCatalogItem = {
  id: string; slug: string; title_zh: string; title_eo: string | null; title_en: string | null;
  description_zh: string | null; description_eo: string | null; description_en: string | null;
  category: string; level: string | null; version: string; access_level: string;
  content_status: string; estimated_lessons: number | null; lesson_count: number; completed_lessons?: number;
};

export type CourseLesson = { id: string; lesson_number: number; title_zh: string; title_eo: string | null; title_en: string | null; status: string };
export type CourseDetail = CourseCatalogItem & { learning_objectives_zh: string | null; learning_objectives_eo: string | null; learning_objectives_en: string | null; lessons: CourseLesson[] };

export function localized(row: any, field: string, locale: Locale): string {
  return row[`${field}_${locale}`] || row[`${field}_zh`] || row[`${field}_eo`] || row[`${field}_en`] || '';
}

export async function listPublishedCourses(category?: string, search?: string): Promise<CourseCatalogItem[]> {
  const params: unknown[] = [];
  const where = ["c.publication_status = 'published'"];
  if (category && category !== 'all') { params.push(category); where.push(`c.category = $${params.length}`); }
  if (search) { params.push(`%${search.toLowerCase()}%`); where.push(`(lower(c.title_zh) LIKE $${params.length} OR lower(coalesce(c.title_eo,'')) LIKE $${params.length} OR lower(coalesce(c.title_en,'')) LIKE $${params.length})`); }
  const sql = `SELECT c.id,c.slug,c.title_zh,c.title_eo,c.title_en,c.description_zh,c.description_eo,c.description_en,c.category,c.level,c.version,c.access_level,c.content_status,c.estimated_lessons,COUNT(l.id)::int AS lesson_count
    FROM courses c LEFT JOIN lessons l ON l.course_id=c.id AND l.status='published'
    WHERE ${where.join(' AND ')}
    GROUP BY c.id ORDER BY c.featured_order NULLS LAST,c.created_at`;
  const result = await query<CourseCatalogItem>(sql, params); return result.rows;
}

export async function getCourseBySlug(slug: string): Promise<CourseDetail | null> {
  const base = await query<Omit<CourseDetail,'lessons'>>(`SELECT c.id,c.slug,c.title_zh,c.title_eo,c.title_en,c.description_zh,c.description_eo,c.description_en,c.category,c.level,c.version,c.access_level,c.content_status,c.estimated_lessons,c.learning_objectives_zh,c.learning_objectives_eo,c.learning_objectives_en,COUNT(l.id)::int AS lesson_count
    FROM courses c LEFT JOIN lessons l ON l.course_id=c.id AND l.status='published'
    WHERE c.slug=$1 AND c.publication_status='published' GROUP BY c.id`, [slug]);
  if (!base.rows[0]) return null;
  const lessons = await query<CourseLesson>(`SELECT id,lesson_number,title_zh,title_eo,title_en,status FROM lessons WHERE course_id=$1 AND status='published' ORDER BY lesson_number`, [base.rows[0].id]);
  return {...base.rows[0], lessons: lessons.rows};
}
