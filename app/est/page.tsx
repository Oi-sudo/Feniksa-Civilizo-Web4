import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function EstPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'EST · Esperanta Kontribua Registro':en?'EST · Esperanto Contribution Record':'EST · 世界语币 · Esperanto-Kontribua Registro'}</span>
    <h1>{eo?'EST · Esperanta Kontribua Registro':en?'EST · Esperanto Contribution Record':'EST 世界语币'}</h1>
    <p className="lead">{eo?'EST registras kontribuojn al Esperanto-lernado, edukado, tradukado kaj lingva scio. En 0.1 Alpha ĝi estas kontrolebla kontribua registro, ne publike komercebla tokeno.':en?'EST records contributions to Esperanto learning, education, translation and language knowledge. In 0.1 Alpha it is a verifiable contribution record, not a publicly tradable token.':'记录世界语学习、教育、翻译与语言知识贡献。0.1 Alpha 中它是可审核的贡献记录，不是公开交易代币。'}</p>
    <div className="card-grid">
      <div className="card"><h2>{eo?'Lernado':en?'Learning':'学习 · Lernado'}</h2><p>{eo?'Kompletigitaj kursoj, daŭra lernado kaj kontrolita-lingva trejnado povas lasi lernajn registrojn.':en?'Completed courses, ongoing learning and controlled-language training can leave learning records.':'课程完成、持续学习与受控语言训练可以留下学习记录。'}</p></div>
      <div className="card"><h2>{eo?'Tradukado':en?'Translation':'翻译 · Tradukado'}</h2><p>{eo?'Reviziitaj Esperantaj tradukoj, terminologia ordigo kaj lernomaterialaj kontribuoj povas esti registritaj.':en?'Reviewed Esperanto translations, terminology work and learning-material contributions can be recorded.':'经审校的世界语翻译、术语整理与教材贡献可以登记。'}</p></div>
      <div className="card"><h2>{eo?'Instruado':en?'Teaching':'教学 · Instruado'}</h2><p>{eo?'Esperanto-instruado, kursa preparado kaj lernsubteno povas formi kontribuan dosieron.':en?'Esperanto teaching, course preparation and learning support can form a contribution record.':'世界语教学、课程整理与学习支持可以形成贡献档案。'}</p></div>
      <div className="card"><h2>{eo?'Scio':en?'Knowledge':'知识 · Scio'}</h2><p>{eo?'Esploro, vortprovizo, kontrolita lingvo kaj civilizaj dokumentoj povas eniri la kontrolan procezon.':en?'Research, vocabulary, controlled language and civilization documents can enter the review process.':'研究、词汇、受控语言与文明文献贡献可以进入审核流程。'}</p></div>
    </div>
    <section className="card">
      <h2>{eo?'Limoj de 0.1':en?'0.1 boundaries':'0.1 边界'}</h2>
      <p>{eo?'EST ne estas komercebla, ne povas esti elpagita, ne promesas valoraltiĝon kaj ne aŭtomate donas DAD-regrajton.':en?'EST is not tradable or cashable, does not promise appreciation, and does not automatically grant DAD governance rights.':'EST 不可交易、不能提现、不承诺升值，也不自动产生 DAD 治理权。'}</p>
      <p>{eo?'La oficiala valoro estas determinata de reguloj kaj kontrolo; uzanto ne povas mem enigi rekompencan kvanton.':en?'The official value is determined by rules and review; users cannot enter their own reward amount.':'正式数值由规则与审核决定，用户不能自行填写奖励数量。'}</p>
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/courses">{eo?'Eniri la Esperantan Civilizan Universitaton':en?'Enter Esperanto Civilization University':'进入世界语文明大学'}</Link><Link className="button button-secondary" href="/login">{eo?'Ensaluti kaj vidi miajn registrojn':en?'Log in to view my records':'登录后查看个人记录'}</Link></div>
  </main>;
}
