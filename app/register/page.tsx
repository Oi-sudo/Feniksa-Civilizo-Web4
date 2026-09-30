import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import { getMessages } from '@/lib/i18n';

export default async function RegisterPage() {
  const m = await getMessages();
  return <main>
    <span className="badge">{m.register_badge}</span>
    <h1>{m.register_title}</h1>
    <p className="lead">{m.register_lead}</p>
    <div className="card auth-card">
      <RegisterForm labels={{
        displayName:m.display_name,email:m.email,password:m.password,preferredLanguage:m.preferred_language,
        creating:m.creating,submit:m.create_identity,failed:m.register_failed,devVerify:'Alpha 验证链接：',
        verifyClick:m.verify_click,zh:m.lang_zh,eo:m.lang_eo,en:m.lang_en
      }} />
    </div>
    <p className="muted">Alpha 阶段尚未接入正式邮件供应商，因此注册后页面会显示一次性验证链接。正式公开版将改为邮件发送。</p>
    <p>{m.have_account} <Link href="/login">{m.go_login}</Link></p>
  </main>;
}
