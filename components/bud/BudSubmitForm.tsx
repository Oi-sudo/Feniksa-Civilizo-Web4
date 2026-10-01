'use client';
import { FormEvent,useState } from 'react';

export default function BudSubmitForm({projects,eo=false}:{projects:Array<{id:string;title:string}>;eo?:boolean}){
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
    if(!r.ok){setMessage(data.error||(eo?'Sendo malsukcesis':'提交失败'));return;}
    setMessage(data.projectConfirmationRequired
      ?(eo?'Sendita. Ĝi atendos konfirmon de la projektrespondeculo antaŭ administra revizio.':'已提交，等待项目负责人确认后进入管理审核。')
      :(eo?'Sendita. Ĝi atendas administran revizion.':'已提交，等待管理审核。'));
    e.currentTarget.reset();
  }
  return <form className="auth-form" onSubmit={submit}>
    <label>{eo?'Servotipo':'服务类型'}
      <select name="serviceType" required defaultValue="volunteer_service">
        <option value="volunteer_service">{eo?'Volontula servo':'志愿服务 · Volontula servo'}</option>
        <option value="community_support">{eo?'Komunuma subteno':'社区支持 · Komunuma subteno'}</option>
        <option value="translation_service">{eo?'Publika tradukservo':'公益翻译 · Publika tradukservo'}</option>
        <option value="museum_service">{eo?'Muzea servo':'博物馆服务 · Muzea servo'}</option>
        <option value="teaching_support">{eo?'Instrua subteno':'教学支持 · Instrua subteno'}</option>
        <option value="public_project">{eo?'Mejloŝtono aŭ evento de publika projekto':'公共项目里程碑/事件 · Publika projekto'}</option>
      </select>
    </label>
    <label>{eo?'Priskribo de la servo':'服务说明'}<textarea name="description" rows={5} required minLength={10} maxLength={2000}/></label>
    <label>{eo?'Servhoroj (povas resti malplena por publika projekta evento)':'服务小时（公共项目事件可留空）'}<input name="hours" type="number" min="0" step="0.25"/></label>
    <label>{eo?'Rilata projekto (nedeviga)':'关联项目（可选）'}
      <select name="projectId" defaultValue=""><option value="">{eo?'Sen rilata projekto':'不关联项目'}</option>{projects.map(p=><option value={p.id} key={p.id}>{p.title}</option>)}</select>
    </label>
    <label>{eo?'Ligilo al pruvo (nedeviga)':'证据链接（可选）'}<input name="evidenceUrl" type="url" placeholder="https://..."/></label>
    <button className="button button-primary" disabled={busy}>{busy?(eo?'Sendante…':'正在提交…'):(eo?'Sendi servoregistron':'提交服务记录')}</button>
    {message&&<p className="form-message">{message}</p>}
    <p className="muted">{eo?'Vi sendas nur faktojn, tempon kaj pruvojn. La BUD-valoro estas kalkulata de la servilo laŭ la reguloj kaj ne povas esti mem enigita.':'您只提交事实、时间与证据，BUD 数值由服务器按规则计算，不能自行填写。'}</p>
  </form>;
}
