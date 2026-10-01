import Link from 'next/link';
import { notFound,redirect } from 'next/navigation';
import { getPublishedLesson } from '@/lib/courses/data';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';
import CompleteLessonButton from '@/components/courses/CompleteLessonButton';

export default async function LessonPage({params}:{params:Promise<{slug:string;lessonNumber:string}>}){
  const {slug,lessonNumber}=await params;
  const [lesson,user,locale]=await Promise.all([getPublishedLesson(slug,Number(lessonNumber)),getCurrentUser(),getLocale()]);
  if(!lesson)notFound();
  const eo=locale==='eo';
  if(lesson.access_level!=='public'&&!user)redirect('/login');

  return <main>
    <span className="badge">{eo?(lesson.course_title_eo||lesson.course_title_zh):lesson.course_title_zh} · {eo?`Leciono ${lesson.lesson_number}`:`第 ${lesson.lesson_number} 课`}</span>
    <h1>{eo?(lesson.title_eo||lesson.title_zh):lesson.title_zh}</h1>
    {!eo&&<p className="lead">{lesson.title_eo}</p>}
    <article className="lesson-content">
      {!eo&&<section><h2>中文</h2><p>{lesson.content_zh||'本章正文尚未导入。'}</p></section>}
      <section><h2>Esperanto</h2><p>{lesson.content_eo||'La plena teksto ankoraŭ ne estas importita.'}</p></section>
      {lesson.content_en&&<section><h2>English</h2><p>{lesson.content_en}</p></section>}
    </article>
    {user?<CompleteLessonButton lessonId={lesson.id} eo={eo}/>:<section className="card"><p>{eo?'Post ensaluto vi povas konservi vian lernoprogreson. Fini publikan enkondukon ne estos prezentata kiel fino de la tuta kurso.':'登录后可以保存学习进度。完成公开导言本身不会被冒充为完整课程完成。'}</p><Link href="/login">{eo?'Ensaluti →':'登录 →'}</Link></section>}
    <div className="hero-actions"><Link className="button button-secondary" href={`/courses/${slug}`}>{eo?'Reveni al la kurso':'返回课程'}</Link><Link className="button button-secondary" href="/passport">{eo?'Lernopasporto':'学习护照'}</Link></div>
  </main>;
}
