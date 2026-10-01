import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import { getLocale,getMessages } from '@/lib/i18n';

export default async function RegisterPage() {
  const [locale,m]=await Promise.all([getLocale(),getMessages()]); const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{m.register_badge}</span>
    <h1>{m.register_title}</h1>
    <p className="lead">{m.register_lead}</p>
    <div className="card auth-card">
      <RegisterForm labels={{
        displayName:m.display_name,email:m.email,password:m.password,preferredLanguage:m.preferred_language,
        creating:m.creating,submit:m.create_identity,failed:m.register_failed,devVerify:eo?'Alpha-konfirma ligilo:':en?'Alpha verification link:':'Alpha 验证链接：',
        verifyClick:m.verify_click,zh:m.lang_zh,eo:m.lang_eo,en:m.lang_en
      }} />
    </div>
    <p className="muted">{eo?'En la Alpha-fazo ankoraŭ ne estas konektita oficiala retpoŝta provizanto, tial post registrado la paĝo montras unufojan konfirman ligilon. En la publika versio ĝi estos sendata per retpoŝto.':en?'In Alpha, an official email provider is not yet connected, so after registration the page shows a one-time verification link. In the public release, it will be sent by email.':'Alpha 阶段尚未接入正式邮件供应商，因此注册后页面会显示一次性验证链接。正式公开版将改为邮件发送。'}</p>
    <p>{m.have_account} <Link href="/login">{m.go_login}</Link></p>
  </main>;
}
