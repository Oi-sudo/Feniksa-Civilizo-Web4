import Link from 'next/link';
import { requireRole } from '@/lib/permissions/rbac';
import { getLocale } from '@/lib/i18n';
import { listGovernanceArchiveSnapshots } from '@/lib/dad/data';
import ArchiveSnapshotButton from '@/components/archive/ArchiveSnapshotButton';

export default async function AdminArchivePage(){
  await requireRole('admin');
  const [locale,snapshots]=await Promise.all([getLocale(),listGovernanceArchiveSnapshots(30)]);
  const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">Admin · Archive</span>
    <h1>{eo?'DAD-arkivaj momentbildoj':en?'DAD archive snapshots':'DAD 归档快照'}</h1>
    <p className="lead">{eo?'Kreu unu publikresuman momentbildon por hodiaŭ. Ĉiu dato povas ekzisti nur unufoje.':en?'Create one public-summary snapshot for today. Each date can exist only once.':'为今天生成一份公共治理汇总快照。每个日期只能存在一条。'}</p>
    <ArchiveSnapshotButton
      label={eo?'Krei hodiaŭan momentbildon':en?'Create today’s snapshot':'生成今日快照'}
      working={eo?'Kreante…':en?'Creating…':'正在生成…'}
      done={eo?'La momentbildo estis kreita.':en?'Snapshot created.':'快照已生成。'}
      exists={eo?'Hodiaŭa momentbildo jam ekzistas aŭ ne eblas krei ĝin.':en?'Today’s snapshot already exists or could not be created.':'今日快照已存在，或暂时无法生成。'}
    />
    <section className="card">
      <h2>{eo?'Lastaj momentbildoj':en?'Recent snapshots':'最近快照'}</h2>
      {snapshots.length?<div className="record-list">{snapshots.map(s=><article className="project-subrecord" key={s.id}><div className="record-top"><strong>ARCHIVE-SNAPSHOT · {s.snapshot_date}</strong><span>{new Date(s.created_at).toLocaleString(eo?'eo':en?'en-US':'zh-CN')}</span></div><p>{eo?'Proponoj':en?'Proposals':'提案'} {s.proposal_count} · {eo?'Decidoj':en?'Decisions':'决定'} {s.decision_count} · {eo?'Eventoj':en?'Events':'事件'} {s.governance_event_count} · {eo?'Projektoj':en?'Projects':'项目'} {s.project_count} · {eo?'Mejloŝtonoj':en?'Milestones':'里程碑'} {s.milestone_count}</p></article>)}</div>:<p>{eo?'Ankoraŭ ne ekzistas momentbildoj.':en?'No snapshots exist yet.':'尚未生成快照。'}</p>}
    </section>
    <div className="hero-actions"><Link className="button button-secondary" href="/dad/archive/snapshots">{eo?'Publika listo':en?'Public list':'公开列表'}</Link><Link className="button button-secondary" href="/admin">{eo?'Administra panelo':en?'Admin dashboard':'管理员 Dashboard'}</Link></div>
  </main>;
}
