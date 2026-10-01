import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getGovernanceArchiveYear } from '@/lib/dad/data';

const monthName=(month:number,locale:string)=>{
  const d=new Date(Date.UTC(2026,month-1,1));
  return new Intl.DateTimeFormat(locale==='eo'?'eo':locale==='en'?'en-US':'zh-CN',{month:'long',timeZone:'UTC'}).format(d);
};

export default async function GovernanceArchiveYearPage({params}:{params:Promise<{year:string}>}){
  const [{year:rawYear},locale]=await Promise.all([params,getLocale()]);
  const year=Number(rawYear);
  if(!Number.isInteger(year)||year<2000||year>3000) notFound();
  const data=await getGovernanceArchiveYear(year);
  const eo=locale==='eo'; const en=locale==='en';

  const monthKeys=new Set<number>();
  for(const s of data.snapshots) monthKeys.add(Number(s.snapshot_date.slice(5,7)));
  for(const r of data.reports){
    if(r.from_snapshot_date.startsWith(String(year))) monthKeys.add(Number(r.from_snapshot_date.slice(5,7)));
    if(r.to_snapshot_date.startsWith(String(year))) monthKeys.add(Number(r.to_snapshot_date.slice(5,7)));
  }
  const months=[...monthKeys].sort((a,b)=>b-a);

  return <main>
    <span className="badge">GOVERNANCE-ARCHIVE · {year}</span>
    <h1>{year} Governance Archive</h1>
    <p className="lead">{eo?'Jaraj publikaj arkivregistroj grupigitaj laŭ monato.':en?'Public yearly archive records grouped by month.':'按月份分组展示本年度公共治理归档记录。'}</p>
    {months.length?months.map(month=>{
      const prefix=year+'-'+String(month).padStart(2,'0');
      const snapshots=data.snapshots.filter(s=>s.snapshot_date.startsWith(prefix));
      const reports=data.reports.filter(r=>r.from_snapshot_date.startsWith(prefix)||r.to_snapshot_date.startsWith(prefix));
      return <section className="card" key={month}>
        <div className="record-top"><h2>{monthName(month,locale)}</h2><strong>{snapshots.length+reports.length}</strong></div>
        {snapshots.length>0&&<div>
          <h3>ARCHIVE-SNAPSHOT</h3>
          <div className="record-list">{snapshots.map(s=><article className="project-subrecord" key={s.id}>
            <div className="record-top"><strong>ARCHIVE-SNAPSHOT · {s.snapshot_date}</strong><span>{s.proposal_count+s.decision_count+s.governance_event_count+s.project_count+s.milestone_count}</span></div>
            <p>{eo?'Proponoj':en?'Proposals':'提案'} {s.proposal_count} · {eo?'Decidoj':en?'Decisions':'决定'} {s.decision_count} · {eo?'Eventoj':en?'Events':'事件'} {s.governance_event_count} · {eo?'Projektoj':en?'Projects':'项目'} {s.project_count} · {eo?'Mejloŝtonoj':en?'Milestones':'里程碑'} {s.milestone_count}</p>
            <p><Link href={'/dad/archive/snapshots#archive-snapshot-'+s.snapshot_date}>{eo?'Malfermi momentbildon →':en?'Open snapshot →':'打开快照 →'}</Link></p>
          </article>)}</div>
        </div>}
        {reports.length>0&&<div>
          <h3>ARCHIVE-REPORT</h3>
          <div className="record-list">{reports.map(r=><article className="project-subrecord" key={r.id}>
            <div className="record-top"><strong>ARCHIVE-REPORT · {r.from_snapshot_date} · {r.to_snapshot_date}</strong><span>{new Date(r.created_at).toLocaleDateString(eo?'eo':en?'en-US':'zh-CN')}</span></div>
            <p><Link href={'/dad/archive/compare?from='+r.from_snapshot_date+'&to='+r.to_snapshot_date}>{eo?'Malfermi raporton →':en?'Open report →':'打开报告 →'}</Link></p>
          </article>)}</div>
        </div>}
      </section>;
    }):<section className="card"><p>{eo?'Neniu arkivregistro troviĝis por ĉi tiu jaro.':en?'No archive records were found for this year.':'该年度尚无归档记录。'}</p></section>}
    <div className="hero-actions"><Link className="button button-primary" href="/dad/archive/years">{eo?'Reveni al jaroj':en?'Back to years':'返回年度索引'}</Link><Link className="button button-secondary" href="/dad/archive">{eo?'Reveni al arkivo':en?'Back to archive':'返回治理档案馆'}</Link></div>
  </main>;
}