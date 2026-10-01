import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAssetDossier,getPublishedAsset } from '@/lib/museum/data';

const evidenceLabel:Record<string,string>={original:'原始收藏资料',publication_history:'传播史资料',comparison:'外部比对资料',research_reference:'研究参考'};
const mediaLabel:Record<string,string>={
  image:'收藏图片 · Kolekta bildo',
  video:'收藏视频 · Kolekta video',
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
    <span className="badge">{a.catalog_code||a.permanent_code}</span>
    <h1>{a.title_zh}</h1>
    <p className="lead">{a.title_eo}</p>
    {a.title_en&&<p className="muted">{a.title_en}</p>}

    <section className="card">
      <h2>一物一档 · Unu objekto, unu dosiero</h2>
      <div className="dossier-grid">
        <p><strong>主馆籍</strong><span>{a.hall_zh} · {a.hall_eo}</span></p>
        <p><strong>分册编号</strong><span>{a.catalog_code||'未编入冻结分册'}</span></p>
        <p><strong>登记册</strong><span>{a.catalog_volume||'独立登记'}</span></p>
        <p><strong>批次/册次</strong><span>{a.batch_code||'未单列'}</span></p>
        <p><strong>类别</strong><span>{a.category||'未单列'}</span></p>
        <p><strong>材质</strong><span>{a.material||'依现有收藏记录'}</span></p>
        <p><strong>年代/时期</strong><span>{a.period_description||'依现有收藏记录'}</span></p>
        <p><strong>尺寸 / 重量</strong><span>{a.dimensions||'未单列'} · {a.weight||'未单列'}</span></p>
      </div>
      <p><strong>来源记录：</strong>{a.provenance||'依现有收藏记录'}</p>
      {a.catalog_source_note&&<p className="muted"><strong>书册来源说明：</strong>{a.catalog_source_note}</p>}
      {a.related_display_note&&<p className="muted"><strong>关联展示：</strong>{a.related_display_note}</p>}
      {a.current_location_note&&<p><strong>当前保管信息：</strong>{a.current_location_note}</p>}
    </section>

    <section className="card">
      <h2>收藏与赏玩说明 · Kolekta dosiero</h2>
      <p>本页以个人收藏、文化记忆、文明学习与数字赏玩方式呈现。现有名称与说明依据收藏记录、照片、视频和既有资料保存，便于阅读、欣赏与长期存录。</p>
      <p className="muted">专业鉴定、市场估值与交易证明不属于本页的展示目的；如未来另有专业资料，可作为新的档案版本补充。</p>
    </section>

    <section className="home-section">
      <span className="eyebrow">Collection Archive · 收藏资料</span>
      <h2>收藏资料与文化记忆</h2>
      {d.media.length?<div className="record-list">{d.media.map(x=><article className="card" key={x.id}>
        <div className="record-top"><strong>{mediaLabel[x.media_type]||x.media_type}</strong><span>{evidenceLabel[x.evidence_role]||x.evidence_role}</span></div>
        <p>{x.caption||'档案材料'}</p>{x.source_note&&<p className="muted">来源备注：{x.source_note}</p>}
        <a href={x.file_url} target="_blank" rel="noreferrer">打开收藏资料 →</a>
      </article>)}</div>:<div className="card"><p>目前尚未接入更多公开图片、视频、证书或文件；数字档案可随收藏资料逐步丰富。</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Trilingual Exhibition · 三语展签</span>
      <h2>中 · Esperanto · English</h2>
      {d.labels.length?<div className="record-list">{d.labels.map(x=><article className="card exhibition-text" key={x.id}>
        <div className="record-top"><strong>{localeLabel[x.locale]||x.locale}</strong><span>v{x.version}</span></div>
        {x.short_label&&<h3>{x.short_label}</h3>}
        <p>{x.exhibition_text}</p>
      </article>)}</div>:<div className="card"><p>三语展签可随资料整理继续补充。</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Research · Esploro</span>
      <h2>研究意见</h2>
      {d.research.length?<div className="record-list">{d.research.map(x=><article className="card" key={x.id}>
        <div className="record-top"><strong>{x.note_type}</strong><span>{new Date(x.created_at).toLocaleDateString('zh-CN')}</span></div>
        <p>{x.content}</p>
        {x.source_reference&&<p className="muted">来源：{x.source_reference}</p>}
        {x.author_name&&<small>记录者：{x.author_name}</small>}
      </article>)}</div>:<div className="card"><p>目前没有另外发布的研究说明；馆藏名称主要用于个人收藏、文化记忆与数字赏玩存录。</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Version History · Versioj</span>
      <h2>版本历史</h2>
      {d.versions.length?<div className="timeline">{d.versions.map(x=><div className="timeline-item" key={x.id}>
        <strong>v{x.version_number}</strong><div><p>{x.change_summary}</p><small>{new Date(x.created_at).toLocaleDateString('zh-CN')}{x.changed_by_name?` · ${x.changed_by_name}`:''}</small></div>
      </div>)}</div>:<div className="card"><p>当前没有另外的公开版本记录。</p></div>}
    </section>

    <section className="card">
      <h2>档案原则 · Principo de dosiero</h2>
      <p>本馆以个人收藏、文化记忆与数字赏玩为定位。名称、年代、材质与来源等依据现有收藏记录、照片、视频及既有资料存录，不作为专业鉴定、市场估值或交易证明。数字展示不改变实物产权；不同资料与研究意见可以并存并留下版本记录。存录求真，不强定论。</p>
    </section>

    <div className="hero-actions">
      <Link className="button button-secondary" href="/museum">返回数字博物馆</Link>
      <Link className="button button-secondary" href="/wfb">WFB 五佛币说明</Link>
    </div>
  </main>;
}
