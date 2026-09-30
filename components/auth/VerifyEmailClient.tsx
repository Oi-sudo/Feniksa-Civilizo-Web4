'use client';
import { useEffect,useState } from 'react';
import Link from 'next/link';

type Labels={verifying:string;success:string;title:string;done:string;failed:string;login:string};

export default function VerifyEmailClient({token,labels}:{token:string;labels:Labels}){
  const [message,setMessage]=useState(labels.verifying);
  const [ok,setOk]=useState(false);

  useEffect(()=>{
    fetch('/api/auth/verify-email',{
      method:'POST',
      headers:{'content-type':'application/json'},
      body:JSON.stringify({token})
    })
      .then(async r=>({ok:r.ok,data:await r.json()}))
      .then(({ok,data})=>{setOk(ok);setMessage(data.message||data.error||labels.done);})
      .catch(()=>setMessage(labels.failed));
  },[token,labels.done,labels.failed]);

  return <div className="card">
    <h2>{ok?labels.success:labels.title}</h2>
    <p>{message}</p>
    {ok&&<Link className="button" href="/login">{labels.login}</Link>}
  </div>;
}
