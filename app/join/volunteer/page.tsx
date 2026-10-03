import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import VolunteerForm from '@/components/volunteer/VolunteerForm';

export default async function VolunteerPage(){
  await requireSignedIn();
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">WEB4 0.2 · VOLUNTEER</span>
    <h1>{eo?'Partoprena kaj volontula registro':en?'Participation & volunteer registration':'参与与志愿者登记'}</h1>
    <p className="lead">{eo?'Elektu unu aŭ plurajn kampojn, kie vi volas kunlabori. Ne necesas scii ĉion; fidinda kontribuo en unu kampo jam estas vera kunlaboro.':en?'Choose one or more areas where you would like to contribute. You do not need to know everything; one reliable contribution is already meaningful participation.':'请选择一个或多个您愿意参与的方向。不需要什么都会；把一件事可靠地做好，就已经是真正的共建。'}</p>
    <section className="card"><VolunteerForm locale={locale}/></section>
    <div className="hero-actions">
      <Link className="button button-secondary" href="/join">{eo?'Reiri al Aliĝu':en?'Back to Join':'返回“加入我们”'}</Link>
      <Link className="button button-secondary" href="/passport">{eo?'Mia pasporto':en?'My passport':'我的学习护照'}</Link>
    </div>
  </main>;
}
