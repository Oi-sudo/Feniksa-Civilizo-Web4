import Link from 'next/link';
import { redirect,notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';
import { getPersonalProjectPassport } from '@/lib/passport/project';
import PassportPrintButton from '@/components/passport/PassportPrintButton';

const kindZh:Record<string,string>={membership:'加入项目',membership_end:'退出项目',est:'EST 知识贡献',bud:'BUD 服务贡献'};
const kindEo:Record<string,string>={membership:'Aliĝo al projekto',membership_end:'Fino de partopreno',est:'EST-scia kontribuo',bud:'BUD-serva kontribuo'};
const kindEn:Record<string,string>={membership:'Joined project',membership_end:'Participation ended',est:'EST knowledge contribution',bud:'BUD service contribution'};
const statusZh:Record<string,string>={active:'参与中',completed:'已完成',withdrawn:'已退出',pending:'待审核',approved:'已通过',rejected:'已驳回'};
const statusEo:Record<string,string>={active:'Aktiva',completed:'Kompletigita',withdrawn:'Retirita',pending:'Atendas kontrolon',approved:'Aprobita',rejected:'Malakceptita'};
const statusEn:Record<string,string>={active:'Active',completed:'Completed',withdrawn:'Withdrawn',pending:'Pending review',approved:'Approved',rejected:'Rejected'};
const projectStatusZh:Record<string,string>={draft:'草稿',approved:'已批准',active:'进行中',paused:'已暂停',completed:'已完成',terminated:'已终止',archived:'已归档'};
const projectStatusEo:Record<string,string>={draft:'Malneto',approved:'Aprobita',active:'Aktiva',paused:'Paŭzita',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita'};
const projectStatusEn:Record<string,string>={draft:'Draft',approved:'Approved',active:'Active',paused:'Paused',completed:'Completed',terminated:'Terminated',archived:'Archived'};

export default async function PersonalProjectPassportPage({params}:{params:Promise<{id:string}>}){
 const [user,locale,{id}]=await Promise.all([getCurrentUser(),getLocale(),params]);
 if(!user) redirect('/login');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
 const d=await getPersonalProjectPassport(user.id,id); if(!d) notFound();
 const eo=locale==='eo'; const en=locale==='en';
 const label=(eo?kindEo:en?kindEn:kindZh); const status=(eo?statusEo:en?statusEn:statusZh);
 const archiveDate=new Date().toLocaleDateString(eo?'eo':en?'en-US':'zh-CN');
 const projectStatus=(eo?projectStatusEo:en?projectStatusEn:projectStatusZh)[d.context.project_status]||d.context.project_status;
 const memberStatus=status[d.context.member_status]||d.context.member_status;
 const participationState=d.context.left_at?(eo?'Partopreno finiĝis':en?'Participation ended':'参与已结束'):(d.context.member_status==='active'?(eo?'Nun partoprenanta':en?'Currently participating':'当前参与中'):(eo?'Partopreno registrita':en?'Participation recorded':'已有参与记录'));
 return <main>
  <header className="personal-project-print-header">
   <div><strong>{eo?'Persona Projekta Pasporto':en?'Personal Project Passport':'个人项目护照'}</strong><span>Phoenix Passport · Personal Project</span></div>
   <div><span>{eo?'Projekto':en?'Project':'项目'}：{d.context.title}</span><span>{eo?'Arkiva dato':en?'Archive date':'归档日期'}：{archiveDate}</span></div>
  </header>
  <span className="badge">Passport · Project</span>
  <h1>{eo?'Mia projekta pasporto':en?'My project passport':'我的项目护照'}</h1>
  <p className="lead">{d.context.title}</p>
  <div className="hero-actions no-print"><PassportPrintButton label={eo?'Presi / konservi kiel PDF':en?'Print / save as PDF':'打印 / 存为 PDF'} /></div>
  <section className="passport-project-context">
   <p><span>{eo?'Rolo':en?'Role':'我的角色'}：</span><strong>{d.context.participation_role}</strong></p>
   <p><span>{eo?'Membra stato':en?'Participation status':'参与状态'}：</span><strong>{status[d.context.member_status]||d.context.member_status}</strong></p>
   <p><span>{eo?'Aliĝdato':en?'Joined':'加入日期'}：</span><strong>{new Date(d.context.joined_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></p>
   <Link href={'/projects/'+id}>{eo?'Reveni al publika projekta dosiero →':en?'Back to public project dossier →':'返回公共项目档案 →'}</Link>
  </section>
  <section className="card">
   <h2>{eo?'Vivcikla resumo':en?'Participation lifecycle':'参与生命周期摘要'}</h2>
   <div className="personal-project-lifecycle">
    <div><span>{eo?'Projekta stato':en?'Project status':'项目状态'}</span><strong>{projectStatus}</strong></div>
    <div><span>{eo?'Mia partoprena stato':en?'My participation status':'我的参与状态'}</span><strong>{memberStatus}</strong></div>
    <div><span>{eo?'Aliĝdato':en?'Joined':'加入日期'}</span><strong>{new Date(d.context.joined_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></div>
    <div><span>{eo?'Forirdato':en?'Left':'退出日期'}</span><strong>{d.context.left_at?new Date(d.context.left_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN'):'—'}</strong></div>
    <div className="lifecycle-state"><span>{eo?'Nuna vivcikla stato':en?'Current lifecycle state':'当前生命周期状态'}</span><strong>{participationState}</strong></div>
   </div>
   <p className="muted">{eo?'La resumo uzas nur la registritajn projektan staton, membran staton kaj aliĝ-/forirdatojn.':en?'This summary uses only recorded project status, membership status, and join/leave dates.':'本摘要只使用已登记的项目状态、成员状态以及加入/退出日期。'}</p>
  </section>

  <section className="card">
   <h2>{eo?'Mia resumo en ĉi tiu projekto':en?'My summary in this project':'我在本项目中的摘要'}</h2>
   <div className="project-contribution-grid">
    <div><span>EST</span><strong>{d.summary.est_value}</strong><small>{eo?'Aprobitaj registroj':en?'Approved records':'已批准记录'}：{d.summary.est_count}</small></div>
    <div><span>BUD</span><strong>{d.summary.bud_value}</strong><small>{eo?'Aprobitaj registroj':en?'Approved records':'已批准记录'}：{d.summary.bud_count} · {eo?'Horoj':en?'Hours':'小时'}：{d.summary.bud_hours}</small></div>
   </div>
   <p className="muted">{eo?'Ĉi tiuj estas viaj propraj aprobitaj registroj en ĉi tiu projekto. Ili ne estas projekta poentaro, religia atingo nek regada kvalifiko.':en?'These are your own approved records in this project. They are not a project score, religious attainment, or governance qualification.':'这些只是您本人在本项目中的已批准记录，不是项目评分、宗教修证证明或治理资格。'}</p>
  </section>

  <section className="card">
   <h2>{eo?'Mia kronologio en ĉi tiu projekto':en?'My timeline in this project':'我在本项目中的时间线'}</h2>
   <p className="muted">{eo?'La kronologio uzas nur registritajn datojn: aliĝo al projekto kaj kreotempo de EST/BUD-registroj.':en?'This timeline uses only recorded dates: project joining and EST/BUD record creation times.':'本时间线只使用数据库中真实登记的日期：加入项目时间，以及 EST/BUD 记录创建时间。'}</p>
   {d.events.length?<div className="project-audit-list">{d.events.map(e=>{const raw=e.id.replace(/^(membership_end|membership|est|bud)-/,'').replace(/-/g,'').slice(0,8);const anchor='personal-project-'+e.kind+'-'+raw;const type=e.kind==='membership'?'MEMBERSHIP':e.kind==='membership_end'?'MEMBERSHIP-END':e.kind.toUpperCase();const ref=type+' · '+raw;const citation='Phoenix Personal Project Passport · '+type+' · '+raw+' · '+new Date(e.occurred_at).toISOString().slice(0,10);return <article id={anchor} className="project-audit-item" key={e.id}>
    <div className="timeline-date">{new Date(e.occurred_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</div>
    <div><div className="record-top"><strong>{label[e.kind]||e.kind}</strong>{e.status&&<span>{status[e.status]||e.status}</span>}</div><p>{e.title}</p>{e.detail&&<small>{e.detail}</small>}{(e.kind==='membership'||e.kind==='membership_end')&&<div className="membership-facts"><p><span>{eo?'Rolo':en?'Role':'角色'}：</span><strong>{d.context.participation_role}</strong></p><p><span>{eo?'Aliĝdato':en?'Joined':'加入日期'}：</span><strong>{new Date(d.context.joined_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></p><p><span>{eo?'Forirdato':en?'Left':'退出日期'}：</span><strong>{d.context.left_at?new Date(d.context.left_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN'):'—'}</strong></p><p><span>{eo?'Partoprena stato':en?'Participation status':'参与状态'}：</span><strong>{status[d.context.member_status]||d.context.member_status}</strong></p></div>}<p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a><span className="citation-format">{eo?'Citformo':en?'Citation format':'引用格式'}：{citation}</span></p>{(e.kind==='est'||e.kind==='bud')&&<p className="personal-project-source-link no-print"><Link href={(e.kind==='est'?'/passport/est?project='+id+'#est-record-':'/passport/bud?project='+id+'#bud-record-')+e.id.replace(/^(est|bud)-/,'')}>{eo?'Vidi la originan personan registron →':en?'View original personal record →':'查看个人原始记录 →'}</Link></p>}</div>
   </article>})}</div>:<p>{eo?'Neniu persona projekta evento registrita.':en?'No personal project events recorded.':'尚未登记个人项目事件。'}</p>}
  </section>
  <footer className="personal-project-print-footer"><strong>{eo?'Arkiva noto':en?'Archive note':'归档说明'}</strong><p>{eo?'Ĉi tiu presaĵo aŭ PDF enhavas nur la proprajn projektajn registrojn de la ensalutinta uzanto. Ĝi estas nurlegebla momentbildo kaj ne estas publika projekta poentaro aŭ regada atestilo.':en?'This printout or PDF contains only the signed-in user’s own project records. It is a read-only snapshot and is not a public project score or governance credential.':'本打印件或 PDF 只包含当前登录用户本人在该项目中的记录，是只读快照，不是公开项目评分或治理资格证明。'}</p></footer>
  <div className="hero-actions no-print"><Link className="button button-primary" href={'/passport/est?project='+id}>{eo?'Miaj EST-registroj':en?'My EST records':'我的 EST 记录'}</Link><Link className="button button-secondary" href={'/passport/bud?project='+id}>{eo?'Miaj BUD-registroj':en?'My BUD records':'我的 BUD 记录'}</Link><Link className="button button-secondary" href="/passport">{eo?'Reveni al la lernopasporto':en?'Back to learning passport':'返回学习护照'}</Link></div>
  <p className="muted">{eo?'Ĉi tiu paĝo estas persona vidpunkto pri via propra partopreno; ĝi ne estas publika projekta poentaro nek regada kvalifiko.':en?'This page is a personal view of your own participation; it is not a public project score or governance qualification.':'本页只是您本人参与该项目的个人视图，不是公开项目评分，也不是治理资格证明。'}</p>
 </main>;
}