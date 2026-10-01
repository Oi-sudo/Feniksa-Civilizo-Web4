'use client';
import { FormEvent,useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EvidenceLinkForm({assetId}:{assetId:string}){
 const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const router=useRouter();
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault(); setBusy(true); setMessage('');
  const f=new FormData(e.currentTarget);
  const r=await fetch('/api/museum/evidence',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({
    assetId,mediaType:f.get('mediaType'),evidenceRole:f.get('evidenceRole'),fileUrl:f.get('fileUrl'),
    caption:f.get('caption'),sourceNote:f.get('sourceNote'),copyrightStatus:f.get('copyrightStatus')
  })});
  const data=await r.json(); setBusy(false);
  if(!r.ok){setMessage(data.error||'保存失败');return;}
  setMessage('证据附件已挂接。'); e.currentTarget.reset(); router.refresh();
 }
 return <form className="auth-form" onSubmit={submit}>
  <label>附件类型<select name="mediaType" defaultValue="image">
    <option value="image">图片</option><option value="video">视频</option><option value="document">文献/文件</option>
    <option value="certificate">证书</option><option value="3d_model">3D 模型</option>
  </select></label>
  <label>证据角色<select name="evidenceRole" defaultValue="original">
    <option value="original">原始证据</option><option value="publication_history">传播史证据</option>
    <option value="comparison">外部比对资料</option><option value="research_reference">研究参考</option>
  </select></label>
  <label>文件或资料链接<input name="fileUrl" type="url" required placeholder="https://..."/></label>
  <label>说明<textarea name="caption" rows={3} required minLength={3} maxLength={500}/></label>
  <label>来源备注<textarea name="sourceNote" rows={3} maxLength={1000} placeholder="例如：本人原视频、旧博客截图、证书扫描件、外部比对页面"/></label>
  <label>版权/展示状态<select name="copyrightStatus" defaultValue="unknown">
    <option value="unknown">待核</option><option value="owned">自有</option><option value="authorized">已授权</option><option value="public_domain">公有领域</option>
  </select></label>
  <button className="button button-primary" disabled={busy}>{busy?'正在保存…':'挂接证据附件'}</button>
  {message&&<p className="form-message">{message}</p>}
  <p className="muted">挂接证据不会自动提高鉴定等级。网络截图、外部比对图和研究参考会单独标识，不能冒充原始鉴定证明。</p>
 </form>;
}
