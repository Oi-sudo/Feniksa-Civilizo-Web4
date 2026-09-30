import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';
import { getMessages } from '@/lib/i18n';

export default async function LoginPage() {
  const m = await getMessages();
  return <main>
    <span className="badge">{m.login_badge}</span>
    <h1>{m.login_title}</h1>
    <p className="lead">{m.login_lead}</p>
    <div className="card auth-card">
      <LoginForm labels={{ email:m.email, password:m.password, busy:m.logging_in, submit:m.login_button, failed:m.login_failed }} />
    </div>
    <p>{m.no_identity} <Link href="/register">{m.create_account}</Link></p>
  </main>;
}
