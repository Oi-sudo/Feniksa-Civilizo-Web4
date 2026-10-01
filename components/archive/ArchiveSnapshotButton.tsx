'use client';

import { useState } from 'react';

export default function ArchiveSnapshotButton({label,working,done,exists}:{label:string;working:string;done:string;exists:string}){
  const [message,setMessage]=useState('');
  const [busy,setBusy]=useState(false);
  async function create(){
    setBusy(true); setMessage('');
    try{
      const res=await fetch('/api/admin/dad/archive-snapshot',{method:'POST'});
      const body=await res.json();
      if(res.ok){ setMessage(done); location.reload(); }
      else setMessage(res.status===409?exists:(body.error||exists));
    }catch{ setMessage(exists); }
    finally{ setBusy(false); }
  }
  return <div><button className="button button-primary" onClick={create} disabled={busy}>{busy?working:label}</button>{message&&<p className="muted">{message}</p>}</div>;
}
