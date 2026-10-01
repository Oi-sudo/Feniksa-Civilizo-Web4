import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from '@/lib/i18n';
import { getAssetDossier,getPublishedAsset } from '@/lib/museum/data';

const mediaLabelZh:Record<string,string>={image:'收藏图片',video:'收藏视频',document:'文献/文件',certificate:'证书','3d_model':'3D模型'};
const mediaLabelEo:Record<string,string>={image:'Kolekta bildo',video:'Kolekta filmeto',document:'Dokumento',certificate:'Atestilo','3d_model':'3D-modelo'};
const evidenceZh:Record<string,string>={original:'原始收藏资料',publication_history:'传播史资料',comparison:'外部比对资料',research_reference:'研究参考'};
const researchZh:Record<string,string>={catalog_note:'编目说明',provenance_note:'来源说明',comparison_note:'比对说明',research_note:'研究意见',curatorial_note:'策展说明'};
const researchEo:Record<string,string>={catalog_note:'Kataloga noto',provenance_note:'Devena noto',comparison_note:'Kompara noto',research_note:'Esplora noto',curatorial_note:'Kuratora noto'};
const evidenceEo:Record<string,string>={original:'Origina kolekta materialo',publication_history:'Materialo pri disvastiga historio',comparison:'Ekstera kompara materialo',research_reference:'Esplora referenco'};

export default async function AssetPage({params}:{params:Promise<{code:string}>}){
  const eo=(await getLocale())==='eo';
  const {code}=await params;
  const a=await getPublishedAsset(code);
  if(!a)notFound();
  const d=await getAssetDossier(a.id);

  return <main>
    <span className="badge">{a.catalog_code||a.permanent_code}</span>
    <h1>{eo?(a.title_eo||a.title_zh):a.title_zh}</h1>
    {!eo&&<p className="lead">{a.title_eo}</p>}
    {a.title_en&&<p className="muted">{a.title_en}</p>}

    <section className="card">
      <h2>{eo?'Unu objekto, unu dosiero':'一物一档 · Unu objekto, unu dosiero'}</h2>
      <div className="dossier-grid">
        <p><strong>{eo?'Ĉefa halo':'主馆籍'}</strong><span>{eo?(a.hall_eo||a.hall_zh):(a.hall_zh+' · '+(a.hall_eo||''))}</span></p>
        <p><strong>{eo?'Kataloga kodo':'分册编号'}</strong><span>{a.catalog_code||(eo?'Ne en fiksita volumo':'未编入冻结分册')}</span></p>
        <p><strong>{eo?'Katalogo':'登记册'}</strong><span>{a.catalog_volume||(eo?'Memstara registro':'独立登记')}</span></p>
        <p><strong>{eo?'Aro/volumo':'批次/册次'}</strong><span>{a.batch_code||(eo?'Ne aparte indikita':'未单列')}</span></p>
        <p><strong>{eo?'Kategorio':'类别'}</strong><span>{a.category||(eo?'Ne aparte indikita':'未单列')}</span></p>
        <p><strong>{eo?'Materialo':'材质'}</strong><span>{a.material||(eo?'Laŭ ekzistantaj kolektaj registroj':'依现有收藏记录')}</span></p>
        <p><strong>{eo?'Periodo':'年代/时期'}</strong><span>{a.period_description||(eo?'Laŭ ekzistantaj kolektaj registroj':'依现有收藏记录')}</span></p>
        <p><strong>{eo?'Dimensioj / pezo':'尺寸 / 重量'}</strong><span>{a.dimensions||(eo?'Ne aparte indikita':'未单列')} · {a.weight||(eo?'Ne aparte indikita':'未单列')}</span></p>
      </div>
      <p><strong>{eo?'Devena noto:':'来源记录：'}</strong>{a.provenance||(eo?'Laŭ ekzistantaj kolektaj registroj':'依现有收藏记录')}</p>
    </section>

    <section className="card">
      <h2>{eo?'Kolekta dosiero kaj cifereca ĝuado':'收藏与赏玩说明 · Kolekta dosiero'}</h2>
      <p>{eo?'Ĉi tiu paĝo prezentas personan kolektaĵon kiel kulturan memoron, lernan materialon kaj ciferecan ĝuadon. La nunaj nomoj kaj priskriboj estas konservataj laŭ kolektaj registroj, fotoj, filmetoj kaj ekzistantaj dokumentoj.':'本页以个人收藏、文化记忆、文明学习与数字赏玩方式呈现。现有名称与说明依据收藏记录、照片、视频和既有资料保存，便于阅读、欣赏与长期存录。'}</p>
      <p className="muted">{eo?'Profesia aŭtentigo, merkata takso kaj komerca atesto ne estas la celo de ĉi tiu paĝo. Estontaj profesiaj materialoj povas esti aldonitaj kiel nova dosiera versio.':'专业鉴定、市场估值与交易证明不属于本页的展示目的；如未来另有专业资料，可作为新的档案版本补充。'}</p>
    </section>

    <section className="home-section">
      <span className="eyebrow">Collection Archive</span>
      <h2>{eo?'Kolektaj materialoj kaj kultura memoro':'收藏资料与文化记忆'}</h2>
      {d.media.length?<div className="record-list">{d.media.map(x=><article className="card" key={x.id}>
        <div className="record-top"><strong>{(eo?mediaLabelEo:mediaLabelZh)[x.media_type]||x.media_type}</strong><span>{(eo?evidenceEo:evidenceZh)[x.evidence_role]||x.evidence_role}</span></div>
        <p>{x.caption||(eo?'Arkiva materialo':'档案材料')}</p>{x.source_note&&<p className="muted">{eo?'Fontnoto: ':'来源备注：'}{x.source_note}</p>}
        <a href={x.file_url} target="_blank" rel="noreferrer">{eo?'Malfermi la kolektan materialon →':'打开收藏资料 →'}</a>
      </article>)}</div>:<div className="card"><p>{eo?'Ankoraŭ ne estas pli da publikaj bildoj, filmetoj, atestiloj aŭ dokumentoj. La cifereca dosiero povas iom post iom pliriĉiĝi.':'目前尚未接入更多公开图片、视频、证书或文件；数字档案可随收藏资料逐步丰富。'}</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Trilingual Exhibition</span>
      <h2>{eo?'Ekspoziciaj tekstoj en tri lingvoj':'中 · Esperanto · English'}</h2>
      {d.labels.length?<div className="record-list">{d.labels.map(x=><article className="card exhibition-text" key={x.id}>
        <div className="record-top"><strong>{x.locale==='eo'?'Esperanta etikedo':x.locale==='zh'?'中文展签':'English label'}</strong><span>v{x.version}</span></div>
        {x.short_label&&<h3>{x.short_label}</h3>}<p>{x.exhibition_text}</p>
      </article>)}</div>:<div className="card"><p>{eo?'La trilingvaj etikedoj povas esti aldonataj dum la dokumentaro pliriĉiĝas.':'三语展签可随资料整理继续补充。'}</p></div>}
    </section>

    <section className="home-section">
      <span className="eyebrow">Research · Esploro</span>
      <h2>{eo?'Esploraj notoj':'研究意见'}</h2>
      {d.research.length?<div className="record-list">{d.research.map(x=><article className="card" key={x.id}><div className="record-top"><strong>{(eo?researchEo:researchZh)[x.note_type]||x.note_type}</strong><span>{new Date(x.created_at).toLocaleDateString(eo?'eo':'zh-CN')}</span></div><p>{x.content}</p>{x.source_reference&&<p className="muted">{eo?'Fonto: ':'来源：'}{x.source_reference}</p>}</article>)}</div>:<div className="card"><p>{eo?'Nun ne estas aparte publikigitaj esploraj notoj; la registrita nomo servas ĉefe al persona kolektado, kultura memoro kaj cifereca ĝuado.':'目前没有另外发布的研究说明；馆藏名称主要用于个人收藏、文化记忆与数字赏玩存录。'}</p></div>}
    </section>

    <section className="card">
      <h2>{eo?'Principo de la dosiero':'档案原则 · Principo de dosiero'}</h2>
      <p>{eo?'La muzeo celas personajn kolektaĵojn, kulturan memoron kaj ciferecan ĝuadon. Nomoj, periodoj, materialoj kaj devenaj notoj estas konservataj laŭ ekzistantaj kolektaj registroj, fotoj, filmetoj kaj dokumentoj. Ili ne estas profesia aŭtentigo, merkata takso aŭ komerca atesto. Cifereca montrado ne ŝanĝas posedrajton; malsamaj fontoj kaj esploraj opinioj povas kunekzisti kun konservita versiohistorio. Registri por serĉi veron, ne trudi finan konkludon.':'本馆以个人收藏、文化记忆与数字赏玩为定位。名称、年代、材质与来源等依据现有收藏记录、照片、视频及既有资料存录，不作为专业鉴定、市场估值或交易证明。数字展示不改变实物产权；不同资料与研究意见可以并存并留下版本记录。存录求真，不强定论。'}</p>
    </section>

    <div className="hero-actions"><Link className="button button-secondary" href="/museum">{eo?'Reveni al la Cifereca Muzeo':'返回数字博物馆'}</Link><Link className="button button-secondary" href="/wfb">{eo?'Pri WFB':'WFB 五佛币说明'}</Link></div>
  </main>;
}
