'use client';
import { FormEvent,useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VolunteerBudRequest({taskId,eo=false,en=false}:{taskId:string;eo?:boolean;en?:boolean}){
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const router=useRouter();
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setMessage('');
    const f=new FormData(e.currentTarget);
    const r=await fetch('/api/bud/from-volunteer',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({taskId,hours:f.get('hours')})});
    const data=await r.json();setBusy(false);
    if(!r.ok){setMessage(data.error||(eo?'Sendo malsukcesis':en?'Submission failed':'提交失败'));return;}
    setMessage(data.message);router.refresh();
  }
  return <form className="volunteer-task-actions" onSubmit={submit}>
    <strong>{eo?'Peti BUD-servoregistron':en?'Request a BUD service record':'申请 BUD 服务记录'}</strong>
    <label>{eo?'Faktaj servhoroj':en?'Actual service hours':'实际服务小时'}<input name="hours" type="number" min="0.25" max="1000" step="0.25" required/></label>
    <button className="button button-secondary" disabled={busy}>{busy?(eo?'Sendante…':en?'Submitting…':'正在提交…'):(eo?'Sendi por BUD-kontrolo':en?'Submit for BUD review':'提交 BUD 审核')}</button>
    {message&&<p className="form-message">{message}</p>}
    <p className="muted">{eo?'Konfirmita volontula tasko ne aŭtomate donas BUD. La servhoroj kaj la BUD-valoro estos kontrolataj laŭ BUD-0.1.':en?'A confirmed volunteer task does not automatically grant BUD. Service hours and BUD value are reviewed under BUD-0.1.':'志愿任务确认通过并不自动产生 BUD；服务小时和 BUD 数值仍须按 BUD-0.1 规则审核。'}</p>
  </form>;
}
