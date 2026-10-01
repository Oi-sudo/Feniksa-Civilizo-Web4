import Link from 'next/link';
import { redirect,notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';
import { getPersonalProjectPassport } from '@/lib/passport/project';
import PassportPrintButton from '@/components/passport/PassportPrintButton';
import CopyCitationButton from '@/components/archive/CopyCitationButton';

const kindZh:Record<string,string>={membership:'加入项目',membership_end:'退出项目',est:'EST 知识贡献',bud:'BUD 服务贡献'};
const kindEo:Record<string,string>={membership:'Aliĝo al projekto',membership_end:'Fino de partopreno',est:'EST-scia kontribuo',bud:'BUD-serva kontribuo'};
const kindEn:Record<string,string>={membership:'Joined project',membership_end:'Participation ended',est:'EST knowledge contribution',bud:'BUD service contribution'};
const statusZh:Record<string,string>={active:'参与中',completed:'已完成',withdrawn:'已退出',pending:'待审核',approved:'已通过',rejected:'已驳回'};
const statusEo:Record<string,string>={active:'Aktiva',completed:'Kompletigita',withdrawn:'Retirita',pending:'Atendas kontrolon',approved:'Aprobita',rejected:'Malakceptita'};
const statusEn:Record<string,string>={active:'Active',completed:'Completed',withdrawn:'Withdrawn',pending:'Pending review',approved:'Approved',rejected:'Rejected'};
const projectStatusZh:Record<string,string>={draft:'草稿',approved:'已批准',active:'进行中',paused:'已暂停',completed:'已完成',terminated:'已终止',archived:'已归档'};
const projectStatusEo:Record<string,string>={draft:'Malneto',approved:'Aprobita',active:'Aktiva',paused:'Paŭzita',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita'};
const projectStatusEn:Record<string,string>={draft:'Draft',approved:'Approved',active:'Active',paused:'Paused',completed:'Completed',terminated:'Terminated',archived:'Archived'};

export default async function PersonalProjectPassportPage({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{timeline?:string}>}){
 const [user,locale,{id},queryParams]=await Promise.all([getCurrentUser(),getLocale(),params,searchParams]);
 if(!user) redirect('/login');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) notFound();
 const d=await getPersonalProjectPassport(user.id,id); if(!d) notFound();
 const eo=locale==='eo'; const en=locale==='en';
 const label=(eo?kindEo:en?kindEn:kindZh); const status=(eo?statusEo:en?statusEn:statusZh);
 const archiveDate=new Date().toLocaleDateString(eo?'eo':en?'en-US':'zh-CN');
 const shortProjectRef=id.replace(/-/g,'').slice(0,8);
 const personalProjectRef=`PERSONAL-PROJECT · ${shortProjectRef}`;
 const personalProjectAnchor=`personal-project-passport-${shortProjectRef}`;
 const personalProjectCitation=`Phoenix Personal Project Passport · PERSONAL-PROJECT · ${shortProjectRef} · ${new Date(d.context.joined_at).toISOString().slice(0,10)}`;
 const allowedTimeline=['all','membership','est','bud'];
 const timelineFilter=allowedTimeline.includes(queryParams.timeline||'')?(queryParams.timeline||'all'):'all';
 const visibleEvents=timelineFilter==='all'?d.events:d.events.filter(e=>timelineFilter==='membership'?(e.kind==='membership'||e.kind==='membership_end'):e.kind===timelineFilter);
 const timelineScopeLabel=timelineFilter==='all'?(eo?'Ĉiuj eventoj':en?'All events':'全部事件'):timelineFilter==='membership'?(eo?'Membraj eventoj':en?'Membership events':'成员事件'):timelineFilter.toUpperCase();
 const eventsByYear=visibleEvents.reduce<Record<string,typeof visibleEvents>>((acc,item)=>{const year=String(new Date(item.occurred_at).getFullYear());(acc[year]??=[]).push(item);return acc;},{});
 const eventYears=Object.keys(eventsByYear).sort((a,b)=>Number(a)-Number(b));
 const membershipEventCount=d.events.filter(e=>e.kind==='membership'||e.kind==='membership_end').length;
 const estEventCount=d.events.filter(e=>e.kind==='est').length;
 const budEventCount=d.events.filter(e=>e.kind==='bud').length;
 const latestEvent=d.events.length?[...d.events].sort((a,b)=>new Date(b.occurred_at).getTime()-new Date(a.occurred_at).getTime())[0]:null;
 const projectStatus=(eo?projectStatusEo:en?projectStatusEn:projectStatusZh)[d.context.project_status]||d.context.project_status;
 const memberStatus=status[d.context.member_status]||d.context.member_status;
 const participationState=d.context.left_at?(eo?'Partopreno finiĝis':en?'Participation ended':'参与已结束'):(d.context.member_status==='active'?(eo?'Nun partoprenanta':en?'Currently participating':'当前参与中'):(eo?'Partopreno registrita':en?'Participation recorded':'已有参与记录'));
 return <main id={personalProjectAnchor}>
  <header className="personal-project-print-header">
   <div><strong>{eo?'Persona Projekta Pasporto':en?'Personal Project Passport':'个人项目护照'}</strong><span>Phoenix Passport · Personal Project</span></div>
   <div><span>{eo?'Projekto':en?'Project':'项目'}：{d.context.title}</span><span>{eo?'Arkiva dato':en?'Archive date':'归档日期'}：{archiveDate}</span><span>{eo?'Tempolinia amplekso':en?'Timeline scope':'时间线范围'}：{timelineScopeLabel}</span><span>{personalProjectRef}</span></div>
  </header>
  <span className="badge">Passport · Project</span>
  <h1>{eo?'Mia projekta pasporto':en?'My project passport':'我的项目护照'}</h1>
  <p className="lead">{d.context.title}</p>
  <section className="project-reference-strip personal-project-reference">
   <div><span>{eo?'Persona projekta referenco':en?'Personal project reference':'个人项目护照引用号'}</span><code>{personalProjectRef}</code></div>
   <div><span>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</span><a href={'#'+personalProjectAnchor}>#{personalProjectAnchor}</a></div>
   <div className="project-citation"><span>{eo?'Citformo':en?'Citation format':'引用格式'}</span><code>{personalProjectCitation}</code><CopyCitationButton text={personalProjectCitation} label={eo?'Kopii citon':en?'Copy citation':'复制引用'} copiedLabel={eo?'Kopiita':en?'Copied':'已复制'} /></div>
  </section>
  <p className="muted personal-project-private-note">{eo?'Ĉi tiu estas persona, ensalut-postula dosiero; la loko estas stabila ene de via propra pasporto, sed ĝi ne estas publika registra URL.':en?'This is a personal, sign-in-required dossier; the locator is stable within your own passport, but it is not a public record URL.':'这是登录后本人可访问的个人档案；永久定位在您的个人护照内稳定有效，但不是公开记录网址。'}</p>
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
   <h2>{eo?'Plej lasta registrita agado':en?'Latest recorded activity':'最近一条已登记活动'}</h2>
   {latestEvent?<div className="latest-project-event">
    <div><span>{eo?'Tipo':en?'Type':'类型'}</span><strong>{label[latestEvent.kind]||latestEvent.kind}</strong></div>
    <div><span>{eo?'Dato':en?'Date':'日期'}</span><strong>{new Date(latestEvent.occurred_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></div>
    <div className="latest-project-event-title"><span>{eo?'Registro':en?'Record':'记录'}</span><strong>{latestEvent.title}</strong></div>
   </div>:<p>{eo?'Ankoraŭ neniu registrita agado en ĉi tiu projekto.':en?'No recorded activity in this project yet.':'本项目中尚无已登记活动。'}</p>}
   <p className="muted">{eo?'Ĉi tio montras nur la plej lastan datitan registron; ĝi ne estas mezuro de aktiveco aŭ rendimento.':en?'This shows only the most recent dated record; it is not a measure of activity or performance.':'这里只显示时间上最近的一条已登记记录，不代表活跃度或绩效评分。'}</p>
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
   <p className="muted">{eo?'La kronologio uzas nur registritajn datojn: aliĝo/foriro el projekto kaj kreotempo de EST/BUD-registroj.':en?'This timeline uses only recorded dates: project join/leave dates and EST/BUD record creation times.':'本时间线只使用数据库中真实登记的日期：加入/退出项目时间，以及 EST/BUD 记录创建时间。'}</p>
   <div className="timeline-filters no-print" aria-label={eo?'Filtri personan projektan tempolinion':en?'Filter personal project timeline':'筛选个人项目时间线'}>
    {[["all",eo?'Ĉiuj':en?'All':'全部'],["membership",eo?'Membraj eventoj':en?'Membership':'成员事件'],["est",'EST'],["bud",'BUD']].map(([key,label])=><Link key={key} href={key==='all'?'/passport/projects/'+id:'/passport/projects/'+id+'?timeline='+key} className={timelineFilter===key?'active':''}>{label}</Link>)}
   </div>
   <div className="timeline-summary">
    <div><span>{eo?'Ĉiuj eventoj':en?'All events':'全部事件'}</span><strong>{d.events.length}</strong></div>
    <div><span>{eo?'Membraj eventoj':en?'Membership events':'成员事件'}</span><strong>{membershipEventCount}</strong></div>
    <div><span>EST</span><strong>{estEventCount}</strong></div>
    <div><span>BUD</span><strong>{budEventCount}</strong></div>
    <div><span>{eo?'Nun montrataj':en?'Currently shown':'当前显示'}</span><strong>{visibleEvents.length}</strong></div>
    <div><span>{eo?'Filtrilo':en?'Filter':'筛选条件'}</span><strong>{timelineScopeLabel}</strong></div>
   </div>
   {visibleEvents.length?<div>
    <nav className="timeline-year-index no-print" aria-label={eo?'Jarindekso':en?'Year index':'年份索引'}><span>{eo?'Jaroj':en?'Years':'年份'}</span><div>{eventYears.map(year=><a key={year} href={'#personal-project-year-'+year}>{year}</a>)}</div></nav>
    <div className="passport-timeline-groups">{eventYears.map(year=><section className="timeline-year" id={'personal-project-year-'+year} key={year}><h3>{year}</h3><div className="project-audit-list">{eventsByYear[year].map(e=>{const raw=e.id.replace(/^(membership_end|membership|est|bud)-/,'').replace(/-/g,'').slice(0,8);const anchor='personal-project-'+e.kind+'-'+raw;const type=e.kind==='membership'?'MEMBERSHIP':e.kind==='membership_end'?'MEMBERSHIP-END':e.kind.toUpperCase();const ref=type+' · '+raw;const citation='Phoenix Personal Project Passport · '+type+' · '+raw+' · '+new Date(e.occurred_at).toISOString().slice(0,10);return <article id={anchor} className="project-audit-item" key={e.id}>
    <div className="timeline-date">{new Date(e.occurred_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</div>
    <div><div className="record-top"><strong>{label[e.kind]||e.kind}</strong>{e.status&&<span>{status[e.status]||e.status}</span>}</div><p>{e.title}</p>{e.detail&&<small>{e.detail}</small>}{(e.kind==='membership'||e.kind==='membership_end')&&<div className="membership-facts"><p><span>{eo?'Rolo':en?'Role':'角色'}：</span><strong>{d.context.participation_role}</strong></p><p><span>{eo?'Aliĝdato':en?'Joined':'加入日期'}：</span><strong>{new Date(d.context.joined_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</strong></p><p><span>{eo?'Forirdato':en?'Left':'退出日期'}：</span><strong>{d.context.left_at?new Date(d.context.left_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN'):'—'}</strong></p><p><span>{eo?'Partoprena stato':en?'Participation status':'参与状态'}：</span><strong>{status[d.context.member_status]||d.context.member_status}</strong></p></div>}<p className="subrecord-ref"><code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a><span className="citation-format">{eo?'Citformo':en?'Citation format':'引用格式'}：{citation}<CopyCitationButton text={citation} label={eo?'Kopii citon':en?'Copy citation':'复制引用'} copiedLabel={eo?'Kopiita':en?'Copied':'已复制'} /></span></p>{(e.kind==='est'||e.kind==='bud')&&<p className="personal-project-source-link no-print"><Link href={(e.kind==='est'?'/passport/est?project='+id+'#est-record-':'/passport/bud?project='+id+'#bud-record-')+e.id.replace(/^(est|bud)-/,'')}>{eo?'Vidi la originan personan registron →':en?'View original personal record →':'查看个人原始记录 →'}</Link></p>}</div>
   </article>})}</div></section>)}</div></div>:<p>{timelineFilter==='all'?(eo?'Neniu persona projekta evento registrita.':en?'No personal project events recorded.':'尚未登记个人项目事件。'):(eo?'Neniu evento en ĉi tiu filtrilo.':en?'No events in this filter.':'当前筛选下没有事件。')}</p>}
  </section>
  <footer className="personal-project-print-footer"><strong>{eo?'Arkiva noto':en?'Archive note':'归档说明'}</strong><p>{eo?'Ĉi tiu presaĵo aŭ PDF enhavas nur la proprajn projektajn registrojn de la ensalutinta uzanto. Ĝi estas nurlegebla momentbildo kaj ne estas publika projekta poentaro aŭ regada atestilo.':en?'This printout or PDF contains only the signed-in user’s own project records. It is a read-only snapshot and is not a public project score or governance credential.':'本打印件或 PDF 只包含当前登录用户本人在该项目中的记录，是只读快照，不是公开项目评分或治理资格证明。'}</p></footer>
  <div className="hero-actions no-print"><Link className="button button-primary" href={'/passport/est?project='+id}>{eo?'Miaj EST-registroj':en?'My EST records':'我的 EST 记录'}</Link><Link className="button button-secondary" href={'/passport/bud?project='+id}>{eo?'Miaj BUD-registroj':en?'My BUD records':'我的 BUD 记录'}</Link><Link className="button button-secondary" href="/passport">{eo?'Reveni al la lernopasporto':en?'Back to learning passport':'返回学习护照'}</Link></div>
  <p className="muted">{eo?'Ĉi tiu paĝo estas persona vidpunkto pri via propra partopreno; ĝi ne estas publika projekta poentaro nek regada kvalifiko.':en?'This page is a personal view of your own participation; it is not a public project score or governance qualification.':'本页只是您本人参与该项目的个人视图，不是公开项目评分，也不是治理资格证明。'}</p>
 </main>;
}