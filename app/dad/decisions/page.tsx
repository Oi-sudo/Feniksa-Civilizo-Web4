import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getPublicDecisions, publicDecisionOutcomes } from '@/lib/dad/data';
import CopyCitationButton from '@/components/archive/CopyCitationButton';

const outcomeZh:Record<string,string>={approved:'通过',rejected:'否决',revision:'退回修订',no_quorum:'未达到法定参与门槛'};
const outcomeEo:Record<string,string>={approved:'Aprobita',rejected:'Malaprobita',revision:'Reiru al revizio',no_quorum:'Neniu kvorumo'};
const outcomeEn:Record<string,string>={approved:'Approved',rejected:'Rejected',revision:'Return for revision',no_quorum:'No quorum'};
const ruleZh:Record<string,string>={simple_majority:'简单多数',two_thirds:'三分之二',three_quarters:'四分之三'};
const ruleEo:Record<string,string>={simple_majority:'Simpla plimulto',two_thirds:'Du trionoj',three_quarters:'Tri kvaronoj'};
const ruleEn:Record<string,string>={simple_majority:'Simple majority',two_thirds:'Two thirds',three_quarters:'Three quarters'};

export default async function DecisionsPage({searchParams}:{searchParams:Promise<{outcome?:string}>}){
  const [{outcome:requested},locale]=await Promise.all([searchParams,getLocale()]);
  const eo=locale==='eo'; const en=locale==='en';
  const selected=publicDecisionOutcomes.includes(requested as (typeof publicDecisionOutcomes)[number])?requested:undefined;
  const decisions=await getPublicDecisions(selected);
  const outcomes=eo?outcomeEo:en?outcomeEn:outcomeZh;
  const rules=eo?ruleEo:en?ruleEn:ruleZh;
  const dateLocale=eo?'eo':en?'en-US':'zh-CN';

  return <main>
    <span className="badge">{eo?'DAD · Publika Decidregistro':en?'DAD · Public Decision Registry':'DAD · 公开决定总台账'}</span>
    <h1>{eo?'Publika registro de finaj DAD-decidoj':en?'Public registry of final DAD decisions':'DAD 公开决定总台账'}</h1>
    <p className="lead">{eo?'Ĉiu fina decido ricevas stabilan referencon kaj restas publike spurebla, sen publikigo de individuaj voĉoj.':en?'Each final decision receives a stable reference and remains publicly traceable, without publishing individual votes.':'每一项最终决定都有稳定引用号并可公开追溯，但不公开个人逐票信息。'}</p>

    <section className="card">
      <div className="record-top"><div><span className="eyebrow">{eo?'DECIDOJ':en?'DECISIONS':'决定登记'}</span><h2>{eo?'Finaj decidmomentbildoj':en?'Final decision snapshots':'最终决定快照'}</h2></div><strong>{decisions.length}</strong></div>
      <div className="hero-actions no-print">
        <Link className={selected?'button button-secondary':'button button-primary'} href="/dad/decisions">{eo?'Ĉiuj':en?'All':'全部'}</Link>
        {publicDecisionOutcomes.map(o=><Link key={o} className={selected===o?'button button-primary':'button button-secondary'} href={'/dad/decisions?outcome='+o}>{outcomes[o]||o}</Link>)}
      </div>
      {decisions.length?<div className="record-list">
        {decisions.map(d=>{
          const short=d.id.replace(/-/g,'').slice(0,8);
          const proposalShort=d.proposal_short_code||d.proposal_id.replace(/-/g,'').slice(0,8);
          const ref='DECISION · '+short;
          const anchor='decision-'+short;
          const citation='Phoenix DAD Decision Registry · DECISION · '+short+' · '+new Date(d.finalized_at).toISOString().slice(0,10);
          return <article id={anchor} className="project-subrecord" key={d.id}>
            <div className="record-top">
              <div><small>{ref}</small><h3>{d.proposal_title}</h3></div>
              <span>{outcomes[d.outcome]||d.outcome}</span>
            </div>
            <div className="project-summary-grid">
              <div><span>{eo?'Decidregulo':en?'Decision rule':'表决规则'}</span><strong>{rules[d.decision_rule]||d.decision_rule}</strong></div>
              <div><span>{eo?'Partopreno':en?'Participation':'参与人数'}</span><strong>{d.participation_count}/{d.eligible_count}</strong></div>
              <div><span>{eo?'Por / kontraŭ':en?'Approve / reject':'赞成 / 反对'}</span><strong>{d.approve_count} / {d.reject_count}</strong></div>
              <div><span>{eo?'Reviziu / sindetenu':en?'Revise / abstain':'修订 / 弃权'}</span><strong>{d.revise_count} / {d.abstain_count}</strong></div>
              <div><span>{eo?'Bezonataj aproboj':en?'Approvals required':'所需赞成数'}</span><strong>{d.approvals_required}</strong></div>
              <div><span>{eo?'Finita':en?'Finalized':'决定日期'}</span><strong>{new Date(d.finalized_at).toLocaleDateString(dateLocale)}</strong></div>
            </div>
            <p className="subrecord-ref">
              <code>{ref}</code> · <a href={'#'+anchor}>{eo?'Konstanta loko':en?'Permanent locator':'永久定位'}</a>
              <span className="citation-format">{eo?'Citformo':en?'Citation format':'引用格式'}：{citation}<CopyCitationButton text={citation} label={eo?'Kopii citon':en?'Copy citation':'复制引用'} copiedLabel={eo?'Kopiita':en?'Copied':'已复制'} /></span>
            </p>
            <p><Link href={'/dad/proposals/'+d.proposal_id}>{eo?'Vidi fontan proponan dosieron':en?'View source proposal dossier':'查看来源提案档案'} · PROPOSAL · {proposalShort} →</Link></p>
          </article>;
        })}
      </div>:<p>{eo?'Neniu publika decido kongruas kun ĉi tiu rezulto.':en?'No public decision matches this outcome.':'当前没有符合此结果的公开决定。'}</p>}
    </section>

    <section className="card">
      <h2>{eo?'Publika limo':en?'Public boundary':'公开边界'}</h2>
      <p>{eo?'La registro konservas nur agregitajn decidmomentbildojn kaj stabilajn referencojn. Individuaj voĉoj kaj privata membreca informo ne estas publike elmontrataj.':en?'The registry preserves only aggregated decision snapshots and stable references. Individual ballots and private membership information are not publicly exposed.':'本登记册只保留汇总决定快照和稳定引用号，不公开个人选票与私人成员信息。'}</p>
    </section>

    <div className="hero-actions"><Link className="button button-primary" href="/dad">{eo?'Reveni al DAD-Konsilio':en?'Back to DAD Council':'返回 DAD 议事厅'}</Link><Link className="button button-secondary" href="/projects">{eo?'Vidi projektojn':en?'View projects':'查看项目'}</Link></div>
  </main>;
}