import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getGovernanceArchiveSummary } from '@/lib/dad/data';

export default async function GovernanceArchivePage(){
  const [locale,summary]=await Promise.all([getLocale(),getGovernanceArchiveSummary()]);
  const eo=locale==='eo'; const en=locale==='en';

  const modules=[
    {
      href:'/dad',
      code:'PROPOSAL',
      count:summary.proposal_count,
      title:eo?'Publika proponregistro':en?'Public proposal registry':'公开提案总台账',
      text:eo?'Publikaj proponaj dosieroj, stato, buĝetopeto kaj fina rezulto.':en?'Public proposal dossiers, status, requested budget, and final outcome.':'公开提案档案、状态、申请预算与最终结果。'
    },
    {
      href:'/dad/decisions',
      code:'DECISION',
      count:summary.decision_count,
      title:eo?'Publika decidregistro':en?'Public decision registry':'公开决定总台账',
      text:eo?'Finaj decidmomentbildoj kun regulo, partopreno kaj agregitaj rezultoj.':en?'Final decision snapshots with rule, participation, and aggregate results.':'最终决定快照，包括表决规则、参与情况与汇总结果。'
    },
    {
      href:'/dad/timeline',
      code:'GOV-EVENT',
      count:summary.governance_event_count,
      title:eo?'Publika regada tempolinio':en?'Public governance timeline':'公开治理时间轴',
      text:eo?'Spurebla serio de proponoj, decidoj, projekta plenumado kaj mejloŝtonoj.':en?'A traceable sequence of proposals, decisions, project execution, and milestones.':'串联提案、决定、项目执行与里程碑的公开追溯序列。'
    },
    {
      href:'/dad/index',
      code:'CHAIN',
      count:summary.project_count,
      title:eo?'Regada ĉenindekso':en?'Governance chain index':'治理链总索引',
      text:eo?'Kunligas PROPOSAL, DECISION, GOV-EVENT, PROJECT kaj MILESTONE en unu ĉenon.':en?'Links PROPOSAL, DECISION, GOV-EVENT, PROJECT, and MILESTONE into one chain.':'把 PROPOSAL、DECISION、GOV-EVENT、PROJECT 与 MILESTONE 汇成一条治理链。'
    }
  ];

  return <main>
    <span className="badge">{eo?'DAD · Publika Regada Arkivo':en?'DAD · Public Governance Archive':'DAD · 公共治理档案馆'}</span>
    <h1>{eo?'Publika regada arkivo':en?'Public governance archive':'DAD 公共治理档案馆'}</h1>
    <p className="lead">{eo?'Longdaŭra nurlegebla enirejo al la publikaj regadaj dosieroj de Feniksa Civilizo Web4.':en?'A long-term read-only entry point to the public governance records of Feniksa Civilizo Web4.':'凤凰文明 Web4 公共治理记录的长期只读归档入口。'}</p>

    <section className="project-summary-grid">
      <div><span>{eo?'Publikaj proponoj':en?'Public proposals':'公开提案'}</span><strong>{summary.proposal_count}</strong></div>
      <div><span>{eo?'Finaj decidoj':en?'Final decisions':'最终决定'}</span><strong>{summary.decision_count}</strong></div>
      <div><span>{eo?'Regadaj eventoj':en?'Governance events':'治理事件'}</span><strong>{summary.governance_event_count}</strong></div>
      <div><span>{eo?'Publikaj projektoj':en?'Public projects':'公开项目'}</span><strong>{summary.project_count}</strong></div>
      <div><span>{eo?'Mejloŝtonoj':en?'Milestones':'里程碑'}</span><strong>{summary.milestone_count}</strong></div>
    </section>

    <section className="card">
      <span className="eyebrow">{eo?'ARKIVA ENIREJO':en?'ARCHIVE ENTRY':'档案入口'}</span>
      <h2>{eo?'Kvar publikaj regadaj moduloj':en?'Four public governance modules':'四大公共治理档案模块'}</h2>
      <div className="card-grid">
        {modules.map(m=><article className="card" key={m.href}>
          <span className="eyebrow">{m.code}</span>
          <h3>{m.title}</h3>
          <p>{m.text}</p>
          <div className="record-top"><span>{eo?'Nombro':en?'Records':'记录数'}</span><strong>{m.count}</strong></div>
          <p><Link href={m.href}>{eo?'Malfermi arkivan modulon →':en?'Open archive module →':'打开档案模块 →'}</Link></p>
        </article>)}
      </div>
    </section>

    <section className="card">
      <h2>{eo?'Arkiva principo':en?'Archive principle':'归档原则'}</h2>
      <p>{eo?'La arkivo ne estas aparta kopio de la regada datumbazo. Ĝi estas publika nurlegebla vido de la ekzistantaj fontaj registroj. Ĉiu citaĵo restas ligita al sia originala propono, decido, regada evento, projekto aŭ mejloŝtono.':en?'The archive is not a separate copy of the governance database. It is a public read-only view of existing source records. Every citation remains tied to its original proposal, decision, governance event, project, or milestone.':'本档案馆不是治理数据库的另一份复制，而是现有源记录的公开只读视图。每条引用仍然对应其原始提案、决定、治理事件、项目或里程碑。'}</p>
    </section>

    <section className="card">
      <h2>{eo?'Publikaj limoj':en?'Public boundaries':'公开边界'}</h2>
      <p>{eo?'La arkivo ne publikigas individuajn voĉojn, privatajn membrodatenojn aŭ internajn nepublikajn komentojn. Ĝi ne estas financa aprobo, posedatestilo aŭ aŭtomata regada aŭtoritato.':en?'The archive does not publish individual votes, private membership data, or internal non-public comments. It is not a financial approval, ownership certificate, or automatic governance authority.':'档案馆不公开个人逐票、私人成员资料或内部非公开评论；它也不构成财务批准、所有权证明或自动治理授权。'}</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-primary" href="/dad">{eo?'DAD-Konsilio':en?'DAD Council':'DAD 议事厅'}</Link>
      <Link className="button button-secondary" href="/dad/index">{eo?'Regada ĉenindekso':en?'Governance chain index':'治理链总索引'}</Link><Link className="button button-secondary" href="/dad/archive/snapshots">{eo?'Arkivaj momentbildoj':en?'Archive snapshots':'归档版本快照'}</Link><Link className="button button-secondary" href="/dad/archive/reports">{eo?'Arkivitaj ŝanĝraportoj':en?'Archived change reports':'治理变化报告总目录'}</Link>
      <Link className="button button-secondary" href="/projects">{eo?'Publikaj projektoj':en?'Public projects':'公开项目'}</Link>
    </div>
  </main>;
}