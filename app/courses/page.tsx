import Link from 'next/link';
import { getMessages } from '@/lib/i18n';

export default async function CoursesPage(){
  const m=await getMessages();
  const courses=[
    ['40课900句世界语','40 lecionoj · 900 frazoj','世界语'],
    ['萨格勒布教学法12课','12 lecionoj de Zagreba metodo','世界语'],
    ['六爻世界语问答','Ses-linia Esperanto-demandoj','六爻'],
    ['受控世界语明典 REAI 0.1','Kontrolita Esperanto REAI 0.1','受控语言'],
    ['佛经汉—世界语受控翻译','Kontrolita ĉina–Esperanta budhisma tradukado','佛法翻译']
  ];
  return <main>
    <span className="badge">{m.course_badge || '世界语文明大学'}</span>
    <h1>{m.course_title || '课程目录'} · Kursaro</h1>
    <p className="lead">{m.course_intro || '课程逐步导入中。'}</p>
    <div className="card-grid">
      {courses.map(([zh,eo,cat])=><div className="card" key={zh}><span className="eyebrow">{cat}</span><h2>{zh}</h2><p>{eo}</p><small>Alpha：课程入口已建立，完整教材继续分批导入。</small></div>)}
    </div>
    <p className="muted">旧站中的既有双语文献继续保留。<br/>Jam ekzistantaj dulingvaj dokumentoj restas en la malnova retejo.</p>
    <Link className="button button-secondary" href="/dual-wing">查看双翼说明</Link>
  </main>;
}
