import Link from 'next/link';
import { getLocale,getMessages } from '@/lib/i18n';
import { listPublishedCourses } from '@/lib/courses/data';

const categoryZh:Record<string,string>={
  esperanto:'世界语 · Esperanto',buddhist_study:'佛法与翻译',six_yao:'六爻',
  dad_governance:'DAD治理',web4:'Web4',museum:'数字博物馆',ai:'AI / SI'
};
const categoryEo:Record<string,string>={
  esperanto:'Esperanto',buddhist_study:'Budhismo kaj tradukado',six_yao:'Ses linioj',
  dad_governance:'DAD-regado',web4:'Web4',museum:'Cifereca muzeo',ai:'AI / SI'
};

export default async function CoursesPage(){
  const [locale,m]=await Promise.all([getLocale(),getMessages()]); const eo=locale==='eo';
  const courses=await listPublishedCourses();
  return <main>
    <span className="badge">{m.course_badge || (eo?'Esperanta Civiliza Universitato':'世界语文明大学')}</span>
    <h1>{m.course_title || (eo?'Kursaro':'课程目录')} · Kursaro</h1>
    <p className="lead">{m.course_intro || (eo?'La kursoj estas enkondukataj paŝo post paŝo.':'课程逐步导入中。')}</p>
    <div className="card-grid">
      {courses.map(c=><Link className="card" href={`/courses/${c.slug}`} key={c.id}>
        <span className="eyebrow">{(eo?categoryEo:categoryZh)[c.category]||c.category}</span>
        <h2>{eo?(c.title_eo||c.title_zh):c.title_zh}</h2>{!eo&&<p>{c.title_eo}</p>}
        <small>{c.content_status==='complete'?(eo?'Kompleta lernomaterialo publikigita':'完整教材已发布'):(eo?'Lernomaterialo daŭre aldoniĝas laŭ partoj':'教材继续分批导入')} · {c.estimated_lessons||'—'} {eo?'lecionoj':'课'}</small>
        <span className="card-link">{eo?'Eniri la kurson →':'进入课程 →'}</span>
      </Link>)}
    </div>
    <p className="muted">{eo?'Nur kurso markita kiel “kompleta” povas, post fino de ĉiuj publikigitaj lecionoj, aŭtomate formi EST-registron pri kurskompletigo. Katalogo aŭ enkonduko ne estas prezentata kiel kompleta kurso.':'只有标记为“完整”的课程，在全部已发布章节完成后才会自动形成 EST 课程完成记录；目录或导言不冒充完整课程。'}</p>
    <Link className="button button-secondary" href="/dual-wing">{eo?'Vidi la klarigon pri la du-flugila strukturo':'查看双翼说明'}</Link>
  </main>;
}
