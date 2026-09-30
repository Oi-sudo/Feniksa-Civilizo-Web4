import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCourseBySlug,listPublishedLessons } from '@/lib/courses/data';

export default async function CoursePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const course=await getCourseBySlug(slug);
  if(!course)notFound();
  const lessons=await listPublishedLessons(course.id);

  return <main>
    <span className="badge">课程 · Kurso · {course.version}</span>
    <h1>{course.title_zh}</h1>
    <p className="lead">{course.title_eo}</p>
    <p>{course.description_zh}</p>
    {course.description_eo&&<p className="muted">{course.description_eo}</p>}
    <section className="card">
      <h2>课程状态</h2>
      <p>内容状态：<strong>{course.content_status}</strong> · 访问：{course.access_level} · 预计 {course.estimated_lessons||'—'} 课</p>
      <p>{course.learning_objectives_zh}</p>
      {course.learning_objectives_eo&&<p className="muted">{course.learning_objectives_eo}</p>}
    </section>
    <section>
      <h2>已发布章节 · Publikigitaj lecionoj</h2>
      <div className="record-list">
        {lessons.map(l=><Link className="card" href={`/courses/${slug}/lessons/${l.lesson_number}`} key={l.id}>
          <span className="eyebrow">第 {l.lesson_number} 课</span><h3>{l.title_zh}</h3><p>{l.title_eo}</p><span className="card-link">开始学习 →</span>
        </Link>)}
      </div>
    </section>
    <section className="card"><h2>EST 生成规则</h2><p>只有当课程标记为 complete，并且所有已发布章节都完成后，系统才自动生成一次课程完成 EST 记录。部分导入课程不会提前发放。</p></section>
    <Link className="button button-secondary" href="/courses">返回课程目录</Link>
  </main>;
}
