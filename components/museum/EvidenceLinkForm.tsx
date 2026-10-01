'use client';
import { FormEvent,useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidenceLinkForm({assetId,locale}:{assetId:string;locale:'zh'|'eo'|'en'}){
 const eo=locale==='eo';
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setBusy(true); setMessage('');
  const f=new FormData(e.currentTarget);
  const r=await fetch('/api/museum/evidence',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
    assetId,mediaType:f.get('mediaType'),evidenceRole:f.get('evidenceRole'),fileUrl:f.get('fileUrl'),
    caption:f.get('caption'),sourceNote:f.get('sourceNote'),copyrightStatus:f.get('copyrightStatus')
  })});
  const data=await r.json(); setBusy(false);
  if(!r.ok){setMessage(data.error||(eo?'Konservado malsukcesis.':'保存失败'));return;}
  setMessage(eo?'La kolekta materialo estas ligita.':'收藏资料已挂接。'); e.currentTarget.reset(); router.refresh();
 }
 return <form className="auth-form" onSubmit={submit}>
  <label>{eo?'Tipo de aldonaĵo':'附件类型'}<select name="mediaType" defaultValue="image">
    <option value="image">{eo?'Bildo':'图片'}</option><option value="video">{eo?'Filmeto':'视频'}</option><option value="document">{eo?'Dokumento/dosiero':'文献/文件'}</option>
    <option value="certificate">{eo?'Atestilo':'证书'}</option><option value="3d_model">{eo?'3D-modelo':'3D 模型'}</option>
  </select></label>
  <label>{eo?'Rolo de la materialo':'资料角色'}<select name="evidenceRole" defaultValue="original">
    <option value="original">{eo?'Origina kolekta materialo':'原始收藏资料'}</option><option value="publication_history">{eo?'Materialo pri disvastiga historio':'传播史资料'}</option>
    <option value="comparison">{eo?'Ekstera kompara materialo':'外部比对资料'}</option><option value="research_reference">{eo?'Esplora referenco':'研究参考'}</option>
  </select></label>
  <label>{eo?'Ligilo al dosiero aŭ materialo':'文件或资料链接'}<input name="fileUrl" type="url" required placeholder="https://..."/></label>
  <label>{eo?'Priskribo':'说明'}<textarea name="caption" rows={3} required minLength={3} maxLength={500}/></label>
  <label>{eo?'Fontnoto':'来源备注'}<textarea name="sourceNote" rows={3} maxLength={1000} placeholder={eo?'ekz. propra filmeto, malnova bloga bildo, skanita atestilo, ekstera kompara paĝo':'例如：本人原视频、旧博客截图、证书扫描件、外部比对页面'}/></label>
  <label>{eo?'Kopirajta/montra stato':'版权/展示状态'}<select name="copyrightStatus" defaultValue="unknown">
    <option value="unknown">{eo?'Ordigo bezonata':'待整理'}</option><option value="owned">{eo?'Propra':'自有'}</option><option value="authorized">{eo?'Rajtigita':'已授权'}</option><option value="public_domain">{eo?'Publika havaĵo':'公有领域'}</option>
  </select></label>
  <button className="button button-primary" disabled={busy}>{busy?(eo?'Konservante…':'正在保存…'):(eo?'Ligi kolektan materialon':'挂接收藏资料')}</button>
  {message&&<p className="form-message">{message}</p>}
  <p className="muted">{eo?'Diversaj materialtipoj estas aparte markitaj por konservi devenon, disvastigan historion, eksterajn komparojn kaj esplorajn referencojn. Dokumenta ordigo servas al kultura arkivado, lernado kaj ĝuado; ĝi ne estas profesia aŭtentigo.':'不同类型资料会分开标识，方便保存收藏来源、传播历史、外部比对与研究参考。资料整理服务于文化存录与学习赏玩，不等同于专业鉴定。'}</p>
 </form>;
}
