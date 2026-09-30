import Link from 'next/link';
import { getMessages } from '@/lib/i18n';
import { listPublishedCourses } from '@/lib/courses/data';

const categoryName:Record<string,string>={
  esperanto:'世界语 · Esperanto',buddhist_study:'佛法与翻译',six_yao:'六爻',
  dad_governance:'DAD治理',web4:'Web4',museum:'数字博物馆',ai:'AI / SI'
};

export default async function CoursesPage(){
  const m=await getMessages();
  const courses=await listPublishedCourses();
  return <main>
    <span className="badge">{m.course_badge || '世界语文明大学'}</span>
    <h1>{m.course_title || '课程目录'} · Kursaro</h1>
    <p className="lead">{m.course_intro || '课程逐步导入中。'}</p>
    <div className="card-grid">
      {courses.map(c=><Link className="card" href={`/courses/${c.slug}`} key={c.id}>
        <span className="eyebrow">{categoryName[c.category]||c.category}</span>
        <h2>{c.title_zh}</h2><p>{c.title_eo}</p>
        <small>{c.content_status==='complete'?'完整教材已发布':'教材继续分批导入'} · {c.estimated_lessons||'—'} 课</small>
        <span className="card-link">进入课程 →</span>
      </Link>)}
    </div>
    <p className="muted">只有标记为“完整”的课程，在全部已发布章节完成后才会自动形成 EST 课程完成记录；目录或导言不冒充完整课程。</p>
    <Link className="button button-secondary" href="/dual-wing">查看双翼说明</Link>
  </main>;
}
