import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import TaohuayuanZoneNav from '@/components/taohuayuan/ZoneNav';

export default async function DadPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const stages=eo?['Starigi demandon','Publika diskuto','Formi proponon','Faka pritakso','Formala voĉdono','Projekta plenumado','Mejloŝtonoj kaj riskoj','Rezultoj kaj revizio']:en?['Raise a question','Public discussion','Form a proposal','Expert assessment','Formal vote','Project execution','Milestones and risks','Results and audit']:['提出问题','公开讨论','形成提案','专业评估','正式表决','项目执行','里程碑与风险','成果与审计'];
  return <main>
    <span className="badge">{eo?'DAD · Vola Aŭtonomia Vojo':en?'DAD · Vow-Based Autonomous Path':'DAD · 愿力自治道'}</span>
    <h1>{eo?'DAD-Konsilio':en?'DAD Council':'DAD 议事厅'}</h1>
    <p className="lead">{eo?'Transformi publikajn opiniojn en kunlaboran procezon, kiu povas esti diskutata, decidata, plenumata kaj reviziata.':en?'Transform public opinions into a collaborative process that can be discussed, decided, executed and audited.':'把公共意见变成可讨论、可决定、可执行、可审计的协作流程。'}</p>
    <div className="card-grid">
      {stages.map((s,i)=><div className="card" key={s}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h2>{s}</h2></div>)}
    </div>
    <section className="card">
      <h2>{eo?'Limoj de regado':en?'Governance boundaries':'治理边界'}</h2>
      <p>{eo?'Unu homo havas unu regadan identecon; riĉeco ne aĉetas regrajton. AI povas resumi, traduki kaj serĉi, sed ĝi ne povas anstataŭi homojn en decido pri proponoj nek aŭtomate movi monon.':en?'One person has one governance identity; wealth does not buy governance rights. AI may summarize, translate and search, but it cannot replace people in deciding proposals or move funds automatically.':'一人一治理身份；财富不购买治理权；AI可以摘要、翻译与检索，但不能代替人决定提案是否通过，也不能自动移动资金。'}</p>
    </section>
    <TaohuayuanZoneNav locale={locale} current="dad" />
    <div className="hero-actions"><Link className="button button-primary" href="/projects">{eo?'Vidi projektan plenumadon':en?'View project execution':'查看项目执行'}</Link><Link className="button button-secondary" href="/login">{eo?'Ensaluti por membrorajtoj':en?'Log in for member functions':'登录进入成员功能'}</Link></div>
  </main>;
}
