'use client';
import { FormEvent,useState } from 'react';
import Link from 'next/link';

type Labels={displayName:string;email:string;password:string;preferredLanguage:string;creating:string;submit:string;failed:string;devVerify:string;verifyClick:string;zh:string;eo:string;en:string};

export default function RegisterForm({labels}:{labels:Labels}){
  const [message,setMessage]=useState('');
  const [verifyUrl,setVerifyUrl]=useState('');
  const [busy,setBusy]=useState(false);

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    setBusy(true);
    setMessage('');
    setVerifyUrl('');
    const form=new FormData(e.currentTarget);
    const res=await fetch('/api/auth/register',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({
        displayName:form.get('displayName'),
        email:form.get('email'),
        password:form.get('password'),
        language:form.get('language')
      })
    });
    const data=await res.json();
    setBusy(false);
    if(!res.ok) return setMessage(data.error||labels.failed);
    setMessage(data.message);
    if(data.verificationUrl)setVerifyUrl(data.verificationUrl);
    e.currentTarget.reset();
  }

  return <form className="auth-form" onSubmit={submit}>
    <label>{labels.displayName}<input name="displayName" minLength={2} maxLength={80} required /></label>
    <label>{labels.email}<input name="email" type="email" required /></label>
    <label>{labels.password}<input name="password" type="password" minLength={10} required /></label>
    <label>{labels.preferredLanguage}<select name="language" defaultValue="zh"><option value="zh">{labels.zh}</option><option value="eo">{labels.eo}</option><option value="en">{labels.en}</option></select></label>
    <button className="button auth-button" disabled={busy}>{busy?labels.creating:labels.submit}</button>
    {message&&<p className="form-message">{message}</p>}
    {verifyUrl&&<p className="dev-note">{labels.devVerify} <Link href={verifyUrl}>{labels.verifyClick}</Link></p>}
  </form>;
}
