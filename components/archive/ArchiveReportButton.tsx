'use client';

import { useState } from 'react';

export default function ArchiveReportButton({from,to,label,working,done,exists}:{from:string;to:string;label:string;working:string;done:string;exists:string}){
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  async function archive(){
    setBusy(true); setMessage('');
    try{
      const res=await fetch('/api/admin/dad/archive-report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({from,to})});
      const body=await res.json();
      if(res.ok){setMessage(done);location.reload();}
      else setMessage(res.status===409?exists:(body.error||exists));
    }catch{setMessage(exists);}
    finally{setBusy(false);}
  }
  return <div><button className="button button-primary" onClick={archive} disabled={busy}>{busy?working:label}</button>{message&&<p className="muted">{message}</p>}</div>;
}
