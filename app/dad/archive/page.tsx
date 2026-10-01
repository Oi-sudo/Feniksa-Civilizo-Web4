import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { getGovernanceArchiveCatalogSummary } from '@/lib/dad/data';

export default async function GovernanceArchivePage(){
  const [locale,summary]=await Promise.all([getLocale(),getGovernanceArchiveCatalogSummary()]);
  const eo=locale==='eo'; const en=locale==='en';

  const sourceModules=[
    {href:'/dad',code:'PROPOSAL',count:summary.proposal_count,title:eo?'Publika proponregistro':en?'Public proposal registry':'公开提案总台账'},
    {href:'/dad/decisions',code:'DECISION',count:summary.decision_count,title:eo?'Publika decidregistro':en?'Public decision registry':'公开决定总台账'},
    {href:'/dad/timeline',code:'GOV-EVENT',count:summary.governance_event_count,title:eo?'Publika regada tempolinio':en?'Public governance timeline':'公开治理时间轴'},
    {href:'/dad/index',code:'CHAIN',count:summary.project_count,title:eo?'Regada ĉenindekso':en?'Governance chain index':'治理链总索引'},
    {href:'/projects',code:'PROJECT / MILESTONE',count:summary.project_count+summary.milestone_count,title:eo?'Publikaj plenumaj dosieroj':en?'Public execution dossiers':'公开执行档案'}
  ];

  const historyModules=[
    {href:'/dad/archive/snapshots',code:'ARCHIVE-SNAPSHOT',count:summary.snapshot_count,title:eo?'Arkivaj momentbildoj':en?'Archive snapshots':'归档版本快照'},
    {href:'/dad/archive/reports',code:'ARCHIVE-REPORT',count:summary.report_count,title:eo?'Arkivitaj ŝanĝraportoj':en?'Archived change reports':'治理变化报告总目录'},
    {href:'/dad/archive/compare',code:'COMPARE',count:summary.report_count,title:eo?'Kompari momentbildojn':en?'Compare snapshots':'快照比较与变化报告'}
  ];

  const annualModules=[
    {href:'/dad/archive/years',code:'GOVERNANCE-ARCHIVE',count:summary.year_count,title:eo?'Jaraj arkivoj':en?'Yearly archives':'治理档案年度索引'},
    {href:'/dad/archive/annual-reports',code:'GOVERNANCE-YEAR',count:summary.year_count,title:eo?'Jaraj regadaj raportoj':en?'Annual governance reports':'年度治理报告总目录'}
  ];

  const ModuleGrid=({items}:{items:typeof sourceModules})=><div className="card-grid">{items.map(m=><article className="card" key={m.href}>
    <span className="eyebrow">{m.code}</span>
    <h3>{m.title}</h3>
    <div className="record-top"><span>{eo?'Nombro':en?'Records':'记录数'}</span><strong>{m.count}</strong></div>
    <p><Link href={m.href}>{eo?'Malfermi →':en?'Open →':'打开 →'}</Link></p>
  </article>)}</div>;

  return <main>
    <span className="badge">{eo?'DAD · Ĝenerala Regada Arkiva Katalogo':en?'DAD · General Governance Archive Catalog':'DAD · 治理档案总目录'}</span>
    <h1>{eo?'Ĝenerala katalogo de la publika regada arkivo':en?'General public governance archive catalog':'DAD 治理档案总目录'}</h1>
    <p className="lead">{eo?'Unuigita nurlegebla enirejo al fontaj regadaj registroj, historiaj momentbildoj, ŝanĝraportoj kaj jaraj arkivoj de Feniksa Civilizo Web4.':en?'A unified read-only entry point to source governance records, historical snapshots, change reports, and yearly archives of Feniksa Civilizo Web4.':'凤凰文明 Web4 治理原始记录、历史快照、变化报告与年度档案的统一只读入口。'}</p>

    <section className="project-summary-grid">
      <div><span>{eo?'Proponoj':en?'Proposals':'提案'}</span><strong>{summary.proposal_count}</strong></div>
      <div><span>{eo?'Decidoj':en?'Decisions':'决定'}</span><strong>{summary.decision_count}</strong></div>
      <div><span>{eo?'Regadaj eventoj':en?'Governance events':'治理事件'}</span><strong>{summary.governance_event_count}</strong></div>
      <div><span>{eo?'Projektoj':en?'Projects':'项目'}</span><strong>{summary.project_count}</strong></div>
      <div><span>{eo?'Mejloŝtonoj':en?'Milestones':'里程碑'}</span><strong>{summary.milestone_count}</strong></div>
      <div><span>{eo?'Momentbildoj':en?'Snapshots':'快照'}</span><strong>{summary.snapshot_count}</strong></div>
      <div><span>{eo?'Ŝanĝraportoj':en?'Change reports':'变化报告'}</span><strong>{summary.report_count}</strong></div>
      <div><span>{eo?'Arkivaj jaroj':en?'Archive years':'归档年度'}</span><strong>{summary.year_count}</strong></div>
    </section>

    <section className="card">
      <span className="eyebrow">{eo?'I · FONTAJ REGISTROJ':en?'I · SOURCE RECORDS':'一、治理原始记录'}</span>
      <h2>{eo?'Publika regada fonttavolo':en?'Public governance source layer':'公共治理源记录层'}</h2>
      <p>{eo?'Rekta aliro al la publikaj proponoj, decidoj, regadaj eventoj kaj plenuma ĉeno.':en?'Direct access to public proposals, decisions, governance events, and the execution chain.':'直接进入公开提案、决定、治理事件与执行链。'}</p>
      <ModuleGrid items={sourceModules} />
    </section>

    <section className="card">
      <span className="eyebrow">{eo?'II · HISTORIA ARKIVO':en?'II · HISTORICAL ARCHIVE':'二、历史快照与变化报告'}</span>
      <h2>{eo?'Momentbildoj kaj komparraportoj':en?'Snapshots and comparison reports':'快照与比较报告'}</h2>
      <p>{eo?'Konservitaj tempopunktoj kaj eksplicite arkivitaj ŝanĝraportoj por historia komparo.':en?'Preserved time points and explicitly archived change reports for historical comparison.':'保存历史时间点，并登记明确归档的变化报告，供长期比较。'}</p>
      <ModuleGrid items={historyModules} />
    </section>

    <section className="card">
      <span className="eyebrow">{eo?'III · JARA ARKIVO':en?'III · YEARLY ARCHIVE':'三、年度档案与年度报告'}</span>
      <h2>{eo?'Jaraj katalogoj kaj oficialaj resumoj':en?'Yearly catalogs and formal summaries':'年度目录与正式年度汇总'}</h2>
      <p>{eo?'Grupigas la arkivon laŭ jaroj kaj ligas ĉiun jaron al sia GOVERNANCE-YEAR-raporto.':en?'Groups the archive by year and links each year to its GOVERNANCE-YEAR report.':'按年度组织档案，并将每个年度链接到对应的 GOVERNANCE-YEAR 正式报告。'}</p>
      <ModuleGrid items={annualModules} />
    </section>

    <section className="card">
      <h2>{eo?'Arkiva principo':en?'Archive principle':'归档原则'}</h2>
      <p>{eo?'La ĝenerala katalogo ne kreas duan regadan datumbazon. Ĝi kunigas nurlegeblajn vidojn de la ekzistantaj fontaj kaj arkivaj registroj, tiel ke ĉiu resumo povas esti spurita reen al sia originala dosiero.':en?'The general catalog does not create a second governance database. It unifies read-only views of existing source and archive records so every summary can be traced back to its original dossier.':'总目录不另建第二套治理数据库，只统一现有源记录与归档记录的只读视图，因此每一项汇总都可以回溯到原始档案。'}</p>
    </section>

    <section className="card">
      <h2>{eo?'Publikaj limoj':en?'Public boundaries':'公开边界'}</h2>
      <p>{eo?'La katalogo ne publikigas individuajn voĉojn, privatajn membrodatenojn aŭ internajn nepublikajn komentojn, kaj ĝi ne estas financa aprobo, posedatestilo aŭ aŭtomata regada aŭtoritato.':en?'The catalog does not publish individual votes, private membership data, or internal non-public comments, and it is not a financial approval, ownership certificate, or automatic governance authority.':'总目录不公开个人逐票、私人成员资料或内部非公开评论，也不构成财务批准、所有权证明或自动治理授权。'}</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-primary" href="/dad">{eo?'DAD-Konsilio':en?'DAD Council':'DAD 议事厅'}</Link>
      <Link className="button button-secondary" href="/dad/archive/years">{eo?'Jaraj arkivoj':en?'Yearly archives':'年度档案索引'}</Link>
      <Link className="button button-secondary" href="/dad/archive/annual-reports">{eo?'Jaraj raportoj':en?'Annual reports':'年度报告总目录'}</Link>
    </div>
  </main>;
}