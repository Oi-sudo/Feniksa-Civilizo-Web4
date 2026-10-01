import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { listMuseumHalls } from '@/lib/museum/data';
import AssetIntakeForm from '@/components/museum/AssetIntakeForm';

export default async function WfbIntakePage(){
  await requireSignedIn(); const halls=await listMuseumHalls();
  return <main>
    <span className="badge">WFB · 一物一档</span>
    <h1>收藏与文化资料登记</h1>
    <p className="lead">先登记事实与证据，再进入馆藏审核。WFB 0.1 是收藏与文化资料登记体系，不是交易代币。</p>
    <section className="card"><AssetIntakeForm halls={halls}/></section>
    <Link className="button button-secondary" href="/wfb">返回 WFB 五佛币</Link>
  </main>;
}
