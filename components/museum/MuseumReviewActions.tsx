'use client';
import { useState } from 'react'; import { useRouter } from 'next/navigation';

export default function MuseumReviewActions({id}:{id:string}){
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
 async function act(action:'approve'|'changes'){
  setBusy(true);setMessage('');
  const r=await fetch('/api/museum/review',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id,action})});
  const data=await r.json();setBusy(false);
  if(!r.ok){setMessage(data.error||'操作失败');return;}
  setMessage(data.message);router.refresh();
 }
 return <div className="hero-actions"><button className="button button-primary" disabled={busy} onClick={()=>act('approve')}>批准并公开</button><button className="button button-secondary" disabled={busy} onClick={()=>act('changes')}>退回修改</button>{message&&<small>{message}</small>}</div>;
}
