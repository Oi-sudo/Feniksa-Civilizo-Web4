import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getGovernanceChainIndex, getPublicGovernanceTimeline } from '@/lib/dad/data';

const statusZh:Record<string,string>={approved:'已批准',rejected:'已否决',executing:'执行中',completed:'已完成',terminated:'已终止',archived:'已归档',active:'进行中',paused:'暂停'};
const statusEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',executing:'Plenumata',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita',active:'Aktiva',paused:'Paŭzita'};
const statusEn:Record<string,string>={approved:'Approved',rejected:'Rejected',executing:'Executing',completed:'Completed',terminated:'Terminated',archived:'Archived',active:'Active',paused:'Paused'};
const outcomeZh:Record<string,string>={approved:'通过',rejected:'否决',revision:'退回修订',no_quorum:'未达到法定参与门槛'};
const outcomeEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',revision:'Reiru al revizio',no_quorum:'Neniu kvorumo'};
const outcomeEn:Record<string,string>={approved:'Approved',rejected:'Rejected',revision:'Return for revision',no_quorum:'No quorum'};

export default async function GovernanceIndexPage(){
  const [locale,rows,events]=await Promise.all([getLocale(),getGovernanceChainIndex(),getPublicGovernanceTimeline(500)]);
  const eo=locale==='eo'; const en=locale==='en';
  const statuses=eo?statusEo:en?statusEn:statusZh;
  const outcomes=eo?outcomeEo:en?outcomeEn:outcomeZh;

  const groups=new Map<string,{proposal:typeof rows[number],projects:Map<string,{row:typeof rows[number],milestones:typeof rows}>,events:typeof events}>();
  for(const row of rows){
    if(!groups.has(row.proposal_id)) groups.set(row.proposal_id,{proposal:row,projects:new Map(),events:events.filter(e=>e.proposal_id===row.proposal_id)});
    const g=groups.get(row.proposal_id)!;
    if(row.project_id){
      if(!g.projects.has(row.project_id)) g.projects.set(row.project_id,{row,milestones:[]});
      if(row.milestone_id) g.projects.get(row.project_id)!.milestones.push(row);
    }
  }

  const eventShort=(key:string)=>key.replace(/[^a-zA-Z0-9]/g,'').slice(-8).toLowerCase();

  return <main>
    <span className="badge">{eo?'DAD · Regada Ĉenindekso':en?'DAD · Governance Chain Index':'DAD · 治理链总索引'}</span>
    <h1>{eo?'Publika indekso de regadaj ĉenoj':en?'Public governance chain index':'DAD 公开治理链总索引'}</h1>
    <p className="lead">{eo?'La indekso kunligas proponon, decidon, regadajn eventojn, projekton kaj mejloŝtonojn en unu publike spureblan ĉenon.':en?'This index links proposal, decision, governance events, project, and milestones into one publicly traceable chain.':'本索引把提案、决定、治理事件、项目与里程碑连成一条公开可追溯的治理链。'}</p>

    <section className="card">
      <div className="record-top"><div><span className="eyebrow">{eo?'ĈENOJ':en?'CHAINS':'治理链'}</span><h2>{eo?'De propono ĝis rezulto':en?'From proposal to result':'从提案到结果'}</h2></div><strong>{groups.size}</strong></div>
      <div className="record-list">
        {[...groups.values()].map(g=>{
          const p=g.proposal;
          const proposalShort=p.proposal_short_code||p.proposal_id.replace(/-/g,'').slice(0,8);
          const decisionShort=p.decision_id?p.decision_id.replace(/-/g,'').slice(0,8):null;
          return <article className="project-subrecord" key={p.proposal_id}>
            <div className="record-top"><div><small>PROPOSAL · {proposalShort}</small><h3>{p.proposal_title}</h3></div><span>{statuses[p.proposal_status]||p.proposal_status}</span></div>
            <div className="project-summary-grid">
              <div><span>{eo?'Propono':en?'Proposal':'提案'}</span><strong><Link href={'/dad/proposals/'+p.proposal_id}>PROPOSAL · {proposalShort}</Link></strong></div>
              <div><span>{eo?'Decido':en?'Decision':'决定'}</span><strong>{p.decision_id?<Link href={'/dad/decisions#decision-'+decisionShort}>DECISION · {decisionShort}</Link>:'—'}</strong></div>
              <div><span>{eo?'Rezulto':en?'Outcome':'决定结果'}</span><strong>{p.decision_outcome?(outcomes[p.decision_outcome]||p.decision_outcome):'—'}</strong></div>
              <div><span>{eo?'Regadaj eventoj':en?'Governance events':'治理事件'}</span><strong>{g.events.length}</strong></div>
              <div><span>{eo?'Projektoj':en?'Projects':'项目'}</span><strong>{g.projects.size}</strong></div>
              <div><span>{eo?'Mejloŝtonoj':en?'Milestones':'里程碑'}</span><strong>{[...g.projects.values()].reduce((n,x)=>n+x.milestones.length,0)}</strong></div>
            </div>

            {g.events.length>0&&<div className="card">
              <h4>{eo?'Regadaj eventoj':en?'Governance events':'治理事件'}</h4>
              <p className="subrecord-ref">{g.events.slice(0,8).map((e,i)=>{const s=eventShort(e.event_key);return <span key={e.event_key}>{i>0?' · ':''}<Link href={'/dad/timeline#gov-event-'+s}>GOV-EVENT · {s}</Link></span>})}{g.events.length>8&&<span> · +{g.events.length-8}</span>}</p>
            </div>}

            {[...g.projects.values()].map(({row,milestones})=>{
              const projectShort=row.project_id!.replace(/-/g,'').slice(0,8);
              return <section className="card" key={row.project_id}>
                <div className="record-top"><div><small>PROJECT · {projectShort}</small><strong>{row.project_title}</strong></div><span>{statuses[row.project_status||'']||row.project_status}</span></div>
                <p><Link href={'/projects/'+row.project_id}>{eo?'Malfermi projektan dosieron':en?'Open project dossier':'打开项目档案'} →</Link></p>
                {milestones.length>0&&<div className="record-list">{milestones.map(m=>{
                  const ms=m.milestone_id!.replace(/-/g,'').slice(0,8);
                  return <div className="subrecord-ref" key={m.milestone_id}><code>MILESTONE · {ms}</code> · <span>{m.milestone_title}</span></div>;
                })}</div>}
              </section>;
            })}
          </article>;
        })}
      </div>
    </section>

    <section className="card">
      <h2>{eo?'Indeksa principo':en?'Index principle':'索引原则'}</h2>
      <p>{eo?'La indekso ne kreas duan kopion de la regadaj datumoj. Ĝi estas nurlega kunigo de la ekzistantaj fontaj registroj, tiel ke ĉiu ero restas spurita reen al sia origina dosiero.':en?'The index does not create a second copy of governance data. It is a read-only join of existing source records, so every item remains traceable back to its original dossier.':'本索引不复制形成第二套治理数据，而是只读汇集现有源记录，因此每一项都可以回溯到其原始档案。'}</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-primary" href="/dad">{eo?'DAD-Konsilio':en?'DAD Council':'DAD 议事厅'}</Link>
      <Link className="button button-secondary" href="/dad/timeline">{eo?'Regada tempolinio':en?'Governance timeline':'治理时间轴'}</Link>
      <Link className="button button-secondary" href="/dad/decisions">{eo?'Decidregistro':en?'Decision registry':'决定总台账'}</Link>
    </div>
  </main>;
}