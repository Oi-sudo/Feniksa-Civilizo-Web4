import Link from 'next/link';
import { getLocale } from '@/lib/i18n';

export default async function BudPage(){
  const locale=await getLocale(); const eo=locale==='eo'; const en=locale==='en';
  return <main>
    <span className="badge">{eo?'BUD · Vola-Agada Registro':en?'BUD · Vow-and-Action Record':'BUD · 佛光币 · Vola-Agada Registro'}</span>
    <h1>{eo?'BUD · Vola-Agada Registro':en?'BUD · Vow-and-Action Record':'BUD 佛光币'}</h1>
    <p className="lead">{eo?'BUD registras volan agadon, volontulan servon kaj kontribuojn al publika servo. Agado povas lasi spuron, sed ĝi ne estas vendebla.':en?'BUD records vow-in-action, volunteer service and public-service contributions. Action can leave a record, but it cannot be sold.':'记录愿行、志愿服务与公共服务贡献。愿行可以留痕，但愿行不能出售。'}</p>
    <div className="card-grid">
      <div className="card"><h2>{eo?'Volontula servo':en?'Volunteer service':'志愿服务 · Volontula servo'}</h2><p>{eo?'Servo al kursoj, komunumoj, muzeaj kolektaĵoj, maljunuloj kaj publikaj projektoj.':en?'Service for courses, communities, museum collections, elders and public projects.':'为课程、社群、馆藏、长者与公共项目提供服务。'}</p></div>
      <div className="card"><h2>{eo?'Projekta kunlaboro':en?'Project collaboration':'项目协作 · Projekta kunlaboro'}</h2><p>{eo?'Partopreni registritajn projektojn, porti respondecon kaj lasi kontroleblajn rezultojn.':en?'Participate in registered projects, carry responsibility and leave verifiable results.':'参与已登记项目、承担责任并留下可核查成果。'}</p></div>
      <div className="card"><h2>{eo?'Publika bono':en?'Public good':'公共善行 · Publika bono'}</h2><p>{eo?'Servo por la publika bono povas registri tempon, klarigon kaj rilatajn materialojn.':en?'Service for the public good can record time, explanation and supporting materials.':'面向公共利益的服务可以记录时间、说明和证据。'}</p></div>
      <div className="card"><h2>{eo?'Dosiero de vola agado':en?'Vow-and-action record':'愿行档案 · Vola agado'}</h2><p>{eo?'Registri agojn sen interpreti nombrojn kiel homan valoron aŭ budhisman atingon.':en?'Record actions without interpreting numbers as human value or Buddhist attainment.':'记录行动，不把数字解释为人格价值或佛法修证等级。'}</p></div>
    </div>
    <section className="card"><h2>{eo?'0.1 kontrola vojo':en?'0.1 review flow':'0.1 审核链'}</h2><p>{eo?'Servo okazas → faktoj kaj materialoj estas senditaj → projekta konfirmo (se aplikebla) → administra kontrolo → la servilo kalkulas BUD laŭ la reguloj → la registro eniras la lernan pasporton.':en?'Service occurs → facts and materials are submitted → project confirmation when applicable → administrative review → the server calculates BUD under the rules → the record enters the learning passport.':'服务发生 → 提交事实与证据 → 项目确认（如适用）→ 管理审核 → 服务器按规则计算 BUD → 写入学习护照。'}</p><p>{eo?'Uzantoj ne povas mem enigi BUD-valoron; projektgvidanto ne povas konfirmi sian propran servoregistron.':en?'Users cannot enter their own BUD value, and a project lead cannot confirm their own service record.':'用户不能自行填写 BUD 数值；项目负责人不能确认自己的服务记录。'}</p></section>
    <section className="card"><h2>{eo?'Limoj de 0.1':en?'0.1 boundaries':'0.1 边界'}</h2><p>{eo?'BUD ne estas aĉetebla aŭ vendebla, ne povas esti elpagita, ne estas kvantigo de merito, ne atestas religian atingon kaj ne aŭtomate donas regrajton.':en?'BUD cannot be bought, sold or cashed out; it is not a quantification of merit, does not certify religious attainment, and does not automatically grant governance rights.':'BUD 不可买卖、不能提现、不等于功德定量，不认证宗教果位，也不自动产生治理权。'}</p></section>
    <div className="hero-actions"><Link className="button button-primary" href="/bud/submit">{eo?'Sendi servoregistron':en?'Submit service record':'提交服务记录'}</Link><Link className="button button-secondary" href="/passport/bud">{eo?'Vidi mian BUD':en?'View my BUD':'查看我的 BUD'}</Link><Link className="button button-secondary" href="/projects">{eo?'Vidi projektan plenumadon':en?'View project execution':'查看项目执行'}</Link></div>
  </main>;
}
