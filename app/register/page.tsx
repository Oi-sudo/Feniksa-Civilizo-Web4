import Link from 'next/link';
import { getMessages } from '@/lib/i18n';

export default async function RegisterPage(){
  const m=await getMessages();
  return <main>
    <span className="badge">{m.register_badge}</span>
    <h1>{m.register_title}</h1>
    <p className="lead">{m.register_lead}</p>
    <div className="card auth-card">
      <p>Alpha 注册界面已接入身份系统骨架；真实邮箱验证将在正式部署环境接入。</p>
    </div>
    <p>{m.have_account} <Link href="/login">{m.go_login}</Link></p>
  </main>;
}
