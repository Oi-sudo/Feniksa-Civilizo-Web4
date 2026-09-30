import Link from 'next/link';
import { getMessages } from '@/lib/i18n';

const halls=[
  ['西北','西方科技文明大学','Okcidenta Scienca Civilizo'],
  ['正北','凤凰网络 Web4 文明大学','Feniksa Web4'],
  ['东北','佛法修学馆','Budhisma Studhalo'],
  ['正西','礼物与藏品馆','Donacoj kaj Kolektaĵoj'],
  ['中宫','中央佛堂','Centra Budha Halo'],
  ['正东','东方智慧文明大学','Orienta Saĝeco'],
  ['西南','博物馆文明大学','Muzea Civilizo'],
  ['正南','凤凰文明馆','Feniksa Civilizo'],
  ['东南','世界语文明大学','Esperanta Civilizo']
];

export default async function MuseumPage(){
  const m=await getMessages();
  return <main>
    <span className="badge">{m.museum_badge}</span>
    <h1>{m.museum_title}</h1>
    <p className="lead">{m.museum_intro}</p>
    <section className="card">
      <h2>{m.museum_nine_halls}</h2>
      <p>{m.museum_main_hall_rule}</p>
      <p>{m.museum_integrity_note}</p>
    </section>
    <div className="card-grid">
      {halls.map(([pos,zh,eo])=><div className="card" key={zh}><span className="eyebrow">{pos}</span><h2>{zh}</h2><p>{eo}</p></div>)}
    </div>
    <section className="card">
      <h2>馆藏原则 · Muzea principo</h2>
      <p>一物一档；证据先于解释；登记名称不等于鉴定结论；数字展示不改变实物产权。</p>
    </section>
    <div className="hero-actions"><Link className="button button-primary" href="/wfb">WFB 五佛币登记说明</Link><a className="button button-secondary" href="https://feniksa-civilizacio-web4.netlify.app/" target="_blank" rel="noreferrer">旧站双语馆藏内容</a></div>
  </main>;
}
