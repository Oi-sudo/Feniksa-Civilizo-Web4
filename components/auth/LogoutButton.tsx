'use client';
import { useRouter } from 'next/navigation';

export default function LogoutButton({label}:{label:string}){
  const router=useRouter();
  return <button className="button auth-button" onClick={async()=>{
    await fetch('/api/auth/logout',{method:'POST'});
    router.push('/');
    router.refresh();
  }}>{label}</button>;
}
