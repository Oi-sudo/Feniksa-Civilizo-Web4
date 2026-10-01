import Link from 'next/link';
import { getLocale } from '@/lib/i18n';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { listMuseumHalls } from '@/lib/museum/data';
import AssetIntakeForm from '@/components/museum/AssetIntakeForm';

export default async function WfbIntakePage(){
  await requireSignedIn(); const locale=await getLocale(); const eo=locale==='eo'; const halls=await listMuseumHalls();
  return <main>
    <span className="badge">WFB · {eo?'Unu objekto, unu dosiero':'一物一档'}</span>
    <h1>{eo?'Registrado de kolektaĵoj kaj kulturaj materialoj':'收藏与文化资料登记'}</h1>
    <p className="lead">{eo?'Unue konservu la nomon de la kolektaĵo, la ekzistantajn materialojn kaj la ĉefan halon; poste la cifereca dosiero povas iom post iom pliriĉiĝi. WFB 0.1 servas al persona kolektado, kultura memoro kaj cifereca ĝuado. Profesia aŭtentigo ne estas antaŭkondiĉo por registrado, kaj WFB ne estas komerca tokeno.':'先保存收藏名称、现有资料与主馆籍，再逐步丰富数字档案。WFB 0.1 服务于个人收藏、文化记忆与数字赏玩，不要求专业鉴定作为登记前提，也不是交易代币。'}</p>
    <section className="card"><AssetIntakeForm halls={halls} locale={locale}/></section>
    <Link className="button button-secondary" href="/wfb">{eo?'Reveni al WFB':'返回 WFB 五佛币'}</Link>
  </main>;
}
