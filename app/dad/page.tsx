import Link from 'next/link';
import { listPublicProposals } from '@/lib/dad/data';
export default async function DadPage(){const proposals=await listPublicProposals();return <main><span className="badge">DAD</span><h1>DAD 议事厅</h1><p className="lead">提案、讨论、表决与项目执行的公共入口。</p><Link className="button" href="/dad/new">建立提案</Link><div className="card-grid">{proposals.map((p:any)=><Link className="card" key={p.id} href={'/dad/'+p.id}><h2>{p.title}</h2><p>{p.status}</p></Link>)}</div></main>;}
