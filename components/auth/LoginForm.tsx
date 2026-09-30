'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type Labels = { email:string; password:string; busy:string; submit:string; failed:string };

export default function LoginForm({ labels }: { labels: Labels }) {
  const router = useRouter();
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage('');
    const form=new FormData(e.currentTarget);
    const res=await fetch('/api/auth/login',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({email:form.get('email'),password:form.get('password')})
    });
    const data=await res.json();
    setBusy(false);
    if(!res.ok) return setMessage(data.error||labels.failed);
    router.push('/passport');
    router.refresh();
  }

  return <form className="auth-form" onSubmit={submit}>
    <label>{labels.email}<input name="email" type="email" required /></label>
    <label>{labels.password}<input name="password" type="password" required /></label>
    <button className="button auth-button" disabled={busy}>{busy?labels.busy:labels.submit}</button>
    {message&&<p className="form-message">{message}</p>}
  </form>;
}
