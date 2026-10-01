'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidenceVisibilityActions({mediaId,visibility,canPublish,publishNote}:{mediaId:string;visibility:string;canPublish:boolean;publishNote?:string}){
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
 async function change(next:'reviewer'|'public'){
  setBusy(true); setMessage('');
  const r=await fetch('/api/museum/evidence/visibility',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mediaId,visibility:next})});
  const data=await r.json(); setBusy(false);
  if(!r.ok){setMessage(data.error||'更新失败');return;}
  setMessage(next==='public'?'已公开展示。':'已转为内部资料。'); router.refresh();
 }
 return <div className="evidence-actions">
  {visibility==='public'
    ?<button disabled={busy} onClick={()=>change('reviewer')}>转为内部资料</button>
    :canPublish?<button disabled={busy} onClick={()=>change('public')}>公开展示</button>:null}
  {!canPublish&&visibility!=='public'&&publishNote&&<small>{publishNote}</small>}
  {message&&<small>{message}</small>}
 </div>;
}
