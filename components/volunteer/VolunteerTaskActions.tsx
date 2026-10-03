'use client';
import { useState } from 'react';

type Props={
  locale:'zh'|'eo'|'en';
  taskId:string;
  assignmentStatus:string|null;
};

function pick(locale:Props['locale'],zh:string,eo:string,en:string){return locale==='eo'?eo:locale==='en'?en:zh;}

export default function VolunteerTaskActions({locale,taskId,assignmentStatus}:Props){
  const [status,setStatus]=useState(assignmentStatus);
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');

  async function act(action:'claim'|'complete',form?:HTMLFormElement){
    setBusy(true); setMessage('');
    const fd=form?new FormData(form):null;
    const r=await fetch('/api/volunteer/tasks',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
      taskId,action,resultUrl:fd?.get('resultUrl'),resultNote:fd?.get('resultNote')
    })});
    const data=await r.json(); setBusy(false);
    if(!r.ok){setMessage(data.error||pick(locale,'操作失败。','Ago malsukcesis.','Action failed.'));return;}
    setStatus(data.status);
    setMessage(data.status==='completed'
      ?pick(locale,'成果已记录，任务已标记完成。','La rezulto estas registrita kaj la tasko markita kompleta.','Result recorded; task marked complete.')
      :pick(locale,'任务已认领。','La tasko estas alprenita.','Task claimed.'));
  }

  if(status==='completed')return <p className="volunteer-task-state">{pick(locale,'✓ 已完成','✓ Kompletigita','✓ Completed')}</p>;
  if(status!=='claimed')return <div className="volunteer-task-actions">
    <button className="button button-primary" disabled={busy} onClick={()=>act('claim')}>{busy?pick(locale,'正在认领…','Alprenante…','Claiming…'):pick(locale,'认领任务','Alpreni taskon','Claim task')}</button>
    {message&&<p className="form-message">{message}</p>}
  </div>;

  return <form className="volunteer-task-actions" onSubmit={(e)=>{e.preventDefault();act('complete',e.currentTarget)}}>
    <strong>{pick(locale,'已认领 · 完成后填写成果','Alprenita · post fino registru la rezulton','Claimed · record your result when finished')}</strong>
    <label>{pick(locale,'成果链接（可选）','Rezulta ligilo (nedeviga)','Result link (optional)')}<input name="resultUrl" type="url" maxLength={1000}/></label>
    <label>{pick(locale,'成果说明','Rezulta noto','Result note')}<textarea name="resultNote" rows={4} maxLength={3000}/></label>
    <button className="button button-primary" disabled={busy}>{busy?pick(locale,'正在保存…','Konservante…','Saving…'):pick(locale,'提交成果并完成','Sendi rezulton kaj fini','Submit result and complete')}</button>
    {message&&<p className="form-message">{message}</p>}
  </form>;
}
