import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import { getMessages } from '@/lib/i18n';
export default async function RegisterPage(){const m=await getMessages();return <main><span className="badge">{m.register_badge}</span><h1>{m.register_title}</h1><p className="lead">{m.register_lead}</p><div className="card auth-card"><RegisterForm labels={{displayName:m.display_name,email:m.email,password:m.password,preferredLanguage:m.preferred_language,busy:m.creating,submit:m.create_identity,failed:m.register_failed,devVerify:m.dev_verify,verifyClick:m.verify_click,langZh:m.lang_zh,langEo:m.lang_eo,langEn:m.lang_en}} /></div><p>{m.have_account} <Link href="/login">{m.go_login}</Link></p></main>;}
