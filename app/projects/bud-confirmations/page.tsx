import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listManagerBudConfirmations } from '@/lib/bud/data';
import BudActionButton from '@/components/bud/BudActionButton';

export default async function ProjectBudConfirmationsPage(){
  const [user,locale]=await Promise.all([requireSignedIn(),getLocale()]);
  const eo=locale==='eo';
  const rows=await listManagerBudConfirmations(user.id);
  return <main>
    <span className="badge">Projects · BUD</span><h1>{eo?'Konfirmo de projekta servo':'项目服务确认'}</h1>
    <p className="lead">{eo?'La projektrespondeculo nur konfirmas ĉu la servo efektive okazis; tiu persono ne decidas la BUD-valoron. Oni ne rajtas mem konfirmi sian propran servoregistron.':'项目负责人只确认“服务事实是否发生”，不能决定 BUD 数值。自己的服务记录不能由自己确认。'}</p>
    {rows.length?<div className="record-list">{rows.map(r=><article className="card" key={r.id}>
      <h2>{r.user_name} · {r.project_title}</h2><p>{r.description}</p><p>{r.service_type} · {r.hours??(eo?'laŭ evento':'事件制')} {eo?'horoj':'小时'}</p>
      {r.user_id===user.id?<p className="muted">{eo?'Ĉi tiu estas via propra registro; vi ne povas mem konfirmi ĝin. Administranto devas ĝin trakti.':'这是您自己的记录，不能自行确认；需由管理员处理。'}</p>:<div className="hero-actions"><BudActionButton id={r.id} action="confirm" label={eo?'Konfirmi la servofakton':'确认服务事实'} eo={eo}/><BudActionButton id={r.id} action="reject" label={eo?'Malakcepti':'驳回'} eo={eo}/></div>}
    </article>)}</div>:<section className="card"><p>{eo?'Nuntempe ne estas projektaj servoregistroj atendantaj vian konfirmon.':'目前没有等待您确认的项目服务记录。'}</p></section>}
    <Link href="/projects">{eo?'Reveni al projekta plenumado':'返回项目执行'}</Link>
  </main>;
}
