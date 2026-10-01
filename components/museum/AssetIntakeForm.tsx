'use client';
import { FormEvent,useState } from 'react';

export default function AssetIntakeForm({halls,locale}:{halls:Array<{id:string;title_zh:string;title_eo:string|null}>;locale:'zh'|'eo'|'en'}){
  const eo=locale==='eo'; const en=locale==='en';
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState('');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setMessage('');
    const f=new FormData(e.currentTarget);
    const payload=Object.fromEntries(f.entries());
    const r=await fetch('/api/museum/intake',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    const data=await r.json(); setBusy(false);
    if(!r.ok){setMessage(data.error||(eo?'Sendado malsukcesis.':en?'Submission failed.':'提交失败'));return;}
    setMessage(eo?`La registro estas kreita: ${data.permanentCode}. La dosiero nun povas esti plu riĉigita.`:en?`Record created: ${data.permanentCode}. The file can now be enriched further.`:`登记已建立：${data.permanentCode}，资料已建立，可继续整理。`); e.currentTarget.reset();
  }
  return <form className="auth-form" onSubmit={submit}>
    <label>{eo?'Ĉina registra nomo':en?'Chinese registered name':'藏品登记名称'}<input name="titleZh" required minLength={2} maxLength={200}/></label>
    <label>{eo?'Esperanta nomo (nedeviga)':en?'Esperanto name (optional)':'世界语名称（可选）'}<input name="titleEo" maxLength={240}/></label>
    <label>{eo?'Angla nomo (nedeviga)':en?'English name (optional)':'英语名称（可选）'}<input name="titleEn" maxLength={240}/></label>
    <label>{eo?'Ĉefa halo':en?'Primary hall':'主馆籍'}<select name="hallId" required defaultValue=""><option value="" disabled>{eo?'Elektu':en?'Select':'请选择'}</option>{halls.map(h=><option value={h.id} key={h.id}>{eo?(h.title_eo||h.title_zh):en?(h.title_eo||h.title_zh):h.title_zh}{locale==='zh'&&h.title_eo?` · ${h.title_eo}`:''}</option>)}</select></label>
    <label>{eo?'Aro/volumo':en?'Batch/volume':'批次/册次'}<input name="batchCode" placeholder={eo?'ekz. D3':en?'e.g. D3':'例如 D3'}/></label>
    <label>{eo?'Kategorio':en?'Category':'类别'}<input name="category" placeholder={eo?'ekz. budhisma dokumento / porcelano / Esperanta dokumento':en?'e.g. Buddhist document / porcelain / Esperanto document':'例如 佛教文献 / 瓷器 / 世界语文献'}/></label>
    <label>{eo?'Materialo':en?'Material':'材质'}<input name="material"/></label>
    <label>{eo?'Periodo aŭ epoka noto':en?'Period or era note':'年代或时期说明'}<textarea name="periodDescription" rows={3}/></label>
    <label>{eo?'Dimensioj':en?'Dimensions':'尺寸'}<input name="dimensions"/></label>
    <label>{eo?'Pezo':en?'Weight':'重量'}<input name="weight"/></label>
    <label>{eo?'Devena noto':en?'Provenance note':'来源备注'}<textarea name="provenance" rows={4}/></label>
    <label>{eo?'Ligilo al kolekta materialo (nedeviga)':en?'Collection material link (optional)':'收藏资料链接（可选）'}<input name="evidenceUrl" type="url" placeholder="https://..."/></label>
    <button className="button button-primary" disabled={busy}>{busy?(eo?'Registrante…':en?'Registering…':'正在登记…'):(eo?'Krei unu-objekto-unu-dosieron':en?'Create one-object-one-file record':'建立一物一档')}</button>
    {message&&<p className="form-message">{message}</p>}
    <p className="muted">{eo?'Nova registrado unue kreas bazan kolektan dosieron. Poste oni povas aldoni devenajn notojn, bildojn, filmetojn, atestilojn kaj aliajn kulturajn materialojn. Profesia aŭtentigo ne estas antaŭkondiĉo por registrado, kaj la registrado mem ne estas merkata takso.':en?'A new registration first creates a basic collection record. Provenance notes, images, videos, certificates and other cultural materials can be added later. Professional authentication is not a prerequisite for registration, and the registration itself is not a market valuation.':'新登记会先建立基础收藏记录，后续可继续补充来源、图片、视频、证书与其他文化资料。登记本身不要求专业鉴定，也不构成市场估值。'}</p>
  </form>;
}
