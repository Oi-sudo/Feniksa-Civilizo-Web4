import Link from 'next/link';
import { redirect,notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';
import { getPersonalProjectPassport } from '@/lib/passport/project';

const kindZh:Record<string,string>={membership:'加入项目',est:'EST 知识贡献',bud:'BUD 服务贡献'};
const kindEo:Record<string,string>={membership:'Aliĝo al projekto',est:'EST-scia kontribuo',bud:'BUD-serva kontribuo'};
const kindEn:Record<string,string>={membership:'Joined project',est:'EST knowledge contribution',bud:'BUD service contribution'};
const statusZh:Record<string,string>={active:'参与中',completed:'已完成',withdrawn:'已退出',pending:'待审核',approved:'已通过',rejected:'已驳回'};
const statusEo:Record<string,string>={active:'Aktiva',completed:'Kompletigita',withdrawn:'Retirita',pending:'Atendas kontrolon',approved:'Aprobita',rejected:'Malakceptita'};
const statusEn:Record<string,string>={active:'Active',completed:'Completed',withdrawn:'Withdrawn',pending:'Pending review',approved:'Approved',rejected:'Rejected'};

export default async function PersonalProjectPassportPage({params}:{params:Promise<{id:string}>}){
 const [user,locale,{id}]=await Promise.all([getCurrentUser(),getLocale(),params]);
 if(!user) redirect('/login');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
 const d=await getPersonalProjectPassport(user.id,id); if(!d) notFound();
 const eo=locale==='eo'; const en=locale==='en';
 const label=(eo?kindEo:en?kindEn:kindZh); const status=(eo?statusEo:en?statusEn:statusZh);
 return <main>
  <span className="badge">Passport · Project</span>
  <h1>{eo?'Mia projekta pasporto':en?'My project passport':'我的项目护照'}</h1>
  <p className="lead">{d.context.title}</p>
  <section className="passport-project-context">
   <p><span>{eo?'Rolo':en?'Role':'我的角色'}：</span><strong>{d.context.participation_role}</strong></p>
   <p><span>{eo?'Membra stato':en?'Participation status':'参与状态'}：</span><strong>{status[d.context.member_status]||d.context.member_status}</strong></p>
   <p><span>{eo?'Aliĝdato':en?'Joined':'加入日期'}：</span><strong>{new Date(d.context.joined_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></p>
   <Link href={'/projects/'+id}>{eo?'Reveni al publika projekta dosiero →':en?'Back to public project dossier →':'返回公共项目档案 →'}</Link>
  </section>
  <section className="card">
   <h2>{eo?'Mia kronologio en ĉi tiu projekto':en?'My timeline in this project':'我在本项目中的时间线'}</h2>
   <p className="muted">{eo?'La kronologio uzas nur registritajn datojn: aliĝo al projekto kaj kreotempo de EST/BUD-registroj.':en?'This timeline uses only recorded dates: project joining and EST/BUD record creation times.':'本时间线只使用数据库中真实登记的日期：加入项目时间，以及 EST/BUD 记录创建时间。'}</p>
   {d.events.length?<div className="project-audit-list">{d.events.map(e=>{const raw=e.id.replace(/^(membership|est|bud)-/,'').replace(/-/g,'').slice(0,8);const anchor='personal-project-'+e.kind+'-'+raw;return <article id={anchor} className="project-audit-item" key={e.id}>
    <div className="timeline-date">{new Date(e.occurred_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</div>
    <div><div className="record-top"><strong>{label[e.kind]||e.kind}</strong>{e.status&&<span>{status[e.status]||e.status}</span>}</div><p>{e.title}</p>{e.detail&&<small>{e.detail}</small>}</div>
   </article>})}</div>:<p>{eo?'Neniu persona projekta evento registrita.':en?'No personal project events recorded.':'尚未登记个人项目事件。'}</p>}
  </section>
  <div className="hero-actions"><Link className="button button-primary" href={'/passport/est?project='+id}>{eo?'Miaj EST-registroj':en?'My EST records':'我的 EST 记录'}</Link><Link className="button button-secondary" href={'/passport/bud?project='+id}>{eo?'Miaj BUD-registroj':en?'My BUD records':'我的 BUD 记录'}</Link><Link className="button button-secondary" href="/passport">{eo?'Reveni al la lernopasporto':en?'Back to learning passport':'返回学习护照'}</Link></div>
  <p className="muted">{eo?'Ĉi tiu paĝo estas persona vidpunkto pri via propra partopreno; ĝi ne estas publika projekta poentaro nek regada kvalifiko.':en?'This page is a personal view of your own participation; it is not a public project score or governance qualification.':'本页只是您本人参与该项目的个人视图，不是公开项目评分，也不是治理资格证明。'}</p>
 </main>;
}