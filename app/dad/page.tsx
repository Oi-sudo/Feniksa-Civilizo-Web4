import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function DadPage(){
  const eo=(await getLocale())==='eo';
  const stages=eo?
    ['Starigi demandon','Publika diskuto','Formi proponon','Faka pritakso','Formala voĉdono','Projekta plenumado','Mejloŝtonoj kaj riskoj','Rezultoj kaj revizio']:
    ['提出问题','公开讨论','形成提案','专业评估','正式表决','项目执行','里程碑与风险','成果与审计'];
  return <main>
    <span className="badge">DAD · 愿力自治道</span>
    <h1>{eo?'DAD-Konsilio':'DAD 议事厅'}</h1>
    <p className="lead">{eo?'Transformi publikajn opiniojn en kunlaboran procezon, kiu povas esti diskutata, decidata, plenumata kaj reviziata.':'把公共意见变成可讨论、可决定、可执行、可审计的协作流程。'}</p>
    <div className="card-grid">
      {stages.map((s,i)=><div className="card" key={s}><span className="eyebrow">{String(i+1).padStart(2,'0')}</span><h2>{s}</h2></div>)}
    </div>
    <section className="card">
      <h2>{eo?'Limoj de regado':'治理边界'}</h2>
      <p>{eo?'Unu homo havas unu regadan identecon; riĉeco ne aĉetas regrajton. AI povas resumi, traduki kaj serĉi, sed ĝi ne povas anstataŭi homojn en decido pri proponoj nek aŭtomate movi monon.':'一人一治理身份；财富不购买治理权；AI可以摘要、翻译与检索，但不能代替人决定提案是否通过，也不能自动移动资金。'}</p>
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/projects">{eo?'Vidi projektan plenumadon':'查看项目执行'}</Link><Link className="button button-secondary" href="/login">{eo?'Ensaluti por membrorajtoj':'登录进入成员功能'}</Link></div>
  </main>;
}
