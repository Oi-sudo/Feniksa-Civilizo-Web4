import Link from 'next/link';
import { listProjects } from '@/lib/projects/data';
export default async function ProjectsPage(){const rows=await listProjects();return <main><span className="badge">DAD · Projects</span><h1>项目</h1><div className="card-grid">{rows.map((p:any)=><Link className="card" key={p.id} href={'/projects/'+p.id}><h2>{p.title}</h2><p>{p.status}</p></Link>)}</div></main>;}
