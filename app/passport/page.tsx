import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getPassportOverview } from '@/lib/passport/data';
import { getLocale,getMessages } from '@/lib/i18n';

const userRoleZh:Record<string,string>={learner:'学习者',admin:'管理员',curator:'馆藏整理员',museum_reviewer:'馆藏审核员'};
const userRoleEo:Record<string,string>={learner:'Lernanto',admin:'Administranto',curator:'Muzea prizorganto',museum_reviewer:'Muzea kontrolanto'};
const userRoleEn:Record<string,string>={learner:'Learner',admin:'Administrator',curator:'Museum curator',museum_reviewer:'Museum reviewer'};
const visibilityZh:Record<string,string>={private:'私密',members:'成员可见',public:'公开'};
const visibilityEo:Record<string,string>={private:'Privata',members:'Videbla al membroj',public:'Publika'};
const visibilityEn:Record<string,string>={private:'Private',members:'Visible to members',public:'Public'};
const languageZh:Record<string,string>={zh:'中文',eo:'世界语',en:'英语'};
const languageEo:Record<string,string>={zh:'Ĉina',eo:'Esperanto',en:'Angla'};
const languageEn:Record<string,string>={zh:'Chinese',eo:'Esperanto',en:'English'};

const learningZh:Record<string,string>={not_started:'尚未开始',in_progress:'学习中',completed:'已完成'};
const learningEo:Record<string,string>={not_started:'Ne komencita',in_progress:'En lernado',completed:'Kompletigita'};
const learningEn:Record<string,string>={not_started:'Not started',in_progress:'In progress',completed:'Completed'};
const projectStatusZh:Record<string,string>={active:'进行中',completed:'已完成',paused:'已暂停',closed:'已结束'};
const projectStatusEo:Record<string,string>={active:'Aktiva',completed:'Kompletigita',paused:'Paŭzita',closed:'Fermita'};
const projectStatusEn:Record<string,string>={active:'Active',completed:'Completed',paused:'Paused',closed:'Closed'};
const roleZh:Record<string,string>={member:'成员',manager:'负责人',observer:'观察员'};
const roleEo:Record<string,string>={member:'Membro',manager:'Respondeculo',observer:'Observanto'};
const roleEn:Record<string,string>={member:'Member',manager:'Manager',observer:'Observer'};
const workStatusZh:Record<string,string>={draft:'草稿',published:'已发布',archived:'已归档'};
const workStatusEo:Record<string,string>={draft:'Malneto',published:'Publikigita',archived:'Arkivita'};
const workStatusEn:Record<string,string>={draft:'Draft',published:'Published',archived:'Archived'};
const workTypeZh:Record<string,string>={translation:'翻译',article:'文章',lesson:'课程作品',museum:'博物馆资料'};
const workTypeEo:Record<string,string>={translation:'Traduko',article:'Artikolo',lesson:'Kursa verko',museum:'Muzea materialo'};
const workTypeEn:Record<string,string>={translation:'Translation',article:'Article',lesson:'Course work',museum:'Museum material'};

const yaoNames=[
  ['初爻 · 觉醒','Unua linio · Vekiĝo'],
  ['二爻 · 无我','Dua linio · Sen-memo'],
  ['三爻 · 开悟','Tria linio · Kompreno'],
  ['四爻 · 愿行','Kvara linio · Vola agado'],
  ['五爻 · 菩萨愿行','Kvina linio · Bodisatva agado'],
  ['六爻 · 大同共行识','Sesa linio · Komuna monda agado']
];

export default async function PassportPage({searchParams}:{searchParams:Promise<{timeline?:string}>}){
  const user=await getCurrentUser();
  if(!user) redirect('/login');
  const [locale,m,p]=await Promise.all([getLocale(),getMessages(),searchParams]); const eo=locale==='eo'; const en=locale==='en';
  const timelineFilter=['all','est','bud','project','work'].includes(p.timeline||'')?(p.timeline||'all'):'all';
  const d=await getPassportOverview(user.id);
  const filteredTimeline=timelineFilter==='all'?d.timeline:d.timeline.filter(x=>x.kind===timelineFilter);
  const timelineByYear=filteredTimeline.reduce<Record<string,typeof filteredTimeline>>((acc,item)=>{
    const year=String(new Date(item.occurred_at).getFullYear());
    (acc[year]??=[]).push(item);
    return acc;
  },{});
  const timelineYears=Object.keys(timelineByYear).sort((a,b)=>Number(b)-Number(a));
  const six=new Map(d.sixYao.map(x=>[x.stage,x]));
  const activeYao=[...d.sixYao]
    .filter(x=>x.learning_status==='in_progress'||x.learning_status==='completed')
    .sort((a,b)=>b.stage-a.stage)[0];
  const currentYaoIndex=activeYao?Math.max(0,Math.min(5,activeYao.stage-1)):-1;
  const currentYaoLabel=currentYaoIndex>=0
    ? (locale==='eo'?yaoNames[currentYaoIndex][1]:locale==='en'?['First line · Awakening','Second line · Non-self','Third line · Insight','Fourth line · Vow in action','Fifth line · Bodhisattva action','Sixth line · Shared world action'][currentYaoIndex]:yaoNames[currentYaoIndex][0])
    : (eo?'Ne komencita':en?'Not started':'尚未开始');

  return <main>
    <span className="badge">{m.passport_badge}</span>
    <h1>{m.passport_title}</h1>
    <p className="lead">{(m.passport_welcome||'欢迎回来，{name}。').replace('{name}',user.display_name)}</p>

    <section className="card">
      <h2>{eo?'Lerna identeco':en?'Learning identity':'学习身份 · Lerna identeco'}</h2>
      <p><strong>{m.display_name_label}</strong> {user.display_name}</p>
      <p><strong>{m.email_label}</strong> {user.email}</p>
      <p><strong>{m.preferred_language_label}</strong> {(eo?languageEo:en?languageEn:languageZh)[user.preferred_language]||user.preferred_language.toUpperCase()}</p>
      <p><strong>{m.current_roles}</strong> {(user.roles.length?user.roles:['learner']).map(r=>(eo?userRoleEo:en?userRoleEn:userRoleZh)[r]||r).join(', ')}</p>
      <p><strong>{m.passport_privacy}</strong> {(eo?visibilityEo:en?visibilityEn:visibilityZh)[d.visibility]||d.visibility}</p>
    </section>

    <section className="passport-current card">
      <div className="passport-current-head">
        <div>
          <span className="badge">{eo?'Nuna superrigardo':en?'Current overview':'当前概览'}</span>
          <h2>{eo?'Mia nuna registra bildo':en?'My current record snapshot':'我的当前记录概览'}</h2>
        </div>
        <p>{eo?'Resumo por rapida legado; ne poentaro nek rango.':en?'A quick-reading summary, not a score or rank.':'用于快速阅读的记录摘要，不是评分，也不是等级。'}</p>
      </div>
      <div className="passport-overview-grid">
        <div><span>{eo?'Ses-linia etapo':en?'Six-line stage':'六爻阶段'}</span><strong>{currentYaoLabel}</strong></div>
        <Link href="/passport/est"><span>EST</span><strong>{d.est.value}</strong><small>{eo?`${d.est.approved} aprobitaj`:en?`${d.est.approved} approved`:`${d.est.approved} 条已审核`}</small></Link>
        <Link href="/passport/bud"><span>BUD</span><strong>{d.bud.value}</strong><small>{d.bud.hours}h</small></Link>
        <Link href="/projects"><span>{eo?'Projektoj':en?'Projects':'项目'}</span><strong>{d.projects.length}</strong></Link>
        <div><span>{eo?'Verkoj':en?'Works':'作品'}</span><strong>{d.works.length}</strong></div>
      </div>
    </section>

    <section className="stat-grid">
      <div className="stat-card"><strong>{d.courses.completed}</strong><span>{eo?'Kompletigitaj kursoj':en?'Completed courses':'完成课程 · Kursoj'}</span><small>{eo?`Aktivaj ${d.courses.active} · Registritaj ${d.courses.total}`:en?`Active ${d.courses.active} · Recorded ${d.courses.total}`:`学习中 ${d.courses.active} · 有记录 ${d.courses.total}`}</small></div>
      <Link className="stat-card" href="/passport/est"><strong>{d.est.value}</strong><span>{eo?'EST · Esperanta Kontribua Registro':en?'EST · Esperanto Contribution Record':'EST 世界语币'}</span><small>{eo?`Aprobitaj registroj ${d.est.approved} · Vidi detalojn →`:en?`Approved records ${d.est.approved} · View details →`:`已审核记录 ${d.est.approved} · 查看明细 →`}</small></Link>
      <Link className="stat-card" href="/passport/bud"><strong>{d.bud.value}</strong><span>{eo?'BUD · Vola-Agada Registro':en?'BUD · Vow-and-Action Record':'BUD 佛光币'}</span><small>{eo?`Aprobitaj ${d.bud.approved} · Servo ${d.bud.hours} horoj · Vidi detalojn →`:en?`Approved ${d.bud.approved} · Service ${d.bud.hours} hours · View details →`:`已审核 ${d.bud.approved} · 服务 ${d.bud.hours} 小时 · 查看明细 →`}</small></Link>
    </section>

    <section className="card passport-path">
      <h2>{eo?'Mia socia vojo':en?'My social path':'我的社会运行路径'}</h2>
      <p className="muted">{eo?'La pasporto kunigas lernadon, publikan diskuton, projektan partoprenon, servoregistrojn kaj verkojn en unu persona kronologio. Ĝi estas vojo de partopreno, ne rango de homo.':en?'The passport brings learning, public discussion, project participation, service records and works together into one personal chronology. It is a participation path, not a ranking of the person.':'学习护照把学习、公共议事、项目参与、服务记录与作品档案汇成一条个人轨迹。它记录参与路径，不给人排序。'}</p>
      <div className="life-path-steps passport-life-path">
        <Link href="/courses"><span>01</span><strong>{eo?'Lerni':en?'Learn':'学习'}</strong><small>{eo?`${d.courses.completed} kompletigitaj`:en?`${d.courses.completed} completed`:`已完成 ${d.courses.completed} 门`}</small></Link>
        <Link href="/passport/est"><span>02</span><strong>{eo?'Kontribui per scio':en?'Contribute knowledge':'知识贡献'}</strong><small>EST {d.est.value}</small></Link>
        <Link href="/dad"><span>03</span><strong>{eo?'Diskuti':en?'Discuss':'议事'}</strong><small>DAD</small></Link>
        <Link href="/projects"><span>04</span><strong>{eo?'Partopreni projektojn':en?'Join projects':'参与项目'}</strong><small>{d.projects.length}</small></Link>
        <Link href="/passport/bud"><span>05</span><strong>{eo?'Servi':en?'Serve':'服务'}</strong><small>BUD {d.bud.value} · {d.bud.hours}h</small></Link>
        <Link href="/museum"><span>06</span><strong>{eo?'Konservi kulturon':en?'Preserve culture':'文化存录'}</strong><small>{eo?'Muzeo':en?'Museum':'博物馆'}</small></Link>
        <Link href="/passport"><span>07</span><strong>{eo?'Reveni al mia pasporto':en?'Return to my passport':'回到个人护照'}</strong><small>{eo?'Unu persona kronologio':en?'One personal chronology':'个人总轨迹'}</small></Link>
      </div>
      <div className="dual-record-grid">
        <div><strong>EST</strong><p>{eo?'Lernado, tradukado, instruado kaj sciaj kontribuoj.':en?'Learning, translation, teaching and knowledge contributions.':'学习、翻译、教学与知识贡献。'}</p></div>
        <div><strong>BUD</strong><p>{eo?'Vola agado, volontula servo kaj publika servo.':en?'Vow-in-action, volunteer service and public service.':'愿行、志愿服务与公共服务。'}</p></div>
      </div>
      <p className="muted">{eo?'EST kaj BUD estas du malsamaj registrovojoj: unu por scia kaj lerna kontribuo, la alia por reala servo. Ili povas aperi kune en la pasporto, sed ne estas interŝanĝeblaj kaj ne difinas la valoron de homo.':en?'EST and BUD are two different record paths: one for learning and knowledge contribution, the other for real service. They can appear together in the passport, but they are not interchangeable and do not define a person’s value.':'EST 与 BUD 是两条不同的记录路径：一条记录学习与知识贡献，一条记录真实服务。它们可以共同进入护照，但彼此不可替代，也不定义一个人的价值。'}</p>
    </section>

    <section className="card">
      <h2>{eo?'Tri apartaj dimensioj de la pasporto':en?'Three separate passport dimensions':'护照的三个独立维度'}</h2>
      <div className="passport-dimensions">
        <div><strong>{eo?'Lerna etapo':en?'Learning stage':'学习阶段'}</strong><p>{eo?'Ses-linia lernovojo registras la nunan studan kaj praktikan etapon.':en?'The six-line learning journey records the current study and practice stage.':'六爻成长轨迹记录当前学习与实践阶段。'}</p></div>
        <div><strong>EST</strong><p>{eo?'Registras lernadon, tradukadon, instruadon kaj sciajn kontribuojn.':en?'Records learning, translation, teaching and knowledge contributions.':'记录学习、翻译、教学与知识贡献。'}</p></div>
        <div><strong>BUD</strong><p>{eo?'Registras volan agadon, volontulan servon kaj publikan servon.':en?'Records vow-in-action, volunteer service and public service.':'记录愿行、志愿服务与公共服务。'}</p></div>
      </div>
      <p className="muted">{eo?'La tri dimensioj povas rilati unu al alia, sed neniu aŭtomate determinas la alian. Ili ne estas religia rango, persona poentaro aŭ regrajto.':en?'The three dimensions may relate to one another, but none automatically determines another. They are not religious rank, a personal score or governance rights.':'三个维度可以彼此关联，但任何一项都不会自动决定另一项。它们不是宗教等级、人格分数或治理权。'}</p>
    </section>

    <section className="card">
      <h2>{eo?'Ses-linia lernovojo':en?'Six-line learning journey':'六爻成长轨迹 · Ses-linia lernovojo'}</h2>
      <p className="muted">{eo?'Ĝi registras lernadon kaj praktikon, sed ne atestas religian atingon kaj ne kreas membran rangon.':en?'It records learning and practice, but does not certify religious attainment or create member rank.':'记录学习与实践轨迹，不认证宗教修证境界，也不形成成员等级。'}</p>
      <div className="yao-grid">
        {yaoNames.map(([zh,eo],i)=>{
          const row=six.get(i+1);
          return <div className="yao-card" key={zh}><strong>{locale==='eo'?eo:locale==='en'?['First line · Awakening','Second line · Non-self','Third line · Insight','Fourth line · Vow in action','Fifth line · Bodhisattva action','Sixth line · Shared world action'][i]:zh}</strong>{locale==='zh'&&<span>{eo}</span>}<small>{row?((eo?learningEo:en?learningEn:learningZh)[row.learning_status]||row.learning_status):(eo?'Ne komencita':en?'Not started':'尚未开始')}</small></div>
        })}
      </div>
    </section>

    <section className="card">
      <h2>{eo?'Persona registra tempolinio':en?'Personal record timeline':'个人记录时间线'}</h2>
      <p className="muted">{eo?'Nur registroj kun reala datotempo estas montrataj ĉi tie: aprobitaj EST/BUD-registroj, aliĝo al projektoj kaj kreitaj verkoj.':en?'Only records with a real database timestamp are shown here: approved EST/BUD records, project joins and created works.':'这里只显示数据库中有真实时间戳的记录：已审核 EST/BUD、加入项目与创建作品。'}</p>
      <div className="timeline-summary">
        <div><span>{eo?'Ĉiuj datitaj registroj':en?'All dated records':'全部有日期记录'}</span><strong>{d.timeline.length}</strong></div>
        <div><span>{eo?'Nun montrataj':en?'Currently shown':'当前显示'}</span><strong>{filteredTimeline.length}</strong></div>
        <div><span>{eo?'Jaroj':en?'Years':'涉及年份'}</span><strong>{timelineYears.length}</strong></div>
      </div>
      <div className="timeline-filters" aria-label={eo?'Filtri tempolinion':en?'Filter timeline':'筛选时间线'}>
        {[
          ['all',eo?'Ĉiuj':en?'All':'全部'],
          ['est','EST'],
          ['bud','BUD'],
          ['project',eo?'Projektoj':en?'Projects':'项目'],
          ['work',eo?'Verkoj':en?'Works':'作品']
        ].map(([key,label])=><Link key={key} href={key==='all'?'/passport':`/passport?timeline=${key}`} className={timelineFilter===key?'active':''}>{label}</Link>)}
      </div>
      {filteredTimeline.length?<div>
        <nav className="timeline-year-index" aria-label={eo?'Jarindekso':en?'Year index':'年份索引'}>
          <span>{eo?'Jaroj':en?'Years':'年份'}</span>
          <div>{timelineYears.map(year=><a key={year} href={`#timeline-year-${year}`}>{year}</a>)}</div>
        </nav>
        <div className="passport-timeline-groups">
        {timelineYears.map(year=><section className="timeline-year" id={`timeline-year-${year}`} key={year}>
          <h3>{year}</h3>
          <div className="passport-timeline">
            {timelineByYear[year].map(item=>{
              const kindLabel=item.kind==='est'?'EST':item.kind==='bud'?'BUD':item.kind==='project'?(eo?'Projekto':en?'Project':'项目'):(eo?'Verko':en?'Work':'作品');
              const detail=item.kind==='project' ? ((eo?roleEo:en?roleEn:roleZh)[item.detail||'']||item.detail) : item.kind==='work' ? ((eo?workTypeEo:en?workTypeEn:workTypeZh)[item.detail||'']||item.detail) : item.detail;
              const rawId=item.id.replace(/^(est|bud|project|work)-/,'');
              const sourceHref=item.kind==='est'?`/passport/est#est-record-${rawId}`:item.kind==='bud'?`/passport/bud#bud-record-${rawId}`:item.kind==='project'?`/passport#project-record-${rawId}`:`/passport#work-record-${rawId}`;
              const sourceLabel=eo?'Vidi fontan registron →':en?'View source record →':'查看来源记录 →';
              const sourceType=item.kind==='est'?(eo?'EST-registro':en?'EST record':'EST记录'):item.kind==='bud'?(eo?'BUD-registro':en?'BUD record':'BUD记录'):item.kind==='project'?(eo?'Projekta membroregistro':en?'Project membership record':'项目成员记录'):(eo?'Verka dosiero':en?'Work archive':'作品档案');
              const shortRef=`${kindLabel} · ${rawId.replace(/-/g,'').slice(0,8)}`;
              return <article className="timeline-item" key={item.id}>
                <div className="timeline-date">{new Date(item.occurred_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</div>
                <div><span className="badge">{kindLabel}</span><h3>{item.title}</h3>{detail&&<p>{detail}</p>}<p className="timeline-source-type">{eo?'Fonttipo:':en?'Source type:':'来源类型：'} {sourceType}</p><p className="timeline-source-ref">{eo?'Referenco:':en?'Reference:':'记录标识：'} <code>{shortRef}</code></p><Link className="timeline-source-link" href={sourceHref}>{sourceLabel}</Link></div>
              </article>;
            })}
          </div>
        </section>)}
        </div>
      </div>:<p>{timelineFilter==='all'?(eo?'Ankoraŭ ne estas datitaj registroj por la tempolinio.':en?'There are no dated records for the timeline yet.':'目前还没有可按日期排列的记录。'):(eo?'Ne estas registroj en ĉi tiu filtrilo.':en?'There are no records in this filter.':'当前筛选下没有记录。')}</p>}
    </section>

    <section className="card">
      <h2>{m.passport_projects} · Projektoj</h2>
      {d.projects.length?d.projects.map(p=><p id={`project-record-${p.id}`} key={p.id}>{p.title} · {(eo?roleEo:en?roleEn:roleZh)[p.role]||p.role} · {(eo?projectStatusEo:en?projectStatusEn:projectStatusZh)[p.status]||p.status}</p>):<p>{m.no_projects_yet}</p>}
      <Link href="/projects">{eo?'Vidi projektan enirejon →':en?'View project entry →':'查看项目入口 →'}</Link>
    </section>

    <section className="card">
      <h2>{eo?'Verkoj':en?'Works':'作品档案 · Verkoj'}</h2>
      {d.works.length?d.works.map(w=><p id={`work-record-${w.id}`} key={w.id}>{w.url?<a href={w.url}>{w.title}</a>:w.title} · {(eo?workTypeEo:en?workTypeEn:workTypeZh)[w.work_type]||w.work_type} · {(eo?workStatusEo:en?workStatusEn:workStatusZh)[w.status]||w.status}</p>):<p>{m.no_works_yet}</p>}
    </section>

    <section className="card">
      <h2>{eo?'Principo de la pasporto':en?'Passport principle':'护照原则 · Principo'}</h2>
      <p>{eo?'La pasporto registras la vojon, sed ne difinas la valoron de homo. EST, BUD, kursoj kaj projektoj estas kontroleblaj registroj; ili ne estas rangigo de personeco nek atesto de religia atingo.':en?'The passport records the path but does not define a person’s value. EST, BUD, courses and projects are verifiable records; they are not personality rankings or certifications of religious attainment.':'护照记道路，不定义一个人的价值。EST、BUD、课程和项目都是可核查记录，不是人格排名，也不是宗教果位认证。'}</p>
    </section>
  </main>;
}
