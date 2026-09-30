import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { listEstRecordsForUser } from '@/lib/est/data';
import EstClaimForm from '@/components/est/EstClaimForm';
export default async function EstPage(){const u=await getCurrentUser();if(!u)redirect('/login');const rows=await listEstRecordsForUser(u.id);return <main><span className="badge">EST · 0.1</span><h1>EST 学习与知识贡献</h1><p className="lead">不可交易、不能提现、不代表投资价值。</p><EstClaimForm/><div className="card"><h2>我的记录</h2>{rows.length?rows.map((r:any)=><p key={r.id}>{r.activity_type} · {r.review_status} · {r.est_value??0}</p>):<p>暂无记录。</p>}</div></main>;}
