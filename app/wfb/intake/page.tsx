import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import { listMuseumHalls } from '@/lib/museum/data';
import AssetIntakeForm from '@/components/museum/AssetIntakeForm';

export default async function WfbIntakePage(){
  await requireSignedIn(); const halls=await listMuseumHalls();
  return <main>
    <span className="badge">WFB · 一物一档</span>
    <h1>收藏与文化资料登记</h1>
    <p className="lead">先保存收藏名称、现有资料与主馆籍，再逐步丰富数字档案。WFB 0.1 服务于个人收藏、文化记忆与数字赏玩，不要求专业鉴定作为登记前提，也不是交易代币。</p>
    <section className="card"><AssetIntakeForm halls={halls}/></section>
    <Link className="button button-secondary" href="/wfb">返回 WFB 五佛币</Link>
  </main>;
}
