'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidenceReviewActions({mediaId,status,locale}:{mediaId:string;status:string;locale:'zh'|'eo'|'en'}){
 const eo=locale==='eo'; const en=locale==='en';
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
 async function change(nextStatus:'source_confirmed'|'reviewed'){
  setBusy(true); setMessage('');
  const r=await fetch('/api/museum/evidence/status',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mediaId,nextStatus})});
  const data=await r.json(); setBusy(false);
  if(!r.ok){setMessage(data.error||(eo?'Ĝisdatigo malsukcesis.':en?'Update failed.':'状态更新失败'));return;}
  setMessage(nextStatus==='source_confirmed'?(eo?'La fonto estas ordigita.':en?'The source is organized.':'来源已整理。'):(eo?'La materialo estas ordigita.':en?'The material is organized.':'资料已整理。')); router.refresh();
 }
 return <div className="evidence-actions">
  {status==='unverified'&&<button disabled={busy} onClick={()=>change('source_confirmed')}>{eo?'Ordigi la fonton':en?'Organize source':'整理来源'}</button>}
  {status==='source_confirmed'&&<button disabled={busy} onClick={()=>change('reviewed')}>{eo?'Marki kiel ordigita':en?'Mark as organized':'标记已整理'}</button>}
  {status==='reviewed'&&<span className="badge">{eo?'Materialo ordigita':en?'Material organized':'资料已整理'}</span>}
  {message&&<small>{message}</small>}
 </div>;
}
