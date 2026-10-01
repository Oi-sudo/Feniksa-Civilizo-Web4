import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listAuditLogs } from '@/lib/audit/data';

const actionZh:Record<string,string>={
  'bud.submit':'提交 BUD','bud.approve':'审核通过 BUD',
  'bud.project_confirmed':'项目服务已确认','bud.project_rejected':'项目服务已驳回',
  'museum.intake':'登记馆藏','museum.review':'馆藏整理','museum.evidence.add':'添加馆藏资料',
  'museum.evidence.status':'更新资料状态','museum.evidence.visibility':'更新展示状态'
};
const actionEn:Record<string,string>={
  'bud.submit':'BUD submitted','bud.approve':'BUD approved',
  'bud.project_confirmed':'Project service confirmed','bud.project_rejected':'Project service rejected',
  'museum.intake':'Collection item registered','museum.review':'Museum record organized','museum.evidence.add':'Collection material added',
  'museum.evidence.status':'Material status updated','museum.evidence.visibility':'Display status updated'
};
const actionEo:Record<string,string>={
  'bud.submit':'BUD sendita','bud.approve':'BUD aprobita',
  'bud.project_confirmed':'Projekta servo konfirmita','bud.project_rejected':'Projekta servo malakceptita',
  'museum.intake':'Kolektaĵo registrita','museum.review':'Muzea dosiero ordigita','museum.evidence.add':'Kolekta materialo aldonita',
  'museum.evidence.status':'Materiala stato ĝisdatigita','museum.evidence.visibility':'Montra stato ĝisdatigita'
};
const entityZh:Record<string,string>={bud_record:'BUD记录',museum_asset:'馆藏档案',museum_media:'馆藏资料',user:'用户',project:'项目'};
const entityEo:Record<string,string>={bud_record:'BUD-registro',museum_asset:'Kolekta dosiero',museum_media:'Kolekta materialo',user:'Uzanto',project:'Projekto'};
const entityEn:Record<string,string>={bud_record:'BUD record',museum_asset:'Collection record',museum_media:'Collection material',user:'User',project:'Project'};

export default async function AuditPage(){
  await requireRole('admin');
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  const result=await listAuditLogs(100);
  return <main>
    <span className="badge">Audit</span>
    <h1>{eo?'Tutreteja revizia protokolo':en?'Site-wide audit log':'全站审计日志'}</h1>
    <div className="card">
      {result.rows.length?result.rows.map((r:any)=><p key={r.id}>{String(r.created_at)} · {(eo?actionEo:en?actionEn:actionZh)[r.action]||r.action} · {(eo?entityEo:en?entityEn:entityZh)[r.entity_type]||r.entity_type} · {r.entity_id||''}</p>):<p>{eo?'Nun ne estas reviziaj registroj.':en?'There are currently no audit records.':'暂无审计记录。'}</p>}
    </div>
  </main>;
}
