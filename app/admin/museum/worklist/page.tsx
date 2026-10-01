import Link from 'next/link';
import { requireAnyRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listAdminMuseumAssets,listMuseumHalls,type MuseumEvidenceFilter } from '@/lib/museum/data';

export default async function MuseumWorklistPage({searchParams}:{searchParams:Promise<{evidence?:string;volume?:string;hall?:string}>}){
 await requireAnyRole(['admin','curator','museum_reviewer']); const eo=(await getLocale())==='eo';
 const p=await searchParams;
 const allowed=new Set<MuseumEvidenceFilter>(['all','missing','unverified','source_confirmed','reviewed']);
 const evidence=allowed.has((p.evidence||'all') as MuseumEvidenceFilter)?(p.evidence||'all') as MuseumEvidenceFilter:'all';
 const volume=(p.volume||'').trim()||null; const hall=(p.hall||'').trim()||null;
 const [assets,halls]=await Promise.all([listAdminMuseumAssets(500,evidence,volume,hall),listMuseumHalls()]);
 const selectedHall=halls.find(h=>h.code===hall); const hallName=eo?(selectedHall?.title_eo||selectedHall?.title_zh||'Ĉiuj haloj'):(selectedHall?.title_zh||'全部馆籍');
 const s=new URLSearchParams(); if(evidence!=='all')s.set('evidence',evidence); if(volume)s.set('volume',volume); if(hall)s.set('hall',hall);
 const qs=s.toString();
 return <main className="museum-worklist">
  <span className="badge">Museum · Worklist</span><h1>{eo?'Laborlisto por ordigo de muzeaj materialoj':'馆藏资料整理清单'}</h1>
  <p className="lead">{eo?`Nunaj kondiĉoj: materialo ${evidence}; volumo ${volume||'ĉiuj'}; halo ${hallName}. Entute ${assets.length} eroj.`:`当前条件：资料 ${evidence}；分册 ${volume||'全部'}；馆籍 ${hallName}。共 ${assets.length} 件。`}</p>
  <p className="muted">{eo?'Ĉi tiu laborlisto servas al paŝo-post-paŝa ordigo de personaj kolektaĵoj, kultura memoro kaj cifereca ĝuado. Ĝi ne estas aŭtentiga rezulto nek valor-rangigo.':'本清单用于逐步整理个人收藏、文化记忆与数字赏玩资料，不是鉴定结果或价值排序。'}</p>
  <div className="hero-actions no-print">
   <Link className="button button-secondary" href={qs?`/admin/museum?${qs}`:'/admin/museum'}>{eo?'Reveni al filtrila paĝo':'返回筛选页'}</Link>
   <a className="button button-primary" href={`/api/museum/worklist.csv${qs?'?'+qs:''}`}>{eo?'Eksporti CSV':'导出 CSV'}</a>
   <button className="button button-secondary" onClick={undefined}>{eo?'Uzu la retumilon por presi ĉi tiun paĝon':'可用浏览器打印此页'}</button>
  </div>
  <table className="worklist-table">
   <thead><tr><th>{eo?'Kodo':'编号'}</th><th>{eo?'Kolektaĵo':'藏品'}</th><th>{eo?'Halo':'馆籍'}</th><th>{eo?'Materialoj':'资料总数'}</th><th>{eo?'Por ordigo':'待整理'}</th><th>{eo?'Fonto ordigita':'来源已整理'}</th><th>{eo?'Materialo ordigita':'资料已整理'}</th><th>{eo?'Sekva paŝo':'下一步'}</th></tr></thead>
   <tbody>{assets.map(a=><tr key={a.id}>
    <td>{a.catalog_code||a.permanent_code}</td><td>{eo?(a.title_eo||a.title_zh):a.title_zh}</td><td>{eo?(a.hall_eo||a.hall_zh||'Ne indikita'):(a.hall_zh||'待定')}</td>
    <td>{a.evidence_count}</td><td>{a.evidence_unverified}</td><td>{a.evidence_source_confirmed}</td><td>{a.evidence_reviewed}</td>
    <td>{Number(a.evidence_count)===0?(eo?'Materialoj povas esti aldonitaj':'资料可续补'):Number(a.evidence_unverified)>0?(eo?'Daŭrigi ordigon de fontmaterialoj':'继续整理来源资料'):Number(a.evidence_source_confirmed)>0?(eo?'Daŭrigi ordigon de kolektaj materialoj':'继续整理馆藏资料'):(eo?'Materialo ordigita':'资料已整理')}</td>
   </tr>)}</tbody>
  </table>
 </main>;
}
