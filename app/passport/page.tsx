import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getPassportOverview } from '@/lib/passport/data';
import { getMessages } from '@/lib/i18n';

const yaoNames=[
  ['初爻 · 觉醒','Unua linio · Vekiĝo'],
  ['二爻 · 无我','Dua linio · Sen-memo'],
  ['三爻 · 开悟','Tria linio · Kompreno'],
  ['四爻 · 愿行','Kvara linio · Vola agado'],
  ['五爻 · 菩萨愿行','Kvina linio · Bodisatva agado'],
  ['六爻 · 大同共行识','Sesa linio · Komuna monda agado']
];

export default async function PassportPage(){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  const m=await getMessages();
  const d=await getPassportOverview(user.id);
  const six=new Map(d.sixYao.map(x=>[x.stage,x]));

  return <main>
    <span className="badge">{m.passport_badge}</span>
    <h1>{m.passport_title}</h1>
    <p className="lead">{(m.passport_welcome||'欢迎回来，{name}。').replace('{name}',user.display_name)}</p>

    <section className="card">
      <h2>学习身份 · Lerna identeco</h2>
      <p><strong>{m.display_name_label}</strong> {user.display_name}</p>
      <p><strong>{m.email_label}</strong> {user.email}</p>
      <p><strong>{m.preferred_language_label}</strong> {user.preferred_language.toUpperCase()}</p>
      <p><strong>{m.current_roles}</strong> {user.roles.length?user.roles.join(', '):'learner'}</p>
      <p><strong>{m.passport_privacy}</strong> {d.visibility}</p>
    </section>

    <section className="stat-grid">
      <div className="stat-card"><strong>{d.courses.completed}</strong><span>完成课程 · Kursoj</span><small>学习中 {d.courses.active} · 有记录 {d.courses.total}</small></div>
      <Link className="stat-card" href="/passport/est"><strong>{d.est.value}</strong><span>EST 世界语币</span><small>已审核记录 {d.est.approved} · 查看明细 →</small></Link>
      <Link className="stat-card" href="/passport/bud"><strong>{d.bud.value}</strong><span>BUD 佛光币</span><small>已审核 {d.bud.approved} · 服务 {d.bud.hours} 小时 · 查看明细 →</small></Link>
    </section>

    <section className="card">
      <h2>六爻成长轨迹 · Ses-linia lernovojo</h2>
      <p className="muted">记录学习与实践轨迹，不认证宗教修证境界，也不形成成员等级。</p>
      <div className="yao-grid">
        {yaoNames.map(([zh,eo],i)=>{
          const row=six.get(i+1);
          return <div className="yao-card" key={zh}><strong>{zh}</strong><span>{eo}</span><small>{row?.learning_status||'尚未开始'}</small></div>
        })}
      </div>
    </section>

    <section className="card">
      <h2>{m.passport_projects} · Projektoj</h2>
      {d.projects.length?d.projects.map(p=><p key={p.id}>{p.title} · {p.role} · {p.status}</p>):<p>{m.no_projects_yet}</p>}
      <Link href="/projects">查看项目入口 →</Link>
    </section>

    <section className="card">
      <h2>作品档案 · Verkoj</h2>
      {d.works.length?d.works.map(w=><p key={w.id}>{w.url?<a href={w.url}>{w.title}</a>:w.title} · {w.work_type} · {w.status}</p>):<p>{m.no_works_yet}</p>}
    </section>

    <section className="card">
      <h2>护照原则 · Principo</h2>
      <p>护照记道路，不定义一个人的价值。EST、BUD、课程和项目都是可核查记录，不是人格排名，也不是宗教果位认证。</p>
    </section>
  </main>;
}
