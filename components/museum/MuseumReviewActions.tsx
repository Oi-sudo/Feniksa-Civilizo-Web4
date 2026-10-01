'use client';
import { useState } from 'react'; import { useRouter } from 'next/navigation';

export default function MuseumReviewActions({id,canPublish,publishNote,locale}:{id:string;canPublish:boolean;publishNote?:string;locale:'zh'|'eo'|'en'}){
 const eo=locale==='eo'; const en=locale==='en';
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
 async function act(action:'approve'|'changes'){
  setBusy(true);setMessage('');
  const r=await fetch('/api/museum/review',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id,action})});
  const data=await r.json();setBusy(false);
  if(!r.ok){setMessage(data.error||(eo?'Operacio malsukcesis.':en?'Operation failed.':'操作失败'));return;}
  setMessage(data.message);router.refresh();
 }
 return <div className="hero-actions">
  {canPublish&&<button className="button button-primary" disabled={busy} onClick={()=>act('approve')}>{eo?'Publikigi post ordigo':en?'Publish after organization':'整理后公开'}</button>}
  <button className="button button-secondary" disabled={busy} onClick={()=>act('changes')}>{eo?'Reveni por plua ordigo':en?'Return for further organization':'返回继续整理'}</button>
  {!canPublish&&publishNote&&<small>{publishNote}</small>}
  {message&&<small>{message}</small>}
 </div>;
}
