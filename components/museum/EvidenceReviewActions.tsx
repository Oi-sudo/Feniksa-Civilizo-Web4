'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidenceReviewActions({mediaId,status}:{mediaId:string;status:string}){
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
 async function change(nextStatus:'source_confirmed'|'reviewed'){
  setBusy(true); setMessage('');
  const r=await fetch('/api/museum/evidence/status',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mediaId,nextStatus})});
  const data=await r.json(); setBusy(false);
  if(!r.ok){setMessage(data.error||'状态更新失败');return;}
  setMessage(nextStatus==='source_confirmed'?'来源已确认。':'证据已完成档案审阅。'); router.refresh();
 }
 return <div className="evidence-actions">
  {status==='unverified'&&<button disabled={busy} onClick={()=>change('source_confirmed')}>确认来源</button>}
  {status==='source_confirmed'&&<button disabled={busy} onClick={()=>change('reviewed')}>标记已审阅</button>}
  {status==='reviewed'&&<span className="badge">已审阅</span>}
  {message&&<small>{message}</small>}
 </div>;
}
