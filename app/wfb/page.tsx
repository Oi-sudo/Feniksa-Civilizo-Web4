import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function WfbPage(){
 const eo=(await getLocale())==='eo';
 return <main>
  <span className="badge">WFB · 五佛币 · Kvin-Budha Registro</span><h1>{eo?'WFB · Kvin-Budha Registro':'WFB 五佛币'}</h1>
  <p className="lead">{eo?'En la fazo 0.1 Alpha, WFB estas registra tavolo por personaj kolektaĵoj, kultura memoro, la cifereca muzeo kaj publika subteno. Ĝi ne estas publike komercebla tokeno.':'0.1 Alpha 阶段，WFB 是个人收藏、文化记忆、数字博物馆与公共支持的登记层，不是公开交易代币。'}</p>
  <div className="card-grid">
   <div className="card"><h2>{eo?'Unu objekto, unu dosiero':'一物一档'}</h2><p>Unu objekto, unu dosiero</p><p>{eo?'Ĉiu persona kolektaĵo aŭ kultura materialo ricevas konstantan kodon, ĉefan halon, kolektan registron kaj pliriĉigeblan dokumentaron.':'每件个人收藏或文化资料建立永久编号、主馆籍、收藏记录与可续补资料。'}</p></div>
   <div className="card"><h2>{eo?'Dokumentaj tavoloj':'资料分层'}</h2><p>Kolekta registro · Posedo · Dosiero</p><p>{eo?'Kolekta registro, posedrajto, dokumentaj notoj kaj cifereca montrorajto estas konservataj aparte por kultura arkivado kaj lernado.':'收藏记录、产权、资料说明与数字展示权分别保存，用于文化存录与学习展示。'}</p></div>
   <div className="card"><h2>{eo?'Cifereca muzeo':'数字博物馆'}</h2><p>Cifereca muzeo</p><p>{eo?'Ordigita dokumentaro povas eniri la publikan katalogon de la naŭ haloj kun konservita versiohistorio.':'整理后的档案进入九馆公开目录，并保留版本历史。'}</p></div>
   <div className="card"><h2>{eo?'Publika subteno':'公共支持'}</h2><p>Publika subteno</p><p>{eo?'Publika kultura subteno povas esti registrata, sed ĝi ne aŭtomate fariĝas investo, akcio aŭ rajto je rendimento.':'公共文化支持可以登记，但不自动变成投资、股权或收益权。'}</p></div>
  </div>
  <section className="card"><h2>{eo?'0.1 registra vojo':'0.1 登记链'}</h2><p>{eo?'Objekto/dokumento → unu objekto, unu dosiero → kolektaj materialoj → ĉefa halo → dokumenta ordigo → publika montrado → versiohistorio.':'实物/文献 → 建立一物一档 → 收藏资料 → 主馆籍 → 资料整理 → 公开展陈 → 版本留痕。'}</p></section>
  <section className="card"><h2>{eo?'Limoj de 0.1':'0.1 边界'}</h2><p>{eo?'Neniu Token-eldono, neniu monujo, neniu interŝanĝo, neniu promeso pri valoraltiĝo, kaj neniu aŭtomata ligo al NFT/RWA-merkato. Se estonte iu objekto eniros RWA-procezon, posedrajto, profesia aŭtentigo, taksado, gardado, asekuro kaj jura revizio devos esti traktataj aparte; tiuj postuloj ne estas antaŭkondiĉo por la nuna cifereca kultura montrado.':'不发行 Token，不建立钱包，不提供兑换，不承诺升值，不自动连接 NFT / RWA 市场。未来如进入 RWA，必须另行完成权属、专业鉴定、估值、托管、保险与法律审查；这些要求不作为当前数字赏玩展示的前提。'}</p></section>
  <div className="hero-actions"><Link className="button button-primary" href="/wfb/intake">{eo?'Registri kolektan materialon':'登记收藏资料'}</Link><Link className="button button-secondary" href="/museum">{eo?'Eniri la Ciferecan Muzeon':'进入数字博物馆'}</Link><Link className="button button-secondary" href="/museum/about">{eo?'Pri kolektoj kaj cifereca ĝuado':'收藏与赏玩说明'}</Link><Link className="button button-secondary" href="/dual-wing">{eo?'Vidi la du-flugilan arkitekturon':'查看双翼架构'}</Link></div>
 </main>;
}
