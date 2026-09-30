import { query } from '@/lib/db';

export type CourseRow={
  id:string; slug:string; title_zh:string; title_eo:string|null; title_en:string|null;
  description_zh:string|null; description_eo:string|null; description_en:string|null;
  category:string; level:string|null; version:string; access_level:string; content_status:string;
  estimated_lessons:number|null; learning_objectives_zh:string|null; learning_objectives_eo:string|null;
  learning_objectives_en:string|null;
};
export type LessonRow={
  id:string; course_id:string; lesson_number:number; title_zh:string; title_eo:string|null; title_en:string|null;
  content_zh:string|null; content_eo:string|null; content_en:string|null;
};

export async function listPublishedCourses(){
  const r=await query<CourseRow>(
    `SELECT id,slug,title_zh,title_eo,title_en,description_zh,description_eo,description_en,
            category,level,version,access_level,content_status,estimated_lessons,
            learning_objectives_zh,learning_objectives_eo,learning_objectives_en
       FROM courses WHERE publication_status='published'
      ORDER BY featured_order NULLS LAST,created_at`);
  return r.rows;
}

export async function getCourseBySlug(slug:string){
  const r=await query<CourseRow>(
    `SELECT id,slug,title_zh,title_eo,title_en,description_zh,description_eo,description_en,
            category,level,version,access_level,content_status,estimated_lessons,
            learning_objectives_zh,learning_objectives_eo,learning_objectives_en
       FROM courses WHERE slug=$1 AND publication_status='published' LIMIT 1`,[slug]);
  return r.rows[0]||null;
}

export async function listPublishedLessons(courseId:string){
  const r=await query<LessonRow>(
    `SELECT id,course_id,lesson_number,title_zh,title_eo,title_en,content_zh,content_eo,content_en
       FROM lessons WHERE course_id=$1 AND status='published' ORDER BY lesson_number`,[courseId]);
  return r.rows;
}

export async function getPublishedLesson(slug:string,lessonNumber:number){
  const r=await query<LessonRow & {slug:string;access_level:string;content_status:string;course_title_zh:string;course_title_eo:string|null}>(
    `SELECT l.id,l.course_id,l.lesson_number,l.title_zh,l.title_eo,l.title_en,l.content_zh,l.content_eo,l.content_en,
            c.slug,c.access_level,c.content_status,c.title_zh AS course_title_zh,c.title_eo AS course_title_eo
       FROM lessons l JOIN courses c ON c.id=l.course_id
      WHERE c.slug=$1 AND c.publication_status='published' AND l.lesson_number=$2 AND l.status='published' LIMIT 1`,
    [slug,lessonNumber]);
  return r.rows[0]||null;
}
