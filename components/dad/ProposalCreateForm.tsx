'use client';
import { FormEvent,useState } from 'react';

export default function ProposalCreateForm(){
  const [busy,setBusy]=useState(false);
  const [submitBusy,setSubmitBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [created,setCreated]=useState<{id:string;shortCode:string|null}|null>(null);
  const [submitted,setSubmitted]=useState(false);

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setMessage(''); setCreated(null); setSubmitted(false);
    const f=new FormData(e.currentTarget);
    const r=await fetch('/api/dad/proposals',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
      title:f.get('title'),
      problemStatement:f.get('problemStatement'),
      proposedSolution:f.get('proposedSolution'),
      budgetRequested:f.get('budgetRequested'),
      currency:f.get('currency'),
      publicValue:f.get('publicValue'),
      riskDescription:f.get('riskDescription')
    })});
    const data=await r.json(); setBusy(false);
    if(!r.ok){setMessage(data.error||'创建提案失败。');return;}
    setCreated({id:data.id,shortCode:data.shortCode||null});
    setMessage('提案草案已建立，并已写入状态历史与审计日志。');
    e.currentTarget.reset();
  }

  async function submitDiscussion(){
    if(!created)return;
    setSubmitBusy(true); setMessage('');
    const r=await fetch('/api/dad/proposals/'+created.id+'/submit',{method:'POST'});
    const data=await r.json(); setSubmitBusy(false);
    if(!r.ok){setMessage(data.error||'提交公开讨论失败。');return;}
    setSubmitted(true);
    setMessage('已提交公开讨论。状态已从 draft 更新为 discussion，并已写入状态历史与审计日志。');
  }

  return <form className="auth-form" onSubmit={submit}>
    <label>提案标题<input name="title" minLength={4} maxLength={160} required /></label>
    <label>问题陈述<textarea name="problemStatement" rows={5} minLength={20} maxLength={5000} required /></label>
    <label>建议方案<textarea name="proposedSolution" rows={6} minLength={20} maxLength={8000} required /></label>
    <label>公共价值<textarea name="publicValue" rows={4} maxLength={4000} /></label>
    <label>风险说明<textarea name="riskDescription" rows={4} maxLength={4000} /></label>
    <label>申请预算<input name="budgetRequested" type="number" min="0" step="0.01" defaultValue="0" required /></label>
    <label>币种<select name="currency" defaultValue="EUR"><option value="EUR">EUR</option><option value="USD">USD</option><option value="CNY">CNY</option></select></label>
    <button className="button button-primary" disabled={busy}>{busy?'正在建立…':'建立提案草案'}</button>
    {message&&<p className="form-message">{message}</p>}
    {created&&<div className="card">
      <p>草案编号：<code>{created.shortCode||created.id}</code> · 数据库 ID：<code>{created.id}</code></p>
      {!submitted
        ?<button type="button" className="button button-secondary" onClick={submitDiscussion} disabled={submitBusy}>{submitBusy?'正在提交…':'提交公开讨论'}</button>
        :<p><strong>当前状态：discussion / 公开讨论</strong></p>}
    </div>}
    <p className="muted">本入口先建立草案；提交公开讨论后仍不代表批准、表决结果或资金授权。</p>
  </form>;
}
