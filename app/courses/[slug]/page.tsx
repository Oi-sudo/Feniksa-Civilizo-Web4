import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getCourseBySlug,listPublishedLessons } from '@/lib/courses/data';

const contentZh:Record<string,string>={complete:'完整',partial:'分批导入',draft:'草稿'};
const contentEo:Record<string,string>={complete:'Kompleta',partial:'Parte importita',draft:'Malneto'};
const contentEn:Record<string,string>={complete:'Complete',partial:'Partially imported',draft:'Draft'};
const accessZh:Record<string,string>={public:'公开',members:'成员',private:'内部'};
const accessEo:Record<string,string>={public:'Publika',members:'Por membroj',private:'Interna'};
const accessEn:Record<string,string>={public:'Public',members:'Members',private:'Internal'};

export default async function CoursePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const [course,locale]=await Promise.all([getCourseBySlug(slug),getLocale()]);
  if(!course)notFound();
  const eo=locale==='eo'; const en=locale==='en';
  const lessons=await listPublishedLessons(course.id);

  return <main>
    <span className="badge">{eo?'Kurso':en?'Course':'课程'} · {course.version}</span>
    <h1>{eo?(course.title_eo||course.title_zh):en?(course.title_en||course.title_eo||course.title_zh):course.title_zh}</h1>
    {locale==='zh'&&<p className="lead">{course.title_eo}</p>}
    <p>{eo?(course.description_eo||course.description_zh):en?(course.description_en||course.description_eo||course.description_zh):course.description_zh}</p>
    {locale==='zh'&&course.description_eo&&<p className="muted">{course.description_eo}</p>}
    <section className="card">
      <h2>{eo?'Kursa stato':en?'Course status':'课程状态'}</h2>
      <p>{eo?'Enhava stato':en?'Content status':'内容状态'}：<strong>{(eo?contentEo:en?contentEn:contentZh)[course.content_status]||course.content_status}</strong> · {eo?'Aliro':en?'Access':'访问'}：{(eo?accessEo:en?accessEn:accessZh)[course.access_level]||course.access_level} · {eo?'Ĉirkaŭ':en?'About':'预计'} {course.estimated_lessons||'—'} {eo?'lecionoj':en?'lessons':'课'}</p>
      <p>{eo?(course.learning_objectives_eo||course.learning_objectives_zh):en?(course.learning_objectives_en||course.learning_objectives_eo||course.learning_objectives_zh):course.learning_objectives_zh}</p>
      {locale==='zh'&&course.learning_objectives_eo&&<p className="muted">{course.learning_objectives_eo}</p>}
    </section>
    <section>
      <h2>{eo?'Publikigitaj lecionoj':en?'Published lessons':'已发布章节 · Publikigitaj lecionoj'}</h2>
      <div className="record-list">
        {lessons.map(l=><Link className="card" href={`/courses/${slug}/lessons/${l.lesson_number}`} key={l.id}>
          <span className="eyebrow">{eo?`Leciono ${l.lesson_number}`:en?`Lesson ${l.lesson_number}`:`第 ${l.lesson_number} 课`}</span><h3>{eo?(l.title_eo||l.title_zh):en?(l.title_en||l.title_eo||l.title_zh):l.title_zh}</h3>{locale==='zh'&&<p>{l.title_eo}</p>}<span className="card-link">{eo?'Komenci lerni →':en?'Start learning →':'开始学习 →'}</span>
        </Link>)}
      </div>
    </section>
    <section className="card"><h2>{eo?'Regulo por EST':en?'EST generation rule':'EST 生成规则'}</h2><p>{eo?'Nur kiam la kurso estas markita kiel “Kompleta” kaj ĉiuj publikigitaj lecionoj estas finitaj, la sistemo aŭtomate kreas unu EST-registron pri kurskompletigo. Parte importita kurso ne ricevas EST anticipe.':en?'Only when a course is marked “Complete” and all published lessons are finished does the system automatically create one EST course-completion record. A partially imported course does not receive EST in advance.':'只有当课程标记为“完整”，并且所有已发布章节都完成后，系统才自动生成一次课程完成 EST 记录。部分导入课程不会提前发放。'}</p></section>
    <Link className="button button-secondary" href="/courses">{eo?'Reveni al la kursaro':en?'Back to course catalog':'返回课程目录'}</Link>
  </main>;
}
