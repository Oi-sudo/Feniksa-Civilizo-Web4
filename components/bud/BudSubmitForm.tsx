'use client';
import { FormEvent,useState } from 'react';

export default function BudSubmitForm({projects}:{projects:Array<{id:string;title:string}>}){
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();setBusy(true);setMessage('');
    const f=new FormData(e.currentTarget);
    const r=await fetch('/api/bud/submit',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
      serviceType:f.get('serviceType'),description:f.get('description'),hours:f.get('hours'),
      evidenceUrl:f.get('evidenceUrl'),projectId:f.get('projectId')||null
    })});
    const data=await r.json();setBusy(false);
    if(!r.ok){setMessage(data.error||'提交失败');return;}
    setMessage(data.projectConfirmationRequired?'已提交，等待项目负责人确认后进入管理审核。':'已提交，等待管理审核。');
    e.currentTarget.reset();
  }
  return <form className="auth-form" onSubmit={submit}>
    <label>服务类型
      <select name="serviceType" required defaultValue="volunteer_service">
        <option value="volunteer_service">志愿服务 · Volontula servo</option>
        <option value="community_support">社区支持 · Komunuma subteno</option>
        <option value="translation_service">公益翻译 · Publika tradukservo</option>
        <option value="museum_service">博物馆服务 · Muzea servo</option>
        <option value="teaching_support">教学支持 · Instrua subteno</option>
        <option value="public_project">公共项目里程碑/事件 · Publika projekto</option>
      </select>
    </label>
    <label>服务说明<textarea name="description" rows={5} required minLength={10} maxLength={2000}/></label>
    <label>服务小时（公共项目事件可留空）<input name="hours" type="number" min="0" step="0.25"/></label>
    <label>关联项目（可选）
      <select name="projectId" defaultValue=""><option value="">不关联项目</option>{projects.map(p=><option value={p.id} key={p.id}>{p.title}</option>)}</select>
    </label>
    <label>证据链接（可选）<input name="evidenceUrl" type="url" placeholder="https://..."/></label>
    <button className="button button-primary" disabled={busy}>{busy?'正在提交…':'提交服务记录'}</button>
    {message&&<p className="form-message">{message}</p>}
    <p className="muted">您只提交事实、时间与证据，BUD 数值由服务器按规则计算，不能自行填写。</p>
  </form>;
}
