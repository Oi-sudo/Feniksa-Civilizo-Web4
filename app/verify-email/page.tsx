import VerifyEmailClient from '@/components/auth/VerifyEmailClient';
import { getMessages } from '@/lib/i18n';

export default async function VerifyEmailPage({searchParams}:{searchParams:Promise<{token?:string}>}){
  const params=await searchParams;
  const m=await getMessages();
  if(!params.token)return <main><div className="card"><h1>{m.verify_title}</h1><p>{m.verify_missing}</p></div></main>;
  return <main><VerifyEmailClient token={params.token} labels={{verifying:m.verifying,success:m.verify_success,title:m.verify_title,done:m.verify_done,failed:m.verify_failed,login:m.go_to_login}}/></main>;
}
