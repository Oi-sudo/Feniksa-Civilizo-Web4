import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAssetDossier,getPublishedAsset } from '@/lib/museum/data';

const mediaLabel:Record<string,string>={
  image:'原始图片 · Originala bildo',
  video:'原始视频 · Originala video',
  document:'文献/文件 · Dokumento',
  certificate:'证书 · Atestilo',
  '3d_model':'3D模型 · 3D-modelo'
};

const localeLabel:Record<string,string>={zh:'中文展签',eo:'Esperanta etikedo',en:'English label'};

export default async function AssetPage({params}:{params:Promise<{code:string}>}){
  const {code}=await params;
  const a=await getPublishedAsset(code);
  if(!a)notFound();
  const d=await getAssetDossier(a.id);

  return <main>
    <span className="badge">{a.permanent_code}</span>
    <h1>{a.title_zh}</h1>
    <p className="lead">{a.title_eo}</p>
    {a.title_en&&<p className="muted">{a.title_en}</p>}

    <section className="card">
      <h2>一物一档 · Unu objekto, unu dosiero</h2>
      <div className="dossier-grid">
        <p><strong>主馆籍</strong><span>{a.hall_zh} · {a.hall_eo}</span></p>
        <p><strong>批次/册次</strong><span>{a.batch_code||'待登记'}</span></p>
        <p><strong>类别</strong><span>{a.category||'待登记'}</span></p>
        <p><strong>材质</strong><span>{a.material||'待登记'}</span></p>
        <p><strong>年代/时期</strong><span>{a.period_description||'待研究'}</span></p>
        <p><strong>尺寸 / 重量</strong><span>{a.dimensions||'待登记'} · {a.weight||'待登记'}</span></p>
      </div>
      <p><strong>来源记录：</strong>{a.provenance||'待补充'}</p>
      {a.current_location_note&&<p><strong>当前保管信息：</strong>{a.current_location_note}</p>}
    </section>

    <section className="card">
      <h2>状态分层 · Apartaj statusoj</h2>
      <div className="status-grid">
        <div><span>鉴定状态</span><strong>{a.authentication_level}</strong></div>
        <div><span>权属状态</span><strong>{a.ownership_status}</strong></div>
        <div><span>估值状态</span><strong>{a.valuation_status}</strong></div>
        <div><span>数字展示权</span><strong>{a.digital_rights_status}</strong></div>
      </div>
      <p className="muted">鉴定、权属、估值和数字展示权分别保存；其中任何一项都不能自动替代其他项目。</p>
    </section>

    <section className="home-section">
      <span className="eyebrow">Evidence Chain · 证据链</span>
      <h2>原始证据</h2>
      {d.media.length?<div className="record-list">{d.media.map(x=><article className="card" key={x.id}>
        <div className="record-top"><strong>{mediaLabel[x.media_type]||x.media_type}</strong><span>{x.copyright_status}</span></div>
        <p>{x.caption||'原始档案材料'}</p>
        <a href={x.file_url} target="_blank" rel="noreferrer">打开原始资料 →</a>
      </article>)}</div>:<div className="card"><p>目前尚未接入公开原始图片、视频、证书或文件。档案可以先登记，但不能因此推定缺失证据已经存在。</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Trilingual Exhibition · 三语展签</span>
      <h2>中 · Esperanto · English</h2>
      {d.labels.length?<div className="record-list">{d.labels.map(x=><article className="card exhibition-text" key={x.id}>
        <div className="record-top"><strong>{localeLabel[x.locale]||x.locale}</strong><span>v{x.version}</span></div>
        {x.short_label&&<h3>{x.short_label}</h3>}
        <p>{x.exhibition_text}</p>
      </article>)}</div>:<div className="card"><p>正式三语展签尚待审校发布。</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Research · Esploro</span>
      <h2>研究意见</h2>
      {d.research.length?<div className="record-list">{d.research.map(x=><article className="card" key={x.id}>
        <div className="record-top"><strong>{x.note_type}</strong><span>{new Date(x.created_at).toLocaleDateString('zh-CN')}</span></div>
        <p>{x.content}</p>
        {x.source_reference&&<p className="muted">来源：{x.source_reference}</p>}
        {x.author_name&&<small>记录者：{x.author_name}</small>}
      </article>)}</div>:<div className="card"><p>目前没有已发布的专业研究意见。研究结论与馆藏登记名称分开保存。</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Version History · Versioj</span>
      <h2>版本历史</h2>
      {d.versions.length?<div className="timeline">{d.versions.map(x=><div className="timeline-item" key={x.id}>
        <strong>v{x.version_number}</strong><div><p>{x.change_summary}</p><small>{new Date(x.created_at).toLocaleDateString('zh-CN')}{x.changed_by_name?` · ${x.changed_by_name}`:''}</small></div>
      </div>)}</div>:<div className="card"><p>尚无公开版本记录。</p></div>}
    </section>

    <section className="card">
      <h2>档案原则 · Principo de dosiero</h2>
      <p>馆藏登记名称不等于权威鉴定结论；原始证据先于策展解释；数字展示不改变实物产权；估值状态与鉴定状态分别保存；不同研究意见可以并存并留下版本记录。</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-secondary" href="/museum">返回数字博物馆</Link>
      <Link className="button button-secondary" href="/wfb">WFB 五佛币说明</Link>
    </div>
  </main>;
}
