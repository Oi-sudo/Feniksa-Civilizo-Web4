'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BudActionButton({id,action,label,verifiedHours,eo=false,en=false}:{id:string;action:'confirm'|'reject'|'approve';label:string;verifiedHours?:number|null;eo?:boolean;en?:boolean}){
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
  async function run(){
    setBusy(true);setMessage('');
    const endpoint=action==='approve'?'/api/admin/bud/review':'/api/projects/bud-confirm';
    const r=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({id,action,verifiedHours})});
    const data=await r.json();setBusy(false);
    if(!r.ok){setMessage(data.error||(eo?'Ago malsukcesis':en?'Action failed':'操作失败'));return;}
    setMessage(data.message||(eo?'Farite':en?'Done':'已完成'));router.refresh();
  }
  return <span className="inline-action"><button className="button button-secondary" disabled={busy} onClick={run}>{busy?(eo?'Prilaborante…':en?'Processing…':'处理中…'):label}</button>{message&&<small>{message}</small>}</span>;
}
