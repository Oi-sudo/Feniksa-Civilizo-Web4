import Link from 'next/link'; import { notFound } from 'next/navigation'; import { getPublishedAsset } from '@/lib/museum/data';

export default async function AssetPage({params}:{params:Promise<{code:string}>}){
 const {code}=await params; const a=await getPublishedAsset(code); if(!a)notFound();
 return <main>
  <span className="badge">{a.permanent_code}</span><h1>{a.title_zh}</h1><p className="lead">{a.title_eo}</p>
  <section className="card"><h2>一物一档 · Unu objekto, unu dosiero</h2>
   <p><strong>主馆籍：</strong>{a.hall_zh} · {a.hall_eo}</p><p><strong>类别：</strong>{a.category||'待登记'}</p><p><strong>材质：</strong>{a.material||'待登记'}</p>
   <p><strong>年代/时期：</strong>{a.period_description||'待研究'}</p><p><strong>尺寸：</strong>{a.dimensions||'待登记'} · <strong>重量：</strong>{a.weight||'待登记'}</p>
   <p><strong>来源：</strong>{a.provenance||'待补充'}</p>
  </section>
  <section className="card"><h2>状态分层</h2>
   <p>鉴定状态：<strong>{a.authentication_level}</strong></p><p>权属状态：<strong>{a.ownership_status}</strong></p><p>估值状态：<strong>{a.valuation_status}</strong></p><p>数字展示权：<strong>{a.digital_rights_status}</strong></p>
  </section>
  <section className="card"><h2>档案说明</h2><p>馆藏登记名称不等于权威鉴定结论；数字展示不改变实物产权；估值状态与鉴定状态分别保存。</p></section>
  <Link className="button button-secondary" href="/museum">返回数字博物馆</Link>
 </main>;
}
