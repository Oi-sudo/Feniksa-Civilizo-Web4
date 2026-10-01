import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getPublicProposals, publicStatuses } from '@/lib/dad/data';
import TaohuayuanZoneNav from '@/components/taohuayuan/ZoneNav';

const statusZh:Record<string,string>={approved:'已批准',rejected:'已否决',executing:'执行中',completed:'已完成',terminated:'已终止',archived:'已归档'};
const statusEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',executing:'Plenumata',completed:'Kompletigita',terminated:'Ĉesigita',archived:'Arkivita'};
const statusEn:Record<string,string>={approved:'Approved',rejected:'Rejected',executing:'Executing',completed:'Completed',terminated:'Terminated',archived:'Archived'};
const outcomeZh:Record<string,string>={approved:'通过',rejected:'否决',revision:'退回修订',no_quorum:'未达到法定参与门槛'};
const outcomeEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',revision:'Reiru al revizio',no_quorum:'Neniu kvorumo'};
const outcomeEn:Record<string,string>={approved:'Approved',rejected:'Rejected',revision:'Return for revision',no_quorum:'No quorum'};

export default async function DadPage({searchParams}:{searchParams:Promise<{status?:string}>}){
  const [{status:requestedStatus},locale]=await Promise.all([searchParams,getLocale()]);
  const eo=locale==='eo'; const en=locale==='en';
  const selected=publicStatuses.includes(requestedStatus as (typeof publicStatuses)[number])?requestedStatus:undefined;
  const proposals=await getPublicProposals(selected);
  const stages=eo?['Starigi demandon','Publika diskuto','Formi proponon','Faka pritakso','Formala voĉdono','Projekta plenumado','Mejloŝtonoj kaj riskoj','Rezultoj kaj revizio']:en?['Raise a question','Public discussion','Form a proposal','Expert assessment','Formal vote','Project execution','Milestones and risks','Results and audit']:['提出问题','公开讨论','形成提案','专业评估','正式表决','项目执行','里程碑与风险','成果与审计'];
  const labels=eo?statusEo:en?statusEn:statusZh;
  const outcomes=eo?outcomeEo:en?outcomeEn:outcomeZh;
  const dateLocale=eo?'eo':en?'en-US':'zh-CN';
  return <main>
    <span className="badge">{eo?'DAD · Vola Aŭtonomia Vojo':en?'DAD · Vow-Based Autonomous Path':'DAD · 愿力自治道'}</span>
    <h1>{eo?'DAD-Konsilio':en?'DAD Council':'DAD 议事厅'}</h1>
    <p className="lead">{eo?'Transformi publikajn opiniojn en kunlaboran procezon, kiu povas esti diskutata, decidata, plenumata kaj reviziata.':en?'Transform public opinions into a collaborative process that can be discussed, decided, executed and audited.':'把公共意见变成可讨论、可决定、可执行、可审计的协作流程。'}</p>
    <div className="card-grid">
      {stages.map((s,i)=><div className="card" key={s}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h2>{s}</h2></div>)}
    </div>

    <section className="card">
      <div className="record-top">
        <div>
          <span className="eyebrow">{eo?'PUBLIKA REGISTRO':en?'PUBLIC REGISTRY':'公开总台账'}</span>
          <h2>{eo?'Publika registro de DAD-proponoj':en?'Public DAD proposal registry':'DAD 公开提案总台账'}</h2>
        </div>
        <strong>{proposals.length}</strong>
      </div>
      <p className="muted">{eo?'Nurlegaj publikaj dosieroj. La registro montras proponan staton kaj finan decidresumon, sed ne publikigas individuajn voĉojn.':en?'Read-only public dossiers. The registry shows proposal status and final-decision summaries, but never publishes individual votes.':'只读公开档案。总台账显示提案状态与最终决定摘要，但不公开个人逐票信息。'}</p>
      <div className="hero-actions no-print">
        <Link className={selected?'button button-secondary':'button button-primary'} href="/dad">{eo?'Ĉiuj':en?'All':'全部'}</Link>
        {publicStatuses.map(s=><Link key={s} className={selected===s?'button button-primary':'button button-secondary'} href={'/dad?status='+s}>{labels[s]||s}</Link>)}
      </div>
      {proposals.length?<div className="record-list">
        {proposals.map(p=>{
          const short=p.short_code||p.id.replace(/-/g,'').slice(0,8);
          const outcome=p.final_outcome?(outcomes[p.final_outcome]||p.final_outcome):(eo?'Atendante finan decidon':en?'Final decision pending':'尚无最终决定');
          return <article className="project-subrecord" key={p.id}>
            <div className="record-top"><div><small>PROPOSAL · {short}</small><h3>{p.title}</h3></div><span>{labels[p.status]||p.status}</span></div>
            <div className="project-summary-grid">
              <div><span>{eo?'Petita buĝeto':en?'Requested budget':'申请预算'}</span><strong>{p.budget_requested} {p.currency}</strong></div>
              <div><span>{eo?'Fina decido':en?'Final decision':'最终决定'}</span><strong>{outcome}</strong></div>
              <div><span>{eo?'Ĝisdatigita':en?'Updated':'最近更新'}</span><strong>{new Date(p.updated_at).toLocaleDateString(dateLocale)}</strong></div>
              <div><span>{eo?'Decido finita':en?'Decision finalized':'决定定稿'}</span><strong>{p.decision_finalized_at?new Date(p.decision_finalized_at).toLocaleDateString(dateLocale):'—'}</strong></div>
            </div>
            <p><Link href={'/dad/proposals/'+p.id}>{eo?'Malfermi publikan proponan dosieron →':en?'Open public proposal dossier →':'打开公开提案档案 →'}</Link></p>
          </article>;
        })}
      </div>:<p>{eo?'Neniu publika propono kongruas kun ĉi tiu stato.':en?'No public proposal matches this status.':'当前没有符合此状态的公开提案。'}</p>}
    </section>

    <section className="card">
      <h2>{eo?'Limoj de regado':en?'Governance boundaries':'治理边界'}</h2>
      <p>{eo?'Unu homo havas unu regadan identecon; riĉeco ne aĉetas regrajton. AI povas resumi, traduki kaj serĉi, sed ĝi ne povas anstataŭi homojn en decido pri proponoj nek aŭtomate movi monon.':en?'One person has one governance identity; wealth does not buy governance rights. AI may summarize, translate and search, but it cannot replace people in deciding proposals or move funds automatically.':'一人一治理身份；财富不购买治理权；AI可以摘要、翻译与检索，但不能代替人决定提案是否通过，也不能自动移动资金。'}</p>
    </section>
    <TaohuayuanZoneNav locale={locale} current="dad" />
    <div className="hero-actions"><Link className="button button-primary" href="/dad/decisions">{eo?'Vidi publikan decidregistron':en?'View public decision registry':'查看公开决定总台账'}</Link><Link className="button button-secondary" href="/projects">{eo?'Vidi projektan plenumadon':en?'View project execution':'查看项目执行'}</Link><Link className="button button-secondary" href="/login">{eo?'Ensaluti por membrorajtoj':en?'Log in for member functions':'登录进入成员功能'}</Link></div>
  </main>;
}
