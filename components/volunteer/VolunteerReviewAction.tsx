'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VolunteerReviewAction({id,action,label,eo=false,en=false}:{id:string;action:'approve'|'reject';label:string;eo?:boolean;en?:boolean}){
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
  async function run(){
    const note=action==='reject'?window.prompt(eo?'Kial resendi?':en?'Reason for return?':'请填写退回原因（可简短）：')||'':'';
    setBusy(true);setMessage('');
    const r=await fetch('/api/admin/volunteer/review',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id,action,note})});
    const data=await r.json();setBusy(false);
    if(!r.ok){setMessage(data.error||(eo?'Ago malsukcesis':en?'Action failed':'操作失败'));return;}
    setMessage(data.message||(eo?'Farite':en?'Done':'已完成'));router.refresh();
  }
  return <span className="inline-action"><button className="button button-secondary" disabled={busy} onClick={run}>{busy?(eo?'Prilaborante…':en?'Processing…':'处理中…'):label}</button>{message&&<small>{message}</small>}</span>;
}
