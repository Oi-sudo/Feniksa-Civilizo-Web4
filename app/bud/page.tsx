import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listBudRecordsForUser } from '@/lib/bud/data';
import BudSubmitForm from '@/components/bud/BudSubmitForm';
export default async function BudPage(){const u=await getCurrentUser();if(!u)redirect('/login');const rows=await listBudRecordsForUser(u.id);return <main><span className="badge">BUD · 0.1</span><h1>BUD 愿行与公共服务</h1><p className="lead">记录愿行，不认证佛法修证；愿行可以留痕，但愿行不能出售。</p><BudSubmitForm/><div className="card"><h2>我的记录</h2>{rows.length?rows.map((r:any)=><p key={r.id}>{r.service_type} · {r.review_status} · {r.bud_value??0}</p>):<p>暂无记录。</p>}</div></main>;}
