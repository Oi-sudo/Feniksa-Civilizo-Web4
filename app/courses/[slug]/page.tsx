import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getCourseBySlug,listPublishedLessons } from '@/lib/courses/data';

export default async function CoursePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const [course,locale]=await Promise.all([getCourseBySlug(slug),getLocale()]);
  if(!course)notFound();
  const eo=locale==='eo';
  const lessons=await listPublishedLessons(course.id);

  return <main>
    <span className="badge">{eo?'Kurso':'课程'} · {course.version}</span>
    <h1>{eo?(course.title_eo||course.title_zh):course.title_zh}</h1>
    {!eo&&<p className="lead">{course.title_eo}</p>}
    <p>{eo?(course.description_eo||course.description_zh):course.description_zh}</p>
    {!eo&&course.description_eo&&<p className="muted">{course.description_eo}</p>}
    <section className="card">
      <h2>{eo?'Kursa stato':'课程状态'}</h2>
      <p>{eo?'Enhava stato':'内容状态'}：<strong>{course.content_status}</strong> · {eo?'Aliro':'访问'}：{course.access_level} · {eo?'Ĉirkaŭ':'预计'} {course.estimated_lessons||'—'} {eo?'lecionoj':'课'}</p>
      <p>{eo?(course.learning_objectives_eo||course.learning_objectives_zh):course.learning_objectives_zh}</p>
      {!eo&&course.learning_objectives_eo&&<p className="muted">{course.learning_objectives_eo}</p>}
    </section>
    <section>
      <h2>{eo?'Publikigitaj lecionoj':'已发布章节 · Publikigitaj lecionoj'}</h2>
      <div className="record-list">
        {lessons.map(l=><Link className="card" href={`/courses/${slug}/lessons/${l.lesson_number}`} key={l.id}>
          <span className="eyebrow">{eo?`Leciono ${l.lesson_number}`:`第 ${l.lesson_number} 课`}</span><h3>{eo?(l.title_eo||l.title_zh):l.title_zh}</h3>{!eo&&<p>{l.title_eo}</p>}<span className="card-link">{eo?'Komenci lerni →':'开始学习 →'}</span>
        </Link>)}
      </div>
    </section>
    <section className="card"><h2>{eo?'Regulo por EST':'EST 生成规则'}</h2><p>{eo?'Nur kiam la kurso estas markita kiel complete kaj ĉiuj publikigitaj lecionoj estas finitaj, la sistemo aŭtomate kreas unu EST-registron pri kurskompletigo. Parte importita kurso ne ricevas EST anticipe.':'只有当课程标记为 complete，并且所有已发布章节都完成后，系统才自动生成一次课程完成 EST 记录。部分导入课程不会提前发放。'}</p></section>
    <Link className="button button-secondary" href="/courses">{eo?'Reveni al la kursaro':'返回课程目录'}</Link>
  </main>;
}
