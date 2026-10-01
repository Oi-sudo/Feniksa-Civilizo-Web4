import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { getPassportOverview } from '@/lib/passport/data';
import { getLocale,getMessages } from '@/lib/i18n';

const userRoleZh:Record<string,string>={learner:'学习者',admin:'管理员',curator:'馆藏整理员',museum_reviewer:'馆藏审核员'};
const userRoleEo:Record<string,string>={learner:'Lernanto',admin:'Administranto',curator:'Muzea prizorganto',museum_reviewer:'Muzea kontrolanto'};
const visibilityZh:Record<string,string>={private:'私密',members:'成员可见',public:'公开'};
const visibilityEo:Record<string,string>={private:'Privata',members:'Videbla al membroj',public:'Publika'};
const languageZh:Record<string,string>={zh:'中文',eo:'世界语',en:'英语'};
const languageEo:Record<string,string>={zh:'Ĉina',eo:'Esperanto',en:'Angla'};

const learningZh:Record<string,string>={not_started:'尚未开始',in_progress:'学习中',completed:'已完成'};
const learningEo:Record<string,string>={not_started:'Ne komencita',in_progress:'En lernado',completed:'Kompletigita'};
const projectStatusZh:Record<string,string>={active:'进行中',completed:'已完成',paused:'已暂停',closed:'已结束'};
const projectStatusEo:Record<string,string>={active:'Aktiva',completed:'Kompletigita',paused:'Paŭzita',closed:'Fermita'};
const roleZh:Record<string,string>={member:'成员',manager:'负责人',observer:'观察员'};
const roleEo:Record<string,string>={member:'Membro',manager:'Respondeculo',observer:'Observanto'};
const workStatusZh:Record<string,string>={draft:'草稿',published:'已发布',archived:'已归档'};
const workStatusEo:Record<string,string>={draft:'Malneto',published:'Publikigita',archived:'Arkivita'};
const workTypeZh:Record<string,string>={translation:'翻译',article:'文章',lesson:'课程作品',museum:'博物馆资料'};
const workTypeEo:Record<string,string>={translation:'Traduko',article:'Artikolo',lesson:'Kursa verko',museum:'Muzea materialo'};

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
  const [locale,m]=await Promise.all([getLocale(),getMessages()]); const eo=locale==='eo';
  const d=await getPassportOverview(user.id);
  const six=new Map(d.sixYao.map(x=>[x.stage,x]));

  return <main>
    <span className="badge">{m.passport_badge}</span>
    <h1>{m.passport_title}</h1>
    <p className="lead">{(m.passport_welcome||'欢迎回来，{name}。').replace('{name}',user.display_name)}</p>

    <section className="card">
      <h2>{eo?'Lerna identeco':'学习身份 · Lerna identeco'}</h2>
      <p><strong>{m.display_name_label}</strong> {user.display_name}</p>
      <p><strong>{m.email_label}</strong> {user.email}</p>
      <p><strong>{m.preferred_language_label}</strong> {(eo?languageEo:languageZh)[user.preferred_language]||user.preferred_language.toUpperCase()}</p>
      <p><strong>{m.current_roles}</strong> {(user.roles.length?user.roles:['learner']).map(r=>(eo?userRoleEo:userRoleZh)[r]||r).join(', ')}</p>
      <p><strong>{m.passport_privacy}</strong> {(eo?visibilityEo:visibilityZh)[d.visibility]||d.visibility}</p>
    </section>

    <section className="stat-grid">
      <div className="stat-card"><strong>{d.courses.completed}</strong><span>{eo?'Kompletigitaj kursoj':'完成课程 · Kursoj'}</span><small>{eo?`Aktivaj ${d.courses.active} · Registritaj ${d.courses.total}`:`学习中 ${d.courses.active} · 有记录 ${d.courses.total}`}</small></div>
      <Link className="stat-card" href="/passport/est"><strong>{d.est.value}</strong><span>{eo?'EST · Esperanta Kontribua Registro':'EST 世界语币'}</span><small>{eo?`Aprobitaj registroj ${d.est.approved} · Vidi detalojn →`:`已审核记录 ${d.est.approved} · 查看明细 →`}</small></Link>
      <Link className="stat-card" href="/passport/bud"><strong>{d.bud.value}</strong><span>{eo?'BUD · Vola-Agada Registro':'BUD 佛光币'}</span><small>{eo?`Aprobitaj ${d.bud.approved} · Servo ${d.bud.hours} horoj · Vidi detalojn →`:`已审核 ${d.bud.approved} · 服务 ${d.bud.hours} 小时 · 查看明细 →`}</small></Link>
    </section>

    <section className="card">
      <h2>{eo?'Ses-linia lernovojo':'六爻成长轨迹 · Ses-linia lernovojo'}</h2>
      <p className="muted">{eo?'Ĝi registras lernadon kaj praktikon, sed ne atestas religian atingon kaj ne kreas membran rangon.':'记录学习与实践轨迹，不认证宗教修证境界，也不形成成员等级。'}</p>
      <div className="yao-grid">
        {yaoNames.map(([zh,eo],i)=>{
          const row=six.get(i+1);
          return <div className="yao-card" key={zh}><strong>{locale==='eo'?eo:zh}</strong>{locale!=='eo'&&<span>{eo}</span>}<small>{row?((eo?learningEo:learningZh)[row.learning_status]||row.learning_status):(eo?'Ne komencita':'尚未开始')}</small></div>
        })}
      </div>
    </section>

    <section className="card">
      <h2>{m.passport_projects} · Projektoj</h2>
      {d.projects.length?d.projects.map(p=><p key={p.id}>{p.title} · {(eo?roleEo:roleZh)[p.role]||p.role} · {(eo?projectStatusEo:projectStatusZh)[p.status]||p.status}</p>):<p>{m.no_projects_yet}</p>}
      <Link href="/projects">{eo?'Vidi projektan enirejon →':'查看项目入口 →'}</Link>
    </section>

    <section className="card">
      <h2>{eo?'Verkoj':'作品档案 · Verkoj'}</h2>
      {d.works.length?d.works.map(w=><p key={w.id}>{w.url?<a href={w.url}>{w.title}</a>:w.title} · {(eo?workTypeEo:workTypeZh)[w.work_type]||w.work_type} · {(eo?workStatusEo:workStatusZh)[w.status]||w.status}</p>):<p>{m.no_works_yet}</p>}
    </section>

    <section className="card">
      <h2>{eo?'Principo de la pasporto':'护照原则 · Principo'}</h2>
      <p>{eo?'La pasporto registras la vojon, sed ne difinas la valoron de homo. EST, BUD, kursoj kaj projektoj estas kontroleblaj registroj; ili ne estas rangigo de personeco nek atesto de religia atingo.':'护照记道路，不定义一个人的价值。EST、BUD、课程和项目都是可核查记录，不是人格排名，也不是宗教果位认证。'}</p>
    </section>
  </main>;
}
