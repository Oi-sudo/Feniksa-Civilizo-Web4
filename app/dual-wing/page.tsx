import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function DualWingPage(){
  const eo=(await getLocale())==='eo';
  return <main>
    <span className="badge">{eo?'Du Flugiloj':'双翼并行 · Du Flugiloj'}</span>
    <h1>{eo?'Du-flugila paralela arkitekturo de Feniksa Civilizo':'凤凰文明双站并行架构'}</h1>
    <p className="lead">{eo?'La malnova retejo konservas la jam formitan dulingvan civilizan enhavon; la nova retejo konstruas dinamikan Web4-sistemon kun ensaluto, registroj kaj regado.':'旧站保存已经形成的双语文明内容；新站建设可登录、可记录、可治理的 Web4 动态系统。'}</p>
    <div className="card-grid">
      <div className="card">
        <span className="eyebrow">{eo?'Malnova retejo':'左翼 · Malnova Retejo'}</span>
        <h2>{eo?'Netlify dulingva publika retejo':'Netlify 双语公开站'}</h2>
        <p>{eo?'Ĝi daŭre portas civilizajn dokumentojn, dulingvajn paĝojn, jam ekzistantajn kolektajn prezentojn kaj publikan komunikadon.':'继续承担文明文献、双语页面、既有馆藏介绍和公开传播。'}</p>
        <a className="button button-primary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">{eo?'Malfermi la malnovan retejon':'打开旧站'}</a>
      </div>
      <div className="card">
        <span className="eyebrow">{eo?'Nova flugilo · Web4 Alpha':'右翼 · Web4 Alpha'}</span>
        <h2>{eo?'Render dinamika sistemo':'Render 动态系统'}</h2>
        <p>{eo?'Ĝi portas la lernopasporton, EST-registrojn, BUD-registrojn, WFB-kulturhavaĵajn registrojn, DAD, projektojn kaj revizion.':'承载学习护照、EST世界语币记录、BUD佛光币记录、WFB五佛币文化资产登记、DAD、项目与审计。'}</p>
        <Link className="button button-secondary" href="/">{eo?'Eniri la novan retejon':'进入新站'}</Link>
      </div>
    </div>
    <section className="card">
      <h2>{eo?'Fiksaj difinoj de la tri registroj en 0.1 Alpha':'三币在 0.1 Alpha 的固定定义'}</h2>
      <p><strong>EST：</strong>{eo?'registro pri Esperanto-lernado, edukado, tradukado kaj lingvaj scikontribuoj.':'记录世界语学习、教育、翻译与语言知识贡献。'}</p>
      <p><strong>BUD：</strong>{eo?'registro pri vola agado, volontula servo kaj publika servokontribuo.':'记录愿行、志愿服务与公共服务贡献。'}</p>
      <p><strong>WFB：</strong>{eo?'registro pri kulturhavaĵoj, la cifereca muzeo kaj publika subteno. Eventuala estonta RWA-interfaco bezonos apartan traktadon pri posedrajto, profesia aŭtentigo, taksado, gardado kaj jura revizio.':'记录文化资产、数字博物馆与公共支持；未来 RWA 接口必须另行经过权属、鉴定、估值、托管与法律审查。'}</p>
      <p className="muted">{eo?'En 0.1 neniu el la tri ofertas publikan komercon, monujon, interŝanĝon aŭ promeson pri investa rendimento.':'0.1阶段三者均不提供公开交易、钱包、兑换或投资收益承诺。'}</p>
    </section>
  </main>;
}
