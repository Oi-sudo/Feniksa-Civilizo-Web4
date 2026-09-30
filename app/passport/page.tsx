import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getPassportOverview } from '@/lib/passport/data';
import { getMessages } from '@/lib/i18n';

export default async function PassportPage(){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  const m=await getMessages();
  const d=await getPassportOverview(user.id);
  return <main>
    <span className="badge">{m.passport_badge}</span>
    <h1>{m.passport_title}</h1>
    <p className="lead">{(m.passport_welcome||'欢迎回来，{name}。').replace('{name}',user.display_name)}</p>
    <div className="card">
      <p><strong>{m.display_name_label}</strong> {user.display_name}</p>
      <p><strong>{m.email_label}</strong> {user.email}</p>
      <p><strong>{m.passport_privacy}</strong> {d.visibility}</p>
    </div>
    <section className="stat-grid">
      <div className="stat-card"><strong>{d.courses.completed}</strong><span>{m.passport_courses}</span></div>
      <div className="stat-card"><strong>{d.est.value}</strong><span>EST</span></div>
      <div className="stat-card"><strong>{d.bud.value}</strong><span>BUD</span></div>
    </section>
    <section className="card"><h2>{m.passport_projects}</h2>{d.projects.length?d.projects.map(p=><p key={p.id}>{p.title} · {p.role} · {p.status}</p>):<p>{m.no_projects_yet}</p>}</section>
  </main>;
}
