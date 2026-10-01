import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listManagerBudConfirmations } from '@/lib/bud/data';
import BudActionButton from '@/components/bud/BudActionButton';

const serviceZh:Record<string,string>={volunteer_service:'志愿服务',community_support:'社区支持',translation_service:'公益翻译',museum_service:'博物馆服务',teaching_support:'教学支持',public_project:'公共项目'};
const serviceEn:Record<string,string>={volunteer_service:'Volunteer service',community_support:'Community support',translation_service:'Public translation service',museum_service:'Museum service',teaching_support:'Teaching support',public_project:'Public project'};
const serviceEo:Record<string,string>={volunteer_service:'Volontula servo',community_support:'Komunuma subteno',translation_service:'Publika tradukservo',museum_service:'Muzea servo',teaching_support:'Instrua subteno',public_project:'Publika projekto'};

export default async function ProjectBudConfirmationsPage(){
  const [user,locale]=await Promise.all([requireSignedIn(),getLocale()]);
  const eo=locale==='eo'; const en=locale==='en';
  const rows=await listManagerBudConfirmations(user.id);
  return <main>
    <span className="badge">Projects · BUD</span><h1>{eo?'Konfirmo de projekta servo':en?'Project service confirmation':'项目服务确认'}</h1>
    <p className="lead">{eo?'La projektrespondeculo nur konfirmas ĉu la servo efektive okazis; tiu persono ne decidas la BUD-valoron. Oni ne rajtas mem konfirmi sian propran servoregistron.':en?'The project lead only confirms whether the service actually occurred and does not decide the BUD value. A person may not confirm their own service record.':'项目负责人只确认“服务事实是否发生”，不能决定 BUD 数值。自己的服务记录不能由自己确认。'}</p>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <h2>{r.user_name} · {r.project_title}</h2><p>{r.description}</p><p>{(eo?serviceEo:en?serviceEn:serviceZh)[r.service_type]||r.service_type} · {r.hours??(eo?'laŭ evento':en?'event-based':'事件制')} {eo?'horoj':en?'hours':'小时'}</p>
      {r.user_id===user.id?<p className="muted">{eo?'Ĉi tiu estas via propra registro; vi ne povas mem konfirmi ĝin. Administranto devas ĝin trakti.':en?'This is your own record; you cannot confirm it yourself. An administrator must handle it.':'这是您自己的记录，不能自行确认；需由管理员处理。'}</p>:<div className="hero-actions"><BudActionButton id={r.id} action="confirm" label={eo?'Konfirmi la servofakton':en?'Confirm service fact':'确认服务事实'} eo={eo} en={en}/><BudActionButton id={r.id} action="reject" label={eo?'Malakcepti':en?'Reject':'驳回'} eo={eo} en={en}/></div>}
    </article>)}</div>:<section className="card"><p>{eo?'Nuntempe ne estas projektaj servoregistroj atendantaj vian konfirmon.':en?'There are currently no project service records awaiting your confirmation.':'目前没有等待您确认的项目服务记录。'}</p></section>}
    <Link href="/projects">{eo?'Reveni al projekta plenumado':en?'Back to project execution':'返回项目执行'}</Link>
  </main>;
}
