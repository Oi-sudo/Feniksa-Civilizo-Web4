import Link from 'next/link';
import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listAdminPendingBud } from '@/lib/bud/data';
import BudActionButton from '@/components/bud/BudActionButton';

const serviceZh:Record<string,string>={volunteer_service:'志愿服务',community_support:'社区支持',translation_service:'公益翻译',museum_service:'博物馆服务',teaching_support:'教学支持',public_project:'公共项目'};
const serviceEn:Record<string,string>={volunteer_service:'Volunteer service',community_support:'Community support',translation_service:'Public translation service',museum_service:'Museum service',teaching_support:'Teaching support',public_project:'Public project'};
const serviceEo:Record<string,string>={volunteer_service:'Volontula servo',community_support:'Komunuma subteno',translation_service:'Publika tradukservo',museum_service:'Muzea servo',teaching_support:'Instrua subteno',public_project:'Publika projekto'};
const confirmationZh:Record<string,string>={pending:'待确认',confirmed:'已确认',rejected:'已驳回',not_required:'无需确认'};
const confirmationEo:Record<string,string>={pending:'Atendas konfirmon',confirmed:'Konfirmita',rejected:'Malakceptita',not_required:'Konfirmo ne bezonata'};
const confirmationEn:Record<string,string>={pending:'Pending confirmation',confirmed:'Confirmed',rejected:'Rejected',not_required:'Confirmation not required'};

export default async function AdminBudPage(){
  await requireRole('admin'); const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en'; const rows=await listAdminPendingBud();
  return <main>
    <span className="badge">Admin · BUD</span><h1>{eo?'BUD-kontrola atendovico':en?'BUD review queue':'BUD 审核队列'}</h1>
    <p className="lead">{eo?'La administranto kontrolas la faktojn kaj servokvanton; la BUD-valoro estas kalkulata de la servilo laŭ la reguloj BUD-0.1 kaj ne estas mane enigata de la uzanto aŭ kontrolanto.':en?'The administrator reviews the facts and service quantity; the BUD value is calculated by the server under the BUD-0.1 rules and is not manually entered by the user or reviewer.':'管理员审核事实与服务量；BUD 值由服务器按 BUD-0.1 规则计算，不由用户或审核者手填。'}</p>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <h2>{r.user_name}</h2><p>{r.description}</p><p>{(eo?serviceEo:en?serviceEn:serviceZh)[r.service_type]||r.service_type} · {eo?'Deklaritaj horoj':en?'Declared hours':'申报小时'} {r.hours??'—'} · {eo?'Projekto':en?'Project':'项目'} {r.project_title??(eo?'neniu':en?'none':'无')}</p>
      <p>{eo?'Projekta konfirmo':en?'Project confirmation':'项目确认'}：<strong>{(eo?confirmationEo:en?confirmationEn:confirmationZh)[r.project_confirmation_status]||r.project_confirmation_status}</strong></p>
      {r.source_volunteer_code&&<p>{eo?'Fonta volontula tasko':en?'Source volunteer task':'来源志愿任务'}：<strong>{r.source_volunteer_code}</strong></p>}
      {(r.project_confirmation_status==='confirmed'||r.project_confirmation_status==='not_required')?
        <BudActionButton id={r.id} action="approve" label={eo?'Aprobi kaj kalkuli BUD':en?'Approve and calculate BUD':'审核通过并计算 BUD'} verifiedHours={r.hours?Number(r.hours):null} eo={eo} en={en}/>:
        <p className="muted">{eo?'La projekta servo ankoraŭ ne estas konfirmita kaj ne povas esti aprobita.':en?'The project service has not yet been confirmed and cannot be approved.':'项目服务尚未确认，不能批准。'}</p>}
    </article>)}</div>:<section className="card"><p>{eo?'Nun ne estas BUD-registroj por kontrolo.':en?'There are currently no BUD records awaiting review.':'目前没有待审核 BUD 记录。'}</p></section>}
    <Link href="/admin">{eo?'Reveni al administra panelo':en?'Back to admin dashboard':'返回管理员 Dashboard'}</Link>
  </main>;
}
