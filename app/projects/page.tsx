import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function ProjectsPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const flow=eo?['Respondeculo','Aprobita buĝeto','Mejloŝtonoj','Rezultoj','Riskoj','Fini / paŭzi / ĉesigi','Revizia arkivo']:en?['Owner','Approved budget','Milestones','Results','Risks','Complete / pause / terminate','Audit archive']:['负责人','批准预算','里程碑','成果','风险','完成 / 暂停 / 终止','审计归档'];
  return <main>
    <span className="badge">DAD · Projects</span>
    <h1>{eo?'Projekta plenumado':en?'Project execution':'项目执行'}</h1>
    <p className="lead">{eo?'Ĉi tiu spaco ricevas jam aprobitajn DAD-decidojn kaj realigas la principon: diskuti kun decido, decidi kun agado, agi kun kontroleblo.':en?'This space receives approved DAD decisions and applies the principle: discussion leads to decisions, decisions lead to action, and action remains auditable.':'这里承接已经通过的 DAD 决议，落实“议而有决，决而能行，行而可查”。'}</p>
    <div className="card-grid">{flow.map((x,i)=><div className="card" key={x}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h2>{x}</h2></div>)}</div>
    <section className="card"><h2>{eo?'Limoj de financo kaj respondeco':en?'Financial and responsibility boundaries':'资金与责任边界'}</h2><p>{eo?'Projektgvidanto povas sendi elspezpeton, sed ne povas mem aprobi sian propran elspezon. En la Alpha-fazo la sistemo registras buĝeton kaj elspezfluon, sed ne faras aŭtomatajn pagojn.':en?'A project lead may submit an expense request but cannot approve their own expense. In Alpha, the system records budgets and expense flows but does not make automatic payments.':'项目负责人可以提交支出申请，但不能自己批准自己的支出；Alpha 阶段记录预算与支出流程，不执行自动付款。'}</p></section>
    <div className="hero-actions"><Link className="button button-primary" href="/projects/bud-confirmations">{eo?'Konfirmo de projekta BUD-servo':en?'Project BUD service confirmation':'项目 BUD 服务确认'}</Link><Link className="button button-secondary" href="/dad">{eo?'Reveni al DAD-Konsilio':en?'Back to DAD Council':'返回 DAD 议事厅'}</Link><Link className="button button-secondary" href="/status">{eo?'Vidi sisteman staton':en?'View system status':'查看系统状态'}</Link></div>
  </main>;
}
