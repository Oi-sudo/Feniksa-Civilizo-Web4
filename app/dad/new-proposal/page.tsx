import Link from 'next/link';
import { requireSignedIn } from '@/lib/permissions/rbac';
import ProposalCreateForm from '@/components/dad/ProposalCreateForm';

export default async function NewProposalPage(){
  await requireSignedIn();
  return <main>
    <span className="badge">DAD · PROPOSAL DRAFT</span>
    <h1>建立 DAD 提案草案</h1>
    <p className="lead">把一个公共问题记录为可追踪的治理草案。草案创建后仍需经过讨论、修订、决定与后续执行流程；创建本身不构成批准。</p>
    <section className="card"><ProposalCreateForm /></section>
    <div className="hero-actions"><Link className="button button-secondary" href="/dad">返回 DAD 议事厅</Link></div>
  </main>;
}
