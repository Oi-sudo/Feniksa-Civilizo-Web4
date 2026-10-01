'use client';
import { FormEvent,useState } from 'react';

export default function AssetIntakeForm({halls,locale}:{halls:Array<{id:string;title_zh:string;title_eo:string|null}>;locale:'zh'|'eo'|'en'}){
  const eo=locale==='eo';
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setMessage('');
    const f=new FormData(e.currentTarget);
    const payload=Object.fromEntries(f.entries());
    const r=await fetch('/api/museum/intake',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json(); setBusy(false);
    if(!r.ok){setMessage(data.error||(eo?'Sendado malsukcesis.':'提交失败'));return;}
    setMessage(eo?`La registro estas kreita: ${data.permanentCode}. La dosiero nun povas esti plu riĉigita.`:`登记已建立：${data.permanentCode}，资料已建立，可继续整理。`); e.currentTarget.reset();
  }
  return <form className="auth-form" onSubmit={submit}>
    <label>{eo?'Ĉina registra nomo':'藏品登记名称'}<input name="titleZh" required minLength={2} maxLength={200}/></label>
    <label>{eo?'Esperanta nomo (nedeviga)':'世界语名称（可选）'}<input name="titleEo" maxLength={240}/></label>
    <label>{eo?'Angla nomo (nedeviga)':'英语名称（可选）'}<input name="titleEn" maxLength={240}/></label>
    <label>{eo?'Ĉefa halo':'主馆籍'}<select name="hallId" required defaultValue=""><option value="" disabled>{eo?'Elektu':'请选择'}</option>{halls.map(h=><option value={h.id} key={h.id}>{eo?(h.title_eo||h.title_zh):h.title_zh}{!eo&&h.title_eo?` · ${h.title_eo}`:''}</option>)}</select></label>
    <label>{eo?'Aro/volumo':'批次/册次'}<input name="batchCode" placeholder={eo?'ekz. D3':'例如 D3'}/></label>
    <label>{eo?'Kategorio':'类别'}<input name="category" placeholder={eo?'ekz. budhisma dokumento / porcelano / Esperanta dokumento':'例如 佛教文献 / 瓷器 / 世界语文献'}/></label>
    <label>{eo?'Materialo':'材质'}<input name="material"/></label>
    <label>{eo?'Periodo aŭ epoka noto':'年代或时期说明'}<textarea name="periodDescription" rows={3}/></label>
    <label>{eo?'Dimensioj':'尺寸'}<input name="dimensions"/></label>
    <label>{eo?'Pezo':'重量'}<input name="weight"/></label>
    <label>{eo?'Devena noto':'来源备注'}<textarea name="provenance" rows={4}/></label>
    <label>{eo?'Ligilo al kolekta materialo (nedeviga)':'收藏资料链接（可选）'}<input name="evidenceUrl" type="url" placeholder="https://..."/></label>
    <button className="button button-primary" disabled={busy}>{busy?(eo?'Registrante…':'正在登记…'):(eo?'Krei unu-objekto-unu-dosieron':'建立一物一档')}</button>
    {message&&<p className="form-message">{message}</p>}
    <p className="muted">{eo?'Nova registrado unue kreas bazan kolektan dosieron. Poste oni povas aldoni devenajn notojn, bildojn, filmetojn, atestilojn kaj aliajn kulturajn materialojn. Profesia aŭtentigo ne estas antaŭkondiĉo por registrado, kaj la registrado mem ne estas merkata takso.':'新登记会先建立基础收藏记录，后续可继续补充来源、图片、视频、证书与其他文化资料。登记本身不要求专业鉴定，也不构成市场估值。'}</p>
  </form>;
}
