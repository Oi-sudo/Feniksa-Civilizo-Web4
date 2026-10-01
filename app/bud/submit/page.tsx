import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listUserProjects } from '@/lib/bud/data';
import BudSubmitForm from '@/components/bud/BudSubmitForm';

export default async function BudSubmitPage(){
  const [user,locale]=await Promise.all([requireSignedIn(),getLocale()]);
  const eo=locale==='eo';
  const projects=await listUserProjects(user.id);
  return <main>
    <span className="badge">BUD · {eo?'Registro de vola agado':'愿行记录'}</span>
    <h1>{eo?'Sendi registron pri publika servo':'提交公共服务记录'}</h1>
    <p className="lead">{eo?'Registru realan volan agadon, volontulan servon kaj publikan servon. Sendo ne aŭtomate donas BUD; necesas projekta konfirmo, kiam aplikebla, kaj administra revizio.':'记录真实发生的愿行、志愿服务和公共服务。提交不是自动获得 BUD；系统需要项目确认（如适用）与管理审核。'}</p>
    <section className="card"><BudSubmitForm projects={projects} eo={eo}/></section>
    <Link className="button button-secondary" href="/passport/bud">{eo?'Reveni al miaj BUD-registroj':'返回我的 BUD 记录'}</Link>
  </main>;
}
