import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import TaohuayuanZoneNav from '@/components/taohuayuan/ZoneNav';
import { listVisibleProjects } from '@/lib/projects/data';

export default async function ProjectsPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const projects=await listVisibleProjects();
  const statusZh:Record<string,string>={approved:'已批准',active:'进行中',paused:'已暂停',completed:'已完成',terminated:'已终止',archived:'已归档'};
  const statusEo:Record<string,string>={approved:'Aprobita',active:'Aktiva',paused:'Paŭzita',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita'};
  const statusEn:Record<string,string>={approved:'Approved',active:'Active',paused:'Paused',completed:'Completed',terminated:'Terminated',archived:'Archived'};
  const riskZh:Record<string,string>={green:'绿色',yellow:'黄色',orange:'橙色',red:'红色'};
  const riskEo:Record<string,string>={green:'Verda',yellow:'Flava',orange:'Oranĝa',red:'Ruĝa'};
  const riskEn:Record<string,string>={green:'Green',yellow:'Yellow',orange:'Orange',red:'Red'};
  const flow=eo?['Respondeculo','Aprobita buĝeto','Mejloŝtonoj','Rezultoj','Riskoj','Fini / paŭzi / ĉesigi','Revizia arkivo']:en?['Owner','Approved budget','Milestones','Results','Risks','Complete / pause / terminate','Audit archive']:['负责人','批准预算','里程碑','成果','风险','完成 / 暂停 / 终止','审计归档'];
  return <main>
    <span className="badge">DAD · Projects</span>
    <h1>{eo?'Projekta plenumado':en?'Project execution':'项目执行'}</h1>
    <p className="lead">{eo?'Ĉi tiu spaco ricevas jam aprobitajn DAD-decidojn kaj realigas la principon: diskuti kun decido, decidi kun agado, agi kun kontroleblo.':en?'This space receives approved DAD decisions and applies the principle: discussion leads to decisions, decisions lead to action, and action remains auditable.':'这里承接已经通过的 DAD 决议，落实“议而有决，决而能行，行而可查”。'}</p>
    <div className="card-grid">{flow.map((x,i)=><div className="card" key={x}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h2>{x}</h2></div>)}</div>

    <section className="home-section">
      <h2>{eo?'Projekta registro':en?'Project register':'项目总台账'}</h2>
      <p className="muted">{eo?'Ĉi tie aperas nur projektoj jam en aprobita aŭ posta stato. La registro estas nurlegebla publika plenumvidaĵo; ĝi ne faras aŭtomatajn pagojn.':en?'Only projects at approved or later stages appear here. This is a read-only execution view and does not make automatic payments.':'这里只显示已批准或之后阶段的项目。这是只读执行视图，不执行自动付款。'}</p>
      {projects.length?<div className="card-grid">
        {projects.map(p=><Link className="card project-card" href={`/projects/${p.id}`} key={p.id}>
          <div className="record-top"><span>{(eo?statusEo:en?statusEn:statusZh)[p.status]||p.status}</span><span>{eo?'Risko':en?'Risk':'风险'}：{(eo?riskEo:en?riskEn:riskZh)[p.risk_level]||p.risk_level}</span></div>
          <h3>{p.title}</h3>
          {p.description&&<p>{p.description}</p>}
          <p><strong>{eo?'Buĝeto':en?'Budget':'预算'}：</strong>{p.approved_budget} {p.currency} · <strong>{eo?'Elspezita':en?'Spent':'已支出'}：</strong>{p.spent} {p.currency}</p>
          {p.manager_name&&<small>{eo?'Respondeculo':en?'Manager':'负责人'}：{p.manager_name}</small>}
          <span className="card-link">{eo?'Vidi projektan dosieron →':en?'View project dossier →':'查看项目档案 →'}</span>
        </Link>)}
      </div>:<div className="card"><p>{eo?'Nun ne estas projektoj en aprobita aŭ posta stato.':en?'There are currently no projects at approved or later stages.':'目前还没有进入已批准或之后阶段的项目。'}</p></div>}
    </section>
    <section className="card life-path">
      <h2>{eo?'Viva vojo de la komunumo':en?'Community life path':'社区生活路径'}</h2>
      <div className="life-path-steps">
        <Link href="/courses"><span>01</span><strong>{eo?'Lerni':en?'Learn':'学习'}</strong><small>{eo?'Kursoj kaj komuna lingvo':en?'Courses and shared language':'课程与共同语言'}</small></Link>
        <Link href="/est"><span>02</span><strong>{eo?'Kontribui per scio':en?'Contribute knowledge':'知识贡献'}</strong><small>EST</small></Link>
        <Link href="/dad"><span>03</span><strong>{eo?'Diskuti kaj decidi':en?'Discuss & decide':'议事与决定'}</strong><small>DAD</small></Link>
        <Link href="/projects"><span>04</span><strong>{eo?'Plenumi':en?'Execute':'项目执行'}</strong><small>{eo?'Mejloŝtonoj kaj respondeco':en?'Milestones and responsibility':'里程碑与责任'}</small></Link>
        <Link href="/bud"><span>05</span><strong>{eo?'Servi kaj registri':en?'Serve & record':'服务与记录'}</strong><small>BUD</small></Link>
        <Link href="/museum"><span>06</span><strong>{eo?'Konservi kulturon':en?'Preserve culture':'文化归档'}</strong><small>{eo?'Muzeo kaj memoria dosiero':en?'Museum and memory archive':'博物馆与记忆档案'}</small></Link>
        <Link href="/passport"><span>07</span><strong>{eo?'Kunigi en pasporto':en?'Unify in passport':'汇入学习护照'}</strong><small>{eo?'Persona kronologio':en?'Personal chronology':'个人轨迹'}</small></Link>
      </div>
      <p>{eo?'Tiu vojo ne estas deviga rango. Lernado povas formi EST-sciajn kontribuojn, poste eniri publikan diskuton, projekton, realan servon kaj kulturan memoron; tiuj malsamaj registroj fine kunvenas en la persona lernopasporto.':en?'This path is not a mandatory rank. Learning can form EST knowledge contributions, then lead into public discussion, project execution, real service and cultural memory; these different records finally come together in the personal learning passport.':'这不是强制等级，而是一条社会运行路径：学习可以形成 EST 知识贡献，再进入公共议事、项目执行、真实服务与文化记忆；这些不同记录最后共同汇入个人学习护照。'}</p>
    </section>
    <TaohuayuanZoneNav locale={locale} current="projects" />
    <section className="card"><h2>{eo?'Limoj de financo kaj respondeco':en?'Financial and responsibility boundaries':'资金与责任边界'}</h2><p>{eo?'Projektgvidanto povas sendi elspezpeton, sed ne povas mem aprobi sian propran elspezon. En la Alpha-fazo la sistemo registras buĝeton kaj elspezfluon, sed ne faras aŭtomatajn pagojn.':en?'A project lead may submit an expense request but cannot approve their own expense. In Alpha, the system records budgets and expense flows but does not make automatic payments.':'项目负责人可以提交支出申请，但不能自己批准自己的支出；Alpha 阶段记录预算与支出流程，不执行自动付款。'}</p></section>
    <div className="hero-actions"><Link className="button button-primary" href="/projects/bud-confirmations">{eo?'Konfirmo de projekta BUD-servo':en?'Project BUD service confirmation':'项目 BUD 服务确认'}</Link><Link className="button button-secondary" href="/dad">{eo?'Reveni al DAD-Konsilio':en?'Back to DAD Council':'返回 DAD 议事厅'}</Link><Link className="button button-secondary" href="/status">{eo?'Vidi sisteman staton':en?'View system status':'查看系统状态'}</Link></div>
  </main>;
}
