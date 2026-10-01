import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getPublicGovernanceTimeline } from '@/lib/dad/data';

const proposalStatusZh:Record<string,string>={approved:'已批准',rejected:'已否决',executing:'执行中',completed:'已完成',terminated:'已终止',archived:'已归档',draft:'草稿',discussion:'讨论中',assessment:'评估中',voting:'表决中',revision:'修订中'};
const proposalStatusEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',executing:'Plenumata',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita',draft:'Malneto',discussion:'Diskutata',assessment:'Taksata',voting:'Voĉdonata',revision:'Reviziata'};
const proposalStatusEn:Record<string,string>={approved:'Approved',rejected:'Rejected',executing:'Executing',completed:'Completed',terminated:'Terminated',archived:'Archived',draft:'Draft',discussion:'Discussion',assessment:'Assessment',voting:'Voting',revision:'Revision'};
const outcomeZh:Record<string,string>={approved:'通过',rejected:'否决',revision:'退回修订',no_quorum:'未达到法定参与门槛'};
const outcomeEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',revision:'Reiru al revizio',no_quorum:'Neniu kvorumo'};
const outcomeEn:Record<string,string>={approved:'Approved',rejected:'Rejected',revision:'Return for revision',no_quorum:'No quorum'};

export default async function TimelinePage(){
  const [locale,events]=await Promise.all([getLocale(),getPublicGovernanceTimeline()]);
  const eo=locale==='eo'; const en=locale==='en';
  const status=eo?proposalStatusEo:en?proposalStatusEn:proposalStatusZh;
  const outcomes=eo?outcomeEo:en?outcomeEn:outcomeZh;
  const dateLocale=eo?'eo':en?'en-US':'zh-CN';

  const typeLabel=(type:string)=>{
    const zh:Record<string,string>={proposal_created:'提案建立',proposal_status:'提案状态变化',decision:'最终决定',project_created:'执行项目建立',project_status:'项目状态变化',milestone_completed:'里程碑完成'};
    const eoL:Record<string,string>={proposal_created:'Propono kreita',proposal_status:'Ŝanĝo de propona stato',decision:'Fina decido',project_created:'Plenuma projekto kreita',project_status:'Ŝanĝo de projekta stato',milestone_completed:'Mejloŝtono kompletigita'};
    const enL:Record<string,string>={proposal_created:'Proposal created',proposal_status:'Proposal status change',decision:'Final decision',project_created:'Execution project created',project_status:'Project status change',milestone_completed:'Milestone completed'};
    return (eo?eoL:en?enL:zh)[type]||type;
  };

  const detail=(e:(typeof events)[number])=>{
    if(e.event_type==='decision') return (eo?'Rezulto: ':en?'Outcome: ':'结果：')+(outcomes[e.outcome||'']||e.outcome||'—');
    if(e.event_type==='milestone_completed') return (eo?'Mejloŝtono: ':en?'Milestone: ':'里程碑：')+(e.note||'—');
    if(e.from_status||e.to_status){
      const from=e.from_status?(status[e.from_status]||e.from_status):null;
      const to=e.to_status?(status[e.to_status]||e.to_status):null;
      return (from?from+' → ':'')+(to||'—')+(e.note?' · '+e.note:'');
    }
    return e.project_title||e.note||'';
  };

  return <main>
    <span className="badge">{eo?'DAD · Publika Regada Tempolinio':en?'DAD · Public Governance Timeline':'DAD · 公开治理时间轴'}</span>
    <h1>{eo?'Publika regada tempolinio':en?'Public governance timeline':'DAD 公开治理时间轴'}</h1>
    <p className="lead">{eo?'Unu publika spuro kunligas proponon, decidon kaj plenumadon. La paĝo estas nurlegebla kaj montras nur publikajn resumajn registrojn.':en?'One public trace links proposal, decision, and execution. This page is read-only and shows only public summary records.':'用一条公开轨迹串联提案、决定与执行。本页为只读页面，只展示公开汇总记录。'}</p>

    <section className="card">
      <div className="record-top"><div><span className="eyebrow">{eo?'SPUREBLA ĈENO':en?'TRACEABLE CHAIN':'可追溯链'}</span><h2>{eo?'De propono ĝis plenumado':en?'From proposal to execution':'从提案到执行'}</h2></div><strong>{events.length}</strong></div>
      {events.length?<div className="project-audit-list">
        {events.map(e=>{
          const proposalShort=e.proposal_short_code||e.proposal_id.replace(/-/g,'').slice(0,8);
          return <article className="project-audit-item" key={e.event_key}>
            <div className="timeline-date">{new Date(e.occurred_at).toLocaleDateString(dateLocale)}</div>
            <div>
              <span className="eyebrow">{typeLabel(e.event_type)}</span>
              <h3>{e.proposal_title}</h3>
              <p>{detail(e)}</p>
              <p className="subrecord-ref"><code>PROPOSAL · {proposalShort}</code>{e.project_title&&<> · <span>{e.project_title}</span></>}</p>
              <div className="hero-actions no-print">
                <Link className="button button-secondary" href={'/dad/proposals/'+e.proposal_id}>{eo?'Propona dosiero':en?'Proposal dossier':'提案档案'}</Link>
                {e.project_id&&<Link className="button button-secondary" href={'/projects/'+e.project_id}>{eo?'Projekta dosiero':en?'Project dossier':'项目档案'}</Link>}
              </div>
            </div>
          </article>;
        })}
      </div>:<p>{eo?'Ankoraŭ ne ekzistas publikaj regadaj eventoj.':en?'There are no public governance events yet.':'当前还没有公开治理事件。'}</p>}
    </section>

    <section className="card">
      <h2>{eo?'Kio estas inkluzivita':en?'What is included':'纳入时间轴的记录'}</h2>
      <p>{eo?'La tempolinio kunigas kreadon de proponoj, ŝanĝojn de propona stato, finajn decidojn, kreon de plenumaj projektoj, ŝanĝojn de projekta stato kaj kompletigitajn mejloŝtonojn. Individuaj voĉoj, privataj membrodatenoj kaj internaj nepublikaj komentoj ne aperas.':en?'The timeline combines proposal creation, proposal status changes, final decisions, execution-project creation, project status changes, and completed milestones. Individual votes, private membership data, and internal non-public comments are excluded.':'时间轴汇集提案建立、提案状态变化、最终决定、执行项目建立、项目状态变化与已完成里程碑。个人逐票、私人成员资料及内部非公开评论不会显示。'}</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-primary" href="/dad">{eo?'Reveni al DAD-Konsilio':en?'Back to DAD Council':'返回 DAD 议事厅'}</Link>
      <Link className="button button-secondary" href="/dad/decisions">{eo?'Publika decidregistro':en?'Public decision registry':'公开决定总台账'}</Link>
    </div>
  </main>;
}