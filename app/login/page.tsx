import Link from 'next/link';
import { getMessages } from '@/lib/i18n';

export default async function LoginPage(){
  const m=await getMessages();
  return <main>
    <span className="badge">{m.login_badge}</span>
    <h1>{m.login_title}</h1>
    <p className="lead">{m.login_lead}</p>
    <div className="card auth-card">
      <p>Alpha 登录界面已接入身份系统骨架；正式表单将在部署验证通过后恢复完整交互。</p>
    </div>
    <p>{m.no_identity} <Link href="/register">{m.create_account}</Link></p>
  </main>;
}
