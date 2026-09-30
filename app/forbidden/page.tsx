import Link from 'next/link';
import { getMessages } from '@/lib/i18n';

export default async function ForbiddenPage({searchParams}:{searchParams:Promise<{reason?:string}>}){
  const params=await searchParams;
  const inactive=params.reason==='inactive';
  const m=await getMessages();
  return <main>
    <span className="badge">403</span>
    <h1>{inactive?m.inactive_title:m.forbidden_title}</h1>
    <p className="lead">{inactive?m.inactive_lead:m.forbidden_lead}</p>
    <p><Link href="/">{m.back_home}</Link> · <Link href="/passport">{m.my_passport}</Link></p>
  </main>;
}
