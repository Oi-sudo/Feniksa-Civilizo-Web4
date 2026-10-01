import Link from 'next/link';
import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listAdminPendingBud } from '@/lib/bud/data';
import BudActionButton from '@/components/bud/BudActionButton';

const confirmationZh:Record<string,string>={pending:'待确认',confirmed:'已确认',rejected:'已驳回',not_required:'无需确认'};
const confirmationEo:Record<string,string>={pending:'Atendas konfirmon',confirmed:'Konfirmita',rejected:'Malakceptita',not_required:'Konfirmo ne bezonata'};

export default async function AdminBudPage(){
  await requireRole('admin'); const eo=(await getLocale())==='eo'; const rows=await listAdminPendingBud();
  return <main>
    <span className="badge">Admin · BUD</span><h1>{eo?'BUD-kontrola atendovico':'BUD 审核队列'}</h1>
    <p className="lead">{eo?'La administranto kontrolas la faktojn kaj servokvanton; la BUD-valoro estas kalkulata de la servilo laŭ la reguloj BUD-0.1 kaj ne estas mane enigata de la uzanto aŭ kontrolanto.':'管理员审核事实与服务量；BUD 值由服务器按 BUD-0.1 规则计算，不由用户或审核者手填。'}</p>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <h2>{r.user_name}</h2><p>{r.description}</p><p>{r.service_type} · {eo?'Deklaritaj horoj':'申报小时'} {r.hours??'—'} · {eo?'Projekto':'项目'} {r.project_title??(eo?'neniu':'无')}</p>
      <p>{eo?'Projekta konfirmo':'项目确认'}：<strong>{(eo?confirmationEo:confirmationZh)[r.project_confirmation_status]||r.project_confirmation_status}</strong></p>
      {(r.project_confirmation_status==='confirmed'||r.project_confirmation_status==='not_required')?
        <BudActionButton id={r.id} action="approve" label={eo?'Aprobi kaj kalkuli BUD':'审核通过并计算 BUD'} verifiedHours={r.hours?Number(r.hours):null}/>:
        <p className="muted">{eo?'La projekta servo ankoraŭ ne estas konfirmita kaj ne povas esti aprobita.':'项目服务尚未确认，不能批准。'}</p>}
    </article>)}</div>:<section className="card"><p>{eo?'Nun ne estas BUD-registroj por kontrolo.':'目前没有待审核 BUD 记录。'}</p></section>}
    <Link href="/admin">{eo?'Reveni al administra panelo':'返回管理员 Dashboard'}</Link>
  </main>;
}
